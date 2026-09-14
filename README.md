# Aveda Wellness — website

Static site. No build step, no dependencies, no framework. Vercel serves the
files exactly as they are.

**Status: complete and ready to deploy**, pending the `[EDIT]` list below.

---

## Deploy

**Option A — drag and drop (fastest)**

1. Go to <https://vercel.com/new>
2. Drag this folder onto the page
3. Done — you get a `*.vercel.app` URL immediately

**Option B — Git (better once live)**

```bash
git init && git add -A && git commit -m "Initial site"
git remote add origin <your repo url>
git push -u origin main
```

Import the repo at <https://vercel.com/new>. Every push redeploys.

**Framework preset:** Other. **Build command:** leave empty. **Output directory:** leave empty.

---

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/cryotherapy/` | Cryotherapy — overview, device, science, safety |
| `/cryotherapy/performance-recovery/` | Injury, pain, inflammation, sport |
| `/cryotherapy/dermatology-aesthetics/` | Cryo facials, skin conditions, iCryo wand |
| `/fat-freezing/` | Cryolipolysis |
| `/hydrapro-facial/` | Nine-modality hydradermabrasion |
| `/roll-shaper/` | Infrared lymphatic roller |
| `/contact/` | Contact, enquiry form, hours, location |
| `/privacy/` `/terms/` | Structure only — needs your own legal text |
| `404.html` | Not-found page |

`/book` and `/book/` redirect to `/contact/#book` (set in `vercel.json`).

---

## Structure

```
/
├── index.html                  home
├── vercel.json                 clean URLs, redirects, cache + security headers
├── robots.txt  sitemap.xml  favicon.svg  404.html
│
├── assets/
│   ├── css/site.css            ALL shared styles — header, footer, every component
│   ├── js/site.js              ALL shared behaviour — nav, menu, animations
│   └── img/                    28 images, optimised
│
├── cryotherapy/ ├── performance-recovery/
│                └── dermatology-aesthetics/
├── fat-freezing/  hydrapro-facial/  roll-shaper/
├── contact/  privacy/  terms/
```

Each folder becomes a clean URL automatically — `fat-freezing/index.html`
serves at `/fat-freezing/`. No routing config needed.

---

## Adding a page

1. Copy any existing page's `<head>`, `<header class="hd">`, `<nav class="mnav">`
   and `<footer class="ft">` verbatim — none of it is page-specific, and
   `site.js` highlights the current nav item automatically
2. Put your content in `<main><div id="aw">…</div></main>`
3. Keep the three script tags at the bottom

Page-specific CSS goes in a `<style>` block on that page. **Never edit
`site.css` for one page** — it is shared by all of them.

### Service accent colours

One variable reskins a whole page:

```html
<style>#aw{--acc:#FF7A3D; --hi:#FFB98A;}</style>
```

| Service | Accent | `--acc` |
|---|---|---|
| Cryotherapy | Cyan | `#2BA7E3` |
| Fat Freezing | Ice blue | `#8BD9F7` |
| HydraPro Facial | Champagne | `#D4B483` |
| Roll Shaper | Infrared amber | `#FF7A3D` |

The accent tells the visitor the treatment's temperature — cold treatments run
blue, the warm one runs amber, the neutral one runs champagne. Keep it consistent.

---

## Before going live

### Content — search the project for `[EDIT]`

- **Pricing** — the home page cards read `$XX`
- **Address, phone, email** — header, footer, contact page, and the JSON-LD
  blocks in `index.html` and `contact/index.html`
- **Hours** — footer, home page, contact page
- **Testimonials** — three placeholders on the home page, clearly marked
- **Domain** — `aveda-wellness.vercel.app` appears in every page's canonical,
  Open Graph and JSON-LD, plus `robots.txt` and `sitemap.xml`
- **Privacy and Terms** — structure only; get real text written
- **Cancellation policy** — referenced in the contact FAQ, not yet written

### The contact form does not send yet

It validates and shows a confirmation, but nothing is transmitted. Wire it up in
`contact/index.html` (the handler is at the bottom, marked `[EDIT]`). Options:
Formspree, a Vercel serverless function, or your booking system's API. **Do this
before launch** or enquiries will silently vanish.

### Still needs client sign-off

- **Trademarks** — "Hydrafacial" (BeautyHealth) and "CoolSculpting" (AbbVie) are
  deliberately absent. Confirm "Frotox" is safe to use.
- **TGA / FDA** — confirm the exact permitted wording and listing numbers before
  the "TGA and FDA approved" claims go live.
- **Claims** — "20–25% fat reduction" and "permanent" both need substantiation
  the client can produce if challenged.
- **Roll Shaper** — manufacturer name still unknown; confirm the +42°C figure.
- **HydraPro** — six of the nine modality descriptions came from training slides
  beyond the four originally supplied. Worth a read-through.

---

## Quality checks (all passing)

| Check | Result |
|---|---|
| Horizontal overflow at 1440 / 1024 / 768 / 390 / 320 | none on any page |
| JavaScript errors | none |
| GSAP warnings | none |
| Broken images | none |
| Broken internal links | none |
| `<h1>` per page | exactly one |
| Images missing `alt` | none |
| Meta description / canonical / Open Graph | present on every page |
| Mobile menu — opens, closes, Escape key | working |
| FAQ accordion | working |
| Contact form validation | working |
| `prefers-reduced-motion` | respected, nothing hidden |
| Image payload | 2.3 MB → 1.2 MB (48% smaller) |

---

## Notes

- **GSAP** loads from cdnjs. If it fails, every animation is skipped and the page
  still renders correctly — nothing depends on it to be visible.
- **Animations are all guarded.** A page without a given element skips that
  animation silently rather than warning in the console.
- **Images** are cached for a year by `vercel.json`. If you replace one, change
  its filename or returning visitors keep the old version.
- **Accessibility** — keyboard-operable nav, Escape closes menus, `aria-expanded`
  on the accordion and dropdown, visible focus rings, one `h1` per page.
