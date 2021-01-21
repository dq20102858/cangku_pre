<template>
  <div class="app-container" :class="classObj">
    <app-navbar class="app-container-navbar"></app-navbar>
    <app-sidebar class="app-container-sidebar"></app-sidebar>
    <div class="app-container-main">
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";
import AppMain from "./AppMain";
export default {
  data() {
    return {
      msg: 0,
    };
  },
  components: {
    AppNavbar,
    AppSidebar,
    AppMain,
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
};
</script>
<style>
.app-container {
  height: 100%;
  min-width: 990px;
}
.app-container-navbar {
  position: fixed;
  height: 80px;
  line-height: 80px;
  border-radius: 0px !important;
  background: #4887ff;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
}
.app-container-sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  width: 200px !important;
  height: 100%;
  font-size: 0;
  transition: width 0.28s;
}
.app-container-main {
  position: fixed;
  left: 200px;
  top: 80px;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: auto;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>