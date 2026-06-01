const { useState, useEffect, useMemo, useRef } = React;

/* ──────────── data ──────────── */
const AMOUNTS = [
  { v: 5,    url: "https://tri.ps/ZdZTS", embed: "0812417710", img: "qr/5.png" },
  { v: 10,   url: "https://tri.ps/GvNDh", embed: "1548596865", img: "qr/10.png" },
  { v: 20,   url: "https://tri.ps/rKXMC", embed: "4048115089", img: "qr/20.png" },
  { v: 50,   url: "https://tri.ps/rHOZb", embed: "7385718318", img: "qr/50.png" },
  { v: 100,  url: "https://tri.ps/FKdZj", embed: "4433165800", img: "qr/100.png" },
  { v: 200,  url: "https://tri.ps/ZviUR", embed: "9240188991", img: "qr/200.png" },
  { v: 500,  url: "https://tri.ps/Kilqw", embed: "9344319800", img: "qr/500.png" },
  { v: 1000, url: "https://tri.ps/BPZtJ", embed: "7533218131", img: "qr/1000.png" },
];

const WETRAVEL_EMBED = (uuid) => `https://www.wetravel.com/checkout_embed?uuid=${uuid}&source=direct_link`;

const BANK_ACCOUNTS = [
  {
    id: "lk2",
    label: "Sri Lanka · NSB Bank",
    flag: "🇱🇰",
    country: "Sri Lanka",
    rows: [
      { k: "Bank",            v: "NSB · National Savings Bank" },
      { k: "Account name",    v: "Rideekanda Senasana Foundation" },
      { k: "Account no.",     v: "101490145572" },
      { k: "Branch",          v: "City Plus (0149) or Head Office (001)" },
      { k: "SWIFT / BIC",     v: "NSBALKLX" },
      { k: "Head office",     v: "No. 255, Galle Road, Colombo 03" },
    ],
  },
  // {
  //   id: "lk1",
  //   label: "Sri Lanka · People's Bank",
  //   flag: "🇱🇰",
  //   country: "Sri Lanka",
  //   rows: [
  //     { k: "Bank",            v: "People's Bank" },
  //     { k: "Account name",    v: "Mr Rewatha Himi · Rev. Homagama" },
  //     { k: "Account no.",     v: "193200170292100" },
  //     { k: "Branch",          v: "Ridigama (193)" },
  //     { k: "SWIFT / BIC",     v: "PSBKLKLX" },
  //     { k: "Head office",     v: "No. 75, Sir Chittampalam A. Gardiner Mw, Colombo 02" },
  //   ],
  // },
  // {
  //   id: "us",
  //   label: "USA · UNFCU Bank",
  //   flag: "🇺🇸",
  //   country: "United States",
  //   rows: [
  //     { k: "Bank",            v: "UNFCU Bank" },
  //     { k: "Account name",    v: "Rev. Homagama Rewatha" },
  //     { k: "Account no.",     v: "20007702756" },
  //     { k: "ABA / Routing",   v: "226078609" },
  //     { k: "BIC / SWIFT",     v: "UNUNUS31" },
  //     { k: "Bank address",    v: "Court Square Place, 24-01 44th Road, Long Island City, NY 11101 USA" },
  //   ],
  //   note: "If your European bank's portal asks for SWIFT but not ABA, enter the ABA number under \"Instructions to Receiver's Bank\" or \"Reference\".",
  // },
];

/* ──────────── tiny ornaments ──────────── */
function LotusMark({ size = 22 }) {
  return (
    <img
      src="assets/logo-mark.png"
      alt="Rideekanda Monastery lotus"
      width={size}
      height={Math.round(size * 0.62)}
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

function MethodIcon({ kind }) {
  const c = "currentColor";
  if (kind === "qr") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="6"  y="6"  width="18" height="18" stroke={c} strokeWidth="1.4"/>
        <rect x="11" y="11" width="8"  height="8"  fill={c}/>
        <rect x="32" y="6"  width="18" height="18" stroke={c} strokeWidth="1.4"/>
        <rect x="37" y="11" width="8"  height="8"  fill={c}/>
        <rect x="6"  y="32" width="18" height="18" stroke={c} strokeWidth="1.4"/>
        <rect x="11" y="37" width="8"  height="8"  fill={c}/>
        <rect x="32" y="32" width="4"  height="4"  fill={c}/>
        <rect x="40" y="32" width="4"  height="4"  fill={c}/>
        <rect x="48" y="32" width="2"  height="4"  fill={c}/>
        <rect x="32" y="40" width="4"  height="4"  fill={c}/>
        <rect x="40" y="40" width="10" height="4"  fill={c}/>
        <rect x="32" y="48" width="10" height="2"  fill={c}/>
        <rect x="46" y="48" width="4"  height="2"  fill={c}/>
      </svg>
    );
  }
  if (kind === "card") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="4" y="14" width="48" height="32" rx="3" stroke={c} strokeWidth="1.4"/>
        <rect x="4" y="20" width="48" height="6" fill={c}/>
        <rect x="9" y="32" width="14" height="3" fill={c}/>
        <rect x="9" y="38" width="22" height="2" fill={c} opacity="0.5"/>
        <rect x="36" y="36" width="12" height="6" rx="1" stroke={c} strokeWidth="1.2"/>
      </svg>
    );
  }
  // bank
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M6 22 L28 8 L50 22" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <rect x="6" y="22" width="44" height="2" fill={c}/>
      <rect x="10" y="26" width="3" height="18" fill={c}/>
      <rect x="19" y="26" width="3" height="18" fill={c}/>
      <rect x="34" y="26" width="3" height="18" fill={c}/>
      <rect x="43" y="26" width="3" height="18" fill={c}/>
      <rect x="6" y="46" width="44" height="3" fill={c}/>
      <circle cx="28" cy="16" r="1.8" fill={c}/>
    </svg>
  );
}

function LotusOrnament() {
  return (
    <img
      className="lotus-bg"
      src="assets/logo-mark.png"
      alt=""
      aria-hidden="true"
    />
  );
}

/* ──────────── header ──────────── */
function Header() {
  return (
    <header className="nav">
      <div className="brand">
        <div className="brand-mark"><LotusMark size={22} /></div>
        <div className="brand-name">
          <b>Rideekanda Forest Monastery</b>
          <span>Udasgiriya · Matale · Sri Lanka</span>
          <span className="phone-mobile">+94 74 225 2980</span>
        </div>
      </div>
      <div className="nav-right">
        <a href="../index.html" className="mono home-link">← Home</a>
        <span className="mono hide-sm">rideekanda@gmail.com</span>
        <span className="mono">+94 74 225 2980</span>
      </div>
    </header>
  );
}

/* ──────────── hero ──────────── */
function Hero({ onJump }) {
  return (
    <section className="hero">
      <LotusOrnament />
      <div className="eyebrow mono"><span className="dot"></span><span>An offering of dāna</span></div>
      <h1><em>Support</em> the monastery &amp; meditation community.</h1>
    </section>
  );
}

/* ──────────── method card ──────────── */
function MethodCard({ n, title, sub, kind, active, onClick }) {
  return (
    <button className={"method" + (active ? " active" : "")} onClick={onClick}>
      <h3 className="method-title">{title}</h3>
      <div className="method-rule"></div>
      <div className="method-sub">{sub}</div>
      <div className="method-foot">
        <span className="method-select">
          {active ? "Selected" : "Select"}
          <span className="arrow">{active ? "↓" : "→"}</span>
        </span>
      </div>
    </button>
  );
}

/* ──────────── amount selector ──────────── */
function AmountGrid({ value, onChange }) {
  return (
    <div className="amounts">
      {AMOUNTS.map(a => (
        <button
          key={a.v}
          className={"amount" + (value === a.v ? " selected" : "")}
          onClick={() => onChange(a.v)}
        >
          <span className="amount-val">${a.v}</span>
          <span className="amount-curr">USD</span>
        </button>
      ))}
    </div>
  );
}

/* ──────────── QR panel ──────────── */
function QRPanel({ amount }) {
  const item = AMOUNTS.find(a => a.v === amount);
  if (!item) {
    return (
      <div className="qr-empty">
        <div className="pulse"><MethodIcon kind="qr" /></div>
        <div>Select an amount and a QR code will appear here. Scan it with your phone's camera or banking app to complete the gift.</div>
      </div>
    );
  }
  return (
    <div className="qr-stage fade-in" key={amount}>
      <div className="qr-card">
        <div className="qr-card-title">${amount} <span style={{color:"var(--accent)", fontStyle:"italic", fontWeight:400}}>donation</span></div>
        <img src={item.img} alt={`Donate $${amount}`} />
        <div className="qr-card-foot">{item.url.replace("https://", "")}</div>
      </div>
    </div>
  );
}

/* ──────────── WeTravel embed ──────────── */
function WeTravelPanel({ amount, onOpenExternal }) {
  const item = AMOUNTS.find(a => a.v === amount);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const loadedRef = useRef(false);
  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  const embedSrc = item?.embed ? WETRAVEL_EMBED(item.embed) : null;
  const externalUrl = item?.url;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    loadedRef.current = false;
    if (!item) return;
    if (!embedSrc) { setFailed(true); return; }
    timeoutRef.current = setTimeout(() => {
      if (!loadedRef.current) setFailed(true);
    }, 8000);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line
  }, [amount]);

  const handleLoaded = () => {
    loadedRef.current = true;
    setLoaded(true);
    setFailed(false);
  };

  if (!item) {
    return (
      <div className="qr-empty">
        <div className="pulse"><MethodIcon kind="card" /></div>
        <div>Select an amount and the WeTravel secure checkout will load here, on this page — no redirects.</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="wt-desktop fade-in">
        <div className="wt-stage" key={amount}>
          <div className="wt-bar">
            <div className="wt-dots"><span></span><span></span><span></span></div>
            <div className="wt-url"><span className="wt-lock">●</span> &nbsp;wetravel.com / secure-checkout / ${amount}.00 USD</div>
          </div>
          <div className="wt-body">
            {embedSrc && (
              <iframe
                ref={iframeRef}
                src={embedSrc}
                title={`WeTravel $${amount}`}
                onLoad={handleLoaded}
                referrerPolicy="no-referrer-when-downgrade"
                allow="payment *"
              />
            )}
            {!loaded && !failed && (
              <div className="wt-fallback" style={{ background: "rgba(255,255,255,0.92)" }}>
                <span className="mono">Connecting securely…</span>
                <h4>Loading checkout for <em style={{color:"var(--accent)", fontStyle:"italic"}}>${amount}.00 USD</em></h4>
              </div>
            )}
            {failed && (
              <div className="wt-fallback">
                <span className="mono">{embedSrc ? "Embed blocked on this domain" : "Embed link not yet configured"}</span>
                <h4>Open the secure page in a new tab to complete the <em style={{color:"var(--accent)", fontStyle:"italic"}}>${amount} donation</em>.</h4>
                <div style={{display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center"}}>
                  <a className="btn accent" href={externalUrl} target="_blank" rel="noreferrer" onClick={onOpenExternal}>
                    Open secure checkout
                    <span>↗</span>
                  </a>
                  <a className="btn ghost" href={externalUrl} target="_blank" rel="noreferrer">
                    Open original link
                  </a>
                </div>
                <p style={{maxWidth:"44ch", color:"var(--muted)", fontSize:13, lineHeight:1.5, marginTop:6}}>
                  WeTravel's checkout embed only loads on whitelisted domains.
                  Once this site is deployed to its production URL, WeTravel will need to allow that domain in their dashboard for the in-page checkout to appear.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="wt-external-option">
          <span className="mono">Pay on WeTravel's website instead</span>
          <a className="btn ghost" href={externalUrl} target="_blank" rel="noreferrer">
            Open payment page ↗
          </a>
          <span className="mono wt-external-note">Use this link to pay via Google Pay or Apple Pay — these payment methods won't work in the embedded portal.</span>
        </div>
      </div>
      <div className="wt-mobile fade-in">
        <a className="btn accent" href={externalUrl} target="_blank" rel="noreferrer">
          Pay ${amount}.00 USD via WeTravel <span>↗</span>
        </a>
        <a className="btn ghost" href={externalUrl} target="_blank" rel="noreferrer" style={{marginTop:10}}>
          Open payment link directly
        </a>
        <p className="mono" style={{color:"var(--muted)", fontSize:11, marginTop:14, textAlign:"center"}}>
          You'll be redirected to WeTravel's secure checkout page.
        </p>
      </div>
    </React.Fragment>
  );
}

/* ──────────── bank panel — stacked accounts ──────────── */
function BankAccountCard({ acct, idx, onCopy }) {
  const [copied, setCopied] = useState(null);
  const copy = (k, v) => {
    navigator.clipboard?.writeText(v);
    setCopied(k);
    onCopy?.(k);
    setTimeout(() => setCopied(null), 1500);
  };
  const copyAll = () => {
    const text = `${acct.label}\n` + acct.rows.map(r => `${r.k}: ${r.v}`).join("\n");
    navigator.clipboard?.writeText(text);
    onCopy?.("All details");
  };
  return (
    <article className="acct">
      <header className="acct-head">
        <div className="acct-head-left">
          <span className="acct-num mono">— Account 0{idx + 1}</span>
          <h4 className="acct-label">
            <span className="acct-flag">{acct.flag}</span>
            <span>{acct.label}</span>
          </h4>
        </div>
        <button className="copy-btn ghost" onClick={copyAll}>Copy all</button>
      </header>
      <div className="acct-rows">
        {acct.rows.map(row => (
          <div className="acct-row" key={row.k}>
            <span className="mono">{row.k}</span>
            <span className="acct-val">{row.v}</span>
            <button className={"copy-btn" + (copied === row.k ? " copied" : "")} onClick={() => copy(row.k, row.v)}>
              {copied === row.k ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
      {acct.note && (
        <div className="acct-note">
          <span className="mono" style={{color:"var(--accent)"}}>↳ Note for Europe</span>
          <p>{acct.note}</p>
        </div>
      )}
    </article>
  );
}

function BankStack({ onCopy }) {
  const [activeId, setActiveId] = useState(BANK_ACCOUNTS[0].id);
  const [copied, setCopied] = useState(null);
  const active = BANK_ACCOUNTS.find(a => a.id === activeId);

  const copy = (k, v) => {
    navigator.clipboard?.writeText(v);
    setCopied(k);
    onCopy?.(k);
    setTimeout(() => setCopied(null), 1500);
  };
  const copyAll = () => {
    const text = `${active.label}\n` + active.rows.map(r => `${r.k}: ${r.v}`).join("\n");
    navigator.clipboard?.writeText(text);
    onCopy?.("All details");
  };

  return (
    <div className="bank-wrap fade-in">
      <div className="bank-tabs" role="tablist">
        {BANK_ACCOUNTS.map((a, i) => (
          <button
            key={a.id}
            className={"bank-tab" + (activeId === a.id ? " active" : "")}
            onClick={() => setActiveId(a.id)}
            role="tab"
          >
            <span className="bank-tab-num mono">— Account 0{i + 1}</span>
            <span className="bank-tab-row">
              <span className="bank-tab-flag">{a.flag}</span>
              <span className="bank-tab-label">{a.label}</span>
            </span>
          </button>
        ))}
      </div>

      <article className="acct" key={active.id}>
        <header className="acct-head">
          <div className="acct-head-left">
            <span className="acct-num mono">— Account 0{BANK_ACCOUNTS.findIndex(a => a.id === active.id) + 1}</span>
            <h4 className="acct-label">
              <span className="acct-flag">{active.flag}</span>
              <span>{active.label}</span>
            </h4>
          </div>
          <button className="copy-btn ghost" onClick={copyAll}>Copy all</button>
        </header>
        <div className="acct-rows">
          {active.rows.map(row => (
            <div className="acct-row" key={row.k}>
              <span className="mono">{row.k}</span>
              <span className="acct-val">{row.v}</span>
              <button className={"copy-btn" + (copied === row.k ? " copied" : "")} onClick={() => copy(row.k, row.v)}>
                {copied === row.k ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
        {active.note && (
          <div className="acct-note">
            <span className="mono" style={{color:"var(--accent)"}}>↳ Note for Europe</span>
            <p>{active.note}</p>
          </div>
        )}
      </article>

      <div className="bank-contact">
        <div>
          <span className="mono">For assistance, contact</span>
          <div className="bank-phone">+94 742 252 980</div>
          <div className="bank-name">Rideekanda Official</div>
        </div>
        <div>
          <div className="bank-phone">+94 714 283 258</div>
          <div className="bank-name">Dhananjaya B. Heenkenda</div>
        </div>
        <div className="bank-ref">
          Please use <b>"Dāna offering"</b> as the transfer reference so we can acknowledge your gift.
        </div>
      </div>
    </div>
  );
}

/* ──────────── steps strip ──────────── */
function Steps({ method, amount, methodNeedsAmount }) {
  const m1 = !!method;
  const m2 = !methodNeedsAmount || !!amount;
  return (
    <div className="steps">
      <div className={"step " + (m1 ? "done" : "current")}><span className="n">1</span><span>Choose method</span></div>
      <div className="step-line"></div>
      <div className={"step " + (!m1 ? "" : (m2 ? "done" : "current"))}>
        <span className="n">2</span>
        <span>{methodNeedsAmount ? "Select amount" : "Account details"}</span>
      </div>
      <div className="step-line"></div>
      <div className={"step " + (m1 && m2 ? "current" : "")}>
        <span className="n">3</span>
        <span>{method === "bank" ? "Transfer" : (method === "wetravel" ? "Pay online" : "Scan & pay")}</span>
      </div>
    </div>
  );
}

/* ──────────── give section (vertical sequence) ──────────── */
function Give() {
  const [method, setMethod] = useState(null);   // 'qr' | 'wetravel' | 'bank'
  const [amount, setAmount] = useState(null);
  const [toast, setToast] = useState(null);
  const stepAmountRef = useRef(null);
  const stepDisplayRef = useRef(null);

  const needAmount = method === "qr" || method === "wetravel";

  const choose = (m) => {
    setMethod(m);
    setAmount(null);
    setTimeout(() => {
      stepAmountRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const pickAmount = (v) => {
    setAmount(v);
    setTimeout(() => {
      stepDisplayRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1900); };

  return (
    <section className="sec" id="give">
      <div className="frame">
        <span className="mono step-mark">Step 1 — Choose a method</span>
        <div className="methods">
          <MethodCard
            title="Bank Transfer"
            sub="For SWIFT, ACH or local bank transfer. NSB Bank, Sri Lanka."
            kind="bank"
            active={method === "bank"}
            onClick={() => choose("bank")}
          />
          <MethodCard
            title="Donate Online"
            sub={<>Card Pay · Apple Pay · Google Pay — handled in-page through the WeTravel gateway.</>}
            kind="card"
            active={method === "wetravel"}
            onClick={() => choose("wetravel")}
          />
          <MethodCard
            title="Scan a QR Code"
            sub="Select the QR code. Scan with your camera or bank app to complete the gift in seconds."
            kind="qr"
            active={method === "qr"}
            onClick={() => choose("qr")}
          />
        </div>

        {/* Step 2 — Pick amount (for QR & online) OR Bank stack */}
        {needAmount && (
          <div ref={stepAmountRef} className="stage-step fade-in" key={method + "-amt"}>
            <div className="stage-step-head">
              <span className="mono step-mark">Step 2 — Pick an amount</span>
              <div className="stage-step-meta">
                <span className="mono">Method · {method === "qr" ? "Scan a QR" : "Donate online"}</span>
                <button className="link-btn" onClick={() => { setMethod(null); setAmount(null); }}>Change method</button>
              </div>
            </div>
            <AmountGrid value={amount} onChange={pickAmount} />
            {!amount && (
              <p className="stage-hint">Tap an amount and your {method === "qr" ? "QR code" : "secure checkout"} will appear below.</p>
            )}
          </div>
        )}

        {/* Step 3 — Display QR or WeTravel embed */}
        {needAmount && amount && (
          <div ref={stepDisplayRef} className="stage-step fade-in" key={method + "-disp-" + amount}>
            <div className="stage-step-head">
              <span className="mono step-mark">Step 3 — {method === "qr" ? "Scan to pay" : "Complete checkout"}</span>
              <div className="stage-step-meta">
                <span className="amt-pill"><span className="mono">Donating</span> <b>${amount}.00</b> <span className="mono">USD</span></span>
                <button className="link-btn" onClick={() => { setAmount(null); stepAmountRef.current?.scrollIntoView?.({behavior:"smooth", block:"start"}); }}>Change amount</button>
              </div>
            </div>
            {method === "qr" ? (
              <div className="display-frame qr-frame">
                <QRPanel amount={amount} />
                <aside className="display-aside">
                  <span className="mono">How to scan</span>
                  <ol>
                    <li>Open your phone's camera or banking app.</li>
                    <li>Point it at the code on the left.</li>
                    <li>Confirm the amount and complete the payment.</li>
                  </ol>
                  <a className="btn ghost" href={AMOUNTS.find(a => a.v === amount)?.url} target="_blank" rel="noreferrer">
                    Or open link directly ↗
                  </a>
                </aside>
              </div>
            ) : (
              <div className="display-frame">
                <WeTravelPanel amount={amount} onOpenExternal={() => showToast("Opening secure checkout")}/>
              </div>
            )}
          </div>
        )}

        {/* Bank — show 3 stacked accounts */}
        {method === "bank" && (
          <div ref={stepAmountRef} className="stage-step fade-in" key="bank">
            <div className="stage-step-head">
              <span className="mono step-mark">Step 2 — Bank account details</span>
              <div className="stage-step-meta">
                <span className="mono">Method · Bank transfer</span>
                <button className="link-btn" onClick={() => setMethod(null)}>Change method</button>
              </div>
            </div>
            <BankStack onCopy={(k) => showToast(`${k} copied`)} />
          </div>
        )}

        {!method && (
          <div className="empty-hint">
            <LotusMark size={22} color="var(--accent)"/>
            <div>
              <div className="mono" style={{color:"var(--muted)"}}>Begin when you're ready</div>
              <div>Select one of the three methods above to continue.</div>
            </div>
            <div className="mono empty-tag">No account · No login required</div>
          </div>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}

/* ──────────── closing ──────────── */
function Closing() {
  return (
    <section className="sec closing">
      <div className="frame">
        <span className="mono" style={{color:"var(--muted)"}}>Anumodanā</span>
        <h2 style={{marginTop:20}}>
          Thank you for your kindness, generosity and support.<br/>May this offering bring blessings, peace and well-being to all.
        </h2>

        <div className="closing-foot">
          <span className="mono">Payment gateway powered by WeTravel</span>
        </div>
      </div>
    </section>
  );
}

/* ──────────── app ──────────── */
function App() {
  return (
    <div className="page">
      <div className="frame">
        {/* Header removed — unified shared header (eco-header) is used instead */}
        <Hero />
      </div>
      <Give />
      <Closing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
