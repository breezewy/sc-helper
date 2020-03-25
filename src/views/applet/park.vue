<template>
    <div class="file">
        <el-row>
            <el-col :span="24">
                <el-button type="primary" @click="handleClick">新增</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="parkList"
            :border="true"
            style="width: 100%"
        >
            <el-table-column
                prop="name"
                label="景区名称"
                width="180"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="state"
                label="景区状态"
                width="180"
                align="center"
            >
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.state == true" size="mini">显示</el-tag>
                    <el-tag type="info" v-if="scope.row.state == false" size="mini">不显示</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="景区排序"
                align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                prop="imgUrl"
                label="图片链接"
                align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
             <el-table-column
                prop="url"
                label="项目地址"
                align="center"
                :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="120"
                align="center"
                >
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="updateRow(scope.row.id)"
                    type="text"
                    size="small">
                    修改
                    </el-button>
                    <el-button
                    @click.native.prevent="deleteRow(scope.row.id)"
                    type="text"
                    size="small">
                    删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <append-park
            v-if="showAppendForm"
            :show="showAppendForm"
            @close="closeDialog"
        ></append-park>

        <update-park
            v-if="showUpdateForm"
            :show="showUpdateForm"
            :id="rowId"
            @close="closeDialog"
        ></update-park>

    </div>
</template>

<script>
import { getParkList, deletePrak } from '@/api/applet'
import AppendPark from './components/AppendPark'
import UpdatePark from './components/UpdatePark'
export default {
  data() {
    return {
      showAppendForm: false,
      showUpdateForm: false,
      parkList: [],
      rowId: ''
    }
  },
  components: {
    AppendPark,
    UpdatePark
  },
  created() {
    this.getParkList()
  },
  methods: {
    // 新增
    handleClick() {
      this.showAppendForm = true
    },
    // 景区列表
    getParkList() {
      getParkList().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.parkList = res.data.data
      })
    },
    // 关闭弹框
    closeDialog() {
      this.showAppendForm = false
      this.showUpdateForm = false
      this.getParkList()
    },
    // 删除
    deleteRow(id) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePrak([id]).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.$message.success('删除成功')
          this.getParkList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改
    updateRow(id) {
      this.showUpdateForm = true
      this.rowId = id
    }
  }
}
</script>

<style lang="scss" scoped>
    .file{
        padding:30px;
        .el-table{
            margin-top:30px;
        }
    }
</style>
