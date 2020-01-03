<template>
    <div class="rotation">
        <el-row>
            <el-col :span="24">
                <el-button type="primary" @click="handleClick">新增</el-button>
            </el-col>
        </el-row>

        <el-table
            :data="rotationList"
            :border="true"
            style="width: 100%"
        >
            <el-table-column
                prop="id"
                label="id"
                width="180"
                align="center"    
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="景区名称"
                width="180"
                align="center"        
            >
            </el-table-column>
            <el-table-column
                prop="state"
                label="景区状态"
                width="180"
                align="center"        
            >
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.state == true">显示</el-tag>
                    <el-tag type="info" v-if="scope.row.state == false">不显示</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="imgUrl"
                label="图片链接"
                align="center"        
            >
            </el-table-column>
             <el-table-column
                prop="url"
                label="项目地址"
                align="center"    
            >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="120"
                align="center" 
                >
                <template slot-scope="scope">
                    <el-button
                    @click.native.prevent="updateRow(scope.row.id)"
                    type="text"
                    size="small">
                    修改
                    </el-button>
                    <el-button
                    @click.native.prevent="deleteRow(scope.row.id)"
                    type="text"
                    size="small">
                    删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <append-rotation 
            v-if="showAppendForm"
            :show="showAppendForm"
            @close="closeDialog"
            >
        </append-rotation>

        <update-rotation
            v-if="showUpdateForm"
            :show="showUpdateForm"
            @close="closeDialog"
            :id="rowId"
        >
        </update-rotation>
    </div>
</template>

<script>
import {getRotationList,deleteRotation} from '@/api/applet'
import AppendRotation from './components/AppendRotation'
import UpdateRotation from './components/UpdateRotation'
export default {
    props:{
        show:Boolean
    },
    components:{
        AppendRotation,
        UpdateRotation
    },
    data(){
        return{
            rotationList:[],
            showAppendForm:false,
            showUpdateForm:false,
            rowId:""
        }
    },
    created(){
        this.getRotationList()
    },
    methods:{
        handleClose(){
            this.$emit('close')
        },
        getRotationList(){
            getRotationList().then(res=>{
                if(res.data.code != 200){
                    return this.$message.error(res.data.error)
                }
                this.rotationList = res.data.data
            })
        },
        handleClick(){
            this.showAppendForm = true
        },
        closeDialog(){
            this.showAppendForm = false
            this.showUpdateForm = false
            this.getRotationList()
        },
        updateRow(id){
            this.showUpdateForm = true;
            this.rowId = id;
        },
        deleteRow(id){
            this.$confirm('确定要删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteRotation([id]).then(res=>{
                    if(res.data.code != 200){
                        return this.$message.error(res.data.error)
                    }
                    this.$message.success('删除成功')
                    this.getRotationList();
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .rotation{
        padding:30px;
        .el-table{
            margin-top:30px;
        }
    }
</style>