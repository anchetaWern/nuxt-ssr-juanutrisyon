import { $fetch } from 'ofetch'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineNitroPlugin(async (nitro) => {
  const sitemaps = [
    'https://api.juanutrisyon.info/sitemaps/sitemap-foods-1.xml',
    'https://api.juanutrisyon.info/sitemaps/sitemap-foods-2.xml',
    'https://api.juanutrisyon.info/sitemaps/sitemap-foods-3.xml',
    'https://api.juanutrisyon.info/sitemaps/sitemap-static.xml'
  ]

  for (const url of sitemaps) {
    const content = await $fetch(url)
    const filename = url.split('/').pop()
    const outPath = join(nitro.options.output.publicDir, 'sitemaps', filename)
    await writeFile(outPath, content, 'utf8')
  }
})
