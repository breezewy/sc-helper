<template>
    <div class="appendTheater">
        <el-dialog 
            title="新增剧院" 
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form 
                :model="form" 
                :rules="formRules"
                ref="appendForm"
                >
                <el-form-item label="景区名称" :label-width="formLabelWidth" prop="parkName" >
                    <!-- <el-input v-model="form.parkName" autocomplete="off"></el-input> -->
                    <el-select v-model="form.parkId" placeholder="请选择"  @change="getParkName">
                        <el-option
                        v-for="item in parkList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="景区ID" :label-width="formLabelWidth" prop="parkId">
                    <el-input v-model="form.parkId" autocomplete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="剧院编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="剧院名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
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
import {appendTheater} from '@/api/theater'
export default {
    name:"appendTheater",
    data(){
        return {
            dialogFormVisible:this.show,
            form:{
                code:"",
                name:"",
                parkId:"",
                parkName:""
            },
            formRules: {
                name: [
                    { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                code: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                parkId: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                parkName: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ]
            },
            formLabelWidth:"100px",
        }
    },
    props:{
        show:Boolean,
        parkList:Array
    },
    watch:{
        show(newVal,oldVal){
            this.dialogFormVisible = newVal
            this.form ={
                code:"",
                name:"",
                parkId:"",
                parkName:""
            }
        }
    },
    methods:{
        //选择景区获取到景区ID
        getParkName(value){
            this.parkList.forEach(item=>{
                if(value == item.value){
                    this.form.parkName = item.label
                }
            })
        },
        closeDialog(){
            this.$emit('changeAppendShow')
        },
        //确定新增剧院
        handleSubmit(){
            this.$refs.appendForm.validate(valid=>{
                if(valid){
                    appendTheater(this.form).then(res=>{
                    if(res.data.code != 200){
                        return this.$message.error(res.data.error);
                    }
                        this.$message.success('操作成功');
                        this.$emit('handleAppendSuccess')
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