# AirKing Website

Static one-page website for AirKing (艾金空气工程). Open `index.html` in a browser — no build step.

## Structure
- `index.html` – all page content (sections marked with `<!-- EDIT -->` comments)
- `css/style.css` – styling (colours at the top: `:root` for light mode, `[data-theme="dark"]` for dark mode)
- `js/main.js` – nav bar, animations, quotation form (`SALES_EMAIL` at the top)
- `js/search.js` – site search (Ctrl/⌘+K) and the context-aware "Get a Quote" buttons
- `service.html` + `js/service.js` – detail page for each service (`service.html?s=design`, `installation`, `commissioning`, `control`, `dust`, `upgrade`); the text for each service is in `js/service.js`
- `assets/logo.jpg` – original logo (favicon); `assets/logo-white.png` / `assets/logo-blue.png` – English-only wordmarks used in the nav bar and footer
- `js/src/hero.js` – the interactive 3D fan in the hero (Three.js); bundled into `js/hero.js`
- `assets/equipment/` – equipment photos: `electric-panels.jpg`, `inverters.jpg`, `components.jpg`, `sensors.jpg`, `showering-area.jpg`, `spray-nozzle.jpg`, `eliminator-plates.jpg`, `supply-return-fan.jpg`, `return-air-fan.jpg`, `dampers.jpg`, `weather-louvre.jpg`, `rotary-filter.jpg`, `dust-collection.jpg`
- `assets/services/` – service card images
- `assets/factory/` – Factory Setup gallery photos (add more by copying a `<figure>` in the gallery)
- `assets/equipment/photos/` – real equipment photos; a card with photos gets a Photo 1 / Photo 2 / 3D switch (the 3D render stays available)
- `assets/industries/` – industry photos: `spinning.jpg`, `weaving.jpg`, `synthetic-fibre.jpg`, `knitting.jpg`, `nonwoven.jpg`, `other.jpg` (each card shows its icon until its photo is added)
- `js/gallery.js` – full-screen photo viewer for any `[data-gallery]` section
- `assets/team/` – optional team photos
- `tools/renders/` – Three.js scenes that generated the equipment and service images (see below)

## Still to fill in
- Team names and designations
- Real equipment photos, if wanted: overwrite the matching file in `assets/equipment/`

## Regenerating the 3D images
The equipment and service images are 3D renders made with Three.js. To change one, edit its scene in `tools/renders/scenes.js`, then from `tools/renders/`:

```
npm install three@0.170.0 playwright
python3 -m http.server 8765 &
node run.js out            # or: node run.js out dampers svc-design
```
Copy the results from `out/` into `assets/equipment/` (and `svc-*.jpg` into `assets/services/` without the prefix).

## Building the 3D hero
`js/hero.js` is a ready-built bundle, so the site works as plain files (even opened straight from disk). After editing `js/src/hero.js`, rebuild it:

```
npm install
npm run build
```

## Quotation emails (important — one-time activation)
The quotation form sends each request as an email to **sales@nextexpk.com** through [FormSubmit](https://formsubmit.co) (free, no account or server needed).

1. Publish the site (e.g. GitHub Pages) and send one test request from the form.
2. FormSubmit emails **sales@nextexpk.com** an activation link — click it once.
3. From then on every request arrives in that inbox; "Reply" goes straight to the customer.

If sending ever fails, the form offers the visitor a pre-filled email or the phone number instead. To change the receiving address, edit `SALES_EMAIL` at the top of `js/main.js`.
