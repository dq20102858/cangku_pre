<template>
  <div class="app-page">
    <div class="el-search">
      <div class="prepend">返还管理</div>
    </div>

    <div class="app-page-select">
      <el-form :inline="true">
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
        <el-form-item class="el-form-item" label="返还人员：">
          <el-select
            v-model="searchFormData.searchUsers"
            placeholder="选择返还人员："
          >
            <el-option label="全部人员" value=""></el-option>
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="el-form-item el-form-date" label="返还时间：">
          <el-date-picker
            v-model="searchFormData.serachDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
             align="center"
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
      <el-table :data="dataList" border stripe>
        <el-table-column label="序号" width="80px">
          <template slot-scope="scope">{{
            scope.$index + (page_current - 1) * page_size + 1
          }}</template>
        </el-table-column>
        <el-table-column prop="store_number" label="返还编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="manager" label="返还人员" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depart" label="所属部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="store_type" label="仓库类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="store" label="仓库名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="create_time" label="返还时间"  width="160"></el-table-column>
        <el-table-column label="返还详情" width="80">
          <template slot-scope="scope">
            <div class="app-operation">
              <el-button
                class="btn-detail"
                @click="editRecEvent(scope.row.id)"
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
          prev-text="上一页"
          next-text="下一页"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      width="780px"
      class="dialog-listinto"
      title="返还详情"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="diaLogFormVisible"
    >
      <el-card class="box-card">
        <div class="text item">
          <div class="userinfo">
            <p><span>返还人员：</span> {{ formData.user }}</p>
            <p><span>仓库名称： </span>{{ formData.store }}</p>
            <p><span>返还时间：</span> {{ formData.create_time }}</p>
            <p>
              <span
                style="color: #36c; cursor: pointer"
                @click="picRecEvent(formData.avatar)"
                >查看图片</span
              >
            </p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>物品明细</h3>
        </div>
        <div class="text item">
          <div class="app-table app-table-nowrap">
            <el-table  height="410" :data="formData.list" border stripe>
              <el-table-column prop="number" label="物品编号"  show-overflow-tooltip></el-table-column>
              <el-table-column
                prop="product_name"
                label="物品名称"  show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="num" label="数量"  show-overflow-tooltip></el-table-column>
              <el-table-column prop="unit" label="规格"  show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog
      width="600px"
      class="dialog-listinto"
      title="图片"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="diaLogFormPicVisible"
    >
      <img
        :src="diaLogFormPicURL"
        style="margin: 0 auto; display: block; margin-bottom: 20px"
      />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      diaLogFormVisible: false,
      diaLogFormPicVisible: false,
      diaLogFormPicURL: "",
      searchFormData: {
        searchStoreType: "",
        searchStore: "",
        searchUsers: "",
      },
      formData: [],
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
     let type = 3; //出返还类别，1返还，2出库，3返还
      let page = this.page_current;
      let store_id = this.searchFormData.searchStore;
      let store_type_id = this.searchFormData.searchStoreType;
      let user_id = this.searchFormData.searchUsers;
      let time = this.searchFormData.serachDate;
      this.request({
        url: "/store/getStoreLogs",
        method: "get",
        params: {
          page,
          type,
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
      this.searchFormData = {
        searchStoreType: "",
        searchStore: "",
        searchUsers: "",
      };
      this.getStoreLists();
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
    picRecEvent(val) {
      this.diaLogFormPicVisible = true;
      this.diaLogFormPicURL = val;
    },
    editRecEvent(id) {
      this.diaLogFormVisible = true;
      this.request({
        url: "/store/getLogDetail",
        method: "get",
        params: { id: id },
      }).then((res) => {
        let data = res.data;
        if (data.status == 1) {
          this.formData = data.data;
        }
      });
    },
    //
  },
};
</script>
<style>
.dialog-listinto .el-card {
  margin-bottom: 20px;
}
.userinfo {
  display: flex;
  justify-content: space-between;
}
.userinfo p {
  color: #999;
}
.userinfo p span {
  color: #333;
}
</style>