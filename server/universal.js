const path = require('path')
const fs = require('fs')

const React = require('react')
import { Helmet } from 'react-helmet'
const { Provider } = require('react-redux')
const { renderToString } = require('react-dom/server')
const { StaticRouter, matchPath } = require('react-router-dom')

const { default: configureStore } = require('../src/store')
const { default: App } = require('../src/containers/App')

const { default: routes } = require('../src/routes')

module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }
    const context = {}
    const store = configureStore()

    const requiredData = []
    // use `some` to imitate `<Switch>` behavior of selecting only
    // the first to match
    routes.some(route => {
      const match = matchPath(req.url, route)

      if (match && route.component && route.component.fetchData) {
        requiredData.push(route.component.fetchData(store, match))
      }

      return match
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
        redirect(301, context.url)
      } else {
        const helmet = Helmet.renderStatic()
        // we're good, send the response
        const RenderedApp = htmlData
          .replace('{{SSR}}', markup)
          .replace('{{WINDOW_DATA}}', JSON.stringify(store.getState()))
          .replace('{{HELMET_TITLE}}', helmet.title.toString())
          .replace('{{HELMET_META}}', helmet.meta.toString())

        res.status(context.statusCode || 200).send(RenderedApp)
      }
    })
  })
}
