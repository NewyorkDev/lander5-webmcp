const INITIAL_REQUEST = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  zipCode: '',
  serviceAddress: '',
  aptSuite: '',
  gateCode: '',
  communityName: '',
  contactPreference: 'text',
  availabilityTextConsent: true,
  discoverySource: 'google',
  cleaningType: 'standard',
  frequency: 'one-time',
  serviceFrequency: 'onetime',
  recurringFrequency: 'not-applicable',
  recurringFlexCommitment: false,
  ovenCleaning: false,
  fridgeCleaning: false,
  ovenCondition: 'not-applicable',
  fridgeReadyState: 'not-applicable',
  moveReadiness: [],
  squareFeet: 1500,
  bedrooms: 3,
  bathrooms: 2,
  roomsToClean: 'all listed bedrooms and bathrooms',
  stories: 'one',
  pets: false,
  petHair: 'none',
  blinds: false,
  baseboards: false,
  previousCleaningIncluded: [],
  flooringTypes: ['tile', 'hardwood'],
  ceilingFanHeight: 9,
  kitchenSurfaceReadiness: 'clear',
  bathroomSurfaceReadiness: 'clear',
  accessibleSurfaces: true,
  cleaningScope: 'entire',
  partsToClean: [],
  partsDescription: '',
  deepCleanReason: '',
  condition: 'fair',
  dustLevel: 'medium',
  occupants: 2,
  lastProfessionalCleaning: '3-6-months',
  heavyCleaning: false,
  heavyCleaningDescription: 'No heavy cleaning reported.',
  extraWindowCount: 5,
  bathroomDeepDetailCount: 0,
  kitchenDeepDetailArea: 'none',
  addOns: [],
  bathroomTypes: [],
  allergies: '',
  avoidProducts: '',
  specialInstructions: '',
  preferredTimeWindow: 'morning',
  dateFirmness: 'flexible',
  selectedSlotId: null,
  notes: '',
};

const ADD_ON_PRICES = {
  'deep-upgrade': 80,
  'deeper-clean': 100,
  'baseboards-only': 40,
  'blinds-only': 40,
  'oven-handwash': 40,
  'fridge-handwash': 35,
  'oven-steam': 85,
  'fridge-steam': 80,
  'light-soap-scum': 50,
  'heavy-soap-scum': 100,
  'tile-grout': 200,
  'maid-services': 40,
  'bathroom-deep-detail': 40,
  'kitchen-deep-detail': 40,
  'extra-windows': 0,
};
const TYPE_MULTIPLIER = { standard: 1, deep: 1.55, 'move-exterior': 1.65, 'move-complete': 1.8 };
const CONDITION_MULTIPLIER = { good: 0.9, fair: 1, poor: 1.3 };
const FREQUENCY_DISCOUNT = { 'one-time': 0, weekly: 0.18, biweekly: 0.12, monthly: 0.07 };

export function initialState() {
  return {
    request: { ...INITIAL_REQUEST, addOns: [] },
    quote: null,
    slots: [],
    review: null,
    customerApproved: false,
    reservation: null,
    events: [],
  };
}

function assertChoice(value, choices, field) {
  if (!choices.includes(value)) throw new Error(`${field} must be one of: ${choices.join(', ')}`);
}

function validateRequest(request, { contact = false } = {}) {
  if (!Number.isFinite(Number(request.squareFeet)) || Number(request.squareFeet) < 500 || Number(request.squareFeet) > 12000) {
    throw new Error('squareFeet must be between 500 and 12000');
  }
  if (!/^\d{5}$/.test(String(request.zipCode || ''))) throw new Error('zipCode must be five digits');
  assertChoice(request.cleaningType, Object.keys(TYPE_MULTIPLIER), 'cleaningType');
  assertChoice(request.frequency, Object.keys(FREQUENCY_DISCOUNT), 'frequency');
  assertChoice(request.condition, Object.keys(CONDITION_MULTIPLIER), 'condition');
  assertChoice(request.stories, ['one', 'two', 'three-plus'], 'stories');
  assertChoice(request.dustLevel, ['low', 'medium', 'high'], 'dustLevel');
  assertChoice(request.cleaningScope, ['entire', 'partial'], 'cleaningScope');
  if (!Array.isArray(request.flooringTypes) || request.flooringTypes.length === 0) throw new Error('At least one flooring type is required');
  if (contact) {
    if (!String(request.firstName || '').trim()) throw new Error('firstName is required to reserve');
    if (!String(request.lastName || '').trim()) throw new Error('lastName is required to reserve');
    if (!/^\D*\d(?:\D*\d){9}\D*$/.test(String(request.phone || ''))) throw new Error('phone must contain 10 digits');
    if (!/^\S+@\S+\.\S+$/.test(String(request.email || ''))) throw new Error('email must be valid');
    if (!String(request.serviceAddress || '').trim()) throw new Error('serviceAddress is required to reserve');
    if (!String(request.gateCode || '').trim()) throw new Error('gateCode is required; use None when there is no gate');
    if (!Array.isArray(request.bathroomTypes) || request.bathroomTypes.length === 0) throw new Error('At least one bathroom type is required');
    if (!String(request.allergies || '').trim()) throw new Error('allergies is required; use None when there are none');
    if (!String(request.avoidProducts || '').trim()) throw new Error('avoidProducts is required; use None when there are none');
    if (request.cleaningScope === 'partial' && String(request.partsDescription || '').trim().split(/\s+/).filter(Boolean).length < 5) throw new Error('partsDescription must contain at least five words for a partial cleaning');
    if (request.heavyCleaning && String(request.heavyCleaningDescription || '').trim().split(/\s+/).filter(Boolean).length < 5) throw new Error('heavyCleaningDescription must contain at least five words when heavy cleaning is selected');
    if (request.cleaningType.startsWith('move-') && !request.moveReadiness.length) throw new Error('moveReadiness is required for move cleaning');
    if (request.ovenCleaning && request.ovenCondition === 'not-applicable') throw new Error('ovenCondition is required when oven cleaning is selected');
    if (request.fridgeCleaning && request.fridgeReadyState === 'not-applicable') throw new Error('fridgeReadyState is required when refrigerator cleaning is selected');
  }
}

function nextBusinessDates(count = 6) {
  const dates = [];
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  while (dates.length < count) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) dates.push(new Date(date));
  }
  return dates;
}

function buildSlots(request) {
  return nextBusinessDates().map((date, index) => {
    const iso = date.toISOString().slice(0, 10);
    const afternoon = index % 2 === 1;
    return {
      id: `${iso}-${afternoon ? 'pm' : 'am'}`,
      date: iso,
      window: afternoon ? '1:00–3:00 PM' : '9:00–11:00 AM',
      team: Number(request.squareFeet) >= 2400 || request.cleaningType !== 'standard' ? 'Two-cleaner team' : 'Cleaning professional',
      status: 'available',
    };
  });
}

function estimateTokens(value) {
  return Math.ceil(JSON.stringify(value ?? null).length / 4);
}

export function createBookingEngine({ onChange = () => {}, now = () => Date.now() } = {}) {
  let state = initialState();

  function publish() {
    onChange(structuredClone(state));
  }

  function log(tool, input, output, startedAt) {
    state.events.push({
      tool,
      at: new Date().toISOString(),
      durationMs: Math.max(0, now() - startedAt),
      inputTokensEstimated: estimateTokens(input),
      outputTokensEstimated: estimateTokens(output),
    });
    publish();
    return output;
  }

  function run(tool, input = {}) {
    const startedAt = now();
    let output;
    switch (tool) {
      case 'get_booking_context':
        output = {
          mode: 'experimental_sandbox',
          cardRequiredToReserve: false,
          rawCardDataAccepted: false,
          supportedZipCodes: ['33556', '34637', '34638', '34639', '34652', '34653', '34654', '34655', '34667', '34668', '34669'],
          requiredToQuote: ['zipCode', 'cleaningType', 'frequency', 'squareFeet', 'condition'],
          requiredToReserve: ['full production-equivalent intake excluding payment', 'selectedSlotId', 'customer approval'],
          productionQuestionParity: 'full intake questions represented; payment, billing-only, uploads, tracking, and operational fields excluded',
          nextBestAction: state.quote ? (state.request.selectedSlotId ? 'prepare_booking_review' : 'find_available_slots') : 'set_cleaning_request',
        };
        break;

      case 'set_cleaning_request': {
        const allowed = Object.keys(INITIAL_REQUEST);
        const patch = Object.fromEntries(Object.entries(input).filter(([key]) => allowed.includes(key) && key !== 'selectedSlotId'));
        if (patch.addOns) {
          if (!Array.isArray(patch.addOns) || patch.addOns.some((item) => !(item in ADD_ON_PRICES))) throw new Error(`addOns may include: ${Object.keys(ADD_ON_PRICES).join(', ')}`);
          patch.addOns = [...new Set(patch.addOns)];
        }
        state.request = { ...state.request, ...patch, selectedSlotId: null };
        state.quote = null;
        state.slots = [];
        state.review = null;
        state.customerApproved = false;
        state.reservation = null;
        output = { updated: Object.keys(patch), totalVisibleIntakeFields: Object.keys(state.request).filter((key) => key !== 'selectedSlotId').length, nextBestAction: 'calculate_quote' };
        break;
      }

      case 'calculate_quote': {
        validateRequest(state.request);
        const base = 72 + Number(state.request.squareFeet) * 0.075 + Number(state.request.bedrooms) * 8 + Number(state.request.bathrooms) * 14;
        const addOns = state.request.addOns.reduce((total, item) => total + ADD_ON_PRICES[item], 0) + (Number(state.request.extraWindowCount) || 0) * 12;
        const detailFactor = state.request.dustLevel === 'high' || state.request.heavyCleaning ? 1.2 : 1;
        const beforeDiscount = base * TYPE_MULTIPLIER[state.request.cleaningType] * CONDITION_MULTIPLIER[state.request.condition] * detailFactor + addOns + (state.request.pets ? 15 : 0);
        const midpoint = Math.round(beforeDiscount * (1 - FREQUENCY_DISCOUNT[state.request.frequency]));
        state.quote = {
          low: Math.max(99, midpoint - 20),
          high: midpoint + 25,
          currency: 'USD',
          estimateOnly: true,
          cardRequiredToReserve: false,
          requestedCleaningType: state.request.cleaningType,
          automaticTypeChange: false,
        };
        output = { quote: state.quote, nextBestAction: 'find_available_slots' };
        break;
      }

      case 'find_available_slots':
        if (!state.quote) throw new Error('Calculate a quote before finding slots');
        state.slots = buildSlots(state.request);
        output = { slots: state.slots.slice(0, Number(input.limit) || 4), liveInventory: false, nextBestAction: 'select_tentative_slot' };
        break;

      case 'select_tentative_slot': {
        const slot = state.slots.find((candidate) => candidate.id === input.slotId);
        if (!slot) throw new Error('slotId is not one of the currently offered slots');
        state.request.selectedSlotId = slot.id;
        state.review = null;
        state.customerApproved = false;
        output = { selected: slot, held: false, message: 'Selection prepared. No appointment is held until the customer approves the review.' };
        break;
      }

      case 'prepare_booking_review': {
        validateRequest(state.request, { contact: true });
        const slot = state.slots.find((candidate) => candidate.id === state.request.selectedSlotId);
        if (!slot) throw new Error('Select a currently offered slot first');
        state.review = {
          customer: {
            fullName: `${state.request.firstName} ${state.request.lastName}`.trim(),
            email: state.request.email,
            phoneEnding: String(state.request.phone).replace(/\D/g, '').slice(-4),
          },
          service: {
            zipCode: state.request.zipCode,
            serviceAddress: state.request.serviceAddress,
            aptSuite: state.request.aptSuite,
            gateCode: state.request.gateCode,
            communityName: state.request.communityName,
            contactPreference: state.request.contactPreference,
            availabilityTextConsent: state.request.availabilityTextConsent,
            discoverySource: state.request.discoverySource,
            cleaningType: state.request.cleaningType,
            frequency: state.request.frequency,
            serviceFrequency: state.request.serviceFrequency,
            recurringFrequency: state.request.recurringFrequency,
            recurringFlexCommitment: state.request.recurringFlexCommitment,
            ovenCleaning: state.request.ovenCleaning,
            fridgeCleaning: state.request.fridgeCleaning,
            ovenCondition: state.request.ovenCondition,
            fridgeReadyState: state.request.fridgeReadyState,
            moveReadiness: state.request.moveReadiness,
            squareFeet: Number(state.request.squareFeet),
            bedrooms: Number(state.request.bedrooms),
            bathrooms: Number(state.request.bathrooms),
            roomsToClean: state.request.roomsToClean,
            stories: state.request.stories,
            pets: state.request.pets,
            petHair: state.request.petHair,
            blinds: state.request.blinds,
            baseboards: state.request.baseboards,
            previousCleaningIncluded: state.request.previousCleaningIncluded,
            flooringTypes: state.request.flooringTypes,
            ceilingFanHeight: Number(state.request.ceilingFanHeight),
            kitchenSurfaceReadiness: state.request.kitchenSurfaceReadiness,
            bathroomSurfaceReadiness: state.request.bathroomSurfaceReadiness,
            accessibleSurfaces: state.request.accessibleSurfaces,
            cleaningScope: state.request.cleaningScope,
            partsToClean: state.request.partsToClean,
            partsDescription: state.request.partsDescription,
            deepCleanReason: state.request.deepCleanReason,
            condition: state.request.condition,
            dustLevel: state.request.dustLevel,
            occupants: Number(state.request.occupants),
            lastProfessionalCleaning: state.request.lastProfessionalCleaning,
            heavyCleaning: state.request.heavyCleaning,
            heavyCleaningDescription: state.request.heavyCleaningDescription,
            extraWindowCount: Number(state.request.extraWindowCount),
            bathroomDeepDetailCount: Number(state.request.bathroomDeepDetailCount),
            kitchenDeepDetailArea: state.request.kitchenDeepDetailArea,
            addOns: state.request.addOns,
            bathroomTypes: state.request.bathroomTypes,
            allergies: state.request.allergies,
            avoidProducts: state.request.avoidProducts,
            specialInstructions: state.request.specialInstructions,
            preferredTimeWindow: state.request.preferredTimeWindow,
            dateFirmness: state.request.dateFirmness,
          },
          slot,
          quote: state.quote,
          terms: ['This is an experimental reservation request.', 'No card is required or charged.', 'The office must confirm final availability and price.'],
        };
        state.customerApproved = false;
        output = { review: state.review, requiresHumanApproval: true, nextBestAction: 'Customer clicks Approve reservation request' };
        break;
      }

      case 'request_reservation': {
        if (!state.review) throw new Error('Prepare the booking review first');
        if (!state.customerApproved) throw new Error('Customer approval is required in the visible page before this tool can reserve');
        if (input.confirmed !== true) throw new Error('confirmed must be true for this consequential action');
        if (!state.reservation) {
          const suffix = Math.abs(JSON.stringify(state.review).split('').reduce((sum, char) => ((sum * 31) + char.charCodeAt(0)) | 0, 7)).toString().slice(0, 6).padStart(6, '0');
          state.reservation = {
            reference: `L5-${suffix}`,
            status: 'sandbox_requested',
            slot: state.review.slot,
            cardOnFile: false,
            consumesProductionInventory: false,
          };
        }
        output = { reservation: state.reservation, message: 'Sandbox request recorded. No production appointment or payment was created.' };
        break;
      }

      case 'get_booking_status':
        output = { reservation: state.reservation, approved: state.customerApproved, reviewPrepared: Boolean(state.review) };
        break;

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
    return log(tool, input, output, startedAt);
  }

  return {
    run,
    getState: () => structuredClone(state),
    approve() {
      if (!state.review) throw new Error('Prepare a booking review first');
      state.customerApproved = true;
      publish();
    },
    reset() {
      state = initialState();
      publish();
    },
    updateFromHuman(patch) {
      const events = state.events;
      run('set_cleaning_request', patch);
      state.events = events;
      publish();
    },
  };
}
