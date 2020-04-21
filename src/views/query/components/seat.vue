<template>
    <el-dialog title="线下库存" :visible.sync="dialogTableVisible" @close="handleClose"  :close-on-click-modal="false">
        <el-table :data="seatList" border>
            <el-table-column property="areaCode" label="座位区域编码" width="150" align="center"></el-table-column>
            <el-table-column property="areaName" label="座位区域名称" width="200" align="center"></el-table-column>
            <el-table-column property="locationCode" label="剧院区域编码" align="center"></el-table-column>
            <el-table-column property="sumAreaseats" label="区域总库存" align="center"></el-table-column>
            <el-table-column property="hasBeenUsed" label="已排位库存" align="center"></el-table-column>
            <el-table-column label="剩余库存" align="center">
                <template slot-scope="scope">
                    {{scope.row.sumAreaseats - scope.row.hasBeenUsed}}
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import { getSeat } from '@/api/query'
export default {
  props: ['show', 'id', 'code'],
  data() {
    return {
      dialogTableVisible: this.show,
      seatList: []
    }
  },
  created() {
    this.getSeat()
  },
  methods: {
    getSeat() {
      getSeat(this.id, this.code).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.seatList = res.data.data
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
