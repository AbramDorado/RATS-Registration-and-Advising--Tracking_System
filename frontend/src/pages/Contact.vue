<script>
import ContactComponent from '../components/ContactComponent.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Contact',
  components: {
    ContactComponent,
    Footer,
    Header,
    ScheduleOfClasses
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
  <ScheduleOfClasses />
  <Header :user="this.user"/>
  <div id="card">
    <ContactComponent />
  </div>
  <Footer />
</div>
</template>

<style scoped>
#card{
  border: 2px solid #5d795b;
  border-radius: 20px;
  height: 450px;
  width: 1300px;
  margin-left: 70px;
  margin-right: 70px;
  background-color: #f3f3f3;
  max-height: 450px;
}
</style>