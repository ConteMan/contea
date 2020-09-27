<template>
  <div>
    <a-card :hoverable="true">
      <a-card-meta title="Card title" description="This is the description">
        <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </a-card-meta>
      <div>
        {{ sspai }}
      </div>
    </a-card>
    <a-card :hoverable="true">
      <a-card-meta title="Card title" description="This is the description">
        <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
      </a-card-meta>
      <div>
        {{ zhihu }}
      </div>
    </a-card>
    <div>
      <a-button @click="sendMessage('sspai')"> 少数派 </a-button>
      <a-button @click="sendMessage('zhihu')"> 知乎 </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Show",
  data() {
    return {
      sspai: {},
      zhihu: {},
    }
  },
  methods: {
    sendMessage(type) {
      let _this = this
      let port = chrome.runtime.connect({name: "bgConnect"});
      port.postMessage({'type': type});
      port.onMessage.addListener(function(msg) {
        if (msg.type === type){
          console.log(msg)
          _this[type] = msg.data;
        }
      });
      // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      //   console.log(response.sspai);
      // });
    }
  },
}
</script>

<style scoped>

</style>
