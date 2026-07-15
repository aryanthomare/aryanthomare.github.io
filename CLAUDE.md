# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Aryan Thomare's personal portfolio site (aryanthomare.github.io), deployed via GitHub Pages from the `master` branch — pushing to `master` publishes the site. Plain HTML/CSS/JS with no framework, no package.json, no build step, no tests, and no linter.

Note: the top-level README.md is outdated (it predates the JavaScript and Firebase additions).

## Running locally

Serve over HTTP rather than opening files directly — `work.js` uses `fetch()`, which fails on `file://`:

```
python -m http.server
```

## Architecture

### Pages and per-page CSS

Four pages, each with its own stylesheet: `index.html`/`style.css`, `work.html`/`workstyle.css`, `about.html`/`aboutstyle.css`, `gallery.html`/`gallery.css`.

**There is no shared CSS file.** Each stylesheet carries its own `:root` design tokens, and shared markup (nav header, footer/social bar) is copy-pasted into each HTML page. A change to tokens, nav, or footer must be replicated in every page's CSS and HTML.

**The site is mid-migration between two themes.** The homepage uses the "instrument bench" design (July 2026): a dark engineering-lab identity — near-black blue-gray panels on a faint graticule grid, oscilloscope channel colors as the accent system (CH1 amber `--ch1: #f2b63d`, CH2 cyan `--ch2: #4fc3dc`, CH3 magenta `--ch3: #d76bd0`), code-comment eyebrows (`# identification`), a typed-name hero with amber block cursor, and a "train.py — portfolio-v3" panel (`lab.js`) that plots a simulated training run live (train/val loss on a log scale with ticking step/loss readouts), with the nav cards styled as experiments (exp-01/02/03). **Design options live on branches:** `design/instrument-bench` holds the I²C scopemeter + probe-leads variant; `design/ml-research` (this one) holds the training-monitor variant. Fonts: Chakra Petch (display caps), IBM Plex Sans (body), IBM Plex Mono (labels/readouts). The other three pages still use the older dark-violet theme (`--violet-500: #9747ff`, Space Grotesk/Cormorant Garamond/Fira Code) and are pending rollover. An earlier warm-paper "cartographic survey" homepage was built and rejected — the user wants tech-flavored aesthetics, with the topographic contours kept only as a background visualization.

### JavaScript

- `background.js` — animated topographic contour background on every page: Perlin-noise FBM field rendered as marching-squares contour lines on a fixed canvas. Contour ink comes from the `--contour-rgb` CSS variable (falls back to the violet used by the older pages); `--paper-rgb` sets the halo color and `body[data-contours="labeled"]` adds elevation figures along the contours (both currently unused). Under `prefers-reduced-motion` it renders one static frame instead of animating.
- `lab.js` — homepage-only training monitor: draws a simulated run on `#loss-canvas` (train/val loss curves on a log scale, plotted progressively; new seed each cycle) and ticks the `#run-step`/`#run-loss` readouts in the panel header. Colors from `--ch1`/`--ch2`. Renders the converged chart statically under reduced motion.
- `title-typewriter.js` — typewriter effect for any element with a `data-typewriter` attribute containing a `.typewriter_text` span (used by work/about/gallery). `index.html` has its own inline copy of this logic for the hero name.
- `gallery.js` — carousel over a hardcoded, shuffled array of `assets/` images with descriptions.
- `work.js` — renders the Experience page (see below).

### Work page data flow (Firebase)

The work/experience content is data-driven, not hardcoded in HTML:

1. `work.js` fetches the Firestore document `site/work` through the **Firestore REST API** (no Firebase JS SDK), using the public project config in `firebase-config.js` (committed intentionally — the apiKey is a public identifier; security comes from Firestore rules: public read, single-admin write).
2. On any Firestore failure it falls back to the local `work-data.json`.
3. It decodes Firestore's typed value format, then renders `data.sections[].items[]` (title, date, description, tags, optional link) into `#work-sections`.

`work-data.json` is the source-of-truth-in-repo and the fallback. Writes to Firestore go only through the git-ignored `db-admin/` folder (stdlib-only Python CLI):

```
python db-admin/work_db_cli.py push   # upload work-data.json to Firestore
python db-admin/work_db_cli.py pull   # download Firestore -> work-data.json
python db-admin/work_db_cli.py show   # pretty-print current Firestore data
```

Content edit flow: edit `work-data.json` → `push` → commit `work-data.json` (keeps the fallback current). Check the browser console on `work.html` — a "Falling back to local work-data.json" warning means Firestore isn't serving.

`db-admin/` is git-ignored because `config.json` holds admin credentials; setup instructions are in `db-admin/README.md`.

### DESIGN.md

`DESIGN.md` documents a Claude/Anthropic-inspired warm-parchment design system. **The live site does not use it** — the current theme is dark violet. Treat DESIGN.md as a reference/aspiration document, not a description of the existing CSS; follow the existing violet token palette when editing current pages unless asked to redesign.
