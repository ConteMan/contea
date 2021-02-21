import Vue from 'vue'
import App from './App.vue'
import router from './router'

import dayjs from 'dayjs'
import '../core/lazy_use'

Vue.config.productionTip = false

Vue.prototype.$dayjs = dayjs

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
