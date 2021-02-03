<template>
  <div class="sidebar-container">
    <div
      class="home"
      @click="turnTo({ path: '/list'})"
    >
      <img class="logo" title="Contea" src="../../assets/logo.png"/>
    </div>
    <div class="nav">
      <template v-for="item in platforms">
        <div
          class="sidebar-item"
          :class="{ 'active': item.platform === platform }"
          :title="item.name"
          :key="item.platform"
          @click="changePlatform(item.platform)"
        >
          <a-avatar v-if="item.platform === 'all'" size="small">ALL</a-avatar>
          <a-avatar v-else :size="24" :src="item.icon"/>
        </div>
      </template>
    </div>
    <div class="setting">
      <a-icon
        type="setting"
        @click="turnTo({ path: '/setting' })"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      platform: '',
      platforms: [],
    }
  },
  watch: {
    $route(to, from) {
      if (to.name !== 'List') {
        this.platforms = []
      } else {
        this.platform = this.$route.params.platform
        this.getPlatforms()
      }
    }
  },
  methods: {
    turnTo(params) {
      this.$router.push(params)
    },
    getPlatforms() {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'getTabs', params: {}}, async(response) => {
        this.platforms = response.data
        return true
      })
    },
    changePlatform(platform) {
      this.platform = platform
      this.$router.push({ name: 'List', params: { platform }})
    },
  },
  created() {
    if (this.$route.name === 'List') {
      this.platform = this.$route.params.platform
      this.getPlatforms()
    }
  },
}
</script>

<style lang="less" scoped>
@border-grey: rgba(206, 206, 206, 0.4);

.sidebar-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .home {
      font-size: 20px;
      width: 100%;
      height: 49px;
      text-align: center;
      line-height: 50px;
      padding: 0 8px;
      cursor: pointer;
      .logo {
        height: 26px;
      }
    }
    .nav {
      padding: 40px 0 0 0;
      width: 100%;
      height:calc(90% - 100px);
      flex-grow: 1;
      .sidebar-item {
        font-size: 14px;
        width: 100%;
        padding: 16px 8px;
        text-align: center;
        cursor: pointer;
        &.active {
          color: brown;
          font-weight: bold;
          border-bottom: 1px solid @border-grey;
          .platform-count {
            font-size: 12px;
            color: brown;
          }
        }
        &:hover {
          background-color: @border-grey;
        }
        .platform-count {
          font-size: 12px;
          color: @border-grey;
        }
      }
    }
    .setting {
      padding: 0 8px;
      font-size: 20px;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
}
</style>
