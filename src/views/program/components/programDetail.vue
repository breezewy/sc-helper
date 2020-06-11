<template>
  <el-dialog title="节目单详情" :visible.sync="outerVisible" @close="handleClose" width="70%" :close-on-click-modal="false">
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item>
            <el-button type="primary" @click="innerAdd">新增</el-button>
        </el-form-item>
    </el-form>
    <el-table
      :data="programDetailList"
      empty-text="暂无数据"
      style="width: 100%"
      border
    >
      <el-table-column prop="name" label="节目详情名称" align="center"></el-table-column>
      <el-table-column prop="sort"  label="排序" align="center"></el-table-column>
      <el-table-column prop="state" label="是否禁用" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state== true" type="success">启用</el-tag>
          <el-tag v-if="scope.row.state== false" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="链接" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="innerUpdate(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="innerDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        :title="title"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        append-to-body
        @opened="innerOpened($event)"
        @close="innerClose"
    >
        <el-form :model="innerForm" :rules="innerFormRules" ref="innerForm">
            <el-form-item label="节目ID" :label-width="formLabelWidth" prop="guidanceId">
                <el-select v-model="innerForm.guidanceId" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="节目名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="innerForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth">
                <el-radio-group v-model="innerForm.state">
                    <el-radio :label="true">启用</el-radio>
                    <el-radio :label="false">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" :label-width="formLabelWidth">
                <el-input-number v-model="innerForm.sort" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="链接" :label-width="formLabelWidth" prop="url">
                <el-input v-model="innerForm.url" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="innerSubmit">确 定</el-button>
        </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getProgramDetailList, getProgramList, addProgramDetail, deleteProgramDetail, getGuidanceDetailInfo, updateProgramDetail } from '@/api/program'
export default {
  name: 'Controller',
  props: ['show', 'id', 'name'],
  data() {
    return {
      programDetailList: [], // 关联票列表
      innerVisible: false,
      outerVisible: this.show,
      currentPage: 1,
      total: 0,
      title: '',
      dataForm: {
        id: this.id,
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      innerForm: {
        guidanceId: '',
        name: '',
        sort: 0,
        state: true,
        url: ''
      },
      innerFormRules: {
        guidanceId: [
          { required: true, message: '必选项不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入节目名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ]
      },
      formLabelWidth: '100px',
      options: [],
      innerId: ''
    }
  },
  created() {
    this.getProgramDetailList()
    this.getProgramList()
  },
  methods: {
    // 获取节目详情列表
    getProgramDetailList() {
      getProgramDetailList(this.id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.programDetailList = res.data.data
      })
    },
    // 获取节目单列表
    getProgramList() {
      const data = {
        page: {
          pageNum: 0,
          pageSize: 1000
        }
      }
      getProgramList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const arr = res.data.data.data
        arr.forEach(item => {
          this.options.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    // 新增
    innerAdd() {
      this.innerVisible = true
    },
    // 修改
    innerUpdate(id) {
      this.innerVisible = true
      this.innerId = id
    },
    // 选择列表每页多少条数据
    handleSizeChange(val) {
      this.dataForm.page.pageSize = val
      this.getTicketList(this.dataForm)
    },
    // 选择列表不同页面
    handleCurrentChange(val) {
      this.currentPage = val
      this.dataForm.page.pageNum = this.currentPage - 1
      this.getTicketList(this.dataForm)
    },
    handleAddSubmit() {
      const data = {
        dmqTicketId: this.dmqId,
        ticketId: this.addIdList
      }
      addReTicketDmq(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.innerVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.init(this.dmqId)
      })
    },
    handleAddCancel() {
      this.innerVisible = false
    },
    handleClose() {
      this.$emit('close')
    },
    // 内部弹框提交
    innerSubmit() {
      this.$refs.innerForm.validate((valid) => {
        if (valid) {
          if (!this.innerId) {
            addProgramDetail(this.innerForm).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('新增成功')
              this.innerVisible = false
            })
          } else {
            const { guidanceId, id, name, sort, state, url } = this.innerForm
            this.innerForm = { guidanceId, id, name, sort, state, url }
            updateProgramDetail(this.innerForm).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('修改成功')
              this.innerVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 内部弹框的删除
    innerDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProgramDetail(id).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.$message.success('删除成功')
          this.getProgramDetailList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    innerOpened() {
      this.title = this.innerId ? '修改' : '新增'
      if (this.innerId) {
        this.getGuidanceDetailInfo(this.innerId)
      }
    },
    innerClose() {
      this.innerId = ''
      this.$refs.innerForm.resetFields()
    },
    getGuidanceDetailInfo(id) {
      getGuidanceDetailInfo(id).then(res => {
        this.innerForm = {
          ...this.innerForm,
          ...res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tableContainer {
  margin-top: 30px;
}
.dialog {
  margin-top: -80px;
  .el-pagination {
    padding: 20px 50px;
    text-align: right;
  }
}
</style>
