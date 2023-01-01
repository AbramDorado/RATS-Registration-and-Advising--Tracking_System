<script>
export default {
  name: 'Ecf',
  computed: {
    formatted_name() {
      return this.user.first_name + ' ' + this.user.last_name
    }    
  },
  props: ['semester',
    'acad_year',
    'user'
  ]
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
    <div class="d-flex flex-row">
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">Class Number</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">Course Code</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">Section</div>
      <div class="fg-1 text-center" style="border-right: 1px solid lightgray;">Units</div>
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