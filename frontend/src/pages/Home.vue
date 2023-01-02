<script>
import AnnouncementCard from '../components/AnnouncementCard.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Home',
  data() {
    return {
      announcements: [
        {
            "id": "d261025f-d797-4a8e-939b-17326a184ce9",
            "title": "SECOND SEMESTER, 2022-2023 ENROLLMENT ADVISORY",
            "body": "CAS enrollment will officially be done on-site as implemented during pre-pandemic time. This means that certain processes will still require SAIS access.The enlistment center will be at the UP Manila Theater. Students are encouraged to make necessary preparations as soon as possible for the enrollment process which will start in the last week of January 2023. Further details will be posted soon.",
            "created": 1669102320000,
            "modified": 1669907059006
        },
        {
            "id": "2e6fe437-15d3-4924-bd1f-263ef8d6a3f6",
            "title": "APPLICATION FOR LEAVE OF ABSENCE AND \r\nREQUEST FOR DROPPING OF ENROLLED CAS SUBJECTS:\r\nFIRST SEMESTER, 2022-2023",
            "body": "Submission link for request for enrolled CAS subjects, and application for leave of absence and honorable dismissal is now open.\r\n<br><br>\r\nSubmit your application here:\r\n<a href=\"https://forms.gle/XxeJwY84i4rY29yN8\">https://forms.gle/XxeJwY84i4rY29yN8</a>\r\n<br><br>\r\nDeadline for dropping request: October 28, 2022\r\nDeadline for LOA application: November 11, 2022\r\n<br><br>\r\nDownload the required forms here: \r\n<a href=\"https://cas.upm.edu.ph/.../02/07/cas-downloadable-forms/\">https://cas.upm.edu.ph/.../02/07/cas-downloadable-forms/</a>\r\n<br><br>\r\nNon-CAS students must submit their application for leave of absence/dropping slip to their OCS. Processing of LOA/dropping requests are facilitated by their home unit. Official master list of non-CAS students who applied for LOA and dropping will be endorsed to CAS OCS before October 27, 2022.\r\n<br><br>\r\nPlease be guided accordingly.",
            "created": 1662594300000,
            "modified": 1662594300000
        },
        {
            "id": "590281a6-a0b4-4805-a520-f1bff972b36e",
            "title": "EXTENSION OF DEADLINE FOR\r\nENROLLMENT/REGISTRATION AND \r\nPAYMENT OF FEES FOR THE \r\nFIRST SEMESTER, A.Y. 2022-2023",
            "body": "The deadline for enrollment/registration and payment of fees for the First Semester, A.Y. 2022-2023 has been extended until September 7, 2022.\r\n<br><br>\r\nPlease disseminate. Thank you and stay safe.",
            "created": 1661826240000,
            "modified": 1661826240000
        },
        {
            "id": "381649df-321e-44a8-abe5-3b800c11c37c",
            "title": "ADVISORY from Information Technology Development Center (ITDC) and the Office of the Vice President for Development (OVPD)",
            "body": "To SAIS Users:\r\n<br><br>\r\nPlease be advised that urgent maintenance work is currently being implemented on our SAIS today Tuesday, 23 August 2022.\r\n<br><br>\r\nThe online services will resume today at 1:00PM.\r\n<br><br>\r\nFor your kind information and guidance.",
            "created": 1661220180000,
            "modified": 1661220180000
        }
      ],
      announcementsCounter: 0, // counter for total announcements loaded
      announcementsEmpty: false, // v-if 'Show more (announcements)' button; true if all announcements from backend are already loaded here
      getNextAnnouncementsDisabled: false, // for spam handling getNextAnnouncements()
      step1_status: '',
      step2_status: '',
      step3_status: '',
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
      // try {
      //   this.getNextAnnouncementsDisabled = true
      //   const response = await this.axios.post('/api/announcement/next', {loaded: this.announcementsCounter})
      //   this.announcementsCounter += response.data.announcements.length
      //   if (response.data.more === 'true') {
      //     this.announcementsEmpty = false
      //   } else {
      //     this.announcementsEmpty = true
      //   }
      //   this.announcements = this.announcements.concat(response.data.announcements)
      //   this.getNextAnnouncementsDisabled = false
      // } catch (error) {
      //   console.log('Error on Home.vue > getNextAnnouncements()', error)
      //   this.getNextAnnouncementsDisabled = false
      // }
      alert('Not functional in demo version: This button will retrieve the next announcements, if there are any.')
    },
    redirect(to) {
      location.href = to
    }
  },
  async mounted() {
    // await this.authorize()
    // await this.getNextAnnouncements()
    if (this.user.role === 'student') {
      // await this.getAdvisingStatus()
    }
    this.$refs.home.style.display = 'flex'
  }
}
</script>

<template>
<ScheduleOfClasses :user="this.user" />
<div ref="home" class="flex-column" style="display: none;">
  <Header :user="this.user" />
  <div id="homeMainDiv" class="d-flex flex-column justify-content-center" style="background-color: lightgray;">
    <div id="homeMainRow" class="align-items-start d-flex flex-row" style="flex-basis: 0; gap: 20px; margin: 2%;">
      <div class="d-flex flex-column justify-content-center" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px;">
        <div id="announcementsHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
          <i class="align-items-center bi bi-megaphone-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Announcements</span>
        </div>
        <AnnouncementCard v-for="(obj, index) in announcements" :key="index" :header="announcements[index].title" :date="this.formatted_date(announcements[index].modified)" :content="announcements[index].body" />
        <a @click="getNextAnnouncements()" v-if="!this.announcementsEmpty" href="javascript:;">Show more</a>
      </div>
      <!-- Status Div -->
      <div style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; flex: 1 1 0; padding: 15px 20px 20px 20px;">
        <div id="statusHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
          <i class="align-items-center bi bi-clipboard-check-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Enrollment Status</span>
        </div>

        <!-- Status Timeline -->
        <div class="d-flex flex-column justify-content-center" style="gap: 20px;">         
          
          <div class="alert alert-primary" style="margin: 0;">
            <p style="margin: 0; padding: 0;"><b>Not shown in demo version: </b>The status texts and button texts below dynamically updates depending on your status in that particular step.</p>
          </div>

          <!-- Curriculum Progress -->
          <div class="d-flex flex-column" style="background-color: white; border: 2px solid black; border-radius: 10px; padding: 10px 15px;">
            <span style="font-family: Open_Sans_Bold; font-size: 16px; margin-bottom: 10px;">Step 1: Update Curriculum Progress</span>
            <span style="align-self: center; font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 5px;">
              Status:
              <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">Done</span>
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
              <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">Not Started</span>
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
          <div class="d-flex flex-column" style="background-color: white; border: 2px solid black; border-radius: 10px; padding: 10px 15px;">
            <span style="font-family: Open_Sans_Bold; font-size: 16px; margin-bottom: 10px;">Step 3: Get SAIS Enlistment Access</span>
            <span style="align-self: center; font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 5px;">
              Status:
              <span style="font-family: Open_Sans; font-size: 20px; text-transform: capitalize;">No Access</span>
            </span>
            <!-- Start Button -->
            <!-- <div class="d-flex hoverTransform justify-content-center" style="align-self: center; width: 100px;">
              <span @click="redirect('/advising')" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 16px; padding: 5px 10px;">
                Start
              </span>
            </div> -->
            <!-- end Start Button -->               
          </div>
          <!-- end SAIS -->          

        </div>
        <!-- end Status Timeline -->
      </div>
      <!-- end Status Div -->
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

