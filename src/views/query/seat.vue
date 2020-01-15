<template>
    <div id="seatContainer">
        <div class="filter">
            <div class="park">
                <span class="title">所属片区：</span>
                <el-select
                    v-model="dataForm.id"
                    placeholder="请选择所属片区"
                    clearable
                    class="filter-item"
                    style="width: 220px"
                >
                <el-option 
                    v-for="item in parkList" 
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
                </el-select>
            </div>
            <div class="orderInput">
                <span class="title">订单号：</span>
                <el-input placeholder="请输入宋城旅游订单号" v-model="dataForm.billNo" clearable ></el-input>
            </div>
            <el-button type="primary" @click="searchSeat">查询</el-button>
        </div>

        <div class="seatDetail"  v-if = "showSeatDetail">
            <el-card class="box-card">
                <h2 class="title">游客座位</h2>
                <div class="seatInfo" >
                   <div class="seatInfo-top">
                       <ul>
                           <li class="seatInfo-item">
                               <span class="seatInfo-item-content">联系人：{{seatDetail.name}}</span>
                               <span class="seatInfo-item-content">联系电话：{{seatDetail.telNo}}</span>
                           </li>
                           <li class="seatInfo-item">
                               <span class="seatInfo-item-content">演出日期：{{seatDetail.performDate}}</span>
                               <span class="seatInfo-item-content">演出场次：{{seatDetail.performTime}}</span>
                           </li>
                       </ul>
                   </div>
                   <div class="seatInfo-bottom">
                        <div class="seatInfo-bottom-content" v-for="(item,index) in this.seatDetail.detail" :key="index">
                           <p>{{item.areaName.split(' ')[0]}}</p>
                           <p>{{item.areaName.split(' ')[1]}}</p>
                           <p>{{item.row}}排{{item.col}}座</p>
                        </div>
                   </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getParkList,getOfflineOrderSeat } from "../../api/query";
export default {
    data(){
        return {
            value:'',
            parkList:[],
            dataForm:{
               id:"",  //景区ID
               billNo:""   //订单号
            },
            seatDetail:{},
            showSeatDetail:false,
            loading:true
        }
    },
    created(){
        this.init();
    },
    methods:{
        init() {
            let data  ={"theater":true}
            getParkList(data).then(res => {
                if (res.data.code != 200) {
                    return this.$message.error(res.data.msg)
                }
                let data = res.data.data
                data.forEach( item => {
                    this.parkList.push({
                        value:item.id,
                        label:item.name
                    })
                })
            })
        },
        searchSeat(){
            if(this.dataForm.id === ''){
                return this.$message.error('请选择所属片区')
            }
            if(this.dataForm.billNo === ''){
                return this.$message.error('请输入订单号')
            }
            getOfflineOrderSeat(this.dataForm).then(res=>{
                this.loading = false;
                if (res.data.code != 200) {
                    return this.$message.error(res.data.error)
                }
                this.showSeatDetail = true;
                this.seatDetail = res.data.data;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
#seatContainer {
  padding: 30px;
  ul,li{
      list-style: none;
      padding:0;
      margin:0;
  }
  .filter {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 30px;
    border-bottom: 1px solid #dcdfe6;
    .park {
      margin-right: 50px;
      .title {
        line-height: 40px;
      }
    }
    .orderInput{
      margin-right: 50px;
      display: flex;
      .el-input {
        width: 240px;
      }
      .title {
        line-height: 40px;
      }
    }
  }
  .seatDetail{
      margin-top:30px;
      .title{
          text-align: center;
      }
      .seatInfo{
          width:40%;
          border:1px dashed #66b1ff;
          border-radius: 10px;
          padding:20px;
          margin:0 auto;
          .seatInfo-top{
              border-bottom: 1px dashed #ccc;
              .seatInfo-item{
                  line-height: 40px;
                  .seatInfo-item-content{
                     display: inline-block;
                     width:48%;
                  }
              }
          }
          .seatInfo-bottom{
                display: flex;
                flex-flow:row wrap;
                align-content: flex-start;
                margin-top:20px;
                font-size: 15px;
                // justify-content: space-between;
            .seatInfo-bottom-content{
                box-sizing: border-box;
                flex: 0 0 30%;
                background:#fe2f41;
                color:#fff;
                border-radius:10px;
                // margin-right:3%;
                margin:1%;
                margin-bottom:20px;
                text-align: center;
            }
          }
      }
  }
}
</style>