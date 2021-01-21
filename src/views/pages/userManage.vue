<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">人员管理</div>
    </div>
    <div class="app-page-select">
      <el-form :inline="true">
        <el-form-item class="el-form-item" label="人员姓名：">
          <el-input
            maxlength="30"
            v-model="searchFormData.searchName"
            class="input-with-select"
          ></el-input>
        </el-form-item>
        <el-form-item class="el-form-item" label="所属部门：">
          <el-select
            v-model="searchFormData.searchDepartId"
            placeholder="请选择部门"
            @change="getDepartListsChange($event)"
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
        <el-form-item class="el-form-item" label="人员职位：">
          <el-select
            v-model="searchFormData.searchPostId"
            placeholder="请选择职位"
          >
            <el-option label="全部职位" value=""></el-option>
            <el-option
              v-for="item in postListItem"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item">
          <el-button type="primary" @click="pageSearchEvent">查询</el-button>
          <el-button class="setbtn" @click="pageSearchResetEvent"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="app-page-addbtn">
      <el-button type="warning" @click="addRecDialog">新增</el-button>
    </div>
    <div class="app-table app-table-nowrap">
      <el-table :data="dataList" border stripe>
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{
            scope.$index + (page_current - 1) * page_size + 1
          }}</template>
        </el-table-column>
        <el-table-column prop="name" label="人员姓名"></el-table-column>
        <el-table-column prop="depart" label="所属部门"></el-table-column>
        <el-table-column prop="post" label="人员职位"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
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
                @click="delRecEvent(scope.row.id, scope.row.name)"
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
      class="dialog-depart"
      title="部门管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="diaLogFormDepartVisible"
    >
      <el-button
        type="warning"
        plain
        @click="addDepartEvent()"
        style="margin-top: -15px; margin-bottom: 15px"
        >新增部门</el-button
      >
      <div class="text item">
        <div class="app-table app-table-nowrap">
          <!-- <el-table
            :data="tableData" height="550"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="名称" >
            </el-table-column>
            </el-table-column><el-table-column label="操作" width="55">
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
          </el-table> -->
          <el-table :data="departListItem" border stripe>
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            ></el-table-column>
            <el-table-column prop="name" label="部门名称"></el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <div class="app-operation">
                  <el-button
                    class="btn-edit"
                    @click="editDepartEvent(scope.row.id, scope.row.name)"
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
      class="dialog-post"
      title="职位管理"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="diaLogFormPostVisible"
    >
      <el-button
        type="warning"
        plain
        @click="addPostEvent()"
        style="margin-top: -15px; margin-bottom: 15px"
        >新增职位</el-button
      >
      <div class="text item">
        <div class="app-table app-table-nowrap">
          <el-table :data="postListItem" border stripe>
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            ></el-table-column>
            <el-table-column prop="name" label="职位名称"></el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <div class="app-operation">
                  <el-button
                    class="btn-edit"
                    @click="editPostEvent(scope.row.id, scope.row.name)"
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
      class="dialog-users"
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
        <el-form-item label="人员姓名：" prop="name">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="登录密码："
          prop="password"
          v-if="this.diaLogTitle == '新增人员'"
        >
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" v-if="this.diaLogTitle == '编辑人员'">
          <el-input
            v-model="formData.password"
            autocomplete="off"
            placeholder="不修改密码请留空"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门：" prop="depart_id">
          <el-col :span="20">
            <el-select
              v-model="formData.depart_id"
              placeholder="请选择部门"
              @change="getDepartListsChange($event)"
            >
              <el-option
                v-for="item in departListItem"
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
              @click="addDepartDialog"
              icon="el-icon-plus"
            ></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="人员职位：" prop="post_id">
          <el-col :span="20">
            <el-select v-model="formData.post_id" placeholder="请选择职位">
              <el-option
                v-for="item in postListItem"
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
              @click="addPostDialog"
              icon="el-icon-plus"
            ></el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="电话号码：" prop="phone">
          <el-input v-model="formData.phone" autocomplete="off"></el-input>
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
      tableData: [
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 3,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
              type: "职位",
            },
            {
              id: 32,
              name: "王小虎",
              type: "职位",
            },
          ],
        },
        {
          id: 4,
          name: "王小虎",
          type: "部门",
          children: [
            {
              id: 31,
              name: "王小虎",
            },
            {
              id: 32,
              name: "王小虎",
            },
          ],
        },
      ],
      diaLogFormVisible: false,
      diaLogFormDepartVisible: false,
      diaLogFormPostVisible: false,
      diaLogTitle: "新增人员",
      searchFormData: {
        searchDepartId: "",
        searchPostId: "",
      },
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
            message: "请输入长度1-10个字符的汉字、字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z_]{1,10}$/,
            message: "请输入长度1-10个字符的字母、数字、下划线组合",
            trigger: "blur",
          },
        ],
        passwordtwo: [
          {
            min: 2,
            max: 10,
            message: "输入密码长度2到10个字符",
            trigger: "blur",
          },
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: "输入密码只能是数字、字母、下划线",
            trigger: "blur",
          },
        ],
        depart_id: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change",
          },
        ],
        post_id: [
          {
            required: true,
            message: "请选择职位",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      page_current: 1,
      page_total: 0,
      page_size: 20,
      dataList: [],
      departListJson: [],
      departListItem: [],
      postListItem: [],
    };
  },
  mounted() {
    //document.querySelector("#setmanage").classList.add("is_active");
  },
  created() {
    this.getDepartLists();
    this.getDataList();
  },
  methods: {
    getDataList() {
      let page = this.page_current;
      let name = this.searchFormData.searchName;
      let depart_id = this.searchFormData.searchDepartId;
      let post_id = this.searchFormData.searchPostId;
      this.request({
        url: "/user/getAdminPages",
        method: "get",
        params: {
          page,
          name,
          depart_id,
          post_id,
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
      this.searchFormData = { searchDepartId: "", searchPostId: "" };
      this.postListItem = [];
      this.page_current = 1;
      this.getDataList();
    },
    addRecDialog() {
      this.diaLogFormVisible = true;
      this.diaLogTitle = "新增人员";
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.formData = {};
    },
    editRecEvent(id) {
      this.diaLogTitle = "编辑人员";
      this.diaLogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["formRulesRef"].clearValidate();
      });
      this.getDepartLists();
      this.request({
        url: "/user/getAdminInfo",
        method: "get",
        params: { id: id },
      }).then((response) => {
        var data = response.data;
        if (data.status == 1) {
          this.formData = data.data;
          this.formData.password = "";
          this.getPostLists(data.data.depart_id);
        }
      });
    },
    addRecEvent() {
      const that = this;
      this.$refs["formRulesRef"].validate((valid) => {
        if (valid) {
          let data = that.formData;
          let url = "/user/addAdmin";
          let baseid = this.formData.id;
          if (typeof baseid != "undefined") {
            url = "/user/editAdmin";
          } 
          that.formData.username = that.formData.name;
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
    delRecEvent(id, name) {
      if (name == "admin") {
        this.$message.error("admin管理员账号不能删除");
        return false;
      }
      this.$confirm("您确定要删除？删除后不能恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "el-message-box-dev",
      })
        .then(() => {
          this.request({
            url: "/user/deleteAdmin",
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
    getDepartListsChange(val) {
      this.$set(this.formData, "post_id", "");
      this.$set(this.searchFormData, "searchPostId", "");
      this.getPostLists(val);
    },
    getPostLists(pid) {
      this.request({
        url: "/user/getDepartLists",
        method: "get",
        params: { pid: pid },
      }).then((response) => {
        var data = response.data;
        if (data.status == 1) {
          this.postListItem = data.data;
        }
      });
    },

    getDepartListJson() {
      this.request({
        url: "/user/getDepartLists",
        method: "get",
      }).then((response) => {
        var data = response.data;
        if (data.status == 1) {
          var json = data.data;
          //  this.videoList.map((item, i) => {
          //       this.$video("myVideo" + item.id).dispose();
          //     });
          let datas = [];
          json.map((item, i) => {
            this.getPostLists(item.id);
            datas.push({
              id: item.id,
              name: item.name,
              children: this.postListItem,
            });
          });
          this.departListItem = datas;
          console.log("datas：" + JSON.stringify(datas));
        }
      });
    },

    addDepartDialog() {
      this.diaLogFormDepartVisible = true;
    },

    addDepartEvent() {
      this.$prompt("部门名称：", "新增部门", {
        customClass: "el-message-box-new",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入部门名称",
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/user/addDepartment",
            method: "post",
            data: { name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getDepartLists();
              //this.$set(this.formData, "depart_id", this.departListItem[0].id);
              // this.formData.depart_id = this.departListItem[0].id;
              this.$message({
                type: "success",
                message: "保存成功！",
              });
            }
          });
        })
        .catch(() => {});
    },
    editDepartEvent(id, name) {
      this.$prompt("部门名称：", "编辑部门", {
        customClass: "el-message-box-new",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入部门名称",
        inputValue: name,
        inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
        inputErrorMessage:
          "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
      })
        .then(({ value }) => {
          this.request({
            url: "/user/editDepartment",
            method: "post",
            data: { id: id, name: value },
          }).then((response) => {
            var data = response.data;
            if (data.status == 1) {
              this.getDepartLists();
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
    addPostDialog() {
      let departid = this.formData.depart_id;
      if (typeof departid == "undefined") {
        this.$message.error("请选择所属部门");
      } else {
        this.diaLogFormPostVisible = true;
      }
    },
    addPostEvent() {
      let departid = this.formData.depart_id;
      if (typeof departid == "undefined") {
        this.$message.error("请选择所属部门");
      } else {
        this.$prompt("职位名称：", "新增职位", {
          customClass: "el-message-box-new",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入职位名称",
          inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
          inputErrorMessage:
            "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
        })
          .then(({ value }) => {
            this.request({
              url: "/user/addDepartment",
              method: "post",
              data: { name: value, pid: departid },
            }).then((response) => {
              var data = response.data;
              if (data.status == 1) {
                this.getPostLists(departid);
                //  this.$set(this.formData, "post_id", this.postListItem[0].id);
                //this.formData.post_id = this.postListItem[0].id;
                this.$message({
                  type: "success",
                  message: "保存成功！",
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    editPostEvent(id, name) {
      let departid = this.formData.depart_id;
      if (typeof departid == "undefined") {
        this.$message.error("请选择所属部门");
      } else {
        this.$prompt("职位名称：", "新增职位", {
          customClass: "el-message-box-new",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPlaceholder: "请输入职位名称",
          inputValue: name,
          inputPattern: /^[0-9a/^[0-9a-zA-Z\u4e00-\u9fa5\_\-]{1,10}$/,
          inputErrorMessage:
            "请输入长度1-20个字符的汉字、字母、数字、下划线组合",
        })
          .then(({ value }) => {
            this.request({
              url: "/user/editDepartment",
              method: "post",
              data: { id: id, name: value, pid: departid },
            }).then((response) => {
              var data = response.data;
              if (data.status == 1) {
                this.getPostLists(departid);
                this.getDataList();
                this.$message({
                  type: "success",
                  message: "保存成功！",
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    //
  },
};
</script>
<style>
.dialog-users .el-select {
  width: 100%;
}
.dialog-users .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.dialog-users .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.dialog-users .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.dialog-users .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-table__row--level-0 {
  color: #111;
  font-weight: 700;
}
.el-table__row--level-1 .cell {
  color: #666;
}
</style>