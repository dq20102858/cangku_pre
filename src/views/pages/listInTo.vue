<template>
  <div class="app-set-page">
    <div class="el-search">
      <div class="prepend">入库管理</div>
    </div>
    <div class="app-page">
      <div class="app-page-select">
        <el-form :inline="true">
          <el-form-item class="el-form-item" label="仓库类型：">
            <el-select
              v-model="searchFormData.searchStoreType"
              placeholder="选择仓库类型"
              @change="searchStoreTypeChange($event)"
            >
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
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="入库人员：">
            <el-select
              v-model="searchFormData.searchUsers"
              placeholder="选择仓库名称"
            >
              <el-option
                v-for="item in adminList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="入库时间：">
            <el-date-picker
              v-model="searchFormData.serachDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="el-form-item">
            <el-button type="primary" @click="pageSearchEvent">查询</el-button>
            <el-button @click="pageSearchResetEvent">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="app-table app-table-nowrap">
        <el-table
          :data="dataList"
          border
          stripe
          :default-sort="{ prop: 'create_time' }"
        >
          <el-table-column label="序号" width="80px">
            <template slot-scope="scope">{{
              scope.$index + (page_current - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="入库时间"
            sortable
          ></el-table-column>
          <el-table-column prop="manager" label="入库人员"></el-table-column>
          <el-table-column prop="depart" label="所属部门"></el-table-column>
          <el-table-column prop="store" label="仓库名称"></el-table-column>
          <el-table-column label="入库详情" width="80">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-detail"
                  @click="showClick(scope.row.id)"
                  title="编辑"
                  ><i class="el-icon-set-up"></i
                ></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="app-pagination">
          <el-pagination
            background
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchFormData: {},
      page_current: 1,
      page_total: 0,
      page_size: 20,
      dataList: [],
      storeList: [],
      storeTypeList: [],
      adminList: [],
    };
  },
  created() {
    this.getStoreLists();
    this.getStoreTypes();
    this.getAdminLists();
    this.getDataList();
  },
  methods: {
    getDataList() {
      let type = 1; //出入库类别，1入库，2出库
      let page = this.page_current;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      let user_id = this.searchFormData.searchUsers;
      let time = this.searchFormData.serachDate;
      this.request({
        url: "/product/getStoreLogs",
        method: "get",
        params: {
          page,
          store_id,
          store_type_id,
          user_id,
          time,
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
      this.searchFormData = {};
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
    getAdminLists() {
      this.request({
        url: "/user/getAdminLists",
        method: "get",
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.adminList = res.data;
        }
      });
    },
    //
  },
};
</script>
<style>
</style>