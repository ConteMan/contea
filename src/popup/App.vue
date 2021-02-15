<template>
  <div>
    <div>{{ article.title }}</div>
    <div>{{ article.link }}</div>
    <div>{{ article.description }}</div>
    <div>{{ tabid }}</div>
    <button ref="copy" class="copy" @mouseenter="copy" @click="copy">复制页面链接</button>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  name: 'App',
  data() {
    return {
      article: {
        title: '',
        link: '',
        description: '',
      },
      tabid: null,
      copyValue: '111',
      clipboard: null,
    }
  },
  methods: {
    async copy() {
      const host = this
      // 获取当前窗口 id
      // eslint-disable-next-line no-undef
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        const tabId = tabs.length ? tabs[0].id : null
        console.log('tabId', tabId)
        host.tabid = tabId
        // 向当前页面注入 JavaScript 脚本
        // eslint-disable-next-line no-undef
        chrome.tabs.executeScript(tabId || null, {
          file: './script/content.js'
        }, function() {
          // 向目标网页进行通信，向 recommend.js 发送一个消息
          // eslint-disable-next-line no-undef
          chrome.tabs.sendMessage(tabId, {
            message: 'GET_TOPIC_INFO',
          }, function(response) {
            host.response = response
            // 获取到返回的文章 title 、url、description
            host.article.title = response.title
            host.article.link = response.link
            host.article.description = response.description
            const copyValue = '[' + response.title + '](' + response.link + ')'
            host.copyValue = copyValue
            host.clipboard = new Clipboard(host.$refs.copy, {
              text: function() {
                return copyValue
              }
            })
            return true
          })
        })
      })
    }
  },
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
