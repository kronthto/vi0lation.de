import Home from './components/Home'
import PostsApiPage from './containers/PostsApiPage'
import PostComments from './containers/PostComments'

import NoMatch from './components/NoMatch'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/posts',
    component: PostsApiPage,
    routes: [
      {
        path: '/posts/withcommentsfor/:id',
        component: PostComments
      }
    ]
  },
  {
    component: NoMatch
  }
]

export default routes
