const path = require('path')
const fs = require('fs')

const React = require('react')
const { Helmet } = require('react-helmet')
const { Provider } = require('react-redux')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { matchRoutes } = require('react-router-config')

const { default: configureStore } = require('../src/store')
const { default: App } = require('../src/containers/App')

const { default: routes } = require('../src/routes')

const HugeStores = []

const { getStoreData, saveStoreData } = require('./PersistentStoreData')

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const context = {}
    const store = configureStore(getStoreData())

    const requiredData = []
    const branch = matchRoutes(routes, req.url)
    branch.forEach(({ route, match }) => {
      if (route.component && route.component.fetchData) {
        requiredData.push(route.component.fetchData(store, match))
      }
    })

    Promise.all(requiredData).then(() => {
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      )

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url)
      } else {
        const helmet = Helmet.renderStatic()

        let storeForClient = store.getState()
        let storeToPersist = Object.assign({}, storeForClient)

        // Remove some really big blobs. The client should rather refetch that, so the document we deliver isn't that huge.
        // But we want them persisted serverside.
        HugeStores.forEach(key => delete storeForClient[key])

        // we're good, send the response
        const RenderedApp = htmlData
          .replace('{{SSR}}', markup)
          .replace('{{WINDOW_DATA}}', JSON.stringify(storeForClient))
          .replace('{{HELMET_TITLE}}', helmet.title.toString())
          .replace('{{HELMET_META}}', helmet.meta.toString())

        res.status(context.statusCode || 200).send(RenderedApp)

        // Persist the store data (API Results) for the next request
        saveStoreData(storeToPersist)
      }
    })
  })
}
