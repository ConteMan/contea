import 'virtual:windi.css'
import '~/styles/index.less'

import { createApp } from 'vue'
import App from './Popup.vue'
import store from '~/store'

const app = createApp(App)
app.use(store)
app.mount('#app')
