<template>
    <div class="seat">
        <div class="toolbar">
            <el-form :inline="true"  class="demo-form-inline">
                  <el-form-item  label="景区名称">
                    <el-select v-model="form.parkId" placeholder="请选择" @change="getParkName">
                        <el-option
                        v-for="item in parkList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  label="剧院名称">
                    <el-select v-model="form.theaterId" placeholder="请选择" >
                        <el-option
                        v-for="item in theaterList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item  label="席位编码" >
                    <el-input v-model="form.code" placeholder="请输入席位编码"></el-input>
                  </el-form-item>
                  <el-form-item  label="席位名称" >
                    <el-input v-model="form.name" placeholder="请输入席位名称"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="search">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="appendSeat">新增</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" @click="deleteAllSeat">删除</el-button>
                  </el-form-item>
            </el-form>
        </div>
         <div class="seatList-table">
            <template>
                <el-table
                    ref="multipleTable"
                    :data="seatList"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="席位名称" align="center"></el-table-column>
                    <el-table-column prop="id" label="席位ID" align="center"></el-table-column>
                    <el-table-column prop="code" label="席位编码" align="center"></el-table-column>
                    <el-table-column prop="theaterName" label="剧院名称" align="center"></el-table-column>
                    <el-table-column prop="theaterCode" label="剧院编码" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="300" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
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
        </template>
        </div>
        <append-seat
            v-if="showAppendForm"
            :show="showAppendForm"
            :parkList="parkList"
            @changeAppendShow="changeAppendShow"
            @handleAppendSuccess="refresh"
            >
        </append-seat>
        <update-seat
            :seatInfo = "seatInfo"
            :show="showUpdateForm"
            @changeUpdateShow = "changeUpdateShow"
            @handleUpdateSuccess ="refresh"
        >
        </update-seat>
    </div>
</template>

<script>
import { getSeatById, deleteSeat, searchSeat } from '@/api/seat'
import { getParkList } from '@/api/query'
import { getTheaterByParkId } from '@/api/theater'
import AppendSeat from './components/appendSeat'
import UpdateSeat from './components/updateSeat'
export default {
  name: 'Seat',
  components: {
    AppendSeat,
    UpdateSeat
  },
  data() {
    return {
      options: [],
      seatList: [],
      theaterList: [],
      parkList: [],
      seatInfo: {},
      rowIdList: [],
      showAppendForm: false,
      showUpdateForm: false,
      form: {
        code: '',
        name: '',
        page: {
          pageNum: 0,
          pageSize: 10
        },
        parkId: '',
        theaterId: ''
      },
      total: 0,
      currentPage: 1
    }
  },
  mounted() {
    this.getSeatList()
    this.getParkList()
  },
  methods: {
    // 选择列表不同页面
    handleSizeChange(val) {
      this.form.page.pageSize = val
      this.getSeatList(this.form)
    },
    // 选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.form.page.pageNum = this.currentPage - 1
      this.getSeatList(this.form)
    },
    // 搜索
    search() {
      if (this.form.parkId === '') {
        return this.$message.error('请选择景区')
      }
      if (this.form.theaterId === '') {
        return this.$message.error('请选择剧院')
      }
      this.form.page.pageNum = 0
      this.form.page.pageSize = 10
      searchSeat(this.form).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.seatList = res.data.data.data
      })
    },
    getParkName(value) {
      this.parkList.forEach(item => {
        if (value === item.value) {
          this.getTheaterListByParkId(value)
        }
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
    // 获取剧院
    getTheaterListByParkId(id) {
      getTheaterByParkId(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const data = res.data.data
        data.forEach(item => {
          this.theaterList.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    // 获取席位列表
    getSeatList() {
      for (const key in this.form) {
        if (this.form[key] === '') {
          delete this.form[key]
        }
      }
      searchSeat(this.form).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.seatList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 点击全选
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 新增席位
    appendSeat() {
      this.showAppendForm = true
    },
    // 头部删除席位按钮
    deleteAllSeat() {
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
        this.deleteSeat(this.rowIdList)
      }).catch(() => {
        return
      })
    },
    handleDeleteSingle(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSeat([id])
      }).catch(() => {
        return
      })
    },
    deleteSeat(data) {
      deleteSeat(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    // 关闭新增框
    changeAppendShow() {
      this.showAppendForm = false
    },
    // 刷新列表
    refresh() {
      this.getSeatList()
    },
    // 修改席位
    handleUpdate(id) {
      this.showUpdateForm = true
      getSeatById(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.seatInfo = res.data.data
      })
    },
    // 关闭修改框
    changeUpdateShow() {
      this.showUpdateForm = false
    }

  }
}

</script>

<style lang="scss" scoped>
.seat{
    padding:30px;
    .el-button{
        margin-left:15px;
    }
    .seatList-table{
        margin-top:30px;
        .el-pagination {
            padding: 20px 50px;
            text-align: right;
        }
    }
}

</style>
