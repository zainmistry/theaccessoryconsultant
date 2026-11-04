// Licensed stock photos (iStock, licensed by owner; and Pexels License: free commercial use, no attribution required).
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
  "jeweler-loupe-bench": "Jeweler wearing a loupe while working on a ring at a bench",
  "diamond-ring-rotary-finishing": "Diamond ring being finished with a rotary tool",
  "jeweler-hands-filing-bench": "Jeweler's hands filing a small piece at a wooden bench pin",
  "ring-polishing-wheel": "Gemstone ring held against a polishing wheel",
  "gold-bangle-tweezers-bench": "Gold bangle being worked with tweezers at a jeweler's bench",
  "gold-jewelry-bench-tools": "Gold jewelry components and hand tools on a jeweler's bench",
  "gold-bangle-setting-detail": "Close-up of tweezers placing detail on a gold bangle",
  "soldering-torch-bench": "Soldering torch and jewelry pieces on a soldering block",
  "jewelry-design-sketch-pieces": "Jewelry design sketches beside finished statement pieces",
  "diamond-ring-stone-setting": "Diamond ring held in a setting clamp during stone setting",
  "jewelry-boxes-packing": "Artisan threading beads beside stacked jewelry boxes",
  "3d-printed-jewelry-models": "3D-printed resin jewelry models on a printer build platform",
  "cast-jewelry-tree": "Cast metal jewelry tree after the lost-wax casting process",
  "pave-ring-setting": "Close-up of pave stone setting on a ring",
  "jewelry-design-notebook": "Jewelry design notebook with sketches and a tray of samples",
  "jeweler-cad-tablet": "Jewelry designer reviewing a design on a tablet at a workbench",
  "gemstones-tools-flatlay": "Loose gemstones, wax models and jeweler's pliers laid out on wood",
  "jewelers-workshop-tools": "Jeweler's workshop bench with hammers, mandrels and tools",
  "jewelry-polishing-cloth": "Small gemstones sorted on a cloth at a lapidary bench",
  "brass-castings-bench": "Gold-tone castings and green gemstones on a jeweler's bench",
};
export const ISTOCK = {"jeweler-loupe-bench":"1140084148","diamond-ring-rotary-finishing":"154894277","jeweler-hands-filing-bench":"183380736","ring-polishing-wheel":"453256733","gold-bangle-tweezers-bench":"462183237","gold-jewelry-bench-tools":"462202619","gold-bangle-setting-detail":"481256857","soldering-torch-bench":"500790351","jewelry-design-sketch-pieces":"546771612","diamond-ring-stone-setting":"870978930","jewelry-boxes-packing":"1139987357","3d-printed-jewelry-models":"1224215082","cast-jewelry-tree":"1224215137","pave-ring-setting":"1273447930","jewelry-design-notebook":"1274828960","jeweler-cad-tablet":"1282456745","gemstones-tools-flatlay":"1300298551","jewelers-workshop-tools":"182151632","jewelry-polishing-cloth":"183432849","brass-castings-bench":"979671438"};
const PILLAR = {
  "/custom-jewelry-manufacturer-usa": ["jeweler-loupe-bench", "jeweler-cad-tablet", "cast-jewelry-tree"],
  "/custom-jewelry-manufacturer/texas": ["jeweler-hands-filing-bench", "3d-printed-jewelry-models", "gemstones-tools-flatlay"],
  "/custom-ring-manufacturer": ["diamond-ring-stone-setting", "diamond-ring-rotary-finishing", "ring-polishing-wheel"],
  "/chain-necklace-manufacturer": ["gold-chain-necklace", "soldering-torch-bench"],
  "/bridal-jewelry-manufacturer": ["gold-wedding-rings", "pave-ring-setting", "diamond-engagement-ring"],
  "/lab-grown-diamond-jewelry-manufacturer": ["loose-diamond-tweezers", "diamond-ring-rotary-finishing"],
  "/brass-fashion-jewelry-manufacturer": ["brass-castings-bench", "gold-tone-earrings", "cast-jewelry-tree"],
  "/sterling-silver-jewelry-manufacturer": ["silver-jewelry-flatlay", "soldering-torch-bench", "ring-polishing-wheel"],
};
const HERO_POOL = ["jeweler-loupe-bench", "jeweler-hands-filing-bench", "gold-bangle-tweezers-bench", "gold-bangle-setting-detail", "gold-jewelry-bench-tools", "jewelers-workshop-tools", "pave-ring-setting"];
const MID_POOL = ["jewelry-design-sketch-pieces", "jewelry-design-notebook", "3d-printed-jewelry-models", "cast-jewelry-tree", "soldering-torch-bench", "jeweler-cad-tablet"];
const END_POOL = ["jewelry-boxes-packing", "gemstones-tools-flatlay", "ring-polishing-wheel", "jewelry-gift-box", "jewelry-polishing-cloth", "gold-chain-necklace"];
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
export function imagesFor(pagePath) {
  if (PILLAR[pagePath]) return PILLAR[pagePath];
  if (!pagePath.startsWith("/custom-jewelry-manufacturer/")) return null;
  const h = hash(pagePath);
  const hero = HERO_POOL[h % HERO_POOL.length];
  const mid = MID_POOL[(h >>> 3) % MID_POOL.length];
  const end = END_POOL[(h >>> 6) % END_POOL.length];
  return [hero, mid, end];
}
const src = (n) => `/assets/seo-img/${n}.webp`;
export function figure(n, hero) {
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
    ...(ISTOCK[n] ? { creditText: "iStock", copyrightNotice: "iStock, licensed" } : { license: "https://www.pexels.com/license/", acquireLicensePage: "https://www.pexels.com/license/" }),
  }));
}
