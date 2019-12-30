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
                <el-form-item label="景区名称" :label-width="formLabelWidth" prop="parkId" >
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
                <el-form-item label="剧院名称" :label-width="formLabelWidth" prop="theaterName">
                    <el-select v-model="form.theaterId" placeholder="请选择"  @change="getTheaterName">
                        <el-option
                        v-for="item in theaterList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="剧院编码" :label-width="formLabelWidth" prop="theaterCode">
                    <el-input v-model="form.theaterCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="席位编码" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="form.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="席位名称" :label-width="formLabelWidth" prop="name">
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
import {appendSeat} from '@/api/seat' 
import { getParkList} from'@/api/query'
import {getTheaterByParkId} from '@/api/theater'

export default {
    name:'AppendSeat',
    props:{
        show:Boolean,
        parkList:Array
    },
    data(){
        return {
            formLabelWidth:"100px",
            theaterList:[],
            form:{
                code:"",
                name:"",
                id:"",
                theaterCode:"",
                theaterId:"",
                theaterName:"",
                parkName:"",
                parkId:""
            },
            formRules: {
                code: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                name: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                parkId:[
                {required: true, message: "必填项不能为空", trigger: "blur"}
                ],
                theaterCode: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                theaterId: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ],
                theaterName: [
                { required: true, message: "必填项不能为空", trigger: "blur" },
                ]
            },
            dialogFormVisible:this.show
        }
    },
    methods:{
        //获取剧院
        getTheaterListByParkId(id){
            getTheaterByParkId(id).then(res=>{
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                let data = res.data.data
                data.forEach( item => {
                    this.theaterList.push({
                        value:item.id,
                        label:item.name
                    })
                })
            })
        },
        getTheaterName(value){
            this.theaterList.forEach(item=>{
                if(value == item.value){
                    this.form.theaterName = item.label
                }
            })
        },
        getParkName(value){
            this.parkList.forEach(item=>{
                if(value == item.value){
                    this.form.parkName = item.label
                    this.getTheaterListByParkId(value)
                }
            })
        },
        closeDialog(){
            this.$emit('changeAppendShow')
        },
        handleSubmit(){
            this.$refs.appendForm.validate(valid=>{
                if(valid){
                    appendSeat(this.form).then(res=>{
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