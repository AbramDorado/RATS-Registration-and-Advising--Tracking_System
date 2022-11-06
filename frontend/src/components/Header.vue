<script>
export default {
  name: 'Header',
  props: ['user'],
  data() {
    return {
      popOversArr: ['notifsPopover', 'accPopover']
    }
  },
  computed: {
    formatted_name() {
      return this.user.first_name + " " + this.user.last_name
    } 
  },  
  methods: {
    async doLogout() {
      try {
        const response = await this.axios.post('/api/logout')
        console.log(response.data.message) // temp
        location.href = response.data.redirect
      } catch (error) {
        console.log(error) // temp
      }
    },
    hideAllPopovers() {
      for (let i=0; i<this.popOversArr.length; i++) {
        this.hidePopover(this.popOversArr[i])
      }
    },
    hidePopover(ref) {
      // refs: notifsPopover, accPopover
      this.$refs[ref].style.display = 'none'
    },
    redirect(to) {
      location.href = to
    },
    showPopover(ref) {
      // refs: notifsPopover, accPopover
      this.$refs[ref].style.display = 'flex'
    },
    togglePopover(ref) {
      // refs: notifsPopover, accPopover
      if (this.$refs[ref].style.display === 'none') {
        this.hideAllPopovers()
        // show this popover
        this.showPopover(ref)
      } else { // if this popover is already shown
        this.hideAllPopovers()
      }
    }    
  }
}
</script>

<template>
<!-- Header Component
<button @click="doLogout()">Logout</button> -->
<!-- Header Main Div -->
<div class="headerDiv align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; color: white; height: 92px; padding: 14px 23px 13px 23px; user-select: none;">

  <!-- Header Left Div -->
  <div class="hoverTransform align-items-center d-flex flex-row">
      <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="height: 65px; margin-right: 8px; width: 65px; ">
      <h1 style="font-family: IBM_Plex_Sans_Condensed_Bold; font-size: 40px; margin: 0;">CAS R.A.T.</h1>
    </div>
  <!-- end Header Left Div -->

  <!-- Header Middle Div -->
  <div class="d-flex flex-row" style="gap: 30px;">
      <!-- Home Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" class="bi-house-door-fill" viewBox="0 0 16 16" style="margin-right: 5px; margin-bottom: 2px;">
          <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
        </svg>
        <h3 @click="this.redirect('/')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Home</h3>
      </div>
      <!-- end Home Button -->
      <!-- Enrollment Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" class="bi-ui-checks" viewBox="0 0 16 16" style="margin-right: 5px;">
          <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708l-2 2zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <h3 v-if="user.role === 'student'" @click="this.redirect('/ecf')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Enrollment</h3>
        <h3 v-else-if="user.role === 'adviser'" @click="this.redirect('/advising')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Advising</h3>
        <h3 v-else-if="user.role === 'ocs'" @click="this.redirect('/ocs')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashbord</h3>
        <h3 v-else @click="this.redirect('/admin')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashboard</h3>
      </div>
      <!-- end Enrollment Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi-calendar-week-fill" viewBox="0 0 16 16" style="margin-right: 5px;">
          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
        </svg>
        <h3 style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Schedule of Classes</h3>
      </div>
    </div>
  <!-- end Header Middle Div -->

  <!-- Header Right Div -->
  <div class="headerRight align-items-center d-flex flex-row justify-content-end" style="gap: 20px;">
    <!-- Notifications Icon -->
    <div id="notifsIconDiv" style="position: relative;">
      <div @click="togglePopover('notifsPopover')" class="notifsIcon hoverTransform">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi-bell-fill" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
      </div>
      <!-- Notifications Popover -->
      <div ref="notifsPopover" class="myPopover rounded shadow-sm" style="background-color: rgba(255, 255, 255, 1); border: 1px solid black; bottom: 0px; color: #290506; display: none; height: 200px; position: absolute; right: 0px; transform: translate(-3%, 105%); width: 200px; z-index: 100;">
        Notifications Popover
      </div>
      <!-- end Notifications Popover -->
    </div>
    <!-- end Notifications Icon -->
    <!-- Account Icon -->
    <div id="accIconDiv" style="position: relative">
      <div @click="togglePopover('accPopover')" class="accIcon hoverTransform">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
      </div>
      <!-- Account Popover -->
      <div ref="accPopover" class="myPopover align-items-center flex-column justify-content-center rounded shadow-sm" style="background-color: rgba(255, 255, 255, 1); border: 1px solid black; bottom: 0px; color: #290506; display: none; min-width: 300px; padding: 20px 20px; position: absolute; right: 0px; transform: translate(-1%, 105%); z-index: 100;">
        <h3 style="font-family: Open_Sans_Bold; font-size: 20px; margin-bottom: 10px;">Account</h3>
        <div style="border-bottom: 2px solid #290506; margin-bottom: 15px; width: 80%;"></div>
        <div class="align-items-center d-flex flex-row justify-content-center" style="gap: 10px; margin-bottom: 20px; padding: 0 20px; white-space: nowrap; width: 100%;">
          <div class="d-flex flex-column" style="min-width: 100px;">
            <p style="font-family: Open_Sans; margin-bottom: 0;">Name:</p>
            <p style="font-family: Open_Sans; margin-bottom: 0;">Role:</p>
            <p style="font-family: Open_Sans; margin-bottom: 0;">UP Mail:</p>
          </div>
          <div class="d-flex flex-column text-end">
            <p style="font-family: Open_Sans_Bold; margin-bottom: 0; text-transform: capitalize;">{{this.formatted_name}}</p>
            <p style="font-family: Open_Sans_Bold; margin-bottom: 0; text-transform: capitalize;">{{this.user.role}}</p>
            <p style="font-family: Open_Sans_Bold; margin-bottom: 0;">{{this.user.up_mail}}</p>
          </div>
        </div>
        <div @click="doLogout()" class="hoverTransform px-3 py-1 rounded" style="background-color: #751518; color: white; cursor: pointer; font-family: Open_Sans_Semi_Bold; font-weight: bolder;">Logout</div>
      </div>
      <!-- end Account Popver -->
    </div>
    <!-- end Account Icon -->
    </div>
  <!-- end Header Right Div -->

</div>
<!-- end Header Main Div -->
</template>

<style scoped>
.hoverTransform {
  cursor: pointer;
  transition: transform 0.1s linear;
}
  .hoverTransform:hover {
    transform: scale(1.05);
  }
</style>