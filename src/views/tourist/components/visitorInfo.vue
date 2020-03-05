<template>
    <div class="visitorInfo">
        <el-dialog
            title="游客详情"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            @close="close"
            >
            <el-table :data="visitorInfo" border>
                <el-table-column property="registerPark" label="登记景区名称" align="center"></el-table-column>
                <el-table-column property="registerParkAdders" label="登记景区地址" align="center"></el-table-column>
                <el-table-column property="visitorPhone" label="游客手机号" align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { getVisitorInfoById } from '@/api/tourist'
export default {
  props: {
    show: Boolean,
    id: String
  },
  data() {
    return {
      visitorInfo: [], // 游客信息
      dialogTableVisible: this.show, // 弹框是否显示
      loading: true
    }
  },
  created() {
    this.getVisitorInfoById(this.id)
  },
  methods: {
    // 获取游客信息
    getVisitorInfoById(id) {
      getVisitorInfoById(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.loading = false
        this.visitorInfo = res.data.data.visitorRecordList
      })
    },
    // 弹框关闭时通知父组件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
