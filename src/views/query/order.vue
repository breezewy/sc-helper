<template>
  <div id="orderContainer">
    <div class="filter">
      <div class="park">
        <span class="title">所属片区：</span>
        <el-select
          v-model="value"
          placeholder="所属片区"
          clearable
          class="filter-item"
          style="width: 220px"
          @change="getParkItem"
        >
          <el-option v-for="item in parkList" :key="item.id" :value="item.name" />
        </el-select>
      </div>

      <div class="orderInput">
        <span class="title">订单号：</span>
        <el-input placeholder="请输入订单号" v-model="dataForm.orderId" clearable></el-input>
      </div>

      <div class="phoneInput">
        <span class="title">手机号：</span>
        <el-input placeholder="请输入手机号" v-model="dataForm.mobile" clearable></el-input>
      </div>

      <div class="idCardInput">
        <span class="title">证件号：</span>
        <el-input placeholder="请输入证件号" v-model="dataForm.idCard" clearable></el-input>
      </div>

      <el-button type="primary" @click="handleClick">查询</el-button>
    </div>

    <div class="orderTable">
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        empty-text="暂无数据"
        height="400"
        @row-click="handleRowClick"
      >
        <el-table-column prop="billoutno" label="订单号" align="center" width="200"></el-table-column>
        <el-table-column prop="createTime" label="订单日期" align="center" width="200"></el-table-column>
        <el-table-column prop="billstatus" label="订单状态" align="center" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.billstatus===1" type="success">已出票</el-tag>
            <el-tag v-else type="danger">未出票</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="webbillstatus" label="退票标识" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.webbillstatus== 1">正常</span>
            <span v-else>已退单</span>
          </template>
        </el-table-column>
        <el-table-column prop="traveldate" label="游玩日期" align="center" width="120"></el-table-column>
        <el-table-column prop="ticketcount" label="订单数量" align="center"></el-table-column>
        <el-table-column prop="paysum" label="订单金额" align="center"></el-table-column>
        <el-table-column prop="finalcount" label="最终数量" align="center"></el-table-column>
        <el-table-column prop="finalsum" label="最终金额" align="center"></el-table-column>
        <el-table-column prop="seatflag" label="剧院票" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.seatflag == 1" type="success">有</el-tag>
            <el-tag v-else type="danger">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="seatcount" label="座位数" align="center"></el-table-column>
        <el-table-column prop="arrangecount" label="排位数" align="center"></el-table-column>
        <el-table-column prop="payflag" label="支付状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payflag == 1" type="success">已支付</el-tag>
            <el-tag v-else type="danger">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="游客姓名" align="center"></el-table-column>
        <el-table-column prop="telno" label="联系电话" align="center" width="150"></el-table-column>
        <el-table-column prop="certno" label="证件号码" align="center" width="200"></el-table-column>
        <el-table-column prop="billno" label="线下订单号" align="center" width="230"></el-table-column>
      </el-table>
    </div>

    <div class="detailTable">
      <el-table :data="orderDetail" style="width: 100%" border empty-text="暂无数据">
        <el-table-column prop="billdetailno" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="performtime" label="演出时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.performtime">{{scope.row.performtime}}</span>
            <span v-else>- -</span>
          </template>
        </el-table-column>
        <el-table-column prop="begindate" label="有效日期" align="center"></el-table-column>
        <el-table-column prop="invalidate" label="失效日期" align="center"></el-table-column>
        <el-table-column prop="usetime" label="检票时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.usetime">{{scope.row.usetime}}</span>
            <span v-else>未使用</span>
          </template>
        </el-table-column>
        <el-table-column prop="ticketmodelname" label="票型" align="center" width="280"></el-table-column>
        <el-table-column prop="leftcount" label="剩余数" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getParkList,
  getOfflineOrderList,
  getOfflineOrderDetail
} from "../../api/query";

export default {
  data() {
    return {
      parkList: [],
      value: "",
      dataForm: {
        idCard: "",
        orderId: "",
        mobile: "",
        parkId: ""
      },
      orderList: [],
      orderDetail: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getParkList().then(res => {
        if (res.data.code != 200) {
          return this.$message.error(res.data.msg)
        }
        this.parkList = res.data.data;
        this.value = this.parkList[0].name;
        this.dataForm.parkId = this.parkList[0].id;
      })
    },
    getParkItem(value) {
      for (let i = 0; i < this.parkList.length; i++) {
        if (value === this.parkList[i].name) {
          this.value = this.parkList[i].name;
          this.dataForm.parkId = this.parkList[i].id;
        }
      }
    },
    handleClick() {
      getOfflineOrderList(this.dataForm).then(res => {
        if (res.data.code != 200) {
            return this.$message.error(res.data.msg)
        }
        this.orderList = res.data.data;
      });
    },
    handleRowClick(row, column, event) {
      getOfflineOrderDetail(this.dataForm.parkId, row.billno).then(res => {
        if (res.data.code != 200) {
           return this.$message.error(res.data.msg)
        }
        this.orderDetail = res.data.data;
      });
    }
  }
};
</script>


<style scoped lang='scss'>
#orderContainer {
  padding: 30px;
  .filter {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    border-bottom: 1px solid #dcdfe6;
    .park {
      margin-right: 50px;
      .title {
        line-height: 40px;
      }
    }
    .orderInput,
    .phoneInput,
    .idCardInput {
      margin-right: 50px;
      display: flex;
      .el-input {
        width: 200px;
      }
      .title {
        line-height: 40px;
      }
    }
  }
  .orderTable {
    margin-top: 30px;
  }
  .detailTable {
    margin-top: 30px;
  }
}
</style>