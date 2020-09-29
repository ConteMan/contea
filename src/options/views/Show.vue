<template>
  <div class="container">
    <div class="header">
      <span class="title">InfoHub</span>
    </div>
    <div class="content">
        <info-card class="card-space"></info-card>
        <info-card class="card-space"></info-card>
    </div>
  </div>
</template>

<script>
import InfoCard from "@/components/InfoCard"

export default {
  name: "Show",
  components: {
    InfoCard
  },
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
    }
  },
}
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    padding: 24px 32px 0 32px;
    .title {
      color: rgba(197, 48, 48, 1);
      font-size: 36px;
      line-height: 150%;
    }
    .content {
      width: 100%;
      margin-top: 16px;
      .card-space {
        margin-bottom: 16px;
      }
    }
  }
</style>
