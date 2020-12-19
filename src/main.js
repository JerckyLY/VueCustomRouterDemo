import Vue from 'vue'
import App from './App.vue'
import router from  './routers'


// Vue.component('viewer',{
//   render(h){
//     const tag = 'div'
//     const config = {attrs:{id:'viewers'}}
//     return h(tag,config,'我是div')
//   }
// })

//全局混入
// const MyPlugin = {}
// MyPlugin.install = function(vue) {
//   vue.mixin({
//     data() {
//       return {globalMixinData: '这是 mixin 混入数据'}
//     },
//     // 混入生命周期
//     created() {
//       console.log(this)
//       console.log('I am globalMixin created');
//     }
//   })
// }
//
// Vue.use(MyPlugin)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
