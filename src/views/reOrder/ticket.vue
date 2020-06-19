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
        <el-input
        placeholder="请输入供应商名称"
        v-model="paramForm.supplyName"
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
        <el-button type="primary" v-if="$store.getters.button.includes('reOrder:ticket:save')" @click="addTicket">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" v-if="$store.getters.button.includes('reOrder:ticket:delete')" @click="handleDeleteMore">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" v-if="$store.getters.button.includes('reOrder:ticket:updateInventory')" @click="updateInventoryMore">更新库存</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  v-if="$store.getters.button.includes('reOrder:ticket:updateUseDate')" @click="showDatePicker">修改使用日期</el-button>
      </el-form-item>
    </el-form>
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
          <el-table-column prop="code" label="票型编码" align="center" width="200"></el-table-column>
          <el-table-column prop="name" label="票型名称" align="center" width="200"></el-table-column>
          <el-table-column prop="purchasePrice" label="采购价" align="center" ></el-table-column>
          <el-table-column prop="finalSum" label="结算价" align="center" ></el-table-column>
          <el-table-column prop="buyToday" label="当天是否可预约" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.buyToday== true" type="success" size="mini">是</el-tag>
              <el-tag v-if="scope.row.buyToday== false" type="danger" size="mini">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="containShow" label="是否包含演出票" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.containShow== true" type="success" size="mini">是</el-tag>
              <el-tag v-if="scope.row.containShow== false" type="danger" size="mini">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="bookingDay" label="可预约当天购票日期" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.bookingDay== true" type="success" size="mini">是</el-tag>
              <el-tag v-if="scope.row.bookingDay== false" type="danger" size="mini">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="useStartDate" label="使用开始时间" align="center"  width="150"></el-table-column>
          <el-table-column prop="useEndDate" label="使用结束时间" align="center" width="150"></el-table-column>
          <el-table-column prop="beforeUseDay" label="提前使用天数" align="center"></el-table-column>
          <el-table-column prop="afterUseDay" label="延迟使用天数" align="center"></el-table-column>
          <el-table-column prop="useType" label="时间类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.useType== true" >绝对时间</span>
              <span v-if="scope.row.useType== false" >相对时间</span>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" align="center"></el-table-column>
          <el-table-column prop="supplyName" label="供应商" align="center" ></el-table-column>
          <el-table-column fixed="right"  width="200"  label="操作" align="center"  >
            <template slot-scope="scope">
              <el-button type="text" v-if="$store.getters.button.includes('reOrder:ticket:update')" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
              <el-button type="text" v-if="$store.getters.button.includes('reOrder:ticket:delete')" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
              <el-button type="text" v-if="$store.getters.button.includes('reOrder:ticket:priceDate')" size="small" @click="priceDate(scope.row.code)">价格日历</el-button>
              <el-button type="text" v-if="$store.getters.button.includes('reOrder:ticket:updateInventory')" size="small" @click="updateInventorySingle(scope.row.id)">更新库存</el-button>
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
      <el-form ref="addTicketForm" :model="ticketForm" :rules="ticketFormRules" label-width="180px">
        <el-form-item label="票型编码" prop="code">
          <el-input v-model="ticketForm.code" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="票型名称" prop="name">
          <el-input v-model="ticketForm.name" type="text" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="城市" prop="city">
          <el-input v-model="ticketForm.city" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplyName">
          <el-input v-model="ticketForm.supplyName" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input v-model="ticketForm.purchasePrice" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结算金额" prop="finalSum">
          <el-input v-model="ticketForm.finalSum" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否当天预约" prop="buyToday">
          <el-radio v-model="ticketForm.buyToday" :label="true">是</el-radio>
          <el-radio v-model="ticketForm.buyToday" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否包含演出票" prop="containShow">
          <el-radio v-model="ticketForm.containShow" :label="true">是</el-radio>
          <el-radio v-model="ticketForm.containShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="可预约当天购票日期" prop="bookingDay">
          <el-radio v-model="ticketForm.bookingDay" :label="true">是</el-radio>
          <el-radio v-model="ticketForm.bookingDay" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="使用时间类型" prop="useType">
          <el-radio-group v-model="ticketForm.useType" @change="radioChange">
            <el-radio  :label="true">绝对使用时间</el-radio>
            <el-radio  :label="false">相对使用时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用开始时间" prop="useStartDate" v-if="ticketForm.useType === true">
          <el-date-picker
            v-model="ticketForm.useStartDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="useEndDate" v-if="ticketForm.useType === true">
          <el-date-picker
            v-model="ticketForm.useEndDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="提前使用天数" prop="beforeUseDay" v-if="ticketForm.useType === false">
          <el-input-number v-model="ticketForm.beforeUseDay"></el-input-number><span style="margin-left:10px">天</span>
        </el-form-item>
        <el-form-item label="延迟使用天数" prop="afterUseDay" v-if="ticketForm.useType === false">
          <el-input-number v-model="ticketForm.afterUseDay" ></el-input-number><span style="margin-left:10px">天</span>
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
      <el-form ref="updateTicketForm" :model="ticketDetial" :rules="ticketDetialRules" label-width="180px">
        <el-form-item label="票型编码" prop="code">
          <el-input v-model="ticketDetial.code" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="票型名称" prop="name">
          <el-input v-model="ticketDetial.name" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="ticketDetial.city" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplyName">
          <el-input v-model="ticketDetial.supplyName" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="采购价" prop="purchasePrice">
          <el-input v-model="ticketDetial.purchasePrice" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结算金额" prop="finalSum">
          <el-input v-model="ticketDetial.finalSum" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否当天预约" prop="buyToday">
          <el-radio v-model="ticketDetial.buyToday" :label="true">是</el-radio>
          <el-radio v-model="ticketDetial.buyToday" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否包含演出票" prop="containShow">
          <el-radio v-model="ticketDetial.containShow" :label="true">是</el-radio>
          <el-radio v-model="ticketDetial.containShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="可预约当天购票日期" prop="bookingDay">
          <el-radio v-model="ticketDetial.bookingDay" :label="true">是</el-radio>
          <el-radio v-model="ticketDetial.bookingDay" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="使用时间类型" prop="useType">
          <el-radio-group v-model="ticketDetial.useType" @change="radioChange">
              <el-radio  :label="true">绝对使用时间</el-radio>
              <el-radio  :label="false">相对使用时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用开始时间" prop="useStartDate" v-if="ticketDetial.useType === true">
          <el-date-picker
            v-model="ticketDetial.useStartDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="useEndDate" v-if="ticketDetial.useType === true">
          <el-date-picker
            v-model="ticketDetial.useEndDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="提前使用天数" prop="beforeUseDay" v-if="ticketDetial.useType === false">
          <el-input-number v-model="ticketDetial.beforeUseDay"></el-input-number><span style="margin-left:10px">天</span>
        </el-form-item>
        <el-form-item label="延迟使用天数" prop="afterUseDay" v-if="ticketDetial.useType === false">
          <el-input-number v-model="ticketDetial.afterUseDay" ></el-input-number><span style="margin-left:10px">天</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdateSubmit">确定</el-button>
          <el-button @click="handleUpdateCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 价格日历 -->
    <el-dialog title="价格日历" :visible.sync="calendarVisible" :close-on-click-modal="false">
          <el-calendar>
              <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
              <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="checkTime(data.day) ? 'is-selected' : ''">
                  {{ data.day.split('-').slice(1).join('-') }}
                  {{checkTime(data.day) ? '✔️' : ''}}
                </p>
              </template>
          </el-calendar>
    </el-dialog>

    <!-- 日期选择 -->
    <el-dialog
      title="修改使用日期"
      :visible.sync="datePickerVisible"
      :close-on-click-modal="false"
      @close="closeDatePickerDialog">
      <el-form  :mode="selectForm"  ref="selectForm"  label-width="80px">
        <el-form-item label="开始时间">
            <el-date-picker
              v-model="selectForm.useStartDate"
              align="right"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              >
            </el-date-picker>
        </el-form-item>
          <el-form-item label="结束时间" prop="useEndDate">
              <el-date-picker
                v-model="selectForm.useEndDate"
                align="right"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="票型名称">
              <el-select
                v-model="selectForm.selectValue"
                multiple
                filterable
                remote
                :reserve-keyword="false"
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width:60%"
                >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="datePickerVisible = false">取 消</el-button>
          <el-button type="primary" @click="pickerSubmit">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addReTicket,
  getTicketList,
  deleteTicket,
  getTicketDetail,
  updateTicket,
  getByCodeTicketCalendar,
  updateInventory,
  batchUpdateTicket
} from '../../api/reOrder'
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
      dialogFormVisible: false,
      updatedialogFormVisible: false,
      calendarVisible: false,
      datePickerVisible: false,
      ticketList: [],
      restaurants: [],
      calendarDate: [],
      ticketForm: {
        code: '',
        name: '',
        city: '',
        buyToday: true,
        containShow: true,
        bookingDay: true,
        useType: true,
        beforeUseDay: 0,
        afterUseDay: 0,
        useStartDate: '',
        useEndDate: '',
        purchasePrice: '',
        finalSum: '',
        supplyName: ''
      },
      ticketFormRules: {
        code: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        supplyName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        useStartDate: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        useEndDate: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        beforeUseDay: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        afterUseDay: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        purchasePrice: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        finalSum: [
          { validator: checkPrice, trigger: 'blur' }
        ]
      },
      ticketDetial: {},
      ticketDetialRules: {
        code: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        supplyName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        useStartDate: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        useEndDate: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        beforeUseDay: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        afterUseDay: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        purchasePrice: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        finalSum: [
          { validator: checkPrice, trigger: 'blur' }
        ]
      },
      paramForm: {
        code: '',
        name: '',
        supplyName: '',
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      rowIdList: [],
      total: 0,
      currentPage: 1,
      dataPickerValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      selectForm: {
        useStartDate: new Date(),
        useEndDate: '',
        selectValue: []
      },
      options: {},
      loading: false,
      list: []
    }
  },
  created() {
    this.getTicketList(this.paramForm)
  },
  methods: {
    // 点击新增按钮
    addTicket() {
      this.dialogFormVisible = true
      this.ticketForm = {
        code: '',
        name: '',
        buyToday: true,
        containShow: true,
        useType: true,
        bookingDay: true,
        beforeUseDay: 0,
        afterUseDay: 0,
        useStartDate: '',
        useEndDate: ''
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
      if (data.supplyName === '') {
        delete data.supplyName
      }
      getTicketList(data).then(res => {
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
      const _this = this
      this.$refs.addTicketForm.validate(valid => {
        if (valid) {
          if (this.ticketForm.useType === false) {
            delete this.ticketForm.useStartDate
            delete this.ticketForm.useEndDate
          }
          addReTicket(this.ticketForm).then(res => {
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
      this.paramForm.page.pageNum = 0
      this.paramForm.page.pageSize = 10
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
        deleteTicket(this.rowIdList).then(res => {
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
        deleteTicket([id]).then(res => {
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
      getTicketDetail(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.updatedialogFormVisible = true
        this.ticketDetial = res.data.data
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
    // 修改区域确定按钮
    handleUpdateSubmit() {
      this.$refs.updateTicketForm.validate(valid => {
        if (valid) {
          if (this.ticketDetial.useType === false) {
            delete this.ticketDetial.useStartDate
            delete this.ticketDetial.useEndDate
          }
          updateTicket(this.ticketDetial).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.error)
            }
            this.updatedialogFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getTicketList(this.paramForm)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改区域取消按钮
    handleUpdateCancel() {
      this.updatedialogFormVisible = false
    },
    // 清空搜索框
    handleClear() {
      this.paramForm.page.pageNum = 0
      this.paramForm.page.pageSize = 10
      this.currentPage = 1
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
    },
    // 根据code获取日历
    priceDate(code) {
      this.calendarVisible = true
      getByCodeTicketCalendar(code).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.calendarDate = res.data.data
      })
    },
    // 遍历返回的日期数据，跟日历匹配的返回true
    checkTime(data) {
      for (const i in this.calendarDate) {
        if (data === this.calendarDate[i]) {
          return true
        } else {
          continue
        }
      }
    },
    // 单行更新库存
    updateInventorySingle(id) {
      updateInventory([id]).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.$message.success('更新库存成功')
      })
    },
    // 批量更新库存
    updateInventoryMore() {
      if (this.rowIdList.length === 0) {
        return this.$message.error('请先选择要更新的选项！')
      }
      updateInventory(this.rowIdList).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.$message.success('更新库存成功')
      })
    },
    // 批量更改使用时间弹框的确认提交
    pickerSubmit() {
      const data = {
        ids: this.selectForm.selectValue,
        useEndDate: this.selectForm.useEndDate,
        useStartDate: this.selectForm.useStartDate
      }
      if (data.useEndDate === '') {
        return this.$message.error('请选择结束日期')
      }
      if (data.ids.length === 0) {
        return this.$message.error('请选择票型名称')
      }
      if (typeof (data.useStartDate) === 'object') {
        const year = data.useStartDate.getFullYear()
        const month = (data.useStartDate.getMonth() + 1) > 9 ? (data.useStartDate.getMonth() + 1) : '0' + (data.useStartDate.getMonth() + 1)
        const day = data.useStartDate.getDate() > 9 ? data.useStartDate.getDate() : '0' + data.useStartDate.getDate()
        data.useStartDate = year + '-' + month + '-' + day
      }
      batchUpdateTicket(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.$message.success('修改成功')
        this.datePickerVisible = false
        this.getTicketList(this.paramForm)
      })
    },
    // 显示日期选择框
    showDatePicker() {
      this.datePickerVisible = true
      const data = {
        page: {
          pageNum: 0,
          pageSize: 1000
        }
      }
      getTicketList(data).then(res => {
        const data = res.data.data.data
        this.list = data.map(item => {
          return { value: item.id, label: item.name }
        })
      })
    },
    // 远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    // 关闭 修改使用日期弹框后，初始化数据
    closeDatePickerDialog() {
      this.selectForm.selectValue = []
      this.selectForm.useStartDate = new Date()
      this.selectForm.useEndDate = ''
    },
    // 使用时间类型改变时执行
    radioChange(value) {
      if (value) {
        this.ticketForm.beforeUseDay = 0
        this.ticketForm.afterUseDay = 0
        this.ticketDetial.beforeUseDay = 0
        this.ticketDetial.afterUseDay = 0
      } else {
        this.ticketForm.useStartDate = ''
        this.ticketForm.useEndDate = ''
        this.ticketDetial.useStartDate = ''
        this.ticketDetial.useEndDate = ''
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
  .is-selected {
    color: red
  }
  .detailTable {
    margin-top: 30px;
  }
}
</style>
