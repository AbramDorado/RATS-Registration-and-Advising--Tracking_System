<script>
export default {
  methods: {
    hideAllPopovers() {
      var elems = document.querySelectorAll('.myPopover')
      for (let i=0; i<elems.length; i++) {
        elems[i].style.display = 'none'
      }
    },
    rvClicked(event) {
      if (event.target.classList.contains('myPopover')) {
        console.log('popover clicked') // temp
        return
      }
      if (document.getElementById('notifsIconDiv').contains(event.target)) {
        console.log('#notifsIconDiv clicked') // temp
        return
      }
      if (document.getElementById('accIconDiv').contains(event.target)) {
        console.log('#accIconDiv clicked') // temp
        return
      }
      // console.log('not popover nor icon clicked') // temp
      this.hideAllPopovers()
    }
  }
}

</script>

<template>
<div @click="this.rvClicked($event)" style="display: flex; flex-direction: column; min-height: 100vh;">
  <router-view />
</div>
</template>

<style>
*, * * {
  box-sizing: border-box;
  font-family: Open_Sans, serif;
  margin: 0;
  padding: 0;
}
@font-face {
  font-family: IBM_Plex_Serif;
  src: url(/IBM_Plex_Serif/IBMPlexSerif-Regular.ttf);
}
@font-face {
  font-family: IBM_Plex_Sans_Condensed;
  src: url(/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-Regular.ttf);
}
@font-face {
  font-family: IBM_Plex_Sans_Condensed_Bold;
  src: url(/IBM_Plex_Sans_Condensed/IBMPlexSansCondensed-Bold.ttf);
}
@font-face {
  font-family: Open_Sans;
  src: url(/Open_Sans/static/OpenSans/OpenSans-Regular.ttf);
}
@font-face {
  font-family: Open_Sans_Semi_Bold;
  src: url(/Open_Sans/static/OpenSans/OpenSans-SemiBold.ttf);
}
@font-face {
  font-family: Open_Sans_Bold;
  src: url(/Open_Sans/static/OpenSans/OpenSans-Bold.ttf);
}
</style>
