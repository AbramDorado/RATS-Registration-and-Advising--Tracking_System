<script>
export default {
  name: 'Login',
  data() {
    return {
      error1: false,
      loading: false,
      loggedOut: false,
      remember: false
    }
  },
  methods: {
    async doLogin() {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.remember) {
        document.cookie = 'remember=true'
      } else {
        document.cookie = 'remember=false'
      }
      location.href = '/api/login/federated/google'
    }
  },
  async mounted() {
    const thiss = this
    try {
      const response = await this.axios.post('/api/authorize')
      location.href = '/'
    } catch(error) {
      console.log('Error on Login Page > api/authorize', error) // temp
    }
    if (location.search === '?error=1') {
      this.error1 = true
    }
    if (location.search === '?loggedOut=true') {
      this.loggedOut = true
    }
    this.$refs['login'].style.display = 'flex'
  }
}
</script>

<template>
<div ref="login" class="align-items-center justify-content-center" style="background-image: url('login_bg.png'); background-position: center; background-repeat: no-repeat; background-size: cover; display: none; width: 100%; height: 100%;">
  <div class="mainLoginDiv">
    <div class="loginMainDiv align-items-center d-flex justify-content-center" style="background-color: white; height: 500px; width: 1000px;">
      <div class="loginDiv d-flex flex-row" style="height: 100%; min-height: 400px;">
        <div class="leftDiv align-items-center d-flex flex-column justify-content-center" style="gap: 81px; height: 500px; width: 500px;">
          <div class="header d-flex flex-row justify-content-between " style="margin-right: 5px; max-height: 100px; width: 436px;">
            <div class="headerLeft d-flex align-items-center justify-content-center">
              <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="display: block; height: 100px; width: 100px;">
            </div>
            <div class="headerRight d-flex flex-column justify-content-center">
              <div style="height: 66px;" class="d-flex flex-column justify-content-between">
                <div class="lh-1">
                  <span style="font-size: 15px;">University of the Philippines Manila</span>
                </div>
                <div class="lh-1">
                  <b style="font-size: 20px; font-family: IBM_Plex_Sans_Condensed_Bold">College of Arts and Sciences</b>
                </div>
                <div class="lh-1">
                  <span style="font-size: 20px; font-family: IBM_Plex_Sans_Condensed_Bold">Registration and Advising Tool (R.A.T.)</span>
                </div>
              </div>

            </div>
          </div>
          <div v-if="error1" class="alert alert-danger p-3" role="alert">
            Please try again with a UP Mail
          </div>
          <div v-if="loggedOut" class="alert alert-danger p-3" role="alert">
            You have logged out
          </div>
          <div class="checkboxAndButton d-flex flex-column gap-3 justify-content-center">
            <div class="rememberMeWrapper align-items-center d-flex justify-content-center">
              <div class="d-flex form-check flex-row align-items-center gap-1 justify-content-center">
                <input v-model="remember" class="form-check-input ms-0" type="checkbox" value="" id="rememberButton" checked style="margin-top: 3px; cursor: pointer;">
                <label class="form-check-label" for="flexCheckChecked">
                  Remember me
                </label>
              </div>
            </div>
            <div class="align-items-center d-flex justify-content-center">
              <button id="loginButton" @click="doLogin()" class="hoverTransform align-items-center btn d-flex justify-content-center shadow-lg text-light" style="background-color: #950B10; border-radius: 30px; height: 59px; width: 242px;">
                <span v-if="!loading">Login with UP Mail</span>
                <div v-else class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div id="rightDiv" class="d-flex" style="width: 500px; height: 500px;">
          <img src="/PGH_bg.jpeg" alt="" style="display: block; max-height: 500px; max-width: 500px; object-position: 50% 50%;">
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

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

.spinner {
  margin: 0 auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 15px;
  height: 15px;
  background-color: white;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>