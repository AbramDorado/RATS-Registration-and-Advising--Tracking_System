<!-- PillTab.vue -->
<template>
    <div>
        <div v-for="(tab, index) in tabs" :key="index" :class="{ 'active': activeTab === index }" @click="changeTab(index)">
            {{ tab }}
        </div>
    </div>
    <div>
        <slot name="tab-content" :tabIndex="activeTab"></slot>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tabs: ["Announcements", "Calendar"], // Add your tab names here
        activeTab: 0 // Initially, set the active tab index
      };
    },
    methods: {
      changeTab(index) {
        this.activeTab = index;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styling for the pill tabs here */
  div {
    display: flex;
  }
  
  div > div {
    padding: 10px;
    margin: 2px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
  }
  
  div > div.active {
    background-color: #460C0F;
    color: #fff;
  }
  </style>
  