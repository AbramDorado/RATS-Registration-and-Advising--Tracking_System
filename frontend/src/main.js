import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'

// import route components
import Admin from './pages/Admin.vue'
import Advising from './pages/Advising.vue'
import Contact from './pages/Contact.vue'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'

// set routes
const routes = [
  {path: '/', component: Home},
  {path: '/admin', component: Admin},
  {path: '/advising', component: Advising},
  {path: '/contact', component: Contact},
  {path: '/login', component: Login}
]

const router = createRouter({
  history: createWebHistory(), routes
})
app.use(router)
// end Vue Router

// Vue Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)
// end Vue Axios

app.mount('#app')
