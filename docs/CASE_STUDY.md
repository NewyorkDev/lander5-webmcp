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

Public demo: https://newyorkdev.github.io/lander5-webmcp/

Initial public revision: `9047e0c`

| Measurement | Lander 3 | Lander 5 |
| --- | ---: | ---: |
| Current verified mode | Production-page Playwright health path | Rendered-page shared-engine health path |
| Successful shared-scenario preparation | Yes | Yes |
| Preparation interaction time | 14.695 seconds | 0.063 ms median engine time; rendered-page measurement pending updated deploy |
| Interaction operations | 40 browser events | 6 structured tool calls |
| Input/context footprint | 2,826-token visible-text estimate; 56,292-token full-DOM estimate | 158 estimated tool-input tokens |
| Output footprint | Not separately available from DOM automation | 892 estimated tool-output tokens |
| Actual model tokens | Not captured | Not captured |
| Production slots consumed | Test rows excluded, cleanup required | 0 by design |
| Card required | Current completion UI: yes | No |

The aligned 25-run deterministic Lander 5 engine artifact reports 25/25 success. To the same pre-submission review boundary it uses six calls, with a 0.063 ms median and 0.291 ms p95 on the development machine. The full sandbox request uses seven calls, with a 0.110 ms median and 0.353 ms p95. These engine-only timings exclude rendering, networking, and model inference and must not be compared directly with Lander 3’s browser duration.

The current Lander 3 read-only artifact completed the same substantive service questionnaire in 14.695 seconds after page readiness, producing 40 captured browser events. It requested **Standard Clean** and did not silently switch to deep cleaning. The test-mode availability API returned zero openings, so it selected the site's waiting-list path and stopped before submission. No intake or appointment was created.

## What is not proven yet

- End-to-end WebMCP runs from the official supported AI browser.
- Comparable provider-reported model token usage for both paths.
- Hosted-network median and p95 across at least 25 runs.
- Public live URL and clean-browser verification.

No percentage speed or token-reduction claim should be published until these rows have comparable evidence.

## Expected mechanism

Lander 5 should reduce overhead because tool names and schemas expose the workflow directly. The agent does not need to rediscover labels or serialize repeated page observations. This is the hypothesis the final measurements must test, not a conclusion assumed in advance.

## Reproduction

See `docs/BENCHMARKING.md` and retain the raw JSON artifacts used for every published table or chart.
