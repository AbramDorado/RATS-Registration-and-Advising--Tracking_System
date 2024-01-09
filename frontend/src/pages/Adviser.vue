<script>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
import axios from 'axios';

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
      adviseesCount: 0,
      currentPage: 1,
      currentPage_static: 1,
      filterByAdvStatus: '',
      filterByCurrProg: '',
      remarksString: '',
      resultsLimit: 50,
      resultsLimit_static: 50,
      searchString: '',
      user: {},
      view_advisee: {}
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.adviseesCount / this.resultsLimit_static)
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
    clearSearchField() {
      this.searchString = ''
      this.updateAdvisees()
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
      if (this.resultsLimit_static > this.adviseesCount) {
        this.resultsLimit_static = this.adviseesCount
        this.resultsLimit = this.adviseesCount
      }
    },
    formatted_course_code(course) {
      return `${course.subject} ${course.catalog_no}` 
    },
    async getAdviseesCount() {
      try {
        const response = await this.axios.post('/api/ecf/countAdvisees', {advisingStatus: this.filterByAdvStatus, curriculumProgress: this.filterByCurrProg})
        this.adviseesCount = response.data.count
      } catch (error) {
        console.log('Error on Adviser.vue > getAdviseesCount', error) // temp
      }
    },
    hideDiv(ref) {
      this.$refs[ref].style.display = 'none'
    },
    async nextPage() {
      if (this.currentPage < this.pages) {
        this.currentPage++
        this.updateAdvisees()
      }
    },
    async previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.updateAdvisees()
      }
    },
    showDiv(ref) {
      this.$refs[ref].style.display = 'flex'
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
    async updateAdvisees() {
      try {
        await this.getAdviseesCount()
        await this.correctLimits()
        const response = await this.axios.post('/api/ecf/read/all/adviser', {sortColumn: this.sortBy, sortOrder: this.sortOrder, offset: (this.currentPage_static-1) * this.resultsLimit_static, limit: this.resultsLimit_static, searchString: this.searchString, advisingStatus: this.filterByAdvStatus, curriculumProgress: this.filterByCurrProg})
        this.advisees = response.data.rows
      } catch (error) {
        console.log('Error on Adviser.vue > updateAdvisees()', error)
        this.$router.push('/');
      }
    },
    async updateStatus(newStatus) {
      try {
        const response = await this.axios.post('/api/advising_status/update', {student_up_mail: this.view_advisee.up_mail, status: newStatus, remarks: this.remarksString})
        alert(response.data.message)
        location.href = '/adviser'
      } catch (error) {
        console.log('Error on Adviser.vue > updateStatus()', error)
        alert('Error on updateStatus()')
      }
    },
    async viewDetails(advisee) {
      try {
        this.view_advisee = advisee
        const response = await this.axios.post('/api/advising/curri/read/adviser', {student_up_mail: advisee.up_mail})
        if (response.data.row) {
          this.view_advisee.curri_progress = JSON.parse(response.data.row.curri_progress)
        }
        // Get ECF
        const response2 = await this.axios.post('/api/ecf/read/all/student/adviserAcc', {student_up_mail: advisee.up_mail})
        this.view_advisee.ecf = response2.data.rows
        // end Get ECF

        // Get grade
        const response3 = await this.axios.post('/api/grade/read/all/student/adviserAcc', { student_up_mail: advisee.up_mail });
        this.view_advisee.grade = response3.data.rows
        // end Get grade

        this.hideDiv('adviserDashboard')
        this.showDiv('viewAdviseeDetailsDiv')
      } catch (error) {
        console.log('Error on viewDetails', error)
        alert('Error')
      }
    }
  }
}
</script>

<template>
<div style="display: flex; flex-direction: column; flex-grow: 1;">
  <ScheduleOfClasses :user="this.user" />
  <Header :user="this.user" />
  <!-- Adviser Dashboard -->
  <div class="align-items-center d-flex justify-content-center" style="background-color: lightgray; padding: 8% 0 30px 0;">
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
      <!-- Pagination Div -->
      <div style="display: flex; flex-direction: row; gap: 20px; margin: 20px;">
        <!-- Pages -->
        <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 20px 15px;">
          <span>Total advisees: <b>{{this.adviseesCount}}</b></span>
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
              <span @click="updateAdvisees()" class="myButton1" style="background-color: #751518;">Apply</span>
            </div>                                 
          </div>
        </div>
        <!-- end Pages -->
        <!-- Sort and Filter -->
        <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 15px;">
          <div><div style="line-height: 1; margin-top: 10px;"><span style="font-family: Open_Sans_Bold;">Filter by Curriculum Progress</span></div></div>
          <select v-model="filterByCurrProg" @change="updateAdvisees()">
            <option value="">Any</option>
            <option value="not started">Not Started</option>
            <option value="done">Done</option>
          </select>
          <div><div style="line-height: 1; margin-top: 10px;"><span style="font-family: Open_Sans_Bold;">Filter by Advising Status</span></div></div>
          <select v-model="filterByAdvStatus" @change="updateAdvisees()">
            <option value="">Any</option>
            <option value="not started">Not Started</option>
            <option value="Waiting for Revision">Waiting for Revision</option>
            <option value="waiting for approval">Waiting for Approval</option>
            <option value="Approved">Approved</option>
          </select>           
        </div>           
        <!-- end Sort and Filter -->
        <!-- Search -->
        <div style="align-items: center; border: 2px solid gray; border-radius: 5px; display: flex; flex-basis: 0; flex-direction: column; flex-grow: 1; gap: 10px; justify-content: center; padding: 15px;">
          <span style="font-family: Open_Sans_Bold;">Search</span>
          <div style="align-items: center; display: flex; flex-direction: row; gap: 5px;">
            <input v-model="searchString" type="text">
            <div @click="clearSearchField()" v-if="this.searchString !== ''" class="hoverTransform">
              <span class="align-items-center d-flex myButton1" style="background-color: #751518; padding: 3px 7px;">Clear</span>
            </div>            
          </div>
          <div>
            <div @click="updateAdvisees()" class="hoverTransform" style="margin-top: 5px;">
              <span class="myButton1" style="background-color: #751518;">Search</span>
            </div>
          </div>
        </div>
        <!-- end Search -->
      </div>
      <!-- end Pagination Div -->
      <!-- Adviser Dashboard Body -->
      <div style="padding: 15px 20px;">
        <table class="fixed-table-body table table-bordered table-responsive">
          <thead>
            <tr>
              <th class="align-middle text-center" scope="col">UP Mail</th>
              <th class="align-middle text-center" scope="col">Last Name</th>
              <th class="align-middle text-center" scope="col">First Name</th>
              <th class="align-middle text-center" scope="col">Middle Name</th>
              <th class="align-middle text-center" scope="col">SAIS ID</th>
              <th class="align-middle text-center" scope="col">Student Number</th>
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
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].sais_id}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: hidden; text-overflow: ellipsis; text-transform: none; white-space: nowrap;">{{advisees[index].student_number}}</td>
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
          <span style="color: white; font-family: Open_Sans_Bold; font-size: 20px;">View Advisee</span>
          <!-- end View Advisee Details Header Left Div Icon -->
        </div>
        <!-- end View Advisee Details Header Left Div -->
        <!-- View Advisee Details Header Right Div -->
        <div class="align-items-center d-flex flex-row" style="gap: 10px;">
          <!-- Close -->
          <div class="hoverTransform">
            <span @click="hideDiv('viewAdviseeDetailsDiv'); showDiv('adviserDashboard')" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Close</span>
          </div>
          <!-- end Close -->          
        </div>
        <!-- end View Advisee Details Header Right Div -->
      </div>
      <!-- end View Advisee Details Header -->
      <!-- View Advisee Details Body -->
      <div class="d-flex flex-column" style="gap: 10px; padding: 20px 40px;">
        <span style="font-weight: bold;">UP Mail: <span style="font-weight: normal;">{{this.view_advisee.up_mail}}</span></span>
        <span style="font-weight: bold;">Last Name: <span style="font-weight: normal;">{{this.view_advisee.last_name}}</span></span>
        <span style="font-weight: bold;">First Name: <span style="font-weight: normal;">{{this.view_advisee.first_name}}</span></span>
        <span style="font-weight: bold;">Middle Name: <span style="font-weight: normal;">{{this.view_advisee.middle_name}}</span></span>
        <span style="font-weight: bold;">Degree Program: <span style="font-weight: normal; text-transform: uppercase;">{{this.view_advisee.degree_program}}</span></span>
        <span style="font-weight: bold;">SAIS ID: <span style="font-weight: normal;">{{this.view_advisee.sais_id}}</span></span>
        <span style="font-weight: bold;">Student Number: <span style="font-weight: normal;">{{this.view_advisee.student_number}}</span></span>
        <span style="font-weight: bold;">Curriculum Progress: <span style="font-weight: normal; text-transform: capitalize;">{{this.view_advisee.step1_status}}</span></span>
        <!-- <span style="font-weight: bold;">Advising Status: <span style="font-weight: normal; text-transform: capitalize;">{{this.view_advisee.step2_status}}</span></span> -->
        <!-- Curri Progress: {{view_advisee.curri_progress}} -->

        
          <!-- Student Grades Section -->
          <div style="margin-bottom: 10px;">
            <div class="text-center" style="margin-bottom: 10px;">
              <span style="font-family: Open_Sans_Bold; font-size: 20px;">Student Grades</span>
            </div>

            <!-- Progress Bar Section (Replace with your logic) -->
            <div class="progress" style="height: 25px; margin-bottom: 20px;">
              <div class="progress-bar" role="progressbar" :style="{ width: progressBarWidth }" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                {{ progressBarText }}
              </div>
            </div>
            <!-- end Progress Bar Section -->

            <!-- Table View for Subjects, Units, and Grades -->
            <table class="table table-bordered" style="background-color: white;">
              <thead>
                <tr>
                  <th class="align-middle text-center" scope="col">Subjects</th>
                  <th class="align-middle text-center" scope="col">Units</th>
                  <th class="align-middle text-center" scope="col">Grades</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(obj, index) in view_advisee.grade" :key="index">
                  <td class="text-center">{{ view_advisee.grade[index].subject }}</td>
                  <td class="text-center">{{ view_advisee.grade[index].units }}</td>
                  <td class="text-center">{{ view_advisee.grade[index].grade }}</td>
                </tr>
              </tbody>
            </table>
            <!--end Table View for Subjects, Units, and Grades -->
          </div>
          <!-- end Student Grades Section -->


        <!-- Curriculum Progress -->
        <div>
          <div class="text-center" style="margin-bottom: 10px;"><span style="font-family: Open_Sans_Bold; font-size: 20px;">Curriculum Progress</span></div>
          <table class="table table-bordered table-sm" style="background-color: white; overflow-x: scroll; table-layout: fixed;">
            <thead>
              <tr>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Course</th>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Section</th>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Academic Year Taken</th>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Semester Taken</th>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Grade</th>
                <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(obj, index) in view_advisee.curri_progress" :key="index">
                <td class="text-center"><span>{{view_advisee.curri_progress[index].course}}</span></td>
                <td class="text-center"><span>{{view_advisee.curri_progress[index].section}}</span></td>
                <td class="text-center"><span>{{view_advisee.curri_progress[index].academic_year_taken}}</span></td>
                <td class="text-center"><span>{{view_advisee.curri_progress[index].semester_taken}}</span></td>
                <td class="text-center"><span>{{view_advisee.curri_progress[index].grade}}</span></td>
                <td class="text-center"><span>{{view_advisee.curri_progress[index].notes}}</span></td>
              </tr>          
            </tbody>           
          </table>
        </div>
        <!-- end Curriculum Progress -->
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
        <span style="font-family: Open_Sans_Bold;">Remarks for Revision</span>
        <div class="align-items-center d-flex flex-row justify-content-center" style="gap: 15px;">
          <textarea class="form-control" v-model="remarksString" rows="3"></textarea>
        </div>
        <!-- Actions -->
        <div class="align-items-center d-flex flex-row justify-content-center" style="gap: 15px;">
          <div @click="updateStatus('Waiting for Revision')" class="hoverTransform myButton2" style="background-color: #7F6000">For Revision</div>
          <div @click="updateStatus('Approved')" class="hoverTransform myButton2" style="background-color: #093405">Approve</div>
        </div>
        <!-- end Actions -->
      </div>
      <!-- end View Advisee Details Body -->
    </div>
    <!-- end View Advisee Details Div -->    
  </div>
  <!-- end Adviser Dashboard -->
  <Footer />
</div>
</template>

<style scoped>
</style>