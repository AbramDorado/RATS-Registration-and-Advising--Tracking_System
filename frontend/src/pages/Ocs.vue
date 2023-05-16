<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'OCS',
  components: {
    Header, Footer, ScheduleOfClasses
  },
  data () {
    return {
      
      // announcementDashboard-related
      addAnnouncementDisabled: false, // For spam handling addAnnouncement()
      add_announcement: { // Used in addAnnouncement()
        title: '',
        body: ''
      },
      announcements: [], // Main list of rows shown in announcement table
      del_announcement: {}, // Used in deleteAnnouncement() and deleteAnnouncementAPI()
      deleteAnnouncementDisabled: false, // For spam handling deleteAnnouncementAPI()
      edit_announcement: {}, // Used in editAnnouncement(), v-model'ed to changes
      edit_announcement_original: {}, // Used in editAnnouncement(), stores the original content before editing      
      view_announcement: {}, // Used in viewAnnouncement()      
      // end announcementDashboard-related

      // coursesDashboard-related
      add_course: {},
      batchUploadCoursesProgress: '',
      courses: [],
      dept: 'DAC',
      delete_course: {},
      edit_course: {},
      // end coursesDashboard-related

      // headerComponent-related
      user: {}, // Stores response of authorizeAPI; passed as prop in Header component
      // end headerComponent-related

      // advisingDashboard-related
      advisees: [],
      view_advisee: {},    
      // end advisingDashboard-related

      // pagination-related
      studentsCount: 'UNFINISHED', // TEMP
      resultsLimit: 1, // TEMP
      currentPage: 1, // TEMP
      sortBy: '',
      sortOrder: 'ASC',
      filterBy: '',
      searchString: '',
      // end pagination-related

    }
  },
  computed: {

  },
  methods: {
    // announcementDashboard-related
    async addAnnouncement() {
      try {
        if (this.addAnnouncementDisabled) {
          return
        } else if (!this.add_announcement.title || !this.add_announcement.body) {
          alert('Input cannot be blank')
          return
        } else {
          this.addAnnouncementDisabled = true
          const body = {title: this.add_announcement.title, body: this.add_announcement.body}
          const response = await this.axios.post('/api/announcement/create', body)
          await this.getAllAnnouncements()
          this.clearAddAnnouncementInputs();
          this.addAnnouncementDisabled = false
          this.hideDiv('addAnnouncementDiv');
          this.showDiv('announcementDashboard')
        }
      } catch (error) {
        console.log('Error on Admin.vue > addAnnouncement', error) // temp
        alert('Error on posting announcement') // temp
        this.addAnnouncementDisabled = false
      }
    },
    clearAddAnnouncementInputs() {
      this.add_announcement.title = ''
      this.add_announcement.body = ''
    },
    deleteAnnouncement(announcementToDelete) {
      this.hideDiv('announcementDashboard')
      this.showDiv('deleteAnnouncementDiv') // To do
      this.del_announcement = JSON.parse(JSON.stringify(announcementToDelete))
    },
    async deleteAnnouncementAPI() {
      if (this.deleteAnnouncementDisabled) {
        return
      }
      try {
        this.deleteAnnouncementDisabled = true
        const response = await this.axios.post('/api/announcement/delete', {body: this.del_announcement.body})
        await this.getAllAnnouncements()
        this.hideDiv('deleteAnnouncementDiv')
        this.showDiv('announcementDashboard')        
        this.deleteAnnouncementDisabled = false
      } catch (error) {
        console.log('Error on Admin.vue > deleteAnnouncement', error) // temp
      }
    },
    editAnnouncement(announcement) {
      this.edit_announcement = JSON.parse(JSON.stringify(announcement))
      this.edit_announcement_original = JSON.parse(JSON.stringify(announcement))
      this.hideDiv('announcementDashboard')
      this.showDiv('editAnnouncementDiv')
    },
    async editAnnouncementAPI() {
      try {
        if (!this.edit_announcement_original.body || !this.edit_announcement.title || !this.edit_announcement.body) {
          alert('Input cannot be blank') // temp
          return
        } else {
          const body = {old_body: this.edit_announcement_original.body, new_title: this.edit_announcement.title, new_body: this.edit_announcement.body}
          const response = await this.axios.post('/api/announcement/edit', body)
          await this.getAllAnnouncements()
          this.hideDiv('editAnnouncementDiv');
          this.showDiv('announcementDashboard')
        }
      } catch(error) {
        console.log('Error on Admin.vue > editAnnouncementAPI', error) // temp
      }
    },
    formatted_date(miliseconds) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      var myDate = new Date(parseInt(miliseconds))
      return myDate.toLocaleDateString("en-US", options)
    },    
    async getAllAnnouncements() {
      try {
        const limit = 10
        const response = await this.axios.post('/api/announcement/all', {limit: limit})
        this.announcements = response.data.rows
      } catch (error) {
        console.log('Error on Admin.vue > getAllAnnouncements', error) // temp
      }
    },
    viewAnnouncement(announcement) {
      this.view_announcement = announcement
      this.hideDiv('announcementDashboard')
      this.showDiv('viewAnnouncementDiv')
    },    
    // end announcementDashboard-related

    // coursesDashboard-related
    async addCourse() {
      try {
        const response = await this.axios.post('/api/course/create', this.add_course)
        alert(response.data.message)
        this.updateCourses()
        this.hideDiv('addCourseDiv')
        this.showDiv('coursesDashboard')
      } catch (error) {
        console.log('Error on Ocs.vue > addCourse()', error)
        alert('Error')
      }
    },
    batchUploadCourses() {
    try {
      var myReader = new FileReader()
      if (this.$refs.batchUploadCSV_courses) {
        myReader.readAsText(this.$refs.batchUploadCSV_courses.files[0])
      }
      var thiss = this
      myReader.onload = async function(e) {
        var content = myReader.result;
        var lines = content.split("\r");
        thiss.batchUploadCoursesProgress += `\nRegistering ${lines.length-1} courses...`
        for (let count = 1; count < lines.length; count++) {
          // split each row content
          var rowContent = lines[count].split(",");
          var courseObj = {}
          if (count === 0) {
            // if header row
            courseObj.class_number = rowContent[0]
          } else {
            courseObj.class_number = rowContent[0].slice(1)
          }          
          courseObj.department = rowContent[1]
          courseObj.course_title = rowContent[2]
          courseObj.subject = rowContent[3]
          courseObj.catalog_no = rowContent[4]
          courseObj.section = rowContent[5]
          courseObj.component = rowContent[6]
          courseObj.schedule = rowContent[7]
          courseObj.learning_delivery_mode = rowContent[8]
          courseObj.room_assigned = rowContent[9]
          courseObj.instructor = rowContent[10]
          courseObj.class_capacity = rowContent[11]
          courseObj.restrictions = rowContent[12]
          courseObj.units = rowContent[13]
          courseObj.registration_type = 'batch'
          if (courseObj.class_number) {
            thiss.batchUploadCoursesProgress += `\nRegistering ${courseObj.class_number}`
            try {
              const response = await thiss.axios.post('/api/course/create', courseObj)
              thiss.batchUploadCoursesProgress += `\nSuccessfully registered ${courseObj.class_number}...`
            } catch (error) {
              thiss.batchUploadCoursesProgress += `\nError on registering ${courseObj.class_number}: ${JSON.stringify(error.response.data.message)}`
              console.log('Error on Ocs.vue > batchUploadCourses()s inner try catch', error)
              console.log('this is reached') // temp
            }
          }
        }
      }
    } catch (error) {
      console.log('Error on Admin.vue > batchRegister') // temp
      console.log(error) // temp
      alert('Error on batchRegister()') // temp
      thiss.batchUploadProgress += `Error on batchRegister(): ${error}` // temp
    }

    },
    clearAddCourseInputs() {
      this.add_course = {}
    },
    clearBatchUploadDiv_courses() {
      this.$refs.batchUploadCSV_courses.value = ''
      this.batchUploadCoursesProgress = ''
    },
    clearEditCourseInputs() {
      this.edit_course = {}
    },
    deleteCourse(course) {
      this.hideDiv('coursesDashboard')
      this.showDiv('deleteCourseDiv')
      this.delete_course = course
    },
    async deleteCourseAPI() {
      try {
        const response = await this.axios.post('/api/course/delete', this.delete_course)
        alert(response.data.message)
        this.delete_course = {}
        this.updateCourses()
        this.hideDiv('deleteCourseDiv')
        this.showDiv('coursesDashboard')
      } catch (error) {
        console.log('Error on Ocs.vue > deleteCourseAPI', error)
        alert('Error')
      }
    },    
    editCourse(course) {
      this.hideDiv('coursesDashboard')
      this.showDiv('editCourseDiv')
      this.edit_course = course    
    },
    async editCourseAPI() {
      try {
        const response = await this.axios.post('/api/course/update', this.edit_course)
        alert(response.data.message)
        this.edit_course = {}
        this.updateCourses()
        this.hideDiv('editCourseDiv')
        this.showDiv('coursesDashboard')
      } catch (error) {
        console.log('Error on Ocs.vue > editCourseAPI', error)
        alert('Error')
      }
    },
    async updateCourses() {
      try {
        const response = await this.axios.post('/api/course/read/all', {dept: this.dept})
        this.courses = response.data.rows
      } catch (error) {
        console.log('Error on Ocs.vue > updateCourses()', error)
      }
    },
    // end coursesDashboard-related

    // headerComponent-related
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        if (!response.data.role === 'ocs') {
          throw 'Not OCS'
        }
        this.user = response.data
      } catch (error) {
        console.log('Error on OCS.vue > authorize()', error) // temp
        location.href = '/'
      }
    },
    // end headerComponent-related

    // advisingDashboard-related
    formatted_course_code(course) {
      return `${course.subject} ${course.catalog_no}` 
    },
    async updateAdvisees() {
      try {
        const response = await this.axios.post('/api/ecf/read/all/OCS')
        this.advisees = response.data.rows
      } catch (error) {
        console.log('Error on Ocs.vue > updateAdvisees()', error)
        alert('Error on updateAdvisees()')
      }
    },
    totalUnits() {
      try {
        var sum = 0
        for (let i=0; i<this.view_advisee.ecf.length; i++) {
          sum += parseInt(this.view_advisee.ecf[i].units)
        }
        return sum
      } catch (error) {
        return 0
      }
    }, 
    async viewDetails(advisee) {
      try {
        // alert("Unfinished feature: Should display the selected student's ECF and other relevant info.")
        this.view_advisee = advisee
        // Get ECF
        const response2 = await this.axios.post('/api/ecf/read/all/student/ocsAcc', {student_up_mail: advisee.up_mail})
        this.view_advisee.ecf = response2.data.rows
        // end Get ECF
        this.hideDiv('advisingDashboard')
        this.showDiv('viewAdviseeDetailsDiv')
      } catch (error) {
        console.log('Error on viewDetails', error)
        alert('Error')
      }
    },         
    // end advisingDashboard-related
    // utility functions
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
    },
    // end utility functions
  },
  async mounted() {
    await this.authorize()
    await this.getAllAnnouncements()
    await this.updateCourses()
    await this.updateAdvisees()
  }
}
</script>

<template>
<ScheduleOfClasses :user="this.user" />
<div class="d-flex flex-column justify-content-between" style="min-height: 100vh;">
  <Header :user="this.user" />
  <!-- OCS Div -->
  <div class="align-items-center d-flex flex-column justify-content-center" style="background-color: lightgray; flex-grow: 1; gap: 20px; padding: 30px;">
    <!-- Menu Div -->
    <div ref="menuDiv" style="align-items: center; display: flex; flex-direction: column; gap: 20px;">
      <div class="d-flex hoverTransform">
        <span @click="hideDiv('menuDiv'); showDiv('announcementDashboard');" class="myButton2" style="background-color: rgb(117, 21, 24);">Announcement Dashboard</span>
      </div>
      <div class="d-flex hoverTransform">
        <span @click="hideDiv('menuDiv'); showDiv('coursesDashboard');" class="myButton2" style="background-color: rgb(117, 21, 24);">Courses Dashboard</span>
      </div>
      <div class="d-flex hoverTransform">
        <span @click="updateAdvisees(); hideDiv('menuDiv'); showDiv('advisingDashboard');" class="myButton2" style="background-color: rgb(117, 21, 24);">Advising Dashboard</span>
      </div>
    </div>
    <!-- end Menu Div -->
    <!-- Add Announcement Div -->
    <div ref="addAnnouncementDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Add Announcement Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Add Announcement Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Add Announcement Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-plus-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">New Announcement</span>
          <!-- end Add Announcement Header Left Div Icon -->
        </div>
        <!-- end Add Announcement Header Left Div -->
        <!-- Add Announcement Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="clearAddAnnouncementInputs(); hideDiv('addAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Add Announcement Header Right Div -->
      </div>
      <!-- end Add Announcement Header -->      
      <!-- Add Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Title</span>
        <input v-model="add_announcement.title" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Body</span>
        <!-- <input v-model="add_announcement.body" type="text" style="margin-bottom: 10px;"> -->
        <textarea v-model="add_announcement.body" type="text" style="margin-bottom: 10px; min-height: 300px;"></textarea>
        <!-- Add Button -->
          <div @click="addAnnouncement()" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Post Announcement</span>
          </div>
        <!-- end Add Button -->        
      </div>
      <!-- end Add Announcement Body -->
    </div>    
    <!-- end Add Announcement Div -->
    <!-- Delete Announcement Div -->
    <div ref="deleteAnnouncementDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Delete Announcement Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Delete Announcement Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Delete Announcement Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-x-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Delete Announcement</span>
          <!-- end Delete Announcement Header Left Div Icon -->
        </div>
        <!-- end Delete Announcement Header Left Div -->
        <!-- Delete Announcement Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="hideDiv('deleteAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Delete Announcement Header Right Div -->
      </div>
      <!-- end Delete Announcement Header -->
      <!-- Delete Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <!-- <span>Confirm Deletion</span>
        <span>Title</span>
        <span>{{this.del_announcement.title}}</span>
        <span>Created</span>
        <span>{{this.del_announcement.created}}</span>
        <span>Last Modified</span>
        <span>{{this.del_announcement.modified}}</span>
        <span>Body</span>
        <span>{{this.del_announcement.body}}</span> -->
        <span style="font-family: Open_Sans_Bold;">Title</span>
        <textarea disabled :value="del_announcement.title" style="overflow: auto; white-space: normal;"></textarea>
        <span style="font-family: Open_Sans_Bold;">Created</span>
        <textarea disabled style="overflow: auto;">{{this.formatted_date(this.del_announcement.created)}}</textarea>
        <span style="font-family: Open_Sans_Bold;">Last Modified</span>
        <textarea disabled style="overflow: auto;">{{this.formatted_date(this.del_announcement.modified)}}</textarea>
        <span style="font-family: Open_Sans_Bold;">Body</span>
        <span v-html="del_announcement.body" style="background-color: rgba(239, 239, 239, 0.3); border: 1px solid gray; cursor: normal; min-height: 300px; overflow: auto; white-space: normal;"></span>        
        <!-- <button @click="deleteAnnouncementAPI()">Delete</button> -->
        <!-- Delete Button -->
        <div @click="deleteAnnouncementAPI()" class="align-items-center d-flex justify-content-center hoverTransform">
          <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Delete Announcement</span>
        </div>
        <!-- end Delete Button -->          
      </div>
      <!-- end Delete Announcement Body -->      
    </div>
    <!-- end Delete Announcement Div -->
    <!-- Edit Announcement Div -->
    <div ref="editAnnouncementDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Edit Announcement Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Edit Announcement Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Edit Announcement Header Left Div Icon -->
          <i class="align-items-center bi bi-pencil-square d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Edit Announcement</span>
          <!-- end Edit Announcement Header Left Div Icon -->
        </div>
        <!-- end Edit Announcement Header Left Div -->
        <!-- Edit Announcement Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="hideDiv('editAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Edit Announcement Header Right Div -->
      </div>
      <!-- end Edit Announcement Header -->      
      <!-- Edit Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Title</span>
        <textarea v-model="edit_announcement.title" type="text" style="margin-bottom: 10px;"></textarea>
        <span style="font-family: Open_Sans_Bold;">Body</span>
        <textarea v-model="edit_announcement.body" type="text" style="margin-bottom: 10px; min-height: 300px;"></textarea>
        <!-- Edit Button -->
          <div @click="editAnnouncementAPI()" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Edit Announcement</span>
          </div>
        <!-- end Edit Button -->        
      </div>
      <!-- end Edit Announcement Body -->
    </div>    
    <!-- end Edit Announcement Div -->
    <!-- View Announcement Div -->
    <div ref="viewAnnouncementDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- View Announcement Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- View Announcement Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- View Announcement Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-post d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">View Announcement</span>
          <!-- end View Announcement Header Left Div Icon -->
        </div>
        <!-- end View Announcement Header Left Div -->
        <!-- View Announcement Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('viewAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end View Announcement Header Right Div -->
      </div>
      <!-- end View Announcement Header -->
      <!-- View Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Title</span>
        <textarea disabled :value="view_announcement.title" style="overflow: auto; white-space: normal;"></textarea>
        <span style="font-family: Open_Sans_Bold;">Created</span>
        <textarea disabled style="overflow: auto;">{{this.formatted_date(this.view_announcement.created)}}</textarea>
        <span style="font-family: Open_Sans_Bold;">Last Modified</span>
        <textarea disabled style="overflow: auto;">{{this.formatted_date(this.view_announcement.modified)}}</textarea>
        <span style="font-family: Open_Sans_Bold;">Body</span>
        <span v-html="view_announcement.body" style="background-color: rgba(239, 239, 239, 0.3); border: 1px solid gray; cursor: normal; min-height: 300px; overflow: auto; white-space: normal;"></span>
      </div>
      <!-- end View Announcement Body -->               
    </div>
    <!-- end View Announcement Div -->
    <!-- Announcement Dashboard -->
    <div ref="announcementDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: none; min-height: 300px; width: 1200px;">
      <!-- Announcement Dashboard Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Announcement Dashboard Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Announcement Dashboard Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-post d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Announcement Dashboard</span>
          <!-- end Announcement Dashboard Header Left Div Icon -->
        </div>
        <!-- end Announcement Dashboard Header Left Div -->
        <!-- Announcement Dashboard Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Add Announcement -->
          <div class="hoverTransform">
            <span @click="hideDiv('announcementDashboard'); showDiv('addAnnouncementDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">New Announcement</span>
          </div>
          <!-- end Add Announcement -->            
          <!-- Back to Menu -->
          <div class="hoverTransform">
            <span @click="hideDiv('announcementDashboard'); showDiv('menuDiv');" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Back to Menu</span>
          </div>
          <!-- end Back to Menu -->
        </div>
        <!-- end Announcement Dashboard Header Right Div -->
      </div>
      <!-- end Announcement Dashboard Header -->
      <!-- Announcement Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-responsive">
          <thead>
            <tr>
              <th class="align-middle text-center" scope="col">Title</th>
              <th class="align-middle text-center" scope="col">Last Modified</th>
              <th class="align-middle text-center" scope="col">Date Created</th>
              <th class="align-middle text-center" scope="col">Body</th>
              <th class="align-middle text-center" scope="col">View</th>
              <th class="align-middle text-center" scope="col">Edit</th>
              <th class="align-middle text-center" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in announcements" :key="index">
              <td class="text-start" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{announcements[index].title}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{this.formatted_date(announcements[index].modified)}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{this.formatted_date(announcements[index].created)}}</td>
              <!-- <td class="text-start" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis; white-space: pre-line;">{{announcements[index].body}}</td> -->
              <td v-html="announcements[index].body" class="text-start" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis; white-space: normal;"></td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View Button -->
                <div @click="viewAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto myButton1" style="background-color: #093405; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">View</span>
                </div>
                <!-- end View Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; position: relative; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Edit Button -->
                <div @click="editAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto myButton1" style="background-color: #7F6000; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">Edit</span>
                </div>
                <!-- end Edit Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Delete Button -->
                <div @click="deleteAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto myButton1" style="background-color: #751518; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">Delete</span>
                </div>
                <!-- end Delete Button -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end Announcement Dashboard Body -->
    </div>
    <!-- end Announcement Dashboard -->

    <!-- Courses Dashboard -->
    <div ref="coursesDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: none; min-height: 300px; width: 1200px;">
      <!-- Courses Dashboard Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Courses Dashboard Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Courses Dashboard Header Left Div Icon -->
          <i class="align-items-center bi bi-mortarboard-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Courses Dashboard</span>
          <!-- end Courses Dashboard Header Left Div Icon -->
        </div>
        <!-- end Courses Dashboard Header Left Div -->
        <!-- Courses Dashboard Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Batch Upload Button -->
          <div class="hoverTransform">
            <span @click="hideDiv('coursesDashboard'); clearBatchUploadDiv_courses(); showDiv('batchUploadCoursesDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Batch Upload</span>
          </div>
          <!-- end Batch Upload Button -->
          <!-- Add Course Button -->
          <div class="hoverTransform">
            <span @click="hideDiv('coursesDashboard'); showDiv('addCourseDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Add Course</span>
          </div>
          <!-- end Add Course Button -->  
          <div class="hoverTransform">
            <span @click="hideDiv('coursesDashboard'); showDiv('menuDiv');" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Back to Menu</span>
          </div>                  
        </div>
        <!-- end Courses Dashboard Header Right Div -->
      </div>
      <!-- end Courses Dashboard Header -->
      <!-- Courses Dashboard Body -->
      <div class="align-items-center d-flex flex-column myMainDiv1" style="padding: 20px; ">
        <!-- Courses Dashboard Header Div -->
        <span class="myHeading1">Schedule of Classes</span>
        <!-- end Courses Dashboard Header Div -->        
        <!-- Dept Dropdown -->
        <div>
          <span style="font-family: Open_Sans_Bold; margin-right: 5px;">Department: </span>
          <select @change="updateCourses()" v-model="dept" style="margin-bottom: 10px;">
            <option value="DAC">DAC</option>
            <option value="DB">DB</option>
            <option value="DBS">DBS</option>
            <option value="DPE">DPE</option>
            <option value="DPSM">DPSM</option>
            <option value="DSS">DSS</option>
            <option value="MM">MM</option>
          </select>     
        </div>      
        <!-- end Dept Dropdown -->        
        <!-- CoursesDashboard Table -->
          <table class="fixed-table-body table table-bordered table-responsive" style="margin-bottom: 0;">
            <thead>
              <tr>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Class Number</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Department</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Course Title</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Subject</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Catalog Number</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Section</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Component</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Schedule</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Learning Delivery Mode</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Room Assigned</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Instructor</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Class Capacity</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Restrictions</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Units</th>
                <th class="align-middle text-center" scope="col" style="font-size: 12px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(obj, index) in courses" :key="index">
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].class_number}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].department}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].course_title}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].subject}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].catalog_no}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].section}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].component}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].schedule}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].learning_delivery_mode}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].room_assigned}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].instructor}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].class_capacity}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].restrictions}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].units}}</td>
                <td class="text-center" style="overflow: auto; text-overflow: ellipsis;">
                  <div @click="editCourse(courses[index])" class="hoverTransform myButton1" style="background-color: #7F6000; font-family: Open_Sans; font-size: 12px;">Edit</div>
                  <div @click="deleteCourse(courses[index])" class="hoverTransform myButton1" style="background-color: #751518; font-family: Open_Sans; font-size: 12px;">Delete</div>
                </td>
              </tr>
            </tbody>
          </table>
        <!-- end CoursesDashboard Table -->
      </div>
      <!-- end Courses Dashboard Body -->
    </div>
    <!-- end Courses Dashboard -->

    <!-- Batch Upload Courses Div -->
    <div ref="batchUploadCoursesDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Batch Upload Courses Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Batch Upload Courses Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Batch Upload Courses Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-plus-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Batch Upload Courses</span>
          <!-- end Batch Upload Courses Header Left Div Icon -->
        </div>
        <!-- end Batch Upload Courses Header Left Div -->
        <!-- Batch Upload Courses Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('batchUploadCoursesDiv'); updateCourses(); showDiv('coursesDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end Batch Upload Courses Header Right Div -->
      </div>
      <!-- end Batch Upload Courses Header -->
      <!-- Batch Upload Courses Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Upload CSV containing courses</span>
        <input ref="batchUploadCSV_courses" type="file">
        <div @click="batchUploadCourses()" class="hoverTransform" style="align-self: center;">
          <span style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Batch Upload Courses</span>
        </div>
        <span>Current Progress: <span style="white-space: pre-line">{{batchUploadCoursesProgress}}</span></span>
      </div>
      <!-- end Batch Upload Courses Body -->
    </div>
    <!-- end Batch Upload Courses Div -->    

    <!-- Add Course Div -->
    <div ref="addCourseDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Add Course Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Add Course Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Add Course Header Left Div Icon -->
          <i class="align-items-center bi bi-file-earmark-plus-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Add Course</span>
          <!-- end Add Course Header Left Div Icon -->
        </div>
        <!-- end Add Course Header Left Div -->
        <!-- Add Course Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="clearAddCourseInputs(); hideDiv('addCourseDiv'); showDiv('coursesDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Add Course Header Right Div -->
      </div>
      <!-- end Add Course Header -->      
      <!-- Add Course Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Class Number</span>
        <input v-model="add_course.class_number" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Department</span>
        <!-- <input v-model="add_course.department" type="text" style="margin-bottom: 10px;"> -->
        <select v-model="add_course.department" style="margin-bottom: 10px;">
          <option value="dac">DAC</option>
          <option value="dpsm">DPSM</option>
          <option value="db">DB</option>
          <option value="dbs">DBS</option>
          <option value="dpe">DPE</option>
          <option value="dss">DSS</option>
          <option value="mm">MM</option>
        </select>
        <span style="font-family: Open_Sans_Bold;">Course Title</span>
        <input v-model="add_course.course_title" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Subject</span>
        <input v-model="add_course.subject" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Catalog Number</span>
        <input v-model="add_course.catalog_no" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Section</span>
        <input v-model="add_course.section" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Component</span>
        <input v-model="add_course.component" type="text" style="margin-bottom: 10px;">        
        <span style="font-family: Open_Sans_Bold;">Schedule</span>
        <input v-model="add_course.schedule" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Learning Delivery Mode</span>
        <input v-model="add_course.learning_delivery_mode" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Room Assigned</span>
        <input v-model="add_course.room_assigned" type="text" style="margin-bottom: 10px;">        
        <span style="font-family: Open_Sans_Bold;">Instructor</span>
        <input v-model="add_course.instructor" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Class Capacity</span>
        <input v-model="add_course.class_capacity" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Restrictions</span>
        <input v-model="add_course.restrictions" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Units</span>
        <input v-model="add_course.units" type="text" style="margin-bottom: 10px;">                             
        <!-- Add Button -->
          <div @click="addCourse()" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Add Course</span>
          </div>
        <!-- end Add Button -->        
      </div>
      <!-- end Add Course Body -->
    </div>    
    <!-- end Add Course Div -->

    <!-- Edit Course Div -->
    <div ref="editCourseDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Edit Course Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Edit Course Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Edit Course Header Left Div Icon -->
          <i class="align-items-center bi bi-pencil-square d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Edit Course</span>
          <!-- end Edit Course Header Left Div Icon -->
        </div>
        <!-- end Edit Course Header Left Div -->
        <!-- Edit Course Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="clearEditCourseInputs(); hideDiv('editCourseDiv'); showDiv('coursesDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Edit Course Header Right Div -->
      </div>
      <!-- end Edit Course Header -->      
      <!-- Edit Course Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Class Number</span>
        <input disabled v-model="this.edit_course.class_number" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Department</span>
        <input disabled v-model="this.edit_course.department" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Course Title</span>
        <input disabled v-model="this.edit_course.course_title" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Subject</span>
        <input disabled v-model="this.edit_course.subject" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Catalog Number</span>
        <input disabled v-model="this.edit_course.catalog_no" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Section</span>
        <input v-model="this.edit_course.section" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Schedule</span>
        <input v-model="this.edit_course.schedule" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Learning Delivery Mode</span>
        <input v-model="this.edit_course.learning_delivery_mode" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Instructor</span>
        <input v-model="this.edit_course.instructor" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Class Capacity</span>
        <input v-model="this.edit_course.class_capacity" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Restrictions</span>
        <input v-model="this.edit_course.restrictions" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Units</span>
        <input v-model="this.edit_course.units" type="text" style="margin-bottom: 10px;">                     
        <!-- Edit Button -->
          <div @click="editCourseAPI()" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Edit Course</span>
          </div>
        <!-- end Edit Button -->        
      </div>
      <!-- end Edit Course Body -->
    </div>    
    <!-- end Edit Course Div -->    

    <!-- Delete Course Div -->
    <div ref="deleteCourseDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Delete Course Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Delete Course Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Dekete Course Header Left Div Icon -->
          <i class="align-items-center bi bi-file-x-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Delete Course</span>
          <!-- end Delete Course Header Left Div Icon -->
        </div>
        <!-- end Delete Course Header Left Div -->
        <!-- Delete Course Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="hideDiv('deleteCourseDiv'); showDiv('coursesDashboard')" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Delete Course Header Right Div -->
      </div>
      <!-- end Delete Course Header -->      
      <!-- Delete Course Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Class Number</span>
        <input disabled v-model="this.delete_course.class_number" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Department</span>
        <input disabled v-model="this.delete_course.department" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Course Title</span>
        <input disabled v-model="this.delete_course.course_title" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Subject</span>
        <input disabled v-model="this.delete_course.subject" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Catalog Number</span>
        <input disabled v-model="this.delete_course.catalog_no" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Section</span>
        <input disabled v-model="this.delete_course.section" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Component</span>
        <input disabled v-model="this.delete_course.component" type="text" style="margin-bottom: 10px;">        
        <span style="font-family: Open_Sans_Bold;">Schedule</span>
        <input disabled v-model="this.delete_course.schedule" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Learning Delivery Mode</span>
        <input disabled v-model="this.delete_course.learning_delivery_mode" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Room Assigned</span>
        <input disabled v-model="this.delete_course.room_assigned" type="text" style="margin-bottom: 10px;">        
        <span style="font-family: Open_Sans_Bold;">Instructor</span>
        <input disabled v-model="this.delete_course.instructor" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Class Capacity</span>
        <input disabled v-model="this.delete_course.class_capacity" type="text" style="margin-bottom: 10px;"> 
        <span style="font-family: Open_Sans_Bold;">Restrictions</span>
        <input disabled v-model="this.delete_course.restrictions" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Units</span>
        <input disabled v-model="this.delete_course.units" type="text" style="margin-bottom: 10px;">                             
        <!-- Delete Button -->
          <div @click="deleteCourseAPI()" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Delete Course</span>
          </div>
        <!-- end Delete Button -->        
      </div>
      <!-- end Dekete Course Body -->
    </div>    
    <!-- end Delete Course Div -->  

    <!-- Advising Dashboard -->
    <div class="align-items-center d-flex justify-content-center" style="background-color: lightgray; padding: 30px;">
      <div ref="advisingDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: none; min-height: 300px;">
        <!-- Advising Dashboard Header -->
        <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
          <!-- Advising Dashboard Header Left Div -->
          <div class="align-items-center d-flex flex-row" style="gap: 5px;">
            <!-- Advising Dashboard Header Left Div Icon -->
            <i class="align-items-center bi bi-people-fill d-flex" style="color: white; font-size: 20px;"></i>
            <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Advising Dashboard</span>
            <!-- end Advising Dashboard Header Left Div Icon -->
          </div>
          <!-- end Advising Dashboard Header Left Div -->
        </div>
        <!-- end Advising Dashboard Header -->
        <!-- Advising Dashboard Body -->
        <div style="padding: 15px 20px;">

          <!-- Pagination Div -->
          <div style="display: flex; flex-direction: row; gap: 20px; margin: 20px;">
            <!-- Pages -->
            <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 20px 15px;">
              <span>Total students: <b>{{this.studentsCount}}</b></span>
              <span>Showing <input type="number" v-model="this.resultsLimit" style="text-align: center; width: 50px;"> results per page</span>
              <div style="display: flex; flex-direction: row; gap: 10px;">
                <div class="hoverTransform">
                  <span @click="this.previousPage()" v-if="this.currentPage_static > 1" class="myButton1" style="background-color: #751518;">
                    <i class="bi bi-caret-left-fill"></i>
                  </span>
                </div>
                <span>Page <input v-model="this.currentPage" type="number" style="text-align: center; width: 50px;"> of {{this.pages}}</span>
                <div class="hoverTransform">
                  <span @click="this.nextPage()" v-if="this.currentPage_static < this.pages" class="myButton1" style="background-color: #751518;">
                    <i class="bi bi-caret-right-fill"></i>
                  </span>
                </div>            
              </div>
              <div>
                <div class="hoverTransform" style="margin-top: 5px;">
                  <span @click="getAllUsers()" class="myButton1" style="background-color: #751518;">Apply</span>
                </div>                                 
              </div>
            </div>
            <!-- end Pages -->
            <!-- Sort and Filter -->
            <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 15px;">
              <span style="font-family: Open_Sans_Bold;">Sort</span>
              <div style="display: flex; flex-direction: row; gap: 10px;">
                <select v-model="sortBy" @change="getAllUsers()">
                  <option value=""></option>
                  <option value="up_mail">UP Mail</option>
                  <option value="first_name">First Name</option>
                  <option value="last_name">Last Name</option>
                  <option value="degree_program">Degree Program</option>
                  <option value="sais_id">SAIS ID</option>
                  <option value="student_number">Student Number</option>
                  <option value="adviser_up_mail">Adviser's UP Mail</option>
                  <option value="curriculum_progress">Curriculum Progress</option>
                  <option value="advising_status">Advising Status</option>
                </select>
                <select v-model="sortOrder" @change="getAllUsers()">
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </select>
              </div>
              <div><div style="line-height: 1; margin-top: 10px;"><span style="font-family: Open_Sans_Bold;">Filter by</span></div></div>
              <select v-model="filterBy" @change="getAllUsers()">
                <option value=""></option>
                <option value="degree_program">Degree Program</option>
                <option value="adviser_up_mail">Adviser</option>
                <option value="curriculum_progress">Curriculum Progress</option>
                <option value="advising_status">Advising Status</option>
              </select>
              <select>
                <option value=""></option>
                <option value="UNFINISHED1">UNFINISHED1</option>
                <option value="UNFINISHED2">UNFINISHED2</option>
                <option value="UNFINISHED3">UNFINISHED3</option>
              </select>   
            </div>           
            <!-- end Sort and Filter -->
            <!-- Search -->
            <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 15px;">
              <span style="font-family: Open_Sans_Bold;">Search Current Page</span>
              <div style="align-items: center; display: flex; flex-direction: row; gap: 5px;">
                <input v-model="searchString" type="text">
                <div @click="clearSearchField()" v-if="this.searchString !== ''" class="hoverTransform">
                  <span class="align-items-center d-flex myButton1" style="background-color: #751518; padding: 3px 7px;">Clear</span>
                </div>            
              </div>
              <div>
                <div @click="getAllUsers()" class="hoverTransform" style="margin-top: 5px;">
                  <span class="myButton1" style="background-color: #751518;">Search</span>
                </div>
              </div>
            </div>
            <!-- end Search -->
          </div>
          <!-- end Pagination Div -->


          <table class="fixed-table-body table table-bordered table-responsive" style="table-layout: fixed;">
            <thead>
              <tr>
                <th class="align-middle text-center" scope="col">UP Mail</th>
                <th class="align-middle text-center" scope="col">Last Name</th>
                <th class="align-middle text-center" scope="col">First Name</th>
                <th class="align-middle text-center" scope="col">Middle Name</th>
                <th class="align-middle text-center" scope="col">Degree Program</th>
                <th class="align-middle text-center" scope="col">SAIS ID</th>
                <th class="align-middle text-center" scope="col">Student Number</th>
                <th class="align-middle text-center" scope="col">Adviser's UP Mail</th>
                <th class="align-middle text-center" scope="col">Curriculum Progress</th>
                <th class="align-middle text-center" scope="col">Advising Status</th>
                <th class="align-middle text-center" scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(obj, index) in advisees" :key="index">
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].up_mail}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].last_name}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].first_name}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].middle_name}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap;">{{advisees[index].degree_program}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].sais_id}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].student_number}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: lowercase; white-space: nowrap;">{{advisees[index].adviser_up_mail}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].step1_status}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].step2_status}}</td>
                <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <!-- View Details Button -->
                  <div @click="viewDetails(advisees[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                    <span class="myButton1" style="background-color: #093405;">View</span>
                  </div>
                  <!-- end View Details Button -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- end Adviser Dashboard Body -->      
      </div>
      <!-- View Advisee Details Div -->
      <div ref="viewAdviseeDetailsDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; min-width: 700px;">
        <!-- View Advisee Details Header -->
        <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
          <!-- View Advisee Details Header Left Div -->
          <div class="align-items-center d-flex flex-row" style="gap: 5px;">
            <!-- View Advisee Details Header Left Div Icon -->
            <i class="align-items-center bi bi-person-bounding-box d-flex" style="color: white; font-size: 20px;"></i>
            <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">View Student</span>
            <!-- end View Advisee Details Header Left Div Icon -->
          </div>
          <!-- end View Advisee Details Header Left Div -->
          <!-- View Advisee Details Header Right Div -->
          <div class="align-items-center d-flex flex-row" style="gap: 10px;">
            <!-- Close -->
            <div class="hoverTransform">
              <span @click="hideDiv('viewAdviseeDetailsDiv'); showDiv('advisingDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
            </div>
            <!-- end Close -->          
          </div>
          <!-- end View Advisee Details Header Right Div -->
        </div>
        <!-- end View Advisee Details Header -->
        <!-- View Advisee Details Body -->
        <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
          <span style="font-weight: normal;">UP Mail: <span style="font-weight: bold;">{{this.view_advisee.up_mail}}</span></span>
          <span style="font-weight: normal;">Last Name: <span style="font-weight: bold;">{{this.view_advisee.last_name}}</span></span>
          <span style="font-weight: normal;">First Name: <span style="font-weight: bold;">{{this.view_advisee.first_name}}</span></span>
          <span style="font-weight: normal;">Middle Name: <span style="font-weight: bold;">{{this.view_advisee.middle_name}}</span></span>
          <span style="font-weight: normal;">Degree Program: <span style="font-weight: bold; text-transform: uppercase;">{{this.view_advisee.degree_program}}</span></span>
          <span style="font-weight: normal;">SAIS ID: <span style="font-weight: bold;">{{this.view_advisee.sais_id}}</span></span>
          <span style="font-weight: normal;">Student Number: <span style="font-weight: bold;">{{this.view_advisee.student_number}}</span></span>
          <span style="font-weight: normal;">Adviser's UP Mail: <span style="font-weight: bold;">{{this.view_advisee.adviser_up_mail}}</span></span>
          <!-- ECF -->
          <!-- ECF: {{ this.view_advisee.ecf }} -->
          <div style="margin-bottom: 10px;">
            <div class="text-center" style="margin-bottom: 10px;"><span style="font-family: Open_Sans_Bold; font-size: 20px;">Enrollment Checklist Form</span></div>          
            <table class="table table-bordered" style="background-color: white; table-layout: fixed;">
              <thead>
                <tr>
                  <th class="align-middle text-center" scope="col">Class Number</th>
                  <th class="align-middle text-center" scope="col">Course Code</th>
                  <th class="align-middle text-center" scope="col">Section</th>
                  <th class="align-middle text-center" scope="col">Units</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj, index) in view_advisee.ecf" :key="index">
                  <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{view_advisee.ecf[index].class_number}}</td>
                  <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{formatted_course_code(view_advisee.ecf[index])}}</td>
                  <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{view_advisee.ecf[index].section}}</td>
                  <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{view_advisee.ecf[index].units}}</td>
                </tr>
              </tbody>
            </table>
            <div class="text-center" style="font-size: 18px; font-family: Open_Sans_Bold;">Total Units: {{totalUnits()}}</div>
          </div>
          <!-- end ECF -->
          <div class="align-items-center d-flex flex-column justify-content-center">
            <div class="alert alert-primary text-center" style="font-family: Open_Sans_Bold; font-size: 20px; text-transform: capitalize;">
              Advising Status: {{this.view_advisee.step2_status}}
            </div>
          </div>
          <!-- Actions -->
          <!-- <div class="align-items-center d-flex flex-row justify-content-center" style="gap: 15px;">
            <div @click="updateStatus('Waiting for Revision')" class="hoverTransform myButton2" style="background-color: #7F6000">For Revision</div>
            <div @click="updateStatus('Approved')" class="hoverTransform myButton2" style="background-color: #093405">Approve</div>
          </div> -->
          <!-- end Actions -->
        </div>
        <!-- end View Advisee Details Body -->
      </div>
      <!-- end View Advisee Details Div -->    
    </div>
    <!-- end Adviser Dashboard -->

  </div>
  <!-- end Admin Div -->
  <Footer />
</div>
</template>

<style scoped>
span, td {
  line-height: 1;
}
/* always show arrows input type number */
input[type=number]::-webkit-inner-spin-button {
  opacity: 1
}
td {
  vertical-align: middle;
}
.myHeading1 {
  font-family: Open_Sans_Bold;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 10px;
}
.myMainDiv1 {
  background-color: white;
  border-radius: 5px;
  padding: 20px;
}
</style>