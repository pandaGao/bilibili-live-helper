import Vue from 'vue'
import Electron from 'vue-electron'

import App from './App.vue'

Vue.use(Electron)
Vue.config.debug = true

new Vue({
  components: { App },
  render (createElement) {
    return createElement(App)
  }
}).$mount('#app')
