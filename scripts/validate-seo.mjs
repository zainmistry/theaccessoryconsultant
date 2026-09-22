/**
 * Checks the generated SEO files and simulates static hosting:
 * clean URLs, real robots.txt / sitemap.xml, and 404 for unknown paths.
 */
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const vercel = JSON.parse(read("vercel.json"));
if (vercel.rewrites?.length) {
  fail(`vercel.json still has rewrites: ${JSON.stringify(vercel.rewrites)}`);
}
if (vercel.cleanUrls !== true) fail("cleanUrls must be true so /about serves about.html");
if (vercel.trailingSlash !== false) fail("trailingSlash must be false");

const www = (vercel.redirects || []).find(
  (rule) => rule.has?.some((item) => item.type === "host" && item.value === "www.theaccessoryconsultant.com")
);
if (!www || www.statusCode !== 301 || !String(www.destination).startsWith("https://theaccessoryconsultant.com/")) {
  fail("missing 301 from www.theaccessoryconsultant.com to the apex host");
}
for (const source of ["/about-us", "/about-us/", "/how-it-works", "/how-it-works/"]) {
  const rule = (vercel.redirects || []).find((item) => item.source === source);
  if (!rule || rule.statusCode !== 301) fail(`missing 301 for ${source}`);
}

const robots = read("robots.txt");
if (robots.includes("<html") || robots.includes("<!DOCTYPE")) fail("robots.txt is HTML");
if (!robots.includes("Sitemap: https://theaccessoryconsultant.com/sitemap.xml")) {
  fail("robots.txt missing sitemap URL");
}

const sitemap = read("sitemap.xml");
if (!sitemap.startsWith("<?xml")) fail("sitemap.xml is not XML");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (new Set(locs).size !== locs.length) fail("sitemap has duplicate URLs");
if (locs.some((loc) => loc.includes("/blogs/"))) fail("templated blog posts should not be in the sitemap");
if (!locs.includes("https://theaccessoryconsultant.com/")) fail("sitemap missing homepage");
for (const required of [
  "/about",
  "/services",
  "/blogs",
  "/case-studies",
  "/contact",
  "/get-quote",
  "/process",
  "/jewelry/solid-gold",
  "/stones/natural-diamonds",
  "/case-studies/1",
]) {
  if (!locs.includes(`https://theaccessoryconsultant.com${required}`)) fail(`sitemap missing ${required}`);
}

const bundleName = fs.readdirSync(path.join(root, "assets")).find((file) => /^index-.+\.js$/.test(file));
if (!bundleName) fail("missing compiled bundle");
const bundle = read(`assets/${bundleName}`);
const routes = [...bundle.matchAll(/path:"([^"]+)"/g)].map((match) => match[1]);
for (const route of routes) {
  if (route.includes(":")) continue;
  const file = route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
  if (!fs.existsSync(path.join(root, file))) fail(`missing HTML shell for ${route}`);
}
if (!fs.existsSync(path.join(root, "blogs/1.html"))) fail("missing blog shell");
if (!fs.existsSync(path.join(root, "blogs/205.html"))) fail("missing last blog shell");
if (!fs.existsSync(path.join(root, "case-studies/20.html"))) fail("missing last case study shell");

const home = read("index.html");
const about = read("about.html");
const contact = read("contact.html");
const blog = read("blogs/1.html");
const notFound = read("404.html");

for (const [name, html] of [
  ["home", home],
  ["about", about],
  ["contact", contact],
]) {
  if (!html.includes('rel="canonical"')) fail(`${name} missing canonical`);
  if (!html.includes("og:title")) fail(`${name} missing og:title`);
  if (!html.includes("twitter:card")) fail(`${name} missing twitter card`);
  if (!html.includes('application/ld+json')) fail(`${name} missing JSON-LD`);
  if (!html.includes("+919152727387")) fail(`${name} JSON-LD missing phone`);
  if (!html.includes("info@theaccessoryconsultant.com")) fail(`${name} missing email`);
  if (!html.includes("50 units per design")) fail(`${name} missing confirmed MOQ`);
  if (!html.includes("About 18 days")) fail(`${name} missing confirmed turnaround`);
  if (!html.includes("private label and OEM")) fail(`${name} missing confirmed NDA`);
  if (!html.includes('"addressLocality":"Mumbai"')) fail(`${name} missing Mumbai locality`);
  if (/"streetAddress"/.test(html)) fail(`${name} invented a street address`);
  if (!html.includes("<h1")) fail(`${name} missing h1`);
  if (!html.includes("/assets/seo-runtime.js")) fail(`${name} missing NAP runtime`);
  if (!html.includes("/assets/seo-routes.js")) fail(`${name} missing route meta map`);
  if (!html.includes("__FORMSPREE_FORM_ID__")) fail(`${name} dropped Formspree config`);
  if (!html.includes("AW-18369791593")) fail(`${name} dropped Google Ads tag`);
}

const homeTitle = home.match(/<title>([^<]+)<\/title>/)[1];
const aboutTitle = about.match(/<title>([^<]+)<\/title>/)[1];
if (homeTitle === aboutTitle) fail("homepage and about share a title");
if (!about.includes('href="https://theaccessoryconsultant.com/about"')) fail("about canonical is wrong");
if (!contact.includes("+91 9152727387")) fail("contact shell missing display phone");
if (contact.includes("jewelcraft") || contact.includes("123 456 7890")) fail("contact shell still has placeholders");
if (!blog.includes("noindex, follow")) fail("templated blog post should be noindex, follow");
if (blog.includes('content="index, follow"')) fail("blog post marked indexable");
if (!notFound.includes('content="noindex"')) fail("404.html must be noindex");
if (notFound.includes("seo-runtime") || notFound.includes("index-BdRfLf-F.js")) {
  fail("404.html should not boot the SPA");
}
if (locs.some((loc) => loc.endsWith("/404") || loc.includes("404.html"))) fail("404 is in the sitemap");

const titles = new Set();
for (const loc of locs) {
  const url = new URL(loc);
  const file = url.pathname === "/" ? "index.html" : `${url.pathname.replace(/^\//, "")}.html`;
  if (!fs.existsSync(path.join(root, file))) fail(`sitemap loc has no file: ${loc}`);
  const html = read(file);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) fail(`missing title for ${loc}`);
  if (titles.has(title)) fail(`duplicate title: ${title}`);
  titles.add(title);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== loc) fail(`canonical mismatch for ${loc}: ${canonical}`);
}

function contentType(filePath) {
  if (filePath.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (filePath.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  return "application/octet-stream";
}

function resolveClean(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded.replace(/^\//, "");
  const candidates = [
    relative,
    relative.endsWith(".html") ? "" : `${relative}.html`,
    path.join(relative, "index.html"),
  ].filter(Boolean);
  for (const candidate of candidates) {
    const absolute = path.join(root, candidate);
    if (absolute.startsWith(root) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
      return absolute;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveClean(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(read("404.html"));
    return;
  }
  res.writeHead(200, { "Content-Type": contentType(file) });
  res.end(fs.readFileSync(file));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

async function get(urlPath) {
  const response = await fetch(`http://127.0.0.1:${port}${urlPath}`);
  const body = await response.text();
  return { status: response.status, type: response.headers.get("content-type") || "", body };
}

const robotsRes = await get("/robots.txt");
if (robotsRes.status !== 200 || !robotsRes.type.includes("text/plain") || robotsRes.body.includes("<html")) {
  fail(`GET /robots.txt failed: ${robotsRes.status} ${robotsRes.type}`);
}
const sitemapRes = await get("/sitemap.xml");
if (sitemapRes.status !== 200 || !sitemapRes.type.includes("xml") || !sitemapRes.body.includes("<urlset")) {
  fail(`GET /sitemap.xml failed: ${sitemapRes.status} ${sitemapRes.type}`);
}
const aboutRes = await get("/about");
if (aboutRes.status !== 200 || !aboutRes.body.includes("<h1")) fail("GET /about did not return the about shell");
const unknown = await get("/this-route-should-not-exist");
if (unknown.status !== 404) fail(`unknown path status ${unknown.status}, expected 404`);
if (unknown.body.includes("Custom Jewelry Made for Brands That Scale")) {
  fail("unknown path returned the homepage");
}
const asset = await get("/assets/seo-runtime.js");
if (asset.status !== 200 || asset.body.includes("<html")) fail("seo runtime was rewritten to HTML");

server.close();

if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`SEO checks passed (${locs.length} sitemap URLs, ${routes.length} router paths).`);
