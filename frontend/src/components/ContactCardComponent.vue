<script>
  import ContactComponent from './ContactComponent.vue';
  export default {
    name: 'ContactCardComponent',
    components: { ContactComponent }
  }
  </script>
  
  <template>
  <div id="card">
    <ContactComponent/>
  </div>
  </template>

  <style scoped>
  #card{
  border: 2px solid #5d795b;
  border-radius: 20px;
  height: 450px;
  width: 1300px;
  margin-left: 70px;
  margin-right: 70px;
  background-color: #f3f3f3;
  max-height: 450px;
}
  </style>