import React from 'react'

import Home from './components/Home'

import NoMatch from './components/NoMatch'

import lazyImport from './utils/lazyImportHack'
import { asyncComponent } from './vendor/react-async-component'
import LoadBlock from './components/LoadBlock'

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
    component: NoMatch
  }
]

export default routes
