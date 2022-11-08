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
      disableDelete: false,
      reg_role: '',
      reg_up_mail: '',
      reg_first_name: '',
      reg_last_name: '',
      user: {},
      users: [],
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
    async deleteUser(userToDelete) {
      if (this.disableDelete) {
        return
      }
      try {
        this.disableDelete = true
        const response = await this.axios.post('/api/deleteUser', userToDelete)
        location.href = '/admin'
      } catch (error) {
        console.log('Error on Admin.vue > deleteUser', error) // temp
      }
    },
    async getAllUsers() {
      try {
        const response = await this.axios.post('/api/getUsers', {column: 'role', order: 'ASC'})
        this.users = response.data
      } catch (error) {
        console.log('Error on Admin.vue > getAllUsers', error) // temp
      }
    },
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    async registerUser(role, up_mail, first_name, last_name) {
      try {
        const body = {role: role, up_mail: up_mail, first_name: first_name, last_name: last_name}
        const response = await this.axios.post('/api/register', body)
        location.href = '/admin'
      } catch (error) {
        console.log('Error on Admin.vue > registerUser', error) // temp
      }
    },
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
    }
  },
  async mounted() {
    await this.authorize()
    await this.getAllUsers()
  }
}
</script>

<template>
<div>
  <Header :user="this.user" />
  <!-- Admin Div -->
  <div class="adminMainDiv align-items-center d-flex flex-column justify-content-center" style="background-color: lightgray; gap: 20px; padding: 30px;">
    <!-- Register User Div -->
    <div ref="registerUserDiv" class="flex-column registerUserDiv" style="background-color: #F8F6F0; border: 2px solid black; display: none; width: 100%;">
      <!-- Register User Header -->
      <div id="usersHeader" class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; padding: 10px 15px;">
        <!-- Header Left -->
        <div class="d-flex flex-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi-person-plus-fill" viewBox="0 0 16 16" style="margin-top: 1px; margin-right: 5px;">
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
          </svg>
          <h2 style="color: white; font-family: Open_Sans_Bold; font-size: 24px; margin: 0;">Register User</h2>
        </div>
        <!-- end Header Left -->
        <!-- Header Right -->
        <div class="hoverTransform">
          <span @click="hideDiv('registerUserDiv'); showDiv('usersDashboard')" style="background-image: url(/footer_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Cancel</span>
        </div>
        <!-- end Header Right -->
      </div>
      <!-- end Register User Header -->
      <!-- Register User Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 70px;">
        <!-- Column -->
        <div class="d-flex flex-row" style="gap: 70px;">
          <!-- Rows -->
          <div class="d-flex flex-grow-1 flex-column">
            <span style="font-family: Open_Sans_Bold;">Role</span>
            <input v-model="reg_role" type="text" style="margin-bottom: 10px;">
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
            <span style="background-image: url(/footer_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Register User</span>
          </div>
        <!-- end Register Button -->        
      </div>
      <!-- end Register User Body -->
    </div>
    <!-- end Register User Div -->    

    <!-- Users Dashboard -->
    <div ref="usersDashboard" class="flex-column userDashboard" style="background-color: #F8F6F0; border: 2px solid black; width: 100%;">
      <!-- Users Dashboard Header -->
      <div id="usersHeader" class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; padding: 10px 15px;">
        <!-- Header Left -->
        <div class="d-flex flex-row">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi-people-fill" viewBox="0 0 16 16" style="margin-top: 1px; margin-right: 5px;">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path fill-rule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
          </svg>
          <h2 style="color: white; font-family: Open_Sans_Bold; font-size: 24px; margin: 0;">Users Dashboard</h2>
        </div>
        <!-- end Header Left -->
        <!-- Header Right -->
        <div class="hoverTransform">
          <span @click="hideDiv('usersDashboard'); showDiv('registerUserDiv')" style="background-image: url(/footer_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; border: 2px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 18px; padding: 5px 10px;">Register User</span>
        </div>
        <!-- end Header Right -->
      </div>
      <!-- end Users Dashboard Header -->
      <!-- Users Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-responsive">
          <thead>
            <tr>
              <th class="text-center" scope="col" style="max-width: 200px;">ID</th>
              <th class="text-center" scope="col">Role</th>
              <th class="text-center" scope="col">UP Mail</th>
              <th class="text-center" scope="col">First Name</th>
              <th class="text-center" scope="col">Last Name</th>
              <th class="text-center" scope="col">Edit</th>
              <th class="text-center" scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in users" :key="index">
              <th class="text-center" scope="row" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].id}}</th>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].role}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].up_mail}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].first_name}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{users[index].last_name}}</td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #751518; border-radius: 5px; color: white; cursor: pointer; width: 70px;"><span style="font-family: Open_Sans_Semi_Bold;">Edit</span></div></td>
              <td @click="deleteUser(users[index])" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><div class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto" style="background-color: #751518; border-radius: 5px; color: white; cursor: pointer; width: 70px;"><span style="font-family: Open_Sans_Semi_Bold;">Delete</span></div></td>
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