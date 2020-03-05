<template>
    <div class="park">
        <el-dialog
            :title="formTitle"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            @close="close"
            >
        <el-form :model="form" :rules="rules" ref="parkForm">
            <el-form-item label="景区名称" :label-width="formLabelWidth" prop="parkName">
                <el-input v-model="form.parkName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="景区地址" :label-width="formLabelWidth" prop="parkAdders">
                <el-input v-model="form.parkAdders" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { addPark, getParkInfoById, updatePark } from '@/api/tourist'
export default {
  props: {
    show: Boolean,
    title: String,
    id: String
  },
  data() {
    return {
      formLabelWidth: '120px',
      dialogFormVisible: this.show,
      formTitle: this.title,
      form: {
        parkAdders: '',
        parkName: ''
      },
      rules: {
        parkName: [
          { required: true, message: '请输入景区名称', trigger: 'blur' }
        ],
        parkAdders: [
          { required: true, message: '请输入景区地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.formTitle === '修改') {
      this.getParkInfoById(this.id)
    }
  },
  methods: {
    // 提交
    handleSubmit() {
      this.$refs.parkForm.validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增') {
            this.addPark()
          } else {
            this.updatePark()
          }
        } else {
          return false
        }
      })
    },
    // 监听到弹框关闭时执行的函数
    close() {
      this.$emit('close')
    },
    // 根据ID获取景区信息
    getParkInfoById(id) {
      getParkInfoById(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.form = res.data.data
      })
    },
    // 新增景区
    addPark() {
      const data = {
        parkAdders: this.form.parkAdders,
        parkName: this.form.parkName
      }
      addPark(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('添加成功')
        this.dialogFormVisible = false
      })
    },
    // 修改景区
    updatePark() {
      const data = {
        id: this.id,
        parkAdders: this.form.parkAdders,
        parkName: this.form.parkName
      }
      updatePark(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('修改成功')
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
