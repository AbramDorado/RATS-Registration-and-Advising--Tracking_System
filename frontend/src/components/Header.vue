<script>
export default {
  name: 'Header',
  props: ['user'], // Stores the user passed from parent's Authorize API call
  data() {
    return {
      popOversArr: ['accPopover'] // Used in hideAllPopovers()
    }
  },
  computed: {
    formatted_name() { // Used in Account Popover
      return this.user.first_name + ' ' + this.user.middle_name + ' ' + this.user.last_name
    },
    formatted_role() {
      if (this.user.role === 'student') {
        return 'Student'
      } else if (this.user.role === 'adviser') {
        return 'Adviser'
      } else if (this.user.role === 'ocs') {
        return 'OCS'
      } else {
        return 'Admin'
      }
    }
  },
  mounted() {
    // Initialize Bootstrap Popper Tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    // end Initialize Bootstrap Popper Tooltip 
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
      // refs: accPopover
      this.$refs[ref].style.display = 'none'
    },
    redirect(to) {
      location.href = to
    },
    showPopover(ref) {
      // refs: accPopover
      this.$refs[ref].style.display = 'flex'
    },
    generateRandomString() {
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 10; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      return result;
    },
    toAdvising() {
      if (this.user.role === 'student') {
        location.href = '/advising'
      } else if (this.user.role === 'adviser') {
        location.href = '/adviser'
      } else if (this.user.role === 'ocs') {
        location.href = '/ocs'
      } else if (this.user.role === 'admin') {
        const randomString = this.generateRandomString();
      // Navigate to /admin with the generated random string
      this.$router.push({ name: 'admin-with-random', params: { randomString } });
      } else {
        location.href = '/login'
      }
    },
    togglePopover(ref) {
      // refs: accPopover
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
<!-- Header Main Div -->
<div class="align-items-center d-flex flex-row justify-content-between" style="position: fixed; width: 100%; background-image: url(/header_bg.png); background-position: center; background-repeat: no-repeat; background-size: cover; color: white; height: 92px; padding: 14px 23px 13px 23px; user-select: none;">
  <!-- Header Left Div -->
  <div @click="redirect('/')" class="align-items-center d-flex flex-row" style="cursor: pointer;">
    <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="height: 65px; margin-right: 8px; width: 65px; ">
    <h1 style="font-family: IBM_Plex_Sans_Condensed_Bold; font-size: 40px; margin: 0;">CAS R.A.T.S.</h1>
  </div>
  <!-- end Header Left Div -->
  <!-- Header Middle Div -->
  <div class="d-flex flex-row" style="gap: 30px;">
    <!-- Home Button -->
    <div @click="this.redirect('/')" class="hoverTransform align-items-center d-flex flex-row">
      <!-- Home Icon -->
      <i class="align-items-center bi bi-house-fill d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
      <!-- end Home Icon -->
      <h3 style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Home</h3>
    </div>
    <!-- end Home Button -->
    <!-- Advising Button -->
    <div @click="toAdvising()" class="hoverTransform align-items-center d-flex flex-row">
      <!-- Advising Icon -->
      <i class="align-items-center bi bi-ui-checks d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
      <!-- end Advising Icon -->
      <h3 v-if="user.role === 'student'" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Advising</h3>
      <h3 v-else-if="user.role === 'adviser'" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashboard</h3>
      <h3 v-else-if="user.role === 'ocs'" style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashboard</h3>
      <h3 v-else style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Dashboard</h3>
    </div>
    <!-- end Advising Button -->
    <!-- Contact Button -->
    <div @click="redirect('/contact')" class="hoverTransform align-items-center d-flex flex-row">
      <!-- Contact Icon -->
      <i class="align-items-center bi bi-question-circle-fill d-flex" style="color: white; font-size: 22px; margin-right: 5px;"></i>
      <!-- end Contact Icon -->
      <h3 style="font-family: Open_Sans_Semi_Bold; font-size: 22px; margin-bottom: 0;">Contact</h3>
    </div>
    <!-- end Advising Button -->    
  </div>
  <!-- end Header Middle Div -->

  <!-- Header Right Div -->
  <div class="headerRight align-items-center d-flex flex-row justify-content-end" style="gap: 20px;">
    <!-- Account Icon -->
    <div id="accIconDiv" style="position: relative">
      <div @click="togglePopover('accPopover')" data-bs-toggle="tooltip" data-bs-title="Account" data-bs-placement="left" class="accIcon hoverTransform">
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
            <p style="font-family: Open_Sans_Bold; margin-bottom: 0; text-transform: capitalize;">{{this.formatted_role}}</p>
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