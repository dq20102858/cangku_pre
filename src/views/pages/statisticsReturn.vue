<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">返还统计</div>
    </div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="物品名称：">
          <el-input
            maxlength="20"
            v-model="searchFormData.searchName"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="仓库类型：">
          <el-select
            v-model="searchFormData.searchStoreType"
            placeholder="选择仓库类型"
            @change="searchStoreTypeEvent($event)"
          >
            <el-option label="全部类型" value=""></el-option>
            <el-option
              v-for="item in storeTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="仓库名称：">
          <el-select
            v-model="searchFormData.searchStore"
            placeholder="选择仓库名称"
          >
            <el-option label="全部仓库" value=""></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="所属部门：">
          <el-select
            v-model="searchFormData.searchDepartId"
            placeholder="请选择部门"
            @change="searchDepartChange($event)"
          >
            <el-option label="全部部门" value=""></el-option>
            <el-option
              v-for="item in departListItem"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item" label="返还人员：">
          <el-select
            v-model="searchFormData.searchUserId"
            placeholder="选择人员："
          >
            <el-option label="全部人员" value=""></el-option>
            <el-option
              v-for="item in userListItem"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="el-form-item el-form-time-range"
          label="返还时间："
        >
          <el-date-picker
            v-model="searchFormData.serachTime"
            type="daterange"
            unlink-panels
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="pageSearchEvent">查询</el-button>
          <el-button @click="pageSearchResetEvent">重置</el-button>
          <el-button plain type="warning" @click="expectExcelOut"
            >导出信息</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="app-table app-table-nowrap">
      <el-table :data="dataList" border stripe>
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{
            scope.$index + (page_current - 1) * page_size + 1
          }}</template>
        </el-table-column>
        <el-table-column prop="number" label="物品编号" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="product_name"
          label="物品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="num" label="返还数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unit" label="物品规格" show-overflow-tooltip></el-table-column>
        <el-table-column prop="store_type" label="仓库类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="store" label="仓库名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="depart" label="部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="user" label="人员" show-overflow-tooltip></el-table-column>
        <el-table-column
          width="160"
          prop="create_time"
          label="返还时间"
        ></el-table-column>
      </el-table>
      <div class="app-pagination" v-if="dataList.length !== 0">
        <el-pagination
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total,  prev, pager, next, jumper"
          :current-page="this.page_current"
          :page-size="this.page_size"
          :total="this.page_total"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "第一季度",
            onClick(picker) {
              let date = new Date();
              let year = date.getFullYear();
              let startMonth = 1;
              let endMonth = startMonth + 2;
              if (endMonth < 10) {
                endMonth = "0" + endMonth;
              }
              const start = year + "-01-01";
              const end =
                year +
                "-" +
                endMonth +
                "-" +
                new Date(year, endMonth, 0).getDate();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "第二季度",
            onClick(picker) {
              let date = new Date();
              let year = date.getFullYear();
              let startMonth = 4;
              let endMonth = startMonth + 2;
              if (endMonth < 10) {
                endMonth = "0" + endMonth;
              }
              const start = year + "-04-01";
              const end =
                year +
                "-" +
                endMonth +
                "-" +
                new Date(year, endMonth, 0).getDate();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "第三季度",
            onClick(picker) {
              let date = new Date();
              let year = date.getFullYear();
              let startMonth = 7;
              let endMonth = startMonth + 2;
              if (endMonth < 10) {
                endMonth = "0" + endMonth;
              }
              const start = year + "-07-01";
              const end =
                year +
                "-" +
                endMonth +
                "-" +
                new Date(year, endMonth, 0).getDate();
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "第四季度",
            onClick(picker) {
              let date = new Date();
              let year = date.getFullYear();
              let startMonth = 10;
              let endMonth = startMonth + 2;
              if (endMonth < 10) {
                endMonth = "0" + endMonth;
              }
              const start = year + "-10-01";
              const end =
                year +
                "-" +
                endMonth +
                "-" +
                new Date(year, endMonth, 0).getDate();
              picker.$emit("pick", [start, end]);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      searchFormData: {
        searchName: "",
        searchStoreType: "",
        searchStore: "",
        searchDepartId: "",
        searchUserId: "",
      },
      page_current: 1,
      page_size: 20,
      page_total: 0,
      dataList: [],
      storeTypeList: [],
      storeList: [],
      departListItem: [],
      userListItem: [],
    };
  },

  created() {
    this.getDataList();
    this.getStoreLists();
    this.getStoreTypes();
    this.getDepartLists();
    this.getUserLists();
  },
  methods: {
    getDataList() {
      let type = 3; //类别，1入库，2出库，3返还
      let name = this.searchFormData.searchName;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      let time_range = this.searchFormData.serachTime;
      let depart_id = this.searchFormData.searchDepartId;
      let user_id = this.searchFormData.searchUserId;
      let page = this.page_current;
      this.request({
        url: "/store/stockStatistics",
        method: "get",
        params: {
          type,
          name,
          store_id,
          store_type_id,
          time_range,
          depart_id,
          user_id,
          page,
        },
      }).then((res) => {
        let data = res.data;
        if (data.status == 1) {
          this.dataList = data.data.data;
          this.page_current = parseInt(data.data.current_page);
          this.page_total = data.data.total;
          this.page_size = data.data.per_page;
        }
      });
    },
    pageChange(value) {
      this.page_current = value;
      this.getDataList();
    },
    pageSearchEvent() {
      this.page_current = 1;
      this.getDataList();
    },
    pageSearchResetEvent() {
      this.searchFormData = {
        searchName: "",
        searchStore: "",
        searchStoreType: "",
        searchDepartId: "",
        searchUserId: "",
      };
      this.getStoreLists();
      this.getUserLists();
      this.page_current = 1;
      this.getDataList();
    },
    getDepartLists() {
      this.request({
        url: "/user/getDepartLists",
        method: "get",
      }).then((response) => {
        var data = response.data;
        if (data.status == 1) {
          this.departListItem = data.data;
        }
      });
    },
    searchDepartChange(id) {
      this.$set(this.searchFormData, "searchUserId", "");
      this.getUserLists(id);
    },
    getUserLists(id) {
      this.request({
        url: "/user/getAdminLists",
        params: { depart_id: id },
        method: "get",
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.userListItem = res.data;
        }
      });
    },
    getStoreTypes() {
      this.request({
        url: "store/getStoreTypeLists",
        method: "get",
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.storeTypeList = res.data;
        }
      });
    },
    searchStoreTypeEvent(val) {
      this.$set(this.searchFormData, "searchStore", "");
      this.request({
        url: "/store/getStoreLists",
        method: "get",
        params: { type_id: val },
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.storeList = res.data;
        }
      });
    },
    getStoreLists() {
      this.request({
        url: "/store/getStoreLists",
        method: "get",
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.storeList = res.data;
        }
      });
    },
    expectExcelOut() {
      let type = 3; //类别，1入库，2出库，3返还
      let name = this.searchFormData.searchName;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      let time_range = this.searchFormData.serachTime;
      let depart_id = this.searchFormData.searchDepartId;
      let user_id = this.searchFormData.searchUserId;
      if (typeof time_range == "undefined") {
        time_range = ["", ""];
      }
      window.location.href =
        this.hostURL +
        "/store/exportExcel?type=" +
        type +
        "&name=" +
        name +
        "&store_id=" +
        store_id +
        "&store_type_id=" +
        store_type_id +
        "&time_range[]=" +
        "&depart_id=" +
        depart_id +
        "&user_id=" +
        user_id +
        time_range[0] +
        "&time_range[]=" +
        time_range[1];
    },

    //
  },
};
</script>
<style >
.el-form-year {
  float: right;
}
.el-form-year span {
  color: #999;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 3px;
  margin-left: 10px;
}
.el-form-year .active {
  background: #7feab8;
  color: #fff;
}
</style>
