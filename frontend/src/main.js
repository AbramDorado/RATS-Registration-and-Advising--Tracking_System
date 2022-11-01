import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Vue Router
import { createRouter, createWebHistory } from 'vue-router'

// import route components
// import Home from './views/Home.vue'
// import Login from './views/Login.vue'
// import Advisees from './views/Advisees.vue'
// import Admin from './views/Admin.vue'

// set routes
const routes = [
  // {path: '/', component: Home},
  // {path: '/login', component: Login},
  // {path: '/advisees', component: Advisees},
  // {path: '/admin', component: Admin}
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
