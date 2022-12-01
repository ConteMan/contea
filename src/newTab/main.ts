import 'animate.css'
import 'virtual:windi.css'
import '@styles/index.less'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import store from './store/default'
import router from './router'

import { init } from './core'

const head = createHead()

const app = createApp(App)
app.use(store)
app.use(router)
app.use(head)

app.mount('#app')

app.config.errorHandler = (err, instance, info) => {
  // eslint-disable-next-line no-console
  console.log('[ unhand error with app.config.errorHandler ] >', err, instance, info)
}

init()
