<template>
  <div class="app-set-page">
    <div class="el-search">
      <div class="prepend">库存清单</div>
    </div>
    <div class="app-page">
      <div class="app-page-select">
        <el-form :inline="true">
          <el-form-item class="el-form-item" label="物品名称：">
            <el-input
              v-model="searchFormData.searchName"
              class="input-with-select"
            ></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" label="仓库类型：">
            <el-select
              v-model="searchFormData.searchStoreType"
              placeholder="请选择仓库类型"
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
              placeholder="请选择仓库名称"
            >
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item">
            <el-button type="primary" @click="searchEvent">查询</el-button>
            <el-button @click="searchResetEvent">重置</el-button>
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
          <el-table-column prop="number" label="物品编号"></el-table-column>
          <el-table-column
            prop="product_name"
            label="物品名称"
          ></el-table-column>
          <el-table-column prop="unit" label="物品规格"></el-table-column>
          <el-table-column prop="stock" label="物品数量"></el-table-column>
          <el-table-column prop="store" label="仓库名称"></el-table-column>
        </el-table>
        <div class="app-pagination">
          <el-pagination
            background
            layout="total,  prev, pager, next, jumper"
            :current-page="this.page_current"
            :page-sizes="[20]"
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
      storeTypeList: [],
      storeList: [],
    };
  },
  created() {
    this.getStoreLists();
    this.getStoreTypes();
    this.getDataList();
  },
  methods: {
    searchBtn() {
      alert("123123");
    },
    getDataList() {
      let page = this.page_current;
      let product_name = this.searchFormData.searchName;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      this.request({
        url: "/product/getlistPages",
        method: "get",
        params: {
          page,
          product_name,
          store_id,
          store_type_id,
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
    searchEvent() {
      this.page_current = 1;
      this.getDataList();
    },
    searchResetEvent() {
      this.searchFormData = {};
      this.page_current = 1;
      this.getDataList();
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
    //
  },
};
</script>
<style>
</style>