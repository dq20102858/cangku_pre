<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">库存清单</div>
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
            placeholder="请选择仓库类型"
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
            placeholder="请选择仓库名称"
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
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="searchEvent">查询</el-button>
          <el-button @click="searchResetEvent">重置</el-button>
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
        <el-table-column prop="product_name" label="物品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stock" label="物品数量"></el-table-column>
        <el-table-column prop="unit" label="物品规格"></el-table-column>
        <el-table-column prop="store" label="仓库名称"></el-table-column>
        <el-table-column prop="alert_num" label="告警数量" width="100">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.alert_num == 0"></span>
             <span v-else>{{scope.row.alert_num}} </span>
          </template> -->
        </el-table-column>
        <el-table-column label="告警设置" width="80">
          <template slot-scope="scope">
            <div class="app-operation">
              <el-button
                class="btn-edit"
                @click="editRecEvent(scope.row.id)"
                title="编辑"
                ><i class="el-icon-setting"></i
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
          :page-sizes="[20]"
          :page-size="this.page_size"
          :total="this.page_total"
             prev-text="上一页"
          next-text="下一页"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      width="400px"
      class="dialog-list"
      title="告警设置"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="diaLogFormVisible"
    >
      <el-form
        :model="formData"
        class="el-form-custom"
        :rules="formRules"
        ref="formRulesRef"
        label-width="110px"
      >
        <el-form-item label="告警数量：" prop="alert_num">
          <el-input
            v-model="formData.alert_num"
            autocomplete="off"
            maxlength="9"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="diaLogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRecEvent">确 定</el-button>
      </div>
    </el-dialog>
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
      goodId: 0,
      formData: {},
      formRules: {
        alert_num: [
          {
            required: true,
            message: "请输入告警数量",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{1,9}$/,
            message: "请输入告警数量长度1-9个数字",
            trigger: "blur",
          },
        ],
      },
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
      this.searchFormData = {
        searchStoreType: "",
        searchStore: "",
        searchName: "",
      };
      this.getStoreLists();
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
    editRecEvent(id) {
      this.diaLogFormVisible = true;
      this.formData = {};
      this.goodId = id;
    },
    addRecEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          let id = this.goodId;
          let alert_num = that.formData.alert_num;
          this.request({
            url: "/product/editStoreList",
            method: "post",
            data: { id, alert_num },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormVisible = false;
              this.getDataList();
              this.$message({
                type: "success",
                message: "设置成功！",
              });
            }
          });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
    },
    //
  },
};
</script>
<style>
.dialog-list .el-select {
  width: 100%;
}
</style>