import 'uno.css'
import '@styles/index.less'

import { createApp } from 'vue'
// import { MESSAGE_TYPES } from '@enums/index'
import App from './views/App.vue'

// import { drawFn, sign } from './modules/juejin'

(() => {
  const cssUrl = browser.runtime.getURL('dist/contentScripts/style.css')
  const currentUrl = document.URL
  const extensionId = browser.runtime.id
  // eslint-disable-next-line no-console
  console.info(`[contea] > currentUrl, ${extensionId} ${currentUrl}`)

  // mount component to context window
  const container = document.createElement('div')
  container.setAttribute('class', 'contea-content-script')
  container.setAttribute('id', 'contea-content-script')
  const root = document.createElement('div')
  root.setAttribute('id', 'contea-root')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  const shadowDOM = container.attachShadow?.({ mode: 'open' }) || container
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', cssUrl)
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)

  document.documentElement.append(container)

  // const scriptEl = document.createElement('script')
  // const scriptUrl = browser.runtime.getURL('dist/contentScripts/index.global.js')
  // scriptEl.setAttribute('src', scriptUrl)
  // scriptEl.setAttribute('type', 'application/javascript')
  // document.head.append(scriptEl)

  createApp(App).mount(root)

  // let moduleType
  // if (/.*juejin.cn.*/.test(currentUrl)) {
  //   const res: any = {}
  //   moduleType = 'juejin'

  //   // 结果
  //   res.sign = await sign()
  //   res.draw = await drawFn()

  //   const response = await browser.runtime.sendMessage(extensionId, { type: MESSAGE_TYPES.DEAL_CONTENT_SCRIPT, data: { type: moduleType, url: currentUrl, res } })
  //   // eslint-disable-next-line no-console
  //   console.info(`[contea] > content-deal: ${JSON.stringify(response)}`)
  // }
})()
