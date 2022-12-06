<script>
export default {
  name: 'ScheduleOfClasses',
  data() {
    return {
      courses_DAC: null, // aray that will store updateCourses() from DAC
      courses_DB: null, // aray that will store updateCourses() from DB
      courses_DBS: null, // aray that will store updateCourses() from DBS
      courses_DPE: null, // aray that will store updateCourses() from DPE
      courses_DPSM: null, // aray that will store updateCourses() from DPSM
      courses_DSS: null, // aray that will store updateCourses() from DSS
      courses_MM: null, // aray that will store updateCourses() from DAC
      edited_courses: null // array that will store updateEditedCourses()
    }
  },
  async mounted() {
    // Initialize Bootstrap Popper Tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    // end Initialize Bootstrap Popper Tooltip
    await this.updateCourses()
    await this.updateEditedCourses()
  },
  methods: {
    closeFullscreen() {
      this.$refs['fullscreenDiv'].style.display = 'none'
      this.$refs['floatingButton'].style.display = 'flex'
    },
    showFullscreen() {
      this.$refs['floatingButton'].style.display = 'none'
      this.$refs['fullscreenDiv'].style.display = 'block'      
    },
    async updateCourses() {
      try {
        const response = await this.axios.post('/api/course/read/all')
        this.courses_DAC = response.data.DAC
        this.courses_DB = response.data.DB
        this.courses_DBS = response.data.DBS
        this.courses_DPE = response.data.DPE
        this.courses_DPSM = response.data.DPSM
        this.courses_DSS = response.data.DSS
        this.courses_MM = response.data.MM
      } catch (error) {
        console.log('Error on ScheduleOfClasses.vue > updateCourses()', error)
      }
    },
    async updateEditedCourses() {
      try {
        const response = await this.axios.post('/api/course_edit/read/all')
        this.edited_courses = response.data.rows
      } catch (error) {
        console.log('Error on ScheduleOfClasses.vue > updateEditedCourses()', error)
      }
    }
  }
}
</script>

<template>
<!-- Button -->
<div @click="showFullscreen()" ref="floatingButton" data-bs-toggle="tooltip" data-bs-title="Schedule of Classes" data-bs-placement="left" class="align-items-center hoverTransform justify-content-center shadow-lg" style="background-color: rgb(70, 12, 15); border: 0px solid white; border-radius: 50%; bottom: 30px; cursor: pointer; display: flex; height: 70px; position: fixed; right: 30px; width: 70px; z-index: 2;">
  <!-- Schedule of Classes Icon -->
  <i class="align-items-center bi bi-table d-flex" style="color: white; font-size: 30px;"></i>
  <!-- end Schedule of Classes Icon -->  
</div>
<!-- end Button -->
<!-- Popover -->
<div ref="fullscreenDiv" style="background-color: rgba(0, 0, 0, 0.5); display: none; height: 100%; padding: 30px; position: fixed; width: 100%; z-index: 2;">
  <div style="background-color: white; border: 2px solid green; height: 100%;">
    Schedule of Classes
    <!-- Modified Courses -->
    <div>
      {{edited_courses}}
    </div>
    <!-- end Modified Courses -->
    <!-- Main Table -->
    <div>
      {{courses_DAC}}
    </div>
    <!-- end Main Table -->
    <span @click="closeFullscreen()">Close</span>
  </div>
</div>
<!-- end Popover -->
</template>

<style scoped>
</style>