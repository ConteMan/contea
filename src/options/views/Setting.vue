<template>
  <div class="setting-container">
    <div class="action-bar">
      <span class="title">设置</span>
    </div>
    <div class="settting-content">
      <a-collapse
        expand-icon-position="left"
        :bordered="false"
        :activeKey="activeKey"
      >
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel
          key="1"
          header="语雀"
          :style="customStyle"
        >
          <div class="setting-item">
            <div class="title">小记</div>
            <div class="action">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :checked="Boolean(configs.yuque_note_enable)"
                @change="switchChange('yuque_note_enable', $event)"
              />
            </div>
            <div class="des"></div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          key="2"
          header="知乎"
          :style="customStyle"
        >
          <div class="setting-item">
            <div class="title">动态</div>
            <div class="action">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :checked="Boolean(configs.zhihu_activity_enable)"
                @change="switchChange('zhihu_activity_enable', $event)"
              />
            </div>
            <div class="des"></div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          key="3"
          header="即刻"
          :style="customStyle"
        >
          <div class="setting-item">
            <div class="title">小记</div>
            <div class="action">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :checked="Boolean(configs.jike_activity_enable)"
                @change="switchChange('jike_activity_enable', $event)"
              />
            </div>
            <div class="des"></div>
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          key="4"
          header="浮墨 Flomo"
          :style="customStyle"
        >
          <div class="setting-item">
            <div class="title">Memo</div>
            <div class="action">
              <a-switch
                checked-children="开"
                un-checked-children="关"
                :checked="Boolean(configs.flomo_memo_enable)"
                @change="switchChange('flomo_memo_enable', $event)"
              />
            </div>
            <div class="des"></div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data() {
    return {
      activeKey: ['1', '2', '3', '4'],
      templates: [],
      customStyle: 'background: #fff; border-radius: 0; border: 0; overflow: hidden;',
      configs: {
        yuque_note_enable: 0,
        zhihu_activity: 0,
        jike_activity: 0,
      }
    }
  },
  methods: {
    switchChange(key, checked) {
      this.setConfig(key, checked ? 1 : 0)
    },
    toBoolean(value) {
      return value > 0
    },
    async getConfig() {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'getConfig', params: { type: 'all' }}, (response) => {
        this.configs = response.data
        return true
      })
    },
    async setConfig(key, value) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'setConfig', params: { key, value }}, (response) => {
        if (response.data) {
          this.configs[key] = Boolean(value)
          this.$message.success('搞定!')
        } else {
          this.$message.success('有点问题...')
        }
        return true
      })
    }
  },
  created() {
    this.getConfig()
  },
}
</script>

<style lang="less" scoped>
@border-grey: rgba(206, 206, 206, 0.4);
@font-grey: rgba(206, 206, 206, 0.6);

.setting-container {
  .action-bar {
    height: 50px;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid @border-grey;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
  }
  .setting-content {
    padding: 8px;
  }
  /deep/ .setting-item {
    padding: 4px 0 0 0;
    .title {
      display: inline;
    }
    .action {
      float: right;
      display: inline;
      text-align: right;
    }
    .des {
      font-size: 12px;
      color: @font-grey;
    }
  }
  /deep/ .ant-collapse-header {
    background: #fafafa;
  }
}
</style>
