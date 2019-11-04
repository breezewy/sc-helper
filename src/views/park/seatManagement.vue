<template>
    <div class="seat">
        <div class="toolbar">
            <el-cascader
                :options="options"
                :props="{ checkStrictly: true }"
                clearable
                class="seat-input"
                >
            </el-cascader>
            <el-button @click="search">查询</el-button>
            <el-button type="primary" @click="appendSeat">新增</el-button>
            <el-button type="danger" @click="deleteAllSeat">删除</el-button>
        </div>
         <div class="seatList-table">
            <template>
                <el-table
                    ref="multipleTable"
                    :data="seatList"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="席位名称" align="center"></el-table-column>
                    <el-table-column prop="id" label="席位ID" align="center"></el-table-column>
                    <el-table-column prop="code" label="席位编码" align="center"></el-table-column>
                    <el-table-column prop="theaterName" label="剧院名称" align="center"></el-table-column>
                    <el-table-column prop="theaterCode" label="剧院编码" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </template>
        </div>
        <append-seat 
            :show="showAppendForm" 
            @changeAppendShow="changeAppendShow"
            @handleAppendSuccess="refresh"
            >
        </append-seat>
        <update-seat
            :seatInfo = "seatInfo"
            :show="showUpdateForm"
            @changeUpdateShow = "changeUpdateShow"
            @handleUpdateSuccess ="refresh"
        >
        </update-seat>
    </div>
</template>

<script>
import {getSeatList,getSeatById, deleteSeat} from '@/api/seat'
import AppendSeat from './components/appendSeat'
import UpdateSeat from './components/updateSeat'
export default {
    name:'seat',
    components:{
        AppendSeat,
        UpdateSeat
    },
    data(){
        return {
            options:[],
            seatList:[],
            seatInfo:{},
            rowIdList:[],
            showAppendForm:false,
            showUpdateForm:false
        }
    },
    mounted(){
        this.getSeatList()
    },
    methods:{
        //搜索
        search(){

        },
        //获取席位列表
        getSeatList(){
            getSeatList().then(res=>{
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.seatList = res.data.data
            })
        },
        //点击全选
        handleSelectionChange(selection){
            this.rowIdList = [];
            for (let i = 0; i < selection.length; i++) {
                this.rowIdList.push(selection[i].id);
            }
        },
        //新增席位
        appendSeat(){
            this.showAppendForm = true
        },
        //头部删除席位按钮
        deleteAllSeat(){
            if (this.rowIdList.length === 0) {
                this.$message({
                message: "请选择删除项",
                type: "warning"
                });
                return;
            }
            this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
            }).then(() => {
                this.deleteSeat(this.rowIdList);
            }).catch(() => {
                return          
            }); 
        },
        handleDeleteSingle(id){
            this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
            }).then((id) => {
                this.deleteSeat([id])
            }).catch(() => {
                return          
            }); 
        },
        //关闭新增框
        changeAppendShow(){
            this.showAppendForm = false
        },
        //刷新列表
        refresh(){
            this.getSeatList()
        },
        //修改席位
        handleUpdate(id){
            this.showUpdateForm = true;
            getSeatById(id).then(res=>{
                if(res.data.code !== 200){
                    return this.$message.error(res.data.error);
                }
                this.seatInfo = res.data.data
            })
        },
        //关闭修改框
        changeUpdateShow(){
            this.showUpdateForm = false
        },

    }
}

</script>

<style lang="scss" scoped>
.seat{
    padding:30px;
    .seat-input{
        width:300px;
        margin-right:20px;
    }
    .seatList-table{
        margin-top:30px;
    }
}
   
    
</style>