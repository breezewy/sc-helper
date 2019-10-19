<template>
  <div id="container">
    <div class="toolbar">
      <el-input
        placeholder="请输入票型编码"
        v-model="paramForm.code"
        class="inputArea"
        suffix-icon="el-icon-edit"
      ></el-input>
      <el-button @click="search">查询</el-button>
      <el-button type="primary" @click="addTicket">新增</el-button>
      <el-button type="danger" @click="handleDeleteMore">删除</el-button>
    </div>
    <div class="tableContainer">
      <template>
        <el-table
          ref="multipleTable"
          :data="ticketList"
          empty-text="暂无数据"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="code" label="票型编码" align="center"></el-table-column>
          <el-table-column prop="name" label="票型名称" align="center"></el-table-column>
          <el-table-column prop="buyToday" label="是否可当天购买" align="center" width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.buyToday== true" type="success">是</el-tag>
              <el-tag v-if="scope.row.buyToday== false" type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="containShow" label="是否包含演出票" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.containShow== true" type="success">是</el-tag>
              <el-tag v-if="scope.row.containShow== false" type="danger">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="useStartDate" label="使用开始时间" align="center"></el-table-column>
          <el-table-column prop="useEndDate" label="使用结束时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="10"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </template>
    </div>
    <!-- 点击新增出现编辑区域 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dislog">
      <el-form ref="addTicketForm" :model="ticketForm" label-width="120px" prop>
        <el-form-item label="票型编码" prop="code">
          <el-input v-model="ticketForm.code" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="票型名称" prop="name">
          <el-input v-model="ticketForm.name" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可当天购买" prop="buyToday">
          <el-radio v-model="ticketForm.buyToday" :label="true">是</el-radio>
          <el-radio v-model="ticketForm.buyToday" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否包含演出票" prop="containShow">
          <el-radio v-model="ticketForm.containShow" :label="true">是</el-radio>
          <el-radio v-model="ticketForm.containShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="使用开始时间" prop="useStartDate">
          <el-date-picker
            v-model="ticketForm.useStartDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="useEndDate">
          <el-date-picker
            v-model="ticketForm.useEndDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--点击修改出现编辑区域  -->
    <el-dialog title="修改" :visible.sync="updatedialogFormVisible" class="dislog">
      <el-form ref="updateTicketForm" :model="ticketDetial" label-width="120px" prop>
        <el-form-item label="票型编码" prop="code">
          <el-input v-model="ticketDetial.code" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="票型名称" prop="name">
          <el-input v-model="ticketDetial.name" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可当天购买" prop="buyToday">
          <el-radio v-model="ticketDetial.buyToday" :label="true">是</el-radio>
          <el-radio v-model="ticketDetial.buyToday" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="是否包含演出票" prop="containShow">
          <el-radio v-model="ticketDetial.containShow" :label="true">是</el-radio>
          <el-radio v-model="ticketDetial.containShow" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="使用开始时间" prop="useStartDate">
          <el-date-picker
            v-model="ticketDetial.useStartDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="useEndDate">
          <el-date-picker
            v-model="ticketDetial.useEndDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdateSubmit">确定</el-button>
          <el-button @click="handleUpdateCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  addReTicket,
  getTicketList,
  deleteTicket,
  getTicketDetail,
  updateTicket
} from "../../api/reOrder";
export default {
  data() {
    return {
      dialogFormVisible: false,
      updatedialogFormVisible: false,
      ticketList: [],
      ticketForm: {
        code: "",
        name: "",
        buyToday: true,
        containShow: true,
        useStartDate: "",
        useEndDate: ""
      },
      ticketDetial: {},
      paramForm: {
        code: "",
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      rowIdList: [],
      total: 0,
      currentPage: 1
    };
  },
  created() {
    this.getTicketList(this.paramForm);
  },
  methods: {
    //点击新增按钮
    addTicket() {
      this.dialogFormVisible = true;
      this.ticketForm = {
        code: "",
        name: "",
        buyToday: true,
        containShow: true,
        useStartDate: "",
        useEndDate: ""
      };
    },
    //获取票型列表
    getTicketList(data) {
      if (data.code == "") {
        delete data.code;
      }
      getTicketList(data).then(res => {
        this.ticketList = res.data.data;
        this.total = res.data.totalCount;
      });
    },
    //确定添加
    handleSubmit() {
      let _this = this;
      addReTicket(this.ticketForm).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getTicketList(this.paramForm);
        this.$message.success("添加成功");
        this.dialogFormVisible = false;
      });
    },
    //取消添加
    handleCancel() {
      this.dialogFormVisible = false;
    },
    //查询
    search() {
      this.getTicketList(this.paramForm);
    },
    //头部删除按钮
    handleDeleteMore() {
      let _this = this;
      if (this.rowIdList.length === 0) {
        this.$message({
          message: "请选择删除项",
          type: "warning"
        });
        return;
      }
      deleteTicket(this.rowIdList).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getTicketList(this.paramForm);
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    //列表全选按钮
    handleSelectionChange(selection) {
      this.rowIdList = [];
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id);
      }
    },
    //每行的删除按钮
    handleDeleteSingle(id) {
      let _this = this;
      deleteTicket([id]).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getTicketList(this.paramForm);
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    //每行的修改按钮
    handleUpdate(id) {
      getTicketDetail(id).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        this.updatedialogFormVisible = true;
        this.ticketDetial = res.data;
      });
    },
    //选择列表每页多少条数据
    handleSizeChange(val) {
      this.paramForm.page.pageSize = val;
      this.getTicketList(this.paramForm);
    },
    //选择列表不同页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.paramForm.page.pageNum = this.currentPage - 1;
      this.getTicketList(this.paramForm);
    },
    //修改区域确定按钮
    handleUpdateSubmit() {
      updateTicket(this.ticketDetial).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        this.updatedialogFormVisible = false;
        this.$message({
          message: "操作成功",
          type: "success"
        });
        this.getTicketList(this.paramForm);
      });
    },
    //修改区域取消按钮
    handleUpdateCancel() {
      this.updatedialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  padding: 30px;
  .toolbar {
    .inputArea {
      width: 300px;
      margin-right: 30px;
    }
  }
  .tableContainer {
    margin-top: 30px;
    .el-pagination {
      padding: 20px 50px;
      text-align: right;
    }
  }
  .detailTable {
    margin-top: 30px;
  }
}
</style>