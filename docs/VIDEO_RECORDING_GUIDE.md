# Record the WebMCP demo on this Mac

> Use the current full-intake narration and scenario in [`../submission/lander5/VIDEO_SCRIPT.md`](../submission/lander5/VIDEO_SCRIPT.md) and [`../src/demo-scenario.js`](../src/demo-scenario.js). Older metric examples later in this guide are retained only as historical notes.

Claude is not required. Use ChatGPT's supported in-app browser if site tools are available there. Otherwise use the Chrome WebMCP path below, which has already been verified against the public deployment.

## Before recording

1. Close private tabs and silence notifications.
2. Open `docs/DEMO_SCRIPT.md` on a second screen or phone.
3. Start macOS screen recording with **Shift–Command–5**. Record the browser window and enable your microphone.
4. Target 2:35 and stop by 2:50. The official limit is strictly under three minutes.

## Recommended ChatGPT path

1. Open https://newyorkdev.github.io/lander5-webmcp/ in ChatGPT's in-app browser.
2. Ask ChatGPT to inspect the page's available site tools.
3. Paste the shared-scenario prompt from `docs/DEMO_SCRIPT.md`.
4. Show the tool activity and the visible page updating together.
5. Ask it to request the reservation before approval and show the failure.
6. Expand the review and point out **standard · no automatic type change**, the price, appointment window, and **No card required · $0 charged**.
7. Click **Approve reservation request** yourself.
8. Ask ChatGPT to request the reservation with confirmation.
9. Show **Sandbox request recorded**, the reference, and the no-production/no-payment statement.
10. Finish on the comparison table: 40 browser events versus 6 structured calls, and the 2,810 visible-text estimate versus the 1,058 structured tool-I/O estimate.

## Reliable Chrome fallback

Launch a separate WebMCP-enabled Chrome window from Terminal:

```bash
open -na "Google Chrome" --args \
  --enable-blink-features=WebMCP \
  --user-data-dir=/tmp/lander5-webmcp-video \
  --no-first-run \
  "https://newyorkdev.github.io/lander5-webmcp/"
```

Open DevTools with **Option–Command–I** and use the Console to show genuine native discovery:

```js
await document.modelContext.getTools()
```

The result must list all eight tools. Invoke them through the native browser API—not through `window.__LANDER5_BENCHMARK__`—and keep the human approval click visible. Chrome 151 on this machine requires the discovered `RegisteredTool` object and JSON-string arguments:

```js
const tools = await document.modelContext.getTools()
const contextTool = tools.find((tool) => tool.name === 'get_booking_context')
await document.modelContext.executeTool(contextTool, '{}')
```

The returned value is also a JSON string. The evolving WebMCP specification describes an object input, but the verified Chrome 151 build currently rejects that form; use the call above for this recording environment. Continue with the scenario and sequence in `docs/DEMO_SCRIPT.md`. The repository's `artifacts/native-webmcp-public-verification.json` preserves a successful run of this API path if you need to compare results while rehearsing.

## What must be visible in the final cut

- Public Lander 5 URL.
- Eight discovered WebMCP tools.
- At least one genuine native site-tool invocation.
- Six-call prepared review with the visible human state updated.
- Rejected reservation attempt before approval.
- Your visible approval click.
- Standard cleaning with no automatic type change.
- No card, no payment, and no production inventory.
- Final sandbox reference.
- The carefully labeled Lander 3 versus Lander 5 comparison.

## After recording

1. Play the exported video from beginning to end with sound.
2. Confirm its duration is below 3:00; below 2:50 is safer.
3. Upload it publicly to YouTube.
4. Test playback in a logged-out/private browser window.
5. Paste the URL into `docs/SUBMISSION_DRAFT.md` and the Devpost submission.
