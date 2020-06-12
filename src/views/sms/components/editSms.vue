<template>
    <el-dialog
        :title="formTitle"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        @close="close"
        width="50%"
        >
        <el-form :model="form" :rules="rules" ref="smsForm" label-width="120px">
            <el-form-item label="短信模板名称"  prop="name">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="短信模板内容"  prop="content">
                <el-input  type="textarea" autosize v-model="form.content" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否包含参数">
                <el-radio-group v-model="form.variable">
                  <el-radio :label="true">包含</el-radio>
                  <el-radio :label="false">不包含</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
              v-show="form.variable"
              v-for="(param, index) in form.params"
              label="短信模板参数"
              :key="index"
              :prop="'params.' + index"
              :rules="{
                required: true, message: '参数不能为空', trigger: 'blur'
              }"
            >
              <el-input v-model="form.params[index]"></el-input><el-button @click.prevent="removeParam(param)">删除</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button @click="addDomain">新增参数</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addSmsTemplate, getSmsTemplateByID, updateSmsTemplate } from '@/api/sms'
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
        name: '', // 短信模板名称
        content: '', // 短信模板内容
        variable: true, // 是否包含参数
        params: ['']
      },
      rules: {
        name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        params: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      },
      formTitle: '新增短信模板',
      formLabelWidth: '120px'
    }
  },
  created() {
    if (this.id) {
      this.formTitle = '修改'
      this.getSmsTemplateByID()
    }
  },
  methods: {
    removeParam(item) {
      var index = this.form.params.indexOf(item)
      if (index !== -1) {
        this.form.params.splice(index, 1)
      }
    },
    addDomain() {
      this.form.params.push('')
    },
    // 新增或修改后提交
    handleSubmit() {
      this.$refs.smsForm.validate(valid => {
        if (valid) {
          if (this.formTitle === '修改') {
            this.form = {
              id: this.id,
              ...this.form
            }
            updateSmsTemplate(this.form).then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.data.error)
              }
              this.$message.success('修改成功')
              this.dialogFormVisible = false
            })
          } else {
            addSmsTemplate(this.form).then(res => {
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
    getSmsTemplateByID() {
      getSmsTemplateByID(this.id).then(res => {
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
.el-input, .el-textarea {
  width:70%;
  margin-right: 10px;
}
</style>
