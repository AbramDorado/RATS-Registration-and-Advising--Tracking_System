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
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.mounted()
        })
    },
    async mounted() {
        try {
            await this.axios.post('/api/auth/authorize')
        } catch(error) {
            console.log('Error on Login.vue > api/auth/authorize', error)
        }
        if (location.search === '?error=1') {
            this.error1 = true
        }
        if (location.search === '?loggedOut=true') {
            this.loggedOut = true
        }
        this.$refs['mainDiv'].style.display = 'flex'
    }
}
</script>

<template>
<div ref="mainDiv" id="mainDiv" class="align-items-center justify-content-center">
    <div id="mainLoginDiv" class="align-items-center d-flex justify-content-center">
        <div id="leftDiv" class="align-items-center d-flex flex-column justify-content-center">

            <div id="leftDivHeader" class="align-items-center d-flex justify-content-between mb-5">
                <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" class="h-100">
                <div id="leftDivHeaderRightDiv" class="align-items-start d-flex flex-column py-4">
                    <h2 class="fs-6 ibm-bold mb-2">University of the Philippines Manila</h2>
                    <h2 class="fs-6 ibm-bold">College of Arts and Sciences</h2>
                    <h2 class="fs-6 ibm-bold">Registration and Advising Tracking System</h2>
                    <h2 class="fs-6 ibm-bold">(R.A.T.S.)</h2>
                </div>
            </div>
            <div v-if="error1" class="alert alert-danger mb-3 p-3" role="alert">
                Please try again with a UP Mail
            </div>
            <div v-if="loggedOut" class="alert alert-danger mb-3 p-3" role="alert">
                You have logged out
            </div>
            <div class="checkboxAndButton d-flex flex-column justify-content-center">
                <div class="d-flex form-check flex-row align-items-center justify-content-center mb-2">
                    <input v-model="remember" class="form-check-input me-1 ms-0" type="checkbox" id="rememberButton" style="margin-top: 2px; cursor: pointer;">
                    <label class="form-check-label" for="flexCheckChecked">Remember me</label>
                </div>
                <div class="align-items-center d-flex justify-content-center">
                    <button id="loginButton" @click="doLogin()" class="hoverTransform align-items-center btn d-flex justify-content-center px-4 py-3 shadow-lg text-light">
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
        <div id="rightDiv">
            <img src="/PGH_bg.jpeg" alt="UPM-PGH" class="h-100 w-100">
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

#mainDiv {
    background-image: url('/login_bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: none;
    flex-grow: 1;
    height: 100%;
    width: 100%;
}


#mainLoginDiv {
    background-color: white;
    height: 80%;
    width: 80%;
}

/* leftDiv and rightDiv */
#mainLoginDiv > div {
    height: 100%;
    width: 50%;
}

#leftDivHeader {
    height: 100px;
    width: 80%;
}

#loginButton {
    background-color: #950B10;
    border-radius: 4rem;
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