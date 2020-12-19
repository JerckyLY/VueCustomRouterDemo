import CustomRouter from "../customRouter";
import Vue from 'vue'


import HelloWorld from '../components/HelloWorld.vue'
import Test from '../components/Test'

//使用路由插件
Vue.use(CustomRouter)


const  routers = [
    {
        path:'/home',
        component: HelloWorld
    },
    {
        path: '/test',
        component: Test
    }
]
const router  = new CustomRouter({
    // mode:'history', //默认为 hash
    routers
})

export default router
