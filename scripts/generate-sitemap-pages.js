// Node 18+ (uses global fetch)
import fs from 'fs';
import path from 'path';

const OUT = path.resolve(process.cwd(), '.sitemap-pages.json');

async function main(){
  // Replace with your real API count endpoint
  // const res = await fetch('https://api.juanutrisyon.info/sitemap-foods-count');
  // const json = await res.json();
  //const total = Number(json.total) || 15000;
  const total = 15000;
  
  const perPage = 5000;                 // choose chunk size
  const pages = Math.ceil(total / perPage);

  const arr = Array.from({ length: pages }, (_, i) =>
    `/api/__sitemap__/urls/foods?page=${i+1}`
  );

  fs.writeFileSync(OUT, JSON.stringify(arr, null, 2));
  console.log('Wrote sitemap pages:', OUT, 'pages:', pages);
}

main().catch(err => { console.error(err); process.exit(1) });
