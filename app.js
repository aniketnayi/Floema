require('dotenv').config();

const logger = require('morgan');
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


const app = express()
const path = require('path')
const port = 3000

const prismic = require('@prismicio/client')
// const prismicH = require('@prismicio/helpers');
const { create } = require('domain');
const console = require('console');
const UAParser = require('ua-parser-js')
// const { response } = require('express')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

// Initialize the prismic.io api
const initApi = req => {
      return prismic.createClient(process.env.PRISMIC_ENDPOINT, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        req
      })
}

// Link Resolver
const handleLinkResolver = doc => {

  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }


   // Default to homepage
  return '/'
 }
 


 // Middleware to inject prismic context
app.use((req, res, next) => {
    
    const ua = UAParser(req.headers['user-agent'])

    res.locals.isDesktop = ua.device.type === undefined
    res.locals.isPhone = ua.device.type === 'mobile'
    res.locals.isTablet = ua.device.type === 'tablet'

    // console.log(res.locals.isDesktop,res.locals.isPhone,res.locals.isTablet)  
    res.locals.Link = handleLinkResolver
    res.locals.prismic = prismic
    res.locals.Numbers = index => {
      return  index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : ''; 
    }


    next()

})


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


const handleRequest = async (api) => {
  const about = await api.getSingle('about')
  const home = await api.getSingle('home')
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  const collections = await api.getAllByType('collection',{
    fetchLinks: 'product.image'
  })

  const assets = []

  home.data.gallery.forEach(item => {
    assets.push(item.image.url)
  });

  about.data.gallery.forEach(item => {
    assets.push(item.image.url)
  });

  about.data.body.forEach(section => {
    if (section.slice_type === "gallery")
    {
      section.items.forEach(item =>{
        assets.push(item.image.url)
      })
    }
  });
  

  collections.forEach(collectionz => {
    
    collectionz.data.products.forEach(item => {
      assets.push(item.products_product.data.image.url)
    });
  
  });
 

  return{
    about,
    assets,
    collections,
    home,
    meta,
    navigation,
    preloader
  }

}


app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/home',{
    ...defaults,
    
  })
})

app.get('/about', async (req, res) => {

  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/about',{
    ...defaults
  })
})

app.get('/collections',async (req, res) => {
  
  
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  
  res.render('pages/collections',{
    ...defaults
    
  })
})

app.get('/detail/:uid', async (req, res) => {
  
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const product = await api.getByUID('product', req.params.uid,{
    fetchLinks: 'collection.title'
  })
  
  res.render('pages/detail',{
    ...defaults,
    product
    
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})