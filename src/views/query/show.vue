<template>
  <div id="orderContainer">
    <div class="filter">
      <div class="park">
        <span class="title">演出片区：</span>
        <el-select
          v-model="value"
          placeholder="演出片区"
          clearable
          class="filter-item"
          style="width: 180px"
          @change="getParkItem"
        >
          <el-option v-for="item in parkList" :key="item.id" :value="item.name" />
        </el-select>
      </div>
      <div class="block">
        <span class="title">日期选择：</span>
        <el-date-picker
          v-model="dateArr"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="to"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="getDateRange"
        ></el-date-picker>
      </div>
    </div>

    <div class="tableContainer">
      <el-table :data="perFormTable" style="width: 100%" border empty-text="暂无数据">
        <el-table-column prop="performName" label="演出名称" align="center"></el-table-column>
        <el-table-column prop="performTime" label="演出场次" align="center"></el-table-column>
        <el-table-column prop="performDate" label="演出日期" align="center"></el-table-column>
        <el-table-column prop="locationName" label="剧院名称" align="center"></el-table-column>
        <el-table-column prop="locationCode" label="剧院编码" align="center"></el-table-column>
        <el-table-column prop="locationCode" label="剧院编码" align="center"></el-table-column>
        <el-table-column prop="auditFlag" label="审核标志" align="center"></el-table-column>
        <el-table-column prop="sceneId" label="场次ID" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getParkList, getPerformList } from "../../api/query";
import { getDateTime } from "../../utils/formatDate";

let start = new Date();
let end = new Date();
export default {
  data() {
    return {
      parkList: [], //景区列表
      value: "", //选中的景区
      parkId: "", //景区ID,
      dateArr: [start, end], //日期选择数组
      startStr: "", //起始时间字符串
      endStr: "", //结束时间字符串
      perFormTable: null,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getParkList().then(res => {
        if (res.code != 200) {
          console.log(res);
        }
        this.parkList = res.data;
        this.value = this.parkList[0].name;
        this.parkId = this.parkList[0].id;
        this.getPerForm();
      });
    },
    getPerForm() {
      this.startStr = getDateTime(this.dateArr[0]);
      this.endStr = getDateTime(this.dateArr[1]);
      let dataForm = {
        endDate: this.endStr,
        id: this.parkId,
        startDate: this.startStr
      };
      getPerformList(dataForm).then(res => {
        if (res.code != 200) {
          console.log(res);
        }
        this.perFormTable = res.data;
      });
    },

    //选择景区，获取景区ID
    getParkItem(item) {
      this.perFormTable = null;
      for (let i = 0; i < this.parkList.length; i++) {
        if (item === this.parkList[i].name) {
          this.value = item;
          this.parkId = this.parkList[i].id;
        }
      }
      this.getPerForm();
    },

    //选择时间，获取查询时间段
    getDateRange(date) {
      this.perFormTable = null;
      this.dateArr = date;
      this.getPerForm();
    }
  }
};
</script>


<style scoped lang="scss">
#orderContainer {
  padding: 30px;
  .filter {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    border-bottom: 1px solid #dcdfe6;
    .title {
      line-height: 40px;
    }
    .el-select {
      margin-right: 50px;
    }
    .block {
      .el-date-editor {
        .el-range-separator {
          width: 7%;
        }
      }
    }
  }
  .tableContainer {
    margin-top: 30px;
  }
}
</style>