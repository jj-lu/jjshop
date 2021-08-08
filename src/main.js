import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

// import './plugins/element'

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$https = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
