const { useState, useEffect, useRef } = React;

/* ──────────── data ──────────── */

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

/* ──────────── hero ──────────── */
function Hero({ onJump }) {
  return (
    <section className="hero">
      <LotusOrnament />
      <img className="lotus-mark" src="assets/logo-mark.png" alt="Rideekanda Forest Monastery" />
      <div className="eyebrow mono"><span>An offering of dāna</span></div>
      <h1><em>Support</em> the monastery &amp; meditation community.</h1>
    </section>
  );
}

/* ──────────── method card ──────────── */
function MethodCard({ title, sub, active, onClick }) {
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

/* ──────────── pay by card — QR + direct link ──────────── */
// One WeTravel payment link, as a QR to scan from a phone and as a button to
// tap on the device you are already holding. The QR encodes exactly the URL
// in PAY_URL — if one changes, change both, or the printed code and the
// button will quietly send people to different places.
const PAY_URL = "https://www.wetravel.com/pay/3144631321";

// Wording offered for WeTravel's "Purpose of payment" box. Add or change
// these freely — they are only suggestions shown beside the form.
const PURPOSES = ["Pay for the retreat", "Pay for the project", "Dāna offering"];

function PayPanel() {
  const [hint, setHint] = useState(false);
  const [copied, setCopied] = useState(null);
  const frameRef = useRef(null);

  // We cannot reach inside the WeTravel frame — it is another origin — so the
  // "Purpose of payment" box cannot be filled or turned into a menu from here.
  // What we CAN see is the moment someone starts: a click into a cross-origin
  // frame takes focus off this window and makes the frame itself
  // document.activeElement. That is the cue to offer the wording.
  useEffect(() => {
    try { if (sessionStorage.getItem("rk-purpose-hint") === "done") return; } catch (e) {}
    function onBlur() {
      // the event fires before activeElement settles, so read it next tick
      setTimeout(() => {
        if (document.activeElement === frameRef.current) setHint(true);
      }, 0);
    }
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  function dismiss() {
    setHint(false);
    try { sessionStorage.setItem("rk-purpose-hint", "done"); } catch (e) {}
  }

  // Only say "copied" once it actually is. The async clipboard needs a user
  // gesture and a permission the browser may refuse, so fall back to the old
  // execCommand route, and if both fail say so rather than claiming success.
  function copy(text) {
    function done(ok) {
      setCopied(ok ? text : "fail:" + text);
      setTimeout(() => setCopied(null), ok ? 1800 : 2600);
    }
    function legacy() {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        done(ok);
      } catch (e) { done(false); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => done(true), legacy);
    } else {
      legacy();
    }
  }

  return (
    <div className="pay-panel">
      {/* WeTravel serves this form from /popups/ and allows cross-origin
          framing, so it runs here rather than sending people away. Card
          details are entered on wetravel.com inside the frame; this page
          never sees them, and cannot read the frame either. */}
      <div className="pay-embed">
        <iframe
          ref={frameRef}
          src={PAY_URL}
          title="Pay to Rideekanda Forest Monastery — secure payment by WeTravel"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="payment"
        ></iframe>
      </div>

      <div className="pay-side">
        <p className="pay-lede">
          Enter the amount and your details in the form, and pay by card,
          Apple&nbsp;Pay or Google&nbsp;Pay. No account and no login needed.
          In <b>Purpose of payment</b>, please say what your gift is for —
          for example “{PURPOSES[0]}”.
        </p>

        <div className="qr-card pay-qr-card">
          <div className="qr-card-title">Or scan <span style={{color:"var(--accent)", fontStyle:"italic", fontWeight:400}}>to pay</span></div>
          <img src="qr/donate.png?v=1" alt="QR code — pay to Rideekanda Forest Monastery" />
          <div className="qr-card-foot">wetravel.com/pay</div>
        </div>

        <a className="pay-open mono" href={PAY_URL} target="_blank" rel="noopener noreferrer">
          Open in a new tab <span className="arrow">↗</span>
        </a>

        <div className="pay-meta">
          <div className="pay-methods mono">Visa · Mastercard · Amex · Apple&nbsp;Pay · Google&nbsp;Pay</div>
          <div className="pay-cur mono">Pay in 15+ currencies, including USD, EUR and GBP</div>
        </div>
      </div>

      {hint && ReactDOM.createPortal((
        <div className="pay-hint" role="status">
          <button className="pay-hint-x" type="button" aria-label="Dismiss" onClick={dismiss}>&times;</button>
          <div className="pay-hint-t mono">In “Purpose of payment”, please write</div>
          <div className="pay-hint-opts">
            {PURPOSES.map(t => (
              <button key={t} type="button"
                      className={"pay-hint-opt" + (copied === t ? " copied" : "") + (copied === "fail:" + t ? " failed" : "")}
                      onClick={() => copy(t)}>
                {copied === t ? "Copied — now paste it in"
                  : copied === "fail:" + t ? "Couldn’t copy — please type it"
                  : t}
              </button>
            ))}
          </div>
          <div className="pay-hint-n">Tap one to copy it, or just type your own.</div>
        </div>
      ), document.body)}
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
        <div className="methods methods--two">
          <MethodCard
            title="Card, Apple Pay or Google Pay"
            sub={<>Scan the QR with your phone, or tap through to the secure payment page.</>}
            active={method === "request"}
            onClick={() => choose("request")}
          />
          <MethodCard
            title="Bank Transfer"
            sub="For SWIFT, ACH or local bank transfer. NSB Bank, Sri Lanka."
            active={method === "bank"}
            onClick={() => choose("bank")}
          />
        </div>

        {/* Scan the QR, or tap straight through to the payment page */}
        {method === "request" && (
          <div ref={stepAmountRef} className="stage-step fade-in" key="request">
            <div className="stage-step-head">
              <span className="mono step-mark">Step 2 — Scan or tap to pay</span>
              <div className="stage-step-meta">
                <span className="mono">Method · Card · Apple Pay · Google Pay</span>
                <button className="link-btn" onClick={() => setMethod(null)}>Change method</button>
              </div>
            </div>
            <PayPanel />
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
              <div>Choose one of the two ways to give above to continue.</div>
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
          <span className="mono">Card · Apple Pay · Google Pay — scan the code or tap through</span>
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
        {/* No header here: index.html injects the shared eco-header */}
        <Hero />
      </div>
      <Give />
      <Closing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
