import {
  AsyncComponentProvider,
  createAsyncContext
} from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import serialize from 'serialize-javascript'

const React = require('react')
const { Helmet } = require('react-helmet')
const { Provider } = require('react-redux')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')

const { default: configureStore } = require('../src/store')
const { default: App } = require('../src/containers/App')

// const HugeStores = []

const { getStoreData, saveStoreData } = require('./PersistentStoreData')
const { indexhtmlPromise } = require('./indexhtml')

module.exports = function universalLoader(req, res, next) {
  const errorCB = e => next(e)

  indexhtmlPromise
    .then(htmlData => {
      const context = {}
      const store = configureStore(getStoreData())

      const asyncContext = createAsyncContext()

      const app = (
        <AsyncComponentProvider asyncContext={asyncContext}>
          <Provider store={store}>
            <StaticRouter location={req.url} context={context}>
              <App />
            </StaticRouter>
          </Provider>
        </AsyncComponentProvider>
      )

      asyncBootstrapper(app)
        .then(() => {
          const markup = renderToString(app)

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
              // .replace('{{WINDOW_DATA}}', serialize(storeForClient)) // TODO: Pass data, but only highscores for current page to prevent deleting and rebuilding the table
              .replace(
                '{{HELMET_HEAD}}',
                helmet.title.toString() +
                  helmet.meta.toString() +
                  helmet.link.toString()
              )
              .replace(
                '{{ASYNC_COMPONENTS_STATE}}',
                serialize(asyncContext.getState())
              )

            res.status(context.statusCode || 200).send(RenderedApp)

            // Persist the store data (API Results) for the next request
            saveStoreData(store.getState())
          }
        })
        .catch(errorCB)
    })
    .catch(errorCB)
}
