/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* ----------------------------- Project data ----------------------------- */
const PROJECT = {
  totalFeet: 610,
  costPerFoot: 8878,            // LKR per linear metre
  totalBudget: 5412000,        // LKR (610 m × 8,878)
  fullLengthKm: 1.9,
  fullLengthFt: 1890,          // 1.9 km ≈ 1,890 m (full road length)
  width: 2.4,                  // m
  thickness: 100,              // mm
  mapUrl: "https://maps.app.goo.gl/ZbSeubxqA7pg2tbQ6",
};

// Where the "Donate" button sends supporters. Replace with the real
// payment link / bank-details page once provided.
const DONATE_URL = "#";

// Total material requirement for the 610 m concrete scope (1:3:5 mix).
const MATERIALS = [
  { mat: "Cement", sub: "50 kg standard bags", qty: "880", unit: "bags" },
  { mat: "River Sand", sub: "Fine aggregate", qty: "32", unit: "cubes" },
  { mat: "Coarse Aggregate", sub: "Crushed metal", qty: "56", unit: "cubes" },
];
const MATERIAL_COST = 3812000;   // LKR — total materials across 610 m
const LABOUR_COST = 1600000;     // LKR — total direct on-site labour


/* ----------------------------- Formatting ------------------------------- */
const fmt = (n) => Math.round(n).toLocaleString("en-US");
const LKR = ({ children }) => (<span><span className="lkr">LKR</span> {children}</span>);

/* ----------------------------- Icons ------------------------------------ */
let _lotusN = 0;
function Lotus({ className }) {
  // Unique gradient ids so multiple lotuses on the page don't collide.
  const uid = useMemo(() => "lt" + (++_lotusN), []);
  return (
    <svg className={"lotus " + (className || "")} viewBox="0 26 200 120" role="img" aria-label="Lotus">
      <defs>
        <linearGradient id={uid + "f"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9c6c3f" /><stop offset="1" stopColor="#6e4a28" />
        </linearGradient>
        <linearGradient id={uid + "b"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#835833" /><stop offset="1" stopColor="#5d3f23" />
        </linearGradient>
        <linearGradient id={uid + "o"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4626" /><stop offset="1" stopColor="#46301a" />
        </linearGradient>
        <linearGradient id={uid + "c"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6c5443" /><stop offset="1" stopColor="#443429" />
        </linearGradient>
      </defs>
      <g stroke="#F8F4EB" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* right-half petals, then mirrored for the left */}
        <g id={uid + "half"}>
          <path fill={`url(#${uid}b)`} d="M100 135 Q154.5 124.4 190.9 82.5 Q136.5 93.2 100 135 Z" />
          <path fill={`url(#${uid}b)`} d="M100 135 Q143.7 100.8 157.2 46.9 Q113.5 81.2 100 135 Z" />
          <path fill={`url(#${uid}o)`} d="M100 135 Q150.5 141.7 187.5 106.6 Q136.9 99.9 100 135 Z" />
          <path fill={`url(#${uid}f)`} d="M100 135 Q148.1 118.1 165 70 Q116.9 86.9 100 135 Z" />
          <path fill={`url(#${uid}f)`} d="M100 135 Q136.4 99.3 131.5 48.5 Q95 84.3 100 135 Z" />
        </g>
        <use href={`#${uid}half`} transform="translate(200 0) scale(-1 1)" />
        {/* central petal on top */}
        <path fill={`url(#${uid}c)`} d="M100 135 Q115 86 100 37 Q85 86 100 135 Z" />
      </g>
    </svg>
  );
}
function Ico({ d, className, style }) {
  return (<svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>);
}
const ICONS = {
  ruler: "M3 9l3-3 12 12-3 3zM9 6l1.5 1.5M12 9l1.5 1.5M15 12l1.5 1.5",
  width: "M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  mix: "M5 22V8l7-5 7 5v14M5 12h14M9 22v-6h6v6",
  pin: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 10a0 0 0 100 0",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  heart: "M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z",
};

/* ----------------------------- NAV -------------------------------------- */
function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <a className="brand" href="#top">
          <Lotus className="brand__mark" />
          <span className="brand__txt">
            <span className="brand__name">Rideekanda</span>
            <span className="brand__sub">Forest Monastery</span>
          </span>
        </a>
        <nav className="nav__links">
          <a href="#about">The Project</a>
          <a href="#specs">Engineering</a>
          <a href="#road">Pave the Road</a>
          <a href="#budget">Budget</a>
          <a className="btn btn--saffron nav__cta" href="#road">Pledge a Foot</a>
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------- HERO ------------------------------------- */
function Hero({ stats }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero__inner center">
        <div className="hero__lotus"><Lotus /></div>
        <p className="kicker kicker--center">A Path to Stillness</p>
        <h1>Paving the road in concrete to the <span className="h-em">forest monastery</span>.</h1>
        <p className="hero__lede">
          A quiet gravel track winds 1.9&nbsp;km (1,890&nbsp;m) through the forest to Rideekanda Monastery.
          Help us lay <strong>610&nbsp;meters</strong> of concrete — one linear meter at a time —
          so that meditation practitioners may walk and travel in peace.
        </p>
        <div className="hero__cta">
          <a className="btn btn--saffron" href="#road">Pledge a linear meter <Ico d={ICONS.arrow} className="btn__ico" style={{width:18,height:18}}/></a>
          <a className="btn btn--ghost" href="#about">Learn about the project</a>
        </div>
        <div className="hero__stats">
          <div className="hero__stat"><div className="num">1.9<small style={{fontSize:18}}>km</small></div><div className="lbl">Full length · 1,890 m</div></div>
          <div className="hero__stat"><div className="num">610<small style={{fontSize:18}}>m</small></div><div className="lbl">Concrete to be laid</div></div>
          <div className="hero__stat"><div className="num">{stats.pavedFeet}<small style={{fontSize:18}}>m</small></div><div className="lbl">Pledged so far</div></div>
          <div className="hero__stat"><div className="num">{stats.pct}<small style={{fontSize:18}}>%</small></div><div className="lbl">Of the way there</div></div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ABOUT ------------------------------------ */
function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap about__grid">
        <div>
          <p className="kicker">The Project</p>
          <h2 className="title">A proper way through the <span className="h-em">forest</span>.</h2>
          <p className="lede" style={{marginBottom: 30}}>
            The only access to Rideekanda Forest Monastery is an unpaved gravel track — severely uneven,
            rutted, and barely passable for ordinary vehicles. This project lays a durable concrete road
            so monastics, visitors, and meditators can reach this place of practice with ease and safety.
          </p>
          <div className="factsheet">
            <div className="fact"><div className="fact__k">Purpose</div><div className="fact__v">Reliable road access to the monastery for meditation practitioners and supply vehicles.</div></div>
            <div className="fact"><div className="fact__k">Full Length</div><div className="fact__v"><strong>1.9 km (1,890 m)</strong> &nbsp;of forest track</div></div>
            <div className="fact"><div className="fact__k">Critical Phase</div><div className="fact__v"><strong>610 m</strong> &nbsp;of concrete road repair — the steepest, most damaged stretch</div></div>
            <div className="fact"><div className="fact__k">Condition</div><div className="fact__v">Unpaved gravel, severe unevenness and off-road ruts — highly difficult for standard vehicles.</div></div>
            <div className="fact"><div className="fact__k">Location</div><div className="fact__v"><a href={PROJECT.mapUrl} target="_blank" rel="noopener">View the site on Google Maps ↗</a></div></div>
          </div>
        </div>
        <aside className="about__aside">
          <p style={{fontFamily:"var(--display)", fontSize:24, color:"var(--ink)", lineHeight:1.4, fontStyle:"italic"}}>
            “A road is not only a way for vehicles — it is a way for the Dhamma to reach those who seek it.”
          </p>
          <p>For years, the journey to Rideekanda has tested every visitor. In the monsoon, the gravel turns to
            mud; in the dry season, the ruts jar every wheel. Elderly practitioners and those carrying alms
            have struggled to make the climb.</p>
          <p>This concrete road — built to a verified 1:3:5 structural mix — will last for decades, carrying
            generations of practitioners quietly into the forest.</p>
          <div className="callout">
            <p className="kicker">The Critical 610 Meters</p>
            <h3>One meter of road, <span style={{fontStyle:"italic"}}>one act of generosity.</span></h3>
            <p>Each linear meter of finished concrete costs <strong style={{color:'#F4F0E5'}}>LKR&nbsp;8,878</strong>.
              Choose how many meters you wish to pave — your name marks that stretch of the road forever.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ----------------------------- TECH SPECS ------------------------------- */
function Tech() {
  return (
    <section className="section tech" id="specs">
      <div className="wrap">
        <div className="center" style={{maxWidth:720, margin:"0 auto 8px"}}>
          <p className="kicker kicker--center">Engineering &amp; Cost</p>
          <h2 className="title">Built to a verified <span className="h-em">1:3:5 mix</span>.</h2>
          <p className="lede">Every rupee is grounded in a structural engineering estimate. The lean mix was revised to
            a stable 1:3:5 volumetric ratio for safe compressive tolerance under standard traffic loads.</p>
        </div>

        <div className="spec-cards" style={{marginTop:48}}>
          <div className="spec"><Ico d={ICONS.ruler} className="spec__ico"/><div className="spec__v">610<small> m</small></div><div className="spec__k">Project scope — linear meters of concrete</div></div>
          <div className="spec"><Ico d={ICONS.width} className="spec__ico"/><div className="spec__v">2.4<small> m</small> × 100<small> mm</small></div><div className="spec__k">Cross-section — width × slab thickness</div></div>
          <div className="spec"><Ico d={ICONS.mix} className="spec__ico"/><div className="spec__v">1 : 3 : 5</div><div className="spec__k">Cement : sand : metal volumetric ratio</div></div>
          <div className="spec"><Ico d={ICONS.layers} className="spec__ico"/><div className="spec__v">880<small> bags</small></div><div className="spec__k">Cement allocation across the full 610 m</div></div>
        </div>

        <div className="totals">
          <div className="totals__card">
            <p className="kicker">Total Material Requirement</p>
            <ul className="mreq">
              {MATERIALS.map((m,i)=>(
                <li key={i}>
                  <span className="mreq__mat">{m.mat}<small>{m.sub}</small></span>
                  <b className="mreq__qty">{m.qty}<small> {m.unit}</small></b>
                </li>
              ))}
            </ul>
            <div className="totals__sum"><span>Total material cost</span><b><LKR>{fmt(MATERIAL_COST)}</LKR></b></div>
          </div>
          <div className="totals__card">
            <p className="kicker">Total Cost of Labour</p>
            <p className="totals__note">Direct on-site labour for the full 610&nbsp;m concrete scope — mixing,
              laying, levelling and finishing the 1:3:5 slab across the uneven terrain.</p>
            <div className="totals__sum"><span>Total labour cost</span><b><LKR>{fmt(LABOUR_COST)}</LKR></b></div>
          </div>
        </div>
        <div className="grandtotal">
          <span>Master project budget · 610&nbsp;m concrete scope</span>
          <b><LKR>{fmt(PROJECT.totalBudget)}</LKR></b>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { React, useState, useEffect, useRef, useMemo, PROJECT, DONATE_URL, MATERIALS, MATERIAL_COST, LABOUR_COST, fmt, LKR, Lotus, Ico, ICONS, Nav, Hero, About, Tech });
