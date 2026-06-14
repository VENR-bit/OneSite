/* global React, PROJECT, DONATE_URL, fmt, LKR, Lotus, Ico, ICONS, Nav, Hero, About, Tech */
const { useState, useEffect, useRef, useMemo } = window;

const STORE_KEY = "rideekanda_pledges_v2";

// Google Sheets backend (Apps Script Web App /exec URL). When set, pledges are
// saved to the Sheet (POST) and the live shared list is loaded from it (GET).
// Empty = the page works on its own (seed + this browser's localStorage).
const PLEDGE_ENDPOINT = "https://script.google.com/macros/s/AKfycbwXroHe8dZGecXpSUGqU0EfmHTd63K7ZJY2T3LTAvribe-NFug7r88Ow6onfPWdnLaD2A/exec";

function postPledge(p) {
  if (!PLEDGE_ENDPOINT) return;
  try {
    fetch(PLEDGE_ENDPOINT, {
      method: "POST",
      mode: "no-cors",                                 // fire-and-forget; avoids CORS preflight
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: p.name, meters: p.feet }),
    }).catch(function () {});
  } catch (e) {}
}

const SEED = [
  { id: "s1", name: "The Silva Family", message: "For our late mother.", feet: 18 },
  { id: "s2", name: "Anonymous", message: "", feet: 30 },
  { id: "s3", name: "Dhamma Friends, Colombo", message: "May all beings be at ease.", feet: 23 },
  { id: "s4", name: "Nimal & Kumari", message: "", feet: 12 },
  { id: "s5", name: "A. Fernando", message: "In gratitude.", feet: 8 },
  { id: "s6", name: "Meditation Group, Kandy", message: "", feet: 15 },
];

function loadPledges() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) return p; }
  } catch (e) {}
  return SEED.slice();
}

/* ===================== PLEDGE CARD ===================== */
function PledgeCard({ remaining, onPledge, justPledged, onReset }) {
  const [name, setName] = useState("");
  const [feet, setFeet] = useState(1);
  const [err, setErr] = useState("");

  const ft = feet === "" ? 0 : feet;
  const cost = ft * PROJECT.costPerFoot;
  const quick = [1, 5, 10, 25, 50, 100];

  const clampFeet = (v) => Math.max(1, Math.min(remaining, v || 1));

  function submit() {
    if (!name.trim()) { setErr("Please add the name for the supporters list."); return; }
    if (remaining <= 0) { setErr("The road is fully pledged — thank you!"); return; }
    setErr("");
    onPledge({ name: name.trim(), feet: clampFeet(feet) });
    setName(""); setFeet(1);
  }

  if (justPledged) {
    const amount = `LKR ${fmt(justPledged.feet * PROJECT.costPerFoot)}`;
    const hasLink = DONATE_URL && DONATE_URL !== "#";
    return (
      <div className="pledge">
        <div style={{textAlign:"center", marginBottom: 6}}><Lotus className="lotus--mark" /></div>
        <h3 style={{textAlign:"center"}}>Your stretch is reserved.</h3>
        <p className="pledge__hint" style={{textAlign:"center"}}>
          You’ve pledged <b>{justPledged.feet} linear meters</b>. Complete your donation to lay the concrete —
          and join the supporters of this road.
        </p>
        <div className="pledge__cost">
          <span className="l">Amount to donate</span>
          <span className="v"><LKR>{fmt(justPledged.feet * PROJECT.costPerFoot)}</LKR></span>
        </div>
        <a className="btn btn--saffron btn--block" href={DONATE_URL}
           {...(hasLink ? { target: "_blank", rel: "noopener" } : {})}>
          <Ico d={ICONS.heart} style={{width:18,height:18}} /> Donate {amount}
        </a>
        <button className="btn btn--ghost btn--block" style={{marginTop:10}} onClick={onReset}>
          Pledge another stretch
        </button>
        <p className="pledge__note">
          {hasLink
            ? "Your name appears in the supporters list below once your stretch is pledged."
            : "A secure payment link will be added here shortly. Your stretch is already held on the road."}
        </p>
      </div>
    );
  }

  return (
    <div className="pledge">
      <h3>Pave a stretch of road</h3>
      <p className="pledge__hint">Choose how many linear meters to pledge. Each meter is <b>LKR&nbsp;8,878</b> of finished concrete.</p>

      <div className="field">
        <label>Your name — as it appears in the supporters list</label>
        <input className="input" value={name} placeholder="e.g. The Perera Family" onChange={(e)=>setName(e.target.value)} />
      </div>

      <div className="field">
        <label>Linear meters to pledge</label>
        <div className="feetfield">
          <input
            className="feetfield__input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={feet === "" ? "" : feet}
            placeholder="0"
            aria-label="Number of linear meters to pledge"
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, "");
              if (digits === "") { setFeet(""); return; }
              setFeet(Math.min(remaining, parseInt(digits, 10)));
            }}
            onBlur={() => setFeet((f) => (f === "" || f < 1 ? 1 : f))}
          />
          <span className="feetfield__suffix">linear&nbsp;meters</span>
        </div>
        <div className="quickset">
          {quick.map(q=>(
            <button key={q} className={feet===q?"on":""} onClick={()=>setFeet(clampFeet(q))}>{q} m</button>
          ))}
        </div>
      </div>

      {err && <p className="warn">{err}</p>}

      <div className="pledge__cost">
        <span className="l">{ft} m × LKR 8,878</span>
        <span className="v"><LKR>{fmt(cost)}</LKR></span>
      </div>

      <button className="btn btn--primary btn--block" onClick={submit} disabled={remaining<=0}>
        {remaining<=0 ? "Road fully pledged 🙏" : <>Pledge these {ft} meters <Ico d={ICONS.arrow} style={{width:18,height:18}}/></>}
      </button>
      <p className="pledge__note">{remaining>0 ? `${fmt(remaining)} m of road still open to pledge.` : "Every meter has found a donor."}</p>
    </div>
  );
}

/* ===================== PAVER SECTION ===================== */
function Paver({ pledges, pavedFeet, pct, remaining, onPledge, justPledged, setJustPledged }) {
  return (
    <section className="section paver" id="road">
      <div className="wrap">
        <div className="center" style={{maxWidth:720, margin:"0 auto"}}>
          <p className="kicker kicker--center">Pave the Road</p>
          <h2 className="title">Generosity, set in <span className="h-em">concrete</span>.</h2>
          <p className="lede">Each pledge lays a real stretch of the 610-meter road. Watch it pave, meter by meter, as the
            community comes together. The rough gravel that remains is the work still to be done.</p>
        </div>

        {/* 1 · Pledge a stretch */}
        <div className="paver__pledge">
          <PledgeCard
            remaining={remaining}
            onPledge={onPledge}
            justPledged={justPledged}
            onReset={() => setJustPledged(null)}
          />
        </div>

        {/* 2 · Road progress (the same panel as the floating button opens) */}
        <div className="progress-inline" id="progress">
          <div className="progress-inline__panel">
            <div className="pmodal__head">
              <p className="kicker kicker--center">Road Progress</p>
              <h3>Watch the road <em>roll out</em></h3>
              <div className="pmodal__big"><b>{fmt(pavedFeet)}</b> of 610 m pledged · {pct}% complete</div>
            </div>
            <VRoad pledges={pledges} />
          </div>
        </div>

        {/* 3 · Supporters */}
        <Donors pledges={pledges} />
      </div>
    </section>
  );
}

function Donors({ pledges }) {
  const ordered = pledges.slice().reverse();
  return (
    <div className="donors">
      <div className="donors__head">
        <h4>Those who have pledged</h4>
        <span className="donors__count">{pledges.length} supporters</span>
      </div>
      <div className="donorgrid">
        {ordered.map((p) => (
          <div className="donorcard" key={p.id}>
            <div className="donorcard__ft">{p.feet}<small>meters</small></div>
            <div className="donorcard__nm">
              {p.name}
              {p.message && <div className="msg">“{p.message}”</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== BUDGET ===================== */
function Budget({ pavedFeet, pledgedLKR }) {
  const total = PROJECT.totalBudget;
  const pledgedPct = Math.min(100, (pledgedLKR / total) * 100);
  const remaining = Math.max(0, total - pledgedLKR);

  return (
    <section className="section budget" id="budget">
      <div className="wrap budget__grid">
        <div>
          <p className="kicker">Transparency</p>
          <h2 className="title">Every rupee, <span className="h-em">accounted for</span>.</h2>
          <p className="lede" style={{marginBottom: 30}}>
            This is a community offering. The budget below moves the moment a pledge is made — what has been
            pledged, and what is still needed to finish the 610&nbsp;m of concrete road.
          </p>
          <div className="bigbar">
            <div className="bigbar__track">
              <div className="bigbar__done" style={{width: pledgedPct + "%"}} />
            </div>
            <div className="bigbar__labels">
              <span>{Math.round(pledgedPct)}% pledged</span>
              <span>Goal · <LKR>{fmt(total)}</LKR></span>
            </div>
          </div>
        </div>

        <div className="budrows">
          <div className="budrow budrow--total">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--paper-3)"}} />
              <div className="budrow__k">Total project budget<small>610 m · full 1:3:5 concrete scope</small></div></div>
            <div className="budrow__v"><LKR>{fmt(total)}</LKR></div>
          </div>
          <div className="budrow">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--forest)"}} />
              <div className="budrow__k">Pledged so far<small>{fmt(pavedFeet)} m reserved by supporters</small></div></div>
            <div className="budrow__v"><LKR>{fmt(pledgedLKR)}</LKR></div>
          </div>
          <div className="budrow">
            <div className="budrow__l"><span className="budrow__chip" style={{background:"var(--paper-3)", boxShadow:"inset 0 0 0 1.5px var(--gravel)"}} />
              <div className="budrow__k">Still to be raised<small>{fmt(PROJECT.totalFeet - pavedFeet)} m of road remaining</small></div></div>
            <div className="budrow__v"><LKR>{fmt(remaining)}</LKR></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== CTA + FOOTER ===================== */
function CTA() {
  return (
    <section className="section cta">
      <div className="wrap center">
        <div className="cta__lotus"><Lotus /></div>
        <p className="kicker kicker--center">An Act of Generosity</p>
        <h2>Lay one meter of the path, <span style={{fontStyle:"italic"}}>and walk it forever.</span></h2>
        <p className="lede">Whether you pave a single meter or a hundred, every contribution carries practitioners
          quietly into the forest at Rideekanda. May your generosity bear fruit.</p>
        <div className="cta__cta">
          <a className="btn btn--saffron" href="#road">Pledge a linear meter <Ico d={ICONS.arrow} style={{width:18,height:18}}/></a>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <Lotus className="brand__mark" />
          <span className="brand__txt">
            <span className="brand__name" style={{fontFamily:"var(--display)",fontSize:18}}>Rideekanda Forest Monastery</span>
            <span className="brand__sub" style={{fontSize:10.5,letterSpacing:".18em",textTransform:"uppercase"}}>Road Construction Project</span>
          </span>
        </div>
        <small>A community Dhāna offering · 610 m concrete road · LKR 8,878 per linear meter</small>
      </div>
    </footer>
  );
}

/* ===================== TOAST ===================== */
function Toast({ msg, show }) {
  return (
    <div className={"toast" + (show ? " show" : "")}>
      <Ico d={ICONS.check} style={{width:18,height:18}} /> {msg}
    </div>
  );
}

/* ===================== VERTICAL CARPET ROAD ===================== */
const ROLL_MS = 1300;
function VRoad({ pledges }) {
  const total = PROJECT.totalFeet;
  const ordered = pledges.slice();
  let cursor = 0;
  const spans = ordered.map((p) => {
    const start = cursor; cursor += p.feet;
    return { ...p, start, end: cursor, mid: start + p.feet / 2 };
  });
  const pledgedFeet = cursor;
  const blankFeet = total - pledgedFeet;

  const [active, setActive] = useState(null);
  const [caret, setCaret] = useState(null);
  const [rolling, setRolling] = useState(true);
  const stageRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setRolling(false), ROLL_MS + 80);
    return () => clearTimeout(t);
  }, []);

  function locate(e) {
    const el = stageRef.current; if (!el) return;
    const road = el.querySelector(".vroad-track");
    const rect = road.getBoundingClientRect();
    const fracFromBottom = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    setCaret(fracFromBottom * 100);
    const ft = fracFromBottom * total;
    const hit = spans.find((s) => ft >= s.start && ft < s.end);
    setActive(hit ? hit.id : null);
  }
  function clear() { setActive(null); setCaret(null); }
  function start(e) {
    const el = stageRef.current;
    if (el && el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (_) {} }
    locate(e);
  }
  function leave(e) { if (!e || e.pointerType !== "touch") clear(); }

  return (
    <div className="vstage" ref={stageRef}
      onPointerDown={start} onPointerMove={locate}
      onPointerCancel={clear} onPointerLeave={leave}>
      <div className="vlegend">
        <span><i className="vleg--pledged" /> Pledge to support <b>{fmt(pledgedFeet)}{"\u00a0"}m</b></span>
        <span><i className="vleg--open" /> To be paved <b>{fmt(blankFeet)}{"\u00a0"}m</b></span>
      </div>
      <div className={"vroad" + (rolling ? " vroad--rolling" : "")} style={{ "--roll-ms": ROLL_MS + "ms" }}>
        <span className="vcap vcap--bot">0 m</span>
        <span className="vcap vcap--top">610 m</span>
        <div className="vroad-track">
          <div className="vroad-surface">
            {spans.map((s) => (
              <div key={s.id}
                className={"vseg vseg--pledged" + (active === s.id ? " is-active" : "")}
                style={{ bottom: (s.start / total) * 100 + "%", height: (s.feet / total) * 100 + "%" }} />
            ))}
          </div>
        </div>
        {rolling && <div className="vroad-roll" />}
        {caret != null && (
          <React.Fragment>
            <div className="vcaret-glow" style={{ bottom: caret + "%" }} />
            <div className="vcaret" style={{ bottom: caret + "%" }} />
          </React.Fragment>
        )}

        {spans.map((s) => {
          const isActive = active === s.id;
          const delay = (s.mid / total) * ROLL_MS + 180;
          return (
            <div key={"l" + s.id}
              className={"vlabel vlabel--pledged" + (isActive ? " is-active" : "")}
              style={{ bottom: (s.mid / total) * 100 + "%", transform: "translateY(50%)" + (isActive ? " scale(1.16)" : ""), animationDelay: delay + "ms" }}
              onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}>
              <span><span className="vlabel__ft">{s.feet}m</span> {s.name}</span>
              <span className="vlabel__dot" />
              <span className="vlabel__tick" style={{ top: "50%" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== FLOATING PROGRESS BUTTON ===================== */
function ProgressFab({ pct, onClick }) {
  return (
    <button className="fab" onClick={onClick} aria-label="View road progress">
      <span className="fab__ring" style={{ "--p": pct }}>
        <span className="fab__pct">{pct}<small>%</small></span>
      </span>
      <span className="fab__txt">
        <b>Road progress</b>
        <span>Tap to see the road</span>
      </span>
    </button>
  );
}

/* ===================== PROGRESS MODAL ===================== */
function ProgressModal({ open, onClose, pledges, pct, pavedFeet }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!open) { setMounted(false); return; }
    const r = requestAnimationFrame(() => setMounted(true));
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(r); window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={"pmodal" + (mounted ? " is-open" : "")} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pmodal__panel">
        <button className="pmodal__close" onClick={onClose} aria-label="Close">
          <Ico d="M6 6l12 12M18 6L6 18" style={{ width: 18, height: 18 }} />
        </button>
        <div className="pmodal__head">
          <p className="kicker kicker--center">The Road So Far</p>
          <h3>Watch the road <em>roll out</em></h3>
          <div className="pmodal__big"><b>{fmt(pavedFeet)}</b> of 610 m pledged · {pct}% complete</div>
        </div>
        <VRoad pledges={pledges} />
      </div>
    </div>
  );
}

/* ===================== APP ===================== */
function App() {
  const [pledges, setPledges] = useState(loadPledges);
  const [justPledged, setJustPledged] = useState(null);
  const [newId, setNewId] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });
  const [progressOpen, setProgressOpen] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(pledges)); } catch (e) {}
  }, [pledges]);

  // Load the live, shared pledge list from the Google Sheet (if configured).
  // Falls back silently to the seed + localStorage if unreachable.
  useEffect(() => {
    if (!PLEDGE_ENDPOINT) return;
    fetch(PLEDGE_ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const rows = (d && d.pledges) || (Array.isArray(d) ? d : null);
        if (!rows) return; // malformed response → keep seed/local fallback
        // Live Sheet is authoritative: even an empty list replaces the seed,
        // so an empty Sheet shows an honest empty road, not fake samples.
        const mapped = rows
          .filter((x) => x && Number(x.meters || x.feet) > 0)
          .map((x, i) => ({ id: "g" + i, name: x.name || "Anonymous", feet: Number(x.meters || x.feet) || 0, message: x.message || "" }));
        setPledges(mapped);
      })
      .catch(() => {});
  }, []);

  function flash(msg) {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }

  const pavedFeet = useMemo(() => pledges.reduce((s, p) => s + p.feet, 0), [pledges]);
  const remaining = Math.max(0, PROJECT.totalFeet - pavedFeet);
  const pct = Math.round((pavedFeet / PROJECT.totalFeet) * 100);
  const pledgedLKR = pavedFeet * PROJECT.costPerFoot;

  function handlePledge({ name, feet }) {
    const id = "p" + Date.now();
    const p = { id, name, feet };
    setPledges((list) => [...list, p]);
    postPledge(p);                                   // save to the Google Sheet
    setJustPledged(p);
    setNewId(id);
    flash(`${feet} m reserved on the road — complete your donation below.`);
    setTimeout(() => { const el = document.getElementById("road"); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }); }, 60);
  }

  return (
    <React.Fragment>
      {/* Shared eco-header + eco-footer (injected into <body>) replace the
          page's own Nav/Footer, so they aren't rendered here. */}
      <Hero stats={{ pavedFeet: fmt(pavedFeet), pct }} />
      <About />
      <Tech />
      <Paver
        pledges={pledges} pavedFeet={pavedFeet} pct={pct} remaining={remaining}
        onPledge={handlePledge}
        justPledged={justPledged} setJustPledged={setJustPledged}
      />
      <Budget pavedFeet={pavedFeet} pledgedLKR={pledgedLKR} />
      <CTA />
      <Toast msg={toast.msg} show={toast.show} />
      <ProgressFab pct={pct} onClick={() => setProgressOpen(true)} />
      <ProgressModal
        open={progressOpen} onClose={() => setProgressOpen(false)}
        pledges={pledges} pct={pct} pavedFeet={pavedFeet}
      />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
