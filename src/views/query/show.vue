<template>
  <div id="orderContainer">
    <div class="filter">
      <el-select
        v-model="value"
        placeholder="演出片区"
        clearable
        class="filter-item"
        style="width: 180px"
      >
        <el-option v-for="item in parkList" :key="item.id" :value="item.name" />
      </el-select>
      <div class="block">
        <el-date-picker
          v-model="value"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { getParkList } from "../../api/show";
export default {
  data() {
    return {
      parkList: [], //景区列表
      value: "", //选中的景区
      parkId: "", //景区ID
      dataPick: "",
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
    getParkList().then(res => {
      if (res.code != 200) {
        console.log(res);
      }
      this.parkList = res.data;
      this.value = this.parkList[0].name;
      this.id = this.parkList[0].id;
    });
  }
};
</script>


<style scoped lang="scss">
#orderContainer {
  padding: 30px;
  .filter {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .el-select {
      margin-right: 50px;
    }
    .block {
      .el-date-editor {
        .el-range-separator {
          padding: 0;
        }
      }
    }
  }
}
</style>