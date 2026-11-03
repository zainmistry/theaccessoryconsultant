/**
 * Turns the owner-approved US copy in content/seo into crawlable HTML.
 *
 * Pillar articles and the jewelry/stones hubs are standalone pages. They must
 * not load the SPA bundle: wouter has no route for these slugs, and the bundle
 * replaces #root with its own not-found view. Services and get-quote keep the
 * SPA (the quote form lives there) and receive the approved body as a sibling
 * of #root, which React does not wipe.
 */
import fs from "fs";
import path from "path";

export const PUBLISHED_ON = "2026-09-22";

const QUOTE_META_DESCRIPTION =
  "Request a custom jewelry manufacturing quote for US brands, wholesalers, and D2C. Mumbai factory. MOQ from 50. ~18-day CAD-to-delivery. NDA available.";

export const ARTICLE_CSS = `
.seo-page{background:var(--color-bg,#F7F5F0);color:var(--color-ink,#0F0F10);font-family:var(--font-sans,"Manrope",sans-serif);min-height:100vh;display:flex;flex-direction:column}
.seo-shell-header{position:sticky;top:0;z-index:50;background:rgba(247,245,240,.94);backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--color-rule,#E2DFD8)}
.seo-shell-inner{width:min(1240px,calc(100% - 32px));margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px}
.seo-shell-brand{font-family:var(--font-serif,"Instrument Serif",Georgia,serif);font-size:22px;line-height:1;color:var(--color-ink,#0F0F10);text-decoration:none;white-space:nowrap}
.seo-shell-nav{display:flex;align-items:center;gap:22px;font-size:14px;font-weight:500}
.seo-shell-nav a{color:var(--color-ink,#0F0F10);text-decoration:none;transition:color .2s}
.seo-shell-nav a:hover{color:var(--color-gold-ink,#7E5C22)}
.seo-shell-nav a[aria-current="page"]{color:var(--color-gold-ink,#7E5C22)}
.seo-shell-nav a.seo-cta{background:var(--color-ink,#0F0F10);color:var(--color-bg,#F7F5F0);padding:9px 16px;border-radius:999px;font-weight:600}
.seo-shell-nav a.seo-cta:hover{background:var(--color-gold-ink,#7E5C22);color:#fff}
.seo-menu-toggle{position:absolute;opacity:0;pointer-events:none}
.seo-menu-btn{display:none;width:44px;height:44px;align-items:center;justify-content:center;cursor:pointer;border-radius:6px;margin-right:-10px}
.seo-menu-btn span,.seo-menu-btn span:before,.seo-menu-btn span:after{display:block;width:20px;height:2px;background:var(--color-ink,#0F0F10);border-radius:2px;position:relative;transition:transform .2s,background .2s}
.seo-menu-btn span:before,.seo-menu-btn span:after{content:"";position:absolute;left:0}
.seo-menu-btn span:before{top:-6px}.seo-menu-btn span:after{top:6px}
.seo-menu-toggle:focus-visible+.seo-menu-btn{outline:2px solid var(--color-gold,#B8893B)}
@media (max-width:900px){
.seo-shell-header{position:relative}
.seo-menu-btn{display:inline-flex}
.seo-shell-inner{flex-wrap:wrap}
.seo-shell-nav{display:none;flex-basis:100%;flex-direction:column;align-items:stretch;gap:0;padding:4px 0 16px}
.seo-shell-nav a{padding:12px 0;border-bottom:1px solid var(--color-rule,#E2DFD8);font-size:15px}
.seo-shell-nav a.seo-cta{margin-top:14px;text-align:center;border-bottom:0;padding:13px 16px}
.seo-menu-toggle:checked~.seo-shell-nav{display:flex}
.seo-menu-toggle:checked+.seo-menu-btn span{background:transparent}
.seo-menu-toggle:checked+.seo-menu-btn span:before{transform:translateY(6px) rotate(45deg)}
.seo-menu-toggle:checked+.seo-menu-btn span:after{transform:translateY(-6px) rotate(-45deg)}
}
.seo-main{flex:1;width:min(1240px,calc(100% - 32px));margin:0 auto}
.seo-approved{max-width:720px;margin:0 auto;padding:72px 0 64px;font-size:17px;line-height:1.75;color:#2a2a2c}
.seo-approved>*:first-child{margin-top:0}
.seo-approved h1,.seo-approved h2{font-family:var(--font-serif,"Instrument Serif",Georgia,serif);font-weight:400;letter-spacing:-.01em;color:var(--color-ink,#0F0F10)}
.seo-approved h1{font-size:clamp(40px,6vw,68px);line-height:1.02;margin:0 0 28px}
.seo-approved h1+p{font-size:19px;line-height:1.65;color:var(--color-ink,#0F0F10)}
.seo-approved h2{font-size:clamp(30px,3.6vw,42px);line-height:1.1;margin:64px 0 16px;padding-top:28px;border-top:1px solid var(--color-rule,#E2DFD8)}
.seo-approved h3{font-family:var(--font-sans,"Manrope",sans-serif);font-weight:600;font-size:19px;line-height:1.35;margin:32px 0 8px;color:var(--color-ink,#0F0F10)}
.seo-approved p{margin:0 0 18px}
.seo-approved strong{color:var(--color-ink,#0F0F10);font-weight:600}
.seo-approved a{color:var(--color-gold-ink,#7E5C22);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.seo-approved a:hover{color:var(--color-ink,#0F0F10)}
.seo-approved ul,.seo-approved ol{margin:0 0 22px;padding:0}
.seo-approved ul{list-style:none}
.seo-approved ul>li{position:relative;padding-left:22px;margin:8px 0}
.seo-approved ul>li:before{content:"";position:absolute;left:2px;top:.72em;width:7px;height:7px;border-radius:50%;background:var(--color-gold,#B8893B)}
.seo-approved ol{list-style:none;counter-reset:step}
.seo-approved ol>li{counter-increment:step;position:relative;padding:14px 0 14px 56px;margin:0;border-bottom:1px solid var(--color-rule,#E2DFD8)}
.seo-approved ol>li:before{content:counter(step,decimal-leading-zero);position:absolute;left:0;top:12px;font-family:var(--font-serif,"Instrument Serif",Georgia,serif);font-size:28px;line-height:1;color:var(--color-gold-ink,#7E5C22)}
.seo-approved table{width:100%;border-collapse:collapse;margin:8px 0 28px;font-size:15px;line-height:1.5;background:#fff;border:1px solid var(--color-rule,#E2DFD8);border-radius:6px}
.seo-approved th,.seo-approved td{border-bottom:1px solid var(--color-rule,#E2DFD8);padding:12px 16px;text-align:left;vertical-align:top}
.seo-approved th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:var(--color-muted,#5E5F63);background:#FBFAF7}
.seo-approved tr:last-child td{border-bottom:0}
.seo-approved blockquote{margin:24px 0;padding:4px 0 4px 20px;border-left:2px solid var(--color-gold,#B8893B);font-family:var(--font-serif,Georgia,serif);font-size:22px}
.seo-figure{margin:28px 0 36px}.seo-figure img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;border-radius:6px;background:var(--color-rule,#E2DFD8)}.seo-hero{margin:8px 0 32px}
.seo-cta-band{border-top:1px solid var(--color-rule,#E2DFD8);background:var(--color-ink,#0F0F10);color:var(--color-bg,#F7F5F0)}
.seo-cta-band .seo-shell-inner{padding:48px 0;flex-wrap:wrap;gap:20px}
.seo-cta-band h2{font-family:var(--font-serif,"Instrument Serif",Georgia,serif);font-weight:400;font-size:clamp(28px,4vw,40px);line-height:1.1;margin:0 0 6px}
.seo-cta-band p{margin:0;color:#c9c7c1;font-size:15px}
.seo-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:999px;background:var(--color-bg,#F7F5F0);color:var(--color-ink,#0F0F10);font-weight:600;font-size:15px;text-decoration:none;transition:background .2s}
.seo-btn:hover{background:var(--color-gold,#B8893B);color:#fff}
.seo-shell-footer{border-top:1px solid var(--color-rule,#E2DFD8);font-size:13px;line-height:1.6;color:var(--color-muted,#5E5F63)}
.seo-shell-footer .seo-shell-inner{flex-wrap:wrap;padding:28px 0;gap:10px 24px;min-height:0}
.seo-shell-footer a{color:var(--color-ink,#0F0F10);text-decoration:none}
.seo-shell-footer a:hover{color:var(--color-gold-ink,#7E5C22)}
@media (max-width:720px){.seo-approved{padding:44px 0 48px;font-size:16px}.seo-approved h1+p{font-size:17px}.seo-approved h2{margin-top:48px}.seo-approved ol>li{padding-left:46px}.seo-approved ol>li:before{font-size:24px}.seo-shell-footer .seo-shell-inner{flex-direction:column;align-items:flex-start}}
`.trim();

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text) {
  let html = esc(text.trim());
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    if (!href.startsWith("/") && !href.startsWith("mailto:") && !href.startsWith("tel:")) return label;
    return `<a href="${esc(href)}">${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function isSpecial(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed === "---") return true;
  if (/^#{1,3}\s/.test(trimmed)) return true;
  if (trimmed.startsWith("|")) return true;
  if (/^[-*]\s+/.test(trimmed)) return true;
  if (/^\d+\.\s+/.test(trimmed)) return true;
  return false;
}

export function markdownToHtml(markdown) {
  const lines = String(markdown).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") {
      i += 1;
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }
    if (trimmed.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-+:?$/.test(cell))) rows.push(cells);
        i += 1;
      }
      if (rows.length) {
        const [head, ...body] = rows;
        const headHtml = head.map((cell) => `<th>${inline(cell)}</th>`).join("");
        const bodyHtml = body
          .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
          .join("");
        out.push(`<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`);
      }
      continue;
    }
    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items = [];
      const itemRe = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
      while (i < lines.length && itemRe.test(lines[i].trim())) {
        items.push(lines[i].trim().match(itemRe)[1]);
        i += 1;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
      continue;
    }
    const para = [trimmed];
    i += 1;
    while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) {
      para.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

function readCopy(dir) {
  const files = ["first-wave-seo-copy-us.md", "pillars-p2-p5-us.md", "pillars-p6-p10-us.md"];
  return files.map((file) => fs.readFileSync(path.join(dir, file), "utf8")).join("\n");
}

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing section ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`Missing end ${endMarker} after ${startMarker}`);
  return source.slice(start, end);
}

function blocks(slice) {
  return slice
    .split(/^### /m)
    .slice(1)
    .map((part) => {
      const breakAt = part.indexOf("\n");
      return {
        heading: part.slice(0, breakAt).trim(),
        body: part.slice(breakAt + 1).trim(),
      };
    });
}

function assertLength(label, value, max) {
  if (!value) throw new Error(`${label} is empty`);
  if (value.length > max) throw new Error(`${label} is ${value.length} characters (max ${max}): ${value}`);
}

function renderLabeled(slice, { h1Headings, untitled }) {
  let html = "";
  for (const block of blocks(slice)) {
    if (block.heading.startsWith("Meta ")) continue;
    const body = block.body.replace(/^\*\([^)]*\)\*\s*$/gm, "").trim();
    if (h1Headings.includes(block.heading)) {
      const line = body.split("\n").map((item) => item.trim()).find(Boolean);
      html += `<h1>${inline(line)}</h1>\n`;
      continue;
    }
    if (untitled.some((name) => block.heading.startsWith(name))) {
      html += `${markdownToHtml(body)}\n`;
      continue;
    }
    const title = block.heading.replace(/^H2:\s*/, "");
    html += `<h2>${inline(title)}</h2>\n${markdownToHtml(body)}\n`;
  }
  return `<article class="seo-approved" data-seo-approved="true">\n${html}</article>`;
}

function nextContentLine(chunk, heading) {
  const at = chunk.indexOf(heading);
  if (at < 0) throw new Error(`Missing ${heading}`);
  const lines = chunk.slice(at).split("\n").slice(1);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("*(")) continue;
    if (trimmed.startsWith("**") || trimmed.startsWith("#") || trimmed.startsWith("###")) break;
    return trimmed;
  }
  throw new Error(`No content after ${heading}`);
}

function articleBody(chunk) {
  const h1At = chunk.search(/^# /m);
  if (h1At < 0) throw new Error("Pillar is missing an H1");
  let body = chunk.slice(h1At);
  const stops = [body.search(/^\*\*Word count/m), body.search(/^## Parent handoff/m), body.search(/^## Pillar /m)].filter(
    (index) => index >= 0,
  );
  if (stops.length) body = body.slice(0, Math.min(...stops));
  return body.replace(/\n---\s*$/g, "").trim();
}

function parsePillars(source) {
  const re = /\*\*Slug:\*\*\s*`?([^`\n]+)`?/g;
  const pillars = [];
  for (const match of source.matchAll(re)) {
    const next = source.slice(match.index + match[0].length).search(/\*\*Slug:\*\*/);
    const chunk = source.slice(match.index, next < 0 ? source.length : match.index + match[0].length + next);
    const slug = match[1].trim().replace(/^\/?/, "/");
    const metaTitle = nextContentLine(chunk, "### Meta title");
    const metaDescription = nextContentLine(chunk, "### Meta description");
    const markdown = articleBody(chunk);
    const h1 = markdown.match(/^# (.+)$/m)?.[1]?.trim();
    assertLength(`${slug} meta title`, metaTitle, 60);
    assertLength(`${slug} meta description`, metaDescription, 155);
    if (!h1) throw new Error(`${slug} is missing an H1`);
    if (markdown.length < 500) throw new Error(`${slug} article looks truncated`);
    if (markdown.includes("Word count") || markdown.includes("Factual audit") || markdown.includes("Parent handoff")) {
      throw new Error(`${slug} included production notes`);
    }
    pillars.push({ path: slug, metaTitle, metaDescription, h1, markdown });
  }
  return pillars;
}

export function loadApprovedCopy(dir) {
  const source = readCopy(dir);
  const servicesSlice = sliceBetween(source, "## 1) `/services` page expansion copy", "## 2) `/get-quote`");
  const quoteSlice = sliceBetween(source, "## 2) `/get-quote`", "## 3) Pillar P1");
  const servicesTitle = nextContentLine(servicesSlice, "### Meta title");
  const servicesDescription = nextContentLine(servicesSlice, "### Meta description");
  assertLength("services meta title", servicesTitle, 60);
  assertLength("services meta description", servicesDescription, 155);
  assertLength("get-quote meta description", QUOTE_META_DESCRIPTION, 155);

  const quoteHtml = renderLabeled(quoteSlice, {
    h1Headings: ["Headline"],
    untitled: ["Short explainer", "Trust strip"],
  });
  const quoteTitle = quoteHtml.match(/<h1>([^<]+)<\/h1>/)?.[1];
  assertLength("get-quote meta title", quoteTitle, 60);

  const pillars = parsePillars(source);
  if (pillars.length !== 10) throw new Error(`Expected 10 pillars, found ${pillars.length}`);
  const slugs = pillars.map((pillar) => pillar.path);
  if (new Set(slugs).size !== slugs.length) throw new Error("Duplicate pillar slugs");

  return {
    services: {
      metaTitle: servicesTitle,
      metaDescription: servicesDescription,
      html: renderLabeled(servicesSlice, { h1Headings: ["H1"], untitled: ["Intro"] }),
    },
    quote: {
      metaTitle: quoteTitle,
      metaDescription: QUOTE_META_DESCRIPTION,
      html: quoteHtml,
    },
    pillars,
  };
}

const NAV=[["/","Home"],["/about","About"],["/services","Services"],["/blogs","Blogs"],["/case-studies","Case Studies"],["/custom-jewelry-manufacturer-usa","US brands"],["/contact","Contact"]];
export function renderCrawlablePage(ctx) {
  const robots = ctx.robots || "index, follow";
  const structured = JSON.stringify(ctx.jsonLd).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(ctx.title)}</title>
    <meta name="description" content="${esc(ctx.description)}" />
    <meta name="robots" content="${esc(robots)}" />
    <link rel="canonical" href="${esc(ctx.canonical)}" />
    <meta property="og:type" content="${esc(ctx.ogType || "article")}" />
    <meta property="og:site_name" content="${esc(ctx.brand)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${esc(ctx.canonical)}" />
    <meta property="og:title" content="${esc(ctx.title)}" />
    <meta property="og:description" content="${esc(ctx.description)}" />
    <meta property="og:image" content="${ctx.origin}${ctx.ogImage}" />
    <meta property="og:image:alt" content="${esc(ctx.ogAlt)}" />
    <meta property="og:image:width" content="${ctx.ogWidth}" />
    <meta property="og:image:height" content="${ctx.ogHeight}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ctx.title)}" />
    <meta name="twitter:description" content="${esc(ctx.description)}" />
    <meta name="twitter:image" content="${ctx.origin}${ctx.ogImage}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" crossorigin href="${ctx.cssHref}">
    <link rel="stylesheet" href="/assets/atelier.css">
    <style>${ARTICLE_CSS}</style>
    <script type="application/ld+json">${structured}</script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${ctx.adsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${ctx.adsId}');
    </script>
  </head>
  <body class="site">
    <!--
      SPA router gap: assets/index-*.js (wouter) has no route for this URL.
      A direct request serves this file. Loading the bundle would replace #root
      with the SPA not-found view, so this page intentionally omits it.
      In-app client navigations from existing screens do not render this HTML.
    -->
    <div class="seo-page">
    <header class="seo-shell-header">
      <div class="seo-shell-inner">
        <a class="seo-shell-brand" href="/">${esc(ctx.brand)}</a>
        <input type="checkbox" id="seo-menu" class="seo-menu-toggle" aria-label="Open menu">
        <label for="seo-menu" class="seo-menu-btn" aria-hidden="true"><span></span></label>
        <nav class="seo-shell-nav" aria-label="Primary">
${NAV.map(([h,l])=>`          <a href="${h}"${ctx.canonical===ctx.origin+h?' aria-current="page"':''}>${l}</a>`).join("\n")}
          <a class="seo-cta" href="/get-quote">Get a quote</a>
        </nav>
      </div>
    </header>
    <main class="seo-main">
    <article class="seo-approved">
${ctx.bodyHtml}
    </article>
    </main>
    <section class="seo-cta-band" aria-label="Request a quote">
      <div class="seo-shell-inner">
        <div>
          <h2>Ready to start your line?</h2>
          <p>MOQ from 50 units per design. About 18 days CAD to delivery. NDAs offered.</p>
        </div>
        <a class="seo-btn" href="/get-quote">Get a quote</a>
      </div>
    </section>
    <footer class="seo-shell-footer">
      <div class="seo-shell-inner">
        <span>Factory in Mumbai, Maharashtra, India</span>
        <span><a href="tel:${ctx.phoneE164}">${esc(ctx.phoneDisplay)}</a></span>
        <span><a href="mailto:${ctx.email}">${esc(ctx.email)}</a></span>
        <span><a href="/custom-jewelry-manufacturer-usa">Custom jewelry manufacturer USA</a></span>
      </div>
    </footer>
    </div>
  </body>
</html>
`;
}
