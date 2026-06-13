/* Compiled from app.jsx — do not edit directly; edit the .jsx source and recompile. */
(function(){
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React, PROJECT, DONATE_URL, fmt, LKR, Lotus, Ico, ICONS, Nav, Hero, About, Tech */
const {
  useState,
  useEffect,
  useRef,
  useMemo
} = window;
const STORE_KEY = "rideekanda_pledges_v2";
const SEED = [{
  id: "s1",
  name: "The Silva Family",
  message: "For our late mother.",
  feet: 60
}, {
  id: "s2",
  name: "Anonymous",
  message: "",
  feet: 100
}, {
  id: "s3",
  name: "Dhamma Friends, Colombo",
  message: "May all beings be at ease.",
  feet: 75
}, {
  id: "s4",
  name: "Nimal & Kumari",
  message: "",
  feet: 40
}, {
  id: "s5",
  name: "A. Fernando",
  message: "In gratitude.",
  feet: 25
}, {
  id: "s6",
  name: "Meditation Group, Kandy",
  message: "",
  feet: 50
}];
function loadPledges() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p;
    }
  } catch (e) {}
  return SEED.slice();
}

/* ===================== PLEDGE CARD ===================== */
function PledgeCard({
  remaining,
  onPledge,
  justPledged,
  onReset
}) {
  const [name, setName] = useState("");
  const [feet, setFeet] = useState(10);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const ft = feet === "" ? 0 : feet;
  const cost = ft * PROJECT.costPerFoot;
  const quick = [1, 5, 10, 25, 50, 100];
  const clampFeet = v => Math.max(1, Math.min(remaining, v || 1));
  function submit() {
    if (!name.trim()) {
      setErr("Please add a name for the road marker.");
      return;
    }
    if (remaining <= 0) {
      setErr("The road is fully pledged — thank you!");
      return;
    }
    setErr("");
    onPledge({
      name: name.trim(),
      feet: clampFeet(feet),
      message: message.trim()
    });
    setName("");
    setMessage("");
    setFeet(10);
  }
  if (justPledged) {
    const amount = `LKR ${fmt(justPledged.feet * PROJECT.costPerFoot)}`;
    const hasLink = DONATE_URL && DONATE_URL !== "#";
    return /*#__PURE__*/React.createElement("div", {
      className: "pledge"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Lotus, {
      className: "lotus--mark"
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        textAlign: "center"
      }
    }, "Your stretch is reserved."), /*#__PURE__*/React.createElement("p", {
      className: "pledge__hint",
      style: {
        textAlign: "center"
      }
    }, "You\u2019ve pledged ", /*#__PURE__*/React.createElement("b", null, justPledged.feet, " linear feet"), ". Complete your donation to lay the concrete \u2014 your name marks that stretch of the road."), /*#__PURE__*/React.createElement("div", {
      className: "pledge__cost"
    }, /*#__PURE__*/React.createElement("span", {
      className: "l"
    }, "Amount to donate"), /*#__PURE__*/React.createElement("span", {
      className: "v"
    }, /*#__PURE__*/React.createElement(LKR, null, fmt(justPledged.feet * PROJECT.costPerFoot)))), /*#__PURE__*/React.createElement("a", _extends({
      className: "btn btn--saffron btn--block",
      href: DONATE_URL
    }, hasLink ? {
      target: "_blank",
      rel: "noopener"
    } : {}), /*#__PURE__*/React.createElement(Ico, {
      d: ICONS.heart,
      style: {
        width: 18,
        height: 18
      }
    }), " Donate ", amount), /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ghost btn--block",
      style: {
        marginTop: 10
      },
      onClick: onReset
    }, "Pledge another stretch"), /*#__PURE__*/React.createElement("p", {
      className: "pledge__note"
    }, hasLink ? "Your name appears in the supporters list below once your stretch is pledged." : "A secure payment link will be added here shortly. Your stretch is already held on the road."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "pledge"
  }, /*#__PURE__*/React.createElement("h3", null, "Pave a stretch of road"), /*#__PURE__*/React.createElement("p", {
    className: "pledge__hint"
  }, "Choose how many linear feet to pledge. Each foot is ", /*#__PURE__*/React.createElement("b", null, "LKR\xA02,706"), " of finished concrete."), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Your name \u2014 as it appears on the road"), /*#__PURE__*/React.createElement("input", {
    className: "input",
    value: name,
    placeholder: "e.g. The Perera Family",
    onChange: e => setName(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Linear feet to pledge"), /*#__PURE__*/React.createElement("div", {
    className: "feetfield"
  }, /*#__PURE__*/React.createElement("input", {
    className: "feetfield__input",
    type: "text",
    inputMode: "numeric",
    pattern: "[0-9]*",
    value: feet === "" ? "" : feet,
    placeholder: "0",
    "aria-label": "Number of linear feet to pledge",
    onChange: e => {
      const digits = e.target.value.replace(/[^0-9]/g, "");
      if (digits === "") {
        setFeet("");
        return;
      }
      setFeet(Math.min(remaining, parseInt(digits, 10)));
    },
    onBlur: () => setFeet(f => f === "" || f < 1 ? 1 : f)
  }), /*#__PURE__*/React.createElement("span", {
    className: "feetfield__suffix"
  }, "linear\xA0feet")), /*#__PURE__*/React.createElement("div", {
    className: "quickset"
  }, quick.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    className: feet === q ? "on" : "",
    onClick: () => setFeet(clampFeet(q))
  }, q, " ft")))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "A short dedication ", /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: "none",
      letterSpacing: 0,
      color: "var(--ink-faint)"
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("textarea", {
    className: "input",
    value: message,
    placeholder: "May all beings be well\u2026",
    onChange: e => setMessage(e.target.value)
  })), err && /*#__PURE__*/React.createElement("p", {
    className: "warn"
  }, err), /*#__PURE__*/React.createElement("div", {
    className: "pledge__cost"
  }, /*#__PURE__*/React.createElement("span", {
    className: "l"
  }, ft, " ft \xD7 LKR 2,706"), /*#__PURE__*/React.createElement("span", {
    className: "v"
  }, /*#__PURE__*/React.createElement(LKR, null, fmt(cost)))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--primary btn--block",
    onClick: submit,
    disabled: remaining <= 0
  }, remaining <= 0 ? "Road fully pledged 🙏" : /*#__PURE__*/React.createElement(React.Fragment, null, "Pledge these ", ft, " feet ", /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.arrow,
    style: {
      width: 18,
      height: 18
    }
  }))), /*#__PURE__*/React.createElement("p", {
    className: "pledge__note"
  }, remaining > 0 ? `${fmt(remaining)} ft of road still open to pledge.` : "Every foot has found a donor."));
}

/* ===================== PAVER SECTION ===================== */
function Paver({
  pledges,
  pavedFeet,
  pct,
  remaining,
  onPledge,
  justPledged,
  setJustPledged
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "section paver",
    id: "road"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center",
    style: {
      maxWidth: 720,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "Pave the Road"), /*#__PURE__*/React.createElement("h2", {
    className: "title"
  }, "Your name, set in ", /*#__PURE__*/React.createElement("span", {
    className: "h-em"
  }, "concrete"), "."), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Each pledge lays a real stretch of the 2,000-foot road. Watch it pave, foot by foot, as the community comes together. The rough gravel that remains is the work still to be done.")), /*#__PURE__*/React.createElement("div", {
    className: "paver__pledge"
  }, /*#__PURE__*/React.createElement(PledgeCard, {
    remaining: remaining,
    onPledge: onPledge,
    justPledged: justPledged,
    onReset: () => setJustPledged(null)
  })), /*#__PURE__*/React.createElement("div", {
    className: "progress-inline",
    id: "progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-inline__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pmodal__head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "Road Progress"), /*#__PURE__*/React.createElement("h3", null, "Watch the road ", /*#__PURE__*/React.createElement("em", null, "roll out")), /*#__PURE__*/React.createElement("div", {
    className: "pmodal__big"
  }, /*#__PURE__*/React.createElement("b", null, fmt(pavedFeet)), " of 2,000 ft pledged \xB7 ", pct, "% complete")), /*#__PURE__*/React.createElement(VRoad, {
    pledges: pledges
  }))), /*#__PURE__*/React.createElement(Donors, {
    pledges: pledges
  })));
}
function Donors({
  pledges
}) {
  const ordered = pledges.slice().reverse();
  return /*#__PURE__*/React.createElement("div", {
    className: "donors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "donors__head"
  }, /*#__PURE__*/React.createElement("h4", null, "Those who have pledged"), /*#__PURE__*/React.createElement("span", {
    className: "donors__count"
  }, pledges.length, " supporters")), /*#__PURE__*/React.createElement("div", {
    className: "donorgrid"
  }, ordered.map(p => /*#__PURE__*/React.createElement("div", {
    className: "donorcard",
    key: p.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "donorcard__ft"
  }, p.feet, /*#__PURE__*/React.createElement("small", null, "feet")), /*#__PURE__*/React.createElement("div", {
    className: "donorcard__nm"
  }, p.name, p.message && /*#__PURE__*/React.createElement("div", {
    className: "msg"
  }, "\u201C", p.message, "\u201D"))))));
}

/* ===================== BUDGET ===================== */
function Budget({
  pavedFeet,
  pledgedLKR
}) {
  const total = PROJECT.totalBudget;
  const pledgedPct = Math.min(100, pledgedLKR / total * 100);
  const remaining = Math.max(0, total - pledgedLKR);
  return /*#__PURE__*/React.createElement("section", {
    className: "section budget",
    id: "budget"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap budget__grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "kicker"
  }, "Transparency"), /*#__PURE__*/React.createElement("h2", {
    className: "title"
  }, "Every rupee, ", /*#__PURE__*/React.createElement("span", {
    className: "h-em"
  }, "accounted for"), "."), /*#__PURE__*/React.createElement("p", {
    className: "lede",
    style: {
      marginBottom: 30
    }
  }, "This is a community offering. The budget below moves the moment a pledge is made \u2014 what has been pledged, and what is still needed to finish the 2,000\xA0ft of concrete road."), /*#__PURE__*/React.createElement("div", {
    className: "bigbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bigbar__track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bigbar__done",
    style: {
      width: pledgedPct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "bigbar__labels"
  }, /*#__PURE__*/React.createElement("span", null, Math.round(pledgedPct), "% pledged"), /*#__PURE__*/React.createElement("span", null, "Goal \xB7 ", /*#__PURE__*/React.createElement(LKR, null, fmt(total)))))), /*#__PURE__*/React.createElement("div", {
    className: "budrows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "budrow budrow--total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "budrow__l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "budrow__chip",
    style: {
      background: "var(--paper-3)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "budrow__k"
  }, "Total project budget", /*#__PURE__*/React.createElement("small", null, "2,000 ft \xB7 full 1:3:5 concrete scope"))), /*#__PURE__*/React.createElement("div", {
    className: "budrow__v"
  }, /*#__PURE__*/React.createElement(LKR, null, fmt(total)))), /*#__PURE__*/React.createElement("div", {
    className: "budrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "budrow__l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "budrow__chip",
    style: {
      background: "var(--forest)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "budrow__k"
  }, "Pledged so far", /*#__PURE__*/React.createElement("small", null, fmt(pavedFeet), " ft reserved by supporters"))), /*#__PURE__*/React.createElement("div", {
    className: "budrow__v"
  }, /*#__PURE__*/React.createElement(LKR, null, fmt(pledgedLKR)))), /*#__PURE__*/React.createElement("div", {
    className: "budrow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "budrow__l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "budrow__chip",
    style: {
      background: "var(--paper-3)",
      boxShadow: "inset 0 0 0 1.5px var(--gravel)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "budrow__k"
  }, "Still to be raised", /*#__PURE__*/React.createElement("small", null, fmt(PROJECT.totalFeet - pavedFeet), " ft of road remaining"))), /*#__PURE__*/React.createElement("div", {
    className: "budrow__v"
  }, /*#__PURE__*/React.createElement(LKR, null, fmt(remaining)))))));
}

/* ===================== CTA + FOOTER ===================== */
function CTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta__lotus"
  }, /*#__PURE__*/React.createElement(Lotus, null)), /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "An Act of Generosity"), /*#__PURE__*/React.createElement("h2", null, "Lay one foot of the path, ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic"
    }
  }, "and walk it forever.")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Whether you pave a single foot or a hundred, every contribution carries practitioners quietly into the forest at Rideekanda. May your generosity bear fruit."), /*#__PURE__*/React.createElement("div", {
    className: "cta__cta"
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn--saffron",
    href: "#road"
  }, "Pledge a linear foot ", /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.arrow,
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("a", {
    className: "btn btn--ghost",
    href: PROJECT.mapUrl,
    target: "_blank",
    rel: "noopener",
    style: {
      color: "#ECE7D7",
      boxShadow: "inset 0 0 0 1.5px rgba(236,231,215,.3)"
    }
  }, "Visit the site \u2197"))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__brand"
  }, /*#__PURE__*/React.createElement(Lotus, {
    className: "brand__mark"
  }), /*#__PURE__*/React.createElement("span", {
    className: "brand__txt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand__name",
    style: {
      fontFamily: "var(--display)",
      fontSize: 18
    }
  }, "Rideekanda Forest Monastery"), /*#__PURE__*/React.createElement("span", {
    className: "brand__sub",
    style: {
      fontSize: 10.5,
      letterSpacing: ".18em",
      textTransform: "uppercase"
    }
  }, "Road Construction Project"))), /*#__PURE__*/React.createElement("small", null, "A community Dh\u0101na offering \xB7 2,000 ft concrete road \xB7 LKR 2,706 per linear foot")));
}

/* ===================== TOAST ===================== */
function Toast({
  msg,
  show
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "toast" + (show ? " show" : "")
  }, /*#__PURE__*/React.createElement(Ico, {
    d: ICONS.check,
    style: {
      width: 18,
      height: 18
    }
  }), " ", msg);
}

/* ===================== VERTICAL CARPET ROAD ===================== */
const ROLL_MS = 1300;
function VRoad({
  pledges
}) {
  const total = PROJECT.totalFeet;
  const ordered = pledges.slice();
  let cursor = 0;
  const spans = ordered.map(p => {
    const start = cursor;
    cursor += p.feet;
    return {
      ...p,
      start,
      end: cursor,
      mid: start + p.feet / 2
    };
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
    const el = stageRef.current;
    if (!el) return;
    const road = el.querySelector(".vroad-track");
    const rect = road.getBoundingClientRect();
    const fracFromBottom = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    setCaret(fracFromBottom * 100);
    const ft = fracFromBottom * total;
    const hit = spans.find(s => ft >= s.start && ft < s.end);
    setActive(hit ? hit.id : null);
  }
  function clear() {
    setActive(null);
    setCaret(null);
  }
  function start(e) {
    const el = stageRef.current;
    if (el && el.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    locate(e);
  }
  function leave(e) {
    if (!e || e.pointerType !== "touch") clear();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "vstage",
    ref: stageRef,
    onPointerDown: start,
    onPointerMove: locate,
    onPointerCancel: clear,
    onPointerLeave: leave
  }, /*#__PURE__*/React.createElement("div", {
    className: "vlegend"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "vleg--pledged"
  }), " Pledge to support ", /*#__PURE__*/React.createElement("b", null, fmt(pledgedFeet), "\u00a0", "ft")), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "vleg--open"
  }), " To be paved ", /*#__PURE__*/React.createElement("b", null, fmt(blankFeet), "\u00a0", "ft"))), /*#__PURE__*/React.createElement("div", {
    className: "vroad" + (rolling ? " vroad--rolling" : ""),
    style: {
      "--roll-ms": ROLL_MS + "ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "vcap vcap--bot"
  }, "0 ft"), /*#__PURE__*/React.createElement("span", {
    className: "vcap vcap--top"
  }, "2,000 ft"), /*#__PURE__*/React.createElement("div", {
    className: "vroad-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vroad-surface"
  }, spans.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "vseg vseg--pledged" + (active === s.id ? " is-active" : ""),
    style: {
      bottom: s.start / total * 100 + "%",
      height: s.feet / total * 100 + "%"
    }
  })))), rolling && /*#__PURE__*/React.createElement("div", {
    className: "vroad-roll"
  }), caret != null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "vcaret-glow",
    style: {
      bottom: caret + "%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "vcaret",
    style: {
      bottom: caret + "%"
    }
  })), spans.map(s => {
    const isActive = active === s.id;
    const delay = s.mid / total * ROLL_MS + 180;
    return /*#__PURE__*/React.createElement("div", {
      key: "l" + s.id,
      className: "vlabel vlabel--pledged" + (isActive ? " is-active" : ""),
      style: {
        bottom: s.mid / total * 100 + "%",
        transform: "translateY(50%)" + (isActive ? " scale(1.16)" : ""),
        animationDelay: delay + "ms"
      },
      onMouseEnter: () => setActive(s.id),
      onMouseLeave: () => setActive(null)
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      className: "vlabel__ft"
    }, s.feet, "ft"), " ", s.name), /*#__PURE__*/React.createElement("span", {
      className: "vlabel__dot"
    }), /*#__PURE__*/React.createElement("span", {
      className: "vlabel__tick",
      style: {
        top: "50%"
      }
    }));
  })));
}

/* ===================== FLOATING PROGRESS BUTTON ===================== */
function ProgressFab({
  pct,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "fab",
    onClick: onClick,
    "aria-label": "View road progress"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fab__ring",
    style: {
      "--p": pct
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "fab__pct"
  }, pct, /*#__PURE__*/React.createElement("small", null, "%"))), /*#__PURE__*/React.createElement("span", {
    className: "fab__txt"
  }, /*#__PURE__*/React.createElement("b", null, "Road progress"), /*#__PURE__*/React.createElement("span", null, "Tap to see the road")));
}

/* ===================== PROGRESS MODAL ===================== */
function ProgressModal({
  open,
  onClose,
  pledges,
  pct,
  pavedFeet
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(r);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pmodal" + (mounted ? " is-open" : ""),
    onMouseDown: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pmodal__panel"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pmodal__close",
    onClick: onClose,
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement(Ico, {
    d: "M6 6l12 12M18 6L6 18",
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pmodal__head"
  }, /*#__PURE__*/React.createElement("p", {
    className: "kicker kicker--center"
  }, "The Road So Far"), /*#__PURE__*/React.createElement("h3", null, "Watch the road ", /*#__PURE__*/React.createElement("em", null, "roll out")), /*#__PURE__*/React.createElement("div", {
    className: "pmodal__big"
  }, /*#__PURE__*/React.createElement("b", null, fmt(pavedFeet)), " of 2,000 ft pledged \xB7 ", pct, "% complete")), /*#__PURE__*/React.createElement(VRoad, {
    pledges: pledges
  })));
}

/* ===================== APP ===================== */
function App() {
  const [pledges, setPledges] = useState(loadPledges);
  const [justPledged, setJustPledged] = useState(null);
  const [newId, setNewId] = useState(null);
  const [toast, setToast] = useState({
    msg: "",
    show: false
  });
  const [progressOpen, setProgressOpen] = useState(false);
  const toastTimer = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(pledges));
    } catch (e) {}
  }, [pledges]);
  function flash(msg) {
    setToast({
      msg,
      show: true
    });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({
      ...t,
      show: false
    })), 2800);
  }
  const pavedFeet = useMemo(() => pledges.reduce((s, p) => s + p.feet, 0), [pledges]);
  const remaining = Math.max(0, PROJECT.totalFeet - pavedFeet);
  const pct = Math.round(pavedFeet / PROJECT.totalFeet * 100);
  const pledgedLKR = pavedFeet * PROJECT.costPerFoot;
  function handlePledge({
    name,
    feet,
    message
  }) {
    const id = "p" + Date.now();
    const p = {
      id,
      name,
      feet,
      message
    };
    setPledges(list => [...list, p]);
    setJustPledged(p);
    setNewId(id);
    flash(`${feet} ft reserved on the road — complete your donation below.`);
    setTimeout(() => {
      const el = document.getElementById("road");
      if (el) window.scrollTo({
        top: el.offsetTop - 60,
        behavior: "smooth"
      });
    }, 60);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, {
    stats: {
      pavedFeet: fmt(pavedFeet),
      pct
    }
  }), /*#__PURE__*/React.createElement(About, null), /*#__PURE__*/React.createElement(Tech, null), /*#__PURE__*/React.createElement(Paver, {
    pledges: pledges,
    pavedFeet: pavedFeet,
    pct: pct,
    remaining: remaining,
    onPledge: handlePledge,
    justPledged: justPledged,
    setJustPledged: setJustPledged
  }), /*#__PURE__*/React.createElement(Budget, {
    pavedFeet: pavedFeet,
    pledgedLKR: pledgedLKR
  }), /*#__PURE__*/React.createElement(CTA, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(Toast, {
    msg: toast.msg,
    show: toast.show
  }), /*#__PURE__*/React.createElement(ProgressFab, {
    pct: pct,
    onClick: () => setProgressOpen(true)
  }), /*#__PURE__*/React.createElement(ProgressModal, {
    open: progressOpen,
    onClose: () => setProgressOpen(false),
    pledges: pledges,
    pct: pct,
    pavedFeet: pavedFeet
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})();
