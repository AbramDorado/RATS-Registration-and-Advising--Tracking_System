<script>
// import AnnouncementCard from '../components/AnnouncementCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'Home',
  data() {
    return {
      user: {}
    }
  },
  components: {
    // AnnouncementCard, Header, Footer
    Header, Footer
  },
  async mounted() {
    try {
      const response = await this.axios.post('/api/authorize')
      // console.log('response to api/authorize is', response.status) // temp
      if (response.status == 200) {
        // console.log('response.data is', response.data)
        this.user = response.data
      }
    } catch(err) {
      location.href = '/api/login/federated/google' // disable this if testing
    }
  }
}
</script>

<template>
<div class="d-flex flex-column">
  <Header :user="this.user" />

  User: {{this.user}}
  Home View
  <router-link to="/login">Login</router-link>
  <router-link to="/admin">Admin</router-link>
  <router-link to="/advisees">Advisees</router-link>

  <div id="homeMainDiv" class="d-flex flex-column justify-content-center" style="background-color: lightgray;">
    <div id="homeMainRow" class="d-flex flex-row" style="flex-basis: 0; gap: 20px; margin: 2%;">
      <div style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="announcementsHeader" class="d-flex flex-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#460C0F" class="bi-megaphone-fill" viewBox="0 0 16 16" style="padding-top: 4px; margin-right: 5px;">
            <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z"/>
          </svg>
          <h2 style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">ANNOUNCEMENTS</h2>
        </div>
        <AnnouncementCard header="Lorem ipsum dolor sit amet, consectetur adipiscing elit" date="October 31, 2022 12:41PM" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
        <AnnouncementCard header="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." date="October 31, 2022 1:02PM" content="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" />
      </div>
      <div style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="statusHeader" class="d-flex flex-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#460C0F" class="bi-clipboard-check-fill" viewBox="0 0 16 16" style="padding-top: 5px; margin-right: 4px;">
            <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z"/>
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z"/>
          </svg>
          <h2 style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">STATUS</h2>
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

