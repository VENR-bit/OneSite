/* ──────────────────────────────────────────────────────────────
   News & Events data.
   To publish: add an object to the TOP of this array.

   Fields:
     title   — headline (always shown on the card)
     date    — "YYYY-MM-DD" (sorts newest first + shown)
     type    — "Event" | "News" | "Notice" | "Dhamma"
     when    — event date text (optional)
     excerpt — short card summary
     body    — full text shown in the reader (optional)
     image   — lead/thumbnail file in assets/ (optional)
     images  — array of extra photo files in assets/ (optional). All photos
               are shown in the on-site reader gallery, so the full post —
               text + every photo — reads on the site itself (works on the
               kiosk too, with no Facebook navigation).
               Example:
                 image: "post-40.jpg",
                 images: ["post-40.jpg", "post-40b.jpg", "post-40c.jpg"]

   To publish from a Facebook post: send the FB post link and its photos;
   the text + images get saved here as hosted content (assets/). The live
   "From our Facebook" wall on the page already mirrors the page feed.
   ────────────────────────────────────────────────────────────── */
window.NEWS_POSTS = [
  {
    title: "භාවනා කුටි සංකීර්ණය සඟසතු පූජාව",
    date: "2026-03-03",
    type: "Event",
    when: "මැදින් පුර පසළොස්වක පොහොය දිනය",
    excerpt: "උඩස්ගිරිය රිදීකන්ද ආරණ්‍ය සේනාසනයේ අභිනවයෙන් ඉදිකළ භාවනා කුටි සංකීර්ණය මහා සංඝරත්නයට පූජා කිරීමේ පිංකම.",
    body: "උඩස්ගිරිය රිදීකන්ද ආරණ්‍ය සේනාසනයේ අභිනවයෙන් ඉදිකර නිමකර භාවනා කුටි සංකීර්ණය සඟසතු පුජා කිරීමේ පිංකම පසුගිය මැදින් පුර පසළොස්වක පොහොය දිනයේ සිදු කෙරුණි. බෝයගොඩ සහ පාදෙණිය පවුලේ පිංවතුන්, හිතමිත්‍රාදීන් ඇතුළු සියළු දෙනාගේ ධන දායකත්වයෙන් ඉදිකර මහා සංඝරත්නයේ පරිහරණය පිණිස ඉතා ශාසන ගෞරවයෙන් යුක්තව මෙලෙස පුජා කෙරුණි. දැක සතුටු සිතින් අනුමෝදන් වෙත්වා!",
    image: "post-37.jpg",
    images: ["post-37.jpg", "post-37b.jpg", "post-37c.jpg", "post-37d.jpg", "post-37e.jpg"]
  },
  {
    title: "The 2025 Katina Pooja Ceremony (Robe Offering)",
    date: "2025-11-09",
    type: "Event",
    when: "2025-11-02 to 2025-11-03",
    excerpt: "Katina robe offering ceremony and dedication of the new monastery building complex.",
    body: "The 2025 Katina Pooja Ceremony at Udasgiriya Rideekanda Forest Monastery, Matale, was held on 2–3 November 2025. During the ceremony, the newly built complex with the Dana Shala, kitchen, and residential facilities was formally offered to the Sangha.",
    image: "post-36.jpeg"
  },
  {
    title: "Meditation Retreat at Toggenburg, Switzerland",
    date: "2025-08-20",
    type: "Event",
    excerpt: "Meditation retreat in Toggenburg with participants from several European countries.",
    body: "A meditation retreat in Toggenburg, Switzerland brought together practitioners from Switzerland, Germany, France, and Italy. Under the guidance of Bhante Rewatha Thero, participants spent time in silence, reflection, mindfulness, and Dhamma practice.",
    image: "post-35.jpg"
  },
  {
    title: "Talk on Meditation and Ancient Eastern Wisdom for Modern Life at EPFL",
    date: "2025-08-20",
    type: "Event",
    when: "2025-06-27",
    excerpt: "EPFL public talk on meditation, ancient wisdom, science, and modern life.",
    body: "More than 200 participants attended a public talk at EPFL on 27 June 2025 by Ven. Homagama Rewatha Thero. The session explored meditation, ancient Eastern wisdom, mental clarity, well-being, and the connection between inner development and modern science.",
    image: "post-34.jpg"
  },
  {
    title: "Meditation workshop at EPFL University in Switzerland",
    date: "2025-08-20",
    type: "Event",
    when: "2025-06-02 to 2025-06-06",
    excerpt: "Five-day EPFL meditation workshop led by Ven. Homagama Rewatha Thero.",
    body: "Following the EPFL public talk, a five-day meditation workshop was held from 2–6 June 2025 under the guidance of Ven. Homagama Rewatha Thero. Participants explored concentration, awareness, self-understanding, and mindfulness in science and technology.",
    image: "post-33.jpg"
  },
  {
    title: "7-Day Vipassana Retreat – Every Month at Rideekanda Forest Monastery",
    date: "2025-08-20",
    type: "Event",
    when: "Monthly / ongoing",
    excerpt: "Monthly seven-day Vipassana retreat at Rideekanda Forest Monastery.",
    body: "Rideekanda Forest Monastery conducts monthly seven-day Vipassana retreats for local and international practitioners. The retreat includes silence, meditation, chanting, Dhamma discussions, personal reflection, and guidance in the Theravāda Buddhist tradition.",
    image: "post-32.jpg"
  },
  {
    title: "Residential Retreat",
    date: "2025-08-20",
    type: "Event",
    when: "Ongoing / by booking",
    excerpt: "Residential meditation retreats in the forest setting of Rideekanda Monastery.",
    body: "Rideekanda Forest Monastery offers residential retreats in the forests of Matale for monks, nuns, and lay practitioners. The programme supports mindful living, daily meditation, walking meditation, Dhamma discussions, chanting, vegetarian meals, silence, and personal guidance.",
    image: "post-31.jpg"
  },
  {
    title: "Introduction to Meditation with Bhante Rewatha in Johanneskirche, Zürich, Switzerland",
    date: "2025-05-11",
    type: "Event",
    when: "2025-05-21 and 2025-05-28",
    excerpt: "Two evening meditation introduction sessions in Zürich, Switzerland.",
    body: "Bhante Rewatha introduced Buddhist teachings and guided concentration and Vipassana meditation over two Wednesday evening sessions at Johanneskirche, Limmatstrasse 112, 8005 Zürich, Switzerland. The sessions were scheduled for 21 and 28 May 2025.",
    image: "post-30.jpeg"
  },
  {
    title: "Vipassana Meditation Retreat with Bhante Homagama Rewatha in Toggenburg Switzerland",
    date: "2025-05-11",
    type: "Event",
    when: "2025-05-22 to 2025-05-26",
    excerpt: "Toggenburg Vipassana retreat scheduled for 22–26 May 2025.",
    body: "A Vipassana meditation retreat with Bhante Homagama Rewatha was scheduled in Toggenburg, Oberdickenstrasse 9, 9115 Dicken, Switzerland, from 22–26 May 2025. The retreat invited new and returning practitioners to join for meditation, shared practice, and simple residential living.",
    image: "post-29.jpeg"
  },
  {
    title: "Wisdom in Silence",
    date: "2025-05-05",
    type: "Dhamma",
    excerpt: "Documentary short supporting the mission of Rideekanda Forest Monastery.",
    body: "Wisdom in Silence is a short documentary created as a donation to support Rideekanda Forest Monastery. The documentary features Bhante Rewatha, Bhante Sumedha, Dinesh Nandana Kumara, and international contributors who supported the film-making process.",
    image: ""
  },
  {
    title: "07 days Vipassana Retreats @ Rideekanda",
    date: "2025-05-05",
    type: "Dhamma",
    excerpt: "Completion of seven-day Vipassana retreats for local and international practitioners.",
    body: "Rideekanda Forest Monastery successfully completed seven-day Vipassana retreats for foreign and local meditation practitioners at Udasgiriya, Matale, Sri Lanka.",
    image: "post-27.jpg"
  },
];
