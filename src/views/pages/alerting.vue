<template>
  <div class="app-alert-page">
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
              v-model="searchFormData.searchStoreName"
              placeholder="请选择仓库位置"
            >
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
          <el-table-column prop="product" label="物品名称"></el-table-column>
          <el-table-column prop="unit" label="物品规格"></el-table-column>
          <el-table-column prop="stock" label="物品数量"></el-table-column>
          <el-table-column prop="store" label="仓库名称"></el-table-column>
          <el-table-column
            prop="create_time"
            label="告警时间"
            sortable
          ></el-table-column>

          <el-table-column label="操作" width="55">
            <template slot-scope="scope">
              <div class="app-operation">
                <el-button
                  class="btn-edit"
                  @click="editRecEvent(scope.row.id)"
                  title="编辑"
                  ><i class="el-icon-edit-outline"></i
                ></el-button>
              </div>
            </template>
          </el-table-column>
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
      <el-dialog
        width="555px"
        class="dialog-alert"
        title="告警设置"
        :close-on-click-modal="false"
        :visible.sync="diaLogFormVisible"
      >
        <el-form
          :model="formData"
          class="el-form-custom"
          :rules="formRules"
          ref="formRulesRef"
          label-width="110px"
        >
          <el-form-item label="物品名称：">
            <el-input
              v-model="formData.product"
              autocomplete="off"
              readonly
              disabled
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="仓库类型：" prop="type_id">
            <el-select v-model="formData.type_id">
              <el-option
                v-for="item in this.storeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="仓库名称：">
            <el-select v-model="formData.store_id">
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前库存：">
            <el-input v-model="formData.stock" readonly disabled>
              <template slot="append">{{ formData.unit }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="告警数量：" prop="num">
            <el-input v-model="formData.num" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRecEvent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchFormData: {},
      diaLogFormVisible: false,
      formData: {},
      formRules: {
        num: [
          {
            required: true,
            message: "请输入告警数量",
            trigger: "blur",
          },
          {
            pattern: /^[0-9]{1,10}$/,
            message: "请输入告警数量长度1-10个数字",
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
      let type_id = this.searchFormData.searchStoreType;
      let type_name = this.searchFormData.searchStoreName;
      let date = this.searchFormData.serachDate;
      this.request({
        url: "/store/getAlertPages",
        method: "get",
        params: {
          page,
          name,
          type_id,
          type_name,
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
      this.searchFormData = {};
      this.page_current = 1;
      this.getDataList();
    },
    editRecEvent(id) {
      this.diaLogFormVisible = true;
      this.request({
        url: "/store/getAlertInfo",
        method: "get",
        params: { id: id },
      }).then((res) => {
        let data = res.data;
        if (data.status == 1) {
          this.formData = data.data;
        }
      });
    },
    addRecEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          let data = that.formData;
          let name = that.formData.name;
          let store_id = that.formData.store_id;
          let product_id = that.formData.product_id;
          let num = that.formData.num;
          let id = that.formData.id;
          let url = "/store/editAlert";
          this.request({
            url: url,
            method: "post",
            data: { id, name, store_id, product_id, num },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.diaLogFormVisible = false;
              this.getDataList();
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        } else {
          console.log("操作失败！");
          return false;
        }
      });
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
.dialog-alert .el-select {
  width: 100%;
}
</style>