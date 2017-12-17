import Vue from 'vue'
import VueRouter from 'vue-router'

import Config from './pages/config/Index.vue'
import DanmakuConfig from './pages/config/Danmaku.vue'
import UserConfig from './pages/config/User.vue'
import History from './pages/history/Index.vue'
import Music from './pages/music/Index.vue'
import Lottery from './pages/lottery/Index.vue'
import Statistic from './pages/statistic/Index.vue'
import Help from './pages/help/Index.vue'
import About from './pages/help/About.vue'
import Privacy from './pages/help/Privacy.vue'
import GameAnchor from './pages/help/GameAnchor.vue'
import SingerAnchor from './pages/help/SingerAnchor.vue'
// import OtakuAnchor from './pages/help/OtakuAnchor.vue'
import WindowsUser from './pages/help/WindowsUser.vue'
// import MacUser from './pages/help/MacUser.vue'
import LinuxUser from './pages/help/LinuxUser.vue'

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
        }
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
      path: '/lottery',
      component: Lottery
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
        },
        {
          path: 'game',
          component: GameAnchor
        },
        {
          path: 'singer',
          component: SingerAnchor
        },
        // {
        //   path: 'otaku',
        //   component: OtakuAnchor
        // },
        {
          path: 'windows',
          component: WindowsUser
        },
        // {
        //   path: 'mac',
        //   component: MacUser
        // },
        {
          path: 'linux',
          component: LinuxUser
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
