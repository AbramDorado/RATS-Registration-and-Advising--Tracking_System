<script>
export default {
  name: 'Ecf',
  props: ['semester',
    'acad_year',
    'student_name',
    'student_number',
    'deg_prog',
    'sais_id'
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
    <span>STUDENT NAME: {{student_name}}</span>
    <span>STUDENT NUMBER: {{student_number}}</span>
    <span>DEGREE PROGRAM: {{deg_prog}}</span>
    <span>SAIS ID NUMBER: {{sais_id}}</span>
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