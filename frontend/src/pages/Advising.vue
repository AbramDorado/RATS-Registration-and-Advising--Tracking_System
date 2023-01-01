<script>
import Ecf from '../components/Ecf.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ScheduleOfClasses from '../components/ScheduleOfClasses.vue'
export default {
  name: 'Advising',
  components: {
    Ecf, Header, Footer, ScheduleOfClasses
  },
  data() {
    return {
      curri_progress: [{
        course: '',
        section: '',
        academic_year_taken: '',
        semester_taken: '',
        grade: '',
        notes: ''
      }],
      curri_shown: false,
      editMode: false,
      user: {},
      ECF_shown: false
    }
  },
  async mounted() {
    await this.authorize()
    await this.update_curri_progress()
  },
  methods: {
    addCurriProgressRow() {
      this.curri_progress.push({
        course: '',
        section: '',
        academic_year_taken: '',
        semester_taken: '',
        grade: '',
        notes: ''     
      })
    },
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        this.user = response.data
      } catch(err) {
        location.href = '/login' // to do: allow logging in as 'guest' for non-cas students
      }
    },
    async deleteRow(index) {
      this.curri_progress.splice(index, 1)
      // update to backend
      try {
        const response = await this.axios.post('/api/advising/curri/update', {curri_progress: this.curri_progress})
      } catch (error) {
        console.log('Error on Advising.vue > deleteRow', error)
        alert('Error')
      }
    },
    async finishEditingCurri() {
      // update to backend
      try {
        const response = await this.axios.post('/api/advising/curri/update', {curri_progress: this.curri_progress})
      } catch (error) {
        console.log('Error on Advising.vue > finishEditingCurri', error)
        alert('Error')
      }
      this.toggleEditMode(false)
    },
    async update_curri_progress() {
      // to do
      try {
        const response = await this.axios.post('/api/advising/curri/read')
        this.curri_progress = JSON.parse(response.data.row.curri_progress)
      } catch (error) {
        console.log('Error on Advising.vue > update_curri_progress', error)
        // alert('Error')
      }
    },
    toggleEditMode(bool) {
      this.editMode = bool
    }
  }
}
</script>

<template>
<ScheduleOfClasses :user="this.user" />
<!-- Advising Div -->
<div class="d-flex flex-column" style="background-color: lightgray; min-height: 100vh;">
  <Header :user="this.user"/>

  <!-- Student View: Advising Page Body -->
  <div v-if="this.user.role === 'student'" class="align-items-start d-flex flex-column" style="flex-grow: 1; gap: 20px; margin: 2%;">
    <!-- Curriculum Progress -->
    <div class="div2">
      <!-- Curriculum Progress Header -->
      <div ref="curriculumHeader" class="align-items-center d-flex flex-row justify-content-between" style="margin-bottom: 15px;">
        <!-- Left -->
        <div class="d-flex">
          <i class="align-items-center bi bi-mortarboard-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
          <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Step 1: Curriculum Progress</span>
        </div>
        <!-- end Left -->
        <!-- Right -->
        <div class="d-flex">
          <span v-if="!this.editMode" @click="toggleEditMode(true)" class="hoverTransform" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Edit</span>  
          <span v-else @click="finishEditingCurri()" class="hoverTransform" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Finish Editing</span>      
        </div>
        <!-- end Right -->
      </div>
      <!-- end Curriculum Progress Header -->
      <!-- Curriculum Progress Body -->
      <div ref="curri_body">
        <table class="table table-sm" style="overflow-x: scroll; table-layout: fixed;">
          <thead>
            <tr>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Course</th>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Section</th>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Academic Year Taken</th>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Semester Taken</th>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Grade</th>
              <th scope="col" class="text-center" style="color: rgb(70, 12, 15);">Notes</th>
              <th v-if="this.editMode" scope="col" class="text-center" style="color: rgb(70, 12, 15);">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in curri_progress" :key="index">
              <td><input v-model="curri_progress[index].course" :disabled="!this.editMode" type="text" :value="curri_progress[index].course" class="text-center" style="width: 100%;"></td>
              <td><input v-model="curri_progress[index].section" :disabled="!this.editMode" type="text" :value="curri_progress[index].section" class="text-center" style="width: 100%;"></td>
              <td><input v-model="curri_progress[index].academic_year_taken" :disabled="!this.editMode" type="text" :value="curri_progress[index].academic_year_taken" class="text-center" style="width: 100%;"></td>
              <td><input v-model="curri_progress[index].semester_taken" :disabled="!this.editMode" type="text" :value="curri_progress[index].semester_taken" class="text-center" style="width: 100%;"></td>
              <td><input v-model="curri_progress[index].grade" :disabled="!this.editMode" type="text" :value="curri_progress[index].grade" class="text-center" style="width: 100%;"></td>
              <td><input v-model="curri_progress[index].notes" :disabled="!this.editMode" type="text" :value="curri_progress[index].notes" class="text-center" style="width: 100%;"></td>
              <td v-if="this.editMode" class="d-flex justify-content-center"><span @click="deleteRow(index)" class="hoverTransform" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Delete Row</span></td>
            </tr>          
          </tbody>           
        </table>
        <!-- Add Button -->
        <div v-if="this.editMode" class="d-flex hoverTransform justify-content-center" style="margin-bottom: 10px;">
          <span @click="addCurriProgressRow()" class="hoverTransform" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Add Row</span>
        </div>
        <!-- end Add Button -->
        <!-- Copy of Buttons -->
        <div class="d-flex justify-content-center">
          <span v-if="!this.editMode" @click="toggleEditMode(true)" class="hoverTransform" style="background-color: rgb(127, 96, 0); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Edit</span>  
          <span v-else @click="finishEditingCurri()" class="hoverTransform" style="background-color: #093405; border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 14px; padding: 5px 10px;">Finish Editing</span>      
        </div>
        <!-- end Copy of Buttons -->
      </div>
      <!-- end Curriculum Progress Body -->
    </div>
    <!-- end Curriculum Progress -->
    <!-- ECF -->
    <div class="div2" id="ecfDiv">
      <!-- ECF Header -->
      <div ref="ecfHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
        <i class="align-items-center bi bi-list-check d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
        <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Step 2: Enrollment Checklist Form</span>
      </div>
      <!-- end ECF Header -->
      <!-- ECF Body -->
      <div ref="ECF_body" class="d-flex justify-content-center">
        <Ecf :user="this.user" />
      </div>
      <!-- end ECF Body -->
    </div>
    <!-- end ECF -->
  </div>
  <!-- end Student View: Advising Page Body -->

  <Footer />
</div>
<!-- end Advising Div -->
<div>

</div>
</template>

<style scoped>
.div2 {
  background-color: #F8F6F0;
  border: 2px solid #093405;
  border-radius: 10px;
  padding: 15px 20px;
  width: 100%;
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