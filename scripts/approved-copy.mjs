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
.seo-approved{max-width:46rem;margin:0 auto;padding:2.5rem 1.25rem 4rem;font-family:"DM Sans",sans-serif;color:#1c1917;line-height:1.65;font-size:1.05rem}
.seo-approved h1,.seo-approved h2,.seo-approved h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;line-height:1.15;color:#1c1917}
.seo-approved h1{font-size:2.6rem;margin:0 0 1rem}
.seo-approved h2{font-size:1.8rem;margin:2.2rem 0 .75rem}
.seo-approved h3{font-size:1.35rem;margin:1.6rem 0 .5rem}
.seo-approved p{margin:0 0 1rem}
.seo-approved ul,.seo-approved ol{margin:0 0 1rem;padding-left:1.25rem}
.seo-approved li{margin:.35rem 0}
.seo-approved a{color:#7c5a2e}
.seo-approved table{width:100%;border-collapse:collapse;margin:0 0 1.25rem;font-size:.95rem}
.seo-approved th,.seo-approved td{border:1px solid #e7e5e4;padding:.65rem .75rem;text-align:left;vertical-align:top}
.seo-approved th{background:#faf7f2}
.seo-shell-header,.seo-shell-footer{font-family:"DM Sans",sans-serif;background:#1c1917;color:#faf7f2}
.seo-shell-header a,.seo-shell-footer a{color:#faf7f2;text-decoration:none}
.seo-shell-header a:hover,.seo-shell-footer a:hover{text-decoration:underline}
.seo-shell-inner{max-width:64rem;margin:0 auto;padding:1rem 1.25rem;display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;align-items:center;justify-content:space-between}
.seo-shell-brand{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.35rem;letter-spacing:.01em}
.seo-shell-nav{display:flex;flex-wrap:wrap;gap:.65rem 1rem;font-size:.95rem}
.seo-shell-footer .seo-shell-inner{font-size:.95rem}
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
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" crossorigin href="${ctx.cssHref}">
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
  <body>
    <!--
      SPA router gap: assets/index-*.js (wouter) has no route for this URL.
      A direct request serves this file. Loading the bundle would replace #root
      with the SPA not-found view, so this page intentionally omits it.
      In-app client navigations from existing screens do not render this HTML.
    -->
    <header class="seo-shell-header">
      <div class="seo-shell-inner">
        <a class="seo-shell-brand" href="/">${esc(ctx.brand)}</a>
        <nav class="seo-shell-nav" aria-label="Primary">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/blogs">Blogs</a>
          <a href="/case-studies">Case Studies</a>
          <a href="/contact">Contact</a>
          <a href="/get-quote">Get a quote</a>
        </nav>
      </div>
    </header>
    <article class="seo-approved">
${ctx.bodyHtml}
    </article>
    <footer class="seo-shell-footer">
      <div class="seo-shell-inner">
        <span>Factory in Mumbai, Maharashtra, India</span>
        <span><a href="tel:${ctx.phoneE164}">${esc(ctx.phoneDisplay)}</a></span>
        <span><a href="mailto:${ctx.email}">${esc(ctx.email)}</a></span>
      </div>
    </footer>
  </body>
</html>
`;
}
