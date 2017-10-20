import React from 'react'
import { Redirect } from 'react-router'

import Home from './components/Home'
import TS3List from './components/TS3List'
import TS404Server from './components/TS404Server'
import About from './components/About'
import Contact from './components/Contact'

import EPList from './components/AR/EPList'

import NoMatch from './components/NoMatch'

import { maxDate } from './data/dataset'

export const highscoresUrl = '/ranking/de/highscores'

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
  // TODO: Ranking Info page: Methodik, Datenbestand, Motivation, etc.
  {
    path: '/ranking/eplist',
    component: EPList
  },
  {
    path: highscoresUrl,
    exact: true,
    component: () => <Redirect to={highscoresUrl + '/' + maxDate} />
  },
  {
    component: NoMatch
  }
]

export default routes
