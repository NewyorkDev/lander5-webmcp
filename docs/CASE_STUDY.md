# Case study: structured site tools versus form-driving automation

Status: **reproducible deterministic comparison complete**

## Question

Can a cleaning customer and an AI assistant prepare a safe appointment request with fewer interaction steps and less exchanged context than an agent navigating the existing Lander 3 page?

## Systems

### Lander 3 control

The existing production page is a comprehensive human form. Its historical Claude Library health path used Playwright to locate controls, fill fields, submit test intake, open the booking continuation, enter a Stripe test card, and clean up the resulting test tentative. For this study, the refreshed control runner uses the same current form but stops at the complete pre-submission review boundary, so it creates no intake, tentative, Stripe action, or booking.

Safety evidence already verified in source:

- the established test phone marks intake and tentatives `isTest: true`;
- test tentatives are excluded when real availability is calculated;
- the runner expires active test tentatives after the run;
- the updated full-completion runner cannot report success unless cleanup is verified with zero active test tentatives.

Repeated completion benchmarks are paused until all Slack, admin-email, and customer-email paths are proven suppressed in test mode.

### Lander 5 treatment

The new public sandbox publishes eight imperative WebMCP tools over one shared booking engine. The agent can update the same draft a customer sees. The final tool cannot execute until the customer clicks approval for the visible summary. The workflow needs no card and never touches production inventory.

## Current evidence

Public demo: https://newyorkdev.github.io/lander5-webmcp/

Initial public revision: `9047e0c`

| Measurement | Lander 3 | Lander 5 |
| --- | ---: | ---: |
| Current verified mode | Production-page Playwright health path | Rendered-page shared-engine health path |
| Successful shared-scenario preparation | Yes | Yes |
| Preparation interaction time | 14.525 seconds | 15.7 ms in one native-WebMCP public run; 0.064 ms median engine time |
| Interaction operations | 40 browser events | 6 structured tool calls |
| Input/context footprint | 2,810-token visible-text estimate; 56,590-token full-DOM estimate | 158 estimated tool-input tokens |
| Output footprint | Not separately available from DOM automation | 900 estimated tool-output tokens |
| Actual model tokens | Not captured | Not captured |
| Production slots consumed | Test rows excluded, cleanup required | 0 by design |
| Card required | Current completion UI: yes | No |

At the aligned review boundary, Lander 5 used six structured calls instead of 40 browser input/change/click events: **85% fewer interaction operations**. Its combined estimated tool input and output footprint was 1,058 tokens, **62.3% smaller than one final Lander 3 visible-text snapshot** estimated at 2,810 tokens. This is a serialized-context comparison, not provider-billed model usage; the Lander 3 automation may inspect the page more than once, and an AI browser may create additional observations.

The aligned 25-run deterministic Lander 5 engine artifact reports 25/25 success. To the same pre-submission review boundary it uses six calls, with a 0.064 ms median and 0.302 ms p95 on the development machine. The full sandbox request uses seven calls, with a 0.111 ms median and 0.366 ms p95. These engine-only timings exclude rendering, networking, and model inference and must not be compared directly with Lander 3’s browser duration.

The current Lander 3 read-only artifact completed the same substantive service questionnaire in 14.525 seconds after page readiness, producing 40 captured browser events. It requested **Standard Clean** and did not silently switch to deep cleaning. The test-mode availability API returned one opening for ZIP 34638, the runner selected the first slot deterministically, and it stopped before submission. No intake or appointment was created.

Native browser verification is now complete. Chrome 151, launched with WebMCP enabled, discovered all eight tools from the public HTTPS page with `document.modelContext.getTools()`. The test executed the shared scenario using `document.modelContext.executeTool()`, confirmed that the requested and reviewed type remained `standard`, proved the reservation tool failed before the page approval, then completed the sandbox request after one visible approval click. It did not use the benchmark bridge.

Claude Library integration is also verified. The `landerfive-webmcp-health` action loaded the public page and completed its rendered-page shared-engine health path in 1.833 seconds. Preparation took 26 ms inside that run, used six calls, and retained the aligned 158-input/900-output JSON-size estimates. It then used one visible approval click and a seventh call to produce the sandbox result with no card and no production inventory. This proves the library action is runnable; it is deliberately not described as native WebMCP or model inference. The raw result is preserved in `artifacts/claude-library-health-verification.json`.

## What is not proven yet

- Provider-reported model token usage for either path; this is outside the deterministic study and is not required for submission.
- Hosted-network median and p95 across at least 25 runs.

Do not turn the engine-time result into an end-to-end speed-reduction percentage, and do not describe the serialized-context estimate as provider-billed token savings. The published 85% operation reduction and 62.3% serialized-context reduction are valid only for their explicitly named boundaries.

## Expected mechanism

Lander 5 should reduce overhead because tool names and schemas expose the workflow directly. The agent does not need to rediscover labels or serialize repeated page observations. This is the hypothesis the final measurements must test, not a conclusion assumed in advance.

## Reproduction

See `docs/BENCHMARKING.md` and retain the raw JSON artifacts used for every published table or chart.
