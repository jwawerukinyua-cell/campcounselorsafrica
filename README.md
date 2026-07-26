# Camp Counselors Africa — Website

Everything in this folder is the complete, ready-to-deploy site: one self-contained
`index.html` (all CSS/JS/images embedded inline) plus the standard SEO/favicon files
search engines and social platforms expect.

## Files in this folder

| File | Purpose |
|---|---|
| `index.html` | The whole site — sections, styling, and JavaScript all in one file |
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | Browser tab icon |
| `apple-touch-icon.png` | Icon when saved to an iPhone/iPad home screen |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | Icon for Android home screen |
| `site.webmanifest` | Tells phones how to display the site if added to a home screen |
| `og-image.png` | The preview image shown when the site is shared on WhatsApp, Facebook, Twitter/X |
| `logo.png` | Standalone logo file, referenced by the site's structured data |
| `robots.txt` | Tells search engines they're allowed to crawl the whole site |
| `sitemap.xml` | Tells search engines what pages exist, for faster indexing |

## ⚠️ One thing to fix before you publish

I used `https://www.cca.co.ke/` as a placeholder domain throughout (it matches your
`info@cca.co.ke` email). Before going live, confirm the real domain and update it in
these places if it's different:

- `index.html` — search for `cca.co.ke` (canonical tag, Open Graph tags, Twitter tags,
  and the structured data script near the top of `<head>`)
- `sitemap.xml` — the one `<loc>` entry
- `robots.txt` — the `Sitemap:` line

If you're only using the free `something.github.io` address for now with no custom
domain yet, replace `https://www.cca.co.ke/` with your actual
`https://yourusername.github.io/repo-name/` address in all the same spots.

## Deploying with GitHub Pages

1. **Create a new repository** on GitHub (e.g. `cca-website`). Public repos get free
   Pages hosting; private repos need GitHub Pro/Team/Enterprise for Pages.

2. **Add these files to the repo root** — either drag-and-drop them in the GitHub web
   UI ("Add file → Upload files") or via git:
   ```bash
   git clone https://github.com/yourusername/cca-website.git
   cd cca-website
   # copy all files from this folder in here
   git add .
   git commit -m "Initial site"
   git push
   ```

3. **Enable Pages**: in the repo, go to **Settings → Pages**. Under "Build and
   deployment", set **Source** to "Deploy from a branch", pick the `main` branch and
   `/ (root)` folder, then **Save**.

4. GitHub will give you a live URL within a minute or two, usually
   `https://yourusername.github.io/cca-website/`.

5. **Optional — custom domain** (e.g. `www.cca.co.ke`): in that same Pages settings
   page, enter the domain under "Custom domain". GitHub will create a `CNAME` file in
   your repo automatically. You'll then need to add DNS records at your domain
   registrar:
   - A `CNAME` record pointing `www` → `yourusername.github.io`
   - Four `A` records on the root domain pointing to GitHub's IPs (GitHub's docs show
     the current ones — search "GitHub Pages custom domain DNS records" for the
     up-to-date list, since these occasionally change)

   DNS changes can take a few hours to propagate.

## After it's live — quick SEO checklist

- **Google Search Console**: add the property, verify ownership, and submit
  `https://your-domain/sitemap.xml` so Google indexes it faster.
- **Test the social preview**: paste your live URL into
  [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/) and
  [Twitter/X Card Validator](https://cards-dev.twitter.com/validator) to confirm the
  `og-image.png` preview renders correctly.
- **Test structured data**: paste your live URL into
  [Google's Rich Results Test](https://search.google.com/test/rich-results) to confirm
  the business info (address, phone, email) is being read correctly.
- **Update contact details** in `index.html` and the structured data block if the
  phone numbers, email, or address ever change — they currently appear in a few
  places (footer, floating call button, structured data script).

## Notes on the current build

- The AI Program Matcher / Cover Letter Writer calls the Anthropic API directly from
  the browser with no key required in this environment — if you move this file
  outside of Claude's artifact system (e.g. plain GitHub Pages), that fetch call
  will need a real backend proxy with your own Anthropic API key, since browsers
  can't safely hold API keys. Flagging this now so it isn't a surprise later.
- The application form does not currently submit anywhere — it just shows a
  confirmation message. Wire it to a form service, email, or webhook once you've
  decided how you want submissions delivered.
