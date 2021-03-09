<template>
  <div class="setting-container">
    <div class="action-bar">
      <span class="title">设置</span>
    </div>
    <div class="setting-content">
      <template v-if="Object.keys(configs)">
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
          <a-collapse-panel
            key="juejin"
            header="掘金"
            :style="customStyle"
          >
            <div class="setting-item">
              <div class="title">动态</div>
              <div class="action">
                <a-switch
                  checked-children="开"
                  un-checked-children="关"
                  :checked="Boolean(configs. juejin_activity_enable)"
                  @change="switchChange('juejin_activity_enable', $event)"
                />
              </div>
              <div class="des"></div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel
            key="5"
            header="实验室"
            :style="customStyle"
          >
            <div class="setting-item">
              <div class="title">独立窗口</div>
              <div class="action">
                <a-button size="small" @click="openWindowMode">打开</a-button>
              </div>
              <div class="des">
                体验更佳
              </div>
            </div>
            <div class="setting-item">
              <div class="title">同步接口&nbsp;URL</div>
              <div class="action">
                <a-tooltip
                  placement="topLeft"
                  :trigger="['focus']"
                  :get-popup-container="getPopupContainer"
                >
                  <span v-if="configs.sync_api_url" slot="title">
                    {{ configs.sync_api_url }}
                  </span>
                  <template v-else slot="title">
                    URL
                  </template>
                  <a-input
                    class="input-url"
                    placeholder="URL"
                    size="small"
                    v-model="configs.sync_api_url"
                    v-on:blur="setConfig('sync_api_url', configs.sync_api_url)"
                  />
                </a-tooltip>
              </div>
              <div class="des">
                用于同步数据，POST，body 为 JSON
              </div>
            </div>
            <div class="setting-item">
              <div class="title">同步数据</div>
              <div class="action">
                <a-button size="small" :loading="syncLoading" @click="sync">同步</a-button>
              </div>
              <div class="des">
                通过同步接口传送已有数据
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data() {
    return {
      activeKey: ['1', '2', '3', '4', '5', 'juejin'],
      templates: [],
      customStyle: 'background: #fff; border-radius: 0; border: 0; overflow: hidden;',
      sync_api_host: '',
      sync_api_port: '',
      configs: {},

      syncLoading: false,
      saveLoading: false,
    };
  },
  methods: {
    getPopupContainer(trigger) {
      return trigger.parentElement;
    },
    switchChange(key, checked) {
      this.setConfig(key, checked ? 1 : 0);
    },
    toBoolean(value) {
      return value > 0;
    },
    async getConfig() {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'getConfig', params: { type: 'all' }}, (response) => {
        this.configs = response.data;
        return true;
      });
    },
    async setConfig(key, value) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'setConfig', params: { key, value }}, (response) => {
        if (response.data) {
          this.configs[key] = value;
          this.$notification.success({
            message: '搞定！',
            description: '',
          });
        } else {
          this.$notification.success({
            message: '有点问题...',
            description: '',
          });
        }
        return true;
      });
    },
    async openWindowMode() {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'test', params: { type: 'ext.getUrl' }}, (response) => {
        if (response.data) {
          this.$notification.success({
            message: '搞定！',
            description: '',
          });
        } else {
          this.$notification.success({
            message: '有点问题...',
            description: '',
          });
        }
        return true;
      });
    },
    async setConfigs() {
      this.saveLoading = true;
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'setConfigs', params: { configs: this.configs }}, (response) => {
        if (response.data) {
          this.$notification.success({
            message: '搞定！',
            description: '成功 [ ' + response.data.success + ' ]，失败 [ ' + response.data.fail + ' ]',
          });
        } else {
          this.$notification.success({
            message: '有点问题...',
            description: '',
          });
        }
        this.saveLoading = false;
        return true;
      });
    },
    async sync() {
      this.syncLoading = true;
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ command: 'sync', params: { type: 'ext.getUrl' }}, (response) => {
        if (response.data) {
          this.$notification.success({
            message: '搞定！',
            description: '成功 [ ' + response.data.success + ' ]，失败 [ ' + response.data.fail + ' ]',
          });
        } else {
          this.$notification.success({
            message: '有点问题...',
            description: '',
          });
        }
        this.syncLoading = false;
        return true;
      });
    }
  },
  created() {
    this.getConfig();
  },
};
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
  /deep/ .setting-item {
    padding: 8px 0;
    display: flex;
    flex-wrap: wrap;
    .title {
      width: 30%;
    }
    .action {
      width: 70%;
      text-align: right;
      .input-url {
        width: 70%;
      }
    }
    .des {
      width: 100%;
      font-size: 12px;
      color: @font-grey;
    }
  }
  /deep/ .ant-collapse-header {
    background: #fafafa;
  }
  /deep/ .ant-collapse-content-box {
    padding-bottom: 4px;
  }
}
</style>
