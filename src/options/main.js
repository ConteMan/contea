import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/antd.css'

import dayjs from 'dayjs'

Vue.config.productionTip = false

Vue.use(Antd)

Vue.prototype.$dayjs = dayjs

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
