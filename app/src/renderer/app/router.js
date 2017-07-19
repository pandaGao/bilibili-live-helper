import Vue from 'vue'
import VueRouter from 'vue-router'

import Config from './pages/config/Index.vue'
import DanmakuConfig from './pages/config/Danmaku.vue'
import UserConfig from './pages/config/User.vue'
import History from './pages/history/Index.vue'
import Music from './pages/music/Index.vue'
import Statistic from './pages/statistic/Index.vue'
import Help from './pages/help/Index.vue'
import About from './pages/help/About.vue'
import Privacy from './pages/help/Privacy.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/config'
    },
    {
      path: '/config',
      component: Config,
      children: [
        {
          path: '',
          redirect: '/config/danmaku'
        },
        {
          path: 'danmaku',
          component: DanmakuConfig
        },
        {
          path: 'user',
          component: UserConfig
        },
      ]
    },
    {
      path: '/history',
      component: History
    },
    {
      path: '/music',
      component: Music
    },
    {
      path: '/statistic',
      component: Statistic
    },
    {
      path: '/help',
      component: Help,
      children: [
        {
          path: '',
          redirect: '/help/about'
        },
        {
          path: 'about',
          component: About
        },
        {
          path: 'privacy',
          component: Privacy
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
