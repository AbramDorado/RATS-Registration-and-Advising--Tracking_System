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
    formatted_course_code(course) {
      return `${course.subject} ${course.catalog_no}`
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
    <span>SAIS ID NUMBER: <b>{{user.sais_id}}</b></span>
  </div>
  <div style="border: 2px solid lightgray;">
    <!-- Table Head -->
    <div class="d-flex flex-row" style="border-bottom: 2px solid lightgray;">
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray;">Class Number</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray;">Course Code</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray;">Section</div>
      <div class="fg-1 fw-bold text-center" style="border-right: 1px solid lightgray;">Units</div>
      <div class="fg-1 fw-bold text-center">Action</div>
    </div>
    <!-- end Table Head -->
    <!-- Table Body -->
    <div v-for="(obj, index) in this.ecf" :key="index" class="d-flex flex-row">
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">{{ecf[index].class_number}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">{{formatted_course_code(ecf[index])}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">{{ecf[index].section}}</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">{{ecf[index].units}}</div>
      <div class="fg-1 text-center">Delete Button</div>
    </div>
    <!-- end Table Body -->
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