<template>
  <div class="app-container" :class="classObj">
    <app-sidebar class="app-container-sidebar"></app-sidebar>
    <div class="app-container-main">
      <app-navbar></app-navbar>
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
.app-container{height: 100%;min-width: 990px;}
.app-container-sidebar{position:fixed;top:0;bottom:0;left:0;z-index:1001;overflow:hidden;width:200px!important;height:100%;font-size:0;transition:width .28s}
.app-container-main {position: relative;min-height: 100%;transition: margin-left .28s;margin-left: 200px;}
</style>