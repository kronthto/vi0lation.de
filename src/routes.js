import FirstPage from './containers/FirstPage'
import PostsApiPage from './containers/PostsApiPage'
import PostComments from './containers/PostComments'

import NoMatch from './components/NoMatch'

const routes = [
  {
    path: '/',
    exact: true,
    component: FirstPage
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
