<template>
    <div class="jobController">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item>
                <el-input
                v-model="beanName"
                placeholder="请输入bean名称"
                clearable
                @clear="handleClear"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button  @click="query">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  v-if="$store.getters.button.includes('sys:jobController:save')" type="primary" @click="addJob">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  v-if="$store.getters.button.includes('sys:jobController:delete')" type="danger" @click="deleteMoreJob">删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  v-if="$store.getters.button.includes('sys:jobController:pause')" type="warning" @click="pauseJob">暂停</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  v-if="$store.getters.button.includes('sys:jobController:resume')" type="success" @click="resumeJob">恢复</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="$store.getters.button.includes('sys:jobController:run')" @click="runJob">立即执行</el-button>
            </el-form-item>

        </el-form>
        <el-table
            :data="jobList"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column
            fixed
            prop="beanName"
            label="bean名称"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="cronExpression"
            label="cron表达式"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="params"
            label="参数"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="remark"
            label="备注"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="status"
            label="任务状态"
            align="center"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 0">禁用</span>
                    <span v-if="scope.row.status === 1">正常</span>
                </template>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="200"
            align="center"
            >
            <template slot-scope="scope">
                <el-button v-if="$store.getters.button.includes('sys:jobController:update')" @click="handleUpdateJob(scope.row.id)" type="text" size="small">修改</el-button>
                <el-button v-if="$store.getters.button.includes('sys:jobController:delete')" @click="handleDeleteSingle(scope.row.id)" type="text" size="small">删除</el-button>
                <el-button v-if="$store.getters.button.includes('sys:jobController:pause')" @click="pauseJobSingle(scope.row.id)" type="text" size="small">暂停</el-button>
                <el-button v-if="$store.getters.button.includes('sys:jobController:resume')" @click="resumeJobSingle(scope.row.id)" type="text" size="small">恢复</el-button>
                <el-button v-if="$store.getters.button.includes('sys:jobController:run')" @click="runJobSingle(scope.row.id)" type="text" size="small">立即执行</el-button>
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
        <edit-job v-if="showEditDialog" :show="showEditDialog" @close="handleClose" :id="jobId"></edit-job>
    </div>
</template>

<script>
import { getJobList, deleteJob, pauseJob, resumeJob, runJob } from '@/api/sys.js'
import EditJob from './components/editJob'
export default {
  data() {
    return {
      beanName: '', // bean名称
      currentPage: 1,
      total: 0,
      page: {
        pageNum: 0,
        pageSize: 10
      },
      jobList: [], // 任务列表
      showEditDialog: false, // 是否显示编辑弹框
      jobId: '', // 传给弹框的某一行的ID
      rowIdList: [] // 勾选表格的ID列表
    }
  },
  components: {
    EditJob
  },
  created() {
    this.getJobList()
  },
  methods: {
    // 点击全选
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 获取任务列表
    getJobList() {
      const data = {
        beanName: this.beanName,
        page: this.page
      }
      if (data.beanName === '' || data.beanName === null) {
        delete data.beanName
      }
      getJobList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.jobList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 清空查询框
    handleClear() {
      this.getJobList()
    },
    // 查询任务
    query() {
      this.getJobList()
    },
    // 新增任务
    addJob() {
      this.showEditDialog = true
    },
    // 关闭弹框
    handleClose() {
      this.showEditDialog = false
      this.jobId = ''
      this.getJobList()
    },
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.page.pageNum = 0
      this.page.pageSize = val
      this.getJobList()
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.page.pageNum = this.currentPage - 1
      this.getJobList()
    },
    // 点击修改按钮
    handleUpdateJob(id) {
      this.jobId = id
      this.showEditDialog = true
    },
    // 删除job
    deleteJob(data) {
      deleteJob(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('删除成功')
        this.getJobList()
      })
    },
    // 每行的删除按钮
    handleDeleteSingle(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteJob([id])
      }).catch(() => {
        return
      })
    },
    // 点击头部删除按钮
    deleteMoreJob() {
      if (this.rowIdList.length === 0) {
        this.$message({
          message: '请选择删除项',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteJob(this.rowIdList)
      }).catch(() => {
        return
      })
    },
    // 批量暂停定时任务
    pauseJob() {
      pauseJob(this.rowIdList).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('暂停成功')
        this.getJobList()
      })
    },
    // 单个暂停定时任务
    pauseJobSingle(id) {
      pauseJob([id]).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('暂停成功')
        this.getJobList()
      })
    },
    // 批量恢复被暂停的定时任务
    resumeJob() {
      resumeJob(this.rowIdList).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('恢复成功')
        this.getJobList()
      })
    },
    // 单个恢复被暂停的定时任务
    resumeJobSingle(id) {
      resumeJob([id]).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('恢复成功')
        this.getJobList()
      })
    },
    // 批量立即执行任务
    runJob() {
      runJob(this.rowIdList).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('立即执行成功')
        this.getJobList()
      })
    },
    // 单个立即执行定时任务
    runJobSingle(id) {
      runJob([id]).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('立即执行成功')
        this.getJobList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.jobController{
    padding:30px;
    .el-pagination {
        padding: 20px 50px;
        text-align: right;
    }
}
</style>
