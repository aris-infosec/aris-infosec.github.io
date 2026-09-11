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

- A refined editorial layout: sticky sidebar section labels, a unified "Path" timeline (degrees + certifications, in order), and a skills breakdown.
- A light/dark theme toggle (top right of the nav) that remembers the visitor's choice.
- A layered, parallax background: soft color-glow orbs drift at different speeds behind the network animation as you scroll, giving the page a sense of depth.
- Open Graph and Twitter meta tags with a real preview image, so the link looks good when shared on LinkedIn or elsewhere.
- A skip-to-content link for keyboard and screen reader users (press Tab on page load to see it).
- Structured data (JSON-LD) describing you as a Person, for better search engine understanding.
- A styled 404 page instead of GitHub's default.
- An "Experience" section — a timeline of your actual career path (engineering → space industry → accreditation → security manager → present), giving real weight alongside the certifications.
- Self-hosted fonts (Lora / Work Sans / JetBrains Mono) — no requests to Google Fonts, so no visitor IP data goes to a third party before consent. See "Fonts" below.
- A subtle 3D tilt on the hero graphic that follows your cursor (skipped automatically on touch devices).
- Click-to-copy email, a live scroll progress indicator, and staggered entrance animations for cards.
- Everything respects `prefers-reduced-motion`.

## Updating your info for search engines and social sharing

- In `index.html`'s `<head>`, update the `og:url`, `og:image`, `twitter:image`, canonical link, and the JSON-LD block's `name`, `url`, and `sameAs` links to match your real domain and profiles.
- If you rename the repo (so the site isn't at `aris-infosec.github.io`), update those same URLs to match.

## Adding your real links

- Update the LinkedIn/GitHub hrefs in `.social-row` (in the hero) with your real profiles.

## Fonts

The site uses self-hosted fonts instead of Google Fonts, for two reasons: no third-party request happens before a visitor has consented to anything (relevant under GDPR), and it's one less external dependency to load.

- Font files live in `assets/fonts/` as `.woff2` (small, fast) plus their `OFL.txt` license files — keep the license files if you redistribute the site's code, per the SIL Open Font License.
- Fonts in use: **Lora** (serif, headings), **Work Sans** (sans, body text), **JetBrains Mono** (labels, tags, code-style text) — visually close to the original Fraunces/Inter/JetBrains Mono pairing, all open-licensed and self-hostable.
- To swap in different fonts later: add new `.woff2` files to `assets/fonts/`, update the `@font-face` blocks near the top of `style.css`, and update the `--serif` / `--sans` / `--mono` variables just below them.

## Editing the experience timeline

- Find `<ol class="exp-list">` in `index.html`. Each `<li class="exp-item">` is one role — edit the `h3` title and `exp-desc` text. Add `<span class="exp-current">Current</span>` inside `.exp-top` to mark your present role (only one should have it) — it's styled gold with a small pulsing dot.

## Editing "The Path"

- Find `<ol class="timeline">` under `id="path"` in `index.html`. It's a single chronological list — degrees, then certifications, in order. Each `<li class="entry ...">` has a status class (`entry--done`, `entry--active`, `entry--next`), a summary line (always visible), and an `.entry-detail` (shown on click). Update the status class as things change — e.g. once CCNA is done, change `entry--active` to `entry--done` and promote the next entry to `entry--active`.

## Editing key numbers

- Skills: the three `.skill-group` lists under `id="skills"`.

## Before publishing — things to edit

In `index.html`:
- Replace `Your Name` in the hero with your actual name or handle.
- Update the `mailto:you@example.com`, GitHub, and LinkedIn links near the bottom (`contact-links`) with your real ones.

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
