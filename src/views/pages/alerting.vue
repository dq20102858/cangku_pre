<template>
    <div class="app-page">
    <div class="el-search">
      <div class="prepend">库存告警</div>
    </div>
      <div class="app-page-select">
        <el-form :inline="true">
          <el-form-item class="el-form-item" label="物品名称：">
            <el-input
              maxlength="30"
              v-model="searchFormData.searchName"
              class="input-with-select"
            ></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" label="仓库类型：">
            <el-select
              v-model="searchFormData.searchStoreType"
              placeholder="请选择仓库类型"
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
              placeholder="请选择仓库位置"
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

          <el-form-item class="el-form-item" label="告警时间：">
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
          <el-table-column prop="number" label="物品编号"></el-table-column>
          <el-table-column
            prop="product_name"
            label="物品名称"
          ></el-table-column>
             <el-table-column prop="stock" label="物品数量"></el-table-column>
          <el-table-column prop="unit" label="物品规格"></el-table-column>
          <el-table-column prop="store" label="仓库名称"></el-table-column>
          <el-table-column
            prop="create_time"
            label="告警时间"
            sortable
          ></el-table-column>
        </el-table>
        <div class="app-pagination">
          <el-pagination
            background
            prev-text="上一页"
            next-text="下一页"
            layout="total,  prev, pager, next,  jumper"
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
      },
      diaLogFormVisible: false,
      formData: {},
      formRules: {
        num: [
          {
            required: true,
            message: "请输入数字长度1-10个数字",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{1,10}$/,
            message: "请输入数字长度1-10个数字",
            trigger: "blur",
          },
        ],
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
    this.getStoreTypes();
    this.getStoreLists();
    this.getDataList();
  },
  methods: {
    getDataList() {
      let page = this.page_current;
      let name = this.searchFormData.searchName;
      let store_type_id = this.searchFormData.searchStoreType;
      let store_id = this.searchFormData.searchStore;
      let date = this.searchFormData.serachDate;
      this.request({
        url: "/store/getAlertPages",
        method: "get",
        params: {
          page,
          name,
          store_type_id,
          store_id,
          date,
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
    pageSearchResetEvent(e) {
      this.searchFormData = { searchStoreType: "", searchStore: "" };
      this.page_current = 1;
      this.getDataList();
    },
    getStoreTypes() {
      this.request({
        url: "/store/getStoreTypeLists",
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
    //
  },
};
</script>
<style>
</style>