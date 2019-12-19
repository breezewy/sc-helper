<template>
  <div id="listContainer">
    <div class="list" v-if="hideChildOrder">
      <!-- <div class="toolbar">
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
      </div> -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            placeholder="请输入订单id"
            v-model="paramData.id"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="请输入证件号"
            v-model="paramData.idCard"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
          placeholder="请输入电话"
          v-model="paramData.mobile"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
          placeholder="请输入姓名"
          v-model="paramData.name"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-input
          placeholder="请输入订单号"
          v-model="paramData.orderNo"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="search">查询</el-button>
        </el-col>
      </el-row>
      <div class="tableContainer">
        <template>
          <el-table
            ref="multipleTable"
            :data="orderList"
            empty-text="暂无数据"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @row-dblclick="handleDBclick"
          >
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="dmqOrderId" label="宋城旅游订单号" align="center" width="200"></el-table-column>
            <el-table-column prop="productType" label="票型类型" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.productType==1" size="mini">单选票</el-tag>
                <el-tag v-if="scope.row.productType==2" type="warning" size="mini">多选票</el-tag>
                <el-tag v-if="scope.row.productType==3" type="success" size="mini">通玩票</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="票型编码" align="center" width="200"></el-table-column>
            <el-table-column prop="productName" label="票型名称" align="center" width="200"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
            <el-table-column prop="orderCount" label="订单数量" align="center" width="80"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" align="center" >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.orderStatus==3" type="info">已退单</el-tag>
                <el-tag v-else type="success">已预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="证件号" align="center" width="180"></el-table-column>
            <el-table-column prop="certificateType" label="证件类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.certificateType == 0">身份证</span>
                <span v-if="scope.row.certificateType == 1">护照</span>
                <span v-if="scope.row.certificateType == 2">港澳通行证</span>
                <span v-if="scope.row.certificateType == 3">台湾通行证</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="getReChildOrder(scope.row.id)">显示预约单</el-button>
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

    <!-- 双击某一行出现的区域 -->
      <el-dialog title="订单详情" :visible.sync="dialogVisible" class="dialog">
        <div class="totalCount" v-if="dbData.type == 2">
            <span class="title">总数量:</span><span class="number">{{dbData.number}}</span>
        </div>
      <el-table
        ref="multipleTable"
        :data="dbData.list"
        empty-text="暂无数据"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="票型名称" align="center"></el-table-column>
        <el-table-column prop="code" label="票型编码" align="center"></el-table-column>
        <el-table-column prop="containShow" label="是否包含演出票" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.containShow== true" type="success">是</el-tag>
            <el-tag v-if="scope.row.containShow== false" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="已购数量" align="center" v-if="dbData.type == 2"></el-table-column>
        <el-table-column prop="number" label="剩余数量" align="center" v-else></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getReChildOrder,getTicket } from "../../api/reOrder";
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
      reOrderId: "",
      dbData:{},
      dialogVisible:false
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

        if (res.data.code!= 200) {
          return this.$message.error(res.data.error);
        }
        this.orderList = res.data.data.data;
        this.total = res.data.data.totalCount;
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
    getReChildOrder(id) {
      // this.hideChildOrder = false;
      this.reOrderId = id;
      this.$router.push({
        name:'reOrder/childOrderList',
        params:{
          id:this.reOrderId
        }
      })
    },
    handleDBclick(row, column, event){
      getTicket(row.id).then(res=>{
        if (res.data.code != 200) {
          return this.$message.error(res.data.error);
        }
        this.dialogVisible = true;
        this.dbData = res.data.data;
      })
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
  .totalCount{
    padding:0 0  20px;
    font-size: 16px;
    .title{
      margin-right:10px;
    }
  }
}
</style>