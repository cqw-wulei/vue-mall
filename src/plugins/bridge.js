var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var isFisrt = 1;
function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function() {
      return callback(WebViewJavascriptBridge)
    }, false)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  let WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}
export default {
  registerhandler (name, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      if (isAndroid && isFisrt == 1) {
        isFisrt = 0;
        bridge.init(function(message, responseCallback) {})
      }
      bridge.registerHandler(name, function (data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  },
  callhandler (name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  }
}
