# WebMCP Challenge — Operating Instructions

Last verified: August 31, 2026 (America/New_York)

## Mission

Build and submit a WebMCP-powered web application that is not merely eligible, but credibly competitive for a top-ten award.

The project must demonstrate a meaningful human-agent collaboration inside the same live web interface. WebMCP must be essential to the experience, not a decorative integration or a thin wrapper around an ordinary app.

The entrant reports that registration on Devpost is complete under **New York Dev**. This is user-reported account state; it has not been independently verified from this workspace.

## Source-of-truth policy

Before relying on any competition requirement:

1. Check the current Devpost Official Rules.
2. Check the current Devpost challenge overview and resources pages.
3. Use OpenAI's official WebMCP documentation for ChatGPT-specific behavior.
4. Use the current WebMCP specification and Chrome documentation for API behavior.
5. If sources conflict, the Devpost Official Rules control competition eligibility and submission requirements.
6. Record uncertainty instead of converting assumptions into facts.

AI-generated summaries, including this file, are working guidance and are not substitutes for the Official Rules. The Official Rules explicitly state that helper/plugin output can be inaccurate and that the entrant remains responsible for compliance.

## Non-negotiable distinction: allowed vs. competitive

Never describe a concept as "good," "ready," or "competition-worthy" merely because it is allowed.

There are two judging stages:

- **Stage One — baseline viability (pass/fail):** the project fits the theme and reasonably uses the required technology.
- **Stage Two — competitive ranking:** qualifying projects are scored on four equally weighted criteria.

The Stage Two criteria are:

1. **WebMCP Leverage:** thorough, skillful, working, non-trivial use of WebMCP.
2. **Execution:** a complete, coherent, runnable product rather than a technical proof of concept.
3. **Potential Impact:** a credible, specific problem and audience, with a demonstrated solution.
4. **Creativity & Ambition:** novelty and meaningful differentiation from existing concepts.

WebMCP Leverage is the first tie-breaker, followed by the remaining criteria in listed order.

Every proposed concept must therefore be evaluated twice:

- **Eligibility check:** Is it allowed and does it satisfy every mandatory submission rule?
- **Competitiveness check:** Why could it score strongly on each of the four criteria relative to thousands of entrants?

Do not invest substantial implementation time until both checks are documented.

## Dates and timing

- Submission period: August 25, 2026 at 11:00 a.m. PT through September 3, 2026 at 1:00 p.m. PT.
- Final deadline in New York: **September 3, 2026 at 4:00 p.m. ET**.
- Judging period: September 4 at 10:00 a.m. PT through September 21 at 5:00 p.m. PT.
- Winners expected on or around September 23 at 2:00 p.m. PT.
- After the submission period closes, the submission cannot ordinarily be changed.

Submit early. The internal target should be a complete submission no later than September 3 at noon ET, leaving four hours for failures.

## What must be built

Build a WebMCP-powered web app exploring an open web where people and agents interact, collaborate, and create together.

The application must:

- Work consistently as represented in its description and video.
- Run on the platform identified in the submission.
- Expose genuine WebMCP tools through the webpage.
- Provide a useful normal interface for human users.
- Let the human and agent act on the same visible application state.
- Remain available free of charge and without testing restrictions through the judging period.

New projects are permitted and encouraged. If any pre-existing project is used, only WebMCP work added during the submission period is evaluated. Clearly identify old versus new work and preserve dated commit evidence.

Third-party SDKs, APIs, assets, and data may be used only when we have the necessary authorization and comply with their terms and licenses.

## Mandatory submission package

The submission is made on the WebMCP Challenge's Devpost page. GitHub alone is not a submission.

Devpost must receive:

- A working live URL accessible to judges in ChatGPT's in-app browser or supported Chrome.
- A text description explaining:
  - Why the use case strongly fits WebMCP.
  - How it creates a better user experience.
  - What people and agents can do together that was previously difficult or impossible.
  - How WebMCP was implemented.
- A public GitHub, GitLab, or Bitbucket repository.
- All source code, assets, and setup instructions needed for the project to function.
- An open-source license that is visible and detectable on the repository page.
- A public YouTube demonstration video with audio, strictly under three minutes.

The video must:

- Clearly show the functioning application.
- Explain what was built.
- Show and explain how WebMCP is used.
- Avoid unlicensed copyrighted music, material, and third-party trademarks.

All submission materials must be in English or accompanied by an English translation.

Judges are not required to open or test the live application. They may judge only the description, images, repository, and video. Those artifacts must independently make the competitive case.

## Public gallery and competitive research

Devpost has a public **Project gallery** route, but as of the last verification on August 31 it says: "The hackathon managers haven't published this gallery yet."

Consequences:

- We currently cannot inspect official entrant submissions or infer categories from them.
- Do not claim that an idea is differentiated from current submissions without evidence.
- Recheck the gallery periodically, especially after submissions begin appearing.
- Use the official OpenAI showcase only as an inspiration and collision check; it is not the entrant gallery.

The official showcase already includes or highlights concepts involving collaborative writing, trip planning, meal planning, grocery carts/storefronts, photo editing, greeting-card design, crosswords, 3D modeling, games, data exploration, and other creative tools. A substantially similar concept needs a clear and defensible differentiator.

## WebMCP implementation requirements

Prefer imperative top-level JavaScript registration for ChatGPT compatibility:

```js
if (typeof document.modelContext?.registerTool === "function") {
  await document.modelContext.registerTool({
    name: "get_page_title",
    description: "Read the title of the current page.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    execute: async () => ({ title: document.title })
  });
}
```

Current ChatGPT limitations documented by OpenAI:

- Declarative tools defined through HTML form attributes are not available as site tools.
- Tools registered inside iframes are not discovered, including same-origin iframes.
- Register tools with JavaScript in the top-level page.
- Site tools require a current supported ChatGPT desktop configuration; availability can depend on model, workspace, rollout, and page tools.

Tool-design rules:

- Use narrow, strict JSON Schemas and `additionalProperties: false` where appropriate.
- Give every tool a precise, action-oriented name and description.
- Clearly state side effects in descriptions.
- Mark read-only operations with `readOnlyHint`.
- Return structured results that allow the agent and human to verify what happened.
- Reuse the same domain/application functions for human UI actions and agent tool actions.
- Enforce the application's normal authentication, authorization, validation, and business rules.
- Keep consequential or destructive actions behind explicit confirmation.
- Preserve a functional human UI and a useful fallback when WebMCP is unavailable.
- Treat tool descriptions, tool inputs, external data, and tool outputs as untrusted.
- Avoid asking for irrelevant personal or sensitive information.
- Log agent actions visibly enough for the human to understand and undo them where practical.
- Cleanly unregister dynamic tools when they are no longer valid.

## What counts as strong WebMCP leverage

A single `get_*` or `submit_*` tool is likely enough to demonstrate technical eligibility but not strong competitive leverage.

A competitive implementation should demonstrate several of the following:

- Multiple complementary tools forming a coherent workflow.
- Read, create, update, compare, and review operations over shared state.
- Dynamic tools or schemas reflecting the current application state.
- Visible agent changes appearing immediately in the human interface.
- Human edits becoming immediately available to the agent.
- Confirmation gates for consequential steps.
- Structured verification responses and visible execution history.
- Cancellation/abort handling for longer operations.
- Agent actions that are substantially more reliable than guessing through UI clicks.
- A workflow that would be awkward or impossible if the agent and human did not share the live page.

Do not inflate the tool count with trivial CRUD variations. Each tool must serve a real user workflow.

## Concept gate

Before building a concept, create a short scorecard from 0–5 for each official judging criterion and cite concrete evidence for every score.

Reject or revise the concept when any of these are true:

- WebMCP could be removed without materially changing the product.
- It is essentially a chatbot beside an ordinary webpage.
- The target audience or problem is vague.
- The key demo depends on unreliable external services.
- The experience cannot be explained and demonstrated in under three minutes.
- It closely resembles an official showcase example without a substantial differentiator.
- The required polish cannot be completed before the internal deadline.
- It creates legal, financial, medical, privacy, or safety risk that cannot be responsibly bounded.

## Current leading concept: Proofboard (provisional, not approved yet)

Proofboard is a shared evidence-and-decision canvas. A human defines a decision, constraints, and weights; an agent adds options, claims, sources, contradictions, and missing-evidence flags directly to the same visual board. The human can pin facts, reject evidence, change weights, and approve the final decision brief.

Potential WebMCP tools:

- `get_board_state`
- `create_option`
- `create_criterion`
- `set_criterion_weight`
- `add_claim`
- `add_evidence`
- `link_evidence_to_claim`
- `mark_contradiction`
- `identify_evidence_gaps`
- `compare_options`
- `draft_recommendation`
- `request_decision_approval`
- `export_decision_brief`

This concept remains provisional until it receives a documented competitive scorecard, collision check, three-minute demo script, and implementation-risk review.

## Automation boundaries

Safe to automate within the repository:

- Scaffolding and implementation.
- Tests and WebMCP tool evals.
- README, license, architecture notes, and submission-description drafts.
- Deployment configuration.
- Demo seed data and repeatable demo scripts.
- Compliance and submission checklists.
- Repository and live-site validation.

Likely requires the entrant's direct account interaction or explicit approval:

- Devpost registration and final submission.
- Publishing a public GitHub repository if credentials are unavailable here.
- Hosting-provider authorization and production deployment when not already connected.
- Uploading/publishing the YouTube video.
- Accepting rules, licenses, platform terms, or prize documentation.
- Providing any private credentials or personal information.

Never claim an external account action succeeded unless it was verified through the relevant service.

## Lander 3 control-run safety contract

The Lander 3 browser run is the control in the Lander 3 versus Lander 5 case study. It touches the live application, so every automated run must fail closed unless all of these conditions are true:

- Use the established test phone `3475952059`; the production API recognizes it through `isTestPhone(...)` and tags generated intake and tentative records with `isTest: true`.
- Send `testMode: true` and the `x-act-test-mode: 1` header for direct availability probes.
- Confirm the response reports `isTest: true` before continuing past intake or availability.
- Never substitute a normal customer phone, email, payment method, or identity.
- Test tentatives must remain excluded from customer availability. The current Lander 3 availability query does this with `isTest: { $ne: true }` when it loads active holds.
- After each run, expire active test tentatives for that intake code and verify `activeCount === 0`.
- If cleanup cannot connect, cannot identify the intake code, or leaves an active tentative, report the benchmark as failed; do not silently call it a pass.
- Do not run repeated production benchmarks until notification behavior is contained. The current test path skips admin SMS and some approval side effects, but quote/booking Slack and admin-email paths are not all visibly guarded by `!testMode`, and the final customer confirmation email has no obvious test-mode guard.

### Card behavior: business policy versus current implementation

- Business policy supplied by the owner: a card is optional when a customer first requests or reserves an appointment.
- Current Lander 3 quote intake already works without a card and can create a 48-business-hour tentative slot.
- Current Lander 3 return-page UI nevertheless lists `Card Hold` as required for its **Complete Booking** action and calls Stripe `confirmCardSetup` before completing that UI path.
- The current `complete-booking` API does not validate Stripe IDs as required request fields, but that implementation detail is not sufficient evidence that bypassing the UI is an approved or fully safe no-card production path.
- Lander 5 should model the stated policy explicitly: request/reserve without a card, display that no charge occurs, and offer a separate optional human-controlled add-card-later step. WebMCP tools must not collect or transmit raw card data.

## Verification gates

### Before implementation

- [ ] Re-read current Official Rules and challenge Updates.
- [ ] Confirm eligibility separately from competitiveness.
- [ ] Document a 0–5 score for every judging criterion.
- [ ] Check the Devpost gallery and official showcase for collisions.
- [ ] Define a complete under-three-minute demo narrative.
- [ ] Confirm all external data and assets can be legally used.
- [ ] Identify the smallest complete product that can be deployed in time.

### Before calling the app feature-complete

- [ ] Every advertised workflow works through the human UI.
- [ ] Every advertised agent workflow works through actual WebMCP tool calls.
- [ ] WebMCP is registered from the top-level page.
- [ ] Tools have strict schemas, accurate descriptions, useful results, and appropriate annotations.
- [ ] Consequential actions have confirmation and visible results.
- [ ] The non-WebMCP fallback remains functional.
- [ ] Tests cover successful calls, invalid inputs, failed calls, stale state, and unsupported browsers.
- [ ] The app has been tested in the exact judging environments available to us.
- [ ] A fresh unauthenticated judge can reach and understand the demo.

### Before submission

- [ ] Live URL works from a clean browser.
- [ ] Public repository works and contains all required source and instructions.
- [ ] Open-source license is present and detected by the repository host.
- [ ] README explains setup, architecture, tool list, security model, and what was built during the challenge.
- [ ] Commit history supports the project timeline.
- [ ] Public YouTube video is under three minutes and includes clear audio.
- [ ] Video visibly demonstrates WebMCP actions, not merely ordinary UI or narration.
- [ ] Devpost description answers every required question.
- [ ] All submission material is in English.
- [ ] No unlicensed music, trademarks, copyrighted assets, private data, or secrets appear.
- [ ] All links are pasted into a saved Devpost draft and checked again.
- [ ] Final submission is completed before the internal noon ET target.

## Sources

- Official Rules: https://webmcp.devpost.com/rules
- Challenge overview and submission requirements: https://webmcp.devpost.com/
- Resources: https://webmcp.devpost.com/resources
- Project gallery: https://webmcp.devpost.com/project-gallery
- OpenAI challenge page: https://openai.com/webmcp-challenge/
- OpenAI Docs — Site tools/WebMCP: https://learn.chatgpt.com/docs/webmcp
- OpenAI showcase: https://developers.openai.com/showcase
- WebMCP specification: https://webmachinelearning.github.io/webmcp/
- Chrome WebMCP documentation: https://developer.chrome.com/docs/ai/webmcp

## Maintenance rule

This file is a living checklist. Whenever the rules, challenge updates, browser support, project concept, or submission status changes, update the date and the affected section. Do not silently rely on stale assumptions.
