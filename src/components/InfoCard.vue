<template>
  <div class="info-card">
    <a-skeleton class="skeleton" :loading="loading" :avatar="false" :title="false" active :paragraph="{rows: 6, width:['100%', '60%', '60%', '100%', '100%', '100%']}" >
    </a-skeleton>
    <a-row v-if="!loading" class="flex-no-wrap" type="flex" :gutter="[8]">
      <a-col flex="240px">
        <div class="bg-gray-100 header">
          <a-avatar shape="square" icon="user" :style="{ verticalAlign: 'middle' }"/>
          <span class="site-name" :style="{ verticalAlign: 'middle' }">{{ data.site.name }}</span>
        </div>
        <div class="bg-gray-100 detail">
          <json-list :data="data.user" :depth="0"/>
        </div>
      </a-col>
      <a-col flex="auto">
        <div class="bg-gray-100 content">
          <json-list :data="data.detail" :depth="0"/>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import JsonList from "@/components/JsonList"

export default {
  name: "InfoCard",
  components: {
    JsonList,
  },
  props: {
    loading : {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      default: function () {
        return {
          site: {
            name: '少数派',
            url: 'https://sspai.com'
          },
          user: {},
          detail: {},
        };
      }
    }
  },

}
</script>

<style scoped lang="less">
  .bg-gray-100 {
    background-color: rgba(247, 250, 252, 1);
    padding: 8px 16px;
  }
  .info-card {
    width: 100%;
    .flex-no-wrap {
      flex-flow: nowrap;
    }
    .header {
      height: 80px;
      display: flex;
      align-items: center;
      .site-name {
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-left: 8px;
      }
    }
    .detail {
      height: 152px;
      margin-top: 8px;
      word-break: break-all;
      overflow-y: scroll;
    }
    .content {
      height: 240px;
      word-break: break-all;
      overflow-y: scroll;
    }
  }
</style>
