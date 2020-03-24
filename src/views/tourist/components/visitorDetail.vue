<template>
    <div class="park">
        <el-dialog
            title="踪迹详情"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            @close="close"
            >
            <el-table :data="visitorDetail" border>
                <el-table-column property="touristName" label="姓名"  align="center"></el-table-column>
                <el-table-column property="touristIdCard" label="证件号码" align="center"></el-table-column>
                <el-table-column property="touristIdType" label="证件类型" align="center">
                    <template slot-scope="scope">
                       <span v-if="scope.row.touristIdType == 0">身份证</span>
                       <span v-if="scope.row.touristIdType == 1">护照</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { getVisitorDetail } from '@/api/tourist'
export default {
  props: {
    show: Boolean,
    id: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: this.show,
      visitorDetail: []
    }
  },
  created() {
    this.getVisitorDetail(this.id)
  },
  methods: {
    // 监听到弹框关闭时执行的函数
    close() {
      this.$emit('close')
    },
    // 根据ID获取详情
    getVisitorDetail(id) {
      getVisitorDetail(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.visitorDetail = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
