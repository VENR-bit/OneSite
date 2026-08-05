/* ──────────────────────────────────────────────────────────────
   Rideekanda dashboard calendar data.

   Update once a year (or when the retreat schedule changes):
     • poya      — Sri Lanka Full Moon Poya days
     • holidays  — other Sri Lanka public holidays
     • retreats  — retreat schedule (mirrors the booking page /
                   WeTravel listings: title + start/end, inclusive)

   Dates are "YYYY-MM-DD". Retreat ranges are inclusive of start & end.
   ────────────────────────────────────────────────────────────── */
window.RK_CALENDAR = {
  poya: [
    { date: "2026-01-03", name: "Duruthu Poya" },
    { date: "2026-02-01", name: "Navam Poya" },
    { date: "2026-03-02", name: "Madin Poya" },
    { date: "2026-04-01", name: "Bak Poya" },
    { date: "2026-05-31", name: "Vesak Poya" },
    { date: "2026-06-29", name: "Poson Poya" },
    { date: "2026-07-29", name: "Esala Poya" },
    { date: "2026-08-27", name: "Nikini Poya" },
    { date: "2026-09-26", name: "Binara Poya" },
    { date: "2026-10-25", name: "Vap Poya" },
    { date: "2026-11-24", name: "Ill Poya" },
    { date: "2026-12-23", name: "Unduvap Poya" }
  ],
  holidays: [
    { date: "2026-01-15", name: "Tamil Thai Pongal Day" },
    { date: "2026-02-04", name: "Independence Day" },
    { date: "2026-02-15", name: "Mahasivarathri Day" },
    { date: "2026-03-21", name: "Id-Ul-Fitr (Ramazan)" },
    { date: "2026-04-03", name: "Good Friday" },
    { date: "2026-04-13", name: "Sinhala & Tamil New Year Eve" },
    { date: "2026-04-14", name: "Sinhala & Tamil New Year" },
    { date: "2026-05-01", name: "May Day" },
    { date: "2026-05-28", name: "Id-Ul-Alha (Hadji)" },
    { date: "2026-08-26", name: "Milad-Un-Nabi" },
    { date: "2026-11-08", name: "Deepavali Festival Day" },
    { date: "2026-12-25", name: "Christmas Day" }
  ],
  retreats: [
    { start: "2026-06-02", end: "2026-06-09", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-07-20", end: "2026-07-27", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-08-02", end: "2026-08-09", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-08-17", end: "2026-08-24", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-09-02", end: "2026-09-09", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-09-15", end: "2026-09-22", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-10-07", end: "2026-10-14", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2026-12-07", end: "2026-12-14", name: "7-Day Concentration & Vipassana Retreat" },

    { start: "2027-01-16", end: "2027-01-23", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-02-01", end: "2027-02-08", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-02-15", end: "2027-02-22", name: "7-Day Concentration & Vipassana Retreat (Pending)", pending: true },
    { start: "2027-03-10", end: "2027-03-17", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-03-23", end: "2027-03-30", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-04-01", end: "2027-04-08", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-06-01", end: "2027-06-08", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-06-15", end: "2027-06-22", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-06-29", end: "2027-07-06", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-07-11", end: "2027-07-18", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-07-24", end: "2027-07-31", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-08-08", end: "2027-08-15", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-08-22", end: "2027-08-29", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-09-08", end: "2027-09-15", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-09-22", end: "2027-09-29", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-10-03", end: "2027-10-10", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-10-24", end: "2027-10-31", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-11-15", end: "2027-11-22", name: "7-Day Concentration & Vipassana Retreat" },
    { start: "2027-11-29", end: "2027-12-06", name: "7-Day Concentration & Vipassana Retreat" }
  ],
  bookingUrl: "book-your-stay/"
};
