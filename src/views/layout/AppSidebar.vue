<template>
  <el-scrollbar wrapClass="app-scrollbar-wrapper">
    <el-menu class="app-menus" ref="menus"  :default-openeds="openeds"  :default-active="activeIndex" router>
      >
      <li class="slogo">仓库管理平台</li>
      <template v-for="item in moduleMenu">
        <el-submenu
          class="is-opened"
          v-if="item.isChildren == 1"
          :key="item.id"
          :index="item.moduleAction"
        >
          <template slot="title">
            <img
              class="img"
              :src="require('@/assets/image/icon-home' + item.id + '.png')"
            />
            <span class="span">{{ item.moduleName }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              class="app-menu-group"
              v-for="items in item.children"
              :key="items.id"
              :index="items.moduleAction"
              :route="items.moduleAction"
              >{{ items.moduleName }}</el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeIndex: "list",
      openeds: ["home", "sysmanage", "statistics"],
      moduleMenu: [
        {
          id: 1,
          moduleAction: "home",
          moduleIcon: "",
          moduleName: "出入库管理",
          isChildren: 1,
          children: [
            {
              id: 11,
              moduleAction: "list",
              moduleIcon: "",
              moduleName: "库存清单 ",
            },
            {
              id: 12,
              moduleAction: "listInto",
              moduleIcon: "",
              moduleName: "入库管理 ",
            },
            {
              id: 13,
              moduleAction: "listOut",
              moduleIcon: "",
              moduleName: "出库管理 ",
            },
            {
              id: 14,
              moduleAction: "alerting",
              moduleIcon: "",
              moduleName: "库存告警",
            },
          ],
        },
        {
          id: 2,
          moduleAction: "sysmanage",
          moduleIcon: "",
          moduleName: "系统管理",
          isChildren: 1,
          children: [
            {
              id: 21,
              moduleAction: "storeManage",
              moduleIcon: "",
              moduleName: "仓库管理 ",
            },
            {
              id: 22,
              moduleAction: "goodsManage",
              moduleIcon: "",
              moduleName: "物品管理",
            },
            {
              id: 23,
              moduleAction: "userManage",
              moduleIcon: "",
              moduleName: "人员管理",
            },
          ],
        },
        {
          id: 3,
          moduleAction: "statistics",
          moduleIcon: "",
          moduleName: "数据统计",
          isChildren: 1,
          children: [
            {
              id: 31,
              moduleAction: "statisticsInto",
              moduleIcon: "",
              moduleName: "入库统计",
            },
            {
              id: 32,
              moduleAction: "statisticsOut",
              moduleIcon: "",
              moduleName: "出库统计",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    let start = window.location.href.lastIndexOf("/");
    let path = window.location.href.slice(start + 1);
    if (path === "") {
      this.$router.push({ path: "/list" });
      this.activeIndex = "list";
    } else {
      this.activeIndex = path;
    }
    console.log(path + "_" + this.activeIndex);
  },
  created() {},
  methods: {
    // handleClose(key, keyPath) {
    //   this.$refs.menus.open(keyPath);
    // },
    // activeSel(event, url) {
    //   if (url == "") {
    //     this.activeIndex = "home";
    //   } else {
    //     this.activeIndex = url;
    //   }
    // },
  },
};
</script>
<style>
.app-scrollbar-wrapper {
  background: #fff;
  height: calc(100% + 17px);
  overflow-x: hidden;
}
.app-scrollbar-wrapper .el-scrollbar__view {
  height: 100%;
}
.app-menus {
  height: 100%;
  border: none;
  box-shadow: 1px 5px 5px rgba(222, 222, 222, 0.4);
}
.app-menus .slogo {
  background: #4886ff;
 padding-left:20px;
  height: 80px;
  line-height: 80px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}
.app-menus .el-submenu__title {
  padding: 0 !important;
  margin: 0 10px;
  background: #f2f2f2;
  background: url("~@/assets/image/icon-line.png") no-repeat top center;
}
.app-menus .el-submenu__title i {
  color: #999;
}
.app-menus .el-submenu__title .img {
  width: 30px;
}
.app-menus .el-submenu__title .span {
  color: #000;
  font-weight: 700;
  font-size: 15px;
}
.app-menus .el-menu-item-group__title {
  padding: 0 !important;
}
.app-menus .el-menu-item {
  font-size: 15px;
  color: #78797c; 
  background: url("~@/assets/image/icon-line.png") no-repeat top center;
}

.app-menus .el-menu-item.is-active {
  background: #e9f1ff !important;
  color: #4688fc;
  border-right: 5px #4384fc solid;
}
</style>