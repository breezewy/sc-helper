<template>
    <div class="sendSms">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="模板名称">
                <el-input
                placeholder="请输入模板名称"
                v-model="form.name"
                class="inputArea"
                suffix-icon="el-icon-edit"
                clearable
                @clear="handleClear"
                ></el-input>
            </el-form-item>
            <el-form-item label="模板ID">
                <el-input
                placeholder="请输入id"
                v-model="form.id"
                class="inputArea"
                suffix-icon="el-icon-edit"
                clearable
                @clear="handleClear"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSms">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="deleteSmsMore">删除</el-button>
            </el-form-item>
        </el-form>
        <!-- 短信发送模板列表 -->
        <el-table
        :data="smsTemplateList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            >
          </el-table-column>
            <el-table-column
            prop="id"
            label="模板ID"
            align="center">
            </el-table-column>
            <el-table-column
            prop="name"
            label="模板名称"
            align="center">
            </el-table-column>
            <el-table-column
            prop="content"
            label="短信内容"
            align="center"
            width="300"
            :show-overflow-tooltip="true"
            >
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
                <el-button  type="text" size="small" @click="updateSms(scope.row.id)">修改</el-button>
                <el-button  type="text" size="small" @click="deleteSmsSingle(scope.row.id)">删除</el-button>
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
        <edit-sms v-if="showEditDialog" :show="showEditDialog" @close="handleClose" :id="smsId"></edit-sms>
    </div>
</template>

<script>
import { getSmsTemplateList, deleteSms } from '@/api/sms'
import EditSms from './components/editSms'
export default {
  data() {
    return {
      loading: true,
      showEditDialog: false,
      rowIdList: [],
      form: {
        page: {
          pageNum: 0,
          pageSize: 10
        },
        name: '',
        id: ''
      },
      sendTime: '',
      smsTemplateList: [],
      currentPage: 1,
      total: 0,
      smsId: ''
    }
  },
  created() {
    this.getSmsTemplateList(this.form)
  },
  components: {
    EditSms
  },
  methods: {
    // 列表全选按钮
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 获取短信发送记录列表
    getSmsTemplateList(data) {
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          delete data[key]
        }
      }
      getSmsTemplateList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.smsTemplateList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.form.page.pageNum = 0
      this.form.page.pageSize = val
      this.getSmsTemplateList(this.form)
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.form.page.pageNum = this.currentPage - 1
      this.getSmsTemplateList(this.form)
    },
    search() {
      this.getSmsTemplateList(this.form)
    },
    // 清空搜索框
    handleClear() {
      this.form.page.pageNum = 0
      this.form.page.pageSize = 10
      this.currentPage = 1
      this.getSmsTemplateList(this.form)
    },
    // 新增短信模板
    addSms() {
      this.showEditDialog = true
    },
    // 关闭弹框
    handleClose() {
      this.showEditDialog = false
      this.smsId = ''
      this.getSmsTemplateList(this.form)
    },
    // 更新短信模板
    updateSms(id) {
      this.showEditDialog = true
      this.smsId = id
    },
    // 单行的删除
    deleteSmsSingle(id) {
      this.deleteSms([id])
    },
    // 批量删除
    deleteSmsMore() {
      this.deleteSms(this.rowIdList)
    },
    // 删除方法
    deleteSms(data) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSms(data).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.getSmsTemplateList(this.form)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        return
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sendSms{
    padding:30px;
    .el-pagination {
        padding: 20px 50px;
        text-align: right;
    }
}
</style>
