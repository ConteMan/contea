/* eslint-disable no-unused-vars */
import Vue from 'vue';

import {
  Button,
  Space,
  Collapse,
  Switch,
  Avatar,
  Icon,
  Input,
  Tooltip,
  Message,
  Notification,
} from 'ant-design-vue';

Vue.component(Button.name, Button);
Vue.component(Space.name, Space);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Switch.name, Switch);
Vue.component(Avatar.name, Avatar);
Vue.component(Icon.name, Icon);
Vue.component(Input.name, Input);
Vue.component(Tooltip.name, Tooltip);

Vue.use(Message);
Vue.use(Notification);

Vue.prototype.$message = Message;
Vue.prototype.$notification = Notification;
