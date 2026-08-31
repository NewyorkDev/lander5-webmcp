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
- Video: **TODO — public YouTube URL under three minutes**

# Project details

Affordable Cleaning Today is a real cleaning company with a long production quote flow called Lander 3. Traditional browser automation can complete it, but it must rediscover controls, scroll, click, type, and recover when the interface changes.

Lander 5 publishes that real intake as eight structured WebMCP tools. An AI agent can collect the same substantive customer and service answers, calculate an estimate, find an appointment window, and prepare an exact visible review. The person can edit any answer and must approve the rendered summary before the consequential reservation tool succeeds.

This is not a shortened lead form. We audited the current production Lander 3 source and represented 57 customer-facing question concepts, including its conditional move, appliance, partial-cleaning, heavy-cleaning, bathroom, recurring-service, add-on, allergy, access, and scheduling questions. We deliberately excluded payment and billing-only fields because the business permits an initial appointment request without a card. We also excluded tracking metadata, legacy duplicate state, and file uploads.

## Why WebMCP

Home-service ordering naturally divides responsibility: the customer knows the intent and personal details, the business site owns pricing and validation, and the agent can turn a conversation into structured actions. WebMCP lets the site declare valid inputs and side effects instead of forcing an agent to guess through a changing visual interface.

Both the human form and the eight WebMCP tools use one deterministic state engine. Agent changes appear immediately on screen. Human edits invalidate stale quotes, slots, reviews, and approvals. The final tool requires both `confirmed: true` and a separate approval click in the rendered page.

## Safety and evidence

Lander 5 is an isolated public sandbox. It accepts no card data, charges nothing, sends no customer notifications, and consumes no production appointment inventory. Its final action is idempotent and fails closed before visible human approval.

In 25 reproducible full-intake runs, 25 succeeded. The median complete workflow used seven tool calls and approximately 399 input plus 1,249 output JSON I/O tokens. These are transparent serialized-payload estimates—not provider-billed model token claims. Raw results and methodology are included in the public repository.

## What was built during the challenge

The production Lander 3 page and its older visual browser automation existed before the challenge. Lander 5—the standalone public application, shared state engine, eight WebMCP tools, full-intake mapping, visible telemetry, human approval boundary, tests, benchmark artifacts, and submission materials—was built during the challenge.

## Biggest challenge

The hardest problem was removing form-navigation burden without removing meaningful human control. A second challenge was fidelity: an agent demo can look fast simply because it asks fewer questions. We solved that by auditing the production intake field by field, representing 57 customer-facing question concepts, and publishing the deliberate exclusions.

## What's next

After the challenge, a controlled production pilot can replace sandbox availability with server-authoritative slots while preserving no-card initial requests, authenticated confirmation, notification idempotency, and a complete audit trail.

# Additional information

No login or credentials are required. See `submission/lander5/TESTING.md` for the exact judge flow and `submission/lander5/LANDER3_FIDELITY.md` for the production-intake audit.
