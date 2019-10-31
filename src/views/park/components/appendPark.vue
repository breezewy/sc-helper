<template>
    <div class="append">
        <el-dialog 
            title="新增景区" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            >
            <el-form 
                :model="form" 
                :rules="formRules"
                ref="appendForm"
                >
                <el-form-item label="景区名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="景区链接" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
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
import {appendPark} from '../../../api/park'
export default {
    name:"AppendPark",
    props:{
        show:Boolean
    },
    created(){
        this.dialogFormVisible = this.show
    },
    watch:{
        show(newVal,oldVal){
            this.dialogFormVisible = newVal
        }
    },
    data(){
        return {
            form:{
                name:"",
                url:""
            },
            formRules: {
                name: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                url: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ]
            },
            formLabelWidth:"100px",
            dialogFormVisible:false
        }
    },
    methods:{
        closeDialog(){
            this.$emit('changeAppendShow')
        },
        handleSubmit(){
            this.$refs.appendForm.validate(valid=>{
                if(valid){
                    appendPark(this.form).then(res=>{
                    if(res.data.code != 200){
                        return this.$message.error(res.data.error);
                    }
                        this.$message.success('操作成功');
                        this.$emit('handleSuccess')
                        this.dialogFormVisible = false
                    })
                }else{
                    console.log("error submit!!");
                    return false;
                }
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
 
</style>