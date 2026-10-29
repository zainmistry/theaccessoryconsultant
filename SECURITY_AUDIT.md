# Security audit

**Target:** theaccessoryconsultant (static site, commit `728f04c`)
**Date:** 2026-10-29
**Method:** Source review of the categories below, using the evidence bar from [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill): a finding needs a real trust-boundary failure and an affected outcome; a missing second layer is hardening, not a vulnerability, when the first layer already stops the attack. Live hosts were not probed. Keys were not rotated. Hosting settings were not changed.

No critical or high issue was safe to patch without changing behavior, design, keys, or hosting. No application code was modified.

## Scope

Reviewed: secrets in the tree and git history, client-exposed keys, forms and endpoints, dependency vulnerabilities, response headers, CSP, open redirects and XSS, and third-party scripts.

Out of scope for this pass: memory safety, native apps, authenticated multi-tenant isolation, and a live header check of the deployed Vercel project. One pass does not exhaust the repo.

## Summary

| Severity | Count | Fixed |
| --- | --- | --- |
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | No (would change the form or third-party settings) |
| Low | 3 | No (hardening; CSP or SRI can change rendering) |
| Informational | 4 | — |

## Medium

### M1. Public quote form can be abused, and conversions are client-side only

The quote UI posts JSON to `https://formspree.io/f/` plus `window.__FORMSPREE_FORM_ID__` (`meajjjvw` in the HTML shells). There is no captcha, honeypot, or client rate limit. On HTTP success the bundle calls `gtag('event', 'conversion', { send_to })` from `window.__GOOGLE_ADS_SEND_TO__` with no server check that the lead is real.

**Impact:** Anyone can flood the Formspree inbox. A browser can also fire Google Ads conversions without a genuine lead. This does not expose a secret or take over an account.

**Why it was not fixed:** A captcha changes the form. Formspree and Google Ads controls are third-party settings. The form lives in the prebuilt bundle `assets/index-BdRfLf-F.js`, which this repo cannot safely regenerate.

**Recommendation:** Turn on Formspree spam filtering (or a honeypot) in the Formspree project. Count conversions from a verified server event, not only from the browser `onSuccess` path.

## Low

### L1. Security headers and CSP are not set in `vercel.json`

`vercel.json` sets `Content-Type` for `/robots.txt` and `/sitemap.xml` only. It does not set `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or a frame policy (`X-Frame-Options` or CSP `frame-ancestors`).

**Impact:** Hardening gap. There is no session and no authenticated action to clickjack. No DOM XSS sink for untrusted input was found, so a missing CSP is not currently the only thing stopping script injection. Whether Vercel adds HSTS or other headers at the edge was not checked.

**Recommendation:** Add the headers above in `vercel.json` only after a CSP allowlist is tested against Google Ads (`www.googletagmanager.com`), Google Fonts, cdnjs, and `formspree.io`. A strict CSP will break those loads.

### L2. Third-party script and style tags have no Subresource Integrity

Every SPA shell loads:

- `https://www.googletagmanager.com/gtag/js?id=AW-18369791593` (script, no SRI; gtag is not a stable file, so SRI is a poor fit)
- `https://fonts.googleapis.com` / `fonts.gstatic.com` (styles)
- `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` (styles, no `integrity`)

**Impact:** A compromise of those hosts can run script (gtag) or change CSS. The site intentionally trusts them for ads, fonts, and icons.

**Recommendation:** Self-host Font Awesome (or pin it with SRI) and self-host the font CSS if you want to drop the CDN. Keep gtag, and constrain it with a CSP `script-src` when L1 is implemented.

### L3. Markdown link allowlist accepts protocol-relative URLs

`scripts/approved-copy.mjs` `inline()` allows any `href` that starts with `/`, `mailto:`, or `tel:`. A link such as `[text](//example.com)` would be emitted as an off-site URL. HTML special characters are escaped, and current copy under `content/seo/` has no such links. Blog bodies in the SPA are rendered as React text, not this HTML.

**Impact:** None in the published copy. The generator would emit an off-site link if untrusted markdown were added later.

**Recommendation:** Allow root-relative paths that do not start with `//`, plus `mailto:` and `tel:`.

## Informational

### I1. No secrets in the tree or in history

Patterns searched in the working tree and across all 21 commits: AWS access key ids, Stripe live/test secret keys, GitHub tokens, Slack tokens, Google API keys, PEM / OpenSSH private keys, and `password=` assignments. `.gitignore` ignores `.env` and `.env.*`. No matching commit or file. No `.pem`, `.env`, or source-map files are tracked.

### I2. Client identifiers are public by design

`meajjjvw` (Formspree form id) and `AW-18369791593` / `AW-18369791593/JK7dCJ6KttscEOMms7dE` (Google Ads tag and conversion label) are embedded in HTML so the browser can submit the form and report conversions. They are not API secrets. This audit did not rotate them.

### I3. No dependency lockfile to audit

`package.json` declares no dependencies and there is no lockfile, so `npm audit` has nothing to scan. The shipped bundle includes `lucide-react` v0.453.0 and a production React build that references 18.3.1 (`react.production.min.js`). There is no server runtime in this repo. No vulnerable package was confirmed from source.

**Recommendation:** When the React source is available, commit a lockfile and audit that tree. Do not treat the minified bundle as a dependency manifest.

### I4. Checked paths that did not show a boundary failure

- **XSS.** Blog `content` is split into React text children (`h1`/`h2`/`p`/`li`), not HTML. The only `dangerouslySetInnerHTML` in the bundle is a static Radix scrollbar stylesheet. `assets/seo-runtime.js` writes `textContent` and meta `content` from `window.__SEO_ROUTES__`, keyed by `location.pathname`. JSON-LD is `JSON.stringify` with `<` escaped to `\u003c`.
- **Open redirects.** `vercel.json` destinations are fixed. The `www` rule sends `/:path*` to `https://theaccessoryconsultant.com/:path*` (same path, apex host only).
- **Blog API shim.** `assets/data/blog-api.js` intercepts only relative `/api/blog-posts` URLs and answers from `/assets/data/blog-posts.json`. It does not forward those calls off-origin.
- **Images.** Blog `imageUrl` values are root-relative `/assets/` paths, not `javascript:` or remote URLs.
- **`window.open`.** WhatsApp (`https://wa.me/919989113307`) and SMS (`sms:+919987911337`) use `window.open(url, "_blank")` without an explicit `noopener`. Current browsers default `noopener` for `window.open` to `_blank`, and both URLs are constants.

## Fixes applied

None. Critical: 0. High: 0. Medium and low items are recommendations because a fix would change the quote form, third-party configuration, response headers, or page resources.
