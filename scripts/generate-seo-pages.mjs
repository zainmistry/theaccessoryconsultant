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
import { ARTICLE_CSS, PUBLISHED_ON, loadApprovedCopy, markdownToHtml, renderCrawlablePage } from "./approved-copy.mjs";
import { HOME_FAQ, homeInnerHtml, homeSeoContentHtml } from "./atelier-home.mjs";

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
  if (
    description.includes("50 units per design") ||
    description.includes("MOQ from 50") ||
    description.includes("Low MOQ from 50")
  ) {
    return description;
  }
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
    title: "Jewelry Manufacturer for US Brands | Custom & Private Label",
    description:
      "Private label, custom and OEM jewelry manufacturer for US brands. MOQ from 50 units, about 18 days CAD to delivery, NDAs offered. Request a quote.",
    h1: "Custom Jewelry Manufacturer for Brands That Scale",
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
    title: "Manufacturing Services | placeholder",
    description: "placeholder",
    h1: "Our Manufacturing Services",
    skipOffer: true,
  },
  {
    path: "/blogs",
    title: "Jewelry Manufacturing Guides & FAQ for US Brands",
    description:
      "Jewelry manufacturing FAQ and guides: private label, low MOQ, product development, CAD, vermeil and gold filled. Written for US brands and buyers.",
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
    title: "Get a Free Quote | placeholder",
    description: "placeholder",
    h1: "Turn Your Jewelry Designs Into Finished Products",
    skipOffer: true,
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

const approved = loadApprovedCopy(path.join(root, "content/seo"));
const servicesPage = staticPages.find((page) => page.path === "/services");
servicesPage.title = approved.services.metaTitle;
servicesPage.description = approved.services.metaDescription;
servicesPage.supplement = `<style>${ARTICLE_CSS}</style>\n${approved.services.html}`;
const GUIDES = [
  ["/blogs/jewelry-product-development", "Jewelry product development for US brands"],
  ["/blogs/private-label-jewelry-manufacturer-for-us-brands", "Private label jewelry manufacturer for US brands"],
  ["/blogs/custom-jewelry-manufacturer-for-us-brands", "Custom jewelry manufacturer for US brands"],
  ["/blogs/oem-odm-jewelry-manufacturer-for-us-brands", "OEM and ODM jewelry manufacturing"],
  ["/blogs/low-moq-jewelry-manufacturer-for-us-startups", "Low MOQ jewelry manufacturer for US startups"],
  ["/blogs/jewelry-cad-manufacturing-for-brand-development", "Jewelry CAD manufacturing for brand development"],
  ["/blogs/gold-vermeil-manufacturer-for-us-brands", "Gold vermeil manufacturer for US brands"],
  ["/blogs/gold-filled-manufacturer-for-us-d2c-brands", "Gold filled manufacturer for US D2C brands"],
  ["/blogs/jewelry-manufacturer-for-d2c-brands-us", "Jewelry manufacturer for D2C brands"],
  ["/blogs/solid-gold-silver-custom-manufacturing-for-us-brands", "Solid gold and silver custom manufacturing"],
  ["/blogs/how-to-get-a-jewelry-manufacturing-quote-rfq-guide-us", "How to get a jewelry manufacturing quote"],
];
function guideListHtml(heading, intro) {
  const items = GUIDES.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("");
  return `<section class="seo-approved" data-seo-guides="true"><h2>${heading}</h2><p>${intro}</p><ul>${items}</ul><p>See our <a href="/case-studies">case studies</a> or <a href="/get-quote">request a quote</a>.</p></section>`;
}
servicesPage.supplement += `\n${guideListHtml(
  "Guides for US jewelry brands",
  'New to manufacturing? Start with our <a href="/blogs/jewelry-product-development">jewelry product development guide</a>, which covers concept, sketch, CAD, sampling, materials, QC, and production scale-up.',
)}`;
const blogsPage = staticPages.find((page) => page.path === "/blogs");
blogsPage.supplement = `<style>${ARTICLE_CSS}</style>\n${guideListHtml(
  "Jewelry manufacturing guides and FAQ",
  "In-depth guides for US brands, D2C labels, and wholesale buyers. MOQ from 50 units per design, about 18 days CAD to delivery, NDAs offered for private label and OEM.",
)}`;
const homePage = staticPages.find((page) => page.path === "/");
homePage.supplement = homeSeoContentHtml();
homePage.extraGraph = [
  {
    "@type": "FAQPage",
    "@id": `${ORIGIN}/#faq`,
    mainEntity: HOME_FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  },
];
const quotePage = staticPages.find((page) => page.path === "/get-quote");
quotePage.title = approved.quote.metaTitle;
quotePage.description = approved.quote.metaDescription;
quotePage.supplement = `<style>${ARTICLE_CSS}</style>\n${approved.quote.html}`;

for (const page of staticPages) {
  if (page.path === "/blogs" || page.path === "/case-studies" || page.skipOffer) continue;
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
      materials: (bundle.slice(match.index, match.index + 1500).match(/materials:\[([^\]]*)\]/)?.[1] || "")
        .split(",")
        .map((item) => item.replace(/"/g, "").trim())
        .filter(Boolean),
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
  if (page.extraGraph) graph.push(...page.extraGraph);

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
  const crawlable =
    page.path === "/"
      ? homeInnerHtml()
      : `<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">${esc(page.h1)}</h1>
        <p class="text-xl text-muted-foreground max-w-4xl">${esc(lead)}</p>
        ${page.extraHtml || ""}
      </main>`;

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
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
    <link rel="stylesheet" href="/assets/atelier.css">
  </head>
  <body class="site">
    <script>
      window.__FORMSPREE_FORM_ID__ = "${formspreeId}";
      window.__GOOGLE_ADS_SEND_TO__ = "${adsSendTo}";
    </script>
    <div id="root">
      ${crawlable}
    </div>
    ${page.supplement ? `${page.supplement}\n    ` : ""}    <script src="/assets/seo-routes.js"></script>
    <script src="/assets/seo-runtime.js"></script>
    <script src="/assets/atelier.js" defer></script>
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
    <link rel="stylesheet" href="/assets/atelier.css">
  </head>
  <body class="site">
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
      extraHtml: `<p class="text-lg text-muted-foreground max-w-4xl mt-4">Client: ${esc(study.client)}. Program type: ${esc(study.category)}.${
        study.materials.length ? ` Materials: ${esc(study.materials.join(", "))}.` : ""
      }</p>`,
      supplement: `<style>#seo-content{font-family:Manrope,system-ui,sans-serif;color:#2b2622;background:#f7f3ee;padding:40px 20px;border-top:1px solid rgba(0,0,0,.08)}#seo-content .seo-wrap{max-width:760px;margin:0 auto;line-height:1.7;font-size:16px}#seo-content h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:28px;margin:0 0 12px}#seo-content p{margin:0 0 12px;overflow-wrap:anywhere}#seo-content a{color:#8a5a2b;text-decoration:underline}</style>
<section id="seo-content" aria-label="About this program"><div class="seo-wrap"><h2>How this program was run</h2>
<p>Every program follows the same path: consultation, CAD, a physical sample for approval, then production checked against that sample. MOQ starts from 50 units per design, with about 18 days from CAD to delivery. NDAs are offered for private label and OEM.</p>
        <p>Related: <a href="/case-studies">all case studies</a> · <a href="/services">manufacturing services</a> · <a href="/blogs/jewelry-product-development">jewelry product development</a> · <a href="/blogs/private-label-jewelry-manufacturer-for-us-brands">private label manufacturing</a> · <a href="/get-quote">get a quote</a></p></div></section>`,
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

  return pages;
}

function crawlableShell(page, bodyMarkdown, { ogType, blogPosting, extraGraph }) {
  const canonical = canonicalFor(page.path);
  return renderCrawlablePage({
    origin: ORIGIN,
    brand: BRAND,
    phoneDisplay: PHONE_DISPLAY,
    phoneE164: PHONE_E164,
    email: EMAIL,
    cssHref: assetCss,
    ogImage: OG_IMAGE_PATH,
    ogAlt: OG_IMAGE_ALT,
    ogWidth: OG_IMAGE_WIDTH,
    ogHeight: OG_IMAGE_HEIGHT,
    adsId,
    title: page.title,
    description: page.description,
    canonical,
    bodyHtml: markdownToHtml(bodyMarkdown),
    robots: "index, follow",
    ogType,
    jsonLd: organizationGraph(canonical, {
      title: page.title,
      description: page.description,
      pageType: "WebPage",
      blogPosting,
      extraGraph,
    }),
  });
}

const PRODUCT_DEV = (() => {
  const markdown = fs.readFileSync(path.join(root, "content/seo/product-development-us.md"), "utf8").trim();
  const faqStart = markdown.indexOf("## Jewelry product development FAQ");
  const faq = [...markdown.slice(faqStart).matchAll(/^### (.+)\n([^\n]+)/gm)].map((m) => [m[1].trim(), m[2].trim()]);
  return {
    path: "/blogs/jewelry-product-development",
    metaTitle: "Jewelry Product Development for US Brands: CAD to Sample",
    metaDescription:
      "Jewelry product development for US brands: concept, sketch, CAD, sampling, materials, QC and production. MOQ from 50 units, about 18 days CAD to delivery.",
    h1: markdown.match(/^# (.+)$/m)[1].trim(),
    markdown,
    faq,
  };
})();
if (PRODUCT_DEV.metaTitle.length > 60) throw new Error(`Product development title too long`);
if (PRODUCT_DEV.metaDescription.length > 155) throw new Error(`Product development description too long`);
if (PRODUCT_DEV.faq.length < 4) throw new Error("Product development FAQ not parsed");

function relatedGuidesMarkdown(selfPath) {
  const others = GUIDES.filter(([href]) => href !== selfPath);
  const start = Math.max(0, GUIDES.findIndex(([href]) => href === selfPath));
  const picks = [];
  for (let i = 0; picks.length < 4 && i < others.length; i += 1) {
    picks.push(others[(start + i) % others.length]);
  }
  if (selfPath !== PRODUCT_DEV.path && !picks.some(([href]) => href === PRODUCT_DEV.path)) {
    picks[3] = GUIDES[0];
  }
  return `\n\n## Related guides\n\n${picks.map(([href, label]) => `- [${label}](${href})`).join("\n")}\n\nReady to talk about your line? See our [manufacturing services](/services), browse [case studies](/case-studies), or [get a quote](/get-quote).`;
}

function approvedPages() {
  const all = approved.pillars.concat([PRODUCT_DEV]);
  const pages = all.map((pillar) => {
    const url = canonicalFor(pillar.path);
    const isDev = pillar === PRODUCT_DEV;
    const extraGraph = [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Blogs", item: `${ORIGIN}/blogs` },
          { "@type": "ListItem", position: 3, name: pillar.h1, item: url },
        ],
      },
    ];
    if (isDev) {
      extraGraph.push(
        {
          "@type": "Service",
          "@id": `${url}#service`,
          name: "Jewelry product development",
          serviceType: "Jewelry product development and manufacturing",
          description: pillar.metaDescription,
          provider: { "@id": `${ORIGIN}/#organization` },
          areaServed: { "@type": "Country", name: "United States" },
          url,
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: pillar.faq.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        },
      );
    }
    return {
      path: pillar.path,
      title: pillar.metaTitle,
      description: pillar.metaDescription,
      indexable: true,
      lastmod: isDev ? "2026-11-03" : PUBLISHED_ON,
      ogType: "article",
      crawlableHtml: crawlableShell(
        { path: pillar.path, title: pillar.metaTitle, description: pillar.metaDescription },
        pillar.markdown + relatedGuidesMarkdown(pillar.path),
        {
          ogType: "article",
          extraGraph,
          blogPosting: {
            "@type": isDev ? "Article" : "BlogPosting",
            headline: pillar.h1,
            description: pillar.metaDescription,
            datePublished: isDev ? "2026-11-03" : PUBLISHED_ON,
            image: `${ORIGIN}${OG_IMAGE_PATH}`,
            author: { "@id": `${ORIGIN}/#organization` },
            publisher: { "@id": `${ORIGIN}/#organization` },
            mainEntityOfPage: url,
          },
        },
      ),
    };
  });

  const hubs = [
    {
      path: "/jewelry",
      title: "Jewelry Categories | The Accessory Consultant",
      description:
        "Jewelry materials we manufacture for US brands: solid gold, gold filled, vermeil, plated, silver, and stainless steel. Factory in Mumbai.",
      markdown: `# Jewelry we manufacture

The Accessory Consultant manufactures custom jewelry for US brands, D2C labels, wholesalers, retailers, and individuals. Production is at our factory in Mumbai. MOQ starts from 50 units. Typical CAD-to-delivery is about 18 days. NDAs are available for private-label and OEM programs.

Materials we work with:

- [Solid gold](/jewelry/solid-gold)
- [Gold filled](/jewelry/gold-filled)
- [Gold vermeil](/jewelry/gold-vermeil)
- [Gold plated](/jewelry/gold-plated)
- [Silver](/jewelry/silver)
- [Stainless steel](/jewelry/stainless-steel)

Quote requests often name earrings, rings, necklaces, bracelets, or sets. Those product types are made in the material lines above.

See [Process](/process) for CAD, sampling, and production, or [Services](/services) and [Get a quote](/get-quote) to brief a program.`,
    },
    {
      path: "/stones",
      title: "Stone Options | The Accessory Consultant",
      description:
        "Stone options for custom jewelry: natural diamonds, lab-grown diamonds, precious, semi-precious, and artificial stones. Mumbai factory.",
      markdown: `# Stone options

Stone options are available for jewelry we manufacture for US brands, D2C labels, and wholesalers. Production is at our factory in Mumbai.

- [Natural diamonds](/stones/natural-diamonds)
- [Lab-grown diamonds](/stones/lab-grown-diamonds)
- [Precious stones](/stones/precious-stones)
- [Semi-precious stones](/stones/semi-precious-stones)
- [Artificial stones](/stones/artificial-stones)

See [Jewelry](/jewelry) for materials and [Get a quote](/get-quote) to include stone direction in a brief.`,
    },
  ];

  for (const hub of hubs) {
    if (hub.title.length > 60) throw new Error(`Hub title too long: ${hub.title}`);
    if (hub.description.length > 155) throw new Error(`Hub description too long: ${hub.description}`);
    pages.push({
      path: hub.path,
      title: hub.title,
      description: hub.description,
      indexable: true,
      lastmod: PUBLISHED_ON,
      ogType: "website",
      crawlableHtml: crawlableShell(hub, hub.markdown, { ogType: "website" }),
    });
  }
  return pages;
}

/**
 * US location landing pages: one national hub plus city pages.
 * Copy lives in content/seo/locations/*.md (title/description header, then markdown).
 * Every page serves clients remotely from the Mumbai factory; no US office is claimed.
 */
const LOCATION_HUB_PATH = "/custom-jewelry-manufacturer-usa";
const LOCATION_CITIES = [
  ["new-york", "New York", "NY"],
  ["los-angeles", "Los Angeles", "CA"],
  ["miami", "Miami", "FL"],
  ["chicago", "Chicago", "IL"],
  ["dallas", "Dallas", "TX"],
  ["houston", "Houston", "TX"],
  ["san-francisco", "San Francisco", "CA"],
  ["atlanta", "Atlanta", "GA"],
  ["seattle", "Seattle", "WA"],
  ["las-vegas", "Las Vegas", "NV"],
  ["boston", "Boston", "MA"],
  ["philadelphia", "Philadelphia", "PA"],
  ["washington-dc", "Washington", "DC"],
  ["phoenix", "Phoenix", "AZ"],
  ["san-diego", "San Diego", "CA"],
  ["denver", "Denver", "CO"],
  ["austin", "Austin", "TX"],
  ["nashville", "Nashville", "TN"],
  ["charlotte", "Charlotte", "NC"],
  ["orlando", "Orlando", "FL"],
  ["minneapolis", "Minneapolis", "MN"],
  ["detroit", "Detroit", "MI"],
  ["portland", "Portland", "OR"],
  ["san-antonio", "San Antonio", "TX"],
  ["salt-lake-city", "Salt Lake City", "UT"],
  ["honolulu", "Honolulu", "HI"],
  ["new-jersey", "Newark", "NJ"],
  ["providence", "Providence", "RI"],
  ["fort-worth", "Fort Worth", "TX"],
  ["el-paso", "El Paso", "TX"],
  ["mcallen", "McAllen", "TX"],
  ["texas", "Texas", "TX"],
];
const TEXAS_CITY_SLUGS = LOCATION_CITIES.filter(([slug, , region]) => region === "TX" && slug !== "texas").map(([slug]) => slug);
const PRODUCT_PILLARS = [
  "custom-ring-manufacturer",
  "chain-necklace-manufacturer",
  "bridal-jewelry-manufacturer",
  "lab-grown-diamond-jewelry-manufacturer",
  "brass-fashion-jewelry-manufacturer",
  "sterling-silver-jewelry-manufacturer",
];
const LOCATIONS_LASTMOD = "2026-11-04";

function loadLocation(file, dir = "content/seo/locations") {
  const raw = fs.readFileSync(path.join(root, dir, file), "utf8").replace(/\r\n/g, "\n");
  const [header, ...rest] = raw.split("\n---\n");
  const meta = Object.fromEntries(header.split("\n").map((line) => line.match(/^(\w+):\s*(.+)$/)).filter(Boolean).map((m) => [m[1], m[2].trim()]));
  const markdown = rest.join("\n---\n").trim();
  const faqStart = markdown.search(/^## .*FAQ.*$/m);
  if (faqStart < 0) throw new Error(`No FAQ section in ${file}`);
  const faqBlock = markdown.slice(faqStart).split(/\n## /)[0];
  const faq = [...faqBlock.matchAll(/^### (.+)\n([^\n]+)/gm)].map((m) => [m[1].trim(), m[2].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")]);
  if (faq.length < 4) throw new Error(`FAQ not parsed in ${file}`);
  if (meta.title.length > 60) throw new Error(`Location title too long: ${meta.title}`);
  if (meta.description.length > 155) throw new Error(`Location description too long: ${meta.description}`);
  if (!markdown.includes("](/get-quote)")) throw new Error(`Missing quote CTA in ${file}`);
  return { title: meta.title, description: meta.description, h1: markdown.match(/^# (.+)$/m)[1].trim(), markdown, faq };
}

function locationPages() {
  const hubUrl = canonicalFor(LOCATION_HUB_PATH);
  const defs = [{ path: LOCATION_HUB_PATH, file: "usa.md", city: null }].concat(
    LOCATION_CITIES.map(([slug, name, region]) => ({ path: `/custom-jewelry-manufacturer/${slug}`, file: `${slug}.md`, city: { name, region } })),
  );
  return defs.map((def) => {
    const copy = loadLocation(def.file);
    const url = canonicalFor(def.path);
    if (def.city && !copy.markdown.includes(`](${LOCATION_HUB_PATH})`)) throw new Error(`${def.file} missing hub link`);
    if (def.city && !copy.markdown.includes("](/services)")) throw new Error(`${def.file} missing services link`);
    if (def.path.endsWith("/texas")) {
      for (const slug of TEXAS_CITY_SLUGS) {
        if (!copy.markdown.includes(`](/custom-jewelry-manufacturer/${slug})`)) throw new Error(`texas page missing link to ${slug}`);
      }
    }
    if (!def.city) {
      for (const slug of PRODUCT_PILLARS) {
        if (!copy.markdown.includes(`](/${slug})`)) throw new Error(`hub missing link to ${slug}`);
      }
      for (const [slug] of LOCATION_CITIES) {
        if (!copy.markdown.includes(`](/custom-jewelry-manufacturer/${slug})`)) throw new Error(`hub missing link to ${slug}`);
      }
    }
    const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` }];
    if (def.city) {
      crumbs.push({ "@type": "ListItem", position: 2, name: "Custom jewelry manufacturer USA", item: hubUrl });
      crumbs.push({ "@type": "ListItem", position: 3, name: def.city.name, item: url });
    } else {
      crumbs.push({ "@type": "ListItem", position: 2, name: "Custom jewelry manufacturer USA", item: url });
    }
    const areaServed = def.path.endsWith("/texas")
      ? { "@type": "State", name: "Texas", containedInPlace: { "@type": "Country", name: "United States" } }
      : def.city
      ? { "@type": "City", name: def.city.name, containedInPlace: { "@type": "State", name: def.city.region, containedInPlace: { "@type": "Country", name: "United States" } } }
      : { "@type": "Country", name: "United States" };
    const extraGraph = [
      { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: def.city ? `Custom jewelry manufacturing for ${def.city.name} brands` : "Custom jewelry manufacturing for US brands",
        serviceType: "Custom jewelry manufacturing",
        description: copy.description,
        provider: { "@id": `${ORIGIN}/#organization` },
        areaServed,
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: copy.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ];
    const html = crawlableShell({ path: def.path, title: copy.title, description: copy.description }, copy.markdown, {
      ogType: "website",
      extraGraph,
    }).replace('<article class="seo-approved">', `<section id="seo-content" aria-label="${esc(copy.h1)}"><article class="seo-approved">`).replace("    </article>\n", "    </article></section>\n");
    if (!html.includes('id="seo-content"') || !html.includes("</article></section>")) throw new Error(`seo-content wrap failed for ${def.path}`);
    return {
      path: def.path,
      title: copy.title,
      description: copy.description,
      indexable: true,
      lastmod: LOCATIONS_LASTMOD,
      ogType: "website",
      crawlableHtml: html,
    };
  });
}

function wordCount(markdown) {
  return markdown.replace(/\]\([^)]*\)/g, "]").replace(/[#*|\[\]`>-]/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** Product-type pillars at /<slug>; copy in content/seo/products/*.md. */
function productPages() {
  const hubUrl = canonicalFor(LOCATION_HUB_PATH);
  return PRODUCT_PILLARS.map((slug) => {
    const copy = loadLocation(`${slug}.md`, "content/seo/products");
    const words = wordCount(copy.markdown);
    if (words < 800) throw new Error(`${slug} has only ${words} words`);
    if (!copy.markdown.includes(`](${LOCATION_HUB_PATH})`)) throw new Error(`${slug} missing hub link`);
    if ((copy.markdown.match(/\]\(\/custom-jewelry-manufacturer\/[a-z-]+\)/g) || []).length < 3) throw new Error(`${slug} needs city links`);
    const pagePath = `/${slug}`;
    const url = canonicalFor(pagePath);
    const extraGraph = [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Custom jewelry manufacturer USA", item: hubUrl },
          { "@type": "ListItem", position: 3, name: copy.h1, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: copy.h1,
        serviceType: "Jewelry manufacturing",
        description: copy.description,
        provider: { "@id": `${ORIGIN}/#organization` },
        areaServed: { "@type": "Country", name: "United States" },
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: copy.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ];
    const html = crawlableShell({ path: pagePath, title: copy.title, description: copy.description }, copy.markdown, { ogType: "website", extraGraph })
      .replace('<article class="seo-approved">', `<section id="seo-content" aria-label="${esc(copy.h1)}"><article class="seo-approved">`)
      .replace("    </article>\n", "    </article></section>\n");
    if (!html.includes("</article></section>")) throw new Error(`seo-content wrap failed for ${pagePath}`);
    return { path: pagePath, title: copy.title, description: copy.description, indexable: true, lastmod: LOCATIONS_LASTMOD, ogType: "website", crawlableHtml: html };
  });
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

const pages = buildPages().concat(approvedPages(), locationPages(), productPages());
const pagePaths = pages.map((page) => page.path);
if (new Set(pagePaths).size !== pagePaths.length) {
  throw new Error("Duplicate page paths in SEO page set");
}
const previous = new Set(loadPreviousManifest());
const generated = [];

for (const page of pages) {
  const relativePath = fileForPath(page.path);
  writeFile(relativePath, page.crawlableHtml || renderPage(page));
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
