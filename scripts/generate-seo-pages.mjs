/**
 * Crawlable HTML shells for the static SPA deploy.
 *
 * This repository ships a compiled bundle, not the React source. Vercel
 * serves these files directly (cleanUrls), so each indexable route has a
 * unique title, description, canonical, Open Graph tags, and H1 in the
 * HTTP response. The same SPA bundle then renders the interactive page.
 *
 * Regenerate after the JS/CSS bundle or blog-posts.json changes:
 *   npm run generate:seo
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ORIGIN = "https://theaccessoryconsultant.com";
const BRAND = "The Accessory Consultant";
const PHONE_DISPLAY = "+91 9152727387";
const PHONE_E164 = "+919152727387";
const EMAIL = "info@theaccessoryconsultant.com";
const OG_IMAGE_PATH = "/assets/iStock-183380736_1759216721542-QZqdr2bG.jpg";
const OG_IMAGE_ALT = "Jewelry artisans at work in Mumbai";
const OG_IMAGE_WIDTH = 1920;
const OG_IMAGE_HEIGHT = 1235;

/**
 * Commercial facts the owner confirmed. Messaging we add is for US brands,
 * D2C labels, and wholesalers. Mumbai stays the factory location, not the
 * search market. Do not add street addresses, plating specs, or case-study metrics.
 */
const OFFER_META =
  "For US brands, D2C labels, and wholesalers. MOQ from 50 units per design, about 18-day CAD-to-delivery from our Mumbai factory. NDAs offered for private label and OEM.";
const OFFER_DESCRIPTION =
  "The Accessory Consultant is an export jewelry manufacturer for US brands, D2C labels, and wholesalers. The factory is in Mumbai. MOQ from 50 units per design. About 18-day CAD-to-delivery. NDAs offered for private label and OEM.";

function withOffer(description) {
  if (description.includes("50 units per design")) return description;
  return `${description} ${OFFER_META}`;
}

/**
 * Individual posts are a shared template (see generate-blog-data.mjs).
 * They stay reachable so the SPA route does not 404, but they are
 * noindex and omitted from the sitemap until the copy is rewritten.
 */
const INDEX_TEMPLATED_BLOG_POSTS = false;

const shellHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");

function requiredMatch(source, regex, label) {
  const match = source.match(regex);
  if (!match) throw new Error(`Could not read ${label} from index.html`);
  return match[1];
}

const assetJs = requiredMatch(shellHtml, /src="(\/assets\/index-[^"]+\.js)"/, "bundle js");
const assetCss = requiredMatch(shellHtml, /href="(\/assets\/index-[^"]+\.css)"/, "bundle css");
const adsId = requiredMatch(shellHtml, /id=(AW-\d+)/, "Google Ads id");
const formspreeId = requiredMatch(shellHtml, /__FORMSPREE_FORM_ID__ = "([^"]+)"/, "Formspree id");
const adsSendTo = requiredMatch(shellHtml, /__GOOGLE_ADS_SEND_TO__ = "([^"]+)"/, "Google Ads send_to");

const staticPages = [
  {
    path: "/",
    title: "The Accessory Consultant | Custom Jewelry Manufacturing for US Brands",
    description:
      "Custom jewelry manufacturer for US brands, D2C labels, and wholesalers. Factory in Mumbai. MOQ from 50 units per design, about 18-day CAD-to-delivery. NDAs offered for private label and OEM.",
    h1: "Custom Jewelry Made for Brands That Scale",
  },
  {
    path: "/about",
    title: `About ${BRAND} | Jewelry Manufacturer for US Brands`,
    description:
      "Export jewelry manufacturing for US brands, D2C labels, and wholesalers, produced at our Mumbai factory. MOQ from 50 units per design, about 18-day CAD-to-delivery. NDAs offered for private label and OEM.",
    h1: "About The Accessory Consultant Manufacturing",
  },
  {
    path: "/services",
    title: `Manufacturing Services | ${BRAND}`,
    description: withOffer(
      "Comprehensive jewelry manufacturing services covering all materials, stones, and design requirements. From concept to creation, we bring your vision to life."
    ),
    h1: "Our Manufacturing Services",
  },
  {
    path: "/blogs",
    title: `Jewelry Manufacturing Insights | ${BRAND}`,
    description:
      "Stay updated with the latest trends, techniques, and insights in jewelry manufacturing and business development. Over 200 comprehensive articles to help you succeed.",
    h1: "Industry Insights & Resources",
  },
  {
    path: "/case-studies",
    title: `Case Studies | ${BRAND}`,
    description:
      "Discover how we've helped brands and businesses transform their jewelry concepts into market-leading products through our manufacturing solutions.",
    h1: "Success Stories & Case Studies",
  },
  {
    path: "/contact",
    title: `Contact ${BRAND} | Manufacturing for US Brands`,
    description: `Talk with our Mumbai factory about production for your US brand, D2C label, or wholesale line. Call ${PHONE_DISPLAY} or email ${EMAIL}. MOQ from 50 units per design, about 18-day CAD-to-delivery. NDAs offered for private label and OEM.`,
    h1: "Get in Touch with Us",
    lead: `Production quotes for US brands, D2C labels, and wholesalers. Call ${PHONE_DISPLAY} or email ${EMAIL}. Factory in Mumbai, Maharashtra, India.`,
    pageType: "ContactPage",
  },
  {
    path: "/get-quote",
    title: `Get a Free Quote | ${BRAND}`,
    description:
      "Request a production quote for your US brand, D2C label, or wholesale line. Made at our Mumbai factory. MOQ from 50 units per design, about 18-day CAD-to-delivery. NDAs offered for private label and OEM.",
    h1: "Turn Your Jewelry Designs Into Finished Products",
  },
  {
    path: "/process",
    title: `Manufacturing Process | ${BRAND}`,
    description: withOffer(
      "From initial consultation to final delivery, we ensure excellence at every step of your jewelry creation journey."
    ),
    h1: "Our Manufacturing Process",
  },
  {
    path: "/process/consultation",
    title: `Consultation | ${BRAND}`,
    description: withOffer(
      "Understanding your vision, requirements, and specifications through detailed consultation sessions."
    ),
    h1: "Expert Consultation Services",
  },
  {
    path: "/process/design",
    title: `Design Process | ${BRAND}`,
    description:
      "Creating detailed CAD designs and 3D models to visualize your custom jewelry pieces. Our expert designers transform concepts into production-ready designs.",
    h1: "Creative Design Process",
  },
  {
    path: "/process/sample",
    title: `Sample Creation | ${BRAND}`,
    description:
      "Producing high-quality samples for your approval before moving to full production. Our sample process ensures perfect results every time.",
    h1: "Professional Sample Creation",
  },
  {
    path: "/process/production",
    title: `Production | ${BRAND}`,
    description:
      "Mass production with quality control ensuring every piece meets our high standards. Our state-of-the-art facility delivers exceptional results at scale.",
    h1: "Excellence in Production",
  },
  {
    path: "/jewelry/solid-gold",
    title: `Solid Gold Jewelry Manufacturing | ${BRAND}`,
    description:
      "Premium quality solid gold jewelry crafted with precision and attention to detail. Available in 14K, 18K, and 22K gold options to meet diverse market requirements and luxury standards.",
    h1: "Solid Gold Jewelry Manufacturing",
  },
  {
    path: "/jewelry/gold-filled",
    title: `Gold Filled Jewelry Manufacturing | ${BRAND}`,
    description:
      "Durable and affordable gold filled jewelry perfect for everyday wear. Our gold filled pieces offer luxury appearance with long-lasting quality at accessible price points.",
    h1: "Gold Filled Jewelry Manufacturing",
  },
  {
    path: "/jewelry/gold-vermeil",
    title: `Gold Vermeil Jewelry Manufacturing | ${BRAND}`,
    description:
      "High-quality sterling silver base with thick gold plating for luxury appeal at accessible prices. Perfect blend of quality and affordability for premium jewelry lines.",
    h1: "Gold Vermeil Jewelry Manufacturing",
  },
  {
    path: "/jewelry/gold-plated",
    title: `Gold Plated Jewelry Manufacturing | ${BRAND}`,
    description:
      "Cost-effective gold plated jewelry without compromising on style and visual appeal. Perfect for fashion-forward collections and mass market applications.",
    h1: "Gold Plated Jewelry Manufacturing",
  },
  {
    path: "/jewelry/silver",
    title: `Sterling Silver Jewelry Manufacturing | ${BRAND}`,
    description:
      "Premium sterling silver jewelry with timeless designs and excellent craftsmanship. Perfect for both classic elegance and contemporary style expressions.",
    h1: "Sterling Silver Jewelry Manufacturing",
  },
  {
    path: "/jewelry/stainless-steel",
    title: `Stainless Steel Jewelry Manufacturing | ${BRAND}`,
    description:
      "Durable and modern stainless steel jewelry perfect for contemporary markets and active lifestyles. Combining strength, style, and sustainability in every piece.",
    h1: "Stainless Steel Jewelry Manufacturing",
  },
  {
    path: "/stones/natural-diamonds",
    title: `Natural Diamonds | ${BRAND}`,
    description:
      "Authentic natural diamonds with certified quality and brilliance. Each stone represents billions of years of natural formation, offering unmatched beauty and eternal value.",
    h1: "Natural Diamonds Excellence",
  },
  {
    path: "/stones/lab-grown-diamonds",
    title: `Lab Grown Diamonds | ${BRAND}`,
    description:
      "Sustainable lab-grown diamonds with identical properties to natural diamonds. Offering eco-friendly luxury with exceptional quality and value for conscious consumers.",
    h1: "Lab Grown Diamonds Innovation",
  },
  {
    path: "/stones/precious-stones",
    title: `Precious Stones | ${BRAND}`,
    description:
      "Ruby, sapphire, emerald, and other precious gemstones of finest quality for luxury jewelry pieces. Each stone represents the pinnacle of natural beauty and rarity.",
    h1: "Precious Stones Collection",
  },
  {
    path: "/stones/semi-precious-stones",
    title: `Semi-Precious Stones | ${BRAND}`,
    description:
      "Amethyst, topaz, garnet, and other beautiful semi-precious stones offering vibrant colors and design possibilities at accessible prices.",
    h1: "Semi-Precious Stones Collection",
  },
  {
    path: "/stones/artificial-stones",
    title: `Artificial Stones | ${BRAND}`,
    description:
      "High-quality synthetic stones for cost-effective luxury appeal in fashion jewelry collections.",
    h1: "Artificial Stones Collection",
  },
];

for (const page of staticPages) {
  if (page.path === "/blogs" || page.path === "/case-studies") continue;
  page.description = withOffer(page.description);
}

function loadCaseStudies() {
  const bundle = fs.readFileSync(path.join(root, assetJs.replace(/^\//, "")), "utf8");
  const re =
    /\{id:(\d+),title:"([^"]+)",client:"([^"]+)",category:"([^"]+)",description:"([^"]+)"/g;
  const studies = [];
  let match;
  while ((match = re.exec(bundle))) {
    studies.push({
      id: Number(match[1]),
      title: match[2],
      client: match[3],
      category: match[4],
      description: match[5],
    });
  }
  const ids = new Set(studies.map((study) => study.id));
  if (studies.length !== 20 || ids.size !== 20) {
    throw new Error(`Expected 20 case studies in the bundle, found ${studies.length}`);
  }
  return studies.sort((a, b) => a.id - b.id);
}

function loadBlogPosts() {
  const posts = JSON.parse(fs.readFileSync(path.join(root, "assets/data/blog-posts.json"), "utf8"));
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("blog-posts.json did not contain posts");
  }
  return posts;
}

function fileForPath(urlPath) {
  if (urlPath === "/") return "index.html";
  return `${urlPath.replace(/^\//, "")}.html`;
}

function canonicalFor(urlPath) {
  if (urlPath === "/") return `${ORIGIN}/`;
  return `${ORIGIN}${urlPath}`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const offerFacts = [
  { "@type": "PropertyValue", name: "Minimum order quantity", value: "50 units per design" },
  { "@type": "PropertyValue", name: "CAD-to-delivery", value: "About 18 days" },
  { "@type": "PropertyValue", name: "NDA", value: "Offered for private label and OEM" },
];

function organizationGraph(pageUrl, page) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: BRAND,
      url: `${ORIGIN}/`,
      description: OFFER_DESCRIPTION,
      logo: `${ORIGIN}/assets/favicon-192.png`,
      email: EMAIL,
      telephone: PHONE_E164,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      additionalProperty: offerFacts,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${ORIGIN}/#localbusiness`,
      name: BRAND,
      url: `${ORIGIN}/`,
      description: OFFER_DESCRIPTION,
      image: `${ORIGIN}${OG_IMAGE_PATH}`,
      email: EMAIL,
      telephone: PHONE_E164,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mumbai",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Country", name: "United States" },
      additionalProperty: offerFacts,
      parentOrganization: { "@id": `${ORIGIN}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: BRAND,
      publisher: { "@id": `${ORIGIN}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": page.pageType || "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#organization` },
      inLanguage: "en",
    },
  ];

  if (page.blogPosting) {
    graph.push(page.blogPosting);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function renderPage(page) {
  const pageUrl = canonicalFor(page.path);
  const robots = page.robots || "index, follow";
  const ogType = page.ogType || "website";
  const lead = page.lead || page.description;
  const structured = jsonLdScript(organizationGraph(pageUrl, page));

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <meta name="robots" content="${esc(robots)}" />
    <link rel="canonical" href="${esc(pageUrl)}" />
    <meta property="og:type" content="${esc(ogType)}" />
    <meta property="og:site_name" content="${esc(BRAND)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${esc(pageUrl)}" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${ORIGIN}${OG_IMAGE_PATH}" />
    <meta property="og:image:alt" content="${esc(OG_IMAGE_ALT)}" />
    <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(page.title)}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${ORIGIN}${OG_IMAGE_PATH}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon-192.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script type="application/ld+json">${structured}</script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${adsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${adsId}');
    </script>
    <script src="/assets/data/blog-api.js"></script>
    <script type="module" crossorigin src="${assetJs}"></script>
    <link rel="stylesheet" crossorigin href="${assetCss}">
  </head>
  <body>
    <script>
      window.__FORMSPREE_FORM_ID__ = "${formspreeId}";
      window.__GOOGLE_ADS_SEND_TO__ = "${adsSendTo}";
    </script>
    <div id="root">
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">${esc(page.h1)}</h1>
        <p class="text-xl text-muted-foreground max-w-4xl">${esc(lead)}</p>
      </main>
    </div>
    <script src="/assets/seo-routes.js"></script>
    <script src="/assets/seo-runtime.js"></script>
    <script>
      document.addEventListener('click', function (e) {
        var target = e.target.closest('a[data-testid*="cta"][href="#"]');
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('openQuoteModal'));
      }, true);
    </script>
  </body>
</html>
`;
}

function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Not Found | ${esc(BRAND)}</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
    <link rel="stylesheet" crossorigin href="${assetCss}">
  </head>
  <body>
    <main class="max-w-3xl mx-auto px-4 py-24">
      <h1 class="text-4xl font-bold text-foreground mb-4">Page not found</h1>
      <p class="text-xl text-muted-foreground mb-8">That URL is not a page on ${esc(BRAND)}.</p>
      <p><a href="/">Back to the homepage</a></p>
    </main>
  </body>
</html>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`;
}

function renderSitemap(pages) {
  const urls = pages
    .filter((page) => page.indexable !== false)
    .map((page) => {
      const loc = `    <loc>${esc(canonicalFor(page.path))}</loc>`;
      const lastmod = page.lastmod ? `\n    <lastmod>${page.lastmod}</lastmod>` : "";
      return `  <url>\n${loc}${lastmod}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function blogTitle(post, titleCounts) {
  const suffix = ` | ${BRAND}`;
  if (titleCounts.get(post.title) > 1) {
    const year = post.publishedAt.slice(0, 4);
    return `${post.title} (${year})${suffix}`;
  }
  return `${post.title}${suffix}`;
}

function buildPages() {
  const pages = staticPages.map((page) => ({ ...page, indexable: true, ogType: "website" }));
  const studies = loadCaseStudies();
  for (const study of studies) {
    pages.push({
      path: `/case-studies/${study.id}`,
      title: `${study.title} | ${BRAND}`,
      description: study.description,
      h1: study.title,
      lead: study.description,
      indexable: true,
      ogType: "article",
    });
  }

  const posts = loadBlogPosts();
  const titleCounts = new Map();
  for (const post of posts) titleCounts.set(post.title, (titleCounts.get(post.title) || 0) + 1);

  for (const post of posts) {
    const pageUrl = canonicalFor(`/blogs/${post.id}`);
    const image = post.imageUrl?.startsWith("/") ? `${ORIGIN}${post.imageUrl}` : post.imageUrl;
    pages.push({
      path: `/blogs/${post.id}`,
      title: blogTitle(post, titleCounts),
      description: post.excerpt,
      h1: post.title,
      lead: post.excerpt,
      indexable: INDEX_TEMPLATED_BLOG_POSTS,
      robots: INDEX_TEMPLATED_BLOG_POSTS ? "index, follow" : "noindex, follow",
      ogType: "article",
      lastmod: INDEX_TEMPLATED_BLOG_POSTS ? post.publishedAt.slice(0, 10) : undefined,
      blogPosting: {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        image,
        author: { "@id": `${ORIGIN}/#organization` },
        publisher: { "@id": `${ORIGIN}/#organization` },
        mainEntityOfPage: pageUrl,
      },
    });
  }

  const paths = pages.map((page) => page.path);
  if (new Set(paths).size !== paths.length) {
    throw new Error("Duplicate page paths in SEO page set");
  }
  return pages;
}

function writeFile(relativePath, contents) {
  const destination = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, contents);
}

const manifestPath = path.join(root, "scripts/seo-manifest.json");

function loadPreviousManifest() {
  if (!fs.existsSync(manifestPath)) return [];
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

const pages = buildPages();
const previous = new Set(loadPreviousManifest());
const generated = [];

for (const page of pages) {
  const relativePath = fileForPath(page.path);
  writeFile(relativePath, renderPage(page));
  generated.push(relativePath);
}

const routeMeta = {};
for (const page of pages) {
  routeMeta[page.path] = {
    title: page.title,
    description: page.description,
    robots: page.robots || "index, follow",
    canonical: canonicalFor(page.path),
  };
}
writeFile("assets/seo-routes.js", `window.__SEO_ROUTES__ = ${JSON.stringify(routeMeta)};\n`);
generated.push("assets/seo-routes.js");

writeFile("404.html", renderNotFound());
generated.push("404.html");
writeFile("robots.txt", renderRobots());
generated.push("robots.txt");
writeFile("sitemap.xml", renderSitemap(pages));
generated.push("sitemap.xml");

const next = new Set(generated);
for (const relativePath of previous) {
  if (next.has(relativePath)) continue;
  const absolute = path.join(root, relativePath);
  if (fs.existsSync(absolute) && absolute.startsWith(root)) fs.unlinkSync(absolute);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(generated, null, 2)}\n`);

const indexable = pages.filter((page) => page.indexable !== false).length;
const blogCount = pages.filter((page) => page.path.startsWith("/blogs/")).length;
console.log(
  `Wrote ${generated.length} SEO files (${indexable} sitemap URLs, ${blogCount} blog shells, templated posts indexable=${INDEX_TEMPLATED_BLOG_POSTS}).`
);
