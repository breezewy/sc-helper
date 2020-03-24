<template>
  <div class="visitor">
    <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="景区">
          <el-select
              v-model="form.gatherParkId"
              clearable
              placeholder="景区"
              @clear="handleClear"
          >
              <el-option
                v-for="item in parkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="form.visitorPhone"
            placeholder="手机号"
            clearable
            @clear="handleClear"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  @click="onSubmit">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="success" @click="handleExport">导出</el-button>
        </el-form-item> -->
    </el-form>
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
          prop="registerPark"
          label="景区名字"
          align="center">
        </el-table-column>
        <el-table-column
          prop="touristName"
          label="游客姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="visitorPhone"
          label="游客手机号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="touristIdType"
          label="证件类型"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.touristIdType == 0">身份证</span>
            <span v-if="scope.row.touristIdType == 1">护照</span>
            <span v-if="scope.row.touristIdType == 2">港澳通行证</span>
            <span v-if="scope.row.touristIdType == 3">台湾通行证</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="touristIdCard"
          label="证件号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="personNum"
          label="出行人数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="childNum"
          label="携带小孩数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="visitorTime"
          label="登记时间"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleShowDetail(scope.row.id)" type="text" size="small">查看详情</el-button>
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
    <visitor-detail v-if="showDetail" :show="showDetail" :id="id" @close=handleClose></visitor-detail>
  </div>
</template>

<script>
import { getVisitorList, gatherParkList } from '@/api/tourist'
import VisitorDetail from './components/visitorDetail'
import qs from 'qs'
export default {
  data() {
    return {
      visitorList: [], // 游客列表
      form: {
        page: {
          pageNum: 0,
          pageSize: 10
        },
        registerPark: '', // 景区名字
        gatherParkId: '', // 景区
        visitorPhone: '' // 游客手机
      },
      currentPage: 1, // 当前页
      total: 0, // 总条数
      loading: true,
      parkOptions: [], // 下拉框
      showDetail: false,
      id: ''
    }
  },
  created() {
    this.getVisitorList()
    this.gatherParkList()
  },
  components: {
    VisitorDetail
  },
  methods: {
    // 选择列表每页多少数据
    handleSizeChange(val) {
      this.form.page.pageNum = 0
      this.form.page.pageSize = val
      this.getVisitorList()
    },
    // 选择列表当前第几页
    handleCurrentChange(val) {
      this.currentPage = val
      this.form.page.pageNum = this.currentPage - 1
      this.getVisitorList()
    },
    // 获取游客列表
    getVisitorList() {
      // 空字符串参数不提交
      if (this.form.gatherParkId === '') {
        delete this.form.gatherParkId
      }
      if (this.form.visitorPhone === '') {
        delete this.form.visitorPhone
      }
      if (this.form.registerPark === '') {
        delete this.form.registerPark
      }
      getVisitorList(this.form).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.visitorList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 下拉框获取景区
    gatherParkList() {
      gatherParkList().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const data = res.data.data
        data.forEach(item => {
          this.parkOptions.push({
            value: item['id'],
            label: item['parkName']
          })
        })
      })
    },
    // 查询
    onSubmit() {
      this.getVisitorList()
    },
    // 当清空选择器的时候，重新发起请求
    handleClear() {
      this.getVisitorList()
    },
    // 导出
    handleExport() {
      const data = qs.stringify({
        gatherParkId: this.form.gatherParkId,
        visitorPhone: this.form.visitorPhone
      })
      window.location.href = `${process.env.VUE_APP_BASE_API}visitorRecord/export?${data}`
    },

    // 导出
    // handleExport() {
    //   const param = {
    //     guideId: this.guideId,
    //     guideCardNo: this.guideCardNo,
    //     idCard: this.idCard
    //   }
    //   handleExport(param).then(res => {
    //     const base64Code = res.headers.filename
    //     const filename = Base64.decode(base64Code)
    //     const time = formatDate(new Date())
    //     const blob = new Blob([res.data])
    //     const elink = document.createElement('a')
    //     elink.download = filename
    //     elink.style.display = 'none'
    //     elink.href = URL.createObjectURL(blob)
    //     document.body.appendChild(elink)
    //     elink.click()
    //     URL.revokeObjectURL(elink.href)
    //     document.body.removeChild(elink)
    //   })
    // },

    //   this.$http.get('/rescueInfo/export', {
    //     params: {
    //       guideId: this.guideId,
    //       guideCardNo: this.guideCardNo,
    //       idCard: this.idCard
    //     },
    //     responseType: 'blob'
    //   }).then(res => {
    //     const base64Code = res.headers.filename
    //     const filename = Base64.decode(base64Code)
    //     const time = formatDate(new Date())
    //     const blob = new Blob([res.data])
    //     const elink = document.createElement('a')
    //     elink.download = filename
    //     elink.style.display = 'none'
    //     elink.href = URL.createObjectURL(blob)
    //     document.body.appendChild(elink)
    //     elink.click()
    //     URL.revokeObjectURL(elink.href)
    //     document.body.removeChild(elink)
    //   })
    // },
    // 查看详情
    handleShowDetail(id) {
      this.showDetail = true
      this.id = id
    },
    handleClose() {
      this.showDetail = false
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
