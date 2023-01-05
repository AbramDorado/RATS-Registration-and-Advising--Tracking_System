<script>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Adviser',
  components: {
    Footer,
    Header,
    ScheduleOfClasses
  },
  data() {
    return {
      advisees: [],
      user: {},
      view_advisee_curri_progress: {}
    }
  },
  async mounted() {
    await this.authorize()
    await this.updateAdvisees()
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
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
    },
    async updateAdvisees() {
      try {
        const response = await this.axios.post('/api/ecf/read/all/adviser')
        this.advisees = response.data.rows
      } catch (error) {
        console.log('Error on Adviser.vue > updateAdvisees()', error)
        alert('Error on updateAdvisees()')
      }
    },
    async viewCurriProg(advisee) {
      this.view_advisee_curri_progress = advisee
      this.hideDiv('adviserDashboard')
      this.showDiv('viewAdviseeCurriProgressDiv')
    },
    async viewECF(advisee) {

    }
  }
}
</script>

<template>
<div style="display: flex; flex-direction: column; flex-grow: 1;">
  <ScheduleOfClasses :user="this.user" />
  <Header :user="this.user" />
  <!-- Adviser Dashboard -->
  <div class="align-items-center d-flex justify-content-center" style="background-color: lightgray; padding: 30px;">
    <div ref="adviserDashboard" class="flex-column" style="background-color: #f3f3f3; border: 2px solid black; display: flex; min-height: 300px;">
      <!-- Adviser Dashboard Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- Adviser Dashboard Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- Adviser Dashboard Header Left Div Icon -->
          <i class="align-items-center bi bi-people-fill d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">Adviser Dashboard</span>
          <!-- end Adviser Dashboard Header Left Div Icon -->
        </div>
        <!-- end Adviser Dashboard Header Left Div -->
      </div>
      <!-- end Adviser Dashboard Header -->
      <!-- Adviser Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-responsive">
          <thead>
            <tr>
              <th class="align-middle text-center" scope="col">UP Mail</th>
              <th class="align-middle text-center" scope="col">First Name</th>
              <th class="align-middle text-center" scope="col">Last Name</th>
              <th class="align-middle text-center" scope="col">Degree Program</th>
              <th class="align-middle text-center" scope="col">SAIS ID</th>
              <th class="align-middle text-center" scope="col">Student Number</th>
              <th class="align-middle text-center" scope="col">Curriculum Progress</th>
              <th class="align-middle text-center" scope="col">Advising Status</th>
              <th class="align-middle text-center" scope="col">View Curriculum Progress</th>
              <th class="align-middle text-center" scope="col">View ECF</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in advisees" :key="index">
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].up_mail}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].first_name}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].last_name}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap;">{{advisees[index].degree_program}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].sais_id}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].student_number}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].step1_status}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: capitalize; white-space: nowrap;">{{advisees[index].step2_status}}</td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View Curri Progress Button -->
                <div @click="viewCurriProg(advisees[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                  <span class="myButton1" style="background-color: #093405;">View</span>
                </div>
                <!-- end View Curri Progress Button -->
              </td>
              <td style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <!-- View ECF Button -->
                <div @click="viewECF(advisees[index])" class="align-items-center d-flex flex-row hoverTransform justify-content-center m-auto">
                  <span class="myButton1" style="background-color: #093405;">View</span>
                </div>
                <!-- end View ECF Button -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end Adviser Dashboard Body -->      
    </div>
    <!-- View Advisee Curri Progress Div -->
    <div ref="viewAdviseeCurriProgressDiv" class="flex-column" style="background-color: #F8F6F0; border: 2px solid black; display: none; min-width: 700px;">
      <!-- View Advisee Header -->
      <div class="align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; height: 50px; padding: 10px 10px 10px 15px;">
        <!-- View Advisee Curri Progress Header Left Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 5px;">
          <!-- View Advisee Curri Progress Header Left Div Icon -->
          <i class="align-items-center bi bi-person-bounding-box d-flex" style="color: white; font-size: 20px;"></i>
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">View Advisee's Curriculum Progress</span>
          <!-- end View Advisee Curri Progress Header Left Div Icon -->
        </div>
        <!-- end View Advisee Curri Progress Header Left Div -->
        <!-- View Advisee Curri Progress Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('viewAdviseeCurriProgressDiv'); showDiv('adviserDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end View Advisee Curri Progress Header Right Div -->
      </div>
      <!-- end View Advisee Curri Progress Header -->
      <!-- View Advisee Curri Progress Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-weight: bold;">UP Mail: <span style="font-weight: normal;">{{this.view_advisee_curri_progress.up_mail}}</span></span>
        <span style="font-weight: bold;">First Name: <span style="font-weight: normal;">{{this.view_advisee_curri_progress.first_name}}</span></span>
        <span style="font-weight: bold;">Last Name: <span style="font-weight: normal;">{{this.view_advisee_curri_progress.last_name}}</span></span>
        <span style="font-weight: bold;">Degree Program: <span style="font-weight: normal; text-transform: uppercase;">{{this.view_advisee_curri_progress.degree_program}}</span></span>
        <span style="font-weight: bold;">SAIS ID: <span style="font-weight: normal;">{{this.view_advisee_curri_progress.sais_id}}</span></span>
        <span style="font-weight: bold;">Student Number: <span style="font-weight: normal;">{{this.view_advisee_curri_progress.student_number}}</span></span>
        <span style="font-weight: bold;">Curriculum Progress: <span style="font-weight: normal; text-transform: capitalize;">{{this.view_advisee_curri_progress.step1_status}}</span></span>
        <span style="font-weight: bold;">Advising Status: <span style="font-weight: normal; text-transform: capitalize;">{{this.view_advisee_curri_progress.step2_status}}</span></span>
      </div>
      <!-- end View Advisee Curri Progress Body -->      
    </div>
    <!-- end View Advisee Curri Progress Div -->    
  </div>
  <!-- end Adviser Dashboard -->
  <Footer />
</div>
</template>

<style scoped>
</style>