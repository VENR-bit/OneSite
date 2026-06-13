/* Compiled from sections.jsx — do not edit directly; edit the .jsx source and recompile. */
(function(){
/* global React */
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = React;

/* ----------------------------- Project data ----------------------------- */
const PROJECT = {
  totalFeet: 2000,
  costPerFoot: 2706,
  // LKR per linear foot
  totalBudget: 5412000,
  // LKR (2,000 ft × 2,706)
  fullLengthKm: 1.9,
  fullLengthFt: 6200,
  // 1.9 km ≈ 6,200 ft (full road length)
  width: 8,
  // ft
  thickness: 4,
  // in
  mapUrl: "https://maps.app.goo.gl/ZbSeubxqA7pg2tbQ6"
};

// Where the "Donate" button sends supporters. Replace with the real
// payment link / bank-details page once provided.
const DONATE_URL = "#";

// Total material requirement for the 2,000 ft concrete scope (1:3:5 mix).
const MATERIALS = [{
  mat: "Cement",
  sub: "50 kg standard bags",
  qty: "880",
  unit: "bags"
}, {
  mat: "River Sand",
  sub: "Fine aggregate",
  qty: "32",
  unit: "cubes"
}, {
  mat: "Coarse Aggregate",
  sub: "Crushed metal",
  qty: "56",
  unit: "cubes"
}];
const MATERIAL_COST = 3812000; // LKR — total materials across 2,000 ft
const LABOUR_COST = 1600000; // LKR — total direct on-site labour

/* ----------------------------- Formatting ------------------------------- */
const fmt = n => Math.round(n).toLocaleString("en-US");
const LKR = ({
  children
}) => /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
  className: "lkr"
}, "LKR"), " ", children);

/* ----------------------------- Icons ------------------------------------ */
let _lotusN = 0;
function Lotus({
  className
}) {
  // Unique gradient ids so multiple lotuses on the page don't collide.
  const uid = useMemo(() => "lt" + ++_lotusN, []);
  return /*#__PURE__*/React.createElement("svg", {
    className: "lotus " + (className || ""),
    viewBox: "0 26 200 120",
    role: "img",
    "aria-label": "Lotus"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "f",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#9c6c3f"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#6e4a28"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "b",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#835833"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#5d3f23"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "o",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#6b4626"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#46301a"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: uid + "c",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#6c5443"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#443429"
  }))), /*#__PURE__*/React.createElement("g", {
    stroke: "#F8F4EB",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("g", {
    id: uid + "half"
  }, /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}b)`,
    d: "M100 135 Q154.5 124.4 190.9 82.5 Q136.5 93.2 100 135 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}b)`,
    d: "M100 135 Q143.7 100.8 157.2 46.9 Q113.5 81.2 100 135 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}o)`,
    d: "M100 135 Q150.5 141.7 187.5 106.6 Q136.9 99.9 100 135 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}f)`,
    d: "M100 135 Q148.1 118.1 165 70 Q116.9 86.9 100 135 Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}f)`,
    d: "M100 135 Q136.4 99.3 131.5 48.5 Q95 84.3 100 135 Z"
  })), /*#__PURE__*/React.createElement("use", {
    href: `#${uid}half`,
    transform: "translate(200 0) scale(-1 1)"
  }), /*#__PURE__*/React.createElement("path", {
    fill: `url(#${uid}c)`,
    d: "M100 135 Q115 86 100 37 Q85 86 100 135 Z"
  })));
}
function Ico({
  d,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  }));
}
const ICONS = {
  ruler: "M3 9l3-3 12 12-3 3zM9 6l1.5 1.5M12 9l1.5 1.5M15 12l1.5 1.5",
  width: "M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  mix: "M5 22V8l7-5 7 5v14M5 12h14M9 22v-6h6v6",
  pin: "M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z M12 10a0 0 0 100 0",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  heart: "M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"
};

/* ----------------------------- NAV -------------------------------------- */
function Nav() {
  return /*#__PURE__*/React.createElement("header", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "brand",
    href: "#top"
  }, /*#__PURE__*/React.createElement(Lotus, {
    className: "brand__mark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "brand__txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand__name"
  }, "Rideekanda"), /*#__PURE__*/React.createElement("span", {
    className: "brand__sub"
  }, "Forest Monastery"))), /*#__PURE__*/React.createElement("nav", {
    className: "nav__links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, "The Project"), /*#__PURE__*/React.createElement("a", {
    href: "#specs"
  }, "Engineering"), /*#__PURE__*/React.createElement("a", {
    href: "#road"
  }, "Pave the Road"), /*#__PURE__*/React.createElement("a", {
    href: "#budget"
  }, "Budget"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--saffron nav__cta",
    href: "#road"
  }, "Pledge a Foot"))));
}

/* ----------------------------- HERO ------------------------------------- */
function Hero({
  stats
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hero__inner center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__lotus"
  }, /*#__PURE__*/React.createElement(Lotus, null)), /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "A Path to Stillness"), /*#__PURE__*/React.createElement("h1", null, "Paving the road in concrete to the ", /*#__PURE__*/React.createElement("span", {
    className: "h-em"
  }, "forest monastery"), "."), /*#__PURE__*/React.createElement("p", {
    className: "hero__lede"
  }, "A quiet gravel track winds 1.9\xA0km (6,200\xA0ft) through the forest to Rideekanda Monastery. Help us lay ", /*#__PURE__*/React.createElement("strong", null, "2,000\xA0feet"), " of concrete \u2014 one linear foot at a time \u2014 so that meditation practitioners may walk and travel in peace."), /*#__PURE__*/React.createElement("div", {
    className: "hero__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--saffron",
    href: "#road"
  }, "Pledge a linear foot ", /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.arrow,
    className: "btn__ico",
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--ghost",
    href: "#about"
  }, "Learn about the project")), /*#__PURE__*/React.createElement("div", {
    className: "hero__stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, "1.9", /*#__PURE__*/React.createElement("small", {
    style: {
      fontSize: 18
    }
  }, "km")), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Full length \xB7 6,200 ft")), /*#__PURE__*/React.createElement("div", {
    className: "hero__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, "2,000", /*#__PURE__*/React.createElement("small", {
    style: {
      fontSize: 18
    }
  }, "ft")), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Concrete to be laid")), /*#__PURE__*/React.createElement("div", {
    className: "hero__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, stats.pavedFeet, /*#__PURE__*/React.createElement("small", {
    style: {
      fontSize: 18
    }
  }, "ft")), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Pledged so far")), /*#__PURE__*/React.createElement("div", {
    className: "hero__stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, stats.pct, /*#__PURE__*/React.createElement("small", {
    style: {
      fontSize: 18
    }
  }, "%")), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Of the way there")))));
}

/* ----------------------------- ABOUT ------------------------------------ */
function About() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section about",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap about__grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "kicker"
  }, "The Project"), /*#__PURE__*/React.createElement("h2", {
    className: "title"
  }, "A proper way through the ", /*#__PURE__*/React.createElement("span", {
    className: "h-em"
  }, "forest"), "."), /*#__PURE__*/React.createElement("p", {
    className: "lede",
    style: {
      marginBottom: 30
    }
  }, "The only access to Rideekanda Forest Monastery is an unpaved gravel track \u2014 severely uneven, rutted, and barely passable for ordinary vehicles. This project lays a durable concrete road so monastics, visitors, and meditators can reach this place of practice with ease and safety."), /*#__PURE__*/React.createElement("div", {
    className: "factsheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact__k"
  }, "Purpose"), /*#__PURE__*/React.createElement("div", {
    className: "fact__v"
  }, "Reliable road access to the monastery for meditation practitioners and supply vehicles.")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact__k"
  }, "Full Length"), /*#__PURE__*/React.createElement("div", {
    className: "fact__v"
  }, /*#__PURE__*/React.createElement("strong", null, "1.9 km (6,200 ft)"), " \xA0of forest track")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact__k"
  }, "Critical Phase"), /*#__PURE__*/React.createElement("div", {
    className: "fact__v"
  }, /*#__PURE__*/React.createElement("strong", null, "2,000 ft"), " \xA0of concrete road repair \u2014 the steepest, most damaged stretch")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact__k"
  }, "Condition"), /*#__PURE__*/React.createElement("div", {
    className: "fact__v"
  }, "Unpaved gravel, severe unevenness and off-road ruts \u2014 highly difficult for standard vehicles.")), /*#__PURE__*/React.createElement("div", {
    className: "fact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fact__k"
  }, "Location"), /*#__PURE__*/React.createElement("div", {
    className: "fact__v"
  }, /*#__PURE__*/React.createElement("a", {
    href: PROJECT.mapUrl,
    target: "_blank",
    rel: "noopener"
  }, "View the site on Google Maps \u2197"))))), /*#__PURE__*/React.createElement("aside", {
    className: "about__aside"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--display)",
      fontSize: 24,
      color: "var(--ink)",
      lineHeight: 1.4,
      fontStyle: "italic"
    }
  }, "\u201CA road is not only a way for vehicles \u2014 it is a way for the Dhamma to reach those who seek it.\u201D"), /*#__PURE__*/React.createElement("p", null, "For years, the journey to Rideekanda has tested every visitor. In the monsoon, the gravel turns to mud; in the dry season, the ruts jar every wheel. Elderly practitioners and those carrying alms have struggled to make the climb."), /*#__PURE__*/React.createElement("p", null, "This concrete road \u2014 built to a verified 1:3:5 structural mix \u2014 will last for decades, carrying generations of practitioners quietly into the forest."), /*#__PURE__*/React.createElement("div", {
    className: "callout"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker"
  }, "The Critical 2,000 Feet"), /*#__PURE__*/React.createElement("h3", null, "One foot of road, ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic"
    }
  }, "one act of generosity.")), /*#__PURE__*/React.createElement("p", null, "Each linear foot of finished concrete costs ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#F4F0E5'
    }
  }, "LKR\xA02,706"), ". Choose how many feet you wish to pave \u2014 your name marks that stretch of the road forever.")))));
}

/* ----------------------------- TECH SPECS ------------------------------- */
function Tech() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section tech",
    id: "specs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center",
    style: {
      maxWidth: 720,
      margin: "0 auto 8px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "Engineering & Cost"), /*#__PURE__*/React.createElement("h2", {
    className: "title"
  }, "Built to a verified ", /*#__PURE__*/React.createElement("span", {
    className: "h-em"
  }, "1:3:5 mix"), "."), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Every rupee is grounded in a structural engineering estimate. The lean mix was revised to a stable 1:3:5 volumetric ratio for safe compressive tolerance under standard traffic loads.")), /*#__PURE__*/React.createElement("div", {
    className: "spec-cards",
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.ruler,
    className: "spec__ico"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spec__v"
  }, "2,000", /*#__PURE__*/React.createElement("small", null, " ft")), /*#__PURE__*/React.createElement("div", {
    className: "spec__k"
  }, "Project scope \u2014 linear feet of concrete")), /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.width,
    className: "spec__ico"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spec__v"
  }, "8", /*#__PURE__*/React.createElement("small", null, " ft"), " \xD7 4", /*#__PURE__*/React.createElement("small", null, " in")), /*#__PURE__*/React.createElement("div", {
    className: "spec__k"
  }, "Cross-section \u2014 width \xD7 slab thickness")), /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.mix,
    className: "spec__ico"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spec__v"
  }, "1 : 3 : 5"), /*#__PURE__*/React.createElement("div", {
    className: "spec__k"
  }, "Cement : sand : metal volumetric ratio")), /*#__PURE__*/React.createElement("div", {
    className: "spec"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.layers,
    className: "spec__ico"
  }), /*#__PURE__*/React.createElement("div", {
    className: "spec__v"
  }, "880", /*#__PURE__*/React.createElement("small", null, " bags")), /*#__PURE__*/React.createElement("div", {
    className: "spec__k"
  }, "Cement allocation across the full 2,000 ft"))), /*#__PURE__*/React.createElement("div", {
    className: "totals"
  }, /*#__PURE__*/React.createElement("div", {
    className: "totals__card"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker"
  }, "Total Material Requirement"), /*#__PURE__*/React.createElement("ul", {
    className: "mreq"
  }, MATERIALS.map((m, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "mreq__mat"
  }, m.mat, /*#__PURE__*/React.createElement("small", null, m.sub)), /*#__PURE__*/React.createElement("b", {
    className: "mreq__qty"
  }, m.qty, /*#__PURE__*/React.createElement("small", null, " ", m.unit))))), /*#__PURE__*/React.createElement("div", {
    className: "totals__sum"
  }, /*#__PURE__*/React.createElement("span", null, "Total material cost"), /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(LKR, null, fmt(MATERIAL_COST))))), /*#__PURE__*/React.createElement("div", {
    className: "totals__card"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker"
  }, "Total Cost of Labour"), /*#__PURE__*/React.createElement("p", {
    className: "totals__note"
  }, "Direct on-site labour for the full 2,000\xA0ft concrete scope \u2014 mixing, laying, levelling and finishing the 1:3:5 slab across the uneven terrain."), /*#__PURE__*/React.createElement("div", {
    className: "totals__sum"
  }, /*#__PURE__*/React.createElement("span", null, "Total labour cost"), /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(LKR, null, fmt(LABOUR_COST)))))), /*#__PURE__*/React.createElement("div", {
    className: "grandtotal"
  }, /*#__PURE__*/React.createElement("span", null, "Master project budget \xB7 2,000\xA0ft concrete scope"), /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(LKR, null, fmt(PROJECT.totalBudget))))));
}
Object.assign(window, {
  React,
  useState,
  useEffect,
  useRef,
  useMemo,
  PROJECT,
  DONATE_URL,
  MATERIALS,
  MATERIAL_COST,
  LABOUR_COST,
  fmt,
  LKR,
  Lotus,
  Ico,
  ICONS,
  Nav,
  Hero,
  About,
  Tech
});
})();
