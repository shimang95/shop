import Vue from 'vue'
import Router from 'vue-router'
import Index from './page/Index'
import Login from './page/Login'
import User from './components/user/User'
import Right from './components/right/Right'
import Roles from './components/right/Roles'

// 解决vue-router的版本问题引起的路由不能一直点击的bug
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', component: User },
        { path: '/rights', component: Right },
        { path: '/roles', component: Roles }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
