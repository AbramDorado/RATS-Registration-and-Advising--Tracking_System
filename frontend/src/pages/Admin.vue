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
      currentPage: 1,
      disableDelete: false,
      edit_role: '',
      edit_up_mail: '',
      edit_first_name: '',
      edit_last_name: '',
      reg_role: '',
      reg_up_mail: '',
      reg_first_name: '',
      reg_last_name: '',
      registerUserEnabled: true,
      resultsLimit: 20,
      searchString: '',
      sortBy: 'role',
      sortOrder: 'ASC',
      user: {},
      users: [],
      usersCount: 0
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.usersCount / this.resultsLimit)
    }
  },
  methods: {
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
    batchUpload() {
      // to do
      alert('Unimplemented: Batch Upload') // temp
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
    async deleteUser(userToDelete) {
      if (this.disableDelete) {
        return
      }
      try {
        this.disableDelete = true
        // To do: Confirmation
        alert('To do: Confirmation')
        const response = await this.axios.post('/api/deleteUser', userToDelete)
        await this.getAllUsers()
      } catch (error) {
        console.log('Error on Admin.vue > deleteUser', error) // temp
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
    async getAllUsers() {
      try {
        await this.getUsersCount()
        const response = await this.axios.post('/api/getUsers', {column: this.sortBy, order: this.sortOrder, offset: (this.currentPage-1) * this.resultsLimit, limit: this.resultsLimit, searchString: this.searchString})
        this.users = response.data
      } catch (error) {
        console.log('Error on Admin.vue > getAllUsers', error) // temp
      }
    },
    async getUsersCount() {
      try {
        const response = await this.axios.post('/api/countUsers')
        this.usersCount = response.data.count
      } catch (error) {
        console.log('Error on Admin.vue > getUsersCount', error) // temp
      }
    },
    hideDiv(ref) {
      console.log('hiding div', ref) // temp
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
        if (!this.registerUserEnabled) {
          return
        } else if (!role || !up_mail || !first_name || !last_name) {
          alert('Input cannot be blank')
          return
        } else {
          this.registerUserEnabled = false
          const body = {role: role, up_mail: up_mail, first_name: first_name, last_name: last_name}
          const response = await this.axios.post('/api/register', body)
          this.registerUserEnabled = true
          await this.getAllUsers()
          this.clearRegisterUserInputs();
          this.hideDiv('registerUserDiv');
          this.showDiv('usersDashboard')
        }
      } catch (error) {
        console.log('Error on Admin.vue > registerUser', error) // temp
        this.registerUserEnabled = true
      }
    },
    showDiv(ref) {
      console.log('showing div', ref) // temp
      this.$refs[ref].style.display = 'flex'
    },
    viewUser(user) {
      // To do
      alert('Unimplemented: View user') // temp
      console.log('viewUser() user is', user) // temp
    }

  },
  async mounted() {
    await this.authorize()
    await this.getAllUsers()
  }
}
</script>

<template>
<div class="d-flex flex-column justify-content-between" style="min-height: 100vh;">
  <Header :user="this.user" />
  <!-- Admin Div -->
  <div class="align-items-center d-flex flex-column justify-content-center" style="background-color: white; gap: 20px; padding: 30px;">  
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
    <!-- end Edit User -->
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
    <!-- end Register User -->
    <!-- User Dashboard -->
    <div ref="usersDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: flex; min-height: 300px; width: 1200px;">
      <!-- User Dashboard Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- User Dashboard Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- User Dashboard Header Left Div Icon -->
          <i class="align-items-center bi bi-people-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">User Dashboard</span>
          <!-- end User Dashboard Header Left Div Icon -->
        </div>
        <!-- end User Dashboard Header Left Div -->
        <!-- User Dashboard Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Batch Upload -->
          <div class="hoverTransform">
            <span @click="batchUpload()" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Batch Upload</span>
          </div>
          <!-- end Batch Upload -->
          <!-- Register User -->
          <div class="hoverTransform">
            <span @click="hideDiv('usersDashboard'); showDiv('registerUserDiv')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Register User</span>
          </div>
          <!-- end Register User -->          
        </div>
        <!-- end User Dashboard Header Right Div -->
      </div>
      <!-- end User Dashboard Header -->
      <!-- Pagination Div -->
      <div>
        <span>Total users: {{this.usersCount}}</span>
        <p>Showing {{this.resultsLimit}} results per page</p>
        <p>Page {{this.currentPage}} of {{this.pages}}</p>
        <button @click="this.previousPage()" v-if="this.currentPage > 1">Previous</button>
        <button @click="this.nextPage()" v-if="this.currentPage < this.pages">Next</button>
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
        <button @click="getAllUsers()">Search</button>    
      </div>
      <!-- end Pagination Div -->        
      <!-- Users Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body searchable sortable table table-responsive">
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
    <!-- end User Dashboard -->
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