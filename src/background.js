// browser.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//       "from a content script:" + sender.tab.url :
//       "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({sspai: sspai()});
//   });

async function fetchAsync (url, option = {}) {
  option.credentials = 'include';
  let response = await fetch(url, option);
  return response.json();
}

async function sspai() {
  const cookies = await browser.cookies.get({url: "https://sspai.com", name: "sspai_jwt_token"});
  let data = {};
  data.list = await fetchAsync('https://sspai.com/api/v1/user/slug/info/get?slug=Conte', { headers: {
      'Authorization': 'Bearer ' + cookies.value,
    }});
  data.user = await fetchAsync('https://sspai.com/api/v1/user/info/get', { headers: {
    'Authorization': 'Bearer ' + cookies.value,
  }});
  return data;
}

browser.runtime.onConnect.addListener(function(port) {
  if (port.name === "bgConnect") {
    port.onMessage.addListener(async function(msg) {
      if (msg.type === "sspai") {
        let data = await sspai();
        console.log(data);
        await port.postMessage({'type': 'sspai', 'data': data})
      }
      if(msg.type === "zhihu") {
        let data = await fetchAsync('https://www.zhihu.com/api/v4/me');
        await port.postMessage({'type': 'zhihu', 'data': data})
      }
    });
  }
});
