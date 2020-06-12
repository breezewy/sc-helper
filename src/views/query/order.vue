<template>
  <div id="orderContainer">
    <el-form :inline="true"  class="demo-form-inline">
            <el-form-item  label="所属片区">
              <el-select v-model="dataForm.parkId" placeholder="请选择所属片区"  style="width: 90%">
                  <el-option
                  v-for="item in parkList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="订单号">
                <el-input placeholder="请输入订单号" v-model="dataForm.orderId" clearable></el-input>
            </el-form-item>
            <el-form-item  label="手机号">
                <el-input placeholder="请输入手机号" v-model="dataForm.mobile" clearable></el-input>
            </el-form-item>
            <el-form-item  label="证件号">
                <el-input placeholder="请输入证件号" v-model="dataForm.idCard" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
    </el-form>
    <div class="orderTable">
      <el-table
        :data="orderList"
        style="width: 100%"
        border
        empty-text="暂无数据"
        height="500"
        highlight-current-row
        @row-click="handleRowClick"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          type="index"
          width="50"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="billoutno" label="订单号" align="center" width="200"></el-table-column>
        <el-table-column prop="createTime" label="订单日期" align="center" width="200"></el-table-column>
        <el-table-column prop="billstatus" label="订单状态" align="center" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.billstatus===1" type="success" size="mini">已出票</el-tag>
            <el-tag v-else type="danger" size="mini">未出票</el-tag>
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
            <el-tag v-if="scope.row.seatflag == 1" type="success" size="mini">有</el-tag>
            <el-tag v-else type="danger" size="mini">无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="seatcount" label="座位数" align="center"></el-table-column>
        <el-table-column prop="arrangecount" label="排位数" align="center"></el-table-column>
        <el-table-column prop="payflag" label="支付状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payflag == 1" type="success" size="mini">已支付</el-tag>
            <el-tag v-else type="danger" size="mini">未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="游客姓名" align="center"></el-table-column>
        <el-table-column prop="telno" label="联系电话" align="center" width="150"></el-table-column>
        <el-table-column prop="certno" label="证件号码" align="center" width="200"></el-table-column>
        <el-table-column prop="billno" label="线下订单号" align="center" width="230"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.seatflag == 1" @click="showSeatDetail(scope.row)">座位详情</el-button>
          </template>
        </el-table-column>
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

    <seat-detail v-if="searDetailVisible" :show="searDetailVisible" :item="item" :parkId="dataForm.parkId" @close="closeSeatDetail"></seat-detail>
  </div>
</template>

<script>
import { getParkList, getOfflineOrderList, getOfflineOrderDetail } from '@/api/query'
import seatDetail from './components/seatDetail'
export default {
  data() {
    return {
      parkList: [],
      value: '',
      dataForm: {
        idCard: '',
        orderId: '',
        mobile: '',
        parkId: ''
      },
      orderList: [],
      orderDetail: [],
      currentRow: null,
      searDetailVisible: false,
      item: {}
    }
  },
  created() {
    this.init()
  },
  components: {
    seatDetail
  },
  methods: {
    init() {
      const data = { 'theater': '' }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const data = res.data.data
        data.forEach(item => {
          this.parkList.push({
            value: item.id,
            label: item.name
          })
        })
        // this.value = this.parkList[0].name;
        // this.dataForm.parkId = this.parkList[0].id;
      })
    },
    getParkItem(value) {
      for (let i = 0; i < this.parkList.length; i++) {
        if (value === this.parkList[i].name) {
          this.value = this.parkList[i].name
          this.dataForm.parkId = this.parkList[i].id
        }
      }
    },
    handleSearch() {
      if (this.dataForm.parkId === '') {
        return this.$message.error('请选择所属片区')
      }
      // 参数对象属性为空时，删除这个属性
      for (const key in this.dataForm) {
        if (this.dataForm[key] === '') {
          delete this.dataForm[key]
        }
      }
      getOfflineOrderList(this.dataForm).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.orderList = res.data.data
      })
    },
    handleRowClick(row, column, event) {
      getOfflineOrderDetail(this.dataForm.parkId, row.billno).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.orderDetail = res.data.data
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    showSeatDetail(item) {
      this.searDetailVisible = true
      this.item = item
    },
    closeSeatDetail() {
      this.searDetailVisible = false
    }
  }
}
</script>

<style scoped lang='scss'>
#orderContainer {
  padding: 30px;
  .el-button{
    margin-left:20px;
  }
  .orderTable {
    margin-top: 30px;
  }
  .detailTable {
    margin-top: 30px;
  }
}
</style>
