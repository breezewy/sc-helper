<template>
    <el-dialog
        :title="formTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        @close="close"
        >
        <el-form :model="form" :rules="rules" ref="jobForm">
            <el-form-item label="bean名称" :label-width="formLabelWidth" prop="beanName">
                <el-input v-model="form.beanName" autocomplete="off" placeholder="spring bean名称, 如: testTask"></el-input>
            </el-form-item>
            <el-form-item label="cron表达式" :label-width="formLabelWidth" prop="cronExpression">
                <el-input v-model="form.cronExpression" autocomplete="off" placeholder="如: 0 0 12 * * ?"></el-input>
            </el-form-item>
            <el-form-item label="参数" :label-width="formLabelWidth" prop="params">
                <el-input v-model="form.params" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark" width="300px">
                <el-input v-model="form.remark" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务状态" :label-width="formLabelWidth" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio :label="0">暂停</el-radio>
                    <el-radio :label="1">正常</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addJob, updateJob, getJobByID } from '@/api/sys'
export default {
  props: {
    show: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      dialogFormVisible: this.show,
      form: {
        beanName: '', // bean名称
        cronExpression: '', // cron表达式
        params: '', // 参数
        remark: '', // 备注
        status: 0 // 任务状态
      },
      rules: {
        beanName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      },
      formTitle: '新增',
      formLabelWidth: '120px'
    }
  },
  created() {
    if (this.id) {
      this.formTitle = '修改'
      this.getJobByID()
    }
  },
  methods: {
    // 新增或修改后提交
    handleSubmit() {
      this.$refs.jobForm.validate(valid => {
        if (valid) {
          if (this.id) {
            updateJob(this.form).then(res =>{
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('修改成功')
              this.dialogFormVisible = false
            })
          } else {
            addJob(this.form).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('新增成功')
              this.dialogFormVisible = false
            })
          }
        }
      })
    },
    // 弹框关闭时
    close() {
      this.$emit('close')
    },
    // 根据ID获取job信息
    getJobByID() {
      getJobByID(this.id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
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
