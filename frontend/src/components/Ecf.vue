<script>
export default {
  name: 'Ecf',
  computed: {
    formatted_name() {
      return this.user.first_name + ' ' + this.user.last_name
    }    
  },
  data() {
    return {
      ecf: []
    }
  },
  props: ['semester',
    'acad_year',
    'user'
  ],
  methods: {
    async updateECF() {
      try {
        const response = await this.axios.post('/api/ecf/read/all/student', {student_up_mail: this.user.up_mail})
        this.ecf = response.data.rows
      } catch (error) {
        console.log('Error on Ecf.vue > updateECF()', error)
        alert(error.data.message)
      }
    },
    async deleteCourse(course) {
      try {
        const response = await this.axios.post('/api/ecf/delete', {class_number: course.class_number})
        this.updateECF()
        alert(`Deleted ${course.class_number} from ECF`)
      } catch (error) {
      console.log('Error on Ecf.vue > deleteCourse()', error)
      alert(error.data.message)        
      }
    },
    formatted_course_code(course) {
      return `${course.subject} ${course.catalog_no}`
    },
    totalUnits() {
      var sum = 0
      for (let i=0; i<this.ecf.length; i++) {
        sum += parseInt(this.ecf[i].units)
      }
      return sum
    }
  },
  mounted() {
    this.updateECF()
  }
}
</script>

<template>
<div class="d-flex flex-column" style="background-color: white; border: 2px solid gray; padding: 10px; width: 750px;">
  <div class="d-flex flex-column" style="margin-bottom: 10px;">
    <span class="osb text-center">ENROLLMENT CHECKLIST FORM</span>
    <span class="os text-center"><span class="osb" style="text-decoration: underline;">{{semester}}</span> Semester, Academic Year <span class="osb" style="text-decoration: underline;">{{acad_year}}</span></span>
  </div>
  <div class="d-flex flex-column" style="margin-bottom: 10px;">
    <span>STUDENT NAME: <b>{{formatted_name}}</b></span>
    <span>STUDENT NUMBER: <b>{{user.student_number}}</b></span>
    <span>DEGREE PROGRAM: <b>{{user.degree_program}}</b></span>
    <span>ADVISER: <b>{{user.adviser_up_mail}}</b></span>
    <span>SAIS ID NUMBER: <b>{{user.sais_id}}</b></span>
  </div>
  <div style="border: 2px solid lightgray;">
    <!-- Table Head -->
    <div class="d-flex flex-row" style="border-bottom: 2px solid lightgray;">
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray; max-width: 140px;">Class Number</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray; max-width: 140px;">Course Code</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray; max-width: 140px;">Section</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray; max-width: 140px;">Units</div>
      <div class="fg-1 fw-bold text-center">Action</div>
    </div>
    <!-- end Table Head -->
    <!-- Table Body -->
    <div v-for="(obj, index) in this.ecf" :key="index" class="d-flex flex-row" style="border-bottom: 2px solid lightgray; height: 30px;">
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray; max-width: 140px;">{{ecf[index].class_number}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray; max-width: 140px;">{{formatted_course_code(ecf[index])}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray; max-width: 140px;">{{ecf[index].section}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray; max-width: 140px;">{{ecf[index].units}}</div>
      <div class="fg-1 d-flex align-items-center justify-content-center">
        <div @click="deleteCourse(this.ecf[index])" class="hoverTransform" style="background-color: rgb(70, 12, 15); border: 1px solid white; border-radius: 5px; color: white; cursor: pointer; font-family: Open_Sans; font-size: 12px; padding: 5px 10px;">
          Delete
        </div>
      </div>
    </div>
    <!-- end Table Body -->
  </div>
  <div class="d-flex flex-column" style="margin-top: 10px;">
    <span>TOTAL NUMBER OF UNITS ENROLLED: <b>{{totalUnits()}}</b></span>
  </div>
</div>
</template>

<style scoped>
.fg-1 {
  flex-basis: 0;
  flex-grow: 1;
}
.os {
  font-family: Open_Sans;
}
.osb {
  font-family: Open_Sans_Bold;
}
</style>