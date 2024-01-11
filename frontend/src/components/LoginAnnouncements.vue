<script>
    import AnnouncementCard from '../components/AnnouncementCard.vue'
    import ScheduleTab from "../components/ScheduleTab.vue"; // Adjust the path accordingly
    export default {
        name: 'LoginAnnouncements',
        data(){
            return{
                announcements:[],
                announcementsCounter: 0, // counter for total announcements loaded
                announcementsEmpty: false, // v-if 'Show more (announcements)' button; true if all announcements from backend are already loaded here
                getNextAnnouncementsDisabled: false, // for spam handling getNextAnnouncements()
            }
        },
        components:{
            AnnouncementCard, ScheduleTab
        },
        methods:{
          formatted_date(miliseconds) {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            var myDate = new Date(parseInt(miliseconds))
            return myDate.toLocaleDateString("en-US", options)
          },
          async getNextAnnouncements(){
              try {
                    this.getNextAnnouncementsDisabled = true
                    const response = await this.axios.post('/api/announcement/next', {loaded: this.announcementsCounter})
                    this.announcementsCounter += response.data.announcements.length
                    if (response.data.more === 'true') {
                    this.announcementsEmpty = false
                    } else {
                    this.announcementsEmpty = true
                    }
                    this.announcements = this.announcements.concat(response.data.announcements)
                    this.getNextAnnouncementsDisabled = false
                } catch (error) {
                    console.log('Error on Login.vue > getNextAnnouncements()', error)
                    this.getNextAnnouncementsDisabled = false
              }
          },
          async mounted(){
                await this.getNextAnnouncements()
          }
        }
    }
</script>

<template>
    <div class="justify-content-center" style="background-color: #F8F6F0; border: 2px solid #093405; border-radius: 10px; height: 20%; overflow: scroll; padding: 15px 20px; margin-right: 15px;">
        <ScheduleTab>
            <template v-slot:tab-content="{ tabIndex }">
                <!-- Content for the Announcements tab -->
                <div v-if="tabIndex === 0">
                    <div id="announcementsHeader" class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
                        <i class="align-items-center bi bi-megaphone-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
                        <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Announcements</span>
                    </div>
                    <AnnouncementCard v-for="(obj, index) in announcements" :key="index" :header="announcements[index].title" :date="this.formatted_date(announcements[index].modified)" :content="announcements[index].body" />
                    <a @click="getNextAnnouncements()" v-if="!this.announcementsEmpty" href="javascript:;">Show more</a>
                </div>
                <!-- Content for the Calendar tab -->
                <div v-else-if="tabIndex === 1">
                    <div class="align-items-center d-flex flex-row" style="margin-bottom: 15px;">
                        <i class="align-items-center bi bi-calendar-week-fill d-flex" style="color: #460C0F; font-size: 24px; margin-right: 5px;"></i>
                        <span style="color: #460C0F; font-family: Open_Sans_Bold; font-size: 24px;">Schedule of Activities</span>
                    </div>
                    <div>
                        <img src="/Schedule_of_Activities.jpg" alt="Schedule of Activities">
                        <!-- <img src="/UPM_CAS_logo.png" alt="UPM CAS Logo" style="height: 65px; margin-right: 8px; width: 65px; "> -->
                    </div>
                </div>
            </template>
        </ScheduleTab>
        
        
    </div>
</template>