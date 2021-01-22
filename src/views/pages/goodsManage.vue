<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">物品管理</div>
      <!-- <div class="item">
        <el-input placeholder="请输入关键字搜索" v-model="serachName" clearable>
        </el-input>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </div> -->
    </div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="物品编号：">
          <el-input
            maxlength="20"
            v-model="searchFormData.searchNumber"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="物品名称：">
          <el-input   maxlength="20"
            v-model="searchFormData.searchName"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="pageSearchEvent">查询</el-button>
          <el-button @click="pageSearchResetEvent">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-page-addbtn">
      <el-button type="warning" @click="addShowDialog">新增</el-button>
    </div>
    <div class="app-table app-table-nowrap">
      <el-table :data="dataList" border stripe>
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{
            scope.$index + (page_current - 1) * page_size + 1
          }}</template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="物品编号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          label="物品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="unit" label="物品规格"></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="88">
          <template slot-scope="scope">
            <div class="app-operation">
              <el-button
                class="btn-edit"
                @click="editRecEvent(scope.row.id)"
                title="编辑"
                ><i class="el-icon-edit-outline"></i
              ></el-button>
              <el-button
                class="btn-del"
                @click="delRecEvent(scope.row.id)"
                title="删除"
                ><i class="el-icon-delete"></i
              ></el-button>
            </div>
          </template>
        </el-table-column>
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
    <el-dialog
      width="600px"
      class="dialog-goods"
      :title="this.diaLogTitle"
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
        <el-form-item label="物品编号：" prop="number">
          <el-input v-model="formData.number" autocomplete="off" v-if="formData.id>0" disabled></el-input>
          <el-input v-else v-model="formData.number" autocomplete="off"></el-input>
        </el-form-item>
           <el-form-item label="物品名称：" prop="name">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物品规格：" prop="unit">
          <el-input v-model="formData.unit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="5"
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
      searchFormData: {},
      diaLogFormVisible: false,
      diaLogTitle: "新增物品",
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            message: "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
            message: "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
            message: "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
          {
             pattern: /^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        store_id: [
          {
            required: true,
            message: "请选择所在仓库",
            trigger: "change",
          },
        ],
        remark: [
          {
            min: 1,
            max: 100,
            message: "请输入长度1-100个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /(^\S+).*(\S+$)/,
            message: "开始和结尾不能有空格",
            trigger: "blur",
          },
        ],
      },
      page_current: 1,
      page_total: 0,
      page_size: 20,
      dataList: [],
      storeList: [],
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      let page = this.page_current;
      let name = this.searchFormData.searchName;
      let number = this.searchFormData.searchNumber;
      let store_id = this.searchFormData.searchStore;
      this.request({
        url: "/product/getProductPages",
        method: "get",
        params: {
          page,
          name,
          number,
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
    addShowDialog() {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "新增物品";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    editRecEvent(id) {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "编辑物品";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.request({
        url: "/product/getProductInfo",
        method: "get",
        params: { id: id },
      }).then((response) => {
        var data = response.data;
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
          that.formData.store_id = 0;
          let url = "/product/addProduct";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/product/editProduct";
          }
          this.request({
            url: url,
            method: "post",
            data,
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
          console.log("保存失败！");
          return false;
        }
      });
    },
    delRecEvent(id) {
      this.$confirm("您确定要删除？删除后不可恢复！", "提示信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-dev",
      })
        .then(() => {
          this.request({
            url: "/product/deleteProduct",
            method: "post",
            data: { id: id },
          }).then((res) => {
            let data = res.data;
            if (data.status == 1) {
              if (this.dataList.length == 1) {
                this.page_current =
                  this.page_current < 1 ? 1 : this.page_current - 1;
                this.getDataList();
              } else {
                this.getDataList();
              }
              this.$message({
                type: "success",
                message: "删除成功！",
              });
            }
          });
        })
        .catch(() => {});
    },
    //
  },
};
</script>