import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'

// import route components
  // auth
  import Login from './pages/auth/Login.vue'
  import Admin from './pages/auth/Admin.vue'

import Adviser from './pages/Adviser.vue'
import Advising from './pages/Advising.vue'
import Contact from './pages/Contact.vue'
import Home from './pages/Home.vue'
import Ocs from './pages/OCS.vue'

// set routes
const routes = [
  {path: '/', component: Home},
  {path: '/admin', component: Admin},
  {path: '/adviser', component: Adviser},
  {path: '/advising', component: Advising},
  {path: '/contact', component: Contact},
  {path: '/login', component: Login},
  {path: '/ocs', component: Ocs}
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
