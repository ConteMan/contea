<template>
  <div class="container">
    <div class="sidebar">
      <sidebar/>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'BaseLayout',
  components: {
    Sidebar,
  },
}
</script>

<style scoped lang="less">
@border-grey: rgba(206, 206, 206, 0.4);

.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  .sidebar {
    width: 100px;
    height: 100%;
    @media screen and (max-width: 380px) {
      width: 50px;
    }
  }
  .content {
    border-left: 1px solid @border-grey;
    border-right: 1px solid @border-grey;
    @media screen and (min-width: 800px) {
      width: 600px;
    }
    @media screen and (max-width: 800px) {
      width: calc(100% - 100px);
    }
    @media screen and (max-width: 380px) {
      width: calc(100% - 50px);
    }
    height: 100vh;
    .action-bar {
      position: fixed;
      top: 0;
      z-index: 100;
      width: calc(600px - 2px);
      height: 50px;
      padding: 0 8px;
      border-bottom: 1px solid @border-grey;
      background-color: white;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
    }
    .list {
      margin: 50px 0 0 0;
      width: 100%;
      height: calc(100vh - 50px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
