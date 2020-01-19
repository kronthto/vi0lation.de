require('ignore-styles')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const favicon = require('serve-favicon')

require('@babel/register')({
  ignore: [/\/(build|node_modules)\//],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties'
  ]
})

// routes
const universalLoader = require('./universal')
const { indexhtmlDirect } = require('./indexhtml')

const app = express()

// Server favicon before to not show up in logs
//app.use(favicon(path.join(__dirname, '../build', 'icon.png')))

// Setup logger
app.use(morgan('combined'))

// Send a version of index.html that is stripped of placeholders. The service-worker requests this file directly.
app.use('/index.html', (req, res) => {
  indexhtmlDirect.then(htmlData => {
    res.send(htmlData)
  })
})

// Server JS/CSS Bundle with Cache-Control
app.use(
  '/static',
  express.static(path.resolve(__dirname, '..', 'build/static'), {
    maxAge: '30d'
  })
)

// Server manifest with cache headers
app.use('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'manifest.json'), {
    maxAge: '1d'
  })
})

// Serve static assets
app.use(
  express.static(path.resolve(__dirname, '..', 'build'), { index: false })
)

// Always return the main index.html, so react-router render the route in the client
app.use('/', universalLoader)

module.exports = app
