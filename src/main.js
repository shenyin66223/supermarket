import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import "./static/scss/common.scss"
import plugins from "./plugins/index"
import "./static/fonts/font/iconfont.css"
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import store from "./store/index"
import {Button} from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(Button)

Vue.use(VueAwesomeSwiper)
Vue.use(plugins)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
