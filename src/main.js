import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'huhucloud-phuu5',
  traceUser: true
})

const app = new Vue(App)
app.$mount()
//设置全局变量
getApp().globalData = {
  barHeight:'',
  navHeight :'',
  imgHeight:'',
  imgTop:'',
  imgLeft:'',
}
Vue.prototype.globalData = getApp().globalData
