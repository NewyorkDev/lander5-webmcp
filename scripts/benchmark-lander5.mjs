import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { createBookingEngine } from '../src/booking-engine.js';

const iterations = Math.max(1, Number(process.argv.find((arg) => arg.startsWith('--iterations='))?.split('=')[1] || 10));
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))?.split('=')[1];
const scenario = {
  id: 'palm-beach-biweekly-standard',
  request: {
    firstName: 'Health', phone: '3475952059', zipCode: '33401', cleaningType: 'standard',
    frequency: 'biweekly', squareFeet: 1800, bedrooms: 3, bathrooms: 2,
    condition: 'average', pets: true, addOns: ['oven'],
  },
};

function percentile(values, percent) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(percent * sorted.length) - 1)];
}

const runs = [];
for (let index = 0; index < iterations; index += 1) {
  const engine = createBookingEngine();
  const started = performance.now();
  engine.run('get_booking_context');
  engine.run('set_cleaning_request', scenario.request);
  engine.run('calculate_quote');
  const { slots } = engine.run('find_available_slots', { limit: 4 });
  engine.run('select_tentative_slot', { slotId: slots[0].id });
  engine.run('prepare_booking_review');
  engine.approve();
  const result = engine.run('request_reservation', { confirmed: true });
  const elapsedMs = performance.now() - started;
  const events = engine.getState().events;
  runs.push({
    iteration: index + 1,
    elapsedMs: Number(elapsedMs.toFixed(3)),
    toolCalls: events.length,
    estimatedInputTokens: events.reduce((sum, event) => sum + event.inputTokensEstimated, 0),
    estimatedOutputTokens: events.reduce((sum, event) => sum + event.outputTokensEstimated, 0),
    success: result.reservation.status === 'sandbox_requested',
    reference: result.reservation.reference,
  });
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  system: 'lander5-webmcp-engine',
  scenario,
  methodology: {
    execution: 'Direct invocation of the same deterministic domain engine used by registered WebMCP tools; excludes model inference and network latency.',
    tokenMetric: 'Estimated JSON tool I/O tokens using ceil(serialized characters / 4). This is not provider-billed model usage.',
    comparisonRule: 'Only compare with a Lander 3 run using the same scenario fields and test-mode safety contract.',
  },
  summary: {
    iterations,
    successful: runs.filter((run) => run.success).length,
    medianElapsedMs: percentile(runs.map((run) => run.elapsedMs), 0.5),
    p95ElapsedMs: percentile(runs.map((run) => run.elapsedMs), 0.95),
    medianToolCalls: percentile(runs.map((run) => run.toolCalls), 0.5),
    medianEstimatedInputTokens: percentile(runs.map((run) => run.estimatedInputTokens), 0.5),
    medianEstimatedOutputTokens: percentile(runs.map((run) => run.estimatedOutputTokens), 0.5),
  },
  runs,
};

const json = `${JSON.stringify(report, null, 2)}\n`;
if (outputArg) {
  const directory = outputArg.includes('/') ? outputArg.slice(0, outputArg.lastIndexOf('/')) : '.';
  await mkdir(directory, { recursive: true });
  await writeFile(outputArg, json, 'utf8');
}
process.stdout.write(json);
