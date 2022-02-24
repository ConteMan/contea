import { drawFn, sign } from './modules/juejin'

(async() => {
  const cssUrl = browser.runtime.getURL('dist/contentScripts/style.css')
  const currentUrl = document.URL
  const extensionId = browser.runtime.id
  // eslint-disable-next-line no-console
  console.info(`[contea] > currentUrl, ${currentUrl}`)
  // eslint-disable-next-line no-console
  console.info(`[contea] > cssUrl: ${cssUrl}, id: ${extensionId}`)

  //
  let moduleType = ''
  const res: any = {}

  if (/.*juejin.cn.*/.test(currentUrl)) {
    moduleType = 'juejin'

    // 结果
    res.sign = await sign()
    res.draw = await drawFn()
  }
  else {
    moduleType = 'example'
  }

  const response = await browser.runtime.sendMessage(extensionId, { command: 'content-deal', param: { type: moduleType, url: currentUrl, res } })
  // eslint-disable-next-line no-console
  console.info(`[contea] > content-deal: ${JSON.stringify(response)}`)
})()
