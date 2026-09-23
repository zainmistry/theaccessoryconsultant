# Approved US pages and the SPA router gap

The live site is a compiled SPA (`assets/index-*.js`, wouter). Vercel serves the generated HTML files with `cleanUrls`. React mounts only on `#root`.

## What is crawlable without the bundle

These URLs are standalone HTML. They include the approved article (or a factual hub) and are listed in `sitemap.xml` as indexable. They do **not** load the SPA bundle:

- `/blogs/custom-jewelry-manufacturer-for-us-brands`
- `/blogs/private-label-jewelry-manufacturer-for-us-brands`
- `/blogs/oem-odm-jewelry-manufacturer-for-us-brands`
- `/blogs/low-moq-jewelry-manufacturer-for-us-startups`
- `/blogs/jewelry-cad-manufacturing-for-brand-development`
- `/blogs/gold-vermeil-manufacturer-for-us-brands`
- `/blogs/gold-filled-manufacturer-for-us-d2c-brands`
- `/blogs/jewelry-manufacturer-for-d2c-brands-us`
- `/blogs/solid-gold-silver-custom-manufacturing-for-us-brands`
- `/blogs/how-to-get-a-jewelry-manufacturing-quote-rfq-guide-us`
- `/jewelry` and `/stones` (indexes of the material and stone pages that already exist)

`/jewelry/earrings`, `/jewelry/rings`, `/jewelry/necklaces`, `/jewelry/bracelets`, and `/jewelry/sets` 301 to `/jewelry`. Those category URLs are not routes in the bundle. The hub does not add material claims beyond the approved copy.

## What still depends on the SPA

`/services` and `/get-quote` keep the bundle so the quote form, Formspree endpoint, and Google Ads conversion stay in place. The approved body is a sibling of `#root`. React does not remove it. On screen it sits under the existing page, because the form is rendered inside `#root`.

Direct requests for the pillar and hub URLs return the static HTML. The wouter router has no matching routes, and `/blogs` does not list the new articles (that index is the compiled list of the 205 templated posts). A client-side navigation from an existing screen to one of these new URLs will not show this HTML. Full page loads (normal links, sitemap, crawl) will.

The 205 templated posts stay on disk as `noindex, follow` and stay out of the sitemap. Case studies stay indexable and unchanged.

Regenerate with `npm run generate:seo`.
