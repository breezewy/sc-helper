<template>
  <div class="visitor">
    <!-- 游客列表 -->
    <el-table
      :data="visitorList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      border
      style="width: 100%">
        <el-table-column
          prop="nickName"
          label="微信昵称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="openId"
          label="微信Id"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="showVisitorInfo(scope.row)" type="text" size="small">详情</el-button>
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
    <visitor-info
      v-if="show"
      :show="show"
      :id="id"
      @close="handleClose"
    ></visitor-info>
  </div>
</template>

<script>
import { getVisitorList } from '@/api/tourist'
import visitorInfo from './components/visitorInfo'
export default {
  data() {
    return {
      visitorList: [], // 游客列表
      page: {
        pageNum: 0,
        pageSize: 10
      },
      currentPage: 1, // 当前页
      total: 0, // 总条数
      id: '', // 游客id
      show: false, // 弹框状态
      loading: true
    }
  },
  components: {
    visitorInfo
  },
  created() {
    this.getVisitorList()
  },
  methods: {
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.page.pageNum = 0
      this.page.pageSize = val
      this.getVisitorList()
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.page.pageNum = this.currentPage - 1
      this.getParkList()
    },
    // 获取游客列表
    getVisitorList() {
      const data = {
        page: this.page
      }
      getVisitorList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.visitorList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 点击详情时，出现弹框
    showVisitorInfo(row) {
      this.show = true
      this.id = row.id
    },
    // 监听到弹框关闭时执行
    handleClose() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.visitor{
  padding:30px;
  .el-pagination {
    padding: 20px 50px;
    text-align: right;
  }
}
</style>
