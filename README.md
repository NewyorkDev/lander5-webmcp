# Lander 5 — agent-ready cleaning reservations

Lander 5 is a public experimental page for the 2026 WebMCP Challenge. It turns a long cleaning-intake workflow into a small set of structured site tools while keeping the quote, appointment choice, and consequential final action visible to the customer.

The project is an isolated sandbox. It does not create Affordable Cleaning Today production appointments, consume live availability, charge a card, or send customer notifications.

## Why WebMCP

Traditional browser agents must repeatedly inspect a large page, infer labels, scroll, type, and recover from layout changes. Lander 5 publishes an explicit contract for the same job:

1. Read policy and required fields.
2. Fill the cleaning-request draft.
3. Calculate an estimate.
4. Find and select an appointment window.
5. Prepare a visible review.
6. Pause for customer approval.
7. Request the sandbox reservation.

The human page and WebMCP tools use the same state engine. Agent changes appear immediately in the interface, and human edits invalidate stale quotes, times, approvals, and reservations.

## Tools

| Tool | Effect |
| --- | --- |
| `get_booking_context` | Reads policy, requirements, progress, and safest next action |
| `set_cleaning_request` | Updates the visible draft and invalidates derived stale state |
| `calculate_quote` | Produces an experimental price range |
| `find_available_slots` | Returns sandbox appointment windows |
| `select_tentative_slot` | Selects a window without holding it |
| `prepare_booking_review` | Creates the exact customer-facing review |
| `request_reservation` | Records the sandbox request after visible customer approval |
| `get_booking_status` | Reads current approval and reservation state |

`request_reservation` requires both `confirmed: true` from the caller and an approval click in the rendered page. No tool accepts raw card data.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. In a browser implementing the WebMCP imperative API, the page registers tools with `document.modelContext.registerTool(...)`. Unsupported browsers retain the complete human workflow.

## Verification

```bash
npm test
npm run build
npm run benchmark
```

The benchmark writes a reviewable JSON artifact to `artifacts/lander5-benchmark.json`. See [the benchmark protocol](docs/BENCHMARKING.md) before comparing it with Lander 3. Estimated JSON tool-I/O tokens are not presented as billed model tokens.

## Claude Library integration

The related local Claude Library has a `landerfive-webmcp-health` action. It opens the rendered page, invokes the shared tool engine through the explicitly labeled benchmark bridge, clicks the visible approval button, and verifies:

- status is `sandbox_requested`;
- no card is on file;
- production inventory was not consumed;
- the rendered-page tool-call and estimated-I/O metrics are available.

Playwright driving the bridge is a health/measurement technique, not a claim that Playwright is a WebMCP client. The competition demo must also show discovery and invocation from an actual supported AI browser.

## Deployment

The repository includes a Vercel configuration. Import the public repository into Vercel or run:

```bash
vercel --prod
```

No environment variables are required. The deployed page remains a static sandbox.

## Safety and privacy

- No production API calls.
- No live calendar mutations.
- No payment fields or raw payment information.
- No analytics or third-party tracking.
- No customer details persist beyond the current page session.
- A human approval boundary precedes the final action.
- Every screen identifies the experience as experimental and non-production.

## Challenge material

- [Competition and implementation instructions](instructions.md)
- [Benchmark protocol](docs/BENCHMARKING.md)
- [Case-study working document](docs/CASE_STUDY.md)
- [MIT License](LICENSE)

Built during the WebMCP Challenge by New York Dev.
