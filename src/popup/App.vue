<template>
  <div>
    <div class="copy" @click="copyInfo($event)">复制页面链接</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      article: {
        title: '',
        link: '',
        description: '',
      },
    };
  },
  methods: {
    copy(text) {
      const transfer = document.createElement('input');
      document.body.appendChild(transfer);
      transfer.value = text; // 这里表示想要复制的内容
      transfer.focus();
      transfer.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      transfer.blur();
      document.body.removeChild(transfer);
    },
    async copyInfo(event) {
      const host = this;
      // 获取当前窗口 id
      // eslint-disable-next-line no-undef
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        const tabId = tabs.length ? tabs[0].id : null;
        host.tabid = tabId;
        // 向当前页面注入 JavaScript 脚本
        // eslint-disable-next-line no-undef
        chrome.tabs.executeScript(tabId || null, {
          file: './script/content.js'
        }, function() {
          // 向目标网页进行通信，向 content.js 发送一个消息
          // eslint-disable-next-line no-undef
          chrome.tabs.sendMessage(tabId, {
            message: 'GET_TOPIC_INFO',
          }, function(response) {
            host.response = response;
            // 获取到返回的文章 title 、url、description
            host.article.title = response.title;
            host.article.link = response.link;
            host.article.description = response.description;
            const copyValue = '[' + response.title + '](' + response.link + ')';
            host.copy(copyValue);
          });
        });
      });
    }
  },
};
</script>

<style lang="less">
html {
  width: 400px;
  height: 400px;
  .copy {
    width: 100;
    padding: 16px;
    text-align: center;
    &:hover{
      cursor: pointer;
      background: rgb(226, 225, 225);
    }
  }
}
</style>
