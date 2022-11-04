<script>
export default {
  name: 'Header',
  methods: {
    async doLogout() {
      try {
        const response = await this.axios.post('/api/logout')
        console.log(response.data.message) // temp
        location.href = response.data.redirect
      } catch (error) {
        console.log(error) // temp
      }
    }
  }
}
</script>

<template>
Header Component
<button @click="doLogout()">Logout</button>
</template>