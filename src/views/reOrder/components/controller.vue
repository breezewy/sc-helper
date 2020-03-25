<template>
  <el-dialog title="关联预约票" :visible.sync="outerVisible" @close="handleClose" width="70%" :close-on-click-modal="false">
    <el-row>
      <el-button type="primary" @click="addNew">新增</el-button>
      <el-button type="danger" @click="handleDeleteMore">删除</el-button>
    </el-row>
    <el-table
      class="tableContainer"
      ref="multipleTable"
      :data="tableList"
      empty-text="暂无数据"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="code" label="票型编码" align="center"></el-table-column>
      <el-table-column prop="name" width="200" label="票型名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buyToday" label="是否可当天购买" align="center" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.buyToday== true" type="success">是</el-tag>
          <el-tag v-if="scope.row.buyToday== false" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="containShow" label="是否包含演出票" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.containShow== true" type="success">是</el-tag>
          <el-tag v-if="scope.row.containShow== false" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="useStartDate" label="使用开始时间" align="center"></el-table-column>
      <el-table-column prop="useEndDate" label="使用结束时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增" :visible.sync="innerVisible" class="dialog" append-to-body :close-on-click-modal="false">
      <el-table
        ref="multipleTable"
        :data="ticketList"
        empty-text="暂无数据"
        tooltip-effect="dark"
        border
        @selection-change="SelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="code" label="票型编码" align="center"></el-table-column>
        <el-table-column prop="name" label="票型名称"  align="center" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column prop="buyToday" label="是否可当天购买" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.buyToday== true" type="success">是</el-tag>
            <el-tag v-if="scope.row.buyToday== false" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="containShow" label="是否包含演出票" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.containShow== true" type="success">是</el-tag>
            <el-tag v-if="scope.row.containShow== false" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="useStartDate" label="使用开始时间" align="center"></el-table-column>
        <el-table-column prop="useEndDate" label="使用结束时间" align="center"></el-table-column>
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
      <el-button type="primary" @click="handleAddSubmit">确定</el-button>
      <el-button @click="handleAddCancel">取消</el-button>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  deleteReTicketDmq,
  getByDmqTicketId,
  getControlTicketList,
  addReTicketDmq
} from '../../../api/reOrder'
export default {
  name: 'Controller',
  props: ['show', 'id'],
  data() {
    return {
      tableList: [], // 关联票列表
      ticketList: [], // 所有后台票列表
      dmqId: this.id, // 独木桥票型ID
      rowIdList: [], // 全选后的id列表
      addIdList: [], // 新增区域全选的id
      innerVisible: false,
      outerVisible: this.show,
      currentPage: 1,
      total: 0,
      paramForm: {
        id: this.id,
        page: {
          pageNum: 0,
          pageSize: 10
        }
      }
    }
  },
  created() {
    this.init(this.dmqId)
  },
  methods: {
    init(id) {
      getByDmqTicketId(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.tableList = res.data.data
      })
    },
    // 列表全选按钮
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    SelectionChange(selection) {
      this.addIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.addIdList.push(selection[i].id)
      }
    },
    handleDeleteMore() {
      const _this = this
      if (this.rowIdList.length === 0) {
        this.$message({
          message: '请选择删除项',
          type: 'warning'
        })
        return
      }
      deleteReTicketDmq(this.rowIdList).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        _this.init(this.dmqId)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleDeleteSingle(id) {
      const _this = this
      deleteReTicketDmq([id]).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        _this.init(this.dmqId)
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    addNew() {
      this.innerVisible = true
      this.getTicketList(this.paramForm)
    },
    getTicketList(data) {
      getControlTicketList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.ticketList = res.data.data.data
        this.total = res.data.data.totalCount
      })
    },
    // 选择列表每页多少条数据
    handleSizeChange(val) {
      this.paramForm.page.pageSize = val
      this.getTicketList(this.paramForm)
    },
    // 选择列表不同页面
    handleCurrentChange(val) {
      this.currentPage = val
      this.paramForm.page.pageNum = this.currentPage - 1
      this.getTicketList(this.paramForm)
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
