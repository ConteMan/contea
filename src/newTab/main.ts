import 'virtual:windi.css'
import '~/styles/index.less'

import { createApp } from 'vue'
import App from './App.vue'
import store from '~/store'
import router from '~/newTab/router'

import { init } from '~/newTab/core'

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

init()
