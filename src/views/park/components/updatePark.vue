<template>
    <div class="append">
        <el-dialog 
            title="修改景区" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            >
            <el-form 
                :model="parkInfo" 
                ref="appendForm"
                >
                <el-form-item label="景区名称"  prop="name" label-width="100px">
                    <el-input v-model="parkInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="景区链接"  prop="url" label-width="100px">
                    <el-input v-model="parkInfo.url" autocomplete="off"></el-input>
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
export default {
    name:'UpdatePark',
    props:{
        parkInfo:Object,
        show:Boolean
    },
    date(){
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

        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>