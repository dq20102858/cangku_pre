<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">仓库管理</div>
    </div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="仓库名称：">
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
        <el-form-item class="el-form-item" label="仓库位置：">
          <el-select
            v-model="searchFormData.searchStoreAddress"
            placeholder="请选择仓库位置"
          >
            <el-option label="全部位置" value=""></el-option>
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="pageSearchEvent">查询</el-button>
          <el-button @click="pageSearchResetEvent">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-page-addbtn">
      <el-button type="warning" @click="addShowDialog">新增</el-button>
      <!-- <span class="rightadd">
        <el-button type="primary" plain @click="addStoreType"
          >仓库类型管理</el-button
        >
        <el-button type="primary" plain @click="addStoreAddress"
          >仓库位置管理</el-button
        >
      </span> -->
    </div>
    <div class="app-table app-table-nowrap">
      <el-table :data="dataList" border stripe>
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{
            scope.$index + (page_current - 1) * page_size + 1
          }}</template>
        </el-table-column>
        <el-table-column prop="name" label="仓库名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="store_type" label="仓库类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="manager" label="责任人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="仓库位置" show-overflow-tooltip></el-table-column>
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
      width="600px"
      class="dialog-ware"
      title="仓库类型管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="diaLogFormStoreTypeVisible"
    >
      <el-button
        type="warning"
        plain
        @click="addStoreTypeEvent()"
        style="margin-top: -15px; margin-bottom: 15px"
        >新增类型</el-button
      >
      <div class="text item">
        <div class="app-table app-table-nowrap">
          <el-table :data="storeTypeList" border stripe height="480">
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            ></el-table-column>
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <div class="app-operation">
                  <el-button
                    class="btn-edit"
                    @click="editStoreTypeEvent(scope.row.id, scope.row.name)"
                    title="编辑"
                    ><i class="el-icon-edit-outline"></i
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      width="600px"
      class="dialog-ware"
      title="仓库位置管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="diaLogFormStoreAddressVisible"
    >
      <el-button
        type="warning"
        plain
        @click="addStoreAddressEvent()"
        style="margin-top: -15px; margin-bottom: 15px"
        >新增位置</el-button
      >
      <div class="text item">
        <div class="app-table app-table-nowrap">
          <el-table :data="addressList" border stripe height="480">
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            ></el-table-column>
            <el-table-column prop="name" label="位置"></el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <div class="app-operation">
                  <el-button
                    class="btn-edit"
                    @click="editStoreAddressEvent(scope.row.id, scope.row.name)"
                    title="编辑"
                    ><i class="el-icon-edit-outline"></i
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      width="600px"
      class="dialog-ware"
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
        <el-form-item label="仓库名称：" prop="name">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库类型：" prop="type_id">
          <el-col :span="20">
            <el-select v-model="formData.type_id" placeholder="请选择仓库类型">
              <el-option
                v-for="item in this.storeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              style="margin-left: 16px"
              type="primary"
              icon="el-icon-plus"
              @click="addStoreType"
              plain
            ></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="仓库位置：" prop="address_id">
          <el-col :span="20">
            <el-select
              v-model="formData.address_id"
              placeholder="请选择仓库位置"
            >
              <el-option
                v-for="item in this.addressList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              style="margin-left: 16px"
              type="primary"
              plain
              @click="addStoreAddress"
              icon="el-icon-plus"
            ></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="责任人：" prop="user_id">
          <el-select v-model="formData.user_id" placeholder="请选择责任人">
            <el-option
              v-for="item in this.adminList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
      diaLogFormStoreTypeVisible: false,
      diaLogFormStoreAddressVisible: false,
      diaLogFormVisible: false,
      diaLogTitle: "添加人员信息",
      searchFormData: { searchStoreType: "", searchStoreAddress: "" },
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

        type_id: [
          {
            required: true,
            message: "请选择仓库类型",
            trigger: "change",
          },
        ],
        address_id: [
          {
            required: true,
            message: "请选择仓库位置",
            trigger: "change",
          },
        ],
        user_id: [
          {
            required: true,
            message: "请选择责任人",
            trigger: "change",
          },
        ],
      },
      page_current: 1,
      page_total: 0,
      page_size: 20,
      dataList: [], 
      storeTypeList: [],
      addressList: [],
      adminList: [],
    };
  },
  created() {
    this.getStoreTypes();
    this.getAddressLists();
    this.getDataList();
  },
  methods: {
    getDataList() {
      let page = this.page_current;
      let name = this.searchFormData.searchName;
      let type_id = this.searchFormData.searchStoreType;
      let address_id = this.searchFormData.searchStoreAddress;
      this.request({
        url: "/store/getStorePages",
        method: "get",
        params: {
          page,
          name,
          type_id,
          address_id,
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
      this.searchFormData = { searchStoreType: "", searchStoreAddress: "" };
      this.page_current = 1;
      this.getDataList();
    },
    addShowDialog() {
      this.diaLogTitle = "新增仓库";
      this.diaLogFormVisible = true;

      this.getAdminLists();
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    editRecEvent(id) {
      this.diaLogTitle = "编辑仓库";
      this.diaLogFormVisible = true;
        this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.getStoreTypes();
      this.getAddressLists();
      this.getAdminLists();
      this.request({
        url: "/store/getStoreInfo",
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
          that.formData.phone = "none";
          let url = "/store/addStore";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/store/editStore";
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
          console.log("操作失败！");
          return false;
        }
      });
    },
    delRecEvent(id) {
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-dev",
      })
        .then(() => {
          this.request({
            url: "/store/deleteStore",
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
    getAddressLists() {
      this.request({
        url: "/store/getAddressLists",
        method: "get",
      }).then((response) => {
        var res = response.data;
        if (res.status == 1) {
          this.addressList = res.data;
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
    addStoreType() {
      this.diaLogFormStoreTypeVisible = true;
    },
    addStoreTypeEvent() {
      this.$prompt("类型名称：", "新增仓库类型", {
        customClass: "el-message-box-new",
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入类型名称",
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/store/addStoreType",
            method: "post",
            data: { name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getStoreTypes();
              this.getDataList();
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        })
        .catch(() => {});
    },
    editStoreTypeEvent(id, name) {
      this.$prompt("类型名称：", "编辑仓库类型", {
        customClass: "el-message-box-new",
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: name,
        inputPlaceholder: "请输入类型名称",
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/store/editStoreType",
            method: "post",
            data: { id: id, name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getStoreTypes();
              this.getDataList();
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        })
        .catch(() => {});
    },

    addStoreAddress() {
      this.diaLogFormStoreAddressVisible = true;
    },
    addStoreAddressEvent() {
      this.$prompt("仓库位置：", "新增仓库位置", {
        customClass: "el-message-box-new",
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入仓库位置",
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/store/insertAddress",
            method: "post",
            data: { name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getDataList();
              this.getAddressLists();
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        })
        .catch(() => {});
    },
    editStoreAddressEvent(id, name) {
      this.$prompt("仓库位置：", "编辑仓库位置", {
        customClass: "el-message-box-new",
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: name,
        inputPlaceholder: "请输入仓库位置",
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,20}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/store/editAddress",
            method: "post",
            data: { id: id, name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getDataList();
              this.getAddressLists();
              this.$message({
                type: "success",
                message: "保存成功！",
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
<style>
.dialog-ware .el-select {
  width: 100%;
}
</style>