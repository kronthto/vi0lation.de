import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import configureStore from './store'
import './style/bulma.css'
import './index.css'
import HydratedAppProvider from './containers/HydratedAppProvider'
import ScrollToTop from './components/ScrollToTop'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

// If provided by server, use it, else let the reducers handle initial state
const initialState = window.DATA ? window.DATA : {}
const store = configureStore(initialState)

ReactDOM.hydrate(
   <HydratedAppProvider store={store}>
     <BrowserRouter>
       <ScrollToTop>
         <App />
       </ScrollToTop>
     </BrowserRouter>
   </HydratedAppProvider>,
  document.getElementById('root')
)
registerServiceWorker()
