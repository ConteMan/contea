<template>
  <div class="list-container">
    <div class="action-bar">
      <a-space>
        <span
          v-if="platform !== 'all'"
          class="login-status"
          :style="{ color: loginStatusColor }"
          :title="platformInfo.info.login"
          @click=goUrl(platformInfo.info.login)
        >
        {{ loginStatusText }}
        </span>
        <a-button
          v-if="showSync"
          icon="sync"
          size="small"
          shape="circle"
          :loading="syncLoading"
          @click="sync"
        />
      </a-space>
    </div>
    <div class="list-content-container">
      <div v-if="!activeData.length" class="empty-data">
        No Data
      </div>
      <div
        v-else
        class="list-content"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="200"
        infinite-scroll-immediate-check="true"
      >
        <template v-for="item in activeData">
          <div class="list-item" :key="item.info_id">
            <div v-if="item.platform_type === 'yuque_note'" class="yuque-note" v-html="item.info_detail.data.doclet.body"></div>

            <div v-if="item.platform === 'flomo'" v-html="item.content"></div>

            <div v-if="item.platform_type === 'zhihu_activity'">
              <p>{{ item.action_text }}</p>
              <p>{{ item.target.excerpt }}</p>
            </div>

            <div v-if="item.platform_type === 'jike_activity'">
              <p>{{ item.content }}</p>
              <template v-for="picture in item.pictures">
                <img class="item-pic" :key="picture.picUrl" :src="picture.picUrl" />
              </template>
            </div>

            <div class="info">
              <span class="time">{{ $dayjs.unix(item.info_created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
              <span class="platform-type">{{ platformTypeText(item.platform_type) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import infiniteScroll from 'vue-infinite-scroll'

const platformTypes = {
  yuque_note: '语雀小记',
  zhihu_collection: '知乎收藏',
  zhihu_activity: '知乎动态',
  jike_activity: '即刻动态',
  flomo_memo: 'Flomo memo',
}

export default {
  name: 'List',
  directives: {
    infiniteScroll
  },
  data() {
    return {
      busy: false,

      platform: '',
      offset: 0,
      pageSize: 20,

      data: [],
      syncLoading: false,
      platformInfo: {
        loginStatus: 0,
        info: {},
      },
    }
  },
  computed: {
    activeData: function() {
      return this.data.length > 0 ? this.data : []
    },
    loginStatusColor: function() {
      return this.platformInfo.loginStatus ? 'brown' : 'grey'
    },
    loginStatusText: function() {
      return this.platformInfo.loginStatus ? '已登录' : '去登录'
    },
    showSync: function() {
      return this.platform !== 'all' && this.platformInfo.loginStatus === 1
    }
  },
  watch: {
    $route(to, from) {
      this.platform = this.$route.params.platform
      this.init()
      this.list()
      this.getPlatformInfo()
    }
  },
  methods: {
    init() {
      this.offset = 0
      this.pageSize = 20
      this.data = []
    },
    async list() {
      this.busy = true
      const { platform, offset, pageSize } = this
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'getList', params: { platform, offset, pageSize }}, (response) => {
        if (response.data.length > 0) {
          this.data = _.concat(this.data, response.data)
          this.busy = false
        } else {
          this.busy = true
        }
        return true
      })
    },
    loadMore() {
      this.offset += this.pageSize
      this.list()
    },
    // 同步数据
    async sync() {
      this.syncLoading = true
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'syncInfo', params: { platforms: [this.platform] }}, (response) => {
        this.syncLoading = false
        this.$message.success('同步成功')
        this.init()
        this.list()
        this.getPlatformInfo()
        return true
      })
    },
    // 登录检测
    async getPlatformInfo() {
      if (this.platform === 'all') {
        return false
      }
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'getPlatformInfo', params: { platforms: [this.platform] }}, (response) => {
        this.platformInfo = response.data[this.platform]
        return true
      })
    },
    // 消息类型描述转换
    platformTypeText(platformType) {
      return platformTypes[platformType] ? platformTypes[platformType] : ''
    },
    goUrl(url) {
      window.open(url, '_blank')
    }
  },
  async mounted() {
    this.platform = this.$route.params.platform
    this.list()
    this.getPlatformInfo()
  }
}
</script>

<style scoped lang="less">
@border-grey: rgba(206, 206, 206, 0.4);
@font-grey: rgba(206, 206, 206, 0.6);

.list-container {
  .action-bar {
    height: 50px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    border-bottom: 1px solid @border-grey;
    .login-status {
      font-size: 12px;
      cursor: pointer;
    }
  }
  .list-content-container {
    height: calc(100vh - 50px);
    overflow-y: auto;
    scroll-behavior: smooth;
    display: flex;
    justify-content: center;
    align-items: center;
    &::-webkit-scrollbar {
      display: none;
    }
    .list-content {
      margin: auto;
      .list-item {
        border-bottom: 1px solid @border-grey;
        padding: 8px;
        &:hover {
          background-color: @border-grey;
        }
        .info {
          text-align: right;
          color: @font-grey;
          font-size: 12px;
          padding: 4px 0 0 0;
          .time {
            margin-right: 8px;
          }
        }
        /deep/
        .image, // 语雀图片
        .item-pic
        {
          max-width: 100% !important;
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
