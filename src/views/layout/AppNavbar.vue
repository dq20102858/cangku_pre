<template>
  <div class="navbar" mode="horizontal">
    <!-- <div class="hamburger-container" :isActive="sidebar.opened" @click="toggleSideBar">
      <img :src="require('@/assets/image/icon-cole.png')" />
    </div> -->
    <div class="right-menu">
      <div class="avatar-wrapper">
        <img class="avatar" :src="require('@/assets/image/user.png')" />
        <span class="names">{{ name }}</span>
        <span @click="logout" class="logout">退出</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "roles", "system"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">

.hamburger-container {
  line-height: 58px;
  height: 60px;
  float: left;
  padding: 10px;
  cursor: pointer;
}
.right-menu {
  position: absolute;
  top: 1px;
  right: 20px;
  height: 100%;
}
.avatar-wrapper {
  cursor: pointer;
  position: relative;
}
.avatar-wrapper .avatar {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-block;
  vertical-align: middle;
}
.avatar-wrapper .names {
  display: inline-block;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
  padding: 0 25px 0 5px;
}
.avatar-wrapper .logout {
  display: inline-block;
  color: #4887ff;
  background: #fff;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  border-radius: 3px;
}
</style>
