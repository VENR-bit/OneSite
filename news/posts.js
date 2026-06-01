/* ──────────────────────────────────────────────────────────────
   News & Events data.
   To publish a new item, add an object to the TOP of this array.
   Fields:
     title    — headline
     date     — ISO date "YYYY-MM-DD" (used for sorting + display)
     type     — "Event" | "News" | "Notice" | "Dhamma"  (the tag)
     excerpt  — one or two sentences shown on the card
     image    — optional path under assets/ (omit for a text card)
     link     — optional URL ("#" or external) for "Read more"
   ────────────────────────────────────────────────────────────── */
window.NEWS_POSTS = [
  {
    title: "Annual Vesak Observance at Rideekanda",
    date: "2026-05-31",
    type: "Event",
    excerpt: "Devotees gathered on the mountain for a full day of sīla, meditation, and dhamma — culminating in evening chanting and the lighting of lanterns across the forest.",
    image: "news-hero.jpg",
    link: "#"
  },
  {
    title: "New Residential Retreat Dates Announced",
    date: "2026-05-20",
    type: "Notice",
    excerpt: "Registration is open for the next seven-day residential retreat. Places are limited; early reservation is encouraged.",
    image: "",
    link: "../retreat/"
  },
  {
    title: "Library Café Project — Construction Update",
    date: "2026-05-08",
    type: "News",
    excerpt: "Work on the contemplative library café continues. See the latest design views and how the space will serve practitioners.",
    image: "",
    link: "../projects/library-cafe/"
  }
];
