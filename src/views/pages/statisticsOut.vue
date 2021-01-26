<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">出库统计</div>
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
        <el-form-item class="el-form-item" label="出库时间：">
          <el-date-picker
            v-model="searchFormData.serachTime"
            type="date"
             value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="pageSearchEvent">查询</el-button>
          <el-button @click="pageSearchResetEvent">重置</el-button>
        </el-form-item>
        <el-form-item class="el-form-year">
          <span
            @click="searchYearEvent(1)"
            :class="this.searchFormData.searchDateType == 1 ? 'active' : ''"
            >日</span
          >
          <span
            @click="searchYearEvent(2)"
            :class="this.searchFormData.searchDateType == 2 ? 'active' : ''"
            >月</span
          >
          <span
            @click="searchYearEvent(3)"
            :class="this.searchFormData.searchDateType == 3 ? 'active' : ''"
            >年</span
          >
          <span
            @click="searchYearEvent(4)"
            :class="this.searchFormData.searchDateType == 4 ? 'active' : ''"
            >总</span
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
        <el-table-column prop="number" label="物品编号"></el-table-column>
        <el-table-column prop="product_name" label="物品名称"></el-table-column>
        <el-table-column prop="num" label="出库数量"></el-table-column>
        <el-table-column prop="unit" label="物品规格"></el-table-column>
        <el-table-column prop="store_type" label="仓库类型"></el-table-column>
        <el-table-column prop="store" label="仓库名称"></el-table-column>
        <el-table-column
          width="160"
          prop="create_time"
          label="出库时间"
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
      searchFormData: {
        searchStoreType: "",
        searchStore: "",
        searchDateType: 4,
      },
      page_current: 1,
      page_size: 20,
      page_total: 0,
      dataList: [],
      storeTypeList: [],
      storeList: [],
    };
  },

  created() {
    this.getDataList();
    this.getStoreLists();
    this.getStoreTypes();
  },
  methods: {
    getDataList() {
      let type = 2; //出入库类别，1入库，2出库
      let name = this.searchFormData.searchName;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      let time = this.searchFormData.serachTime;
      let date_type = this.searchFormData.searchDateType;
      let page = this.page_current;
      this.request({
        url: "/store/stockStatistics",
        method: "get",
        params: {
          type,
          name,
          store_id,
          store_type_id,
          time,
          date_type,
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
        searchStore: "",
        searchStoreType: "",
        searchDateType: 4,
      };
      this.getStoreLists();
      this.page_current = 1;
      this.getDataList();
    },
    searchYearEvent(val) {
      this.searchFormData.searchDateType = val;
      this.page_current = 1;
      this.getDataList();
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
