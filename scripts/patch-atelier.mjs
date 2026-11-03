/**
 * Retints the compiled SPA and replaces the homepage view.
 * Form fetch payloads are not edited.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundlePath = path.join(root, "assets/index-BdRfLf-F.js");
const homeView = fs.readFileSync(path.join(root, "scripts/home-view.js"), "utf8").trim();
if (!homeView.startsWith("function SS()")) throw new Error("home-view.js must start with function SS()");

let src = fs.readFileSync(bundlePath, "utf8");

function replaceFn(source, name, next) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Missing function ${name}`);
  let depth = 0;
  let started = false;
  let end = start;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (c === "{") {
      depth += 1;
      started = true;
    } else if (c === "}") {
      depth -= 1;
      if (started && depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (!started || depth !== 0) throw new Error(`Could not close function ${name}`);
  return source.slice(0, start) + next + source.slice(end);
}

src = replaceFn(src, "SS", homeView);

const pairs = [
  ["'Cormorant Garamond', Georgia, serif", "'Instrument Serif', Georgia, serif"],
  ["'DM Sans', system-ui, sans-serif", "'Manrope', system-ui, sans-serif"],
  ['#1D5C3A', '#7E5C22'],
  ['#0d2e1a', '#0F0F10'],
  ['#1D9E75', '#B8893B'],
  ['#5DCAA5', '#8C9096'],
  ['#E1F5EE', '#F7F5F0'],
  ['#E8C96A', '#B8893B'],
  ['#FAF9F6', '#F7F5F0'],
  ['#F5F3EE', '#FFFFFF'],
  ['#141210', '#0F0F10'],
  ['#5a5550', '#5E5F63'],
  ['#9a948e', '#8C9096'],
  ['#1d1d1f', '#0F0F10'],
  ['backdropFilter:"blur(12px)"', 'backdropFilter:"none"'],
  ['borderRadius:40', 'borderRadius:6'],
  ['borderRadius:20', 'borderRadius:6'],
  ['borderRadius:16', 'borderRadius:6'],
  ['borderRadius:14', 'borderRadius:6'],
  ['borderRadius:12', 'borderRadius:6'],
  ['borderRadius:10', 'borderRadius:6'],
  ['borderRadius:8', 'borderRadius:6'],
  [
    'NS=["MOQ from 50 units","18-day turnaround","40+ countries","Free consultation"]',
    'NS=["MOQ from 50 units per design","About 18-day CAD-to-delivery","NDAs for private label and OEM","Free consultation"]',
  ],
  [
    'W4=["MOQ from 50 units","18-day CAD-to-delivery","Ships to 40+ countries","Free consultation"]',
    'W4=["MOQ from 50 units per design","About 18-day CAD-to-delivery","NDAs for private label and OEM","Free consultation"]',
  ],
  [
    '[{n:"12+",l:"Years experience"},{n:"200+",l:"Brands served"},{n:"150",l:"Skilled artisans"},{n:"40+",l:"Countries shipped"}]',
    '[{n:"50",l:"Units per design"},{n:"~18",l:"Days, CAD-to-delivery"},{n:"NDA",l:"Private label and OEM"},{n:"Mumbai",l:"Factory"}]',
  ],
  [
    'Join 200+ brands who trust us with their jewelry production. Get your free quote today.',
    'Request a quote for a US brand, D2C label, or wholesale line.',
  ],
  [
    'and 40+ other countries with full export documentation.',
    'Export documentation is part of the quote. Shipping time to the US is separate from factory CAD-to-delivery and is confirmed once destination and method are known.',
  ],
  [
    'Our client success metrics demonstrate consistent excellence in jewelry manufacturing and business growth.',
    'Factory terms we will actually quote: MOQ, CAD-to-delivery, confidentiality, and where the work is made.',
  ],
  [
    'children:"200+"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Successful Projects"}),r.jsx("p",{className:"text-muted-foreground",children:"Completed projects across diverse client base"})',
    'children:"50"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Units per design"}),r.jsx("p",{className:"text-muted-foreground",children:"MOQ starts from 50 units per design."})',
  ],
  [
    'children:"98%"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Client Satisfaction"}),r.jsx("p",{className:"text-muted-foreground",children:"Average client satisfaction rate"})',
    'children:"~18"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Days, CAD-to-delivery"}),r.jsx("p",{className:"text-muted-foreground",children:"About 18 days from CAD to delivery."})',
  ],
  [
    'children:"85%"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Repeat Clients"}),r.jsx("p",{className:"text-muted-foreground",children:"Clients who return for additional projects"})',
    'children:"NDA"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Private label and OEM"}),r.jsx("p",{className:"text-muted-foreground",children:"NDAs are offered for private label and OEM."})',
  ],
  [
    'children:"95%"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"On-Time Delivery"}),r.jsx("p",{className:"text-muted-foreground",children:"Projects delivered on or before deadline"})',
    'children:"Mumbai"}),r.jsx("h3",{className:"text-xl font-semibold text-foreground mb-2",children:"Factory"}),r.jsx("p",{className:"text-muted-foreground",children:"Production is at our factory in Mumbai, Maharashtra, India."})',
  ],
  [
    'i=[{metric:"Production Capacity",value:"150",unit:"Artisans",description:"Skilled craftspeople in our facility"},{metric:"Daily Output",value:"5000+",unit:"Pieces",description:"Maximum daily production capacity"},{metric:"Quality Rate",value:"99.5%",unit:"Accuracy",description:"First-pass quality success rate"},{metric:"On-Time Delivery",value:"95%",unit:"Reliability",description:"Orders delivered on schedule"}]',
    'i=[{metric:"Minimum order",value:"50",unit:"Units per design",description:"MOQ starts from 50 units per design. Exact MOQ can depend on style complexity, materials, and stones."},{metric:"CAD-to-delivery",value:"~18",unit:"Days",description:"Typical CAD-to-delivery is about 18 days. International shipping time to the US is separate."},{metric:"Confidentiality",value:"NDA",unit:"Private label and OEM",description:"NDAs are offered for private label and OEM programs."},{metric:"Factory",value:"Mumbai",unit:"Maharashtra, India",description:"Production is at our factory in Mumbai."}]',
  ],
  [
    'children:"Case Studies"})]}),r.jsx("button",{onClick:()=>n(!0),className:"bg-cta hover:opacity-80 text-cta-foreground px-4 py-1.5 rounded-full text-sm font-medium smooth-transition","data-testid":"nav-cta-quote"',
    'children:"Case Studies"}),r.jsx(q,{href:"/contact",className:"text-sm font-medium text-foreground hover:text-foreground/60 smooth-transition","data-testid":"nav-contact",children:"Contact"})]}),r.jsx("button",{onClick:()=>n(!0),className:"bg-cta hover:opacity-80 text-cta-foreground px-4 py-1.5 rounded-full text-sm font-medium smooth-transition","data-testid":"nav-cta-quote"',
  ],
  [
    'children:"Case Studies"}),r.jsx("button",{onClick:()=>{n(!0),i()},className:"w-full bg-cta hover:opacity-80 text-cta-foreground px-4 py-2 rounded-full text-sm font-medium smooth-transition mt-3","data-testid":"mobile-nav-cta-quote"',
    'children:"Case Studies"}),r.jsx(q,{href:"/contact",className:"block text-sm font-medium text-foreground hover:text-foreground/60 py-2 smooth-transition",onClick:i,"data-testid":"mobile-nav-contact",children:"Contact"}),r.jsx("button",{onClick:()=>{n(!0),i()},className:"w-full bg-cta hover:opacity-80 text-cta-foreground px-4 py-2 rounded-full text-sm font-medium smooth-transition mt-3","data-testid":"mobile-nav-cta-quote"',
  ],
];

for (const [from, to] of pairs) {
  const count = src.split(from).length - 1;
  if (count === 0) {
    if (src.includes(to)) continue;
    throw new Error(`Patch target missing: ${from.slice(0, 80)}`);
  }
  src = src.split(from).join(to);
}

if (src.includes("Cormorant") || src.includes("DM Sans")) {
  throw new Error("Old font families still in the bundle");
}
if (!src.includes("function SS()") || !src.includes("Request a quote")) {
  throw new Error("Homepage view was not inserted");
}
if (!src.includes("formspree.io/f/")) throw new Error("Formspree endpoint missing after patch");

fs.writeFileSync(bundlePath, src);
console.log("Patched SPA bundle");
