<template>
    <div>
        <el-dialog title="修改" 
            :visible.sync="dialogFormVisible" 
            @close="handleClose"
            :close-on-click-modal="false"
            >
            <el-form :model="form"  ref="scenicInfo">
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
                 <el-form-item label="项目地址" :label-width="formLabelWidth" prop="url">
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
import {getRotationInfo,updateRotation} from '@/api/applet'
export default {
    props:{
        show:Boolean,
        id:String,
    },
    data(){
        return {
            form:{},
            dialogFormVisible:this.show,
            formLabelWidth:"80px",
        }
    },
    created(){
        this.getRotationInfo()
    },
    methods:{
        getRotationInfo(){
            getRotationInfo(this.id).then(res=>{
                if(res.data.code != 200){
                    return this.$message.error(res.data.error)
                }
                this.form = res.data.data
            })
        },
        handleClose(){
            this.$emit('close')
        },
        handleSubmit(){
            updateRotation(this.form).then(res=>{
                if(res.data.code != 200){
                    return this.$message.error(res.data.error)
                }
                this.$message.success('修改成功');
                this.dialogFormVisible = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>