const React = require('react')
const { Helmet } = require('react-helmet')
const { Provider } = require('react-redux')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { matchRoutes } = require('react-router-config')

const { default: configureStore } = require('../src/store')
const { default: App } = require('../src/containers/App')

const { default: routes } = require('../src/routes')

// const HugeStores = []

const { getStoreData, saveStoreData } = require('./PersistentStoreData')
const { indexhtmlPromise } = require('./indexhtml')

module.exports = function universalLoader(req, res) {
  indexhtmlPromise.then(htmlData => {
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
        res.redirect(context.statusCode || 302, context.url)
      } else {
        const helmet = Helmet.renderStatic()

        // let storeForClient = store.getState()
        // let storeToPersist = Object.assign({}, storeForClient)

        // Remove some really big blobs. The client should rather refetch that, so the document we deliver isn't that huge.
        // But we want them persisted serverside.
        // HugeStores.forEach(key => delete storeForClient[key])

        // we're good, send the response
        const RenderedApp = htmlData
          .replace('{{SSR}}', markup)
          // .replace('{{WINDOW_DATA}}', JSON.stringify(storeForClient)) // TODO: Pass data, but only highscores for current page to prevent deleting and rebuilding the table
          .replace(
            '{{HELMET_HEAD}}',
            helmet.title.toString() +
              helmet.meta.toString() +
              helmet.link.toString()
          )

        res.status(context.statusCode || 200).send(RenderedApp)

        // Persist the store data (API Results) for the next request
        saveStoreData(store.getState())
      }
    })
  })
}
