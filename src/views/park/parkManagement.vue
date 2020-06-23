<template>
    <div class="park">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="是否包含剧院">
              <el-select v-model="theater" placeholder="请选择" clearable @clear="handleClear">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="景区名称" >
                    <el-input v-model.trim="name" placeholder="请输入景区名称" clearable @clear="handleClear"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-if="$store.getters.button.includes('park:parkManagement:save')" @click="appendPark">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" v-if="$store.getters.button.includes('park:parkManagement:update')" @click="deleteAllPark">删除</el-button>
            </el-form-item>
        </el-form>
        <div class="parkList-table">
                <el-table
                    ref="multipleTable"
                    :data="parkList"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="景区名称" align="center"></el-table-column>
                    <el-table-column prop="url" label="景区链接" align="center"></el-table-column>
                    <el-table-column prop="id" label="景区ID" align="center" width="200"></el-table-column>
                    <el-table-column prop="theater" label="是否包含剧院" align="center" width="150">
                        <template slot-scope="scope">
                            <span v-if="scope.row.theater == true">是</span>
                            <span v-if="scope.row.theater == false">否</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="$store.getters.button.includes('park:parkManagement:update')" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" v-if="$store.getters.button.includes('park:parkManagement:delete')" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                            <el-button type="text"  v-if="$store.getters.button.includes('park:parkManagement:QRCode')" size="small" @click="QRCode(scope.row.id)">景区座位二维码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </div>
        <append-park
            :show="showAppendForm"
            @changeAppendShow="changeAppendShow"
            @handleAppendSuccess="refresh"
        ></append-park>
        <update-park
            :show="showUpdateForm"
            @changeUpdateShow="changeUpdateShow"
            @handleUpdateSuccess="refresh"
            :parkInfo="parkInfo"
        ></update-park>
        <!-- 二维码 -->
        <el-dialog
          title="二维码"
          :visible.sync="QRCodeVisible"
          :close-on-click-modal="false"
          @close="closeQRCode"
          @opened="showQRCode"
          >
            <div id="qrcode"></div>
        </el-dialog>
    </div>
</template>

<script>
import { getParkList, getParkById } from '@/api/query'
import { deletePark } from '@/api/park'
import AppendPark from './components/appendPark'
import UpdatePark from './components/updatePark'
import QRCode from 'qrcodejs2'
export default {
  name: 'Park',
  data() {
    return {
      parkList: [],
      parkInfo: {},
      rowIdList: [],
      showAppendForm: false,
      showUpdateForm: false,
      QRCodeVisible: false,
      theater: '',
      name: '',
      parkId: '',
      options: [
        {
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }
      ]
    }
  },
  components: {
    AppendPark,
    UpdatePark
  },
  mounted() {
    this.getParkList()
  },
  methods: {
    // 获取景区列表
    getParkList() {
      const data = {
        theater: this.theater,
        name: this.name
      }
      for (const key in data) {
        if (data[key] === '' || data[key] === null) {
          delete data[key]
        }
      }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.parkList = res.data.data
      })
    },
    // 点击搜索执行
    search() {
      this.getParkList()
    },
    // 点击新增按钮
    appendPark() {
      this.showAppendForm = true
    },
    // 点击头部删除按钮
    deleteAllPark() {
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
        this.deletePark(this.rowIdList)
      }).catch(() => {
        return
      })
    },
    // 点击全选
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 点击修改执行
    handleUpdate(id) {
      this.showUpdateForm = true
      getParkById(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.parkInfo = res.data.data
      })
    },
    // 每行的删除按钮
    handleDeleteSingle(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePark([id])
      }).catch(() => {
        return
      })
    },
    // 关闭新增框
    changeAppendShow() {
      this.showAppendForm = false
    },
    // 关闭修改框
    changeUpdateShow() {
      this.showUpdateForm = false
    },
    // 刷新列表
    refresh() {
      this.getParkList()
    },
    // 删除景区
    deletePark(data) {
      deletePark(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    handleClear() {
      this.getParkList()
    },
    // 二维码
    QRCode(id) {
      this.QRCodeVisible = true
      this.parkId = id
    },
    // 关闭二维码
    closeQRCode() {
      this.QRCodeVisible = false
    },
    showQRCode() {
      document.getElementById('qrcode').innerHTML = ''
      new QRCode('qrcode', {
        text: `${process.env.VUE_APP_BASE_API}/parkOrder/${this.parkId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.park{
    padding:30px;
    .park-input{
        width:300px;
        margin-right:20px;
    }
    .parkList-table{
        margin-top:30px;
    }
    .el-dialog__body{
      #qrcode{
        /deep/ img{
          width:300px;
          height:300px;
          margin:0 auto;
        }
      }
    }
}

</style>
