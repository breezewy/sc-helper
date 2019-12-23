<template>
  <div id="childListContainer">
    <!-- <div class="toolbar">
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
    </div> -->
    <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            placeholder="请输入票型编码"
            v-model="paramData.code"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="宋城旅游订单号"
            v-model="paramData.dmqOrderId"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入票型名称"
            v-model="paramData.name"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="paramData.playTime"
            type="date"
            placeholder="请选择游玩日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button @click="search">查询</el-button>
        </el-col>
    </el-row>
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
          <el-table-column prop="dmqOrderId" label="宋城旅游订单号" align="center"></el-table-column>
          <el-table-column prop="name" label="票型名称" align="center" ></el-table-column>
          <el-table-column prop="code" label="票型编码" align="center" width="200"></el-table-column>
          <el-table-column prop="number" label="预约数量" align="center" width="100"></el-table-column>
          <el-table-column prop="playTime" label="游玩日期" align="center"></el-table-column>
          <el-table-column prop="showTime" label="演出场次" align="center"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.orderStatus==3" type="info" size="mini">已退单</el-tag>
                <el-tag v-else type="success" size="mini">已预约</el-tag>
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
</template>

<script>
import { getReChildOrder } from "../../api/reOrder";
export default {
  name: "childOrderList",
  data() {
    return {
      currentPage: 1,
      total: 0,
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
        reOrdersId: this.$route.params.id
      }
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
      if (data.reOrdersId == "") {
        delete data.reOrdersId;
      }
      getReChildOrder(data).then(res => {
        this.childOrderList = res.data.data.data;
        this.total = res.data.data.totalCount;
      });
    },
    //选择列表不同页面
    handleSizeChange(val) {
      this.paramData.page.pageSize = val;
      this.getChildOrder(this.paramData);
    },
    //选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val;
      this.paramData.page.pageNum = this.currentPage - 1;
      this.getChildOrder(this.paramData);
    },
    search() {
      this.getChildOrder(this.paramData);
    }
  }
};
</script>


<style lang="scss" scoped>
#childListContainer {
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