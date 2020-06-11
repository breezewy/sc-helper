<template>
    <div class="editProgram">
        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="handleClose" :close-on-click-modal="false">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="节目名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input-number v-model="form.sort" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.state">
                        <el-radio :label="true">启用</el-radio>
                        <el-radio :label="false">禁用</el-radio>
                    </el-radio-group>
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
import { addProgram, getProgramInfo, updateProgram } from '@/api/program'
export default {
  name: 'EditProgram',
  props: ['show', 'id'],
  data() {
    return {
      title: '',
      dialogFormVisible: this.show,
      formLabelWidth: '120px',
      form: {
        name: '',
        sort: 0,
        state: true
      },
      rules: {
        name: [
          { required: true, message: '请输入节目名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.title = this.id ? '修改' : '新增'
    if (this.id) {
      this.getProgramInfo(this.id)
    }
  },
  methods: {
    // 关闭弹框时执行
    handleClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    // 新增或修改提交
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.id) {
            addProgram(this.form).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('新增成功')
              this.handleClose()
            })
          } else {
            const { id, name, sort, state } = this.form
            this.form = { id, name, sort, state }
            updateProgram(this.form).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('修改成功')
              this.handleClose()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取节目信息
    getProgramInfo(id) {
      getProgramInfo(id).then(res => {
        this.form = {
          ...this.form,
          ...res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
