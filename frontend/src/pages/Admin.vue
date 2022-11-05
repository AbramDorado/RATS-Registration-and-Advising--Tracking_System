<script>
import Header from '../components/Header.vue'
export default {
  name: 'Admin',
  components: {Header},
  data () {
    return {
      users: [],
      reg_role: '',
      reg_up_mail: '',
      reg_first_name: '',
      reg_last_name: ''
    }
  },
  methods: {
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        if (!response.data.role === 'admin') {
          throw 'Not admin'
        }
      } catch (error) {
        console.log('Error on Admin.vue > authorize()', error) // temp
        location.href = '/'
      }
    },
    async getAllUsers() {
      try {
        const response = await this.axios.post('/api/getUsers')
        this.users = response.data
      } catch (error) {
        console.log('Error on Admin.vue > getAllUsers', error) // temp
      }
    },
    async registerUser(role, up_mail, first_name, last_name) {
      try {
        const body = {role: role, up_mail: up_mail, first_name: first_name, last_name: last_name}
        const response = await this.axios.post('/api/register', body)
        location.href = '/admin'
      } catch (error) {
        console.log('Error on Admin.vue > registerUser', error) // temp
      }
    },
    async deleteUser(userToDelete) {
      try {
        const response = await this.axios.post('/api/deleteUser', userToDelete)
        location.href = '/admin'
      } catch (error) {
        console.log('Error on Admin.vue > deleteUser', error) // temp
      }
    }
  },
  async mounted() {
    await this.authorize()
    await this.getAllUsers()
  }
}
</script>

<template>
<div>
  <Header />
  Admin View
  <h1>Get All Users:</h1>
  <div v-for="(obj, index) in users" :key="index">
    <p>{{users[index]}}</p>
    <button @click="deleteUser(this.users[index])">Delete user</button>
  </div>
  <h1>Register User</h1>
  <span>role</span>
  <input v-model="reg_role" type="text">
  <span>up_mail</span>
  <input v-model="reg_up_mail" type="text">
  <span>first_name</span>
  <input v-model="reg_first_name" type="text">
  <span>last_name</span>
  <input v-model="reg_last_name" type="text">
  <button @click="registerUser(this.reg_role, this.reg_up_mail, this.reg_first_name, this.reg_last_name)">Register</button>
</div>
</template>

<style scoped>

</style>