<script>
export default {
  name: 'ScheduleOfClasses',
  props: [
    'user'
  ],
  data() {
    return {
      courses: null, // will store response of updateCourses()
      dept: 'DAC', // used in main table dropdown
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
    formatted_date(miliseconds) {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      var myDate = new Date(parseInt(miliseconds))
      return myDate.toLocaleDateString("en-US", options)
    },    
    showFullscreen() {
      this.updateEditedCourses()
      this.updateCourses()
      this.$refs['floatingButton'].style.display = 'none'
      this.$refs['fullscreenDiv'].style.display = 'block'      
    },
    async updateCourses() {
      try {
        const response = await this.axios.post('/api/course/read/all', {dept: this.dept})
        this.courses = response.data.rows
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
  <div class="d-flex flex-column" style="background-color: rgb(248, 246, 240); height: 100%; overflow-y: scroll; padding: 15px;">
    <!-- Close Button -->
    <div class="align-items-center align-self-end d-flex justify-content-end" style="margin-bottom: 10px;">
      <div @click="closeFullscreen()" class="hoverTransform myButton1" style="background-color: #751518;">Close</div>
    </div>
    <!-- end Close Button -->
    <!-- Modified Courses -->
    <div class="align-items-center d-flex flex-column myMainDiv1" style="margin-bottom: 20px; max-height: 300px;">
      <!-- Modified Courses Header Div -->
      <div class="d-flex flex-row justify-content-between" style="width: 100%;">
        <!-- <div style="flex-basis: 0; flex-grow: 1;"></div> -->
        <div class="align-items-center d-flex justify-content-center" style="flex-basis: 0; flex-grow: 1;">
          <span class="myHeading1">Recently Modified Courses</span>
        </div>
      </div>
      <!-- end Modified Courses Header Div -->
      <!-- Modified Courses Body -->
      <div style="overflow-y: scroll; width: 100%;">
        <table class="fixed-table-body table table-bordered table-responsive" style="margin-bottom: 0;">
          <thead>
            <tr>
              <th class="align-middle text-center" scope="col">Class Number</th>
              <th class="align-middle text-center" scope="col">Subject</th>
              <th class="align-middle text-center" scope="col">Catalog Number</th>
              <th class="align-middle text-center" scope="col">Section</th>
              <th class="align-middle text-center" scope="col">Modification</th>
              <th class="align-middle text-center" scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, index) in edited_courses" :key="index">
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{edited_courses[index].class_number}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{edited_courses[index].subject}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{edited_courses[index].catalog_no}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{edited_courses[index].section}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{edited_courses[index].modification}}</td>
              <td class="text-center" style="font-family: Open_Sans; font-size: 14px; overflow: auto; text-overflow: ellipsis;">{{formatted_date(edited_courses[index].last_modified)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end Modified Courses Body -->
    </div>
    <!-- end Modified Courses -->
    <!-- Main Table -->
      <div class="align-items-center d-flex flex-column myMainDiv1">
        <!-- Main Table Header Div -->
        <span class="myHeading1">Schedule of Classes</span>
        <!-- end Main Table Header Div -->
        <!-- Main Table Body -->
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
                <th v-if="user.role === 'student'" class="align-middle text-center" scope="col" style="font-size: 12px;">Actions</th>
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
                <td class="text-center" style="font-family: Open_Sans; font-size: 10px; overflow: auto; text-overflow: ellipsis;">{{courses[index].learning_delivery_mode}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].room_assigned}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].instructor}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].class_capacity}}</td>
                <td class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">{{courses[index].restrictions}}</td>
                <td v-if="user.role === 'student'" class="text-center" style="font-family: Open_Sans; font-size: 12px; overflow: auto; text-overflow: ellipsis;">Add Button</td>
              </tr>
            </tbody>
          </table>
        <!-- end Main Table Body -->
      </div>
    <!-- end Main Table -->
    <!-- Close Button -->
    <div class="align-items-center align-self-end d-flex justify-content-end" style="margin-top: 10px;">
      <div @click="closeFullscreen()" class="hoverTransform myButton1" style="background-color: #751518;">Close</div>
    </div>
    <!-- end Close Button -->    
  </div>
</div>
<!-- end Popover -->
</template>

<style scoped>
.myHeading1 {
  font-family: Open_Sans_Bold;
  font-size: 24px;
  line-height: 1;
  margin-bottom: 10px;
}
.myMainDiv1 {
  background-color: white;
  border: 2px solid black;
  border-radius: 5px;
  padding: 20px;
}
</style>