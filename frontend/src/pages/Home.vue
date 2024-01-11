<script>
import AnnouncementCard from '../components/AnnouncementCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Home',
  data() {
    return {
      announcements: [],
      announcementsCounter: 0, // counter for total announcements loaded
      announcementsEmpty: false, // v-if 'Show more (announcements)' button; true if all announcements from backend are already loaded here
      getNextAnnouncementsDisabled: false, // for spam handling getNextAnnouncements()
      step1_status: '',
      step2_status: '',
      step3_status: '',
      adviseesCountApp: 0,
      adviseesCountNot: 0,
      adviseesCountPend: 0,
      adviseesCountTot: 0,
      user: {}
    }
  },
  components: {
    AnnouncementCard, Header, Footer, ScheduleOfClasses
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
    async getAdviseesCountApp() {
      try {
        const response = await this.axios.post('/api/ecf/countAdvisees', {advisingStatus: 'Approved'})
        this.adviseesCountApp = response.data.count
      } catch (error) {
        console.log('Error on Adviser.vue > getAdviseesCount', error) // temp
      }
    },
    async getAdviseesCountNot() {
      try {
        const response = await this.axios.post('/api/ecf/countAdvisees', {advisingStatus: 'Waiting for Revision'})
        this.adviseesCountNot = response.data.count
      } catch (error) {
        console.log('Error on Adviser.vue > getAdviseesCount', error) // temp
      }
    },
    async getAdviseesCountPend() {
      try {
        const response = await this.axios.post('/api/ecf/countAdvisees', {advisingStatus: 'waiting for approval'})
        this.adviseesCountPend = response.data.count
      } catch (error) {
        console.log('Error on Adviser.vue > getAdviseesCount', error) // temp
      }
    },
    async getAdviseesCount() {
      try {
        const response = await this.axios.post('/api/ecf/countAdvisees')
        this.adviseesCountTot = response.data.count
      } catch (error) {
        console.log('Error on Adviser.vue > getAdviseesCount', error) // temp
      }
    },
    async getAdvisingStatus() {
      try {
        const response = await this.axios.post('/api/advising/getStatus', {student_up_mail: this.user.up_mail})
        this.step1_status = response.data.step1_status
        this.step2_status = response.data.step2_status
        this.step3_status = response.data.step3_status
      } catch (error) {
        console.log('Error on Home.vue > getAdvisingStatus', error)
      }
    },
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
    },
    goToSAIS() {
      window.open('https://sais.up.edu.ph')
    },
    redirect(to) {
      location.href = to
    }
  },
  async mounted() {
    await this.authorize()
    console.log('calling getNextAnn')
    await this.getNextAnnouncements()
    if (this.user.role === 'student') {
      await this.getAdvisingStatus()
    }
    await this.getAdviseesCountApp()
    await this.getAdviseesCountNot()
    await this.getAdviseesCountPend()
    await this.getAdviseesCount()
    console.log('this called')
    this.$refs.home.style.display = 'flex'
  }
}
</script>

<template>
<ScheduleOfClasses :user="this.user" />
<div ref="home" class="flex-column" style="display: none;">
  <Header :user="this.user" />
  <div id="homeMainDiv" class="d-flex flex-column justify-content-center" style="background-color: lightgray; padding: 8% 0 0 0;">
    <div id="homeMainRow" class="align-items-start d-flex flex-row" style="flex-basis: 0; gap: 20px; margin: 2%;">
      <div class="d-flex flex-column justify-content-center" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="announcementsHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
          <i class="align-items-center bi bi-megaphone-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Announcements</span>
        </div>
        <AnnouncementCard v-for="(obj, index) in announcements" :key="index" :header="announcements[index].title" :date="this.formatted_date(announcements[index].modified)" :content="announcements[index].body" />
        <a @click="getNextAnnouncements()" v-if="!this.announcementsEmpty" href="javascript:;">Show more</a>
      </div>
      <div style="flex: 0.5 1 0;">
        <div v-if="this.user.role === 'student'" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; margin-bottom: 20px; padding: 15px 20px 20px 20px;">
          <div id="statusHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
            <i class="align-items-center bi bi-clipboard-check-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
            <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Enrollment Status</span>
          </div>
          <!-- Status Timeline -->
          <div class="d-flex flex-column justify-content-center" style="gap: 20px;">         
            
            <!-- Curriculum Progress -->
            <div class="d-flex flex-column" style="background-color: white; border: 2px solid black; border-radius: 10px; padding: 10px 15px;">
              <span style="font-family: Open_Sans_Bold; font-size: 16px; margin-bottom: 10px;">Step 1: Update Curriculum Progress</span>
              <span style="align-self: center; font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 5px;">
                Status:
                <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">{{this.step1_status}}</span>
              </span>
              <!-- Start/Edit Button -->
              <div class="d-flex hoverTransform justify-content-center" style="align-self: center; width: 100px;">
                <span @click="redirect('/advising')" v-if="this.step1_status === 'not started'" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 16px; padding: 5px 10px;">
                  Start
                </span>
                <span @click="redirect('/advising')" v-else style="background-color: #7F6000; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 16px; padding: 5px 10px;">
                  Edit
                </span>              
              </div>
              <!-- end Start/Edit Button -->               
            </div>
            <!-- end Curriculum Progress -->

            <!-- Advising  -->
            <div class="d-flex flex-column" style="background-color: white; border: 2px solid black; border-radius: 10px; padding: 10px 15px;">
              <span style="font-family: Open_Sans_Bold; font-size: 16px; margin-bottom: 10px;">Step 2: Obtain Approved Enrollment Checklist Form</span>
              <span style="align-self: center; font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 5px;">
                Status:
                <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">{{this.step2_status}}</span>
              </span>
              <!-- Start Button -->
              <div v-if="this.step1_status != 'not started'" class="d-flex hoverTransform justify-content-center" style="align-self: center; width: 100px;">
                <span @click="redirect('/advising#ecfDiv')" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 16px; padding: 5px 10px;">
                  Start
                </span>
              </div>
              <!-- end Start Button -->               
            </div>
            <!-- end Advising -->

            <!-- SAIS  -->
            <!--<div class="d-flex flex-column" style="background-color: white; border: 2px solid black; border-radius: 10px; padding: 10px 15px;">
              <span style="font-family: Open_Sans_Bold; font-size: 16px; margin-bottom: 10px;">Step 3: Enlist through SAIS</span>-->
              <!-- <span style="align-self: center; font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 5px;">
                Status:
                <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">{{this.step3_status}}</span>
              </span> -->
              <!-- Go to SAIS Button -->
              <!--<div class="d-flex hoverTransform justify-content-center" style="align-self: center; width: 100px;">
                <span @click="goToSAIS()" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 16px; padding: 5px 10px;">
                  Go to SAIS
                </span>
              </div>-->
              <!-- end Go to SAIS Button -->               
            <!--</div>-->
            <!-- end SAIS -->          

          </div>
          <!-- end Status Timeline -->
        </div>
        <!-- Adviser Overview -->
        <div v-if="this.user.role === 'adviser'" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; margin-bottom: 20px; padding: 15px 20px 20px 20px;">
          <!-- Adviser Overview Header -->
          <div id="statusHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
            <i class="align-items-center bi bi-clipboard-check-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
            <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Advising Overview</span>
          </div>
          <!-- end Adviser Overview Header -->
          
          <!-- Advisees Overview -->
          <div class="d-flex flex-column justify-content-center" style="gap: 20px; margin-left: 30px;">
            <span style="align-self: left; font-family: Open_Sans_Bold; font-size: 24px; margin-bottom: 5px; ">
              Approved:
              <span style="font-family: Open_Sans; font-size: 24px;">{{ this.adviseesCountApp }}</span>
            </span>
            <span style="align-self: left; font-family: Open_Sans_Bold; font-size: 24px; margin-bottom: 5px;">
              Pending:
              <span style="font-family: Open_Sans; font-size: 24px;">{{ this.adviseesCountPend }}</span>
            </span>
            <span style="align-self: left; font-family: Open_Sans_Bold; font-size: 24px; margin-bottom: 5px;">
              Not Approved:
              <span style="font-family: Open_Sans; font-size: 24px;">{{ this.adviseesCountNot }}</span>
            </span>
            <span style="align-self: left; font-family: Open_Sans_Bold; font-size: 30px; margin-bottom: 5px;">
              Total Advisees:
              <span style="font-family: Open_Sans; font-size: 30px;">{{ this.adviseesCountTot }}</span>
            </span>
          </div>
          <!-- Advisees Overview -->
        </div>
        <!-- Schedule of Activities -->
        <div style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px 20px 20px;">
          <div class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
            <i class="align-items-center bi bi-calendar-week-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
            <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Schedule of Activities</span>
          </div>
          <div>
            <img src="/Schedule_of_Activities.jpg" alt="Schedule of Activities">
            <!-- <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="height: 65px; margin-right: 8px; width: 65px; "> -->
          </div>
        </div>
        <!-- end Schedule of Activities -->
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
.hoverTransform {
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s linear;
}
  .hoverTransform:hover {
    transform: scale(1.05);
    transform-origin: center;
  }

  .hoverTransform:active {
    transform: scale(0.95);
    transform-origin: center;
  }
</style>

