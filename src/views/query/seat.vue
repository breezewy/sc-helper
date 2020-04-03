<template>
    <div id="seatContainer">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item  label="所属片区">
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
            </el-form-item>
            <el-form-item  label="订单号">
                <el-input placeholder="请输入宋城旅游订单号" v-model="dataForm.billNo" clearable ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchSeat">查询</el-button>
            </el-form-item>
        </el-form>

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
import { getParkList, getOfflineOrderSeat } from '../../api/query'
export default {
  data() {
    return {
      value: '',
      parkList: [],
      dataForm: {
        id: '', // 景区ID
        billNo: '' // 订单号
      },
      seatDetail: {},
      showSeatDetail: false,
      loading: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const data = { 'theater': true }
      getParkList(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.msg)
        }
        const data = res.data.data
        data.forEach(item => {
          this.parkList.push({
            value: item.id,
            label: item.name
          })
        })
      })
    },
    searchSeat() {
      if (this.dataForm.id === '') {
        return this.$message.error('请选择所属片区')
      }
      if (this.dataForm.billNo === '') {
        return this.$message.error('请输入订单号')
      }
      getOfflineOrderSeat(this.dataForm).then(res => {
        this.loading = false
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.showSeatDetail = true
        this.seatDetail = res.data.data
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
