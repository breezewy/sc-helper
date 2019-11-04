<template>
    <div class="appendSeat">
        <el-dialog 
            title="修改席位" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form 
                :model="seatInfo" 
                ref="appendForm"
                >
                <el-form-item label="席位编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="seatInfo.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="席位名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="seatInfo.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剧院编码" :label-width="formLabelWidth" prop="theaterCode">
                    <el-input v-model="seatInfo.theaterCode" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="剧院ID" :label-width="formLabelWidth" prop="theaterCode">
                    <el-input v-model="seatInfo.theaterId" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="剧院名称" :label-width="formLabelWidth" prop="theaterName">
                    <el-input v-model="seatInfo.theaterName" autocomplete="off"></el-input>
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
import {updateSeat} from '@/api/seat'
export default {
    name:"UpdateSeat",
    props:{
        seatInfo:Object,
        show:Boolean
    },
    data(){
        return {
            dialogFormVisible:false,
            formLabelWidth:"100px"
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
        handleSubmit(){
            let data = {
                code:this.seatInfo.code,
                id: this.seatInfo.id,
                name: this.seatInfo.name,
                theaterCode:this.seatInfo.theaterCode,
                theaterId:this.seatInfo.theaterId,
                theaterName:this.seatInfo.theaterName
            }
            updateSeat(data).then(res=>{
                if(res.data.code != 200){
                    return this.$message.error(res.data.error);
                }
                this.$message.success('操作成功');
                this.$emit('handleUpdateSuccess')
                this.dialogFormVisible = false
            })
        },
        closeDialog(){
            this.$emit('changeUpdateShow')
        }
    }
}
</script>