<template>
  <div class="park">
    <el-row>
      <el-button  type="primary" @click="addPark">新增</el-button>
    </el-row>
    <el-table
      :data="parkList"
      border
      style="width: 100%">
        <el-table-column
          prop="parkName"
          label="景区名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="parkCode"
          label="景区码"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="parkAdders"
          label="景区地址"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
          align="center"
          >
          <template slot-scope="scope">
            <el-button @click="updatePark(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
    </el-table>
    <addOrUpdatePark
      v-if="show"
      :show="show"
      :title="title"
      :id ="id"
      @close = "close"
      ></addOrUpdatePark>
  </div>
</template>

<script>
import { getParkList } from '@/api/tourist'
import addOrUpdatePark from './components/addOrUpdatePark'
export default {
  data() {
    return {
      parkList: [], // 登记景区列表
      page: { // 列表分页
        pageNum: 1,
        pageSize: 10
      },
      pageName: '', // 景区名称
      show: false, // 是否显示添加弹框
      title: '', // 点击新增还是修改
      id: '' // 景区id
    }
  },
  components: {
    addOrUpdatePark
  },
  created() {
    this.getParkList()
  },
  methods: {
    // 获取登记景区列表
    getParkList() {
      const data = {
        page: this.page,
        parkName: this.parkName
      }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.parkList = res.data.data.data
      })
    },
    // 新增登记景区
    addPark() {
      this.show = true
      this.title = '新增'
    },
    // 弹框关闭时执行的方法
    close() {
      this.show = false
      this.getParkList()
    },
    // 修改景区
    updatePark(row) {
      this.show = true
      this.title = '修改'
      this.id = row.id
    }
  }
}

</script>

<style lang="scss" scoped>
.park{
  padding:30px;
  .el-table{
    margin-top:30px;
  }
}
</style>
