<template>
  <div id="listContainer">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item>
          <el-input
            placeholder="请输入虚拟票订单号"
            v-model.trim="paramData.orderNo"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
            @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
          <el-input
            placeholder="请输入供应商名称"
            v-model.trim="paramData.supplyName"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
            @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
         <el-input
            placeholder="请输入证件号"
            v-model.trim="paramData.idCard"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
            @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入手机号"
          v-model.trim="paramData.mobile"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          @clear="handleClear"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入姓名"
          v-model.trim="paramData.name"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
          <el-input
          placeholder="请输入购买人"
          v-model.trim="paramData.buyerName"
          class="inputArea"
          suffix-icon="el-icon-edit"
          clearable
          @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="paramData.orderStatus" clearable placeholder="请选择订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="payTime"
          type="daterange"
          start-placeholder="付款时间"
          end-placeholder="付款时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
          :default-time="['00:00:00', '23:59:59']"
          @change="payTimeChange"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-if="$store.getters.button.includes('reOrder:orderList:export')" @click="handleReOrderExport">导出</el-button>
      </el-form-item>
    </el-form>
        <div
          class="exportarea"
          style="margin-left: 0px; display:inline-block;"
          @mouseenter="visible()"
          @mouseleave="invisible()"
        >
          <div class="export-lists-visiable">
            <el-table
              :data="exportLists"
              size="medium"
              align="center"
              border
              header-align="center"
              style="width: auto"
              ref="exportLists-visiable"
            >
              <el-table-column prop="createTime" label="申请时间" width="180" align="center"></el-table-column>
              <el-table-column prop="fileName" label="文件名" width="180" align="center"></el-table-column>
              <el-table-column prop="userName" label="操作员" width="100" align="center"></el-table-column>
              <el-table-column prop="fileStatus" label="文件状态" width="80" align="center">
                <template slot-scope="list">
                  <span v-if="list.row.fileStatus==0">生成中</span>
                  <span v-if="list.row.fileStatus==1">成功</span>
                  <span v-if="list.row.fileStatus==2">失败</span>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="操作" width="80" align="center">
                <template slot-scope="list">
                  <span v-if="list.row.fileStatus==2 || list.row.fileStatus==0">—</span>
                  <a
                    :href="list.row.fileUrl"
                    v-if="list.row.fileStatus==1"
                    style="text-decoration:none"
                  >下载</a>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              class="exportPagination"
              @current-change="handleExportCurrentChange"
              :current-page="exportCurrentPage"
              layout="total, prev, pager, next, jumper"
              :total="exportTotal"
            ></el-pagination>
          </div>

          <!-- 暂存区按钮 -->
          <el-tooltip
            class="item"
            effect="dark"
            content="导出的文件请在暂存区下载！"
            placement="right"
            manual
            v-model="isShow"
          >
            <el-button type="primary" ref="storageArea" class="exportButton" size="small">
              <i class="el-icon-arrow-down"></i>
              下载暂存区
            </el-button>
          </el-tooltip>
        </div>

    <div class="list" v-if="hideChildOrder">
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
            <el-table-column prop="dmqOrderId" label="虚拟票订单号" align="center" width="200"></el-table-column>
            <el-table-column prop="productType" label="票型类型" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.productType==1" size="mini">单选票</el-tag>
                <el-tag v-if="scope.row.productType==2" type="warning" size="mini">多选票</el-tag>
                <el-tag v-if="scope.row.productType==3" type="success" size="mini">通玩票</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="productCode" label="票型编码" align="center" width="200"></el-table-column>
            <el-table-column prop="productName" label="票型名称" align="center" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="purchasePrice" label="采购价" align="center" ></el-table-column>
            <el-table-column prop="finalSum" label="结算金额" align="center" ></el-table-column>
            <el-table-column prop="supplyName" label="供应商" align="center" width="200"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="buyerName" label="购买人" align="center" width="100"></el-table-column>
            <el-table-column prop="mobile" label="手机号" align="center" width="120"></el-table-column>
            <el-table-column prop="orderCount" label="订单数量" align="center" width="80"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.orderStatus==0" >未预约</span>
                <span v-if="scope.row.orderStatus==1" >已预约</span>
                <span v-if="scope.row.orderStatus==2" >订单失败</span>
                <span v-if="scope.row.orderStatus==3" >已退单</span>
              </template>
            </el-table-column>
            <el-table-column prop="dmqOrderStatus" label="独木桥订单状态" align="center" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.dmqOrderStatus === 0 ">初始化</span>
                <span v-if="scope.row.dmqOrderStatus === 1 || scope.row.dmqOrderStatus === 2">订单失败</span>
                <span v-if="scope.row.dmqOrderStatus >= 3 &&  scope.row.dmqOrderStatus <= 8">订单成功</span>
                <span v-if="scope.row.dmqOrderStatus === 9 ">已退单</span>
              </template>
            </el-table-column>
            <el-table-column prop="payTime" label="付款时间" align="center" width="180"></el-table-column>playDate
            <el-table-column prop="playDate" label="游玩日期" align="center" width="180"></el-table-column>
            <el-table-column prop="idCard" label="证件号" align="center" width="180"></el-table-column>
            <el-table-column prop="certificateType" label="证件类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.certificateType == 0">身份证</span>
                <span v-if="scope.row.certificateType == 1">护照</span>
                <span v-if="scope.row.certificateType == 2">港澳通行证</span>
                <span v-if="scope.row.certificateType == 3">台湾通行证</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right" width="200">
              <template slot-scope="scope">
                <el-button type="text" v-if="$store.getters.button.includes('reOrder:orderList:makeAppointment')" size="small" @click="makeAppointment(scope.row.dmqOrderId)">去预约</el-button>
                <el-button type="text" v-if="$store.getters.button.includes('reOrder:orderList:orderDetail')" size="small" @click="showOrderDetail(scope.row.id)">订单详情</el-button>
                <el-button type="text" v-if="$store.getters.button.includes('reOrder:orderList:showReChildOrder')" size="small" @click="getReChildOrder(scope.row.id)">显示预约单</el-button>
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
        <el-table-column prop="name" label="票型名称" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="code" label="票型编码" align="center" ></el-table-column>
        <el-table-column prop="containShow" label="是否包含演出票" align="center" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.containShow== true" type="success">是</el-tag>
            <el-tag v-if="scope.row.containShow== false" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="已购数量" align="center" v-if="dbData.type == 2"  width="100"></el-table-column>
        <el-table-column prop="number" label="剩余数量" align="center" v-else  width="100"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 点击去预约显示二维码区域 -->
    <el-dialog title="去预约" :visible.sync="qrcodeVisible"  class="qrcodeDialog" @opened="showQrCode" :close-on-click-modal="false">
          <div class="page"><iframe :src="qrcodePath" id="qrcodeIframe" name="refresh_name" style="width:300px;height:500px;" ></iframe></div>
          <div class="qrcodeArea">
            <div id="qrcode"></div>
            <div class="path">{{qrcodePath}}</div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="qrcodeVisible = false">取 消</el-button>
            <el-button type="primary" @click="qrcodeVisible = false">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getTicket, handleReOrderExport, makeAppointment, exportOrderList } from '../../api/reOrder'
import ChildOrder from './components/childOrder'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      orderList: [],
      code: '',
      currentPage: 1,
      total: 0,
      paramData: {
        id: '',
        idCard: '',
        mobile: '',
        name: '',
        orderNo: '',
        supplyName: '',
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      payTime: '', // 日期选择器绑定的付款日期
      startPayTime: '', // 传参的付款时间
      endPayTime: '', // 传参的付款时间
      hideChildOrder: true,
      reOrderId: '',
      dbData: {},
      dialogVisible: false,
      qrcodeVisible: false, // 去预约二维码
      options: [{
        value: 0,
        label: '未预约'
      }, {
        value: 1,
        label: '已预约'
      }, {
        value: 2,
        label: '订单失败'
      }, {
        value: 3,
        label: '已退单'
      }],
      qrcodePath: '',
      exportLists: [],
      exportTotal: 0,
      exportCurrentPage: 1,
      isShow: false,
      exportPage: {
        pageNum: 0,
        pageSize: 10
      }
    }
  },
  components: {
    ChildOrder
  },
  created() {
    this.getOrderList(this.paramData)
  },
  methods: {
    // 导出
    handleReOrderExport() {
      const data = {
        ...this.paramData,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime
      }
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          delete data[key]
        }
      }
      handleReOrderExport(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('请到下载暂存区下载')
      })
    },
    // hover的时候，获取到下载列表并渲染
    downStorage() {
      const data = {
        fileType: 0,
        page: {
          pageNum: this.exportPage.pageNum,
          pageSize: this.exportPage.pageSize
        }
      }
      exportOrderList(data).then(res => {
        this.exportLists = res.data.data.data
        this.exportTotal = res.data.data.totalCount
      })
    },
    getOrderList(data) {
      if (this.payTime && this.payTime.length > 1) {
        this.startPayTime = this.payTime[0]
        this.endPayTime = this.payTime[1]
      }
      const timeRange = {
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime
      }
      const newData = {}
      Object.assign(newData, timeRange, data)
      for (const key in newData) {
        if (newData[key] === '' || newData[key] === null) {
          delete newData[key]
        }
      }
      getOrderList(newData).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.orderList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    search() {
      this.paramData.page.pageNum = 0
      this.paramData.page.pageSize = 10
      this.getOrderList(this.paramData)
    },
    // 选择列表不同页面
    handleSizeChange(val) {
      this.paramData.page.pageSize = val
      this.getOrderList(this.paramData)
    },
    // 选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.paramData.page.pageNum = this.currentPage - 1
      this.getOrderList(this.paramData)
    },
    handleExportCurrentChange(currentPage) {
      this.exportPage.pageNum = currentPage - 1
      this.downStorage()
    },
    getReChildOrder(id) {
      // this.hideChildOrder = false;
      this.reOrderId = id
      this.$router.push({
        name: 'reOrder/childOrderList',
        params: {
          id: this.reOrderId
        }
      })
    },
    showOrderDetail(id) {
      getTicket(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.dialogVisible = true
        this.dbData = res.data.data
      })
    },
    handleClear() {
      this.paramData.page.pageNum = 0
      this.paramData.page.pageSize = 10
      this.currentPage = 1
      this.getOrderList(this.paramData)
    },
    // 清空付款日期选择器时执行
    payTimeChange(value) {
      if (value == null) {
        this.startPayTime = ''
        this.endPayTime = ''
        this.getOrderList(this.paramData)
      }
    },
    makeAppointment(id) {
      this.qrcodeVisible = true
      makeAppointment(id).then(res => {
        const code = res.data.data
        // this.qrcodePath = 'http://localhost:8082' + '/home/' + code
        this.qrcodePath = 'https://reserve.dmqwl.com' + '/home/' + code
        this.showQrCode()
      })
    },
    showQrCode() {
      document.getElementById('qrcode').innerHTML = ''
      new QRCode('qrcode', {
        width: 250,
        height: 250,
        text: this.qrcodePath
      })
      const iframe = document.getElementById('qrcodeIframe')
      window.open(iframe.src, 'refresh_name', '')
    },
    // 鼠标划入暂存按钮，显示暂存区
    visible() {
      var tab = document.querySelector('.export-lists-visiable')
      tab.style.display = 'inline-block'
      this.downStorage()
    },
    // 鼠标离开暂存按钮，隐藏暂存区
    invisible() {
      document.querySelector('.export-lists-visiable').style.display = 'none'
    }
  }
}
</script>

<style lang="scss">
#listContainer {
  padding: 30px;
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
  .qrcodeDialog{
    .el-dialog{
      .el-dialog__body{
        display: flex;
        align-items: center;
        justify-content: space-around;
        .qrcodeArea{
          #qrcode{
            img{
              margin:0 auto
            }
          }
          .path{
            margin-top:50px;
          }
        }
      }
    }
  }
  // 导出区相关样式
.exportarea {
  position: relative;
  float: right;
  margin-right: 103px;
  .export-lists-visiable {
    position: absolute;
    top: 20px;
    left: -500px;
    z-index: 1000;
    display: none;
    border: 1px solid rgba($color: #6d6c6c, $alpha: 0.3);
    // border-top:none;
    box-shadow: 2px 2px 4px rgba($color: #292929, $alpha: 0.5);
    .exportPagination.el-pagination {
      width: 100%;
      text-align: left;
      padding: 0;
      margin-top: 0;
      background: #fff;
      padding: 10px;
      border: 1px solid #eee;
      border-top: none;
    }
  }
  .exportButton {
    position: relative;
    bottom:20px;
    left:50px;
  }
}
}
</style>
