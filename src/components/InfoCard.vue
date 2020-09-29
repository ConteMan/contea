<template>
  <div class="info-card">
    <a-row type="flex" :gutter="[8]">
      <a-col flex="240px">
        <div class="bg-gray-100 header">
          <a-avatar shape="square" icon="user" :style="{ verticalAlign: 'middle' }"/>
          <span class="site-name" :style="{ verticalAlign: 'middle' }">{{ data.site.name }}</span>
        </div>
        <div class="bg-gray-100 detail">Detail</div>
      </a-col>
      <a-col flex="auto">
        <div class="bg-gray-100 content">
          Content
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
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
    }
    .content {
      height: 240px;
    }
  }
</style>
