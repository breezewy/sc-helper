<template>
  <div id="listContainer">
    <div class="list" v-if="hideChildOrder">
      <div class="toolbar">
        <el-input
          placeholder="请输入订单id"
          v-model="paramData.id"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入证件号"
          v-model="paramData.idCard"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入电话"
          v-model="paramData.mobile"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入姓名"
          v-model="paramData.name"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
        ></el-input>
        <el-input
          placeholder="请输入订单号"
          v-model="paramData.orderNo"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
        ></el-input>
        <el-button @click="search">查询</el-button>
      </div>
      <div class="tableContainer">
        <template>
          <el-table
            ref="multipleTable"
            :data="orderList"
            empty-text="暂无数据"
            tooltip-effect="dark"
            style="width: 100%"
            border
          >
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center" width="200"></el-table-column>
            <el-table-column prop="count" label="购买数量" align="center" width="100"></el-table-column>
            <el-table-column prop="idCard" label="证件号" align="center"></el-table-column>
            <el-table-column prop="dmqOrderId" label="独木桥订单号" align="center"></el-table-column>
            <el-table-column prop="certificateType" label="证件类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.certificateType == 0">身份证</span>
                <span v-if="scope.row.certificateType == 1">护照</span>
                <span v-if="scope.row.certificateType == 2">港澳通行证</span>
                <span v-if="scope.row.certificateType == 3">台湾通行证</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getReChildOrder(scope.row)">关联</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="10"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </template>
      </div>
    </div>

    <child-order v-else :id="reOrderId"></child-order>
  </div>
</template>

<script>
import { getOrderList, getReChildOrder } from "../../api/reOrder";
import ChildOrder from "./components/childOrder";
export default {
  data() {
    return {
      orderList: [],
      code: "",
      currentPage: 1,
      total: 0,
      paramData: {
        id: "",
        idCard: "",
        mobile: "",
        name: "",
        orderNo: "",
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      hideChildOrder: true,
      reOrderId: ""
    };
  },
  components: {
    ChildOrder
  },
  created() {
    this.getOrderList(this.paramData);
  },
  methods: {
    getOrderList(data) {
      if (data.id == "") {
        delete data.id;
      }
      if (data.idCard == "") {
        delete data.idCard;
      }
      if (data.mobile == "") {
        delete data.mobile;
      }
      if (data.name == "") {
        delete data.name;
      }
      if (data.orderNo == "") {
        delete data.orderNo;
      }
      getOrderList(data).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        this.orderList = res.data.data;
        this.total = res.data.totalCount;
      });
    },
    search() {
      this.getOrderList(this.paramData);
    },
    //选择列表不同页面
    handleSizeChange(val) {
      this.paramData.page.pageSize = val;
      this.getOrderList(this.paramData);
    },
    //选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val;
      this.paramData.page.pageNum = this.currentPage - 1;
      this.getOrderList(this.paramData);
    },
    getReChildOrder(data) {
      this.hideChildOrder = false;
      this.reOrderId = data.id;
    }
  }
};
</script>

<style lang="scss" scoped>
#listContainer {
  padding: 30px;
  .toolbar {
    .inputArea {
      width: 200px;
      margin-right: 30px;
    }
  }
  .tableContainer {
    margin-top: 30px;
    .el-pagination {
      padding: 20px 50px;
      text-align: right;
    }
  }
}
</style>