import FirstPage from './containers/FirstPage'
import PostsApiPage from './containers/PostsApiPage'

const routes = [
  {
    path: '/',
    exact: true,
    component: FirstPage
  },
  {
    path: '/posts',
    component: PostsApiPage
  }
]

export default routes
