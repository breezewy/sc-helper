<template>
    <div class="program">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" @click="addProgram">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="programList"
            border
            style="width: 100%">
            <el-table-column
            fixed
            prop="name"
            label="节目名称"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="sort"
            label="排序"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="state"
            label="是否启用"
            align="center"
            >
            <template slot-scope="scope">
                <span v-if="scope.row.state">启用</span>
                <span v-else>禁用</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            >
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
            >
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="updateProgram(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="deleteProgram(scope.row.id)">删除</el-button>
                <el-button type="text" size="small" @click="programDetail(scope.row.id)">节目单详情</el-button>
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
        <edit-program
            v-if="showEditDialog"
            :show="showEditDialog"
            :id="id"
            @close="closeEditDialog"
        ></edit-program>
        <program-detail
          v-if="showProgramDetail"
          :show="showProgramDetail"
          :id="id"
          @close="closeProgramDetail"
        ></program-detail>
    </div>
</template>

<script>
import { getProgramList, deleteProgram } from '@/api/program'
import EditProgram from './components/editProgram'
import ProgramDetail from './components/programDetail'
export default {
  data() {
    return {
      programList: [],
      formData: {
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      showEditDialog: false,
      showProgramDetail: false,
      id: '',
      currentPage: 1,
      total: 0
    }
  },
  created() {
    this.getProgramList()
  },
  components: {
    EditProgram,
    ProgramDetail
  },
  methods: {
    // 获取节目单列表
    getProgramList() {
      getProgramList(this.formData).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.programList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 新增
    addProgram() {
      this.showEditDialog = true
    },
    // 删除
    deleteProgram(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProgram(id).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.$message.success('删除成功')
          this.getProgramList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭弹框
    closeEditDialog() {
      this.showEditDialog = false
      this.id = ''
      this.getProgramList()
    },
    // 修改
    updateProgram(id) {
      this.showEditDialog = true
      this.id = id
    },
    // 选择列表每页多少条数据
    handleSizeChange(val) {
      this.formData.page.pageSize = val
      this.formData.page.pageNum = 0
      this.getProgramList()
    },
    // 选择列表不同页面
    handleCurrentChange(val) {
      this.currentPage = val
      this.formData.page.pageNum = this.currentPage - 1
      this.getProgramList()
    },
    // 节目单详情
    programDetail(id) {
      this.id = id
      this.showProgramDetail = true
    },
    // 关闭节目单详情列表
    closeProgramDetail() {
      this.showProgramDetail = false
      this.id = ''
      this.getProgramList()
    }
  }
}
</script>

<style lang="scss" scoped>
.program {
    padding:30px;
   .el-pagination {
        padding: 20px 50px;
        text-align: right;
    }
}
</style>
