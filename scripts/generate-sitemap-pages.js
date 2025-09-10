import fs from 'fs'
import path from 'path'

// Example values
const totalFoods = 15000
const perPage = 5000
const pages = Math.ceil(totalFoods / perPage)

// Build list of child sitemap URLs
const sitemaps = Array.from({ length: pages }, (_, i) => 
  `/api/__sitemap__/urls/foods?page=${i + 1}`
)

fs.writeFileSync(
  path.resolve(process.cwd(), '.sitemap-pages.json'),
  JSON.stringify(sitemaps, null, 2),
  'utf8'
)

console.log('✅ Generated .sitemap-pages.json')
