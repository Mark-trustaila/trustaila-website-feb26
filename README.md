# trustaila.com

Marketing site for AiLA AI Ltd. Static HTML, deployed via Vercel.

## Structure

```
index.html        Main site
privacy.html      Privacy Policy
404.html          Custom error page
favicon.svg       Favicon (SVG, modern browsers)
favicon.ico       Favicon (ICO, legacy browsers) — generate from AiLA_Favicon.png at realfavicongenerator.net
robots.txt        Search engine directives
sitemap.xml       Page index for Google Search Console
vercel.json       Vercel routing, security headers, cache rules
images/
  og-image.png    Social share image (1200×630px)
```

## Deployment

Connected to Vercel. Push to `main` to deploy. No build step.

## Key integrations

- **Google Analytics 4** — `G-0NE4NLX6BT`. Blocked until visitor accepts analytics cookies.
- **Cookie consent** — Cookie Consent by Orest Bida (open source, no SaaS dependency). Loaded from jsDelivr CDN.
- **Contact form** — Formspree endpoint `mjgerjao`. Submissions arrive by email and in the Formspree dashboard.

## To do

- Generate `favicon.ico` from `AiLA_Favicon.png` at realfavicongenerator.net
- Fix OG image missing text
- Add Terms & Conditions page
- Register trustaila.com with Google Search Console and submit sitemap
- Add LinkedIn Insight Tag when Campaign Manager account is set up
- ICO registration (£40/year, required as data controller)
# trustaila-website-feb26
