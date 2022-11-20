<script>
import AnnouncementCard from '../components/AnnouncementCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'Home',
  data() {
    return {
      announcements: [],
      announcementsCounter: 0, // counter for total announcements loaded
      announcementsEmpty: false, // v-if 'Show more (announcements)' button; true if all announcements from backend are already loaded here
      getNextAnnouncementsDisabled: false, // for spam handling getNextAnnouncements()
      status: '',
      user: {}
    }
  },
  components: {
    AnnouncementCard, Header, Footer
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
    formatted_date(miliseconds) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      var myDate = new Date(parseInt(miliseconds))
      return myDate.toLocaleDateString("en-US", options)
    },
    async getAdvisingStatus() {
      try {
        const response = await this.axios.post('/api/advising/getStatus', {student_up_mail: this.user.up_mail})
        this.status = response.data.result.status
      } catch (error) {
        console.log('Error on Home.vue > getAdvisingStatus', error)
      }
    },
    // async getAllAnnouncements() {
    //   try {
    //     const limit = 50
    //     const response = await this.axios.post('/api/announcement/all', {limit: limit})
    //     this.announcements = response.data.rows
    //   } catch (error) {
    //     console.log('Error on Home.vue > getAllAnnouncements', error) // temp
    //   }
    // },
    async getNextAnnouncements() {
      try {
        this.getNextAnnouncementsDisabled = true
        const response = await this.axios.post('/api/announcement/next', {loaded: this.announcementsCounter})
        this.announcementsCounter += response.data.announcements.length
        if (response.data.more === 'true') {
          this.announcementsEmpty = false
        } else {
          this.announcementsEmpty = true
        }
        this.announcements = this.announcements.concat(response.data.announcements)
        this.getNextAnnouncementsDisabled = false
      } catch (error) {
        console.log('Error on Home.vue > getNextAnnouncements()', error)
        this.getNextAnnouncementsDisabled = false
      }
    }
  },
  async mounted() {
    await this.authorize()
    // await this.getAllAnnouncements()
    await this.getNextAnnouncements()
    await this.getAdvisingStatus()
  }
}
</script>

<template>
<div class="d-flex flex-column">
  <Header :user="this.user" />
  <div id="homeMainDiv" class="d-flex flex-column justify-content-center" style="background-color: lightgray;">
    <div id="homeMainRow" class="d-flex flex-row" style="flex-basis: 0; gap: 20px; margin: 2%;">
      <div class="d-flex flex-column justify-content-center" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="announcementsHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 10px;">
          <i class="align-items-center bi bi-megaphone-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">ANNOUNCEMENTS</span>
        </div>
        <AnnouncementCard v-for="(obj, index) in announcements" :key="index" :header="announcements[index].title" :date="this.formatted_date(announcements[index].modified)" :content="announcements[index].body" />
        <a @click="getNextAnnouncements()" v-if="!this.announcementsEmpty" href="javascript:;">Show more</a>
      </div>
      <div v-if="this.user.role === 'student'" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="statusHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 10px;">
          <i class="align-items-center bi bi-clipboard-check-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">STATUS</span>
        </div>
        <div ref="statusDivBody">
          {{this.status}}
        </div>
      </div>
    </div>
  </div>
  <Footer />
</div>
</template>

<style scoped>
#homeMainDiv * {
  font-family: Open_Sans;
}
</style>

