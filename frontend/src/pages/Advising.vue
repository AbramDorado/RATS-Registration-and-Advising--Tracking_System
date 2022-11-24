<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Advising',
  components: {
    Header, Footer, ScheduleOfClasses
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
<ScheduleOfClasses />
<!-- Advising Div -->
<div>
  <Header :user="this.user"/>
  <!-- Advising Page Body -->
  <div class="align-items-start d-flex flex-row justify-content-center" style="gap: 20px; margin: 2%; min-height: 50vh;">
    <!-- Curriculum Progress -->
    <div class="div2">
      Curriculum Progress
    </div>
    <!-- end Curriculum Progress -->
    <!-- ECF -->
    <div class="div2">
      ECF
    </div>
    <!-- end ECF -->
  </div>
  <!-- end Advising Page Body -->
  <Footer />
</div>
<!-- end Advising Div -->
<div>

</div>
</template>

<style scoped>
.div2 {
  background-color: #F8F6F0;
  border: 2px solid #093405;
  border-radius: 10px;
  flex: 1 1 0;
  padding: 15px 20px;
}
</style>