import 'animate.css'
import 'virtual:windi.css'
import '~/styles/index.less'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import store from '~/store'
import router from '~/newTab/router'

import { init } from '~/newTab/core'

const head = createHead()

const app = createApp(App)
app.use(store)
app.use(router)
app.use(head)

app.mount('#app')

init()
