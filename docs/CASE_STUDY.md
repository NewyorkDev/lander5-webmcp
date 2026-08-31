# Case study: structured site tools versus form-driving automation

Status: **working evidence; comparison not yet complete**

## Question

Can a cleaning customer and an AI assistant prepare a safe appointment request with fewer interaction steps and less exchanged context than an agent navigating the existing Lander 3 page?

## Systems

### Lander 3 control

The existing production page is a comprehensive human form. Claude Library uses Playwright to locate controls, fill fields, submit test intake, open the booking continuation, enter a Stripe test card, and clean up the resulting test tentative.

Safety evidence already verified in source:

- the established test phone marks intake and tentatives `isTest: true`;
- test tentatives are excluded when real availability is calculated;
- the runner expires active test tentatives after the run;
- the updated runner cannot report full success unless cleanup is verified with zero active test tentatives.

Repeated completion benchmarks are paused until all Slack, admin-email, and customer-email paths are proven suppressed in test mode.

### Lander 5 treatment

The new public sandbox publishes eight imperative WebMCP tools over one shared booking engine. The agent can update the same draft a customer sees. The final tool cannot execute until the customer clicks approval for the visible summary. The workflow needs no card and never touches production inventory.

## Current evidence

Revision: record the Git commit after the public repository is created.

| Measurement | Lander 3 | Lander 5 |
| --- | ---: | ---: |
| Current verified mode | Production-page Playwright health path | Rendered-page shared-engine health path |
| Successful local run | Pending safe rerun | Yes |
| Rendered-page duration | Pending | 1.9 seconds in one local health run |
| Structured tool calls | Not applicable | 7 |
| Human approval clicks | Existing form flow; count pending | 1 |
| Estimated tool input tokens | Pending comparable instrumentation | 70 |
| Estimated tool output tokens | Pending comparable instrumentation | 690 |
| Actual model tokens | Not captured | Not captured |
| Production slots consumed | Test rows excluded, cleanup required | 0 by design |
| Card required | Current completion UI: yes | No |

The 25-run deterministic Lander 5 engine artifact reports 25/25 success, seven calls per run, a 0.088 ms median, and a 0.312 ms p95 on the development machine. Those engine-only timings exclude rendering, networking, and model inference and must not be compared directly with Lander 3’s browser duration.

## What is not proven yet

- A fair Lander 3 action-count and context-size artifact using the shared scenario.
- End-to-end WebMCP runs from the official supported AI browser.
- Comparable provider-reported model token usage for both paths.
- Hosted-network median and p95 across at least 25 runs.
- Public live URL and clean-browser verification.

No percentage speed or token-reduction claim should be published until these rows have comparable evidence.

## Expected mechanism

Lander 5 should reduce overhead because tool names and schemas expose the workflow directly. The agent does not need to rediscover labels or serialize repeated page observations. This is the hypothesis the final measurements must test, not a conclusion assumed in advance.

## Reproduction

See `docs/BENCHMARKING.md` and retain the raw JSON artifacts used for every published table or chart.
