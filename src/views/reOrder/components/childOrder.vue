<template>
  <div id="childOrderContainer">
    <div class="toolbar">
      <el-input
        placeholder="请输入票型编码"
        v-model="paramData.code"
        class="inputArea"
        suffix-icon="el-icon-edit"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入独木桥ID"
        v-model="paramData.dmqOrderId"
        class="inputArea"
        suffix-icon="el-icon-edit"
        clearable
      ></el-input>
      <el-input
        placeholder="请输入票型名称"
        v-model="paramData.name"
        class="inputArea"
        suffix-icon="el-icon-edit"
        clearable
      ></el-input>
      <el-date-picker
        v-model="paramData.playTime"
        type="date"
        placeholder="请选择游玩日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-button @click="search">查询</el-button>
    </div>
    <div class="tableContainer">
      <template>
        <el-table
          ref="multipleTable"
          :data="childOrderList"
          empty-text="暂无数据"
          tooltip-effect="dark"
          style="width: 100%"
          border
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="name" label="票型名称" align="center" width="100"></el-table-column>
          <el-table-column prop="code" label="票型编码" align="center" width="200"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.orderStatus==3" type="info">已退单</el-tag>
                <el-tag v-else type="success">已预约</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="number" label="购买数量" align="center" width="100"></el-table-column>
          <el-table-column prop="playTime" label="游玩日期" align="center"></el-table-column>
          <el-table-column prop="showTime" label="演出场次" align="center"></el-table-column>
          <el-table-column prop="dmqOrderId" label="独木桥ID" align="center"></el-table-column>
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
</template>



<script>
import { getReChildOrder } from "../../../api/reOrder";
export default {
  name: "ChildOrder",
  props: ["id"],
  data() {
    return {
      childOrderList: [],
      paramData: {
        code: "",
        dmqOrderId: "",
        name: "",
        page: {
          pageNum: 0,
          pageSize: 10
        },
        playTime: "",
        reOrdersId: this.id
      },
      total: 0,
      currentPage: 1
    };
  },
  created() {
    this.getChildOrder(this.paramData);
  },
  methods: {
    getChildOrder(data) {
      if (data.code == "") {
        delete data.code;
      }
      if (data.dmqOrderId == "") {
        delete data.dmqOrderId;
      }
      if (data.name == "") {
        delete data.name;
      }
      if (data.playTime == "") {
        delete data.playTime;
      }
      getReChildOrder(data).then(res => {
        this.childOrderList = res.data.data.data;
        this.total = res.data.data.totalCount;
      });
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
    search() {
      this.getChildOrder(this.paramData);
    }
  }
};
</script>

<style lang="scss" scoped>
#childOrderContainer {
  padding: 30px;
  .toolbar {
    .inputArea {
      width: 260px;
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
