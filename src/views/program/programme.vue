<template>
    <div class="program">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item>
              <el-button type="primary" v-if="$store.getters.button.includes('program:programme:save')" @click="addProgram">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="programList"
            empty-text="暂无数据"
            border
            style="width: 100%"
            row-key="id"
            >
            <el-table-column
            prop="name"
            label="节目名称"
            align="center"
            >
            </el-table-column>
            <el-table-column
            prop="sort"
            label="排序"
            align="center"
            width="200"
            >
            </el-table-column>
            <el-table-column
            prop="state"
            label="是否启用"
            align="center"
            width="200"
            >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state== true" type="success">启用</el-tag>
              <el-tag v-if="scope.row.state== false" type="danger">禁用</el-tag>
            </template>
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            width="200"
            >
            </el-table-column>
            <el-table-column
            prop="updateTime"
            label="更新时间"
            align="center"
            width="200"
            >
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addProgram(scope.row.id)" v-if="(scope.row.level === 1) && $store.getters.button.includes('program:childProgramme:save')">新增</el-button>
                <el-button type="text" v-if="$store.getters.button.includes('program:programme:update')" size="small" @click="updateProgram(scope.row.id)">修改</el-button>
                <el-button type="text" v-if="$store.getters.button.includes('program:programme:delete')" size="small" @click="deleteProgram(scope.row.id)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <edit-program
            v-if="showEditDialog"
            :show="showEditDialog"
            :id="id"
            :parentId="parentId"
            @close="closeEditDialog"
        ></edit-program>
    </div>
</template>

<script>
import { getProgramList, deleteProgram } from '@/api/program'
import EditProgram from './components/editProgram'
export default {
  data() {
    return {
      programList: [],
      showEditDialog: false,
      id: '',
      parentId: 0
    }
  },
  created() {
    this.getProgramList()
  },
  components: {
    EditProgram
  },
  methods: {
    // 获取节目单列表
    getProgramList() {
      getProgramList().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.programList = res.data.data
      })
    },
    // 新增
    addProgram(id) {
      this.showEditDialog = true
      this.parentId = id
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
