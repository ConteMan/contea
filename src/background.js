import Sspai from "./modules/sspai"
import Zhihu from "./modules/zhihu"

// 长连接
browser.runtime.onConnect.addListener(function(port) {
  if (port.name === "bgConnect") {
    port.onMessage.addListener(async function(msg) {
      let data = {};
      switch (msg.type){
        case "sspai":
          data = await Sspai.getInstance().formatData();
          break;
        case "zhihu":
          data = await Zhihu.getInstance().formatData();
          break;
      }
      await port.postMessage({'type': msg.type, 'data': data})
    });
  }
});
