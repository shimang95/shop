import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)

// 配置全局的axios
Vue.prototype.$axios = axios

// 配置全局的基准地址baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置请求拦截器
axios.interceptors.request.use(config => {
  // 配置 token 令牌
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, err => {
  // Promise.reject(reason)方法返回一个带有拒绝原因reason参数的Promise对象。
  return Promise.reject(err)
})

// 设置响应拦截器
axios.interceptors.response.use(response => {
  // 可以编写响应前的处理逻辑
  if (response.data.meta.status === 401) {
    response.data.meta.msg = '您的登录状态已过时，请重新登录'
    router.push('/login')
  }
  return response.data
}, err => {
  return Promise.reject(err)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
