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
        <append-park :show="showAppendForm" @changeShow="changeShow" @handleSuccess="refresh"></append-park>
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
            park:{},
            parkList:[],
            parkDetail:{},
            showAppendForm:false
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
        getParkList(){
            getParkList().then(res=>{
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.parkList = res.data.data
            })
        },
        search(){
            getParkById(parseInt(this.parkId)).then(res=>{
                this.parkList = [];
                if(res.data.code !== 200){
                        return this.$message.error(res.data.error);
                }
                this.park = res.data.data
                this.parkList.push (this.park)
            })
        },
        appendPark(){
            this.showAppendForm = true;
        },
        deleteAllPark(){

        },
        handleSelectionChange(){

        },
        handleUpdate(id){

        },
        handleDeleteSingle(){

        },
        changeShow(){
            this.showAppendForm = false
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