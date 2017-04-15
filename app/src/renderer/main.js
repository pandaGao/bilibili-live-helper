import Vue from 'vue'
import Electron from 'vue-electron'

import App from './App'

Vue.use(Electron)
Vue.config.debug = true

/* eslint-disable no-new */
new Vue(App).$mount('#app')
