"""Rebuild the two Daily Routine PDFs in ../files/.

Usage, from this folder:
    python3 build-pdf.py

It writes daily-routine-en.html / daily-routine-si.html beside itself and then
renders each with headless Chrome:

    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --headless=new --disable-gpu --no-pdf-header-footer \
      --print-to-pdf="../files/daily-routine-schedule-en.pdf" \
      "file://$PWD/daily-routine-en.html"

Chrome is used because it shapes Sinhala correctly via the system font, and
--no-pdf-header-footer suppresses the date/URL furniture it adds by default.

The two sheets are NOT translations of one another: the Sinhala one carries a
6-7 AM period for cleaning the lodgings that the English one does not. So the
rows are listed separately rather than shared, and each keeps its own wording
and its own punctuation quirks.
"""
import io, os, subprocess

HERE   = os.path.dirname(os.path.abspath(__file__))
FILES  = os.path.join(HERE, "..", "files")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SEP    = "…" * 12          # the dotted rule between entries

EN_TITLE = ["Daily Routine of the Retreat", "Rideekanda Forest Monastery"]
EN_ROWS = [
    ("5.30 AM",               "Waking up & Getting Ready"),
    ("7.00 AM - 8.00 AM",     "Breakfast"),
    ("8.00 AM - 9.00 AM",     "Morning Dhamma Session/ Learning Session"),
    ("9.00 AM - 12.00 Noon",  "Meditation Practice"),
    ("12.00 Noon - 01.00 PM", "Lunch"),
    ("01.00 PM - 2.00 PM",    "Afternoon Rest"),
    ("2.00 PM - 4.30 PM",     "Meditation Practice"),
    ("4.30 PM - 6.00 PM",     "Evening Dhamma Session/ Learning Session"),
    ("6.00 PM - 7.00 PM",     "Chanting Session & Evening Dhamma Discussion"),
    ("7:00 PM - 10.00 PM",    "Meditation Practice"),
    ("10:00 PM",              "Night Rest"),
]

SI_TITLE = ["ආරණ්‍යයේ දින චර්යාව"]
SI_ROWS = [
    ("පෙ.ව. 5.30",                     "අවදි වී සූදානම් වීම"),
    ("පෙ.ව. 6.00 - පෙ.ව. 7.00",        "නවාතැන් සහ අවට පිරිසිදු කිරීම"),
    ("පෙ.ව. 7.00 - පෙ.ව. 8.00",        "උදේ ආහාරය"),
    ("පෙ.ව. 8.00 - පෙ.ව. 9.00",        "උදෑසන ධර්ම සැසිය/ ඉගෙනුම් සැසිය"),
    ("පෙ.ව. 9.00 - දහවල් 12.00",       "භාවනා අභ්‍යාසය"),
    ("දහවල් 12.00 - ප.ව. 01.00",       "දිවා ආහාරය"),
    ("ප.ව. 01.00 - ප.ව. 2.00",         "දහවල් විවේකය"),
    ("ප.ව. 2:00 - ප.ව. 4:30",          "භාවනා අභ්‍යාසය"),
    ("ප.ව. 4:30 - ප.ව. 6:00",          "සවස ධර්ම සැසිය/ ඉගෙනුම් සැසිය"),
    ("ප.ව 6:00 - ප.ව 7:00",            "සජ්ඣායනා සැසිය සහ සන්ධ්‍යා ධර්ම සාකච්ඡාව"),
    ("ප.ව 7:00 - ප.ව 10:00",           "භාවනා අභ්‍යාසය"),
    ("ප.ව. 10:00",                     "රාත්‍රී විවේකය"),
]

CSS = """
  /* Metrics traced from the original sheets: the dotted rule belongs to the
     entry above it, so the gap below the rule is the wider one. */
  @page { size: Letter; margin: 16mm 18mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; text-align: center; color: #000;
         font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; }
  h1 { font-size: 18pt; font-weight: bold; line-height: 1.22; margin: 0 0 27pt; }
  .e { margin: 0; }
  .t { font-size: 12pt; font-weight: bold; line-height: 1.16; }
  .d { font-size: 12pt; font-style: italic; line-height: 1.16; }
  .d.plain { font-style: normal; }
  .sep { font-size: 12pt; line-height: 1.16; margin: 0 0 9pt; }
  /* Sinhala needs its own face and more leading, so the vowel signs above and
     below the line do not collide with the neighbouring rows. */
  body.si, body.si .t, body.si .d,
  body.si h1 { font-family: "Sinhala Sangam MN", "Noto Serif Sinhala", "Sinhala MN", serif; }
  body.si h1 { font-size: 17pt; line-height: 1.4; margin-bottom: 24pt; }
  body.si .t, body.si .d { line-height: 1.42; }
  body.si .sep { font-family: Arial, sans-serif; margin-bottom: 7pt; }
"""

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def page(lang, title_lines, rows):
    out = ['<!doctype html><html lang="%s"><head><meta charset="utf-8">' % lang,
           "<style>%s</style></head><body%s>" % (CSS, ' class="si"' if lang == "si" else "")]
    out.append("<h1>" + "<br>".join(esc(t) for t in title_lines) + "</h1>")
    last = len(rows) - 1
    for i, (t, d) in enumerate(rows):
        out.append('<div class="e">')
        out.append('<div class="t">%s</div>' % esc(t))
        # the closing entry is upright in both of the original sheets
        out.append('<div class="d%s">(%s)</div>' % (" plain" if i == last else "", esc(d)))
        out.append("</div>")
        if i != last:
            out.append('<div class="sep">%s</div>' % SEP)
    out.append("</body></html>")
    return "\n".join(out)

def build(lang, title_lines, rows, pdf_name):
    html_path = os.path.join(HERE, "daily-routine-%s.html" % lang)
    io.open(html_path, "w", encoding="utf-8").write(page(lang, title_lines, rows))
    pdf_path = os.path.abspath(os.path.join(FILES, pdf_name))
    r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                        "--virtual-time-budget=8000",
                        "--print-to-pdf=" + pdf_path, "file://" + html_path],
                       capture_output=True, text=True)
    ok = os.path.exists(pdf_path)
    print("%-3s -> %s  %s" % (lang, pdf_name,
          ("%d KB" % round(os.path.getsize(pdf_path) / 1024)) if ok else "FAILED\n" + r.stderr[-800:]))

if __name__ == "__main__":
    build("en", EN_TITLE, EN_ROWS, "daily-routine-schedule-en.pdf")
    build("si", SI_TITLE, SI_ROWS, "daily-routine-schedule-si.pdf")
