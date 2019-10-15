// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import api from './http'
import global from '@/utils/global'
import i18n from './i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
import router from './router'
import store from './store'

Vue.use(ElementUI)
//console.log(api);
Vue.use(api)
import axios from 'axios'
axios.defaults.withCredentials=true;//让ajax携带cookie
Vue.prototype.$axios = axios;
Vue.prototype.global = global
Vue.config.productionTip = false


Vue.prototype.validForbid = function (value, number = 255) {
  value = value.replace(/[`~!#$%^&*()_\+=<>?:"{}|,/;'\\[\]·~！#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  //value = value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  if (value.length >= number) {
    this.$message({
      type: "warning",
      message: `输入内容不能超过${number}个字符`
    });
  }
  return value;
}
Vue.prototype.validPwd = function (value, number = 255) {
  value = value.replace(/[[\]]/g, '').replace(/\s/g, "");
  //value = value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '').replace(/\s/g, "");
  if (value.length >= number) {
    this.$message({
      type: "warning",
      message: `输入内容不能超过${number}个字符`
    });
  }
  return value;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
