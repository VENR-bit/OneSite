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

/* ──────────── payment-link request backend ──────────── */
// Google Apps Script /exec URL. It records the request to a Google Sheet and
// emails rideekanda@gmail.com. Empty = not wired yet (form is disabled).
const PAYLINK_ENDPOINT = "https://script.google.com/macros/s/AKfycby9Z6ZG-AoaIQY9l7u4LfmqwvMaIeAhaqbgl2x6vjCVbQ5_rztaEHbPfiXGj_rkZyMp-g/exec";

// Sri Lanka first (default), then every country/territory, alphabetical.
const COUNTRY_CODES = [
  { c: "+94", n: "Sri Lanka" },
  { c: "+93", n: "Afghanistan" }, { c: "+355", n: "Albania" }, { c: "+213", n: "Algeria" },
  { c: "+376", n: "Andorra" }, { c: "+244", n: "Angola" }, { c: "+1", n: "Antigua & Barbuda" },
  { c: "+54", n: "Argentina" }, { c: "+374", n: "Armenia" }, { c: "+297", n: "Aruba" },
  { c: "+61", n: "Australia" }, { c: "+43", n: "Austria" }, { c: "+994", n: "Azerbaijan" },
  { c: "+1", n: "Bahamas" }, { c: "+973", n: "Bahrain" }, { c: "+880", n: "Bangladesh" },
  { c: "+1", n: "Barbados" }, { c: "+375", n: "Belarus" }, { c: "+32", n: "Belgium" },
  { c: "+501", n: "Belize" }, { c: "+229", n: "Benin" }, { c: "+975", n: "Bhutan" },
  { c: "+591", n: "Bolivia" }, { c: "+387", n: "Bosnia & Herzegovina" }, { c: "+267", n: "Botswana" },
  { c: "+55", n: "Brazil" }, { c: "+673", n: "Brunei" }, { c: "+359", n: "Bulgaria" },
  { c: "+226", n: "Burkina Faso" }, { c: "+257", n: "Burundi" }, { c: "+855", n: "Cambodia" },
  { c: "+237", n: "Cameroon" }, { c: "+1", n: "Canada" }, { c: "+238", n: "Cape Verde" },
  { c: "+236", n: "Central African Rep." }, { c: "+235", n: "Chad" }, { c: "+56", n: "Chile" },
  { c: "+86", n: "China" }, { c: "+57", n: "Colombia" }, { c: "+269", n: "Comoros" },
  { c: "+242", n: "Congo (Rep.)" }, { c: "+243", n: "Congo (DRC)" }, { c: "+506", n: "Costa Rica" },
  { c: "+225", n: "Côte d'Ivoire" }, { c: "+385", n: "Croatia" }, { c: "+53", n: "Cuba" },
  { c: "+357", n: "Cyprus" }, { c: "+420", n: "Czech Republic" }, { c: "+45", n: "Denmark" },
  { c: "+253", n: "Djibouti" }, { c: "+1", n: "Dominica" }, { c: "+1", n: "Dominican Republic" },
  { c: "+593", n: "Ecuador" }, { c: "+20", n: "Egypt" }, { c: "+503", n: "El Salvador" },
  { c: "+240", n: "Equatorial Guinea" }, { c: "+291", n: "Eritrea" }, { c: "+372", n: "Estonia" },
  { c: "+268", n: "Eswatini" }, { c: "+251", n: "Ethiopia" }, { c: "+679", n: "Fiji" },
  { c: "+358", n: "Finland" }, { c: "+33", n: "France" }, { c: "+241", n: "Gabon" },
  { c: "+220", n: "Gambia" }, { c: "+995", n: "Georgia" }, { c: "+49", n: "Germany" },
  { c: "+233", n: "Ghana" }, { c: "+30", n: "Greece" }, { c: "+1", n: "Grenada" },
  { c: "+502", n: "Guatemala" }, { c: "+224", n: "Guinea" }, { c: "+245", n: "Guinea-Bissau" },
  { c: "+592", n: "Guyana" }, { c: "+509", n: "Haiti" }, { c: "+504", n: "Honduras" },
  { c: "+852", n: "Hong Kong" }, { c: "+36", n: "Hungary" }, { c: "+354", n: "Iceland" },
  { c: "+91", n: "India" }, { c: "+62", n: "Indonesia" }, { c: "+98", n: "Iran" },
  { c: "+964", n: "Iraq" }, { c: "+353", n: "Ireland" }, { c: "+972", n: "Israel" },
  { c: "+39", n: "Italy" }, { c: "+1", n: "Jamaica" }, { c: "+81", n: "Japan" },
  { c: "+962", n: "Jordan" }, { c: "+7", n: "Kazakhstan" }, { c: "+254", n: "Kenya" },
  { c: "+686", n: "Kiribati" }, { c: "+383", n: "Kosovo" }, { c: "+965", n: "Kuwait" },
  { c: "+996", n: "Kyrgyzstan" }, { c: "+856", n: "Laos" }, { c: "+371", n: "Latvia" },
  { c: "+961", n: "Lebanon" }, { c: "+266", n: "Lesotho" }, { c: "+231", n: "Liberia" },
  { c: "+218", n: "Libya" }, { c: "+423", n: "Liechtenstein" }, { c: "+370", n: "Lithuania" },
  { c: "+352", n: "Luxembourg" }, { c: "+853", n: "Macau" }, { c: "+261", n: "Madagascar" },
  { c: "+265", n: "Malawi" }, { c: "+60", n: "Malaysia" }, { c: "+960", n: "Maldives" },
  { c: "+223", n: "Mali" }, { c: "+356", n: "Malta" }, { c: "+692", n: "Marshall Islands" },
  { c: "+222", n: "Mauritania" }, { c: "+230", n: "Mauritius" }, { c: "+52", n: "Mexico" },
  { c: "+691", n: "Micronesia" }, { c: "+373", n: "Moldova" }, { c: "+377", n: "Monaco" },
  { c: "+976", n: "Mongolia" }, { c: "+382", n: "Montenegro" }, { c: "+212", n: "Morocco" },
  { c: "+258", n: "Mozambique" }, { c: "+95", n: "Myanmar" }, { c: "+264", n: "Namibia" },
  { c: "+674", n: "Nauru" }, { c: "+977", n: "Nepal" }, { c: "+31", n: "Netherlands" },
  { c: "+64", n: "New Zealand" }, { c: "+505", n: "Nicaragua" }, { c: "+227", n: "Niger" },
  { c: "+234", n: "Nigeria" }, { c: "+850", n: "North Korea" }, { c: "+389", n: "North Macedonia" },
  { c: "+47", n: "Norway" }, { c: "+968", n: "Oman" }, { c: "+92", n: "Pakistan" },
  { c: "+680", n: "Palau" }, { c: "+970", n: "Palestine" }, { c: "+507", n: "Panama" },
  { c: "+675", n: "Papua New Guinea" }, { c: "+595", n: "Paraguay" }, { c: "+51", n: "Peru" },
  { c: "+63", n: "Philippines" }, { c: "+48", n: "Poland" }, { c: "+351", n: "Portugal" },
  { c: "+1", n: "Puerto Rico" }, { c: "+974", n: "Qatar" }, { c: "+40", n: "Romania" },
  { c: "+7", n: "Russia" }, { c: "+250", n: "Rwanda" }, { c: "+1", n: "Saint Kitts & Nevis" },
  { c: "+1", n: "Saint Lucia" }, { c: "+1", n: "Saint Vincent" }, { c: "+685", n: "Samoa" },
  { c: "+378", n: "San Marino" }, { c: "+239", n: "São Tomé & Príncipe" }, { c: "+966", n: "Saudi Arabia" },
  { c: "+221", n: "Senegal" }, { c: "+381", n: "Serbia" }, { c: "+248", n: "Seychelles" },
  { c: "+232", n: "Sierra Leone" }, { c: "+65", n: "Singapore" }, { c: "+421", n: "Slovakia" },
  { c: "+386", n: "Slovenia" }, { c: "+677", n: "Solomon Islands" }, { c: "+252", n: "Somalia" },
  { c: "+27", n: "South Africa" }, { c: "+82", n: "South Korea" }, { c: "+211", n: "South Sudan" },
  { c: "+34", n: "Spain" }, { c: "+249", n: "Sudan" }, { c: "+597", n: "Suriname" },
  { c: "+46", n: "Sweden" }, { c: "+41", n: "Switzerland" }, { c: "+963", n: "Syria" },
  { c: "+886", n: "Taiwan" }, { c: "+992", n: "Tajikistan" }, { c: "+255", n: "Tanzania" },
  { c: "+66", n: "Thailand" }, { c: "+670", n: "Timor-Leste" }, { c: "+228", n: "Togo" },
  { c: "+676", n: "Tonga" }, { c: "+1", n: "Trinidad & Tobago" }, { c: "+216", n: "Tunisia" },
  { c: "+90", n: "Turkey" }, { c: "+993", n: "Turkmenistan" }, { c: "+688", n: "Tuvalu" },
  { c: "+256", n: "Uganda" }, { c: "+380", n: "Ukraine" }, { c: "+971", n: "United Arab Emirates" },
  { c: "+44", n: "United Kingdom" }, { c: "+1", n: "United States" }, { c: "+598", n: "Uruguay" },
  { c: "+998", n: "Uzbekistan" }, { c: "+678", n: "Vanuatu" }, { c: "+379", n: "Vatican City" },
  { c: "+58", n: "Venezuela" }, { c: "+84", n: "Vietnam" }, { c: "+967", n: "Yemen" },
  { c: "+260", n: "Zambia" }, { c: "+263", n: "Zimbabwe" },
];

function postPaylink(p) {
  if (!PAYLINK_ENDPOINT) return Promise.reject(new Error("no endpoint"));
  return fetch(PAYLINK_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(Object.assign({ action: "paylink", page: "donate" }, p)),
  });
}

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
      <img className="lotus-mark" src="assets/logo-mark.png" alt="Rideekanda Forest Monastery" />
      <div className="eyebrow mono"><span>An offering of dāna</span></div>
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

/* ──────────── request a payment link ──────────── */
function RequestLinkPanel() {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("email");   // 'email' | 'whatsapp'
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("+94");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");       // 'idle' | 'sending' | 'done'
  const [err, setErr] = useState("");

  const quick = [5, 10, 25, 50, 100, 250, 500];

  function submit(e) {
    e && e.preventDefault();
    setErr("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setErr("Please enter the amount you'd like to donate."); return; }
    if (!name.trim()) { setErr("Please enter your name."); return; }
    let contactVal;
    if (contact === "email") {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
      contactVal = email.trim();
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 6) { setErr("Please enter a valid WhatsApp number."); return; }
      // Wrap the code in parens so the value doesn't start with "+", which
      // Google Sheets would otherwise treat as a formula (→ #ERROR!).
      contactVal = "(" + cc + ") " + digits;
    }
    setStatus("sending");
    postPaylink({
      amount: amt, currency: "USD", name: name.trim(),
      contactType: contact, contact: contactVal,
    }).then(() => setStatus("done"))
      .catch((e) => {
        if (e && e.message === "no endpoint") {
          setStatus("idle");
          setErr("Sorry — online link requests aren't available just yet. Please use Bank Transfer, or email rideekanda@gmail.com.");
        } else {
          setStatus("done");   // no-cors: the response is opaque, so we assume it was delivered
        }
      });
  }

  if (status === "done") {
    return (
      <div className="paylink-done fade-in">
        <div className="paylink-tick"><LotusMark size={26} color="var(--accent)" /></div>
        <h3>Request received — thank you, {name.trim()}.</h3>
        <p>
          We'll send a secure payment link for <b>${parseFloat(amount).toFixed(2)} USD</b> to your{" "}
          {contact === "email" ? "email" : "WhatsApp"} shortly. You can then pay with Visa/Mastercard,
          Apple&nbsp;Pay or Google&nbsp;Pay.
        </p>
        <p className="paylink-anumodana mono">Anumodanā 🙏</p>
      </div>
    );
  }

  return (
    <form className="paylink" onSubmit={submit}>
      <p className="paylink-intro">
        Tell us how much you'd like to give and where to reach you, and we'll send you a
        secure payment link. You can donate by <b>Visa / Mastercard</b>, <b>Apple&nbsp;Pay</b> or
        <b> Google&nbsp;Pay</b>.
      </p>

      <label className="pl-label">Donation amount (USD)</label>
      <div className="pl-amount">
        <span className="pl-cur">$</span>
        <input className="pl-input pl-amt" type="number" min="1" step="1" inputMode="decimal"
          placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <span className="pl-usd mono">USD</span>
      </div>
      <div className="pl-quick">
        {quick.map((v) => (
          <button type="button" key={v} className={"pl-chip" + (String(v) === String(amount) ? " on" : "")}
            onClick={() => setAmount(String(v))}>${v}</button>
        ))}
      </div>

      <label className="pl-label">Your name</label>
      <input className="pl-input" type="text" maxLength="120" placeholder="Full name"
        value={name} onChange={(e) => setName(e.target.value)} />

      <label className="pl-label">Where should we send the link?</label>
      <div className="pl-toggle">
        <button type="button" className={"pl-tog" + (contact === "email" ? " on" : "")} onClick={() => setContact("email")}>Email</button>
        <button type="button" className={"pl-tog" + (contact === "whatsapp" ? " on" : "")} onClick={() => setContact("whatsapp")}>WhatsApp</button>
      </div>

      {contact === "email" ? (
        <input className="pl-input" type="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      ) : (
        <div className="pl-phone">
          <select className="pl-input pl-cc" value={cc} onChange={(e) => setCc(e.target.value)} aria-label="Country code">
            {COUNTRY_CODES.map((o) => <option key={o.c + o.n} value={o.c}>{o.c} · {o.n}</option>)}
          </select>
          <input className="pl-input pl-num" type="tel" inputMode="numeric" placeholder="WhatsApp number"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      )}

      {err && <div className="pl-err">{err}</div>}

      <button className="btn pl-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request payment link →"}
      </button>
      <p className="pl-note mono">
        No payment is taken here. A secure link is sent to you personally — pay when you're ready.
      </p>
    </form>
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
            title="Request a Payment Link"
            sub={<>We send you a secure link — donate by Visa/Mastercard, Apple Pay or Google Pay.</>}
            kind="card"
            active={method === "request"}
            onClick={() => choose("request")}
          />
          <MethodCard
            title="Bank Transfer"
            sub="For SWIFT, ACH or local bank transfer. NSB Bank, Sri Lanka."
            kind="bank"
            active={method === "bank"}
            onClick={() => choose("bank")}
          />
        </div>

        {/* Payment-link request form */}
        {method === "request" && (
          <div ref={stepAmountRef} className="stage-step fade-in" key="request">
            <div className="stage-step-head">
              <span className="mono step-mark">Step 2 — Request your payment link</span>
              <div className="stage-step-meta">
                <span className="mono">Method · Payment link</span>
                <button className="link-btn" onClick={() => setMethod(null)}>Change method</button>
              </div>
            </div>
            <RequestLinkPanel />
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
          <span className="mono">Card · Apple Pay · Google Pay — via a secure payment link</span>
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
