# Cybersecurity Journey Site

A static, interactive one-page site tracking your path into cybersecurity — CISSP held, CCNA in progress, roadmap beyond that.

## Files

- `index.html` — the page content
- `style.css` — all styling
- `script.js` — the interactive behavior (background animation, typing effect, progress meter, scroll reveals, expandable timeline)

No build step, no dependencies, no frameworks. Three files, plain HTML/CSS/JS.

## What's in it

- A refined editorial layout: sticky sidebar section labels, a certifications grid, a skills breakdown, and a roadmap timeline.
- A subtle animated network of connecting nodes in the background, and an animated badge/shield graphic in the hero.
- Count-up stats in the hero (certs held, in progress, path % complete).
- Each roadmap step expands on click to show more detail.
- Sections fade in as you scroll to them; a back-to-top button appears after scrolling.
- A responsive nav with a mobile hamburger menu.
- Everything respects `prefers-reduced-motion` — animations turn off automatically for anyone with that OS setting on.

## Editing key numbers

- Hero stats: in `index.html`, look for `<div class="stat-row">` — each `data-target="N"` controls the count-up number (certs held, certs in progress, % complete).
- Certifications: the `.cert-grid` cards under `id="certifications"`.
- Skills: the three `.skill-group` lists under `id="skills"`.

## Before publishing — things to edit

In `index.html`:
- Replace `Your Name` in the hero with your actual name or handle.
- Update the `mailto:you@example.com`, GitHub, and LinkedIn links near the bottom (`contact-links`) with your real ones.
- Edit the roadmap entries (`<li class="entry ...">` blocks) as your plan changes — mark CCNA as `done` when you pass it, add new steps, etc. The progress meter updates automatically based on how many entries have class `entry--done` / `entry--active`.
- Each entry has an `.entry-summary` (always visible) and an `.entry-detail` (shown on click) — edit both.

## Publish it on GitHub Pages

1. Create a new GitHub repository (public), e.g. `your-username.github.io` if you want it at the root of your GitHub domain, or any name if you're fine with a `/repo-name/` path.
2. Push these two files (`index.html`, `style.css`) to the root of that repository.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch", choose the `main` branch and `/ (root)` folder, then save.
5. Wait a minute or two — GitHub will give you a URL like:
   - `https://your-username.github.io` (if the repo was named that exactly), or
   - `https://your-username.github.io/repo-name/`

That's it — no Jekyll config or extra setup needed for a plain HTML/CSS site like this.

## Updating later

Just edit `index.html` directly (especially the timeline entries as certs progress) and push the change — GitHub Pages rebuilds automatically within a minute or so.
