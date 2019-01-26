import React from 'react'
import Redirect from 'react-router/Redirect'

import Home from './components/Home'
import TS3List from './components/TS3List'
import TERA from './components/TERA'
import TS404Server from './components/TS404Server'
import About from './components/About'
import Contact from './components/Contact'

import RankingInfo from './components/AR/RankingInfo'
import EPList from './components/AR/EPList'
import FBTool from './components/AR/FBTool'

import NoMatch from './components/NoMatch'

import { maxDate } from './data/dataset'

import { asyncComponent } from 'react-async-component'

export const highscoresUrl = '/ranking/de/highscores'
export const crTopKillsIntervalUrl = '/ranking/chromerivals/topkillsinterval'

// TODO: Loading/Error comps, auch Chart
const AsyncARHighscores = asyncComponent({
  resolve: () => import('./containers/AR/Highscores')
})
const AsyncCrTopKillsInterval = asyncComponent({
  resolve: () => import('./containers/ChromeRivals/KillsInInterval')
})
const AsyncCrPlayerFame = asyncComponent({
  resolve: () => import('./containers/ChromeRivals/PlayerFameChart')
})

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
    component: EPList
  },
  {
    path: '/ranking/fbtool',
    component: FBTool
  },
  {
    path: highscoresUrl,
    exact: true,
    component: () => <Redirect to={highscoresUrl + '/' + maxDate} />
  },
  {
    path: highscoresUrl + '/:date(\\d{4}-\\d{2}-\\d{2})',
    component: AsyncARHighscores
  },
  {
    path: crTopKillsIntervalUrl,
    component: AsyncCrTopKillsInterval
  },
  {
    path: '/ranking/chromerivals/playerFame',
    component: AsyncCrPlayerFame
  },
  {
    component: NoMatch
  }
]

export default routes
