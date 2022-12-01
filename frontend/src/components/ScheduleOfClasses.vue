<script>
export default {
  name: 'ScheduleOfClasses',
  mounted() {
    // Initialize Bootstrap Popper Tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    // end Initialize Bootstrap Popper Tooltip    
  },
  methods: {
    closeFullscreen() {
      this.$refs['fullscreenDiv'].style.display = 'none'
      this.$refs['floatingButton'].style.display = 'flex'
    },
    showFullscreen() {
      this.$refs['floatingButton'].style.display = 'none'
      this.$refs['fullscreenDiv'].style.display = 'block'      
    }
  }
}
</script>

<template>
<div @click="showFullscreen()" ref="floatingButton" data-bs-toggle="tooltip" data-bs-title="Schedule of Classes" data-bs-placement="left" class="align-items-center hoverTransform justify-content-center shadow-lg" style="background-color: rgb(70, 12, 15); border: 2px solid black; border-radius: 50%; bottom: 30px; cursor: pointer; display: flex; height: 70px; position: fixed; right: 30px; width: 70px; z-index: 2;">
  <!-- Schedule of Classes Icon -->
  <i class="align-items-center bi bi-table d-flex" style="color: white; font-size: 30px;"></i>
  <!-- end Schedule of Classes Icon -->  
</div>
<div ref="fullscreenDiv" style="background-color: rgba(0, 0, 0, 0.5); display: none; height: 100%; padding: 30px; position: fixed; width: 100%; z-index: 2;">
  <div style="background-color: white; border: 2px solid green; height: 100%;">
    Schedule of Classes
    <span @click="closeFullscreen()">Close</span>
  </div>
</div>
</template>

<style scoped>
.hoverTransform {
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s linear;
}
  .hoverTransform:hover {
    transform: scale(1.05);
    transform-origin: center;
  }

  .hoverTransform:active {
    transform: scale(0.95);
    transform-origin: center;
  }
</style>