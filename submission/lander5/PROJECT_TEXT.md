# Project overview

## Name

Lander 5: Cleaning at Conversation Speed

## One-line description

A full cleaning quote and appointment intake where WebMCP handles the form work while the customer controls the final decision.

## Elevator pitch

We turned a real cleaning company's AI-automated form into eight WebMCP tools, making full quote and booking intake faster and more reliable while keeping final approval in the customer's hands.

## Links

- Live app: https://newyorkdev.github.io/lander5-webmcp/
- Source: https://github.com/NewyorkDev/lander5-webmcp
- Video: https://www.youtube.com/watch?v=bxGHJsYYshw

## Built with

- WebMCP imperative API
- React
- JavaScript
- HTML and CSS
- Vite
- Vitest
- Node.js
- GitHub Pages
- GitHub Actions
- Chrome's experimental WebMCP implementation for native tool verification

# Project story

## Inspiration

I have been running Affordable Cleaning Today for four years. Our production quote form is not a hypothetical demo. It is part of a real business and customers complete it about two or three times every day.

Watching session recordings showed me a recurring problem: many customers, especially seniors and people who are less comfortable with computers, struggle with long online forms. They may understand exactly what cleaning they need, but navigating dozens of fields, conditional questions, and appointment steps can become the hardest part of asking for help.

We had already automated the form for AI using traditional browser automation. That proved an agent could complete it, but the agent still had to behave like a person operating a browser: inspect the page, find controls, scroll, click, type, and recover when the interface changed. WebMCP gave us the opportunity to reimagine that interaction instead of merely automating more clicks.

That old automation was also how we tested the form ourselves. We used it to fill everything out and make sure the form still worked from beginning to end. When we saw WebMCP, we realized it could help us in two ways. It could help customers book a cleaning through an AI, and it could help our own team test the full form faster whenever we make a change.

## What we built

We took the real production cleaning intake and rebuilt it as Lander 5, a public WebMCP booking sandbox. An AI assistant can use eight structured tools to collect the cleaning details, calculate an estimate, find appointment options, select a time, and prepare an exact visible review.

This is not a simplified lead form. We audited the production flow and represented 57 customer-facing question concepts, including conditional questions for appliances, move cleaning, partial cleaning, heavy conditions, bathrooms, add-ons, allergies, access, recurring service, and scheduling. We excluded payment because the company permits an initial appointment request without a card.

The goal is simple: someone should be able to describe the cleaning they need conversationally and let an AI handle the tedious form work. The customer can still see and edit every answer and must personally approve the final review.

## How we built it

The human interface and all eight WebMCP tools use the same deterministic booking engine. This means agent actions immediately update the visible page, while human edits automatically invalidate stale quotes, appointment selections, reviews, and approvals.

The workflow registers top-level imperative WebMCP tools for context, intake updates, quoting, availability, tentative selection, review, reservation requests, and status. The final action is idempotent and requires two independent signals: `confirmed: true` from the agent and a separate approval click from the customer.

We kept the competition version isolated from the production business. It accepts no card information, charges no money, sends no customer notifications, and consumes no real appointment inventory. That makes it safe for judges and agents to test repeatedly.

## Challenges we faced

The first challenge was preserving the complexity of a real intake without producing a short-form demo that only looked faster because it asked fewer questions. We solved that by auditing the production source field by field and publishing a fidelity map of the 57 represented question concepts and every deliberate exclusion.

The second challenge was maintaining meaningful human control. Removing form navigation should not allow an agent to silently change a Standard cleaning into a Deep cleaning or submit an outdated choice. Lander 5 therefore exposes the exact cleaning type, scope, estimate, and appointment time in a visible review, then fails closed until the person approves it.

The third challenge was measurement. Browser events, page text, serialized tool payloads, model tokens, and end-to-end latency are different measurements. We labeled them separately and published the raw artifacts rather than presenting estimated JSON size as provider-billed model usage.

## What we learned

The biggest lesson is that agent-ready design is not simply about removing clicks. A useful website should give the agent a narrow and accurate contract while giving the person visibility, editability, and control over consequences.

We also learned that WebMCP can make an existing real-world workflow easier without forcing the business to discard the human interface. People can still use the form normally, but customers who find forms difficult can receive structured assistance from an AI operating on the same visible state.

It can also make our internal testing much quicker. Instead of making browser automation find and click every field each time, we can run the same complete test scenarios through the WebMCP tools. If something breaks, it should be easier to see exactly where it happened. We can still test the visible form separately to make sure the regular customer experience works too.

## Results

The complete sandbox workflow uses seven tool calls through reservation. Across 25 reproducible full-intake benchmark runs, all 25 succeeded. The complete run measured approximately 399 input plus 1,249 output JSON I/O tokens, for an estimated serialized payload footprint of 1,648 tokens. These figures are transparent JSON-size estimates, not provider-billed model tokens.

For me, the most important result is more practical: a form used every day by a real cleaning company can become easier for customers who might otherwise struggle to complete it, while the business keeps its validation rules and the customer keeps the final say.

# Project details

Affordable Cleaning Today is a real cleaning company with a long production quote flow called Lander 3. Traditional browser automation can complete it, but it must rediscover controls, scroll, click, type, and recover when the interface changes.

Lander 5 publishes that real intake as eight structured WebMCP tools. An AI agent can collect the same substantive customer and service answers, calculate an estimate, find an appointment window, and prepare an exact visible review. The person can edit any answer and must approve the rendered summary before the consequential reservation tool succeeds.

This is not a shortened lead form. We audited the current production Lander 3 source and represented 57 customer-facing question concepts, including its conditional move, appliance, partial-cleaning, heavy-cleaning, bathroom, recurring-service, add-on, allergy, access, and scheduling questions. We deliberately excluded payment and billing-only fields because the business permits an initial appointment request without a card. We also excluded tracking metadata, legacy duplicate state, and file uploads.

## Why WebMCP

Home-service ordering naturally divides responsibility: the customer knows the intent and personal details, the business site owns pricing and validation, and the agent can turn a conversation into structured actions. WebMCP lets the site declare valid inputs and side effects instead of forcing an agent to guess through a changing visual interface.

Both the human form and the eight WebMCP tools use one deterministic state engine. Agent changes appear immediately on screen. Human edits invalidate stale quotes, slots, reviews, and approvals. The final tool requires both `confirmed: true` and a separate approval click in the rendered page.

## Safety and evidence

Lander 5 is an isolated public sandbox. It accepts no card data, charges nothing, sends no customer notifications, and consumes no production appointment inventory. Its final action is idempotent and fails closed before visible human approval.

In 25 reproducible full-intake runs, 25 succeeded. The median complete workflow used seven tool calls and approximately 399 input plus 1,249 output JSON I/O tokens. These are transparent serialized-payload estimates, not provider-billed model token claims. Raw results and methodology are included in the public repository.

## What was built during the challenge

The production Lander 3 page and its older visual browser automation existed before the challenge. Lander 5, including the standalone public application, shared state engine, eight WebMCP tools, full-intake mapping, visible telemetry, human approval boundary, tests, benchmark artifacts, and submission materials, was built during the challenge.

## Biggest challenge

The hardest problem was removing form-navigation burden without removing meaningful human control. A second challenge was fidelity: an agent demo can look fast simply because it asks fewer questions. We solved that by auditing the production intake field by field, representing 57 customer-facing question concepts, and publishing the deliberate exclusions.

## What's next

After the challenge, a controlled production pilot can replace sandbox availability with server-authoritative slots while preserving no-card initial requests, authenticated confirmation, notification idempotency, and a complete audit trail.

# Additional information

No login or credentials are required. See `submission/lander5/TESTING.md` for the exact judge flow and `submission/lander5/LANDER3_FIDELITY.md` for the production-intake audit.
