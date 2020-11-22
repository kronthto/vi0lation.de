import React, { Component } from 'react'
import Redirect from 'react-router/Redirect'

import Home from './components/Home'
import TS3List from './components/TS3List'
import TERA from './components/TERA'
import TS404Server from './components/TS404Server'
import About from './components/About'
import Contact from './components/Contact'

import RankingInfo from './components/AR/RankingInfo'

import NoMatch from './components/NoMatch'

import { maxDate } from './data/dataset'

import lazyImport from './utils/lazyImportHack'
import { asyncComponent } from 'react-async-component'
import LoadBlock from './components/LoadBlock'
import { withRouter } from 'react-router-dom'
import { isBrowser } from './utils/env'
import PropTypes from 'prop-types'

export const highscoresUrl = '/ranking/de/highscores'
const crTopKillsIntervalUrl = '/ranking/chromerivals/topkillsinterval'

const LoadingComponent = () => <LoadBlock height="220px" />

const makeAsync = resolve => {
  return asyncComponent({
    resolve,
    LoadingComponent
  })
}

class ExternalRedirectClass extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      staticContext: PropTypes.object
    }).isRequired
  }

  render() {
    let newUrl = this.props.target + this.props.location.search

    if (this.props.location.hash) {
      newUrl = newUrl + '#' + this.props.location.hash
    }

    if (this.context.router.staticContext) {
      this.context.router.staticContext.statusCode = 301
      this.context.router.staticContext.url = newUrl
    }

    if (isBrowser) {
      window.location.href = newUrl
    }

    return null
  }
}

const ExternalRedirectComponent = withRouter(ExternalRedirectClass)

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/ts3',
    component: TS3List
  },
  {
    path: '/tera',
    component: TERA
  },
  {
    path: '/404server',
    component: TS404Server
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/ranking',
    exact: true,
    component: RankingInfo
  },
  {
    path: '/ranking/eplist',
    component: makeAsync(() => lazyImport(import('./components/AR/EPList')))
  },
  {
    path: '/ranking/fbtool',
    component: makeAsync(() => lazyImport(import('./components/AR/FBTool')))
  },
  {
    path: '/ranking/statcalc',
    component: makeAsync(() => lazyImport(import('./components/AR/StatCalc')))
  },
  {
    path: highscoresUrl,
    exact: true,
    component: () => <Redirect to={highscoresUrl + '/' + maxDate} />
  },
  {
    path: highscoresUrl + '/:date(\\d{4}-\\d{2}-\\d{2})',
    component: makeAsync(() => lazyImport(import('./containers/AR/Highscores')))
  },
  {
    path: crTopKillsIntervalUrl,
    component: () => (
      <ExternalRedirectComponent target="https://cr.vi0.de/killsBetween" />
    )
  },
  {
    path: '/ranking/chromerivals/playerFame',
    component: () => (
      <ExternalRedirectComponent target="https://cr.vi0.de/fameChart" />
    )
  },
  {
    path: '/ranking/chromerivals/usercount',
    component: () => (
      <ExternalRedirectComponent target="https://cr.vi0.de/usercount" />
    )
  },
  {
    component: NoMatch
  }
]

export default routes
