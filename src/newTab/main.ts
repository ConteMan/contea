import 'vue3-drr-grid-layout/dist/style.css'
import 'animate.css'
import 'virtual:windi.css'
import '@styles/index.less'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import GridLayout from 'vue3-drr-grid-layout'
import App from './App.vue'
import store from './store/default'
import router from './router'

import { init } from './core'

const head = createHead()

const app = createApp(App)
app.use(store)
app.use(router)
app.use(head)
app.use(GridLayout)

app.mount('#app')

init()
