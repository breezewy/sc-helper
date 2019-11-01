<template>
    <div class="appendSeat">
        <el-dialog 
            title="新增席位" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form 
                :model="form" 
                :rules="formRules"
                ref="appendForm"
                >
                <el-form-item label="席位编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="席位名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剧院编码" :label-width="formLabelWidth" prop="theaterCode">
                    <el-input v-model="form.theaterCode" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="剧院ID" :label-width="formLabelWidth" prop="theaterId">
                    <el-input v-model="form.theaterId" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="剧院名称" :label-width="formLabelWidth" prop="theaterName">
                    <el-input v-model="form.theaterName" autocomplete="off"></el-input>
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
    name:'AppendSeat',
    data(){
        return {
            form:{
                code:"",
                name:"",
                theaterCode:"",
                theaterId:"",
                theaterName:""
            }
        }
    }
}
</script>