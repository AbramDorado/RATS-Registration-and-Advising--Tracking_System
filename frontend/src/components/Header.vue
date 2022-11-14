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
<!-- Header Component -->
<!-- Header Main Div -->
<div class="headerDiv align-items-center d-flex flex-row justify-content-between" style="background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; color: white; height: 92px; padding: 14px 23px 13px 23px; user-select: none;">
  <!-- Header Left Div -->
  <div @click="redirect('/')" class="align-items-center d-flex flex-row" style="cursor: pointer;">
      <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="height: 65px; margin-right: 8px; width: 65px; ">
      <h1 style="font-family: IBM_Plex_Sans_Condensed_Bold; font-size: 40px; margin: 0;">CAS R.A.T.</h1>
    </div>
  <!-- end Header Left Div -->
  <!-- Header Middle Div -->
  <div class="d-flex flex-row" style="gap: 30px;">
      <!-- Home Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <!-- Home Icon -->
        <i class="align-items-center bi bi-house-fill d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
        <!-- end Home Icon -->
        <h3 @click="this.redirect('/')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Home</h3>
      </div>
      <!-- end Home Button -->
      <!-- Advising Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <!-- Advising Icon -->
        <i class="align-items-center bi bi-ui-checks d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
        <!-- end Advising Icon -->
        <h3 v-if="user.role === 'student'" @click="this.redirect('/ecf')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Enrollment</h3>
        <h3 v-else-if="user.role === 'adviser'" @click="this.redirect('/advising')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Advising</h3>
        <h3 v-else-if="user.role === 'ocs'" @click="this.redirect('/ocs')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashbord</h3>
        <h3 v-else @click="this.redirect('/admin')" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashboard</h3>
      </div>
      <!-- end Enrollment Button -->
      <div class="hoverTransform align-items-center d-flex flex-row">
        <!-- Schedule of Classes Icon -->
        <i class="align-items-center bi bi-calendar-week-fill d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
        <!-- end Schedule of Classes Icon -->
        <h3 style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Schedule of Classes</h3>
      </div>
    </div>
  <!-- end Header Middle Div -->

  <!-- Header Right Div -->
  <div class="headerRight align-items-center d-flex flex-row justify-content-end" style="gap: 20px;">
    <!-- Notifications Icon -->
    <div id="notifsIconDiv" style="position: relative;">
      <div @click="togglePopover('notifsPopover')" class="notifsIcon hoverTransform">
        <!-- Notifications Icon -->
        <i class="align-items-center bi bi-bell-fill d-flex" style="color: white; font-size: 30px;"></i>
        <!-- end Notifications Icon -->
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
        <!-- Account Icon -->
        <i class="align-items-center bi bi-person-circle d-flex" style="color: white; font-size: 30px;"></i>
        <!-- end Account Icon -->
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
  user-select: none;
}
  .hoverTransform:hover {
    transform: scale(1.05);
  }
  .hoverTransform:active {
    transform: scale(0.95);
  }
</style>