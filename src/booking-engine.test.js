import { describe, expect, it } from 'vitest';
import { createBookingEngine } from './booking-engine.js';
import { installWebMcp, TOOL_DEFINITIONS } from './webmcp.js';

const scenario = {
  firstName: 'Health', phone: '3475952059', zipCode: '34638', contactPreference: 'text', discoverySource: 'google',
  cleaningType: 'standard', frequency: 'one-time', squareFeet: 1400, bedrooms: 3, bathrooms: 2, stories: 'one',
  condition: 'fair', dustLevel: 'medium', occupants: 2, pets: false, blinds: false,
  flooringTypes: ['tile', 'hardwood'], ceilingFanHeight: 9, kitchenSurfaceReadiness: 'clear',
  bathroomSurfaceReadiness: 'clear', accessibleSurfaces: true, cleaningScope: 'entire',
  lastProfessionalCleaning: '3-6-months', heavyCleaning: false, extraWindowCount: 5,
};

function reachReview(engine) {
  engine.run('set_cleaning_request', scenario);
  engine.run('calculate_quote');
  const { slots } = engine.run('find_available_slots', { limit: 3 });
  engine.run('select_tentative_slot', { slotId: slots[0].id });
  engine.run('prepare_booking_review');
}

describe('Lander 5 booking engine', () => {
  it('quotes and offers slots without a card', () => {
    const engine = createBookingEngine();
    engine.run('set_cleaning_request', scenario);
    const result = engine.run('calculate_quote');
    expect(result.quote.low).toBeGreaterThan(0);
    expect(result.quote.cardRequiredToReserve).toBe(false);
    expect(result.quote.requestedCleaningType).toBe('standard');
    expect(result.quote.automaticTypeChange).toBe(false);
    expect(engine.run('find_available_slots').slots.length).toBeGreaterThan(0);
  });

  it('fails closed before visible customer approval', () => {
    const engine = createBookingEngine();
    reachReview(engine);
    expect(engine.getState().review.service.cleaningType).toBe('standard');
    expect(() => engine.run('request_reservation', { confirmed: true })).toThrow(/Customer approval/);
  });

  it('records an idempotent sandbox reservation after approval', () => {
    const engine = createBookingEngine();
    reachReview(engine);
    engine.approve();
    const first = engine.run('request_reservation', { confirmed: true });
    const second = engine.run('request_reservation', { confirmed: true });
    expect(second.reservation.reference).toBe(first.reservation.reference);
    expect(first.reservation.cardOnFile).toBe(false);
    expect(first.reservation.consumesProductionInventory).toBe(false);
  });

  it('invalidates stale quote, slot, review, and approval when details change', () => {
    const engine = createBookingEngine();
    reachReview(engine);
    engine.approve();
    engine.run('set_cleaning_request', { squareFeet: 2200 });
    const state = engine.getState();
    expect(state.quote).toBeNull();
    expect(state.slots).toEqual([]);
    expect(state.review).toBeNull();
    expect(state.customerApproved).toBe(false);
  });

  it('rejects unknown add-ons and out-of-range square footage', () => {
    const engine = createBookingEngine();
    expect(() => engine.run('set_cleaning_request', { addOns: ['roof'] })).toThrow(/addOns/);
    engine.run('set_cleaning_request', { ...scenario, squareFeet: 100 });
    expect(() => engine.run('calculate_quote')).toThrow(/squareFeet/);
  });
});

describe('WebMCP registration', () => {
  it('registers every tool and delegates execution to the shared engine', async () => {
    const tools = [];
    globalThis.document = { modelContext: { registerTool: (tool) => tools.push(tool) } };
    globalThis.window = {};
    const engine = createBookingEngine();
    const registered = await installWebMcp(engine);
    expect(registered).toHaveLength(TOOL_DEFINITIONS.length);
    expect(tools.map((tool) => tool.name)).toEqual(TOOL_DEFINITIONS.map((tool) => tool.name));
    const result = await tools[0].execute({});
    expect(JSON.parse(result).mode).toBe('experimental_sandbox');
    delete globalThis.document;
    delete globalThis.window;
  });
});
