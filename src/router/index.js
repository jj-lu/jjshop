import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'

const Login = () => import('../components/Login.vue');
const Home = () => import('../views/home/home.vue');
const Welcome = () => import('../views/home/children/Welcome.vue');
const User = () => import('../views/user/User.vue');


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
  if(to.path == '/login') return next();
  let token = window.sessionStorage.getItem('token');
  if(token) next();
  else next('/login');
})

export default router
 
