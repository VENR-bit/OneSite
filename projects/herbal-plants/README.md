# Herbal Plant Planting Programme

Visitors choose a medicinal plant, pledge to bring it, plant it at the monastery,
then send a photograph. Once a monk approves the photo it joins the planting
record on the page and the pledge is complete.

## Files

| File | Purpose |
|---|---|
| `index.html` | The public page — hero, how it works, plant lists, planting record |
| `styles.css` | All styling (paper palette, forest-green accent) |
| `plants-data.js` | Both plant lists, transcribed from the monastery's Google Sheet |
| `db.js` | Supabase access layer, shared by the page and the admin |
| `app.js` | Page behaviour: browse, search, pledge, photo upload |
| `admin.html` | Passcode-gated page for approving submitted photos |
| `supabase-setup.sql` | **Run this once** to create the database |

## The plant lists

Taken from [the monastery's sheet](https://docs.google.com/spreadsheets/d/1mCAQ4xcG3hjyvvt2lQSa--9KeH-G567gNCXKDiOo38g/edit):

- **`programme`** — 81 plants, the current planting drive (sheet tab 2)
- **`reference`** — 1,324 plants, the full medicinal flora reference (sheet tab 1)

Both are pledgeable. Each row is `[no, sinhalaName, sinhalaScript, englishName, scientificName]`.

To refresh from the sheet later, re-export both tabs as CSV and regenerate
`plants-data.js` — the row order and column meaning must stay the same.

## One-time database setup

The page reads and writes the **same Supabase project** the Requirements page
uses (`megebtfqaovaciovrzyb`). The tables do not exist yet.

1. Open the Supabase dashboard → **SQL Editor** → **New query**
2. Paste the whole of `supabase-setup.sql`
3. Press **Run**

That creates:

- `plant_pledges` — one row per pledge, including a private `token`
- `plant_pledges_public` — a view exposing everything **except** the token, which is what the site reads
- `attach_plant_photo()` — verifies the token server-side before attaching a photo
- a public-read `plant-photos` storage bucket

Re-running the script is safe.

## How a pledge flows

1. Visitor picks a plant and leaves their name → a row is created and they get a
   private link, `…/herbal-plants/?claim=<token>`
2. They plant it, open that link, and upload a photo → status becomes `pending`
   (hidden from the public page)
3. A monk opens `admin.html`, reviews it, and approves → status becomes
   `approved` and the photo appears in the planting record

## Admin

`admin.html`, passcode **92424** — the same passcode as the Requirements admin.

Note this is obscurity-level protection only, exactly as on the Requirements
admin page: the passcode is checked in the browser, and moderation runs through
the public anon key. It keeps casual visitors out; it is not a real login. If
that ever matters, the fix is Supabase Auth with a real account for the saṅgha
office.

## Privacy

Pledger **name** and any **note** are public. **Contact details are never shown**
on the page — they are stored so the monastery can reach the pledger, and the
public view deliberately excludes the token so nobody can hijack another
person's pledge.
