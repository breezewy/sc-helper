<template>
  <div id="userContainer">
    <div class="toolbar">
      <div class="inputBox">
        <el-input v-model="username" placeholder="用户名" clearable></el-input>
        <el-input v-model="mobile" placeholder="手机号" clearable></el-input>
      </div>
      <div class="btn">
        <el-button @click="init">查询</el-button>
        <el-button type="primary" @click="addUser">新增</el-button>
        <el-button type="danger" @click="handleDeleteMore">删除</el-button>
      </div>
    </div>

    <div class="tableContainer">
      <template>
        <el-table
          ref="multipleTable"
          :data="userList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="realName" label="用户名" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="type" label="登录身份" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 点击新增后出现的编辑区域 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dislog">
      <el-form ref="userForm" :model="userForm" :rules="userFormRules" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="confirmPassword" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="userForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="userForm.headUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="userForm.gender" :label="0">男</el-radio>
          <el-radio v-model="userForm.gender" :label="1">女</el-radio>
          <el-radio v-model="userForm.gender" :label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" type="email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.mobile" type="number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色配置" class="role-list">
          <el-select v-model="userForm.roleIdList" placeholder="角色配置" multiple>
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-radio v-model="userForm.superAdmin" :label="1">是</el-radio>
          <el-radio v-model="userForm.superAdmin" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="userForm.status" :label="1">正常</el-radio>
          <el-radio v-model="userForm.status" :label="0">停用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 点击修改后出现的编辑模块 -->
    <el-dialog title="修改" :visible.sync="updateVisible" class="dislog">
      <el-form :model="updateUserForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="updateUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="updateUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="confirmPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="updateUserForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="updateUserForm.gender" :label="0">男</el-radio>
          <el-radio v-model="updateUserForm.gender" :label="1">女</el-radio>
          <el-radio v-model="updateUserForm.gender" :label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="updateUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="updateUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色配置" class="role-list">
          <el-select v-model="updateUserForm.roleIdList" placeholder="角色配置" multiple>
            <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="updateUserForm.status" :label="0">停用</el-radio>
          <el-radio v-model="updateUserForm.status" :label="1">正常</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getRole,
  addNewUser,
  deleteUser,
  getUserInfo,
  updateUser
} from "../../api/sys";

export default {
  data() {
    return {
      userList: [], //用户列表
      username: "", //用户名
      mobile: "", //手机号
      page: {
        //分页参数
        pageNum: 0,
        pageSize: 10
      },
      dialogFormVisible: false, //新增或编辑弹框
      userForm: {
        email: "",
        gender: 0,
        headUrl: "",
        mobile: "",
        password: "",
        realName: "",
        roleIdList: [],
        status: 1,
        superAdmin: 1,
        username: ""
      },
      updateUserForm: {
        id: "",
        email: "",
        gender: 0,
        mobile: "",
        password: "",
        realName: "",
        roleIdList: [],
        status: 1,
        username: ""
      },
      confirmPassword: "",
      userFormRules: {
        email: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
        mobile: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ],
        username: [
          { required: true, message: "必填项不能为空", trigger: "blur" }
        ]
      },
      roleList: [],
      rowIdList: [],
      updateVisible: false
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
          return this.$message.error(res.error);
        }
        this.userList = res.data.data;
      });
    },
    //点击新增按钮
    addUser() {
      this.dialogFormVisible = true;
      this.userForm = {
        email: "",
        gender: 0,
        headUrl: "",
        mobile: "",
        password: "",
        realName: "",
        roleIdList: [],
        status: 1,
        superAdmin: 1,
        username: ""
      };
      getRole().then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        this.roleList = res.data;
      });
    },
    //新增用户确定按钮
    onSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          let _this = this;
          addNewUser(this.userForm).then(res => {
            if (res.code != 200) {
              return this.$message.error(res.error);
            }
            _this.init();
            this.dialogFormVisible = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消
    onCancel() {
      this.dialogFormVisible = false;
    },
    //table表格全选点击
    handleSelectionChange(selection) {
      this.rowIdList = [];
      console.log(selection);
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id);
      }
      console.log(this.rowIdList);
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
      deleteUser(this.rowIdList).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.init();
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    //单行删除
    handleDeleteSingle(id) {
      let _this = this;
      deleteUser([id]).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.init();
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    //点击修改按钮
    handleUpdate(id) {
      this.updateVisible = true;
      this.confirmPassword = "";
      getUserInfo(id)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error(res.error);
          }
          this.updateUserForm = res.data;
          this.updateUserForm.id = res.data.id;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改区域确定按钮
    handleSubmit() {
      let _this = this;
      updateUser(this.updateUserForm).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.init();
        this.updateVisible = false;
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    //修改区域取消按钮
    handleCancel() {
      this.updateVisible = false;
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
    margin: -80px auto;
  }
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>