<template>
    <div class="append">
        <el-dialog 
            title="修改剧院" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form 
                :model="theaterInfo" 
                ref="appendForm"
                >
                <el-form-item label="剧院名称"  prop="name" label-width="100px">
                    <el-input v-model="theaterInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剧院编码名称"  prop="name" label-width="100px">
                    <el-input v-model="theaterInfo.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剧院ID"  prop="name" label-width="100px">
                    <el-input v-model="theaterInfo.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="景区名称"  prop="name" label-width="100px">
                    <el-input v-model="theaterInfo.parkName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="景区ID"  prop="url" label-width="100px">
                    <el-input v-model="theaterInfo.parkId" autocomplete="off"></el-input>
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
import {updateTheater} from '@/api/theater'
export default {
    name:'UpdateTheater',
    props:{
        theaterInfo:Object,
        show:Boolean
    },
    data(){
        return {
            dialogFormVisible:false
        }
    },
    created(){
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
                id: this.theaterInfo.id,
                name: this.theaterInfo.name,
                code:this.theaterInfo.url,
                parkId:this.theaterInfo.parkId,
                parkName:this.theaterInfo.parkName
            }
            updateTheater(data).then(res=>{
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