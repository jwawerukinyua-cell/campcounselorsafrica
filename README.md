# Camp Counselors Africa — Website

Everything in this folder is the complete, ready-to-deploy site: one self-contained
`index.html` (all CSS/JS/images embedded inline) plus the standard SEO/favicon files
search engines and social platforms expect.

## Files in this folder

| File | Purpose |
|---|---|
| `index.html` | The whole site — sections, styling, and JavaScript all in one file |
| _(favicon files removed)_ | The favicon is now embedded directly inside `index.html` as a data URI |
| `og-image.png` | The preview image shown when the site is shared on WhatsApp, Facebook, Twitter/X |
| `logo.png` | Standalone logo file, referenced by the site's structured data |
| `robots.txt` | Tells search engines they're allowed to crawl the whole site |
| `sitemap.xml` | Tells search engines what pages exist, for faster indexing |
| `cca-ai-proxy-worker.js` | A more locked-down way to run the AI Matcher (see setup guide below) |

## Domain

This site is built for **www.campcounselorsafrica.co.ke** — already set throughout
`index.html`, `sitemap.xml`, and `robots.txt`.

One open item: the contact email in the site is `info@cca.co.ke`, not
`@campcounselorsafrica.co.ke`. Confirm this is correct before full launch.

## Deploying with GitHub Pages

1. Settings -> Pages -> Source: "Deploy from a branch" -> `main` -> `/ (root)` -> Save.
2. Test on the free github.io URL first.
3. Once confirmed, add the custom domain under Settings -> Pages -> Custom domain,
   set up the DNS records at your registrar (CNAME for www, A records for apex),
   then tick "Enforce HTTPS" once DNS has propagated.

## Setting up the AI Matcher feature (Cloudflare Worker)

The API key is kept off the public site. `cca-ai-proxy-worker.js` is a Cloudflare
Worker that holds the key as a secret and proxies requests to Gemini.

1. Get a fresh key at aistudio.google.com/apikey
2. `npm install -g wrangler` then `wrangler login`
3. Put `cca-ai-proxy-worker.js` in a folder as `index.js`, run
   `wrangler init cca-ai-proxy --from-dash=false`
4. `wrangler secret put GEMINI_API_KEY` (paste your key)
5. `wrangler deploy` — note the resulting `.workers.dev` URL
6. In `index.html`, replace the `YOUR-SUBDOMAIN` placeholder in the `runAI()`
   function with that real URL, then redeploy the site.

## Delivering application submissions (Google Sheet + email)

The application form is wired to send data via a webhook — it just needs a real
destination. `index.html` has a placeholder webhook URL waiting.

**What you're building:** one Zapier Zap that catches the form submission and
fans it out to a Google Sheet row and an email.

1. **Create the Zap** at zapier.com -> Create Zap. Trigger app: "Webhooks by
   Zapier" -> Event: "Catch Hook" -> Continue. Copy the generated URL (looks like
   `https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/`) and send it to Claude to
   plug into the site.
2. **Add a Google Sheets step**: "Create Spreadsheet Row". Suggested columns:
   full_name, email, phone, age, home_country, county_or_town, preferred_route,
   preferred_city, experience, swimming_ability, earliest_departure, submitted_at.
3. **Add an email step**: "Email by Zapier" or Gmail -> Send Email, to
   info@cca.co.ke, subject like "New CCA Application: {{full_name}}".
4. **Submit a real test application** on the live site once the URL is wired in,
   then go back into the Sheets/Email steps in Zapier to map the real field names
   (they only appear after Zapier has seen one real submission).
5. **Publish the Zap.**

**Known limitation:** there's no real backend, so if the webhook call fails
silently, the applicant still sees a confirmation message on screen even though
nothing arrived. Acceptable trade-off for a free, no-server setup for now —
worth revisiting with a proper backend if guaranteed delivery becomes important.

## After it's live — quick SEO checklist

- Google Search Console: add the property, submit the sitemap.xml URL.
- Test the social preview with Facebook's Sharing Debugger and the Twitter/X Card Validator.
- Test structured data with Google's Rich Results Test.
