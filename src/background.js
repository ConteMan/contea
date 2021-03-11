/* eslint-disable no-undef */
import service from './service';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const Service = service.getInstance();
  const { command, params } = request;

  let data;
  const status = 1;
  const msg = 'success';

  switch (command) {
    case 'getRandom':
      data = Service.random(params);
      break;
    case 'getList':
      data = Service.list(params);
      break;
    case 'getTabs':
      data = Service.tabs(params);
      break;
    case 'sync':
      data = Service.sync(params);
      break;
    case 'getLoginStatus':
      data = Service.loginStatus(params);
      break;
    case 'getPlatformInfo':
      data = Service.platformInfo(params);
      break;
    case 'getConfig':
      data = Service.config(params);
      break;
    case 'setConfig':
      data = Service.setConfig(params);
      break;
    case 'setConfigs':
      data = Service.setConfigs(params);
      break;
    case 'queryInterface':
      data = Service.sync(queryInterface);
      break;
    default:
      data = {};
      break;
  }
  data.then((res) => {
    sendResponse(
      {
        command,
        status,
        msg,
        data: res,
      });
  });
  return true;
});

chrome.runtime.onInstalled.addListener(async function() {
  await service.init();
});

chrome.browserAction.onClicked.addListener(function() {
  const index = chrome.extension.getURL('options.html');
  chrome.tabs.query({ url: index }, function(tabs) {
    if (tabs.length) {
      chrome.tabs.update(tabs[0].id, { active: true });
      chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      chrome.tabs.create({ url: index });
    }
  });
});
