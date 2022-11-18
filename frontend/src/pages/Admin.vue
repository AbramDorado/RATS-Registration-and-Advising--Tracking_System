<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  name: 'Admin',
  components: {
    Header, Footer
  },
  data () {
    return {
      addAnnouncementDisabled: false, // For spam handling addAnnouncement()
      add_announcement: { // Used in addAnnouncement()
        title: '',
        body: ''
      },
      announcements: [], // Main list of rows shown in announcement table
      batchUploadProgress: '', // Shows log/history of batch upload
      currentPage: 1, // v-model with input; used in pagination
      currentPage_static: 1, // Corrected value
      del_announcement: {}, // Used in deleteAnnouncement() and deleteAnnouncementAPI()
      del_user_role: '', // Used in deleteUser() and deleteUserAPI()
      del_user_up_mail: '', // Used in deleteUser() and deleteUserAPI()
      del_user_first_name: '', // Used in deleteUser() and deleteUserAPI()
      del_user_last_name: '', // Used in deleteUser() and deleteUserAPI()
      deleteAnnouncementDisabled: false, // For spam handling deleteAnnouncementAPI()
      deleteUserDisabled: false, // For spam-handling deleteUserAPI()
      edit_announcement: {}, // Used in editAnnouncement(), v-model'ed to changes
      edit_announcement_original: {}, // Used in editAnnouncement(), stores the original content before editing
      edit_role: '', // Used in editUser()
      edit_up_mail: '', // Used in editUser()
      edit_first_name: '', // Used in editUser()
      edit_last_name: '', // Used in editUser()
      filterByRole: '', // Passed in getAllUsers API
      reg_role: '', // Used in registerUser()
      reg_up_mail: '', // Used in registerUser()
      reg_first_name: '', // Used in registerUser()
      reg_last_name: '', // Used in registerUser()
      registerUserDisabled: false, // For spam-handling registerUser()
      resultsLimit: 50, // v-model with input; used in pagination
      resultsLimit_static: 50, // Correct value
      searchString: '', // Passed in getAllUsers API
      sortBy: 'role', // Passed in getAllUsers API
      sortOrder: 'ASC', // Passed in getAllUsers API
      user: {}, // Stores response of authorizeAPI; passed as prop in Header component
      users: [], // Main list of rows shown in users table
      usersCount: 0, // Stores reponse of countUsers API
      view_announcement: {}, // Used in viewAnnouncement()
      view_user: {} // Used in viewUser()
    }
  },
  computed: {
    pages() { // Returns number of pages needed to store all rows in groups 
      return Math.ceil(this.usersCount / this.resultsLimit_static)
    }
  },
  methods: {
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
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        if (!response.data.role === 'admin') {
          throw 'Not admin'
        }
        this.user = response.data
      } catch (error) {
        console.log('Error on Admin.vue > authorize()', error) // temp
        location.href = '/'
      }
    },
    batchRegister() {
      try {
        var myReader = new FileReader()
        if (this.$refs.batchUploadCSV) {
          myReader.readAsText(this.$refs.batchUploadCSV.files[0])
        }
        var thiss = this
        myReader.onload = async function(e) {
          var content = myReader.result;
          var lines = content.split("\r");
          thiss.batchUploadProgress += `\nRegistering ${lines.length-1} users...`
          for (let count = 1; count < lines.length; count++) {
            // split each row content
            var rowContent = lines[count].split(",");
            var userObj = {}
            if (count === 0) {
              // if header row
              userObj.role = rowContent[0]
            } else {
              userObj.role = rowContent[0].slice(1)
            }
            userObj.up_mail = rowContent[1]
            userObj.first_name = rowContent[2]
            userObj.last_name = rowContent[3]
            thiss.batchUploadProgress += `\nRegistering ${userObj.up_mail}...`
            try {
              const response = await thiss.axios.post('/api/register', userObj)
              thiss.batchUploadProgress += `\nSuccessfully registered ${userObj.up_mail}...`
            } catch (error) {
              thiss.batchUploadProgress += `\nError on registering ${userObj.up_mail}: ${error.response.data}`
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
    clearAddAnnouncementInputs() {
      this.add_announcement.title = ''
      this.add_announcement.body = ''
    },    
    clearBatchUploadDiv() {
      this.$refs.batchUploadCSV.value = ''
      this.batchUploadProgress = ''
    },
    clearRegisterUserInputs() {
      this.reg_role = ''
      this.reg_up_mail = ''
      this.reg_first_name = ''
      this.reg_last_name = ''
    },
    consoleLog(msg) {
      console.log(msg)
    },
    async correctLimits() {
      this.currentPage_static = this.currentPage
      this.resultsLimit_static = this.resultsLimit
      if (this.currentPage_static < 1) {
        this.currentPage_static = 1
        this.currentPage = 1
      }
      if (this.currentPage_static > this.pages) {
        this.currentPage_static = this.pages
        this.currentPage = this.pages
      }
      if (this.resultsLimit_static < 1) {
        this.resultsLimit_static = 1
        this.resultsLimit = 1
      }
      if (this.resultsLimit_static > 200) {
        this.resultsLimit_static = 200
        this.resultsLimit = 200
      }
      if (this.resultsLimit_static > this.usersCount) {
        this.resultsLimit_static = this.usersCount
        this.resultsLimit = this.usersCount
      }
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
    deleteUser(userToDelete) {
      this.hideDiv('usersDashboard')
      this.showDiv('deleteUserDiv')
      this.del_user_role = userToDelete.role
      this.del_user_up_mail = userToDelete.up_mail
      this.del_user_first_name = userToDelete.first_name
      this.del_user_last_name = userToDelete.last_name
    },
    async deleteUserAPI() {
      if (this.deleteUserDisabled) {
        return
      }
      try {
        this.deleteUserDisabled = true
        const userToDelete = {}
        userToDelete.role = this.del_user_role
        userToDelete.up_mail = this.del_user_up_mail
        userToDelete.first_name = this.del_user_first_name
        userToDelete.last_name = this.del_user_last_name
        const response = await this.axios.post('/api/deleteUser', userToDelete)
        await this.getAllUsers()
        this.hideDiv('deleteUserDiv')
        this.showDiv('usersDashboard')        
        this.deleteUserDisabled = false
      } catch (error) {
        console.log('Error on Admin.vue > deleteUser', error) // temp
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
    editUser(user) {
      this.edit_role = user.role
      this.edit_up_mail = user.up_mail
      this.edit_first_name = user.first_name
      this.edit_last_name = user.last_name
      this.hideDiv('usersDashboard')
      this.showDiv('editUserDiv')
    },
    async editUserAPI(role, up_mail, first_name, last_name) {
      try {
        if (!role || !up_mail || !first_name || !last_name) {
          alert('Input cannot be blank') // temp
          return
        } else {
          const body = {role: role, up_mail: up_mail, first_name: first_name, last_name: last_name}
          const response = await this.axios.post('/api/editUser', body)
          await this.getAllUsers()
          this.hideDiv('editUserDiv');
          this.showDiv('usersDashboard')
        }
      } catch(error) {
        console.log('Error on Admin.vue > editUserAPI', error) // temp
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
    async getAllUsers() {
      try {
        await this.getUsersCount()
        await this.correctLimits()
        const response = await this.axios.post('/api/getUsers', {column: this.sortBy, order: this.sortOrder, offset: (this.currentPage_static-1) * this.resultsLimit_static, limit: this.resultsLimit_static, searchString: this.searchString, filterByRole: this.filterByRole})
        this.users = response.data
      } catch (error) {
        console.log('Error on Admin.vue > getAllUsers', error) // temp
      }
    },
    async getUsersCount() {
      try {
        const response = await this.axios.post('/api/countUsers', {filterByRole: this.filterByRole})
        this.usersCount = response.data.count
      } catch (error) {
        console.log('Error on Admin.vue > getUsersCount', error) // temp
      }
    },
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    async nextPage() {
      if (this.currentPage < this.pages) {
        this.currentPage++
        this.getAllUsers()
      }
    },
    async previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.getAllUsers()
      }
    },
    async registerUser(role, up_mail, first_name, last_name) {
      try {
        if (this.registerUserDisabled) {
          return
        } else if (!role || !up_mail || !first_name || !last_name) {
          alert('Input cannot be blank')
          return
        } else {
          this.registerUserDisabled = true
          const body = {role: role, up_mail: up_mail, first_name: first_name, last_name: last_name}
          const response = await this.axios.post('/api/register', body)
          await this.getAllUsers()
          this.clearRegisterUserInputs();
          this.registerUserDisabled = false
          this.hideDiv('registerUserDiv');
          this.showDiv('usersDashboard')
        }
      } catch (error) {
        console.log('Error on Admin.vue > registerUser', error) // temp
        alert('Error on register') // temp
        this.registerUserDisabled = false
      }
    },
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
    },
    viewUser(user) {
      this.view_user = user
      this.hideDiv('usersDashboard')
      this.showDiv('viewUserDiv')
      // To do: Retrieve other info, needs advising module
    },
    viewAnnouncement(announcement) {
      this.view_announcement = announcement
      this.hideDiv('announcementDashboard')
      this.showDiv('viewAnnouncementDiv')
    },
  },
  async mounted() {
    await this.authorize()
    await this.getAllUsers()
    await this.getAllAnnouncements()
  }
}
</script>

<template>
<div class="d-flex flex-column justify-content-between" style="min-height: 100vh;">
  <Header :user="this.user" />
  <!-- Admin Div -->
  <div class="align-items-center d-flex flex-column justify-content-center" style="background-color: white; gap: 20px; padding: 30px;">
    <!-- Menu Div -->
    <div ref="menuDiv">
      Menu Div
      <a @click="hideDiv('menuDiv'); showDiv('announcementDashboard');" href="#">Announcement Dashboard</a>
      <a @click="hideDiv('menuDiv'); showDiv('usersDashboard');" href="#">User Dashboard</a>
    </div>
    <!-- end Menu Div -->
    <!-- Batch Upload Div -->
    <div ref="batchUploadDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Batch Upload Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Batch Upload Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Batch Upload Header Left Div Icon -->
          <i class="align-items-center bi bi-person-plus-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Batch Upload Users</span>
          <!-- end Batch Upload Header Left Div Icon -->
        </div>
        <!-- end Batch Upload Header Left Div -->
        <!-- Batch Upload Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('batchUploadDiv'); getAllUsers(); showDiv('usersDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end Batch Upload Header Right Div -->
      </div>
      <!-- end Batch Upload Header -->
      <!-- Batch Upload Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Upload CSV containing users</span>
        <input ref="batchUploadCSV" type="file">
        <button @click="batchRegister()">Batch Register</button>
        <span>Current Progress: <span style="white-space: pre-line">{{batchUploadProgress}}</span></span>
      </div>
      <!-- end Batch Upload Body -->
    </div>
    <!-- end Batch Upload Div -->
    <!-- Delete User Div -->
    <div ref="deleteUserDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Delete User Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Delete User Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Delete User Header Left Div Icon -->
          <i class="align-items-center bi bi-person-x-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Delete User</span>
          <!-- end Delete User Header Left Div Icon -->
        </div>
        <!-- end Delete User Header Left Div -->
        <!-- Delete User Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="hideDiv('deleteUserDiv'); showDiv('usersDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Delete User Header Right Div -->
      </div>
      <!-- end Delete User Header -->
      <!-- Delete User Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span>Confirm Deletion</span>
        <span>Role: <span style="text-transform: capitalize;">{{this.del_user_role}}</span></span>
        <span>UP Mail: <span>{{this.del_user_up_mail}}</span></span>
        <span>First Name: <span style="text-transform: capitalize;">{{this.del_user_first_name}}</span></span>
        <span>Last Name: <span style="text-transform: capitalize;">{{this.del_user_last_name}}</span></span>
        <button @click="deleteUserAPI()">Delete</button>
      </div>
      <!-- end Delete User Body -->      
    </div>
    <!-- end Delete User Div -->
    <!-- Edit User Div -->
    <div ref="editUserDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Edit User Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Edit User Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Edit User Header Left Div Icon -->
          <i class="align-items-center bi bi-pencil-square d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Edit User</span>
          <!-- end Edit User Header Left Div Icon -->
        </div>
        <!-- end Edit User Header Left Div -->
        <!-- Edit User Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="hideDiv('editUserDiv'); showDiv('usersDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Edit User Header Right Div -->
      </div>
      <!-- end Edit User Header -->      
      <!-- Edit User Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <!-- Column -->
        <div class="d-flex flex-row" style="gap: 70px;">
          <!-- Rows -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">Role</span>
            <select v-model="edit_role" style="margin-bottom: 10px;">
              <option value="admin">Admin</option>
              <option value="adviser">Adviser</option>
              <option value="student">Student</option>
            </select>
            <span style="font-family: Open_Sans_Bold;">First Name</span>
            <input v-model="edit_first_name" type="text" style="margin-bottom: 10px;">
          </div>
          <!-- end Rows -->
          <!-- Rows -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">UP Mail</span>
            <input disabled v-model="edit_up_mail" type="text" style="margin-bottom: 10px;">
            <span style="font-family: Open_Sans_Bold;">Last Name</span>
            <input v-model="edit_last_name" type="text" style="margin-bottom: 10px;">
          </div>
          <!-- end Rows -->
        </div>
        <!-- end Column -->
        <!-- Edit Button -->
          <div @click="editUserAPI(this.edit_role, this.edit_up_mail, this.edit_first_name, this.edit_last_name)" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Edit User</span>
          </div>
        <!-- end Edit Button -->        
      </div>
      <!-- end Edit User Body -->
    </div>    
    <!-- end Edit User Div -->
    <!-- Register User Div -->
    <div ref="registerUserDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- Register User Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Register User Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Register User Header Left Div Icon -->
          <i class="align-items-center bi bi-person-plus-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Register User</span>
          <!-- end Register User Header Left Div Icon -->
        </div>
        <!-- end Register User Header Left Div -->
        <!-- Register User Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Cancel -->
          <div class="hoverTransform">
            <span @click="clearRegisterUserInputs(); hideDiv('registerUserDiv'); showDiv('usersDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Register User Header Right Div -->
      </div>
      <!-- end Register User Header -->      
      <!-- Register User Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <!-- Column -->
        <div class="d-flex flex-row" style="gap: 70px;">
          <!-- Rows -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">Role</span>
            <select v-model="reg_role" style="margin-bottom: 10px;">
              <option value="admin">Admin</option>
              <option value="adviser">Adviser</option>
              <option value="student">Student</option>
            </select>
            <span style="font-family: Open_Sans_Bold;">First Name</span>
            <input v-model="reg_first_name" type="text" style="margin-bottom: 10px;">
          </div>
          <!-- end Rows -->
          <!-- Rows -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">UP Mail</span>
            <input v-model="reg_up_mail" type="text" style="margin-bottom: 10px;">
            <span style="font-family: Open_Sans_Bold;">Last Name</span>
            <input v-model="reg_last_name" type="text" style="margin-bottom: 10px;">
          </div>
          <!-- end Rows -->
        </div>
        <!-- end Column -->
        <!-- Register Button -->
          <div @click="registerUser(this.reg_role, this.reg_up_mail, this.reg_first_name, this.reg_last_name)" class="align-items-center d-flex justify-content-center hoverTransform">
            <span style="background-color: #093405; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Register User</span>
          </div>
        <!-- end Register Button -->        
      </div>
      <!-- end Register User Body -->
    </div>    
    <!-- end Register User Div -->
    <!-- View User Div -->
    <div ref="viewUserDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 700px;">
      <!-- View User Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- View User Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- View User Header Left Div Icon -->
          <i class="align-items-center bi bi-person-bounding-box d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">View User</span>
          <!-- end View User Header Left Div Icon -->
        </div>
        <!-- end View User Header Left Div -->
        <!-- View User Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('viewUserDiv'); showDiv('usersDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end View User Header Right Div -->
      </div>
      <!-- end View User Header -->
      <!-- View User Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span>Role</span>
        <span>{{this.view_user.role}}</span>
        <span>UP Mail</span>
        <span>{{this.view_user.up_mail}}</span>
        <span>First Name</span>
        <span>{{this.view_user.first_name}}</span>
        <span>Last Name</span>
        <span>{{this.view_user.last_name}}</span>
        <!-- Add Other Info Here -->
        <span>Add Other Info Here</span>
      </div>
      <!-- end View User Body -->      
    </div>
    <!-- end View User Div -->    
    <!-- Users Dashboard -->
    <div ref="usersDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: none; min-height: 300px; width: 1200px;">
      <a @click="hideDiv('usersDashboard'); showDiv('menuDiv');" href="#">Back to Menu</a>
      <!-- Users Dashboard Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Users Dashboard Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Users Dashboard Header Left Div Icon -->
          <i class="align-items-center bi bi-people-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Users Dashboard</span>
          <!-- end Users Dashboard Header Left Div Icon -->
        </div>
        <!-- end Users Dashboard Header Left Div -->
        <!-- Users Dashboard Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Batch Upload -->
          <div class="hoverTransform">
            <span @click="hideDiv('usersDashboard'); clearBatchUploadDiv(); showDiv('batchUploadDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Batch Upload</span>
          </div>
          <!-- end Batch Upload -->
          <!-- Register User -->
          <div class="hoverTransform">
            <span @click="hideDiv('usersDashboard'); showDiv('registerUserDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Register User</span>
          </div>
          <!-- end Register User -->          
        </div>
        <!-- end Users Dashboard Header Right Div -->
      </div>
      <!-- end User Dashboard Header -->
      <!-- Pagination Div -->
      <div>
        <span>Total users: {{this.usersCount}}</span>
        <p>Showing <input type="number" v-model="this.resultsLimit"> results per page</p>
        <button @click="getAllUsers()">Go</button>
        <p>Page <input v-model="this.currentPage" type="number"> of {{this.pages}}</p>
        <button @click="getAllUsers()">Go</button>
        <button @click="this.previousPage()" v-if="this.currentPage_static > 1">Previous</button>
        <button @click="this.nextPage()" v-if="this.currentPage_static < this.pages">Next</button>
        <span style="font-family: Open_Sans_Bold;">Sort</span>
        <select v-model="sortBy" @change="getAllUsers()">
          <option value="role">Role</option>
          <option value="up_mail">UP Mail</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </select>
        <select v-model="sortOrder" @change="getAllUsers()">
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <span style="font-family: Open_Sans_Bold;">Search</span>
        <input v-model="searchString" type="text">
        <button @click="getAllUsers()">Go</button>
        <span style="font-family: Open_Sans_Bold">Filter by Role</span>
        <select v-model="filterByRole" @change="getAllUsers()">
          <option value="">Any</option>
          <option value="admin">Admin</option>
          <option value="adviser">Adviser</option>
          <option value="student">Student</option>
        </select>         
      </div>
      <!-- end Pagination Div -->        
      <!-- Users Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-responsive">
          <thead>
            <tr>
              <th class="text-center" scope="col">Role</th>
              <th class="text-center" scope="col">UP Mail</th>
              <th class="text-center" scope="col">First Name</th>
              <th class="text-center" scope="col">Last Name</th>
              <th class="text-center" scope="col">View</th>
              <th class="text-center" scope="col">Edit</th>
              <th class="text-center" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in users" :key="index">
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].role}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].up_mail}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].first_name}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].last_name}}</td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View Button -->
                <div @click="viewUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #093405; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">View</span>
                </div>
                <!-- end View Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; position: relative; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Edit Button -->
                <div @click="editUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #7F6000; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">Edit</span>
                </div>
                <!-- end Edit Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Delete Button -->
                <div @click="deleteUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #751518; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">Delete</span>
                </div>
                <!-- end Delete Button -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end Users Dashboard Body -->
    </div>
    <!-- end Users Dashboard -->

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
            <span @click="clearAddAnnouncementInputs(); hideDiv('addAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
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
        <input v-model="add_announcement.body" type="text" style="margin-bottom: 10px;">
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
            <span @click="hideDiv('deleteAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Delete Announcement Header Right Div -->
      </div>
      <!-- end Delete Announcement Header -->
      <!-- Delete Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span>Confirm Deletion</span>
        <span>Title</span>
        <span>{{this.del_announcement.title}}</span>
        <span>Created</span>
        <span>{{this.del_announcement.created}}</span>
        <span>Last Modified</span>
        <span>{{this.del_announcement.modified}}</span>
        <span>Body</span>
        <span>{{this.del_announcement.body}}</span>
        <button @click="deleteAnnouncementAPI()">Delete</button>
      </div>
      <!-- end Delete User Body -->      
    </div>
    <!-- end Delete User Div -->
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
            <span @click="hideDiv('editAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Cancel</span>
          </div>
          <!-- end Cancel -->          
        </div>
        <!-- end Edit Announcement Header Right Div -->
      </div>
      <!-- end Edit Announcement Header -->      
      <!-- Edit Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-family: Open_Sans_Bold;">Title</span>
        <input v-model="edit_announcement.title" type="text" style="margin-bottom: 10px;">
        <span style="font-family: Open_Sans_Bold;">Body</span>
        <input v-model="edit_announcement.body" type="text" style="margin-bottom: 10px;">
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
            <span @click="hideDiv('viewAnnouncementDiv'); showDiv('announcementDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end View Announcement Header Right Div -->
      </div>
      <!-- end View Announcement Header -->
      <!-- View Announcement Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span>Title</span>
        <span>{{this.view_announcement.title}}</span>
        <span>Created</span>
        <span>{{this.view_announcement.created}}</span>
        <span>Last Modified</span>
        <span>{{this.view_announcement.modified}}</span>
        <span>Body</span>
        <span>{{this.view_announcement.body}}</span>
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
            <span @click="hideDiv('announcementDashboard'); showDiv('menuDiv');" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Back to Menu</span>
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
              <th class="text-center" scope="col">Title</th>
              <th class="text-center" scope="col">Last Modified</th>
              <th class="text-center" scope="col">Date Created</th>
              <th class="text-center" scope="col">Body</th>
              <th class="text-center" scope="col">View</th>
              <th class="text-center" scope="col">Edit</th>
              <th class="text-center" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in announcements" :key="index">
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{announcements[index].title}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{this.formatted_date(announcements[index].modified)}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{this.formatted_date(announcements[index].created)}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{announcements[index].body}}</td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View Button -->
                <div @click="viewAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #093405; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">View</span>
                </div>
                <!-- end View Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; position: relative; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Edit Button -->
                <div @click="editAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #7F6000; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
                  <span style="font-family: Open_Sans_Semi_Bold;">Edit</span>
                </div>
                <!-- end Edit Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Delete Button -->
                <div @click="deleteAnnouncement(announcements[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #751518; border-radius: 5px; color: white; cursor: pointer; width: 70px;">
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
  </div>
  <!-- end Admin Div -->
  <Footer />
</div>
</template>

<style scoped>
.hoverTransform {
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s linear;
}
  .hoverTransform:hover {
    transform: scale(1.05);
  }

  .hoverTransform:active {
    transform: scale(0.95);
  }
</style>