<script>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
export default {
  name: 'Contact',
  components: {
    Footer,
    Header
  },
  data() {
    return {
      user: {}
    }
  },
  async mounted() {
    await this.authorize()
  },
  methods: {
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        this.user = response.data
      } catch(err) {
        location.href = '/login' // to do: allow logging in as 'guest' for non-cas students
      }
    },    
  }
}
</script>

<template>
<div>
  <Header :user="this.user"/>
  Contact Page
  <Footer />
</div>
</template>

<style scoped>

</style>