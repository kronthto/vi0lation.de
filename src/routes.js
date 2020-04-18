import React from 'react'

import Home from './components/Home'

import NoMatch from './components/NoMatch'

import lazyImport from './utils/lazyImportHack'
import { asyncComponent } from 'react-async-component'
import LoadBlock from './components/LoadBlock'

export const crTopKillsIntervalUrl = '/killsBetween'

const LoadingComponent = () => <LoadBlock height="220px" />

const makeAsync = resolve => {
  return asyncComponent({
    resolve,
    LoadingComponent
  })
}

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/statcalc',
    component: makeAsync(() => lazyImport(import('./components/AR/StatCalc')))
  },
  {
    path: '/weaponcalc',
    component: makeAsync(() => lazyImport(import('./components/AR/WeaponCalc')))
  },
  {
    path: crTopKillsIntervalUrl,
    component: makeAsync(() =>
      lazyImport(import('./containers/ChromeRivals/KillsInInterval'))
    )
  },
  {
    path: '/topLists',
    component: makeAsync(() =>
      lazyImport(import('./containers/ChromeRivals/TopLists'))
    )
  },
  {
    path: '/fameChart',
    component: makeAsync(() =>
      lazyImport(import('./containers/ChromeRivals/PlayerFameChart'))
    )
  },
  {
    path: '/usercount',
    component: makeAsync(() =>
      lazyImport(import('./containers/ChromeRivals/OnlineCount'))
    )
  },
  {
    path: '/events',
    component: makeAsync(() => lazyImport(import('./components/PushSub')))
  },
  {
    component: NoMatch
  }
]

export default routes
