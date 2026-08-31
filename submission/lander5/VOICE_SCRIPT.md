# Lander 5 voice script

Target speaking time: approximately 2 minutes 20 seconds. Read this naturally while following `VIDEO_SCRIPT.md`. Do not read the headings aloud.

## Voiceover

Affordable Cleaning Today is a real cleaning company with a detailed production quote form. It works for people, but an AI agent traditionally has to inspect a long page, find each control, scroll, click, type, and recover whenever the interface changes.

For the WebMCP Challenge, I built Lander 5: Cleaning at Conversation Speed.

Lander 5 keeps the real cleaning intake, but publishes the workflow as eight structured WebMCP tools. The human form and the agent tools share the same state, so everything the agent changes appears immediately on the screen and remains editable by the customer.

This is not a shortened lead form. I audited the current production Lander 3 flow and represented fifty-seven customer-facing question concepts. That includes contact and access information, the home profile, cleaning condition, frequency, appliances, move readiness, partial cleaning, bathroom configuration, add-ons, allergies, products to avoid, and scheduling. Conditional questions are completed whenever they apply.

Here, the agent uses the structured tools to enter a complete standard-cleaning request, calculate the estimate, find appointment options, select a time, and prepare the visible review.

Notice that the requested service remains a standard cleaning. The system does not silently change it to a deep cleaning. The customer can review the home details, scope, price range, appointment window, and the no-card policy before anything is requested.

Now I’ll ask the agent to reserve the appointment before I approve it.

The action fails closed. The final tool requires two separate signals: confirmation from the agent and an approval click from the person in the rendered page.

After I approve this exact summary, the agent can try again. The result is a sandbox reservation reference. No card was collected, no money was charged, no customer notification was sent, and no production appointment inventory was consumed.

The page also exposes its tool activity and measurement directly. Across twenty-five full-intake benchmark runs, all twenty-five succeeded. The complete seven-call workflow measured approximately one thousand six hundred forty-eight estimated JSON input-and-output tokens. That is an openly documented payload-size estimate, not a claim about provider-billed model tokens.

Lander 5 demonstrates how a real local-service website can let an AI agent handle tedious form work while the customer keeps visibility, control, and the final say.
