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
            key="yuque"
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
            key="zhihu"
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
            key="jike"
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
            key="flomo"
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
            key="lab"
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
          </a-collapse-panel>
          <a-collapse-panel
            key="introduction"
            header="产品说明"
            :style="customStyle"
          >
            <div class="setting-item introduction">
              <p>Contea</p>
              <p>汇聚自己的动态，关注自己</p>
              <br>
              <p>关于第三方数据：</p>
              <p>本扩展通过当前浏览器登录状态，获取相关网站信息。</p>
              <p>涉及访问的网站可以在「扩展管理」中查看。</p>
              <p>信息存储于用户本地，不会发送给第三方。</p>
              <p>已获取的信息可以通过打开控制台清除本地存储的方式彻底删除。</p>
              <br>
              <p>
                本插件仅为个人研究使用，不得用于商业目的，如果侵权请告知 real.conteman@gmail.com。
              </p>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </template>
    </div>
  </div>
</template>

<script>
import { getTabId } from '../../utils/index';

export default {
  name: 'Setting',
  data() {
    return {
      activeKey: [
        'yuque',
        'zhihu',
        'jike',
        'flomo',
        'juejin',
        'introduction',
      ],
      templates: [],
      customStyle: 'background: #fff; border-radius: 0; border: 0; overflow: hidden;',
      sync_api_host: '',
      sync_api_port: '',
      configs: {},

      syncLoading: false,
      saveLoading: false,
      tabId: 0,
    };
  },
  async mounted() {
    const tabInfo = await getTabId();
    this.tabId = tabInfo.id;
    this.getConfig();
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
      const url = chrome.extension.getURL('options.html');
      // eslint-disable-next-line no-undef
      chrome.windows.create({
        url,
        type: 'popup',
        focused: true,
      });
      // eslint-disable-next-line no-undef
      chrome.tabs.remove([this.tabId]);
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
};
</script>

<style lang="less" scoped>
@border-grey: rgba(206, 206, 206, 0.4);
@font-grey: rgba(206, 206, 206, 0.6);

.setting-container {
  height: 100vh;
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
    height: calc(100vh - 50px);
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
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
  /deep/ .setting-item.introduction {
    display: block;
    font-size: 12px;
  }
}
</style>
