export default defineSitemapEventHandler(async(event) => {
  
  try {
    const page = parseInt(getQuery(event).page || '1', 10)
    const apiUrl = `https://api.juanutrisyon.info/api/sitemap-foods?page=${page}`

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const foods_response = await $fetch(apiUrl)

    // log in server console (NOT browser console)
    console.log('Foods response:', foods_response)

    if (!foods_response?.data) {
      console.log('API returned no data')
      return []
    }

    return foods_response.data.map((food) => ({
      loc: `https://app.juanutrisyon.info/food/${food.description_slug}`,
      lastmod: food.updated_at || new Date().toISOString(),
    }))
   

  } catch (err) {
    console.error('Error fetching foods for sitemap:', err)
    
    return [
     
    ]

  }

})
  