<template>
    <div id="seatContainer">
        <div class="filter">
            <div class="park">
                <span class="title">所属片区：</span>
                <el-select
                    v-model="value"
                    placeholder="所属片区"
                    clearable
                    class="filter-item"
                    style="width: 220px"
                    @change="getParkItem"
                >
                <el-option v-for="item in parkList" :key="item.id" :value="item.name" />
                </el-select>
            </div>
            <div class="orderInput">
                <span class="title">订单号：</span>
                <el-input placeholder="请输入订单号" v-model="dataForm.orderId" clearable></el-input>
            </div>
            <el-button type="primary" @click="handleClick">查询</el-button>
        </div>

        <div class="seatDetail">
            <el-card class="box-card">
                <h2 class="title">游客座位(10000000000)</h2>
                <div class="seatInfo">
                   <div class="seatInfo-top">
                       <ul>
                           <li class="seatInfo-item">
                               <span class="seatInfo-item-content">联系人：陆豪</span>
                               <span class="seatInfo-item-content">联系电话：13000000000</span>
                           </li>
                           <li class="seatInfo-item">
                               <span class="seatInfo-item-content">演出日期：2019-12-04</span>
                               <span class="seatInfo-item-content">演出场次：15:00</span>
                           </li>
                       </ul>
                   </div>
                   <div class="seatInfo-bottom">
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                        <div class="seatInfo-bottom-content">
                           <p>贵宾席</p>
                           <p>一区入口8排13座</p>
                        </div>
                   </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getParkList } from "../../api/query";
export default {
    data(){
        return {
            value:'',
            parkList:[],
            dataForm:{
               parkId:"",
               orderId:"" 
            },
            
        }
    },
    created(){
        this.init();
    },
    methods:{
        init() {
            getParkList().then(res => {
                if (res.data.code != 200) {
                    return this.$message.error(res.data.msg)
                }
                this.parkList = res.data.data;
                this.value = this.parkList[0].name;
                this.dataForm.parkId = this.parkList[0].id;
            })
        },
        getParkItem(value) {
            for (let i = 0; i < this.parkList.length; i++) {
                if (value === this.parkList[i].name) {
                    this.value = this.parkList[i].name;
                    this.dataForm.parkId = this.parkList[i].id;
                }
            }
        },
        handleClick(){

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
        width: 200px;
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