# Lander 3 versus Lander 5 benchmark protocol

This study measures whether a structured WebMCP path reduces interaction overhead compared with browser automation over the existing Lander 3 form. It does not claim that local JavaScript execution represents total AI response time.

## Shared scenario

- First name: Health
- Test phone: 3475952059
- ZIP: 34669
- Standard cleaning, one time
- 1,400 square feet, 3 bedrooms, 2 bathrooms, one story
- No pets, no blinds, tile and hardwood, 9-foot fan height
- Clear kitchen and bathroom surfaces; other surfaces accessible
- Entire home, fair condition, medium dust, 2 occupants
- Last professional cleaning 3–6 months ago; no heavy cleaning
- Five extra windows
- First returned appointment window

## Metrics

| Metric | Lander 3 control | Lander 5 WebMCP |
| --- | --- | --- |
| Preparation success | Browser reaches a complete pre-submission state without creating intake data | Tool flow reaches the visible review with the same substantive answers |
| Steps | Playwright interaction count, including fills, selections, and clicks | Registered tool calls; human approval is reported separately |
| Duration | Monotonic time from page-ready to completion, plus cleanup status | Monotonic time across the domain-engine calls |
| Tool I/O tokens | Estimate from serialized automation observations/actions when available | `ceil(JSON characters / 4)` for every tool input and output |
| Actual model tokens | Record only if the model runtime reports them | Record only if the model runtime reports them |

Never present estimated tool I/O tokens as provider-billed model tokens. Page execution time, browser automation time, and end-to-end agent time are separate measurements.

## Lander 3 safety gate

The control run must use the established test phone and verify `isTest: true`. Test tentatives do not count against public availability. After the run, Claude Library must expire artifacts for the generated intake code and verify `activeCount === 0`. A cleanup failure invalidates the run.

Repeated Lander 3 completion runs remain disabled until test notification suppression is verified for Slack, admin email, and customer email. The approved comparison mode fills the page and stops before submission. Availability probes run with `testMode: true` and `x-act-test-mode: 1` because that endpoint is read-only and suppresses the live-shopping notification.

## Running Lander 5

```bash
npm install
npm test
npm run benchmark
```

The command writes `artifacts/lander5-benchmark.json`. Commit benchmark artifacts used in published case studies so the claims can be audited.

## Comparison rules

1. Use identical scenario inputs and disclose any field that cannot map exactly.
2. Run at least 25 successful trials after one warm-up.
3. Report median and p95, not only the fastest trial.
4. Preserve failed runs and state why they failed.
5. Report the machine, browser, model, runtime, network conditions, date, and revision.
6. Separate deterministic engine performance from actual agent end-to-end performance.
7. Do not claim a token reduction until both systems expose comparable evidence.
