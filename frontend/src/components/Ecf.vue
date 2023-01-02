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
      ecf: [
        {
          class_number: '20080',
          subject: 'CMSC',
          catalog_no: '125',
          section: 'LEC',
          units: '3',
        },
        {
          class_number: '20081',
          subject: 'CMSC',
          catalog_no: '125',
          section: 'LAB',
          units: '0',
        },
        {
          class_number: '20084',
          subject: 'CMSC',
          catalog_no: '128.1',
          section: 'LEC',
          units: '3',
        },
        {
          class_number: '20085',
          subject: 'CMSC',
          catalog_no: '128.1',
          section: 'LAB',
          units: '3',
        },
        {
          class_number: '20136',
          subject: 'STAT',
          catalog_no: '122',
          section: 'LEC',
          units: '3',          
        },
        {
          class_number: '20138',
          subject: 'STAT',
          catalog_no: '122',
          section: 'LAB',
          units: '0',          
        },   
        {
          class_number: '21110',
          subject: 'CMSC',
          catalog_no: '122',
          section: 'LEC',
          units: '3',          
        },
        {
          class_number: '21111',
          subject: 'CMSC',
          catalog_no: '122',
          section: 'LAB',
          units: '0',
        },
        {
          class_number: '21114',
          subject: 'HI',
          catalog_no: '191',
          section: 'LEC',
          units: '3',
        },
      ]
    }
  },
  props: ['semester',
    'acad_year',
    'user'
  ],
  methods: {
    deleteCourse(course) {
      alert('Not functional in demo version: Removes selected course from your ECF.')
    },
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
    // this.updateECF()
  }
}
</script>

<template>
<div class="d-flex flex-column" style="background-color: white; border: 2px solid gray; padding: 10px; width: 750px;">
  <div class="d-flex flex-column" style="margin-bottom: 10px;">
    <span class="osb text-center">ENROLLMENT CHECKLIST FORM</span>
    <span class="os text-center"><span class="osb" style="text-decoration: underline;">First</span> Semester, Academic Year <span class="osb" style="text-decoration: underline;">2022-2023</span></span>
  </div>
  <div class="d-flex flex-column" style="margin-bottom: 10px;">
    <span>STUDENT NAME: <b>Juan D. Cruz</b></span>
    <span>STUDENT NUMBER: <b>2020-12345</b></span>
    <span>DEGREE PROGRAM: <b>BS Computer Science</b></span>
    <span>SAIS ID NUMBER: <b>100080</b></span>
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
    <span>TOTAL NUMBER OF UNITS ENROLLED: <b>15</b></span>
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