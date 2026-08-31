# Lander 5 judge and verification instructions

## Public test

1. Open https://newyorkdev.github.io/lander5-webmcp/ in a browser with WebMCP site tools enabled.
2. Discover the eight registered tools.
3. Use `get_booking_context`, then provide the complete scenario from `src/demo-scenario.js` to `set_cleaning_request`.
4. Call `calculate_quote`, `find_available_slots`, select the first slot, and call `prepare_booking_review`.
5. Verify the visible page shows the supplied full intake, Standard cleaning, the estimate, and no card requirement.
6. Call `request_reservation` before clicking approval; it must fail closed.
7. Click **Approve reservation request**, then call `request_reservation` with `confirmed: true`.
8. Verify `sandbox_requested`, `cardOnFile: false`, and `consumesProductionInventory: false`.

No login, credentials, card, or real customer data are required.

## Reproducible local checks

```bash
npm install
npm test
npm run build
npm run benchmark
```

Current verified result: 6/6 tests pass; 25/25 benchmark runs succeed. The median complete sandbox workflow uses 7 tool calls and approximately 399 input + 1,249 output JSON I/O tokens. These are `ceil(serialized characters / 4)` estimates, not provider-billed model usage.
