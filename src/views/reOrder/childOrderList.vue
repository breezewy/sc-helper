<template>
  <div id="childListContainer">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item>
        <el-input
            placeholder="请输入票型编码"
            v-model.trim="paramData.code"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
            @clear="handleClear"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            placeholder="请输入虚拟票订单号"
            v-model.trim="paramData.mainDmqOrderId"
            class="inputArea"
            suffix-icon="el-icon-edit"
            clearable
            @clear="handleClear"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
            placeholder="请输入预约订单号"
            v-model.trim="paramData.dmqOrderId"
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
            placeholder="请输入票型名称"
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
            v-for="item in orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="paramData.dmqOrderStatus" clearable placeholder="请选择消费状态">
          <el-option
            v-for="item in dmqOrderStatusOptions"
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
        <el-date-picker
          v-model="playTime"
          type="daterange"
          start-placeholder="游玩时间"
          end-placeholder="游玩时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
          :default-time="['00:00:00', '23:59:59']"
          @change="playTimeChange"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-if="$store.getters.button.includes('reOrder:childOrderList:export')" @click="handleReChildOrderExport">导出</el-button>
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
          <el-table-column prop="supplyName" width="180" label="供应商" align="center" ></el-table-column>
          <el-table-column prop="mainDmqOrderId" label="虚拟票订单号" align="center" width="240"></el-table-column>
          <el-table-column prop="dmqOrderId" label="预约订单号" align="center" width="240"></el-table-column>
          <el-table-column prop="name" label="票型名称" align="center" width="200"></el-table-column>
          <el-table-column prop="code" label="票型编码" align="center" width="200"></el-table-column>
          <el-table-column prop="orderStatus" label="预约票状态" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.orderStatus==0" >未预约</span>
                <span v-if="scope.row.orderStatus==1" >已预约</span>
                <span v-if="scope.row.orderStatus==2" >订单失败</span>
                <span v-if="scope.row.orderStatus==3" >已退单</span>
              </template>
          </el-table-column>
          <el-table-column prop="dmqOrderStatus" label="虚拟票状态" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.dmqOrderStatus === 0 ">初始化</span>
              <span v-if="scope.row.dmqOrderStatus === 1 || scope.row.dmqOrderStatus === 2">订单失败</span>
              <span v-if="scope.row.dmqOrderStatus >= 3 &&  scope.row.dmqOrderStatus <= 8">订单成功</span>
              <span v-if="scope.row.dmqOrderStatus === 9 ">已退单</span>
            </template>
          </el-table-column>
          <el-table-column prop="buyerName" label="购买人" align="center" width="100"></el-table-column>
          <el-table-column prop="linkName" label="游客姓名" align="center" width="100"></el-table-column>
          <el-table-column prop="mobile" label="游客手机号" align="center" width="150"></el-table-column>
          <el-table-column prop="idCard" label="证件号" align="center" width="200"></el-table-column>
          <el-table-column prop="certificateType" label="证件类型" align="center" width="100">
             <template slot-scope="scope">
              <span v-if="scope.row.certificateType === '0' ">身份证</span>
              <span v-if="scope.row.certificateType === '1' ">护照</span>
              <span v-if="scope.row.certificateType === '2' ">港澳通行证</span>
              <span v-if="scope.row.certificateType === '3' ">台湾通行证</span>
            </template>
          </el-table-column>
          <el-table-column prop="playTime" label="游玩日期" align="center" width="100"></el-table-column>
          <el-table-column prop="showTime" label="场次" align="center"></el-table-column>
          <el-table-column prop="number" label="预约数量" align="center" width="100"></el-table-column>
          <el-table-column prop="finalSum" label="结算金额" align="center" ></el-table-column>
          <el-table-column prop="purchasePrice" label="采购价" align="center" ></el-table-column>
          <el-table-column prop="payTime" label="付款时间" align="center" width="180"></el-table-column>
          <el-table-column prop="dmqOrderStatus" label="消费状态" align="center" width="100">
             <template slot-scope="scope">
              <span v-if="scope.row.dmqOrderStatus === 5 ">待消费</span>
              <span v-if="scope.row.dmqOrderStatus === 7 ">消费中</span>
              <span v-if="scope.row.dmqOrderStatus === 8 ">已消费</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkTime" label="检票时间" align="center" width="180"></el-table-column>
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
import { getReChildOrder, handleReChildOrderExport, exportOrderList } from '../../api/reOrder'
export default {
  name: 'ChildOrderList',
  data() {
    return {
      currentPage: 1,
      total: 0,
      childOrderList: [],
      paramData: {
        code: '',
        dmqOrderId: '',
        name: '',
        supplyName: '',
        dmqOrderStatus: '',
        page: {
          pageNum: 0,
          pageSize: 10
        },
        reOrdersId: this.$route.params.id
      },
      playTime: '', // 日期选择器绑定的游玩日期
      startPlayTime: '', // 传参的游玩日期开始时间
      endPlayTime: '', // 传参的游玩日期结束时间
      payTime: '', // 日期选择器绑定的付款日期
      startPayTime: '', // 传参的付款时间
      endPayTime: '', // 传参的付款时间
      orderStatusOptions: [{
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
      dmqOrderStatusOptions: [{
        value: 5,
        label: '待消费'
      }, {
        value: 7,
        label: '消费中'
      }, {
        value: 8,
        label: '已消费'
      }],
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
  created() {
    this.getChildOrder(this.paramData)
  },
  methods: {
    // 导出
    handleReChildOrderExport() {
      const data = {
        ...this.paramData,
        startPlayTime: this.startPlayTime,
        endPlayTime: this.endPlayTime,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime
      }
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          delete data[key]
        }
      }
      handleReChildOrderExport(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('请到下载暂存区下载')
      })
    },
    getChildOrder(data) {
      if (this.playTime && this.playTime.length > 1) {
        this.startPlayTime = this.playTime[0]
        this.endPlayTime = this.playTime[1]
      }
      if (this.payTime && this.payTime.length > 1) {
        this.startPayTime = this.payTime[0]
        this.endPayTime = this.payTime[1]
      }
      const timeRange = {
        startPlayTime: this.startPlayTime,
        endPlayTime: this.endPlayTime,
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
      getReChildOrder(newData).then(res => {
        this.childOrderList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 选择列表不同页面
    handleSizeChange(val) {
      this.paramData.page.pageSize = val
      this.getChildOrder(this.paramData)
    },
    // 选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.paramData.page.pageNum = this.currentPage - 1
      this.getChildOrder(this.paramData)
    },
    handleExportCurrentChange(currentPage) {
      this.exportPage.pageNum = currentPage - 1
      this.downStorage()
    },
    // 查询
    search() {
      this.paramData.page.pageNum = 0
      this.paramData.page.pageSize = 10
      this.getChildOrder(this.paramData)
    },
    // 清空查询框
    handleClear() {
      this.paramData.page.pageNum = 0
      this.paramData.page.pageSize = 10
      this.currentPage = 1
      this.getChildOrder(this.paramData)
    },
    // 清空游玩日期选择器时执行
    playTimeChange(value) {
      if (value == null) {
        this.startPlayTime = ''
        this.endPlayTime = ''
        this.getChildOrder(this.paramData)
      }
    },
    // 清空付款日期选择器时执行
    payTimeChange(value) {
      if (value == null) {
        this.startPayTime = ''
        this.endPayTime = ''
        this.getChildOrder(this.paramData)
      }
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
    },
    // hover的时候，获取到下载列表并渲染
    downStorage() {
      const data = {
        fileType: 1,
        page: {
          pageNum: this.exportPage.pageNum,
          pageSize: this.exportPage.pageSize
        }
      }
      exportOrderList(data).then(res => {
        this.exportLists = res.data.data.data
        this.exportTotal = res.data.data.totalCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#childListContainer {
  padding: 30px;
  .tableContainer {
    margin-top: 30px;
    .el-pagination {
      padding: 20px 50px;
      text-align: right;
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
