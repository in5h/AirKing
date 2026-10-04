# AirKing Website

Static one-page website for AirKing (艾金空气工程). Open `index.html` in a browser — no build step.

## Structure
- `index.html` – all page content (sections marked with `<!-- EDIT -->` comments)
- `css/style.css` – styling (colours at the top: `:root` for light mode, `[data-theme="dark"]` for dark mode)
- `js/main.js` – nav bar, animations, quotation form (`SALES_EMAIL` at the top)
- `js/search.js` – site search (Ctrl/⌘+K) and the context-aware "Get a Quote" buttons
- `detail.html` + `js/detail.js` – detail page for every equipment item (`detail.html?eq=panels`, `inverters`, `components`, `sensors`, `showering`, `nozzles`, `eliminators`, `supply-fan`, `return-fan`, `dampers`, `louvre`, `rotary-filter`, `dust`) and industry (`detail.html?ind=spinning`, `weaving`, `synthetic-fibre`, `knitting`, `nonwoven`, `other`); the text for each is in `js/detail.js`
- `send.php` – emails quotation requests when the site is hosted on cPanel/PHP
- `privacy.html` – privacy policy (linked from every footer; update the effective date when the text changes)
- `js/chrome.js` – shared header/theme/menu code for the inner pages
- `service.html` + `js/service.js` – detail page for each service (`service.html?s=design`, `installation`, `commissioning`, `control`, `dust`, `upgrade`); the text for each service is in `js/service.js`
- `assets/logo.jpg` – original logo (favicon); `assets/logo-white.png` / `assets/logo-blue.png` – English-only wordmarks used in the nav bar and footer
- `assets/hero-video.mp4` + `assets/hero-poster.jpg` – the muted, looping background video at the top of the home page (until the file exists, a blue gradient shows)
- `assets/equipment/` – equipment photos: `electric-panels.jpg`, `inverters.jpg`, `components.jpg`, `sensors.jpg`, `showering-area.jpg`, `spray-nozzle.jpg`, `eliminator-plates.jpg`, `supply-return-fan.jpg`, `return-air-fan.jpg`, `dampers.jpg`, `weather-louvre.jpg`, `rotary-filter.jpg`, `dust-collection.jpg`
- `assets/services/` – service card images
- `assets/factory/` – Factory Setup gallery photos (add more by copying a `<figure>` in the gallery)
- `assets/equipment/photos/` – real equipment photos (first photo is the thumbnail in the home page Products list; all photos + the 3D render show on each product's detail page)
- `assets/industries/` – industry photos: `spinning.jpg`, `weaving.jpg`, `synthetic-fibre.jpg`, `knitting.jpg`, `nonwoven.jpg`, `other.jpg` (each card shows its icon until its photo is added)
- `js/gallery.js` – full-screen photo viewer for any `[data-gallery]` section
- `assets/clients/` – client logos for the scrolling "Trusted by" row (inside Clients on the home page, above the footer on other pages) (add the logo to `LOGOS` in `tools/build_nav.py` and run `python3 tools/build_nav.py`)
- `tools/renders/` – Three.js scenes that generated the equipment and service images (see below)

## Still to fill in
- Real equipment photos, if wanted: overwrite the matching file in `assets/equipment/`

## Regenerating the 3D images
The equipment and service images are 3D renders made with Three.js. To change one, edit its scene in `tools/renders/scenes.js`, then from `tools/renders/`:

```
npm install three@0.170.0 playwright
python3 -m http.server 8765 &
node run.js out            # or: node run.js out dampers svc-design
```
Copy the results from `out/` into `assets/equipment/` (and `svc-*.jpg` into `assets/services/` without the prefix).


## Quotation emails
Every request goes to **sales@nextexpk.com** with a copy to **insharahaman8@gmail.com**. The form tries these in order and stops at the first that works:

1. **`send.php`** – on cPanel / any PHP hosting the server emails the request itself. Nothing to set up. (Recipients are at the top of `send.php`.)
2. **Netlify Forms** – when hosted on Netlify. One-time setup in Netlify: *Site configuration → Forms →* enable form detection and redeploy, then *Forms → Form notifications → Add notification → Email notification* for each address. Submissions are also kept under *Forms* in the dashboard.
3. **FormSubmit** – emails sales directly; the first time, click the "Activate Form" link it sends to sales@nextexpk.com.
4. If all fail, the visitor gets a ready-to-send email link and the phone number.

Recipients for FormSubmit and the email link are `SALES_EMAIL` / `CC_EMAILS` at the top of `js/main.js`.

## Photo quality
The photos in `assets/factory/`, `assets/industries/` and `assets/equipment/photos/` were cropped from slides and were small, so they were enlarged 4× with an AI super-resolution model (OpenCV EDSR), lightly de-noised and sharpened. For the best quality, replace any of them with the original camera photo of the same name.
