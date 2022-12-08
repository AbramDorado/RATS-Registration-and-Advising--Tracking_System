<script>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Contact',
  components: {
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
<div style="display: flex; flex-direction: column; flex-grow: 1;">
  <ScheduleOfClasses />
  <Header :user="this.user"/>
  <!-- Contact Page -->
  <div class="d-flex flex-column" style="flex-grow: 1;">
    <!-- Header -->
    <!-- <div class="align-items-center d-flex justify-content-start" style="background-color: #093405; padding: 10px 15px;">
      <span style="color: white; font-family: Open_Sans_Bold; font-size: 24px; line-height: 1;">Contact Us</span>
    </div> -->
    <!-- end Header -->
    <!-- Body -->
    <div class="align-items-center d-flex flex-column justify-content-center" style="padding: 30px;">
      <div class="d-flex flex-column justify-content-center" style="gap: 5px; margin-bottom: 20px; margin-top: 20px;">
        <span class="text-center" style="color: #370404; font-family: Open_Sans_Bold; font-size: 24px; line-height: 1;">College of Arts and Sciences</span>
        <span class="text-center" style="color: #370404; font-family: Open_Sans_Bold; font-size: 24px; line-height: 1;">Office of the College Secretary</span>
      </div>
      <div class="iconText">
        <i class="align-items-center bi bi-envelope-fill d-flex" style="color: #370404; font-size: 50px;"></i>
        <span class="text-center" style="color: #370404; flex-grow: 1; font-family: Open_Sans; font-size: 20px; line-height: 1;">upm-cas-ocs@up.edu.ph</span>
      </div>
      <div class="iconText">
        <i class="align-items-center bi bi-telephone-fill d-flex" style="color: #370404; font-size: 50px;"></i>
        <span class="text-center" style="color: #370404; flex-grow: 1; font-family: Open_Sans; font-size: 20px; line-height: 1;">to be added</span>
      </div>
      <div class="iconText">
        <i class="align-items-center bi bi-facebook d-flex" style="color: #370404; font-size: 50px;"></i>
        <span class="text-center" style="color: #370404; flex-grow: 1; font-family: Open_Sans; font-size: 20px; line-height: 1;">https://facebook.com/casupm/</span>
      </div>
      <div class="iconText">
        <i class="align-items-center bi bi-geo-alt-fill d-flex" style="color: #370404; font-size: 50px;"></i>
        <div class="d-flex flex-column justify-content-center" style="flex-grow: 1; gap: 5px;">
          <span class="text-center" style="color: #370404; font-family: Open_Sans; font-size: 20px; line-height: 1;">University of the Philippines Manila</span>
          <span class="text-center" style="color: #370404; font-family: Open_Sans; font-size: 20px; line-height: 1;">College of Arts and Sciences</span>
          <span class="text-center" style="color: #370404; font-family: Open_Sans; font-size: 20px; line-height: 1;">Padre Faura St., Ermita, Manila</span>
        </div>
        
      </div>
    </div>
    <!-- end Body -->
  </div>
  <!-- end Contact Page -->
  <Footer />
</div>
</template>

<style scoped>
.iconText {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  width: 450px;
}
</style>