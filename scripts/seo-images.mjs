// Licensed stock photos (Pexels License: free commercial use, no attribution required).
// Credits: content/seo/image-credits.md. Alt text is neutral and never claims the photo shows TAC's own factory or work.
export const IMAGES = {
  "jeweler-bench-hand-tools": "Jeweler shaping a piece with hand tools at a wooden jewelry bench",
  "silver-ring-workbench": "Close-up of a silver ring being crafted at a jeweler's workbench",
  "ring-on-mandrel": "Gemstone ring being sized on a ring mandrel during jewelry making",
  "torch-silver-jewelry": "Torch soldering silver jewelry components on a soldering block",
  "crucible-flame": "Jewelry casting process: metal melting in a crucible under a torch flame",
  "ring-polishing": "Jeweler polishing a gold ring with a rotary tool",
  "ring-sizer-caliper": "Ring sizing stick and digital caliper used to measure rings",
  "jewelry-design-sketches": "Jewelry design sketches and technical drawings for a new collection",
  "gold-chain-necklace": "Fine gold chain necklace displayed on a white jewelry stand",
  "gold-wedding-rings": "Diamond engagement ring and gold wedding band on a reflective surface",
  "diamond-engagement-ring": "Rose gold diamond engagement ring set on white marble",
  "loose-diamond-tweezers": "Loose cushion-cut diamond held in tweezers",
  "gemstone-tweezers": "Octagon-cut gemstone held in tweezers for inspection",
  "silver-jewelry-flatlay": "Sterling silver necklaces, rings and earrings arranged on stones",
  "gold-tone-earrings": "Gold-tone fashion hoop earrings on white fabric",
  "gold-jewelry-collection": "Assortment of gold-tone fashion jewelry on display",
  "jewelry-gift-box": "Diamond pendant necklace and stud earrings in a black jewelry gift box",
};
const PILLAR = {
  "/custom-jewelry-manufacturer-usa": ["jeweler-bench-hand-tools", "jewelry-design-sketches", "jewelry-gift-box"],
  "/custom-jewelry-manufacturer/texas": ["ring-on-mandrel", "crucible-flame", "jewelry-gift-box"],
  "/custom-ring-manufacturer": ["silver-ring-workbench", "ring-sizer-caliper", "ring-polishing"],
  "/chain-necklace-manufacturer": ["gold-chain-necklace", "torch-silver-jewelry"],
  "/bridal-jewelry-manufacturer": ["gold-wedding-rings", "diamond-engagement-ring", "gemstone-tweezers"],
  "/lab-grown-diamond-jewelry-manufacturer": ["loose-diamond-tweezers", "diamond-engagement-ring"],
  "/brass-fashion-jewelry-manufacturer": ["gold-tone-earrings", "gold-jewelry-collection", "crucible-flame"],
  "/sterling-silver-jewelry-manufacturer": ["silver-jewelry-flatlay", "torch-silver-jewelry", "jewelry-gift-box"],
};
const HERO_POOL = ["jeweler-bench-hand-tools", "silver-ring-workbench", "ring-on-mandrel", "torch-silver-jewelry", "ring-polishing", "jewelry-design-sketches"];
const MID_POOL = ["jewelry-design-sketches", "ring-sizer-caliper", "crucible-flame", "gemstone-tweezers", "ring-polishing"];
const END_POOL = ["jewelry-gift-box", "gold-chain-necklace", "silver-jewelry-flatlay", "gold-wedding-rings", "gold-jewelry-collection"];
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
export function imagesFor(pagePath) {
  if (PILLAR[pagePath]) return PILLAR[pagePath];
  if (!pagePath.startsWith("/custom-jewelry-manufacturer/")) return null;
  const h = hash(pagePath);
  const hero = HERO_POOL[h % HERO_POOL.length];
  const mid = MID_POOL.filter((x) => x !== hero)[(h >>> 3) % (MID_POOL.length - 1)];
  const end = END_POOL[(h >>> 6) % END_POOL.length];
  return [hero, mid, end];
}
const src = (n) => `/assets/seo-img/${n}.webp`;
function figure(n, hero) {
  const attrs = hero ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<figure class="seo-figure${hero ? " seo-hero" : ""}"><img src="${src(n)}" srcset="/assets/seo-img/${n}-800.webp 800w, ${src(n)} 1200w" sizes="(max-width: 760px) 100vw, 720px" width="1200" height="750" alt="${IMAGES[n]}" ${attrs}></figure>`;
}
export function injectImages(html, names) {
  if (!names) return html;
  let out = html.replace(/<\/h1>/, (m) => `${m}\n${figure(names[0], true)}`);
  const inline = names.slice(1);
  let i = 0;
  const targets = [2, 4];
  let count = 0;
  out = out.replace(/<h2[\s>]/g, (m) => {
    count += 1;
    if (i < inline.length && count === targets[i]) return `${figure(inline[i++], false)}\n${m}`;
    return m;
  });
  return out;
}
export function imageObjects(origin, pageUrl, names) {
  return names.map((n, idx) => ({
    "@type": "ImageObject",
    "@id": `${pageUrl}#image-${idx + 1}`,
    contentUrl: `${origin}${src(n)}`,
    url: `${origin}${src(n)}`,
    width: 1200,
    height: 750,
    caption: IMAGES[n],
    license: "https://www.pexels.com/license/",
    acquireLicensePage: "https://www.pexels.com/license/",
  }));
}
