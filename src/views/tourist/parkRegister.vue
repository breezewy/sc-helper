<template>
  <div class="park">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="景区">
        <el-input
          v-model="parkName"
          placeholder="请输入景区名称"
          clearable
          @clear="handleClear"
          ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  @click="query">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="addPark">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 景区列表 -->
    <el-table
      :data="parkList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      border
      style="width: 100%">
        <el-table-column
          prop="parkName"
          label="景区名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="parkCode"
          label="景区码"
          align="center"
          width="150"
          >
        </el-table-column>
        <el-table-column
          prop="parkAdders"
          label="景区地址"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="region"
          label="区域管理"
          align="center"
          width="150"
          >
        </el-table-column>
        <el-table-column
          prop="describes"
          label="描述"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="tipsInfo"
          label="提示"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="updatePark(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="QRCode(scope.row)" type="text" size="small">二维码</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 二维码 -->
    <el-dialog
      title="二维码"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      @close="closeQRCode"
      >
        <img :src="url">
        <p class="parkName">{{QRParkName}}</p>
    </el-dialog>

    <!-- 新增或修改组件 -->
    <addOrUpdatePark
      v-if="show"
      :show="show"
      :title="title"
      :id ="id"
      @close = "close"
      ></addOrUpdatePark>
  </div>
</template>

<script>
import { getParkList, QRCode } from '@/api/tourist'
import addOrUpdatePark from './components/addOrUpdatePark'
export default {
  data() {
    return {
      parkList: [], // 登记景区列表
      page: { // 列表分页
        pageNum: 0,
        pageSize: 10
      },
      currentPage: 1, // 当前页面
      total: 0, // 总数量
      show: false, // 是否显示添加弹框
      title: '', // 点击新增还是修改
      id: '', // 景区id
      loading: true,
      dialogTableVisible: false, // 二维码弹框显示
      url: '', // 二维码链接
      parkName: '', // 景区名字
      QRParkName: '' // 二维码景区名称
    }
  },
  components: {
    addOrUpdatePark
  },
  created() {
    this.getParkList()
  },
  methods: {
    query() {
      this.getParkList()
    },
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.page.pageNum = 0
      this.page.pageSize = val
      this.getParkList()
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.page.pageNum = this.currentPage - 1
      this.getParkList()
    },
    // 获取登记景区列表
    getParkList() {
      const data = {
        page: this.page,
        parkName: this.parkName
      }
      if (this.parkName === '') {
        delete (data.parkName)
      }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.parkList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 新增登记景区
    addPark() {
      this.show = true
      this.title = '新增'
    },
    // 弹框关闭时执行的方法
    close() {
      this.show = false
      this.getParkList()
    },
    // 修改景区
    updatePark(row) {
      this.show = true
      this.title = '修改'
      this.id = row.id
    },

    // 二维码
    QRCode(row) {
      this.dialogTableVisible = true
      this.QRParkName = row.parkName
      QRCode(row.parkCode).then(res => {
        const data = res.data
        const blob = new Blob([data])
        this.url = window.URL.createObjectURL(blob)
      })
    },
    // 清空查询时，重新请求
    handleClear() {
      this.getParkList()
    },
    // 关闭二维码
    closeQRCode() {
      this.dialogTableVisible = false
    }
  }
}

</script>

<style lang="scss" scoped>
.park{
  padding:30px;
  .el-table{
    margin-top:30px;
  }
  .el-pagination {
    padding: 20px 50px;
    text-align: right;
  }
  /deep/ .el-dialog {
     .el-dialog__body {
      text-align: center;
      img{
        width:300px;
        height:300px;
        text-align: center;
      }
    }
  }
}
</style>
