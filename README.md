# Camp Counselors Africa — Website

Everything in this repo is the complete, ready-to-deploy site: one self-contained
`index.html` (all CSS/JS/images embedded inline) plus the standard SEO/favicon files
search engines and social platforms expect.

## Files in this repo

| File | Purpose |
|---|---|
| `index.html` | The whole site — sections, styling, and JavaScript all in one file |
| `og-image.png` | The preview image shown when the site is shared on WhatsApp, Facebook, Twitter/X |
| `logo.png` | Standalone logo file, referenced by the site's structured data |
| `robots.txt` | Tells search engines they're allowed to crawl the whole site |
| `sitemap.xml` | Tells search engines what pages exist, for faster indexing |
| `cca-ai-proxy-worker.js` | A Cloudflare Worker that keeps the AI Matcher's API key off the public site (see setup guide below) |

Note: the favicon is embedded directly inside `index.html` as a data URI — no separate favicon files needed, so it can't go missing from a partial upload.

## Domain

This site is built for **`www.campcounselorsafrica.co.ke`** — that's already set
throughout `index.html`, `sitemap.xml`, and `robots.txt` (canonical tag, Open Graph
tags, Twitter tags, and the structured data script). Nothing to change here unless
the domain ever changes.

One thing worth double-checking: the contact email in the site and its structured
data is `info@cca.co.ke` — not `@campcounselorsafrica.co.ke`. If your actual email
address uses the longer domain, let me know and I'll update it everywhere it appears.

## Enabling GitHub Pages

1. Go to **Settings → Pages** in this repo.
2. Under "Build and deployment", set **Source** to "Deploy from a branch", pick the
   `main` branch and `/ (root)` folder, then **Save**.
3. GitHub will give you a live test URL within a minute or two, something like
   `https://jwawerukinyua-cell.github.io/campcounselorsafrica/`. Open it and click
   through everything — the pathway cards, the budget calculator, the AI Matcher,
   the application form, the FAQ, the floating call button, and the mobile menu.

## Once you've confirmed everything works: add the custom domain

4. Back in **Settings → Pages**, under "Custom domain", enter
   `www.campcounselorsafrica.co.ke` and save. GitHub creates a `CNAME` file in this
   repo automatically — you don't need to touch it.
5. At your domain registrar, add these DNS records:
   - A `CNAME` record: `www` → `jwawerukinyua-cell.github.io`
   - Four `A` records on the root/apex domain pointing to GitHub Pages' IP
     addresses — search "GitHub Pages custom domain DNS records" for the current
     list, since these occasionally change.

   DNS changes can take anywhere from a few minutes to ~24 hours to propagate.
6. **Force HTTPS**: back in Settings → Pages, once GitHub has verified your DNS, a
   checkbox labeled **"Enforce HTTPS"** becomes available — tick it. If it's greyed
   out, DNS just hasn't finished propagating yet.

## After it's live — quick SEO checklist

- **Google Search Console**: add the property, verify ownership, and submit
  `https://www.campcounselorsafrica.co.ke/sitemap.xml` so Google indexes it faster.
- **Test the social preview**: paste your live URL into
  [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/) and
  [Twitter/X Card Validator](https://cards-dev.twitter.com/validator).
- **Test structured data**: paste your live URL into
  [Google's Rich Results Test](https://search.google.com/test/rich-results).

## Setting up the AI Matcher feature (Cloudflare Worker — the locked-down path)

The API key is kept fully off the public site. Here's the setup — terminal
commands, not code editing.

**Why:** `index.html` is a plain text file anyone can view. A key sitting in it is
visible to every visitor. `cca-ai-proxy-worker.js` is a small proxy server that
holds the key privately and sits between your site and Google's API, running on
Cloudflare Workers — the same platform your Command Center app already uses.

**1. Get a fresh API key** at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) — click
**Create API key**, copy it.

**2. Deploy the proxy Worker.** You'll need [Node.js](https://nodejs.org)
installed, then in a terminal:
```bash
npm install -g wrangler
wrangler login
```
Create a folder for the worker, put `cca-ai-proxy-worker.js` inside it (as
`index.js`), then run:
```bash
wrangler init cca-ai-proxy --from-dash=false
```
Store the key as a secret:
```bash
wrangler secret put GEMINI_API_KEY
```
Paste your key when prompted — it's encrypted on Cloudflare's side from here on.
Deploy it:
```bash
wrangler deploy
```
Wrangler prints a URL like `https://cca-ai-proxy.yoursubdomain.workers.dev`.

**3. Point the site at your Worker.** In `index.html`, search for
`YOUR-SUBDOMAIN` (inside the `runAI()` function) and replace that placeholder URL
with the real one Wrangler gave you:
```js
const AI_PROXY_URL = "https://cca-ai-proxy.YOUR-SUBDOMAIN.workers.dev";
```
Save, then push the updated file back to this repo.

**4. Confirm it's locked down.** View your live site's page source and confirm no
`AQ.` or `AIzaSy` key appears anywhere — only the `.workers.dev` URL. The Worker
already restricts requests to only `www.campcounselorsafrica.co.ke` via CORS.

## Other notes on the current build

- The application form does not currently submit anywhere — it just shows a
  confirmation message. Wire it to a form service, email, or webhook once you've
  decided how you want submissions delivered.
