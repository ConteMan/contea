import Sspai from "./modules/sspai"
import Zhihu from "./modules/zhihu"

// 长连接
browser.runtime.onConnect.addListener(function(port) {
  if (port.name === "bgConnect") {
    port.onMessage.addListener(async function(msg) {
      let data = {};
      switch (msg.type){
        case "sspai":
          const sspai = Sspai.getInstance();
          data = await sspai.formatData();
          break;
        case "zhihu":
          const zhihu = Zhihu.getInstance();
          data = await zhihu.formatData();
          break;
      }
      await port.postMessage({'type': msg.type, 'data': data})
    });
  }
});
