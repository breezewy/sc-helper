<template>
  <div id="container">
    <div class="dmq" v-if="hideController">
      <div class="toolbar">
        <el-input
          placeholder="请输入票型编码"
          v-model="paramForm.code"
          class="inputArea"
          suffix-icon="el-icon-edit"
        ></el-input>
        <el-button @click="search">查询</el-button>
        <el-button type="primary" @click="addDmq">新增</el-button>
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
            <el-table-column prop="number" label="最大可购买份数" align="center" width="100"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                <el-button type="text" size="small" @click="handleController(scope.row.id)">关联</el-button>
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
        <el-form ref="addDmqForm" :model="dmqForm" label-width="120px" prop>
          <el-form-item label="票型编码" prop="code">
            <el-input v-model="dmqForm.code" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="票型名称" prop="name">
            <el-input v-model="dmqForm.name" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="最大可购买份数" prop="number">
            <el-input-number v-model="dmqForm.number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--点击修改出现编辑区域  -->
      <el-dialog title="修改" :visible.sync="updatedialogFormVisible" class="dislog">
        <el-form ref="updateDmqForm" :model="dmqTicketDetial" label-width="120px" prop>
          <el-form-item label="票型编码" prop="code">
            <el-input v-model="dmqTicketDetial.code" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="票型名称" prop="name">
            <el-input v-model="dmqTicketDetial.name" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="最大可购买份数" prop="number">
            <el-input-number v-model="dmqTicketDetial.number" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdateSubmit">确定</el-button>
            <el-button @click="handleUpdateCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <Controller v-else :id="dmqId"></Controller>
  </div>
</template>

<script>
import {
  addDmqTicket,
  getDmqTicketList,
  deleteDmqTicket,
  getDmqTicketDetail,
  updateDmqTicket
} from "../../api/reOrder";

import Controller from "./controller";
export default {
  data() {
    return {
      hideController: true,
      dialogFormVisible: false,
      updatedialogFormVisible: false,
      ticketList: [],
      dmqForm: {
        code: "",
        name: "",
        number: 1
      },
      dmqTicketDetial: {},
      paramForm: {
        code: "",
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      rowIdList: [],
      total: 0,
      currentPage: 1,
      dmqId: ""
    };
  },
  components: {
    Controller
  },
  created() {
    this.getTicketList(this.paramForm);
  },
  methods: {
    //点击新增按钮
    addDmq() {
      this.dialogFormVisible = true;
      this.dmqForm = {
        code: "",
        name: "",
        number: 1
      };
    },
    //获取票型列表
    getTicketList(data) {
      if (data.code == "") {
        delete data.code;
      }
      getDmqTicketList(data).then(res => {
        this.ticketList = res.data.data;
        this.total = res.data.totalCount;
      });
    },
    //确定添加
    handleSubmit() {
      let _this = this;
      addDmqTicket(this.dmqForm).then(res => {
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
      deleteDmqTicket(this.rowIdList).then(res => {
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
      deleteDmqTicket([id]).then(res => {
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
      getDmqTicketDetail(id).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        this.updatedialogFormVisible = true;
        this.dmqTicketDetial = res.data;
        console.log(this.dmqTicketDetial);
      });
    },
    //选择列表不同页面
    handleSizeChange(val) {
      this.paramForm.page.pageSize = val;
      this.getTicketList(this.paramForm);
    },
    //选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val;
      this.paramForm.page.pageNum = this.currentPage - 1;
      this.getTicketList(this.paramForm);
    },
    //修改区域确定按钮
    handleUpdateSubmit() {
      updateDmqTicket(this.dmqTicketDetial).then(res => {
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
    },
    //根据独木桥票型获取管理票型
    handleController(id) {
      this.dmqId = id;
      this.hideController = false;
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