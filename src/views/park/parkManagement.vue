<template>
    <div class="park">
        <div class="toolbar">
            <el-input
                class="park-input"
                placeholder="请输入景区ID"
                v-model="parkId"
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
                    :data="parkList"
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
        <append-park :show="showAppendForm" @changeAppendShow="changeAppendShow" @handleSuccess="refresh"></append-park>
        <update-park :show="showUpdateForm" @changeUpdateShow="changeUpdateShow" :parkInfo="parkInfo"></update-park>
    </div>
</template>

<script>
import{ getParkList,getParkById } from'@/api/query'
import AppendPark from './components/appendPark'
import UpdatePark from './components/updatePark'
export default {
    name:'park',
    data(){
        return {
            parkId:"",
            parkList:[],
            parkInfo:{},
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

        },
        //点击全选
        handleSelectionChange(){

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
        handleDeleteSingle(){

        },
        changeAppendShow(){
            this.showAppendForm = false
        },
        changeUpdateShow(){
            this.showUpdateForm = false
        },
        refresh(){
            this.getParkList();
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