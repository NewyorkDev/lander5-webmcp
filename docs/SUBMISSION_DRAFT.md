# Devpost submission draft

Use this as organized source material for the Devpost **Project overview**, **Project details**, and **Additional information** sections. Confirm the exact field labels and limits in the saved submission form before pasting.

## Project overview

### Project name

Lander 5: Cleaning at Conversation Speed

### One-line description

An agent-ready cleaning quote and reservation sandbox where WebMCP handles the form work and the customer keeps control of the final decision.

### Project links

- Live project: https://newyorkdev.github.io/lander5-webmcp/
- Public source: https://github.com/NewyorkDev/lander5-webmcp
- Demo video: **TODO — public YouTube URL under three minutes**

### Suggested Devpost screenshots

1. `docs/images/01-lander5-agent-ready.png` — opening human interface and agent-ready positioning.
2. `docs/images/02-lander5-human-approval.png` — exact visible review, Standard Clean preservation, price, requested time, no-card policy, and human approval boundary.
3. `docs/images/03-lander5-sandbox-result.png` — completed sandbox request with no production appointment or payment.

Regenerate these from the deployed page with `npm run screenshots`. The script uses the separately labeled deterministic benchmark bridge only to stage repeatable visual states; it is not WebMCP evidence. Native WebMCP evidence remains in `artifacts/native-webmcp-public-verification.json` and must be shown in the video.

### Short overview

Affordable Cleaning Today is a real cleaning company with a production quote flow called Lander 3. We had previously automated that long human form with Codex, Claude, and Playwright. It worked, but the automation had to rediscover the page, locate controls, scroll, click, type, and recover whenever the interface changed.

For the WebMCP Challenge, we built Lander 5: a new public experimental page that publishes the cleaning workflow as structured site tools. An AI agent can collect the same substantive service details, calculate an estimate, find an appointment window, and prepare an exact review. The customer sees every change and must approve the visible summary before the final reservation tool can run.

Lander 5 is deliberately isolated from production. It requires no card, charges no money, sends no customer messages, and consumes no real appointment inventory.

## Project details

### Why this is a strong fit for WebMCP

Ordering a home service is a natural collaboration between a person, an agent, and a business website. The customer knows the intent and personal details; the website owns pricing rules, required questions, and availability; the agent can translate the conversation into structured actions.

Without WebMCP, an agent must infer the workflow from a large, changing visual page. With WebMCP, the website declares what the agent can do, which fields are valid, what each action changes, and when human approval is required. This makes the interaction faster, more legible, and safer.

### What people and agents can do together

A person can tell an assistant, in ordinary language, what kind of cleaning they need. The agent can then:

1. Read the site's booking policy and required information.
2. Populate the same cleaning request visible on screen.
3. Calculate and display an estimate.
4. Find and select an experimental appointment window.
5. Prepare the exact customer-facing review.
6. Stop while the customer verifies the cleaning type, home details, price range, and date.
7. Request the sandbox reservation only after the customer clicks approval.

The person can edit any answer. Human edits invalidate stale quotes, slots, reviews, and approvals so an agent cannot submit an outdated decision.

### How it creates a better experience

Lander 3's automation must drive a long form one control at a time. In our updated read-only reference run, interaction after page readiness took 14.525 seconds and generated 40 browser input/change/click events. Total runner time was 16.594 seconds. The final visible page contained an estimated 2,810 tokens of text, with a 56,590-token full-DOM size estimate.

Lander 5 conveys the same versioned service scenario through six structured tool calls to the review boundary. In a native-WebMCP run against the public page, preparation after page readiness took 15.7 ms. The updated six-call payload contains approximately 158 input and 900 output tokens by serialized JSON-size estimate. Its token measurement is based on tool inputs and outputs, not the page DOM; repeated agent-driven measurements remain necessary before claiming a percentage improvement.

That aligned diagnostic used 85% fewer interaction operations—six WebMCP calls instead of forty browser events. Its 1,058-token estimated serialized tool-I/O footprint was 62.3% smaller than one final Lander 3 visible-text snapshot estimated at 2,810 tokens. We describe this as context footprint, not billed model usage.

These are interaction-footprint estimates, not provider-billed model tokens. The repository publishes the raw artifacts and methodology so the distinction is auditable.

### How we implemented WebMCP

Lander 5 uses the imperative WebMCP API at the top-level page. Eight tools are registered with `document.modelContext.registerTool(...)`:

- `get_booking_context`
- `set_cleaning_request`
- `calculate_quote`
- `find_available_slots`
- `select_tentative_slot`
- `prepare_booking_review`
- `request_reservation`
- `get_booking_status`

Every tool and the human interface use one deterministic booking engine. Tool schemas constrain cleaning types, frequency, home details, condition, scope, add-ons, and other inputs. Read-only annotations identify inspection operations. The final tool is idempotent and requires two independent signals: `confirmed: true` from the caller and a customer approval recorded through the rendered page.

The page exposes a separately labeled benchmark bridge for deterministic Playwright health checks. We do not describe Playwright as WebMCP; the competition demo must show the registered tools through ChatGPT's in-app browser or Chrome 149+ with WebMCP enabled.

### What is new during the challenge

Affordable Cleaning Today's production Lander 3 and its older Playwright health automation existed before the challenge. The standalone Lander 5 repository, shared booking engine, eight WebMCP tools, approval boundary, telemetry, benchmarks, public deployment, documentation, and Claude Library Lander 5 health action were created during the challenge. The public Git history provides dated evidence.

### Biggest challenge

**The hardest problem was preserving meaningful human approval while removing the form-navigation burden.**

The first benchmark also exposed a methodological problem: speed comparisons are misleading when the two systems answer different questions. We corrected that by creating one versioned scenario containing the same substantive Lander 3 service answers and by separating engine time, rendered-page time, page-size estimates, tool-I/O estimates, and actual model tokens.

### Accomplishments

- A complete human interface that still works without WebMCP support.
- Eight top-level imperative WebMCP tools over the same state engine.
- A visible, fail-closed customer approval boundary.
- No payment collection and no production side effects.
- Automated tests for registration, validation, stale-state invalidation, approval, idempotency, and sandbox invariants.
- A public live URL, public MIT-licensed repository, reproducible benchmark artifacts, and a Claude Library rendered-page health action.
- A verified Claude Library health run against the public deployment: 1.833 seconds total, one visible approval click, and the expected no-card/no-inventory sandbox result.

### What we learned

The most important design lesson was that agent readiness is not just fewer clicks. A useful website must give agents a narrow, accurate contract while giving people a visible state, understandable consequences, and the final say. Measurement also needs disciplined labels: DOM size, tool payload estimates, model tokens, engine latency, and end-to-end time are different things.

### What's next

After the competition, the next step is a controlled production pilot. That would replace sandbox availability with server-authoritative slots, preserve the no-card initial reservation policy, require authenticated confirmation for consequential actions, add notification idempotency, and retain a complete audit trail. Production integration will happen only after test-mode notification isolation and repeated safety testing are complete.

## Additional information

### Testing instructions for judges

1. Open the live URL in ChatGPT's in-app browser or Chrome 149+ with WebMCP enabled.
2. Ask the agent to inspect the available tools and begin a cleaning request.
3. Use a standard, one-time cleaning for ZIP 34638, 1,400 square feet, 3 bedrooms, and 2 bathrooms.
4. Ask it to complete the home profile, calculate the quote, find times, select the first window, and prepare the review.
5. Verify that `request_reservation` fails before approval.
6. Click **Approve reservation request** in the page.
7. Ask the agent to request the reservation with confirmation.
8. Verify the result says sandbox requested, no card, and no production inventory consumed.

No login or credentials are required.

### Required submission checklist

- [x] Working public URL
- [x] Public source repository
- [x] Visible open-source license
- [x] Setup and testing instructions
- [x] Clear documentation of pre-existing versus challenge work
- [x] Native Chrome WebMCP discovery and execution verified against public URL
- [ ] Natural-language ChatGPT in-app-browser or official-inspector demo captured
- [ ] Public YouTube video with audio, under three minutes
- [ ] Screenshots added to Devpost
- [ ] Exact Devpost field limits checked
- [ ] Saved Devpost draft reviewed against official rules
- [ ] Final submit completed before September 3 at 1:00 PM Pacific / 4:00 PM Eastern

### Credential-gated evaluation note

The prepared Claude natural-language evaluation currently cannot produce provider-token evidence because the local OAuth session returns `401 OAuth access token has expired`, despite `claude auth status` reporting that the account is logged in. Reauthenticate with `claude auth login` before rerunning it. The failed request reported zero input and output tokens and must not be included in benchmark results.

## Source-of-truth reminder

The official rules require a working live URL, explanatory text, a public repository containing source/instructions and a visible open-source license, and a public YouTube demonstration under three minutes with audio. Judges may evaluate from the description, images, and video without running the project, so the submission must make the WebMCP behavior unmistakable.
