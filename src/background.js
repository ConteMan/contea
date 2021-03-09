/* eslint-disable no-undef */
import service from './service';

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  const Service = service.getInstance();
  const { command, params } = request;

  let data;
  const status = 1;
  const msg = 'success';

  switch (command) {
    case 'getRandom':
      data = await Service.random(params);
      break;
    case 'getList':
      data = await Service.list(params);
      break;
    case 'getTabs':
      data = await Service.tabs(params);
      break;
    case 'syncInfo':
      data = await Service.syncInfo(params);
      break;
    case 'getLoginStatus':
      data = await Service.loginStatus(params);
      break;
    case 'getPlatformInfo':
      data = await Service.platformInfo(params);
      break;
    case 'getConfig':
      data = await Service.config(params);
      break;
    case 'setConfig':
      data = await Service.setConfig(params);
      break;
    case 'setConfigs':
      data = await Service.setConfigs(params);
      break;
    case 'sync':
      data = await Service.sync(params);
      break;
    case 'test':
      data = chrome.extension.getURL('options.html');
      chrome.windows.create({
        url: data,
        type: 'popup',
        focused: true,
      });
      break;
    default:
      data = {};
      break;
  }
  console.log('background response data:', data);
  sendResponse(
    {
      command,
      status,
      msg,
      data,
    });
});

chrome.runtime.onInstalled.addListener(async function() {
  await service.init();
});
