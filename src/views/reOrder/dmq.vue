<template>
  <div id="container">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item>
        <el-input
        placeholder="请输入票型编码"
        v-model="paramForm.code"
        class="inputArea"
        suffix-icon="el-icon-edit"
        clearable
        @clear="handleClear"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="paramForm.name"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入票型名称"
          clearable
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addDmq">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleDeleteMore">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleReDmqExport">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="dmq">
      <div class="tableContainer">
        <template>
          <el-table
            ref="multipleTable"
            :data="ticketList"
            empty-text="暂无数据"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="type" label="票型类型" align="center" width="150">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type==1" size="mini">单选票</el-tag>
                <el-tag v-if="scope.row.type==2" type="warning" size="mini">多选票</el-tag>
                <el-tag v-if="scope.row.type==3" type="success" size="mini">通玩票</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="票型编码" align="center"  width="300"></el-table-column>
            <el-table-column prop="name" label="票型名称" align="center" ></el-table-column>
            <el-table-column prop="purchasePrice" label="采购价" align="center" ></el-table-column>
            <el-table-column prop="finalSum" label="结算金额" align="center" ></el-table-column>
            <el-table-column label="操作" align="center" width="300" fix="right">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                <el-button type="text" size="small" @click="handleController(scope.row.id)">关联预约票</el-button>
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
      <!-- 点击新增出现编辑区域 -->
      <el-dialog
        title="新增"
        :visible.sync="dialogFormVisible"
        class="dislog"
        :close-on-click-modal="false"
      >
        <el-form ref="addDmqForm" :model="dmqForm" :rules="dmqFormRules" label-width="120px" prop >
          <el-form-item label="票型编码" prop="code">
            <el-input v-model="dmqForm.code" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="票型名称" prop="name">
            <el-input v-model="dmqForm.name" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="采购价" prop="purchasePrice">
            <el-input v-model="dmqForm.purchasePrice"    type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结算金额" prop="finalSum">
            <el-input v-model="dmqForm.finalSum" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="票型类型" prop="type">
            <el-radio-group v-model="dmqForm.type" @change="change">
              <el-radio :label="1">单选票</el-radio>
              <el-radio :label="2">多选票</el-radio>
              <el-radio :label="3">通玩票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="多选份数" prop="number" v-if="showNumber">
            <el-input-number v-model="dmqForm.number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--点击修改出现编辑区域  -->
      <el-dialog
        title="修改"
        :visible.sync="updatedialogFormVisible"
        class="dislog"
        :close-on-click-modal="false"
      >
        <el-form ref="updateDmqForm" :model="dmqTicketDetial" :rules="dmqFormRules" label-width="120px" prop>
          <el-form-item label="票型编码" prop="code">
            <el-input v-model="dmqTicketDetial.code" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="票型名称" prop="name">
            <el-input v-model="dmqTicketDetial.name" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="采购价" prop="purchasePrice">
            <el-input v-model="dmqTicketDetial.purchasePrice" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="结算金额" prop="finalSum">
            <el-input v-model="dmqTicketDetial.finalSum" type="text" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="票型类型" prop="type">
            <el-radio-group v-model="dmqTicketDetial.type">
              <el-radio :label="1">单票</el-radio>
              <el-radio :label="2">多选票</el-radio>
              <el-radio :label="3">通玩票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最大可预约数量" prop="number" v-if="dmqTicketDetial.type == 2">
            <el-input-number v-model="dmqTicketDetial.number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateSubmit">确定</el-button>
            <el-button @click="handleUpdateCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <Controller
      v-if="showDialog"
      :show="showDialog"
      :id="dmqId"
      @close="closeDialog"
    ></Controller>
  </div>
</template>

<script>
import {
  addDmqTicket,
  getDmqTicketList,
  deleteDmqTicket,
  getDmqTicketDetail,
  updateDmqTicket,
  checkOrder,
  handleReDmqExport
} from '../../api/reOrder'
import { handleExport } from '../../utils/handleExport'
import Controller from './components/controller'
export default {
  data() {
    const checkPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('必填项不能为空'))
      } else if (!(/^(0|[1-9][0-9]*)$/.test(value))) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      showDialog: false,
      dialogFormVisible: false,
      updatedialogFormVisible: false,
      ticketList: [],
      restaurants: [],
      dmqForm: {
        code: '',
        name: '',
        type: 1,
        number: 1
      },
      dmqTicketDetial: {},
      paramForm: {
        code: '',
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      rowIdList: [],
      total: 0,
      currentPage: 1,
      dmqId: '',
      showNumber: false,
      dmqFormRules: {
        code: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必选项不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        purchasePrice: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        finalSum: [
          { validator: checkPrice, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Controller
  },
  created() {
    this.getTicketList(this.paramForm)
  },
  methods: {
    handleReDmqExport() {
      for (const key in this.paramForm) {
        if (this.paramForm[key] === '' || this.paramForm[key] === null) {
          delete this.paramForm[key]
        }
      }
      handleReDmqExport(this.paramForm).then(res => {
        if (res.data) {
          handleExport(res.data)
        }
      })
    },
    // 点击新增按钮
    addDmq() {
      this.dialogFormVisible = true
      this.dmqForm = {
        code: '',
        name: '',
        number: 1,
        type: 1
      }
    },
    // 获取票型列表
    getTicketList(data) {
      this.restaurants = []
      if (data.code === '') {
        delete data.code
      }
      if (data.name === '') {
        delete data.name
      }
      getDmqTicketList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.ticketList = res.data.data.data
        this.total = res.data.data.totalCount
        this.ticketList.forEach(item => {
          this.restaurants.push({
            value: item.name
          })
        })
      })
    },
    // 确定添加
    handleSubmit() {
      this.$refs.addDmqForm.validate(valid => {
        if (valid) {
          const _this = this
          if (this.dmqForm.type !== 2) {
            delete this.dmqForm.number
          }
          addDmqTicket(this.dmqForm).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.error)
            }
            _this.getTicketList(this.paramForm)
            this.$message.success('添加成功')
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消添加
    handleCancel() {
      this.dialogFormVisible = false
    },
    // 查询
    search() {
      this.paramData.page.pageNum = 0
      this.paramData.page.pageSize = 10
      this.getTicketList(this.paramForm)
    },
    // 头部删除按钮
    handleDeleteMore() {
      const _this = this
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
        deleteDmqTicket(this.rowIdList).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          _this.getTicketList(this.paramForm)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        return
      })
    },
    // 列表全选按钮
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 每行的删除按钮
    handleDeleteSingle(id) {
      const _this = this
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDmqTicket([id]).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          _this.getTicketList(this.paramForm)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        return
      })
    },
    // 每行的修改按钮
    handleUpdate(id) {
      getDmqTicketDetail(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.updatedialogFormVisible = true
        this.dmqTicketDetial = res.data.data
      })
    },
    // 选择列表不同页面
    handleSizeChange(val) {
      this.paramForm.page.pageSize = val
      this.getTicketList(this.paramForm)
    },
    // 选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.paramForm.page.pageNum = this.currentPage - 1
      this.getTicketList(this.paramForm)
    },
    // 修改区域确定按钮
    handleUpdateSubmit() {
      this.checkOrder(this.dmqTicketDetial)
    },
    // 修改区域取消按钮
    handleUpdateCancel() {
      this.updatedialogFormVisible = false
    },
    // 根据独木桥票型获取管理票型
    handleController(id) {
      this.dmqId = id
      this.showDialog = true
    },
    change(value) {
      if (value !== 2) {
        this.showNumber = false
        return
      }
      this.showNumber = true
    },
    // 点击修改后先验证
    checkOrder(item) {
      this.$refs.updateDmqForm.validate(valid => {
        if (valid) {
          const data = {
            code: item.code,
            type: item.type,
            id: item.id
          }
          checkOrder(data).then(res => {
            if (res.data) {
              this.$confirm('修改票型会影响已存在的订单 确定要修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if (this.dmqTicketDetial.type !== 2) {
                  delete this.dmqTicketDetial.number
                }
                updateDmqTicket(this.dmqTicketDetial).then(res => {
                  if (res.data.code !== 200) {
                    return this.$message.error(res.data.error)
                  }
                  this.updatedialogFormVisible = false
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.getTicketList(this.paramForm)
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消修改'
                })
              })
            } else {
              return
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.showDialog = false
    },
    handleClear() {
      this.getTicketList(this.paramForm)
    },
    // 模糊查询
    querySearchAsync(queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
      cb(results)
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 30px;
  .tableContainer {
    margin-top: 30px;
    .el-pagination {
      padding: 20px 50px;
      text-align: right;
    }
  }
  .detailTable {
    margin-top: 30px;
  }
}
</style>
