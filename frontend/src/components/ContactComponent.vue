<script>
export default {
  name: 'ContactComponent',
  data: function () {
    return {
      show: false
    }
  }
}
</script>
  
<template>
  <div>
    <!---
    <div v-if="show" class="card_component">
    -->
      <div class="header">
        <p class="title">Contact us</p>
        <!--
        <button @click="show = !show" class="exit"></button>
        -->
      </div>
      <div>
        <p class="body_title">College of Arts and Sciences<br>Office of the College Secretary</p>
        <div class="body">
          <div class="icons">
            <div class="icon email"></div>
            <div class="icon number"></div>
            <div class="icon facebook"></div>
            <div class="icon address"></div>
          </div>
          <div class="texts">
            <p class="text emtext">upm.cas.ocs@up.edu.ph</p>
            <p class="text numtext">12345678</p>
            <p class="text fbtext">facebook.com/upm</p>
            <p class="text addresstext">University of the Philippines Manila<br>College of Arts and Sciences<br>Padre Faura St., Manila</p>
          </div>
        </div>
      </div>
    </div>
    <!---
    <button @click="show = !show" class="floating_button"></button>
    -->

  
</template>
  
<style scoped>
.header {
  height: 50px;
  background-color: #093405;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.body_title {
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 33px;
  display: flex;
  justify-content: center;
  text-align: center;
  color: #370404;
  margin-top: 17px;
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 27px;
  display: inline-block;

  color: #FFFFFF;
  margin-left: 25px;
  padding-top: 10px;

}
.icons{
  float: left;
  min-width: 45px;
  min-height: 178px;
  
  
}

.icon{
  margin-bottom: 10px;
}

.email{
  background-image: url(../../public/🦆\ icon\ _envelope_.svg);
  height: 35px;
  width: 45px;
  fill: transparent;
  background-repeat: no-repeat;
  background-color: transparent;
  border-color: transparent;
}

.number{
  background-image: url(../../public/🦆\ icon\ _phone\ call_.svg);
  height: 48px;
  width: 45px;
  fill: transparent;
  background-repeat: no-repeat;
  background-color: transparent;
  border-color: transparent;
}

.facebook{
  background-image: url(../../public/🦆\ icon\ _facebook_.svg);
  height: 50px;
  width: 45px;
  fill: transparent;
  background-repeat: no-repeat;
  background-color: transparent;
  border-color: transparent;
}

.address{
  background-image: url(../../public/🦆\ icon\ _location_.svg);
  height: 45px;
  width: 45px;
  
  background-repeat: no-repeat;
  background-color: transparent;
  border-color: transparent;
}

.text{
  text-align: center;
}

.texts{
  width: 300px;
}

.body{
  position: absolute;
  right: 40%;
  
}
.emtext{
  height: 35px;
}
.fbtext{
  height: 35px;
}
.numtext{
  height: 40px;
}
.addresstext{
  height: 35px;
}
</style>