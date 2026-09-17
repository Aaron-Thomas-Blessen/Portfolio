# Aaron Blessen — Build until it matters.

A complete redesign of Aaron Thomas Blessen's existing portfolio: React, TypeScript, Vite, self-hosted fonts, modern CSS, and static HTML prerendering. No database, login, paid backend, or runtime API is required.

**Target:** https://aaron-thomas-blessen.github.io/Portfolio/

The visual system uses graphite, acid green, oversized editorial type, a real existing portrait, and a case-study archive. It includes all eight documented projects, seven proof records, capabilities, current-mission placeholders, a timeline, a media archive, contact tools, and motion settings.

## Run it locally

Install **Node.js 24 LTS** with npm. Node 22.12 or later also satisfies the package engine requirement; this delivery was built with Node 24.

Open a terminal in the directory containing `package.json`:

```bash
npm install
npm run dev
```

Open **http://localhost:4173/**. The development server intentionally uses `/` so local preview is simple. Stop it with Ctrl+C.

For a repeatable install using the included lockfile:

```bash
npm ci
```

Never put `node_modules` in your GitHub repository.

## Build and preview the actual production site

```bash
npm run build
npm run preview
```

Open **http://localhost:4173/Portfolio/**. Stop any already-running development server first because both commands use port 4173.

The build runs TypeScript, creates the optimized assets, and prerenders the complete page into `dist/index.html`. The main content is readable by search engines and without JavaScript. Case-study overlays, the mobile menu, motion controls, and contact interactions require JavaScript.

The source includes a configured production build in `dist/` for convenience. Rebuild after making any changes. Do not open `index.html` by double-clicking it: use the development or preview command above. The included `dist/` build expects the `/Portfolio/` URL prefix.

## Put this into your existing Portfolio repository

1. Keep your existing repository and its `.git` directory. You do **not** need a new GitHub repository.
2. Extract this package. Copy the contents of its `Portfolio` folder into the **root of your existing Portfolio checkout**. Replace same-named application files. Do not create a nested `Portfolio/Portfolio/` directory.
3. Confirm that `package.json`, `index.html`, `src/`, `public/`, and `.github/workflows/deploy.yml` are all at the repository root.
4. Run `npm install`, then `npm run build`.
5. Review the page and the missing-content checklist. The original static page/styles are retained in `legacy/`; original assets remain in `assets/`. Neither folder is copied to the new public build.
6. Commit and push the source, including the lockfile and `.github` workflow. The existing `.gitignore` excludes generated output and dependencies.

A typical command sequence from your existing checkout is:

```bash
git status
npm install
npm run build
git add .
git commit -m "Redesign Aaron Blessen portfolio"
git push origin main
```

Review `git status` before committing so unrelated local changes are not included unintentionally. If your actual default branch is not `main`, update the workflow's branch filter accordingly.

## Enable automatic GitHub Pages deployment

1. Open your **Aaron-Thomas-Blessen/Portfolio** repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push the source changes to `main`, or use **Actions → Deploy portfolio to GitHub Pages → Run workflow**.
5. Wait for the build and deploy jobs to finish. Open **https://aaron-thomas-blessen.github.io/Portfolio/**.

The workflow installs from `package-lock.json`, builds and prerenders the site, uploads only `dist/`, and deploys the Pages artifact. It uses GitHub's built-in token; no personal access token, API key, hosting subscription, or separate backend setup is needed.

Your public GitHub Pages site is changed only when you push and the deployment runs. This delivery does not itself push to your GitHub account or replace the live site.

### Why the base path works

`src/content.json` contains:

```json
"site": {
  "origin": "https://aaron-thomas-blessen.github.io",
  "basePath": "/Portfolio/"
}
```

`vite.config.ts` reads that path for production assets. All local images, documents, and links use Vite's base URL. Metadata, canonical URL, sitemap, and robots instructions come from the same configuration. There are no root-relative `/assets` assumptions in the delivered production page.

Case studies use hashes such as `#project/codecrypt`, so refreshing a case study works on GitHub Pages without a server-side router or a 404 redirect workaround.

## Edit everything personal in one place

Use **`src/content.json`** for names, positioning, email, links, résumé, hero copy, project records, achievements, capabilities, current priorities, timeline, archive material, and testimonials.

| What you want to change                   | Content key                              |
| ----------------------------------------- | ---------------------------------------- |
| Name, email, social profiles, positioning | `person`                                 |
| Hero statement, introduction, status      | `hero`                                   |
| Portrait and alt text                     | `hero.portrait`                          |
| Résumé file and version note              | `hero.resume` / `hero.resumeReplacement` |
| Personal positioning copy                 | `about`                                  |
| Projects and case studies                 | `projects`                               |
| Awards, internships, certificates         | `receipts`                               |
| Capability explanations                   | `capabilities`                           |
| Current learning, building, goals         | `missions`                               |
| Journey and dates                         | `timeline`                               |
| Videos, articles, papers, press kit       | `archive`                                |
| Approved testimonial                      | `testimonial`                            |
| Final headline and contact copy           | `contact`                                |
| URL, metadata, preview image              | `site`                                   |

Keep JSON syntax valid: use double quotes, no comments, and no trailing commas. The typecheck/build will report malformed input.

### How placeholders work

An editable text field looks like this:

```json
"contribution": {
  "value": "",
  "instruction": "ADD FINAL DESCRIPTION: Explain your exact contribution."
}
```

Fill `value` to display your final copy. An empty value displays the instruction. You do not need to edit React to complete these fields.

An image slot looks like this:

```json
"image": {
  "src": "images/codecrypt.webp",
  "alt": "CodeCrypt showing an AES encryption example",
  "instruction": "ADD SCREENSHOT: Use a real screenshot of the application."
}
```

Place the file in `public/images/codecrypt.webp`. Paths are **relative to `public/`**: do not include `public/` or a leading slash in the JSON. If `src` is blank, the designed placeholder remains visible. If an image cannot load, it falls back to its explicit replacement instructions.

A link has `label`, `url`, and `instruction`. Leave `url` blank to show an expandable missing-link instruction. Add an actual URL to turn it into a working link. Local PDFs and public web links open separately; the contact résumé button downloads the local PDF.

### Add a project

Duplicate an entry in `projects`, give it a unique URL-friendly `id`, and update all fields. Each entry automatically creates a main-page panel and a full-screen case study. Use `green`, `blue`, `purple`, or `orange` for its restrained accent. There is no hard-coded project limit.

Do not change a published project `id` casually: shared `#project/…` links use it.

### Portrait, screenshots, and videos

- Portrait: ideally 1200 × 1200 pixels or larger, dark/neutral background. Keep the face near the upper center for responsive cropping. The current site uses your real existing photograph, unchanged, with a CSS monochrome treatment.
- Project screenshots: aim for 1600 × 1000, export WebP or optimized JPG, and preferably stay below 300 KB each. Use actual product screens, not decorative stand-ins.
- Images added to project/evidence slots are lazy-loaded. Dimensions are reserved to reduce layout shifts.
- For demo videos, use a public video URL or place a short compressed MP4 in `public/videos/` and link it. Videos are opened on demand; nothing autoplays or preloads a third-party player.
- The generated `public/og.png` is the social-preview image. Replace it and update `site.ogImage` if your branding changes.
- The simple custom favicon is `public/favicon.svg`.

Run this for a list of missing content and invalid local files:

```bash
npm run audit:content
```

See **CONTENT_CHECKLIST.md** for exactly what to collect and the source conflicts to resolve. **SOURCES.md** records where each factual description came from.

## Contact behavior

The email and social buttons are usable without a backend. The form validates a name, email, and message, then opens a `mailto:` draft. The visitor must send it in their own email application. It does not claim that a message was sent, store form submissions, or transmit them to an external form service.

If a visitor has no configured email app, the form provides a retry link and the visible address can be copied. Clipboard copy first uses the modern browser API, then a fallback, then a clear manual-copy message if both are blocked.

To connect a form service later, replace the `compose` handler in `src/App.tsx` with that service's documented submission flow and endpoint. Add truthful sending/sent/error states only after receiving the service response. No service account or endpoint is configured in this delivery.

## Motion and accessibility

- **Observe:** restrained scroll reveals; no continuous decorative animation.
- **Explore:** cursor-following hero light, a gently magnetic CTA, portrait color reveal on hover, and a moving mission line.
- **Read:** disables animation and smooth scrolling.
- The system's `prefers-reduced-motion` setting takes priority over decorative motion.
- Navigation, native expandable disclosures, dialogs, and form controls support keyboard use. Escape closes dialogs, focus returns to the opener, and the modal prevents interaction with the background.
- Semantic headings, labeled inputs, a skip link, visible focus states, alt text, validation feedback, and live status messages are included.
- The motion preference is the only local-storage item. No analytics, cookies, tracking scripts, or third-party runtime font requests are added.

## Move to a custom domain later

1. In `src/content.json`, change `site.origin` to your real domain, for example `https://your-domain.example`, and `site.basePath` to `/`.
2. Add `public/CNAME` containing only your real domain name, without `https://` or a trailing slash.
3. Configure the same custom domain in **GitHub → Settings → Pages**, and follow [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for DNS and HTTPS.
4. Run `npm run build`, then commit and push.

Assets, documents, canonical URL, social-preview URL, and sitemap will all rebuild for the new location. No redesign or router changes are required.

## Project structure

| Path                           | Purpose                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| `src/content.json`             | Single personal-content/config source                               |
| `src/App.tsx`                  | Page sections, navigation, motion and contact behavior              |
| `src/components.tsx`           | Case studies, evidence dialogs, links and placeholders              |
| `src/styles.css`               | Visual system and responsive layouts                                |
| `src/types.ts`                 | Content interfaces                                                  |
| `src/entry-server.tsx`         | Static HTML rendering entry                                         |
| `scripts/prerender.mjs`        | Builds readable initial HTML                                        |
| `scripts/audit-content.mjs`    | Reports content slots and checks local asset references             |
| `public/`                      | Published local images and documents                                |
| `vite.config.ts`               | Base path, metadata, sitemap and build settings                     |
| `.github/workflows/deploy.yml` | Automatic Pages deployment                                          |
| `legacy/` and `assets/`        | Original site reference material; not part of the production output |
| `dist/`                        | Ready-to-host production output; regenerated on build               |

## Verification and limits

The delivery includes a production build and TypeScript validation, browser checks of desktop/mobile layouts, case-study dialogs and focus return, the mobile menu, content disclosures, motion settings, clipboard behavior, and contact validation. See `VERIFICATION.md` for the precise final checks and remaining limitations.

No Lighthouse score, employer validation, external-demo uptime guarantee, or current-role claim is invented. Proof assets and current updates still need your input, exactly where marked.

## Troubleshooting

- **Blank GitHub page / asset 404:** check that the repository is named `Portfolio`, the build uses `/Portfolio/`, and Pages Source is **GitHub Actions**. Publish the `dist/` artifact using the included workflow, not the unbuilt source as a branch website.
- **Wrong local URL:** development uses `/`; production preview uses `/Portfolio/` until you change the config.
- **Port 4173 in use:** stop the other dev/preview process before running this one.
- **Old social image:** rebuild and redeploy, then wait for the social platform's cached preview to refresh.
- **JSON build error:** check quotes, commas, and array/object brackets around your last edit.
- **A demo is down:** update its link in `src/content.json` or leave it blank; the site will show an honest placeholder.

