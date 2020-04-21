<template>
  <div id="showContainer">
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item  label="演出片区" >
        <el-select
          v-model="value"
          placeholder="演出片区"
          clearable
          class="filter-item"
          style="width: 240px"
          @change="getParkItem"
        >
          <el-option v-for="item in parkList" :key="item.id" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="getDateRange"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchShow">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tableContainer">
      <el-table
        :data="perFormTable"
        style="width: 100%"
        border
        empty-text="暂无数据"
        @row-dblclick="handleDbClick"
      >
        <el-table-column prop="performName" label="演出名称" align="center"></el-table-column>
        <el-table-column prop="performTime" label="演出场次" align="center"></el-table-column>
        <el-table-column prop="performDate" label="演出日期" align="center"></el-table-column>
        <el-table-column prop="locationName" label="剧院名称" align="center"></el-table-column>
        <el-table-column prop="locationCode" label="剧院编码" align="center"></el-table-column>
        <el-table-column prop="auditFlag" label="审核标志" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.auditFlag == 1" type="success" size="mini">已审核</el-tag>
            <el-tag v-if="scope.row.auditFlag == 2" type="danger" size="mini">未审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sceneId" label="场次ID" align="center"></el-table-column>
      </el-table>
    </div>
    <Seat v-if="showSeat" :show="showSeat" :id="this.parkId" :code="performCode" @close="closeSeatDialog"></Seat>
  </div>
</template>

<script>
import { getParkList, getPerformList } from '../../api/query'
import Seat from './components/seat'
// 获取新的时间(2019.4.12）
const date = new Date()
// 获取当前时间的年份转为字符串
const year = date.getFullYear().toString() // '2019'
// 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
// 获取天，判断是否小于10，如果是在字符串前面拼接'0'
const da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'

const start = year + '-' + month + '-' + da
const end = year + '-' + month + '-' + da
export default {
  data() {
    return {
      parkList: [], // 景区列表
      value: '', // 选中的景区
      performCode: '', // 场次编码
      showSeat: false, // 显示线下库存查询弹窗
      parkId: '', // 景区ID,
      dateArr: [start, end], // 日期选择数组
      startStr: '', // 起始时间字符串
      endStr: '', // 结束时间字符串
      perFormTable: null,
      total: 0,
      currentPage: 1,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  components: {
    Seat
  },
  methods: {
    init() {
      const data = { 'theater': true }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.parkList = res.data.data
        this.value = this.parkList[0].name
        this.parkId = this.parkList[0].id
        this.getPerForm()
      })
    },
    getPerForm() {
      this.startStr = this.dateArr[0]
      this.endStr = this.dateArr[1]
      const dataForm = {
        endDate: this.endStr,
        id: this.parkId,
        startDate: this.startStr
      }
      getPerformList(dataForm).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.perFormTable = res.data.data
      })
    },

    // 选择景区，获取景区ID
    getParkItem(item) {
      this.perFormTable = null
      for (let i = 0; i < this.parkList.length; i++) {
        if (item === this.parkList[i].name) {
          this.value = item
          this.parkId = this.parkList[i].id
        }
      }
      this.getPerForm()
    },
    // 选择时间，获取查询时间段
    getDateRange(date) {
      this.perFormTable = null
      this.dateArr = date
    },
    searchShow() {
      this.getPerForm()
    },
    // 双击表格某一行
    handleDbClick(row, column, event) {
      this.performCode = row.performCode
      this.showSeat = true
    },
    // 关闭弹窗
    closeSeatDialog() {
      this.showSeat = false
    }
  }
}
</script>

<style scoped lang="scss">
#showContainer {
  padding: 30px;
  .tableContainer {
    margin-top: 30px;
  }
}
</style>
