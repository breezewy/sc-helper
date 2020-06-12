<template>
    <div class="smsController">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item  label="景区名称" >
              <el-select v-model="form.parkId" placeholder="请选择" clearable @clear="handleClear">
                  <el-option
                  v-for="item in parkList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="短信模板" >
              <el-select v-model="form.templateId" placeholder="请选择" clearable @clear="handleClear">
                  <el-option
                  v-for="item in smsTemplateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="发送状态" >
              <el-select v-model="form.status" placeholder="请选择" clearable @clear="handleClear">
                  <el-option
                  v-for="item in smsStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input
                placeholder="请输入手机号"
                v-model="form.mobile"
                class="inputArea"
                suffix-icon="el-icon-edit"
                clearable
                @clear="handleClear"
                ></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                v-model="sendTime"
                type="daterange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                clearable
                :default-time="['00:00:00', '23:59:59']"
                @change="sendTimeChange"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  type="primary" @click="resend">重新发送</el-button>
            </el-form-item>
        </el-form>
        <!-- 短信发送列表 -->
        <el-table
        :data="smsList"
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
            prop="mobile"
            label="手机号"
            align="center">
            </el-table-column>
            <el-table-column
            prop="content"
            label="短信内容"
            align="center"
            width="300"
            >
            </el-table-column>
            <el-table-column
            prop="status"
            label="发送状态"
            align="center">
              <template slot-scope="scope">
                <el-tag type="success" size="mini" v-if="scope.row.status === 0">发送成功</el-tag>
                <el-tag type="danger" size="mini" v-if="scope.row.status === 1">发送失败</el-tag>
                <el-tag type="info" size="mini" v-if="scope.row.status === 2">待发送</el-tag>
              </template>
            </el-table-column>
            <el-table-column
            prop="parkName"
            label="景区名称"
            align="center">
            </el-table-column>
            <el-table-column
            prop="templateName"
            label="模板名称"
            align="center">
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
            </el-table-column>
            <el-table-column
            prop="createTime"
            label="更新时间"
            align="center">
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="100"
            align="center"
            >
            <template slot-scope="scope">
                <el-button  type="text" size="small" @click="resend(scope.row.id)">重新发送</el-button>
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
    </div>
</template>

<script>
import { getParkList } from '@/api/query'
import { getSmsList, getSmsTemplateListAll, resendSms } from '@/api/sms'
export default {
  data() {
    return {
      parkList: [], // 景区列表
      smsStatus: [{
        label: '发送成功',
        value: 0
      }, {
        label: '发送失败',
        value: 1
      }, {
        label: '待发送',
        value: 2
      }],
      smsList: [], // 短信发送列表
      smsTemplateList: [], // 短信模板列表
      rowIdList: [], // table列表行ID数组，批量操作时用
      sendTime: '', // 时间选择器
      loading: true, // table加载动画
      currentPage: 1,
      total: 0,
      form: {
        startDate: '',
        endDate: '',
        mobile: '',
        parkId: '',
        status: '',
        templateId: '',
        page: {
          pageNum: 0,
          pageSize: 10
        }
      }

    }
  },
  created() {
    this.getParkList()
    this.getSmsList(this.form)
    this.getSmsTemplateListAll()
  },
  methods: {
    // 列表全选按钮
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 查询
    search() {
      this.getSmsList(this.form)
    },
    // 获取短信发送列表
    getSmsList(data) {
      if (this.sendTime && this.sendTime.length > 1) {
        this.form.startDate = this.sendTime[0]
        this.form.endDate = this.sendTime[1]
      }
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          delete data[key]
        }
      }
      getSmsList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.smsList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 获取景区列表
    getParkList() {
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
      })
    },
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.form.page.pageNum = 0
      this.form.page.pageSize = val
      this.getSmsList(this.form)
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.form.page.pageNum = this.currentPage - 1
      this.getSmsList(this.form)
    },
    // 清空查询框
    handleClear() {
      this.getSmsList(this.form)
    },
    // 清空日期选择器时执行
    sendTimeChange(value) {
      if (value == null) {
        this.form.startDate = ''
        this.form.endDate = ''
        this.getSmsList(this.form)
      }
    },
    // 重新发送
    resend(id) {
      if (this.rowIdList.length === 0) {
        this.rowIdList.push(id)
        resendSms(this.rowIdList).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.getSmsList(this.form)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      } else {
        resendSms(this.rowIdList).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.getSmsList(this.form)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }
    },
    // 获取短信模板列表
    getSmsTemplateListAll() {
      getSmsTemplateListAll().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const data = res.data.data
        data.forEach(item => {
          this.smsTemplateList.push({
            value: item.id,
            label: item.name
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .smsController{
        padding:30px;
        .el-pagination {
            padding: 20px 50px;
            text-align: right;
        }
    }
</style>
