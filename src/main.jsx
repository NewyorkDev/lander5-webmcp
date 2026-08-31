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
    setRegistered(installWebMcp(engine));
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
              <Field label="Mobile phone"><input value={request.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(561) 555-0142" inputMode="tel" /></Field>
              <Field label="Service ZIP"><input value={request.zipCode} onChange={(e) => update({ zipCode: e.target.value })} placeholder="33401" inputMode="numeric" maxLength="5" /></Field>
              <Field label="Home size"><div className="input-suffix"><input type="number" min="500" max="12000" value={request.squareFeet} onChange={(e) => update({ squareFeet: Number(e.target.value) })} /><span>sq ft</span></div></Field>
              <Field label="Cleaning type"><select value={request.cleaningType} onChange={(e) => update({ cleaningType: e.target.value })}><option value="standard">Standard cleaning</option><option value="deep">Deep cleaning</option><option value="move">Move-in / move-out</option></select></Field>
              <Field label="Frequency"><select value={request.frequency} onChange={(e) => update({ frequency: e.target.value })}><option value="one-time">One time</option><option value="weekly">Weekly</option><option value="biweekly">Every two weeks</option><option value="monthly">Monthly</option></select></Field>
              <Field label="Bedrooms"><input type="number" min="0" max="12" value={request.bedrooms} onChange={(e) => update({ bedrooms: Number(e.target.value) })} /></Field>
              <Field label="Bathrooms"><input type="number" min="0" max="12" step="0.5" value={request.bathrooms} onChange={(e) => update({ bathrooms: Number(e.target.value) })} /></Field>
              <Field label="Current condition"><select value={request.condition} onChange={(e) => update({ condition: e.target.value })}><option value="light">Light upkeep</option><option value="average">Average lived-in</option><option value="heavy">Needs extra attention</option></select></Field>
              <Field label="Pets in the home"><select value={request.pets ? 'yes' : 'no'} onChange={(e) => update({ pets: e.target.value === 'yes' })}><option value="no">No</option><option value="yes">Yes</option></select></Field>
            </div>

            <fieldset className="addons"><legend>Optional add-ons</legend>{Object.entries({ oven: 'Inside oven', fridge: 'Inside refrigerator', windows: 'Interior windows', baseboards: 'Detailed baseboards' }).map(([value, label]) => <label key={value}><input type="checkbox" checked={request.addOns.includes(value)} onChange={() => update({ addOns: request.addOns.includes(value) ? request.addOns.filter((item) => item !== value) : [...request.addOns, value] })} /><span>{label}</span></label>)}</fieldset>

            <button className="primary" onClick={() => run('calculate_quote')}>Calculate my estimate</button>

            {quote && <section className="result-card"><p className="step">02 · Your estimate</p><div className="price">{money(quote.low)}–{money(quote.high)}</div><p>Estimated visit range · final scope confirmed by the office.</p><button className="secondary" onClick={() => run('find_available_slots', { limit: 6 })}>See appointment options</button></section>}

            {slots.length > 0 && <section className="slots"><p className="step">03 · Choose a time</p><h2>Available appointment windows</h2><div className="slot-grid">{slots.map((slot) => <button className={request.selectedSlotId === slot.id ? 'slot selected' : 'slot'} key={slot.id} onClick={() => run('select_tentative_slot', { slotId: slot.id })}><strong>{new Date(`${slot.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong><span>{slot.window}</span><small>{slot.team}</small></button>)}</div>{request.selectedSlotId && <button className="primary" onClick={() => run('prepare_booking_review')}>Review reservation request</button>}</section>}

            {review && <section className="review-card"><p className="step">04 · Your approval</p><h2>Review before anything is reserved</h2><dl><div><dt>Cleaning</dt><dd>{review.service.cleaningType} · {review.service.squareFeet.toLocaleString()} sq ft</dd></div><div><dt>Estimate</dt><dd>{money(review.quote.low)}–{money(review.quote.high)}</dd></div><div><dt>Requested time</dt><dd>{review.slot.date} · {review.slot.window}</dd></div><div><dt>Payment</dt><dd>No card required · $0 charged</dd></div></dl><div className="terms">{review.terms.map((term) => <span key={term}>✓ {term}</span>)}</div>{!customerApproved ? <button className="approve" onClick={() => { engine.approve(); setNotice('Customer approval recorded.'); }}>Approve reservation request</button> : <div className="approved"><span>✓ You approved this exact summary</span><button className="primary" onClick={() => run('request_reservation', { confirmed: true })}>Request this appointment</button></div>}</section>}

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
      <footer><span>Lander 5 · WebMCP Challenge experiment</span><span>Affordable Cleaning Today · Palm Beach County</span></footer>
      <div className={notice ? 'toast visible' : 'toast'} role="status" onAnimationEnd={() => setNotice('')}>{notice}</div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
