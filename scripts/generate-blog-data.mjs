import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const sourceTitlesPath = "/tmp/jewelry-source/client/src/data/blogTitles.ts";
const assetsDir = path.join(projectRoot, "assets");
const outputPath = path.join(assetsDir, "data", "blog-posts.json");

const blogImages = [
  "iStock-462183237_1759216721543.jpg",
  "iStock-481256857_1759216721544.jpg",
  "iStock-1274828960_1759216704876.jpg",
  "iStock-979671438_1759216704876.jpg",
  "iStock-1224215137_1759216704876.jpg",
  "iStock-546771612_1759216721544.jpg",
  "iStock-462202619_1759216721544.jpg",
  "iStock-500790351_1759216721544.jpg",
  "iStock-1273447930_1759216704873.jpg",
  "iStock-182151632_1759216704875.jpg",
  "iStock-1224215082_1759216704876.jpg",
  "iStock-1140084148_1759216721545.jpg",
  "iStock-870978930_1759216721545.jpg",
  "iStock-183380736_1759216721542.jpg",
  "iStock-154894277_1759216721542.jpg",
  "iStock-1300298551_1759216704877.jpg",
  "iStock-183432849_1759216704876.jpg",
  "iStock-1139987357_1759216704876.jpg",
  "iStock-453256733_1759216721543.jpg",
  "iStock-1282456745_1759216704875.jpg",
];

const deployedAssets = fs.readdirSync(assetsDir);

function resolveImageUrl(seedFile) {
  const base = seedFile.replace(".jpg", "");
  const match = deployedAssets.find((file) => file.startsWith(base));
  return match ? `/assets/${match}` : `/assets/${seedFile}`;
}

function generateBlogContent(title, category) {
  const paragraphs = [];
  paragraphs.push(`# ${title}\n`);
  paragraphs.push(
    `In the dynamic world of jewelry manufacturing and design, understanding ${title.toLowerCase()} is crucial for success. This comprehensive guide explores the key aspects you need to know.\n`
  );
  paragraphs.push(`## Understanding the Fundamentals\n`);
  paragraphs.push(
    `When it comes to ${category.toLowerCase()}, there are several fundamental principles that every jewelry professional should master. These core concepts form the foundation of successful operations in the jewelry industry.\n`
  );
  paragraphs.push(
    `The jewelry manufacturing landscape has evolved significantly over the past decade. Modern techniques combined with traditional craftsmanship create opportunities for innovation while maintaining quality standards that clients expect.\n`
  );
  paragraphs.push(`## Key Considerations\n`);
  paragraphs.push(`### Quality and Craftsmanship\n`);
  paragraphs.push(
    `Quality is paramount in jewelry manufacturing. Every piece must meet exacting standards for materials, construction, and finishing. At The Accessory Consultant, we ensure that each item undergoes rigorous quality control processes before reaching our clients.\n`
  );
  paragraphs.push(`### Manufacturing Process\n`);
  paragraphs.push(
    `The manufacturing process involves multiple stages, each requiring specialized expertise. From initial design concepts through CAD modeling, prototyping, production, and final finishing, every step contributes to the final product's excellence.\n`
  );
  paragraphs.push(`## Industry Best Practices\n`);
  paragraphs.push(
    `Implementing industry best practices ensures consistent results and client satisfaction. This includes maintaining proper documentation, following ethical sourcing guidelines, and staying current with technological advances in jewelry manufacturing.\n`
  );
  paragraphs.push(`### Material Selection\n`);
  paragraphs.push(
    `Choosing the right materials is critical for both aesthetic appeal and durability. Whether working with precious metals like gold and platinum, or incorporating gemstones and alternative materials, understanding material properties ensures optimal results.\n`
  );
  paragraphs.push(`### Design Innovation\n`);
  paragraphs.push(
    `Innovation drives the jewelry industry forward. Combining traditional techniques with modern technology like CAD/CAM systems allows manufacturers to create intricate designs that were previously impossible or impractical.\n`
  );
  paragraphs.push(`## Working with Manufacturers\n`);
  paragraphs.push(
    `Building strong partnerships with reliable manufacturers is essential for jewelry brands. Look for partners who demonstrate:\n\n- Consistent quality standards\n- Clear communication channels\n- Flexible minimum order quantities\n- Expertise in your specific category\n- Commitment to ethical practices\n`
  );
  paragraphs.push(`## Market Trends and Opportunities\n`);
  paragraphs.push(
    `The jewelry market continues to evolve with changing consumer preferences. Sustainability, customization, and unique design elements are increasingly important to modern buyers. Understanding these trends helps position your brand for success.\n`
  );
  paragraphs.push(`### Sustainability Focus\n`);
  paragraphs.push(
    `Consumers are increasingly conscious of environmental and social impacts. Implementing sustainable practices in sourcing, manufacturing, and packaging can differentiate your brand and appeal to eco-conscious buyers.\n`
  );
  paragraphs.push(`### Customization Demand\n`);
  paragraphs.push(
    `Personalization is a growing trend in jewelry. Offering customization options allows clients to create unique pieces that reflect their individual style and preferences, enhancing emotional connection and value.\n`
  );
  paragraphs.push(`## Technical Specifications\n`);
  paragraphs.push(
    `Understanding technical specifications is crucial for both manufacturers and brands. This includes metal purity standards, gemstone grading systems, manufacturing tolerances, and finishing requirements.\n`
  );
  paragraphs.push(
    `Proper documentation of specifications ensures that all parties have clear expectations and can deliver consistent results across production runs.\n`
  );
  paragraphs.push(`## Quality Assurance\n`);
  paragraphs.push(
    `Implementing robust quality assurance processes protects your brand reputation and ensures customer satisfaction. This includes:\n\n- Initial material inspection\n- In-process quality checks\n- Final product inspection\n- Packaging and presentation review\n- Documentation and certification\n`
  );
  paragraphs.push(`## Cost Considerations\n`);
  paragraphs.push(
    `Balancing quality and cost is essential for profitable operations. Understanding the factors that influence pricing helps in making informed decisions about materials, manufacturing processes, and order quantities.\n`
  );
  paragraphs.push(
    `Working with experienced manufacturers like The Accessory Consultant provides cost advantages through efficient processes, economies of scale, and optimized supply chains while maintaining premium quality standards.\n`
  );
  paragraphs.push(`## Getting Started\n`);
  paragraphs.push(
    `Whether you're launching a new jewelry line or expanding an existing brand, partnering with the right manufacturer is crucial. Consider these steps:\n\n1. Define your design vision and target market\n2. Research potential manufacturing partners\n3. Request samples and references\n4. Discuss minimum order quantities and pricing\n5. Establish clear communication protocols\n6. Start with a pilot production run\n7. Scale up based on market response\n`
  );
  paragraphs.push(`## Conclusion\n`);
  paragraphs.push(
    `Success in the jewelry industry requires attention to detail, understanding of manufacturing processes, and partnerships with reliable manufacturers. By focusing on quality, innovation, and ethical practices, your jewelry brand can thrive in today's competitive market.\n`
  );
  paragraphs.push(
    `At The Accessory Consultant, we're committed to helping jewelry brands succeed through expert manufacturing, responsive service, and consistent quality. Contact us to discuss how we can support your jewelry manufacturing needs.\n`
  );
  return paragraphs.join("\n");
}

function generatePublishDate(index, totalBlogs) {
  const startDate = new Date("2016-04-01");
  const endDate = new Date("2025-11-15");
  const timeRange = endDate.getTime() - startDate.getTime();
  const increment = timeRange / (totalBlogs - 1);
  return new Date(startDate.getTime() + increment * index).toISOString();
}

function loadBlogTitles() {
  const source = fs.readFileSync(sourceTitlesPath, "utf8");
  const match = source.match(/export const blogTitles[^=]*=\s*(\[[\s\S]*\]);/);
  if (!match) {
    throw new Error("Could not parse blogTitles from source file");
  }
  return Function(`"use strict"; return (${match[1]});`)();
}

const blogTitles = loadBlogTitles();
const posts = blogTitles.map((blog, index) => ({
  id: blog.id,
  title: blog.title,
  category: blog.category,
  excerpt: blog.excerpt,
  content: generateBlogContent(blog.title, blog.category),
  readTime: blog.readTime,
  imageUrl: resolveImageUrl(blogImages[(blog.id - 1) % blogImages.length]),
  author: "The Accessory Consultant Team",
  publishedAt: generatePublishDate(blog.id - 1, blogTitles.length),
}));

posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(posts));

console.log(`Generated ${posts.length} blog posts -> ${outputPath}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
