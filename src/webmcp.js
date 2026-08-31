export const TOOL_DEFINITIONS = [
  {
    name: 'get_booking_context',
    description: 'Start here. Read Lander 5 policies, required fields, supported ZIP codes, current progress, and the safest next action. This never creates a booking.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'set_cleaning_request',
    description: 'Fill or revise the visible cleaning-request draft. This clears stale quotes and slot selections but does not submit, reserve, contact anyone, or handle payment data.',
    inputSchema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', maxLength: 60 },
        phone: { type: 'string', maxLength: 30 },
        zipCode: { type: 'string', pattern: '^\\d{5}$' },
        contactPreference: { type: 'string', enum: ['text', 'call', 'email'] },
        discoverySource: { type: 'string', enum: ['google', 'referral', 'social', 'other'] },
        cleaningType: { type: 'string', enum: ['standard', 'deep', 'move'] },
        frequency: { type: 'string', enum: ['one-time', 'weekly', 'biweekly', 'monthly'] },
        squareFeet: { type: 'number', minimum: 500, maximum: 12000 },
        bedrooms: { type: 'integer', minimum: 0, maximum: 12 },
        bathrooms: { type: 'number', minimum: 0, maximum: 12 },
        stories: { type: 'string', enum: ['one', 'two', 'three-plus'] },
        condition: { type: 'string', enum: ['good', 'fair', 'poor'] },
        pets: { type: 'boolean' },
        blinds: { type: 'boolean' },
        flooringTypes: { type: 'array', minItems: 1, uniqueItems: true, items: { type: 'string', enum: ['tile', 'hardwood', 'carpet', 'vinyl', 'other'] } },
        ceilingFanHeight: { type: 'number', minimum: 7, maximum: 20 },
        kitchenSurfaceReadiness: { type: 'string', enum: ['clear', 'some-items', 'cluttered'] },
        bathroomSurfaceReadiness: { type: 'string', enum: ['clear', 'some-items', 'cluttered'] },
        accessibleSurfaces: { type: 'boolean' },
        cleaningScope: { type: 'string', enum: ['entire', 'partial'] },
        dustLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
        occupants: { type: 'integer', minimum: 0, maximum: 20 },
        lastProfessionalCleaning: { type: 'string', enum: ['within-month', '1-3-months', '3-6-months', '6-12-months', 'over-year', 'never'] },
        heavyCleaning: { type: 'boolean' },
        extraWindowCount: { type: 'integer', minimum: 0, maximum: 20 },
        addOns: { type: 'array', uniqueItems: true, items: { type: 'string', enum: ['oven', 'fridge', 'windows', 'baseboards'] } },
        notes: { type: 'string', maxLength: 500 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'calculate_quote',
    description: 'Calculate and display an experimental price range from the current draft. This estimate is not a final price and creates no reservation.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'find_available_slots',
    description: 'Return experimental appointment windows appropriate for the current quote. Results are sandbox data and do not alter production inventory.',
    inputSchema: { type: 'object', properties: { limit: { type: 'integer', minimum: 1, maximum: 6, default: 4 } }, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'select_tentative_slot',
    description: 'Select one of the currently offered appointment windows for review. This does not hold or reserve the appointment.',
    inputSchema: { type: 'object', properties: { slotId: { type: 'string', minLength: 1 } }, required: ['slotId'], additionalProperties: false },
  },
  {
    name: 'prepare_booking_review',
    description: 'Prepare a visible summary of customer, service, estimate, date, and terms. The customer must approve it in the page before a reservation can be requested.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'request_reservation',
    description: 'Consequential final step. Record a sandbox reservation only after the visible customer approval. No card is needed, no money is charged, and no production slot is consumed.',
    inputSchema: { type: 'object', properties: { confirmed: { type: 'boolean', const: true } }, required: ['confirmed'], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  },
  {
    name: 'get_booking_status',
    description: 'Read whether a review, customer approval, or sandbox reservation exists. This never changes state.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
];

export async function installWebMcp(engine) {
  const registered = [];
  const modelContext = document.modelContext;
  // The benchmark bridge is deliberately separate from the browser API. It is
  // installed even in ordinary browsers so CI can exercise the shared engine.
  window.__LANDER5_BENCHMARK__ = {
    definitions: TOOL_DEFINITIONS,
    invoke: (name, input = {}) => engine.run(name, input),
    getState: engine.getState,
    reset: engine.reset,
  };

  for (const definition of TOOL_DEFINITIONS) {
    // Chrome's imperative WebMCP API expects a string result from execute.
    const execute = async (input = {}) => JSON.stringify(engine.run(definition.name, input));
    if (modelContext?.registerTool) {
      await modelContext.registerTool({ ...definition, execute });
      registered.push(definition.name);
    }
  }
  return registered;
}
