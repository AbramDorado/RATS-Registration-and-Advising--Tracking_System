<script>
  export default {
    name: 'AnnouncementCard',
    props: ['header', 'date', 'content']
  }
  </script>
  
  <template>
  <div class="announcementCardDiv d-flex flex-column" style="background-color: white; border: 2px dashed black; margin-bottom: 15px; padding: 10px;">
    <span style="color: #132B13; font-family: Open_Sans_Bold; font-size: 16px;">{{header}}</span>
    <span style="color: #132B13; font-family: Open_Sans_Bold; font-size: 12px; margin-bottom: 15px;">{{date}}</span>
    <span v-html="content" style="color: #132B13; font-family: Open_Sans; font-size: 14px;"></span>
  </div>
  </template>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  </style>