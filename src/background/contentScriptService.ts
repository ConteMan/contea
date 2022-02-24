import configState from '~/models/keyValue/configState'

class ContentScriptService {
  async execScript() {
    const modules = await configState.getContentScript()
    if (!modules)
      return false

    for (let index = 0; index < modules.length; index++) {
      const res = await browser.windows.create({
        focused: false,
        height: 1,
        width: 1,
        left: 10,
        top: 10,
        type: 'popup',
        url: [
          modules[index]?.contentScript.url,
        ],
      })

      browser.tabs.executeScript(res?.tabs?.[0].id, {
        file: './dist/contentScripts/index.global.js',
        runAt: 'document_end',
      }).catch(error => console.error(error))
    }
    return true
  }

  async execScriptByModule(module: string) {
    const moduleInfo = await configState.getItem(module)
    if (!moduleInfo)
      return false

    const res = await browser.windows.create({
      focused: false,
      height: 1,
      width: 1,
      left: 10,
      top: 10,
      type: 'popup',
      url: [
        moduleInfo?.contentScript.url,
      ],
    })

    browser.tabs.executeScript(res?.tabs?.[0].id, {
      file: './dist/contentScripts/index.global.js',
      runAt: 'document_end',
    }).catch(error => console.error(error))

    return true
  }
}

export default new ContentScriptService()
