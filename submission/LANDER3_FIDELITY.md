# Lander 3 → Lander 5 intake fidelity audit

Audited August 31, 2026 against the current production source at `clean-act/src/pages/lander3.jsx` and its display-value definitions.

## Result

Lander 5 represents **57 customer-facing intake question concepts**, including conditional questions. It is a full cleaning intake and scheduling workflow, not a shortened lead form. Payment is deliberately excluded.

| Production intake area | Lander 5 representation | Status |
| --- | --- | --- |
| Name, phone, email | First/last name, mobile, email | Included |
| Location and access | ZIP, address, apartment/suite, gate code, community | Included |
| Contact and consent | Contact preference, scheduling-text consent, discovery source | Included |
| Cleaning selection | Standard, deep, move exterior, move complete | Included |
| Frequency | One-time intent, possible recurring intent, cadence, flexible commitment | Included |
| Appliance service | Oven/fridge selection, oven condition, fridge readiness | Included conditionally |
| Move service | Five move-readiness answers | Included conditionally |
| Home profile | Square feet, bedrooms, bathrooms, rooms, stories, occupants | Included |
| Condition | Overall condition, dust, heavy-clean flag and five-word explanation | Included conditionally |
| Pets | Pets and pet-hair level | Included |
| Detail history | Last professional cleaning and whether blinds/baseboards were included | Included |
| Surfaces | Flooring, fan height, kitchen/bathroom readiness, other-surface access | Included |
| Scope | Entire/partial, selected areas, five-word description | Included conditionally |
| Deep-clean context | Reason for the deep clean | Included conditionally |
| Add-ons | All 15 current production-equivalent add-on choices and their detail counts/area | Included |
| Bathroom configuration | Tub/shower, shower-only, tub-only, half-bath | Included |
| Products and instructions | Allergies, products to avoid, special instructions | Included |
| Scheduling | Preferred window, date firmness, and selected offered slot | Included |

## Deliberate exclusions

| Excluded item | Reason |
| --- | --- |
| Card and Stripe fields | The business permits an initial request without a card; WebMCP accepts no raw card data. |
| Billing-only address questions | They exist solely for the excluded payment step. |
| Photo uploads | Binary attachments are outside this tool demo; the equivalent condition/move descriptions remain in the intake. |
| Tracking, UTM, analytics, and internal identifiers | These are metadata, not customer questions. |
| Legacy duplicate fields | `moveStatus`, legacy house-size values, and old time-slot mirrors are represented by their current canonical answers. |
| Budget-feedback telemetry | This is post-estimate product research, not required cleaning intake. |

The sandbox also prevents messages, payment, and production inventory changes. Those safety boundaries do not reduce the intake itself.
