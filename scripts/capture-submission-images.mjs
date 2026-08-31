import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const targetUrl = process.env.LANDER5_URL || 'https://newyorkdev.github.io/lander5-webmcp/';
const outputDirectory = new URL('../docs/images/', import.meta.url);
const debugPort = 9334;
const profile = await mkdtemp(join(tmpdir(), 'lander5-screenshots-'));

await mkdir(outputDirectory, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--window-size=1440,1000',
  `${targetUrl}?capture=submission`,
], { stdio: 'ignore' });

let socket;
let messageId = 0;
const pending = new Map();

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function findPageTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json`).then((response) => response.json());
      const target = targets.find((candidate) => candidate.type === 'page' && candidate.url.startsWith(targetUrl));
      if (target) return target;
    } catch {
      // Chrome may need a moment to expose its debugging endpoint.
    }
    await delay(100);
  }
  throw new Error('Chrome did not expose the Lander 5 page');
}

function send(method, params = {}) {
  messageId += 1;
  const id = messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Browser evaluation failed');
  return response.result.value;
}

async function waitFor(expression, label) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await evaluate(expression)) return;
    await delay(100);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function capture(filename) {
  await delay(150);
  const response = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(new URL(filename, outputDirectory), Buffer.from(response.data, 'base64'));
}

try {
  const target = await findPageTarget();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id || !pending.has(message.id)) return;
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await waitFor('Boolean(window.__LANDER5_BENCHMARK__)', 'the booking engine');

  await evaluate('window.scrollTo(0, 0)');
  await capture('01-lander5-agent-ready.png');

  const scenario = {
    firstName: 'Health', phone: '3475952059', zipCode: '34638', contactPreference: 'text', discoverySource: 'google',
    cleaningType: 'standard', frequency: 'one-time', squareFeet: 1400, bedrooms: 3, bathrooms: 2, stories: 'one',
    pets: false, blinds: false, flooringTypes: ['tile', 'hardwood'], ceilingFanHeight: 9,
    kitchenSurfaceReadiness: 'clear', bathroomSurfaceReadiness: 'clear', accessibleSurfaces: true,
    cleaningScope: 'entire', condition: 'fair', dustLevel: 'medium', occupants: 2,
    lastProfessionalCleaning: '3-6-months', heavyCleaning: false, extraWindowCount: 5, addOns: [],
  };
  await evaluate(`(() => {
    const bridge = window.__LANDER5_BENCHMARK__;
    bridge.invoke('get_booking_context');
    bridge.invoke('set_cleaning_request', ${JSON.stringify(scenario)});
    bridge.invoke('calculate_quote');
    const slots = bridge.invoke('find_available_slots', { limit: 4 }).slots;
    bridge.invoke('select_tentative_slot', { slotId: slots[0].id });
    bridge.invoke('prepare_booking_review');
  })()`);
  await waitFor("Boolean(document.querySelector('.review-card'))", 'the visible review');
  await evaluate("document.querySelector('.review-card').scrollIntoView({ block: 'start' }); window.scrollBy(0, -20)");
  await capture('02-lander5-human-approval.png');

  await evaluate("document.querySelector('button.approve').click()");
  await waitFor("Boolean(document.querySelector('.approved'))", 'customer approval');
  await evaluate("window.__LANDER5_BENCHMARK__.invoke('request_reservation', { confirmed: true })");
  await waitFor("Boolean(document.querySelector('.success'))", 'sandbox result');
  await waitFor("!document.querySelector('.toast.visible')", 'the approval notification to clear');
  await evaluate("document.querySelector('.success').scrollIntoView({ block: 'center' })");
  await capture('03-lander5-sandbox-result.png');

  console.log('Created three submission screenshots in docs/images/.');
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  chrome.kill('SIGTERM');
  await new Promise((resolve) => chrome.once('exit', resolve));
  await rm(profile, { recursive: true, force: true });
}
