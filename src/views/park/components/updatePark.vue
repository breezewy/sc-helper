<template>
    <div class="append">
        <el-dialog 
            title="修改景区" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form 
                :model="parkInfo" 
                ref="appendForm"
                >
                <el-form-item label="景区名称"  prop="name" label-width="120px">
                    <el-input v-model="parkInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="景区链接"  prop="url" label-width="120px">
                    <el-input v-model="parkInfo.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否包含剧院" label-width="120px" prop="theater">
                    <el-radio-group v-model="parkInfo.theater">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {updatePark} from '@/api/park'
export default {
    name:'UpdatePark',
    props:{
        parkInfo:Object,
        show:Boolean
    },
    data(){
        return {
            dialogFormVisible:false
        }
    },
    mounted(){
        this.dialogFormVisible = this.show
    },
    watch:{
        show(newVal,oldVal){
            this.dialogFormVisible = newVal
        }
    },
    methods:{
        closeDialog(){
            this.$emit('changeUpdateShow')
        },
        handleSubmit(){
            let data = {
                id: this.parkInfo.id,
                name: this.parkInfo.name,
                theater:this.parkInfo.theater,
                url:this.parkInfo.url
            }
            updatePark(data).then(res=>{
                if(res.data.code != 200){
                    return this.$message.error(res.data.error);
                }
                this.$message.success('操作成功');
                this.$emit('handleUpdateSuccess')
                this.dialogFormVisible = false
            })
        },
        close(){
            this.dialogFormVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>