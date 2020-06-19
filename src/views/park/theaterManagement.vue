<template>
    <div class="theater">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item  label="景区名称" >
              <el-select v-model="form.parkId" placeholder="请选择">
                  <el-option
                  v-for="item in parkList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
              <el-form-item  label="剧院编码" >
                <el-input v-model="form.code" placeholder="请输入剧院编码"></el-input>
              </el-form-item>
              <el-form-item  label="剧院名称">
                <el-input v-model="form.name" placeholder="请输入剧院名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="search">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="$store.getters.button.includes('park:theaterManagement:save')" @click="appendTheater">新增</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" v-if="$store.getters.button.includes('park:theaterManagement:delete')" @click="deleteAllTheater">删除</el-button>
              </el-form-item>
         </el-form>
         <div class="theaterList-table">
            <template>
                <el-table
                    ref="multipleTable"
                    :data="theaterList"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="剧院名称" align="center"></el-table-column>
                    <el-table-column prop="id" label="剧院ID" align="center"></el-table-column>
                    <el-table-column prop="code" label="剧院编码" align="center"></el-table-column>
                    <el-table-column prop="parkName" label="景区名称" align="center"></el-table-column>
                    <el-table-column prop="parkId" label="景区ID" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="300" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="$store.getters.button.includes('park:theaterManagement:update')" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" v-if="$store.getters.button.includes('park:theaterManagement:delete')" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
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
        <append-theater
            v-if="showAppendForm"
            :show="showAppendForm"
            :parkList = "parkList"
            @changeAppendShow="changeAppendShow"
            @handleAppendSuccess="refresh"
        >
        </append-theater>
        <update-theater
            :theaterInfo="theaterInfo"
            :show="showUpdateForm"
            @changeUpdateShow ="changeUpdateShow"
            @handleUpdateSuccess="refresh"
        >
        </update-theater>

    </div>
</template>

<script>
import AppendTheater from './components/appendTheater'
import UpdateTheater from './components/updateTheater'
import { getTheaterById, deleteTheater, searchTheater } from '@/api/theater'
import { getParkList } from '@/api/query'

export default {
  name: 'Theater',
  data() {
    return {
      theaterList: [],
      theaterInfo: {},
      parkList: [],
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
        parkId: ''
      },
      total: 0,
      currentPage: 1
    }
  },
  components: {
    AppendTheater,
    UpdateTheater
  },
  created() {
    this.getTheaterList()
    this.getParkList()
  },
  methods: {
    // 选择列表每页多少条数据
    handleSizeChange(val) {
      this.form.page.pageSize = val
      this.getTheaterList(this.form)
    },
    // 选择列表不同页面
    handleCurrentChange(val) {
      this.currentPage = val
      this.form.page.pageNum = this.currentPage - 1
      this.getTheaterList(this.form)
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
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    handleUpdate(id) {
      this.showUpdateForm = true
      getTheaterById(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.theaterInfo = res.data.data
      })
    },
    handleDeleteSingle(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTheater([id])
      }).catch(() => {
        return
      })
    },
    search() {
      if (this.form.parkId === '') {
        return this.$message.error('请选择景区')
      }
      if (this.form.code === '') {
        delete this.form.code
      }
      if (this.form.name === '') {
        delete this.form.name
      }
      this.form.page.pageNum = 0
      this.form.page.pageSize = 10
      searchTheater(this.form).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.theaterList = res.data.data.data
      })
    },
    appendTheater() {
      this.showAppendForm = true
    },
    deleteAllTheater() {
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
        this.deleteTheater(this.rowIdList)
      }).catch(() => {
        return
      })
    },
    changeUpdateShow() {
      this.showUpdateForm = false
    },
    changeAppendShow() {
      this.showAppendForm = false
    },
    getTheaterList() {
      for (const key in this.form) {
        if (this.form[key] === '') {
          delete this.form[key]
        }
      }
      searchTheater(this.form).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.theaterList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    deleteTheater(data) {
      deleteTheater(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    refresh() {
      this.getTheaterList()
    }
  }
}
</script>

<style lang="scss" scoped>
.theater{
    padding:30px;
    .el-button{
        margin-left:15px;
    }
    .theaterList-table{
        margin-top:30px;
        .el-pagination {
            padding: 20px 50px;
            text-align: right;
        }
    }
}

</style>
