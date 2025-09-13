import { execSync } from "child_process";
import { mkdirSync } from "fs";

const baseUrl = "https://api.juanutrisyon.info/sitemaps";
const targetDir = "public/sitemaps";

mkdirSync(targetDir, { recursive: true });

const files = [
  "sitemap-foods-1.xml",
  "sitemap-foods-2.xml",
  "sitemap-foods-3.xml",
  "sitemap-static.xml",
];

for (const file of files) {
  console.log(`Fetching ${file}...`);
  execSync(`curl -s -o ${targetDir}/${file} ${baseUrl}/${file}`);
}

console.log("✅ Sitemaps copied to public/sitemaps");
