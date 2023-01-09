<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Admin',
  components: {
    Header, Footer, ScheduleOfClasses
  },
  data () {
    return {
      // userDashboard-related
      batchUploadProgress: '', // Shows log/history of batch upload
      currentPage: 1, // v-model with input; used in pagination
      currentPage_static: 1, // Corrected value
      delete_user: {}, // Used in deleteUser() and deleteUserAPI()
      deleteUserDisabled: false, // For spam-handling deleteUserAPI()
      edit_user: {}, // Used in editUser() and editUserAPI()
      filterByRole: '', // Passed in getAllUsers API
      register_user: {}, // Used in registerUser()
      registerUserDisabled: false, // For spam-handling registerUser()
      resultsLimit: 50, // v-model with input; used in pagination
      resultsLimit_static: 50, // Correct value
      searchString: '', // Passed in getAllUsers API
      sortBy: 'role', // Passed in getAllUsers API
      sortOrder: 'ASC', // Passed in getAllUsers API
      users: [], // Main list of rows shown in users table
      usersCount: 0, // Stores reponse of countUsers API
      view_user: {}, // Used in viewUser()
      // end userDashboard-related

      // headerComponent-related
      user: {} // Stores response of authorizeAPI; passed as prop in Header component
      // end headerComponent-related
    }
  },
  computed: {
    pages() { // Returns number of pages needed to store all rows in groups 
      return Math.ceil(this.usersCount / this.resultsLimit_static)
    }
  },
  methods: {
    // header component related   
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
    //end header component related

    //user dashboard related
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
            userObj.degree_program = rowContent[4]
            userObj.sais_id = rowContent[5]
            userObj.student_number = rowContent[6]
            userObj.adviser_up_mail = rowContent[7]
            userObj.department = rowContent[8]
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
    clearBatchUploadDiv() {
      this.$refs.batchUploadCSV.value = ''
      this.batchUploadProgress = ''
    },
    clearRegisterUserInputs() {
      this.register_user = {}
    },
    clearSearchField() {
      this.searchString = ''
      this.getAllUsers()
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
    deleteUser(userToDelete) {
      this.hideDiv('usersDashboard')
      this.showDiv('deleteUserDiv')
      this.delete_user = userToDelete
    },
    async deleteUserAPI() {
      if (this.deleteUserDisabled) {
        return
      }
      try {
        this.deleteUserDisabled = true
        const response = await this.axios.post('/api/deleteUser', this.delete_user)
        await this.getAllUsers()
        this.hideDiv('deleteUserDiv')
        this.showDiv('usersDashboard')        
        this.deleteUserDisabled = false
      } catch (error) {
        console.log('Error on Admin.vue > deleteUser', error) // temp
      }
    },
    editUser(user) {
      this.edit_user = user
      this.hideDiv('usersDashboard')
      this.showDiv('editUserDiv')
    },
    async editUserAPI() {
      try {
        if (!this.edit_user.role || !this.edit_user.up_mail || !this.edit_user.first_name || !this.edit_user.last_name) {
          alert('Input cannot be blank') // temp
          return
        } else {
          const response = await this.axios.post('/api/editUser', this.edit_user)
          await this.getAllUsers()
          this.hideDiv('editUserDiv');
          this.showDiv('usersDashboard')
        }
      } catch(error) {
        console.log('Error on Admin.vue > editUserAPI', error) // temp
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
    async registerUser() {
      try {
        if (this.registerUserDisabled) {
          return
        } else if (!this.register_user.role || !this.register_user.up_mail || !this.register_user.first_name || !this.register_user.last_name) {
          alert('Input cannot be blank')
          return
        } else {
          this.registerUserDisabled = true
          if (this.register_user.role == 'adviser' || this.register_user.role == 'admin') {
            this.register_user.adviser_up_mail = ''
            this.register_user.student_number = ''
            this.register_user.sais_id = ''
            this.register_user.degree_program = ''
            if (this.register_user.role == 'admin') {
              this.register_user.department = ''
            }
          }
          const response = await this.axios.post('/api/register', this.register_user)
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
    viewUser(user) {
      this.view_user = user
      this.hideDiv('usersDashboard')
      this.showDiv('viewUserDiv')
      // To do: Retrieve other info, needs advising module
    },
    // end user dashboard related

    // utility functions
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
    },
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    // end utility functions
    
  },
  async mounted() {
    await this.authorize()
    await this.getAllUsers()
    // await this.getAllAnnouncements()
  }
}
</script>

<template>
<ScheduleOfClasses :user="this.user" />
<div class="d-flex flex-column justify-content-between" style="min-height: 100vh;">
  <Header :user="this.user" />
  <!-- Admin Div -->
  <div class="align-items-center d-flex flex-column justify-content-center" style="background-color: lightgray; flex-basis: 0; flex-grow: 1; gap: 20px; padding: 30px;">
    <!-- Menu Div -->
    <div ref="menuDiv" style="align-items: center; display: flex; flex-direction: column; gap: 20px;">
      <div class="d-flex hoverTransform">
        <span @click="hideDiv('menuDiv'); showDiv('usersDashboard');" class="myButton2" style="background-color: rgb(117, 21, 24);">Users Dashboard</span>
      </div>
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
        <div @click="batchRegister()" class="hoverTransform" style="align-self: center;">
          <span style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Batch Register</span>
        </div>
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
        <span>Role: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.role}}</span></span>
        <span>UP Mail: <span style="font-weight: bold;">{{this.delete_user.up_mail}}</span></span>
        <span>First Name: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.first_name}}</span></span>
        <span>Last Name: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.last_name}}</span></span>
        <span v-if="this.delete_user.role == 'student'">Degree Program: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.degree_program}}</span></span>
        <span v-if="this.delete_user.role == 'student'">SAIS ID: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.sais_id}}</span></span>
        <span v-if="this.delete_user.role == 'student'">Student Number: <span style="text-transform: capitalize; font-weight: bold;">{{this.delete_user.student_number}}</span></span>
        <span v-if="this.delete_user.role == 'student'">Adviser UP Mail: <span style="font-weight: bold;">{{this.delete_user.adviser_up_mail}}</span></span>
        <span v-if="this.delete_user.role == 'student' || this.delete_user.role == 'adviser'">Department: <span style="text-transform: uppercase; font-weight: bold;">{{this.delete_user.department}}</span></span>
        <div class="d-flex flex-column justify-content-center align-items-center"><div class="hoverTransform myButton1" @click="deleteUserAPI()" style="background-color: #751518;">Delete</div></div>
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
        <!-- Rows -->
        <div class="d-flex flex-row" style="gap: 70px;">
          <!-- Column -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">Role</span>
            <select v-model="edit_user.role" style="margin-bottom: 10px;">
              <option value="admin">Admin</option>
              <option value="adviser">Adviser</option>
              <option value="student">Student</option>
            </select>
            <span style="font-family: Open_Sans_Bold;">First Name</span>
            <input v-model="edit_user.first_name" type="text" style="margin-bottom: 10px;">
            <span v-if="this.edit_user.role == 'student'" style="font-family: Open_Sans_Bold;">Degree Program</span>
            <input v-if="this.edit_user.role == 'student'" v-model="edit_user.degree_program" type="text" style="margin-bottom: 10px;">
            <span v-if="this.edit_user.role == 'student'" style="font-family: Open_Sans_Bold;">Student Number</span>
            <input v-if="this.edit_user.role == 'student'" v-model="edit_user.student_number" type="text" style="margin-bottom: 10px;">
            <span v-if="this.edit_user.role == 'student' || this.edit_user.role == 'adviser'" style="font-family: Open_Sans_Bold;">Department</span>
            <input v-if="this.edit_user.role == 'student' || this.edit_user.role == 'adviser'" v-model="edit_user.department" type="text" style="margin-bottom: 10px; text-transform: uppercase;">  
          </div>
          <!-- end Column -->
          <!-- Column -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">UP Mail</span>
            <input disabled v-model="edit_user.up_mail" type="text" style="margin-bottom: 10px;">
            <span style="font-family: Open_Sans_Bold;">Last Name</span>
            <input v-model="edit_user.last_name" type="text" style="margin-bottom: 10px;">
            <span v-if="this.edit_user.role == 'student'" style="font-family: Open_Sans_Bold;">SAIS ID</span>
            <input v-if="this.edit_user.role == 'student'" v-model="edit_user.sais_id" type="text" style="margin-bottom: 10px;">
            <span v-if="this.edit_user.role == 'student'" style="font-family: Open_Sans_Bold;">Adviser UP Mail</span>
            <input v-if="this.edit_user.role == 'student'" v-model="edit_user.adviser_up_mail" type="text" style="margin-bottom: 10px;">            
          </div>
          <!-- end Column -->
        </div>
        <!-- end Rows -->
        <!-- Edit Button -->
          <div @click="editUserAPI()" class="align-items-center d-flex justify-content-center hoverTransform">
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
        <!-- Rows -->
        <div class="d-flex flex-row" style="gap: 70px;">
          <!-- Column -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">Role</span>
            <select v-model="register_user.role" style="margin-bottom: 10px;">
              <option value="admin">Admin</option>
              <option value="adviser">Adviser</option>
              <option value="student">Student</option>
            </select>
            <span style="font-family: Open_Sans_Bold;">First Name</span>
            <input v-model="register_user.first_name" type="text" style="margin-bottom: 10px;">
            <span v-if="this.register_user.role == 'student'" style="font-family: Open_Sans_Bold;">Degree Program</span>
            <input v-if="this.register_user.role == 'student'" v-model="register_user.degree_program" type="text" style="margin-bottom: 10px;">
            <span v-if="this.register_user.role == 'student'" style="font-family: Open_Sans_Bold;">Student Number</span>
            <input v-if="this.register_user.role == 'student'" v-model="register_user.student_number" type="text" style="margin-bottom: 10px;">
            <span v-if="this.register_user.role == 'student' || this.register_user.role == 'adviser'" style="font-family: Open_Sans_Bold;">Department</span>
            <select v-if="this.register_user.role == 'student' || this.register_user.role == 'adviser'" v-model="register_user.department" style="margin-bottom: 10px;">
              <option value="dac">DAC</option>
              <option value="dpsm">DPSM</option>
              <option value="db">DB</option>
              <option value="dbs">DBS</option>
              <option value="dpe">DPE</option>
              <option value="dss">DSS</option>
              <option value="mm">MM</option>
            </select>            
            <!-- <input v-if="this.register_user.role == 'student' || this.register_user.role == 'adviser'" v-model="register_user.department" type="text" style="margin-bottom: 10px; text-transform: uppercase;"> -->
          </div>
          <!-- end Column -->
          <!-- Column -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">UP Mail</span>
            <input v-model="register_user.up_mail" type="text" style="margin-bottom: 10px;">
            <span style="font-family: Open_Sans_Bold;">Last Name</span>
            <input v-model="register_user.last_name" type="text" style="margin-bottom: 10px;">
            <span v-if="this.register_user.role == 'student'" style="font-family: Open_Sans_Bold;">SAIS ID</span>
            <input v-if="this.register_user.role == 'student'" v-model="register_user.sais_id" type="text" style="margin-bottom: 10px;">
            <span v-if="this.register_user.role == 'student'" style="font-family: Open_Sans_Bold;">Adviser UP Mail</span>
            <input v-if="this.register_user.role == 'student'" v-model="register_user.adviser_up_mail" type="text" style="margin-bottom: 10px;">                      
          </div>
          <!-- end Column -->                 
        </div>
        <!-- end Rows -->
        <!-- Register Button -->
          <div @click="registerUser()" class="align-items-center d-flex justify-content-center hoverTransform">
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
        <span>Role: <span style="font-weight: bold; text-transform: capitalize;">{{this.view_user.role}}</span></span>
        <span>UP Mail: <span style="font-weight: bold; text-transform: lowercase;">{{this.view_user.up_mail}}</span></span>
        <span>First Name: <span style="font-weight: bold; text-transform: capitalize;">{{this.view_user.first_name}}</span></span>
        <span>Last Name: <span style="font-weight: bold; text-transform: capitalize;">{{this.view_user.last_name}}</span></span>
        <span v-if="view_user.role == 'student'">Degree Program: <span v-if="view_user.role == 'student'" style="font-weight: bold; text-transform: uppercase;">{{this.view_user.degree_program}}</span></span>
        <span v-if="view_user.role == 'student'">SAIS ID: <span v-if="view_user.role == 'student'" style="font-weight: bold;">{{this.view_user.sais_id}}</span></span>
        <span v-if="view_user.role == 'student'">Student Number: <span v-if="view_user.role == 'student'" style="font-weight: bold;">{{this.view_user.student_number}}</span></span>
        <span v-if="view_user.role == 'student'">Adviser UP Mail: <span v-if="view_user.role == 'student'" style="font-weight: bold; text-transform: lowercase;">{{this.view_user.adviser_up_mail}}</span></span>
        <span v-if="view_user.role == 'student' || view_user.role == 'adviser'">Department: <span v-if="view_user.role == 'student' || view_user.role == 'adviser'" style="font-weight: bold; text-transform: uppercase;">{{this.view_user.department}}</span></span>
      </div>
      <!-- end View User Body -->      
    </div>
    <!-- end View User Div -->    
    <!-- Users Dashboard -->
    <div ref="usersDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: none; min-height: 300px; width: 1200px;">
      <!-- <a @click="hideDiv('usersDashboard'); showDiv('menuDiv');" href="#">Back to Menu</a> -->
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
          <div class="hoverTransform">
            <span @click="hideDiv('usersDashboard'); showDiv('menuDiv');" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Back to Menu</span>
          </div>                  
        </div>
        <!-- end Users Dashboard Header Right Div -->
      </div>
      <!-- end User Dashboard Header -->
      <!-- Pagination Div -->
      <div style="display: flex; flex-direction: row; gap: 20px; margin: 20px;">
        <!-- Pages -->
        <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 20px 15px;">
          <span>Total users: <b>{{this.usersCount}}</b></span>
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
              <option value="role">Role</option>
              <option value="up_mail">UP Mail</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
            </select>
            <select v-model="sortOrder" @change="getAllUsers()">
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
          <div><div style="line-height: 1; margin-top: 10px;"><span style="font-family: Open_Sans_Bold;">Filter by Role</span></div></div>
          <select v-model="filterByRole" @change="getAllUsers()">
            <option value="">Any</option>
            <option value="admin">Admin</option>
            <option value="adviser">Adviser</option>
            <option value="student">Student</option>
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
      <!-- Users Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-responsive" style="table-layout: fixed;">
          <thead>
            <tr>
              <th class="align-middle text-center" scope="col">Role</th>
              <th class="align-middle text-center" scope="col">UP Mail</th>
              <th class="align-middle text-center" scope="col">First Name</th>
              <th class="align-middle text-center" scope="col">Last Name</th>
              <th v-if="filterByRole == '' || filterByRole == 'student'" class="align-middle text-center" scope="col">Degree Program</th>
              <th v-if="filterByRole == '' || filterByRole == 'student'" class="align-middle text-center" scope="col">SAIS ID</th>
              <th v-if="filterByRole == '' || filterByRole == 'student'" class="align-middle text-center" scope="col">Student Number</th>
              <th v-if="filterByRole == '' || filterByRole == 'student'" class="align-middle text-center" scope="col">Adviser UP Mail</th>
              <th class="align-middle text-center" scope="col">Department</th>
              <th class="align-middle text-center" scope="col">View</th>
              <th class="align-middle text-center" scope="col">Edit</th>
              <th class="align-middle text-center" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in users" :key="index">
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].role}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].up_mail}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].first_name}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].last_name}}</td>
              <td v-if="filterByRole == '' || filterByRole == 'student'" class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap;">{{users[index].degree_program}}</td>
              <td v-if="filterByRole == '' || filterByRole == 'student'" class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].sais_id}}</td>
              <td v-if="filterByRole == '' || filterByRole == 'student'" class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{users[index].student_number}}</td>
              <td v-if="filterByRole == '' || filterByRole == 'student'" class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].adviser_up_mail}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap;">{{users[index].department}}</td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View Button -->
                <div @click="viewUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                  <span class="myButton1" style="background-color: #093405;">View</span>
                </div>
                <!-- end View Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; position: relative; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Edit Button -->
                <div @click="editUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                  <span class="myButton1" style="background-color: #7F6000;">Edit</span>
                </div>
                <!-- end Edit Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- Delete Button -->
                <div @click="deleteUser(users[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                  <span class="myButton1" style="background-color: #751518;">Delete</span>
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
</style>