// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import Mint from 'mint-ui';
import { Indicator } from 'mint-ui';
import base from './base'
import router from './router'
import store from './store'
import 'lib-flexible'
import Bridge from './plugins/bridge.js'
import FastClick from 'fastclick'
Vue.config.debug = true;
//初始化FastClick实例。在页面的DOM文档加载完成后
/*FastClick.prototype.onTouchEnd = function(event) {
  if(event.target.hasAttribute("type") && event.target.getAttribute("type") == "text") {
    event.preventDefault();
    return false;
  }
}*/
FastClick.attach(document.body)
FastClick.prototype.focus = function(targetElement){
  'use strict';
  targetElement.focus()
}
//通过components下Publi里的index.js文件导入组件
import components from './components/common/index'
import VueLazyload from 'vue-lazyload'
import global_ from './components/common/global'//引用文件
//对导入的组件进行全局组件注册
Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})
Vue.use(Mint)
Vue.prototype.$bridge = Bridge //jsBridge挂载
Vue.prototype.GLOBAL = global_ //全局属性挂载
Vue.prototype.Indicator = Indicator
Vue.prototype.$axios = (ajax) => {
  if (ajax.noUseLoading) {
  }else {
    Indicator.open({//打开loading
      text: 'loading...',
      spinnerType: 'fading-circle'
    });
  }
  Axios({
    method: ajax.type,
    url: 'http://server.scrugou.cn' + ajax.url,
    data: JSON.stringify(ajax.data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    if (ajax.noUseLoading) {
    }else {
      Indicator.close();//关闭loading
    }
    ajax.success(response)
  }).catch((error) => {
    Indicator.close();//关闭loading
    console.log(error)
    if (ajax.fail) {
      ajax.fail()
    }
  })
}

Vue.use(base)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: require('./images/loading.png'),
  attempt: 1
})
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
