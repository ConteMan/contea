import { createApp } from 'vue'
import App from './views/App.vue'

(() => {
  const cssUrl = browser.runtime.getURL('dist/contentScripts/style.css')
  // eslint-disable-next-line no-console
  console.info(`[contea] > Hello world from content script, ${cssUrl}`)

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', cssUrl)
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root)
})()
