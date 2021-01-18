<template>
  <div class="app-set-page">
    <!-- <div class="el-search">
      <div class="prepend">物品管理</div>
      <div class="item">
        <el-input placeholder="请输入关键字搜索" v-model="serachName" clearable>
        </el-input>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </div>
    </div> -->
    <div class="app-page">
      <div class="app-page-select">
        <el-form :inline="true">
          <el-form-item class="el-form-item" label="仓库类型：">
            <el-select
              v-model="searchRole"
              @change="searchRoleEvent($event)"
              placeholder="选择仓库类型"
            >
              <el-option label="全部职位" value="0"></el-option>
              <el-option label="管理员" value="1"></el-option>
              <el-option label="维护人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="仓库名称：">
            <el-select
              v-model="searchRole"
              @change="searchRoleEvent($event)"
              placeholder="选择仓库类型"
            >
              <el-option label="全部职位" value="0"></el-option>
              <el-option label="管理员" value="1"></el-option>
              <el-option label="维护人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="入库人员：">
            <el-select
              v-model="searchRole"
              @change="searchRoleEvent($event)"
              placeholder="选择仓库名称"
            >
              <el-option label="全部职位" value="0"></el-option>
              <el-option label="管理员" value="1"></el-option>
              <el-option label="维护人员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="el-form-item" label="入库时间：">
            <el-date-picker
              v-model="serachDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
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
              scope.$index + (page_cur - 1) * page_size + 1
            }}</template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="入库时间"
            sortable
          ></el-table-column>
          <el-table-column prop="username" label="入库人员"></el-table-column>
          <el-table-column prop="role" label="所属部门"></el-table-column>
          <el-table-column prop="role" label="入库位置"></el-table-column>
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
            layout="total,  prev, pager, next,sizes, jumper"
            :current-page="this.page_cur"
            :page-sizes="[20]"
            :page-size="this.page_size"
            :total="this.page_total"
            @current-change="pageChange"
          >
          </el-pagination>
        </div>
      </div>

      <el-dialog
        width="600px"
        class="dialog-inlist"
       title="详情"
        :close-on-click-modal="false"
        :visible.sync="diaLogFormVisible"
      >
        <el-form
          :model="formData"
          class="el-form-custom"
          ref="formRulesRef"
          label-width="110px"
        >
          <el-form-item label="人员姓名：" prop="name">
            <el-input v-model="formData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="人员职位：" prop="role_id">
            <el-select v-model="formData.role_id" placeholder="请选择职位">
              <el-option label="管理员" :value="1"></el-option>
              <el-option label="维护人员" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input v-model="formData.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="diaLogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="diaLogFormVisible"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      serachDate: "",
      searchKeyword: "",
      searchRole: "",
      diaLogFormVisible: false,
      formData: {},
      page_cur: 1,
      page_total: 0,
      page_size: 20,
      page_count: 0,
      dataList: [],
    };
  },
  created() {
   // this.getDataList();
  },
  methods: {
    searchBtn() {
      alert("123123");
    },
    getDataList() {
      let page = this.page_cur;
      let name = this.searchKeyword;
      let role_id = this.searchRole;
      this.request({
        url: "/user/getUserPages",
        method: "get",
        params: {
          page,
          name,
          role_id,
        },
      }).then((res) => {
        let data = res.data;
        if (data.status == 1) {
          this.dataList = data.data.data;
          this.page_cur = parseInt(data.data.current_page);
          this.page_count = data.data.last_page;
          this.page_total = data.data.total;
          this.page_size = data.data.per_page;
        }
      });
    },
    pageChange(value) {
      this.page_cur = value;
      this.getDataList();
    },
    searchEvent() {
      this.page_cur = 1;
      this.getDataList();
    },
    searchResetEvent(e) {
      this.page_cur = 1;
      this.getDataList();
    },
   showClick() {
      this.diaLogFormVisible = true;
    },
    //
  },
};
</script>
<style>
</style>