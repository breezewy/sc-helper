<template>
    <div class="theater">
        <div class="toolbar">
            <el-button @click="search">查询</el-button>
            <el-button type="primary" @click="appendTheater">新增</el-button>
            <el-button type="danger" @click="deleteAllTheater">删除</el-button>
        </div>
         <div class="theaterList-table">
            <template>
                <el-table
                    ref="multipleTable"
                    :data="theaterList"
                    empty-text="暂无数据"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="name" label="剧院名称" align="center"></el-table-column>
                    <el-table-column prop="id" label="剧院ID" align="center"></el-table-column>
                    <el-table-column prop="code" label="剧院编码" align="center"></el-table-column>
                    <el-table-column prop="parkName" label="景区名称" align="center"></el-table-column>
                    <el-table-column prop="parkId" label="景区ID" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <append-theater 
            :show="showAppendForm"
            @changeAppendShow="changeAppendShow"
            @handleAppendSuccess="refresh"
        >
        </append-theater>
        <update-theater
            :theaterInfo="theaterInfo"
            :show="showUpdateForm"
            @changeUpdateShow ="changeUpdateShow"
            @handleUpdateSuccess="refresh"
        >
        </update-theater>
        
    </div>
</template>

<script>
import AppendTheater from './components/appendTheater'
import UpdateTheater from './components/updateTheater'
import {getTheaterList,getTheaterById,deleteTheater} from '@/api/theater'
export default {
    name:'theater',
    data(){
        return {
            theaterList:[],
            theaterInfo:{},
            rowIdList:[],
            showAppendForm:false,
            showUpdateForm:false
        }
    },
    components:{
        AppendTheater,
        UpdateTheater
    },
    created(){
        this.getTheaterList();
    },
    methods:{
        handleSelectionChange(selection){
            this.rowIdList = [];
            for (let i = 0; i < selection.length; i++) {
                this.rowIdList.push(selection[i].id);
            }
        },
        handleUpdate(id){
            this.showUpdateForm = true
            getTheaterById(id).then(res=>{
                if(res.data.code !== 200){
                    return this.$message.error(res.data.error);
                }
                this.theaterInfo = res.data.data
            })
        },
        handleDeleteSingle(id){
            this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
            }).then((id) => {
                this.deleteTheater([id])
            }).catch(() => {
                return          
            }); 
        },
        search(){

        },
        appendTheater(){
            this.showAppendForm = true
        },
        deleteAllTheater(){
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
                this.deleteTheater(this.rowIdList);
            }).catch(() => {
                return          
            }); 
        },
        changeUpdateShow(){
            this.showUpdateForm = false
        },
        changeAppendShow(){
            this.showAppendForm = false
        },
        getTheaterList(){
            getTheaterList().then(res=>{
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.theaterList = res.data.data
            })
        },
        refresh(){
            this.getTheaterList();
        }
    }
}
</script>

<style lang="scss" scoped>
.theater{
    padding:30px;
    .theater-input{
        width:300px;
        margin-right:20px;
    }
    .theaterList-table{
        margin-top:30px;
    }
}
 
</style>