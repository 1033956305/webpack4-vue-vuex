import Vue from 'vue'
import App from './app.vue'
import './assets/styles/global.styl'
// import './assets/styles/test.css'
// import './assets/images/bg1.jpg'
// import './assets/styles/test-stylus.styl'
Vue.config.devtools = true

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render: (h) => h(App)
}).$mount(root)