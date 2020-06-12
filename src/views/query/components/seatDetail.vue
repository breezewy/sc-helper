<template>
    <div class="seatDetail">
        <el-dialog title="游客座位" :visible.sync="dialogTableVisible" @close="closeDialog">
            <el-card class="box-card">
                <h2 class="title">游客座位</h2>
                <div class="seatInfo" >
                    <div class="seatInfo-top">
                        <ul>
                            <li class="seatInfo-item">
                                <span class="seatInfo-item-content">联系人：{{result.name}}</span>
                                <span class="seatInfo-item-content">联系电话：{{result.telNo}}</span>
                            </li>
                            <li class="seatInfo-item">
                                <span class="seatInfo-item-content">演出日期：{{result.performDate}}</span>
                                <span class="seatInfo-item-content">演出场次：{{result.performTime}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="seatInfo-bottom">
                        <div class="seatInfo-bottom-content" v-for="(item,index) in this.result.detail" :key="index">
                            <p>{{item.areaName.split(' ')[0]}}</p>
                            <p>{{item.areaName.split(' ')[1]}}</p>
                            <p>{{item.row}}排{{item.col}}座</p>
                        </div>
                    </div>
                </div>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
import { getOfflineOrderSeat } from '@/api/query'
export default {
  props: ['item', 'show', 'parkId'],
  data() {
    return {
      dialogTableVisible: this.show,
      result: {}
    }
  },
  created() {
    this.getSeatDetail()
  },
  methods: {
    getSeatDetail() {
      const data = {
        billNo: this.item.billoutno,
        id: this.parkId
      }
      getOfflineOrderSeat(data).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.result = res.data.data
      })
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scope>
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
          width:60%;
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
</style>
