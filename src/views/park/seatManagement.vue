<template>
    <div class="park">
        <div class="toolbar">
            <el-input
                class="park-input"
                placeholder="请输入ID"
                v-model="id"
                suffix-icon="el-icon-edit"
            ></el-input>
            <el-input
                class="park-input"
                placeholder="请剧院ID"
                v-model="theaterId"
                suffix-icon="el-icon-edit"
            ></el-input>
            <el-button @click="search">查询</el-button>
            <el-button type="primary" @click="appendPark">新增</el-button>
            <el-button type="danger" @click="deleteAllPark">删除</el-button>
        </div>
        <div class="parkList-table">
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
                    <el-table-column prop="name" label="景区名称" align="center"></el-table-column>
                    <el-table-column prop="url" label="景区链接" align="center"></el-table-column>
                    <el-table-column prop="id" label="景区ID" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
        </template>
        </div>
        <append-park 
            :show="showAppendForm" 
            @changeAppendShow="changeAppendShow" 
            @handleAppendSuccess="refresh"
        ></append-park>
        <update-park 
            :show="showUpdateForm" 
            @changeUpdateShow="changeUpdateShow" 
            @handleUpdateSuccess="refresh" 
            :parkInfo="parkInfo"
        ></update-park>
    </div>
</template>

<script>
import { getSeatList,getParkById} from'@/api/query'
import { deletePark } from '@/api/park'
import AppendPark from './components/appendPark'
import UpdatePark from './components/updatePark'
export default {
    name:'park',
    data(){
        return {
            id:"",
            theaterId:"",
            seatList:[],
            parkInfo:{},
            rowIdList:[],
            showAppendForm:false,
            showUpdateForm:false
        }
    },
    components:{
        AppendPark,
        UpdatePark
    },
    mounted(){
        this.getParkList();
    },
    methods:{
        //获取景区列表
        getParkList(){
            getParkList().then(res=>{
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.parkList = res.data.data
            })
        },
        //点击搜索执行
        search(){
            getParkById(parseInt(this.parkId)).then(res=>{
                this.parkList = [];
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.parkInfo = res.data.data
                this.parkList.push (this.parkInfo)
            })
        },
        //点击新增按钮
        appendPark(){
            this.showAppendForm = true;
        },
        //点击头部删除按钮
        deleteAllPark(){
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
                this.deletePark(this.rowIdList);
            }).catch(() => {
                return          
            }); 
        },
        //点击全选
        handleSelectionChange(selection){
            this.rowIdList = [];
            for (let i = 0; i < selection.length; i++) {
                this.rowIdList.push(selection[i].id);
            }
            console.log(this.rowIdList)
        },
        //点击修改执行
        handleUpdate(id){
            this.showUpdateForm = true;
            getParkById(id).then(res=>{
                if(res.data.code !== 200){
                    return this.$message.error(res.data.error);
                }
                this.parkInfo = res.data.data
            })
        },
        //每行的删除按钮
        handleDeleteSingle(id){
            this.$confirm('确定要删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
            }).then((id) => {
                this.deletePark([id])
            }).catch(() => {
                return          
            }); 
           
        },
        //关闭新增框
        changeAppendShow(){
            this.showAppendForm = false
        },
        //关闭修改框
        changeUpdateShow(){
            this.showUpdateForm = false
        },
        //刷新列表
        refresh(){
            this.getParkList();
        },
        //删除景区
        deletePark(idList){
            deletePark(idList).then(res=>{
                console.log(res)
                if (res.data.code != 200) {
                    return this.$message.error(res.data.error);
                }
                this.getParkList();
                this.$message({
                    message: "操作成功",
                    type: "success"
                });
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.park{
    padding:30px;
    .park-input{
        width:300px;
        margin-right:20px;
    }
    .parkList-table{
        margin-top:30px;
    }
}
    
</style>