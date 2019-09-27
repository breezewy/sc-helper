<template>
  <div id="userContainer">
    <div class="toolbar">
      <div class="inputBox">
        <el-input v-model="username" placeholder="用户名" clearable></el-input>
        <el-input v-model="mobile" placeholder="手机号" clearable type="number"></el-input>
      </div>
      <div class="btn">
        <el-button @click="init">查询</el-button>
        <el-button type="primary" @click="addUser">新增</el-button>
        <el-button type="danger">删除</el-button>
      </div>
    </div>
    <!-- 
    <div class="tableContainer">
      <template>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="日期" width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
          <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
      </template>
    </div>-->

    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dislog">
      <el-form :model="userFrom" label-width="80px">
        <el-form-item label="部门ID">
          <el-input v-model="userFrom.deptId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userFrom.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="userFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="userFrom.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="userFrom.gender" label="0">男</el-radio>
          <el-radio v-model="userFrom.gender" label="1">女</el-radio>
          <el-radio v-model="userFrom.gender" label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFrom.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userFrom.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色配置">
          <el-select v-model="userFrom.roleIdList" placeholder="角色配置">
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="userFrom.status" label="0">停用</el-radio>
          <el-radio v-model="userFrom.status" label="1">正常</el-radio>
        </el-form-item>
      </el-form>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>-->
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getRole } from "../../api/sys";

export default {
  data() {
    return {
      tableData: [], //用户列表
      username: "", //用户名
      mobile: "", //手机号
      page: {
        //分页参数
        pageNum: 0,
        pageSize: 10
      },
      dialogFormVisible: false, //新增或编辑弹框
      userFrom: {
        deptId: "",
        email: "",
        gender: 1,
        headUrl: "",
        mobile: "",
        password: "",
        realName: "",
        remark: "",
        roleIdList: [],
        status: 0,
        superAdmin: 0,
        username: ""
      },
      roleList: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let dataFrom = {
        username: this.username,
        mobile: this.mobile,
        page: this.page
      };
      getUserList(dataFrom).then(res => {
        if (res.code != 200) {
          console.log(res);
        }
        this.tableData = res.data;
        console.log(this.tableData);
      });
    },
    addUser() {
      this.dialogFormVisible = true;
      getRole().then(res => {
        if (res.code != 200) {
          console.log(res);
        }
        this.roleList = res.data;
        console.log(this.roleLis);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#userContainer {
  padding: 30px;
  .toolbar {
    display: flex;
    .inputBox {
      width: 400px;
      display: flex;
      .el-input {
        margin-right: 30px;
      }
    }
    .btn {
      margin-left: 30px;
    }
  }
  .tableContainer {
    margin-top: 30px;
  }
  .dislog {
    width: 90%;
    margin: 0 auto;
  }
}
</style>