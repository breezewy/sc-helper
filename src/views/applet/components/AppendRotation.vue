<template>
    <div>
        <el-dialog title="新增" 
            :visible.sync="dialogFormVisible" 
            @close="handleClose"
            :close-on-click-modal="false"
            >
            <el-form :model="form" :rules="formRules" ref="scenicInfo">
                <el-form-item label="图片链接" :label-width="formLabelWidth" prop="imgUrl">
                    <el-input v-model="form.imgUrl" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片名称" :label-width="formLabelWidth" prop="name">
                     <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片排序" :label-width="formLabelWidth" prop="sort">
                     <el-input v-model="form.sort" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片状态" :label-width="formLabelWidth" prop="state">
                    <el-radio-group v-model="form.state">
                        <el-radio :label="true">显示</el-radio>
                        <el-radio :label="false">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="跳转地址" :label-width="formLabelWidth" prop="url">
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
import { appendRotation } from '@/api/applet'
export default {
    props:{
        show:Boolean
    },
    data(){
        return {
            form:{
                imgUrl:"",
                name:"",
                sort:"",
                state:true,
                url:""
            },
            formRules:{
                imgUrl:[
                    {required:true,message:'请填写图片链接',trigger:'blur'}
                ],
                name:[
                    {required:true,message:'请填写图片名称',trigger:'blur'}
                ],
                sort:[
                    {required:true,message:'请填写图片排序',trigger:'blur'}
                ],
                state:[
                    {required:true,message:'请填写图片状态',trigger:'blur'}
                ],
                url:[
                    {required:true,message:'请填写跳转地址',trigger:'blur'}
                ]
            },
            dialogFormVisible:this.show,
            formLabelWidth:"80px",
        }
    },
    methods:{
        handleClose(){
            this.$emit('close')
        },
        handleSubmit(){
            this.$refs.scenicInfo.validate(valid=>{
                if(valid){
                    appendRotation(this.form).then(res=>{
                        if(res.data.code != 200){
                            return this.$message.error(res.data.error)
                        }
                        this.$message.success('添加成功')
                        this.dialogFormVisible = false
                    })
                }
            })
           
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>