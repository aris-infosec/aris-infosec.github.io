# Cybersecurity Journey Site

A static, interactive one-page site tracking your path into cybersecurity — CISSP held, CCNA in progress, roadmap beyond that.

## Files

- `index.html` — the page content
- `style.css` — all styling
- `script.js` — the interactive behavior (background animation, theme toggle, scroll progress, reveals, expandable timeline, copy-email)
- `404.html` — a matching not-found page (GitHub Pages serves this automatically for broken links)
- `assets/og-image.png` — the preview image shown when the link is shared on LinkedIn, Slack, etc.
- `assets/apple-touch-icon.png` — the icon used when someone bookmarks the site on iOS

No build step, no dependencies, no frameworks.

## What's in it

- A refined editorial layout: sticky sidebar section labels, a certifications grid, a skills breakdown, and a roadmap timeline.
- A light/dark theme toggle (top right of the nav) that remembers the visitor's choice.
- Open Graph and Twitter meta tags with a real preview image, so the link looks good when shared on LinkedIn or elsewhere.
- A skip-to-content link for keyboard and screen reader users (press Tab on page load to see it).
- Structured data (JSON-LD) describing you as a Person, for better search engine understanding.
- A styled 404 page instead of GitHub's default.
- Click-to-copy email, a live scroll progress indicator, and staggered entrance animations for cards.
- Everything respects `prefers-reduced-motion`.

## Updating your info for search engines and social sharing

- In `index.html`'s `<head>`, update the `og:url`, `og:image`, `twitter:image`, canonical link, and the JSON-LD block's `name`, `url`, and `sameAs` links to match your real domain and profiles.
- If you rename the repo (so the site isn't at `aris-infosec.github.io`), update those same URLs to match.

## Adding your real links

- Update the LinkedIn/GitHub hrefs in `.social-row` (in the hero) with your real profiles.
- The CISSP card in Certifications is a link — replace its `href="#"` with your real ISC2 or Credly verification URL.

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
