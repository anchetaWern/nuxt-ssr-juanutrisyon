export default defineSitemapEventHandler(() => {
    return [
      { loc: '/', lastmod: new Date().toISOString() },
      { loc: '/login', lastmod: new Date().toISOString() },
      { loc: '/register', lastmod: new Date().toISOString() },
      { loc: '/search', lastmod: new Date().toISOString() },
      { loc: '/recipe', lastmod: new Date().toISOString() },
      { loc: '/analyze', lastmod: new Date().toISOString() },
      { loc: '/ai', lastmod: new Date().toISOString() },
    ]
  })
  