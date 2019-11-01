<template>
    <div class="park">
        <div class="toolbar">
            <el-cascader
                :options="options"
                :props="{ checkStrictly: true }"
                clearable>
            </el-cascader>
            <el-button @click="search">查询</el-button>
            <el-button type="primary">新增</el-button>
            <el-button type="danger">删除</el-button>
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
    </div>
</template>

<script>
import {getSeatList} from '@/api/seat'
export default {
    name:'seat',
    data(){
        return {
            seatList:[]
        }
    },
    mounted(){
        this.getSeatList()
    },
    methods:{
        search(){

        },
        getSeatList(){
            getSeatList().then(res=>{
                console.log(res)
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