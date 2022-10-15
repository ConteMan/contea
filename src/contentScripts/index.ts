import { createApp } from 'vue'
import { MESSAGE_TYPES } from '@enums/index'
import App from './views/App.vue'

import { drawFn, sign } from './modules/juejin'

(async () => {
  const cssUrl = browser.runtime.getURL('dist/contentScripts/style.css')
  const currentUrl = document.URL
  const extensionId = browser.runtime.id
  // eslint-disable-next-line no-console
  console.info(`[contea] > currentUrl, ${currentUrl}`)

  // mount component to context window
  const container = document.createElement('div')
  container.setAttribute('class', 'contea-content-script')
  const root = document.createElement('div')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', cssUrl)
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.append(container)
  createApp(App).mount(root)

  let moduleType
  if (/.*juejin.cn.*/.test(currentUrl)) {
    const res: any = {}
    moduleType = 'juejin'

    // 结果
    res.sign = await sign()
    res.draw = await drawFn()

    const response = await browser.runtime.sendMessage(extensionId, { type: MESSAGE_TYPES.DEAL_CONTENT_SCRIPT, data: { type: moduleType, url: currentUrl, res } })
    // eslint-disable-next-line no-console
    console.info(`[contea] > content-deal: ${JSON.stringify(response)}`)
  }
})()
