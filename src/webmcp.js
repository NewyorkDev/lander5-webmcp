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
        cleaningType: { type: 'string', enum: ['standard', 'deep', 'move'] },
        frequency: { type: 'string', enum: ['one-time', 'weekly', 'biweekly', 'monthly'] },
        squareFeet: { type: 'number', minimum: 500, maximum: 12000 },
        bedrooms: { type: 'integer', minimum: 0, maximum: 12 },
        bathrooms: { type: 'number', minimum: 0, maximum: 12 },
        condition: { type: 'string', enum: ['light', 'average', 'heavy'] },
        pets: { type: 'boolean' },
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

function toolResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value) }] };
}

export function installWebMcp(engine) {
  const registered = [];
  const modelContext = document.modelContext;
  for (const definition of TOOL_DEFINITIONS) {
    const execute = async (input = {}) => toolResult(engine.run(definition.name, input));
    if (modelContext?.registerTool) {
      modelContext.registerTool({ ...definition, execute });
      registered.push(definition.name);
    }
  }

  // The benchmark invokes the exact same engine as WebMCP without pretending
  // ordinary Playwright calls are model-originated WebMCP calls.
  window.__LANDER5_BENCHMARK__ = {
    definitions: TOOL_DEFINITIONS,
    invoke: (name, input = {}) => engine.run(name, input),
    getState: engine.getState,
    reset: engine.reset,
  };
  return registered;
}
