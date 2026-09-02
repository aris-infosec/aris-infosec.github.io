# Cybersecurity Journey Site

A static, interactive one-page site tracking your path into cybersecurity — CISSP held, CCNA in progress, roadmap beyond that.

## Files

- `index.html` — the page content
- `style.css` — all styling
- `script.js` — the interactive behavior (background animation, typing effect, progress meter, scroll reveals, expandable timeline)

No build step, no dependencies, no frameworks. Three files, plain HTML/CSS/JS.

## What's interactive

- A subtle animated network of connecting nodes in the background — a nod to the networking material itself.
- A typing effect in the hero that cycles through a few taglines.
- A live progress meter, calculated automatically from how many roadmap entries are marked done/in-progress.
- Each step in "The path" expands on click to show more detail.
- Sections fade/slide in as you scroll to them.
- Everything respects `prefers-reduced-motion` — animations turn off automatically for anyone with that OS setting on.

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
