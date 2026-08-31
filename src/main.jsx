import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBookingEngine } from './booking-engine.js';
import { installWebMcp, TOOL_DEFINITIONS } from './webmcp.js';
import './styles.css';

function Field({ label, children, hint }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function App() {
  const [state, setState] = useState(null);
  const [notice, setNotice] = useState('');
  const [registered, setRegistered] = useState([]);
  const engine = useMemo(() => createBookingEngine({ onChange: setState }), []);

  useEffect(() => {
    setState(engine.getState());
    installWebMcp(engine)
      .then(setRegistered)
      .catch((error) => setNotice(`WebMCP registration failed: ${error.message}`));
  }, [engine]);

  if (!state) return null;
  const { request, quote, slots, review, customerApproved, reservation, events } = state;

  const update = (patch) => {
    try { engine.updateFromHuman(patch); setNotice('Draft updated.'); } catch (error) { setNotice(error.message); }
  };
  const run = (tool, input = {}) => {
    try { const result = engine.run(tool, input); setNotice(`${tool} completed.`); return result; } catch (error) { setNotice(error.message); }
  };

  return (
    <>
      <header className="topbar">
        <a href="#main" className="brand" aria-label="Affordable Cleaning Today Lander 5">
          <span className="brand-mark">ACT</span><span>Affordable Cleaning Today</span>
        </a>
        <div className="status"><i /> Experimental sandbox · no real booking</div>
      </header>

      <main id="main">
        <section className="hero">
          <div>
            <p className="eyebrow">Lander 5 · WebMCP experiment</p>
            <h1>A cleaning request that works at conversation speed.</h1>
            <p className="lede">Describe the home once. Your AI assistant can prepare the quote and appointment options while every decision stays visible to you.</p>
            <div className="trust-row">
              <span>✓ No card required</span><span>✓ You approve before reserving</span><span>✓ Sandbox only</span>
            </div>
          </div>
          <aside className="agent-card">
            <div className="agent-head"><span className="pulse" /><strong>Agent-ready</strong></div>
            <p>{registered.length ? `${registered.length} WebMCP tools registered in this browser.` : 'Human form ready. WebMCP becomes available in a supported browser.'}</p>
            <code>{state.reservation ? 'reservation requested' : state.review ? 'waiting for your approval' : quote ? 'quote ready · choose a time' : 'ready for your request'}</code>
          </aside>
        </section>

        <section className="workspace">
          <div className="form-panel">
            <div className="section-heading"><div><p className="step">01 · Cleaning details</p><h2>Tell us about the visit</h2></div><span className="human-badge">You can edit anything</span></div>
            <div className="grid two">
              <Field label="First name"><input value={request.firstName} onChange={(e) => update({ firstName: e.target.value })} placeholder="Jordan" /></Field>
              <Field label="Last name"><input value={request.lastName} onChange={(e) => update({ lastName: e.target.value })} placeholder="Taylor" /></Field>
              <Field label="Mobile phone"><input value={request.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(561) 555-0142" inputMode="tel" /></Field>
              <Field label="Email"><input type="email" value={request.email} onChange={(e) => update({ email: e.target.value })} placeholder="jordan@example.com" /></Field>
              <Field label="Service ZIP"><input value={request.zipCode} onChange={(e) => update({ zipCode: e.target.value })} placeholder="34638" inputMode="numeric" maxLength="5" /></Field>
              <Field label="Service address"><input value={request.serviceAddress} onChange={(e) => update({ serviceAddress: e.target.value })} placeholder="123 Sample Street" /></Field>
              <Field label="Apartment / suite"><input value={request.aptSuite} onChange={(e) => update({ aptSuite: e.target.value })} placeholder="Optional" /></Field>
              <Field label="Gate code"><input value={request.gateCode} onChange={(e) => update({ gateCode: e.target.value })} placeholder="Type None if there is no gate" /></Field>
              <Field label="Community name"><input value={request.communityName} onChange={(e) => update({ communityName: e.target.value })} placeholder="Optional" /></Field>
              <Field label="Contact preference"><select value={request.contactPreference} onChange={(e) => update({ contactPreference: e.target.value })}><option value="text">Text message</option><option value="call">Phone call</option><option value="email">Email</option></select></Field>
              <Field label="How did you hear about us?"><select value={request.discoverySource} onChange={(e) => update({ discoverySource: e.target.value })}><option value="google">Google</option><option value="referral">Referral</option><option value="social">Social media</option><option value="other">Other</option></select></Field>
              <Field label="Availability text consent"><select value={request.availabilityTextConsent ? 'yes' : 'no'} onChange={(e) => update({ availabilityTextConsent: e.target.value === 'yes' })}><option value="yes">Yes, text scheduling updates</option><option value="no">No scheduling texts</option></select></Field>
              <Field label="Home size"><div className="input-suffix"><input type="number" min="500" max="12000" value={request.squareFeet} onChange={(e) => update({ squareFeet: Number(e.target.value) })} /><span>sq ft</span></div></Field>
              <Field label="Cleaning type"><select value={request.cleaningType} onChange={(e) => update({ cleaningType: e.target.value })}><option value="standard">Standard cleaning</option><option value="deep">Deep cleaning</option><option value="move-exterior">Move-in/out exterior surfaces</option><option value="move-complete">Move-in/out complete</option></select></Field>
              <Field label="Service frequency intent"><select value={request.serviceFrequency} onChange={(e) => update({ serviceFrequency: e.target.value, frequency: e.target.value === 'recurring' ? (request.recurringFrequency === 'not-applicable' ? 'biweekly' : request.recurringFrequency) : 'one-time' })}><option value="onetime">One time</option><option value="onetime-maybe-recurring">One time, maybe recurring</option><option value="one-time-then-recurring">One time, then recurring</option><option value="recurring">Recurring service</option></select></Field>
              <Field label="Recurring cadence"><select value={request.recurringFrequency} onChange={(e) => update({ recurringFrequency: e.target.value, frequency: e.target.value === 'not-applicable' ? 'one-time' : e.target.value })}><option value="not-applicable">Not applicable</option><option value="weekly">Weekly</option><option value="biweekly">Every two weeks</option><option value="monthly">Monthly</option></select></Field>
              <Field label="Flexible recurring commitment"><select value={request.recurringFlexCommitment ? 'yes' : 'no'} onChange={(e) => update({ recurringFlexCommitment: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
              <Field label="Bedrooms"><input type="number" min="0" max="12" value={request.bedrooms} onChange={(e) => update({ bedrooms: Number(e.target.value) })} /></Field>
              <Field label="Bathrooms"><input type="number" min="0" max="12" step="0.5" value={request.bathrooms} onChange={(e) => update({ bathrooms: Number(e.target.value) })} /></Field>
              <Field label="Rooms to clean"><input value={request.roomsToClean} onChange={(e) => update({ roomsToClean: e.target.value })} /></Field>
              <Field label="Current condition"><select value={request.condition} onChange={(e) => update({ condition: e.target.value })}><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></select></Field>
              <Field label="Pets in the home"><select value={request.pets ? 'yes' : 'no'} onChange={(e) => update({ pets: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
              <Field label="Pet hair level"><select value={request.petHair} onChange={(e) => update({ petHair: e.target.value })}><option value="none">None</option><option value="light">Light</option><option value="noticeable">Noticeable</option><option value="heavy">Heavy</option></select></Field>
            </div>

            <details className="home-profile" open>
              <summary>Complete home profile <span>Same service questions as the Lander 3 control</span></summary>
              <div className="grid two profile-grid">
                <Field label="Stories"><select value={request.stories} onChange={(e) => update({ stories: e.target.value })}><option value="one">One story</option><option value="two">Two stories</option><option value="three-plus">Three or more</option></select></Field>
                <Field label="Dust level"><select value={request.dustLevel} onChange={(e) => update({ dustLevel: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></Field>
                <Field label="People residing in home"><input type="number" min="0" max="20" value={request.occupants} onChange={(e) => update({ occupants: Number(e.target.value) })} /></Field>
                <Field label="Last professional cleaning"><select value={request.lastProfessionalCleaning} onChange={(e) => update({ lastProfessionalCleaning: e.target.value })}><option value="within-month">Within one month</option><option value="1-3-months">1–3 months</option><option value="3-6-months">3–6 months</option><option value="6-12-months">6–12 months</option><option value="over-year">Over one year</option><option value="never">Never</option></select></Field>
                <Field label="Kitchen surfaces"><select value={request.kitchenSurfaceReadiness} onChange={(e) => update({ kitchenSurfaceReadiness: e.target.value })}><option value="clear">Clear and ready</option><option value="some-items">Some items</option><option value="cluttered">Cluttered</option></select></Field>
                <Field label="Bathroom surfaces"><select value={request.bathroomSurfaceReadiness} onChange={(e) => update({ bathroomSurfaceReadiness: e.target.value })}><option value="clear">Clear and ready</option><option value="some-items">Some items</option><option value="cluttered">Cluttered</option></select></Field>
                <Field label="Cleaning scope"><select value={request.cleaningScope} onChange={(e) => update({ cleaningScope: e.target.value })}><option value="entire">Entire home</option><option value="partial">Parts of home</option></select></Field>
                <Field label="Ceiling fan height"><div className="input-suffix"><input type="number" min="7" max="20" value={request.ceilingFanHeight} onChange={(e) => update({ ceilingFanHeight: Number(e.target.value) })} /><span>ft</span></div></Field>
                <Field label="Extra windows"><input type="number" min="0" max="20" value={request.extraWindowCount} onChange={(e) => update({ extraWindowCount: Number(e.target.value) })} /></Field>
                <Field label="Blinds cleaning"><select value={request.blinds ? 'yes' : 'no'} onChange={(e) => update({ blinds: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                <Field label="Baseboards cleaning"><select value={request.baseboards ? 'yes' : 'no'} onChange={(e) => update({ baseboards: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                <Field label="Heavy cleaning required"><select value={request.heavyCleaning ? 'yes' : 'no'} onChange={(e) => update({ heavyCleaning: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                <Field label="Other surfaces accessible"><select value={request.accessibleSurfaces ? 'yes' : 'no'} onChange={(e) => update({ accessibleSurfaces: e.target.value === 'yes' })}><option value="yes">Yes</option><option value="no">No</option></select></Field>
                <Field label="Preferred appointment window"><select value={request.preferredTimeWindow} onChange={(e) => update({ preferredTimeWindow: e.target.value })}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="either">Either</option></select></Field>
                <Field label="Date flexibility"><select value={request.dateFirmness} onChange={(e) => update({ dateFirmness: e.target.value })}><option value="flexible">Flexible</option><option value="firm">Firm</option></select></Field>
                <Field label="Bathroom deep-detail count"><input type="number" min="0" max="12" value={request.bathroomDeepDetailCount} onChange={(e) => update({ bathroomDeepDetailCount: Number(e.target.value) })} /></Field>
                <Field label="Kitchen deep-detail area"><select value={request.kitchenDeepDetailArea} onChange={(e) => update({ kitchenDeepDetailArea: e.target.value })}><option value="none">Not selected</option><option value="standard">Standard kitchen</option><option value="large">Large kitchen</option><option value="multiple">Multiple kitchen areas</option></select></Field>
              </div>
              <fieldset className="addons flooring"><legend>Flooring types</legend>{['tile', 'hardwood', 'carpet', 'vinyl', 'other'].map((value) => <label key={value}><input type="checkbox" checked={request.flooringTypes.includes(value)} onChange={() => update({ flooringTypes: request.flooringTypes.includes(value) ? request.flooringTypes.filter((item) => item !== value) : [...request.flooringTypes, value] })} /><span>{value[0].toUpperCase() + value.slice(1)}</span></label>)}</fieldset>
              <fieldset className="addons"><legend>Bathroom types</legend>{Object.entries({ 'tub-shower': 'Tub/shower combination', 'shower-only': 'Walk-in shower', 'tub-only': 'Tub only', 'half-bath': 'Half bathroom' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.bathroomTypes.includes(value)} onChange={() => update({ bathroomTypes: request.bathroomTypes.includes(value) ? request.bathroomTypes.filter((item) => item !== value) : [...request.bathroomTypes, value] })} /><span>{label}</span></label>)}</fieldset>
              <fieldset className="addons"><legend>Included in the last professional cleaning</legend>{Object.entries({ blinds: 'Blinds', baseboards: 'Baseboards' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.previousCleaningIncluded.includes(value)} onChange={() => update({ previousCleaningIncluded: request.previousCleaningIncluded.includes(value) ? request.previousCleaningIncluded.filter((item) => item !== value) : [...request.previousCleaningIncluded, value] })} /><span>{label}</span></label>)}</fieldset>
            </details>

            <details className="home-profile" open>
              <summary>Conditional service details <span>Move, appliance, partial-scope, and heavy-cleaning questions</span></summary>
              <div className="grid two profile-grid">
                <Field label="Oven interior cleaning"><select value={request.ovenCleaning ? 'yes' : 'no'} onChange={(e) => update({ ovenCleaning: e.target.value === 'yes', ovenCondition: e.target.value === 'yes' ? request.ovenCondition : 'not-applicable' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                <Field label="Oven condition"><select value={request.ovenCondition} onChange={(e) => update({ ovenCondition: e.target.value })}><option value="not-applicable">Not applicable</option><option value="light">Good condition</option><option value="moderate">Moderate buildup</option><option value="heavy">Heavy buildup</option></select></Field>
                <Field label="Refrigerator interior cleaning"><select value={request.fridgeCleaning ? 'yes' : 'no'} onChange={(e) => update({ fridgeCleaning: e.target.value === 'yes', fridgeReadyState: e.target.value === 'yes' ? request.fridgeReadyState : 'not-applicable' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
                <Field label="Refrigerator readiness"><select value={request.fridgeReadyState} onChange={(e) => update({ fridgeReadyState: e.target.value })}><option value="not-applicable">Not applicable</option><option value="ready">Empty and ready</option><option value="not-ready">Items still inside</option></select></Field>
                <Field label="Why this deep clean?"><textarea value={request.deepCleanReason} onChange={(e) => update({ deepCleanReason: e.target.value })} placeholder="Optional preparation context" /></Field>
                <Field label="Heavy-cleaning description"><textarea value={request.heavyCleaningDescription} onChange={(e) => update({ heavyCleaningDescription: e.target.value })} placeholder="At least five words when heavy cleaning is selected" /></Field>
                <Field label="Parts-of-home description"><textarea value={request.partsDescription} onChange={(e) => update({ partsDescription: e.target.value })} placeholder="At least five words for a partial cleaning" /></Field>
                <Field label="Special instructions"><textarea value={request.specialInstructions} onChange={(e) => update({ specialInstructions: e.target.value })} placeholder="Optional instructions for the office or team" /></Field>
              </div>
              <fieldset className="addons"><legend>Move readiness</legend>{Object.entries({ 'surfaces-clear': 'Surfaces are clear', 'cabinets-appliances-empty': 'Cabinets and appliances are empty', 'rooms-clear': 'Rooms are clear', 'security-deposit-ready': 'Ready for final inspection', 'partially-ready': 'Some belongings remain' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.moveReadiness.includes(value)} onChange={() => update({ moveReadiness: request.moveReadiness.includes(value) ? request.moveReadiness.filter((item) => item !== value) : [...request.moveReadiness, value] })} /><span>{label}</span></label>)}</fieldset>
              <fieldset className="addons"><legend>Areas in a partial cleaning</legend>{Object.entries({ floors: 'Floors', kitchen: 'Kitchen', bathrooms: 'Bathrooms', bedrooms: 'Bedrooms', 'living-areas': 'Living areas', other: 'Other' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.partsToClean.includes(value)} onChange={() => update({ partsToClean: request.partsToClean.includes(value) ? request.partsToClean.filter((item) => item !== value) : [...request.partsToClean, value] })} /><span>{label}</span></label>)}</fieldset>
            </details>

            <details className="home-profile" open>
              <summary>Products, sensitivities, and access <span>Production return-mode questions without payment</span></summary>
              <div className="grid two profile-grid">
                <Field label="Allergies or sensitivities"><textarea value={request.allergies} onChange={(e) => update({ allergies: e.target.value })} placeholder="Type None if there are none" /></Field>
                <Field label="Products to avoid"><textarea value={request.avoidProducts} onChange={(e) => update({ avoidProducts: e.target.value })} placeholder="Type None if there are none" /></Field>
              </div>
            </details>

            <fieldset className="addons comprehensive-addons"><legend>Production-equivalent optional add-ons</legend>{Object.entries({ 'deep-upgrade': 'Standard deep-clean upgrade', 'deeper-clean': 'Deeper clean option', 'baseboards-only': 'Baseboard hand-detail', 'blinds-only': 'Blind hand-detail', 'oven-handwash': 'Oven hand-wash', 'fridge-handwash': 'Refrigerator hand-wash', 'oven-steam': 'Oven steam clean', 'fridge-steam': 'Refrigerator steam clean', 'light-soap-scum': 'Light soap-scum removal', 'heavy-soap-scum': 'Heavy soap-scum removal', 'tile-grout': 'Tile and grout cleaning', 'maid-services': 'Maid services / extra chores', 'bathroom-deep-detail': 'Bathroom deep detail', 'kitchen-deep-detail': 'Kitchen deep detail', 'extra-windows': 'Extra interior windows' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.addOns.includes(value)} onChange={() => update({ addOns: request.addOns.includes(value) ? request.addOns.filter((item) => item !== value) : [...request.addOns, value] })} /><span>{label}</span></label>)}</fieldset>

            <button className="primary" onClick={() => run('calculate_quote')}>Calculate my estimate</button>

            {quote && <section className="result-card"><p className="step">02 · Your estimate</p><div className="price">{money(quote.low)}–{money(quote.high)}</div><p>Estimated visit range · final scope confirmed by the office.</p><button className="secondary" onClick={() => run('find_available_slots', { limit: 6 })}>See appointment options</button></section>}

            {slots.length > 0 && <section className="slots"><p className="step">03 · Choose a time</p><h2>Available appointment windows</h2><div className="slot-grid">{slots.map((slot) => <button className={request.selectedSlotId === slot.id ? 'slot selected' : 'slot'} key={slot.id} onClick={() => run('select_tentative_slot', { slotId: slot.id })}><strong>{new Date(`${slot.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong><span>{slot.window}</span><small>{slot.team}</small></button>)}</div>{request.selectedSlotId && <button className="primary" onClick={() => run('prepare_booking_review')}>Review reservation request</button>}</section>}

            {review && <section className="review-card"><p className="step">04 · Your approval</p><h2>Review before anything is reserved</h2><dl><div><dt>Cleaning requested</dt><dd>{review.service.cleaningType} · no automatic type change</dd></div><div><dt>Home</dt><dd>ZIP {review.service.zipCode} · {review.service.squareFeet.toLocaleString()} sq ft · {review.service.bedrooms} bed · {review.service.bathrooms} bath · {review.service.stories} story</dd></div><div><dt>Condition</dt><dd>{review.service.condition} · {review.service.dustLevel} dust · heavy cleaning: {review.service.heavyCleaning ? 'yes' : 'no'}</dd></div><div><dt>Scope</dt><dd>{review.service.cleaningScope} home · {review.service.flooringTypes.join(' + ')} · {review.service.extraWindowCount} extra windows</dd></div><div><dt>Estimate</dt><dd>{money(review.quote.low)}–{money(review.quote.high)}</dd></div><div><dt>Requested time</dt><dd>{review.slot.date} · {review.slot.window}</dd></div><div><dt>Payment</dt><dd>No card required · $0 charged</dd></div></dl><details className="review-details"><summary>See every service answer the agent supplied</summary><ul><li>Contact preference: {review.service.contactPreference}</li><li>Discovery source: {review.service.discoverySource}</li><li>Frequency: {review.service.frequency}</li><li>Pets: {review.service.pets ? 'yes' : 'no'} · blinds: {review.service.blinds ? 'yes' : 'no'}</li><li>Kitchen surfaces: {review.service.kitchenSurfaceReadiness}</li><li>Bathroom surfaces: {review.service.bathroomSurfaceReadiness}</li><li>Other surfaces accessible: {review.service.accessibleSurfaces ? 'yes' : 'no'}</li><li>Ceiling fan height: {review.service.ceilingFanHeight} ft</li><li>Occupants: {review.service.occupants}</li><li>Last professional cleaning: {review.service.lastProfessionalCleaning}</li><li>Add-ons: {review.service.addOns.length ? review.service.addOns.join(', ') : 'none beyond extra-window count'}</li></ul></details><div className="terms">{review.terms.map((term) => <span key={term}>✓ {term}</span>)}</div>{!customerApproved ? <button className="approve" onClick={() => { engine.approve(); setNotice('Customer approval recorded.'); }}>Approve reservation request</button> : <div className="approved"><span>✓ You approved this exact summary</span><button className="primary" onClick={() => run('request_reservation', { confirmed: true })}>Request this appointment</button></div>}</section>}

            {reservation && <section className="success"><div className="check">✓</div><div><p className="step">Sandbox request recorded</p><h2>Reference {reservation.reference}</h2><p>No production appointment or payment was created. This result is safe to use in a public demo.</p></div></section>}
          </div>

          <aside className="telemetry">
            <p className="step">Live WebMCP evidence</p><h2>What the agent did</h2><p className="muted">Each tool call is reflected in the page and measured. Token counts are transparent JSON-size estimates, not model-provider billing totals.</p>
            <div className="metrics"><div><strong>{events.length}</strong><span>tool calls</span></div><div><strong>{events.reduce((sum, event) => sum + event.inputTokensEstimated + event.outputTokensEstimated, 0)}</strong><span>estimated I/O tokens</span></div></div>
            <ol className="event-list">{events.slice().reverse().map((event, index) => <li key={`${event.at}-${index}`}><div><strong>{event.tool}</strong><span>{event.durationMs} ms</span></div><small>≈ {event.inputTokensEstimated + event.outputTokensEstimated} I/O tokens</small></li>)}</ol>
            {!events.length && <div className="empty">No tool calls yet. Human edits do not inflate the WebMCP benchmark.</div>}
            <details><summary>Published tool contract</summary><ul>{TOOL_DEFINITIONS.map((tool) => <li key={tool.name}><code>{tool.name}</code></li>)}</ul></details>
            <button className="text-button" onClick={() => { engine.reset(); setNotice('Sandbox reset.'); }}>Reset experiment</button>
          </aside>
        </section>
      </main>
      <footer><span>Lander 5 · WebMCP Challenge experiment</span><span>Affordable Cleaning Today · Florida</span></footer>
      <div className={notice ? 'toast visible' : 'toast'} role="status" onAnimationEnd={() => setNotice('')}>{notice}</div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
