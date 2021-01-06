import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as u from 'hy-util'

console.log(u);
window.u = u
Vue.prototype.u = u

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')