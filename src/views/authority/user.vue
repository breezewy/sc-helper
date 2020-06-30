<template>
  <div id="userContainer">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="init">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$store.getters.button.includes('authority:role:save')" @click="addUser">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" v-if="$store.getters.button.includes('authority:role:delete')" @click="handleDeleteMore">删除</el-button>
      </el-form-item>
    </el-form>
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
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="realName" label="别名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="type" label="登录身份" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type== 0" >系统用户</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status== 1" type="success" size="mini">正常</el-tag>
              <el-tag v-if="scope.row.status== 0" type="danger" size="mini">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="name" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" v-if="$store.getters.button.includes('authority:role:update')" @click="handleUpdate(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" v-if="$store.getters.button.includes('authority:role:delete')" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
              <el-button type="text" size="small" v-if="$store.getters.button.includes('authority:role:resetPassword')"  @click="resetPassword(scope.row.id)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 点击新增后出现的编辑区域 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dialog" :close-on-click-modal="false">
      <el-form ref="addUserForm" :model="userForm" :rules="userFormRules" label-width="100px" prop>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" type="password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
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
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" type="email" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色配置" class="role-list">
          <el-select v-model="userForm.roleIdList" placeholder="角色配置" multiple >
            <el-option v-for="role in roleList" :key="role.id" :label="role.label" :value="role.value"></el-option>
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
    <el-dialog title="修改" :visible.sync="updateVisible" class="dialog" :close-on-click-modal="false">
      <el-form
        ref="updateUserForm"
        :model="updateUserForm"
        :rules="updateUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateUserForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="updateUserForm.confirmPassword" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="updateUserForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="updateUserForm.gender" :label="0">男</el-radio>
          <el-radio v-model="updateUserForm.gender" :label="1">女</el-radio>
          <el-radio v-model="updateUserForm.gender" :label="2">保密</el-radio>
        </el-form-item>
        <el-form-item label="角色配置" class="role-list">
          <el-select v-model="updateUserForm.roleIdList" placeholder="角色配置" multiple>
            <el-option v-for="role in roleList" :key="role.id" :label="role.label" :value="role.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
  updateUser,
  resetPassword
} from '../../api/management'

// import { isEmail, isMobile } from '@/utils/validate'
export default {
  data() {
    // var validateEmail = (rule, value, callback) => {
    //   if (!isEmail(value)) {
    //     return callback(new Error("邮箱格式错误"));
    //   }
    //   callback();
    // };
    // var validateMobile = (rule, value, callback) => {
    //   if (!isMobile(value)) {
    //     return callback(new Error("手机号格式错误"));
    //   }
    //   callback();
    // };
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.userForm.password !== value) {
        return callback(new Error('两次密码输入不一致'))
      }
      callback()
    }
    var validateUpdatePassword = (rule, value, callback) => {
      if (this.updateUserForm.password !== value) {
        return callback(new Error('两次密码输入不一致'))
      }
      callback()
    }
    return {
      userList: [], // 用户列表
      username: '', // 用户名
      mobile: '', // 手机号
      page: {
        // 分页参数
        pageNum: 0,
        pageSize: 10
      },
      dialogFormVisible: false, // 新增或编辑弹框
      userForm: {
        // email: "",
        gender: 0,
        headUrl: '',
        // mobile: "",
        password: '',
        confirmPassword: '',
        realName: '',
        roleIdList: [],
        status: 1,
        superAdmin: 1,
        username: ''
      },
      updateUserForm: {
        id: '',
        // email: "",
        gender: 0,
        // mobile: "",
        password: '',
        confirmPassword: '',
        realName: '',
        roleIdList: [],
        status: 1,
        username: ''
      },
      userFormRules: {
        // email: [
        //   { required: true, message: "必填项不能为空", trigger: "blur" },
        //   { validator: validateEmail, trigger: "blur" }
        // ],
        // mobile: [
        //   { required: true, message: "必填项不能为空", trigger: "blur" },
        //   { validator: validateMobile, trigger: "blur" }
        // ],
        password: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '必填项不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      },
      updateUserFormRules: {
        // email: [
        //   { required: false, message: "必填项不能为空", trigger: "blur" },
        //   { validator: validateEmail, trigger: "blur" }
        // ],
        // mobile: [{ validator: validateMobile, trigger: "blur" }],
        password: [
          { required: false, message: '必填项不能为空', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: false, message: '必填项不能为空', trigger: 'blur' },
          { validator: validateUpdatePassword, trigger: 'blur' }
        ]
      },
      roleList: [],
      rowIdList: [],
      updateVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const dataFrom = {
        username: this.username,
        mobile: this.mobile,
        page: this.page
      }
      getUserList(dataFrom).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.error)
        }
        this.userList = res.data.data.data
      })
      // 初始化角色列表
      this.roleList = []
      getRole().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        const data = res.data.data
        data.forEach(item => {
          const role = {
            value: item.id,
            label: item.name
          }
          this.roleList.push(role)
        })
      })
    },
    // 点击新增按钮
    addUser() {
      this.dialogFormVisible = true
      this.userForm = {
        email: '',
        gender: 0,
        headUrl: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        realName: '',
        roleIdList: [],
        status: 1,
        superAdmin: 1,
        username: ''
      }
      // getRole().then(res => {
      //   if (res.data.code != 200) {
      //     return this.$message.error(res.data.error);
      //   }
      //   let data = res.data.data;
      //   data.forEach(item => {
      //     let role = {
      //       value: item.id,
      //       label:item.name
      //     }
      //     this.roleList.push(role)
      //   })
      // });
    },
    // 新增用户确定按钮
    onSubmit() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          const _this = this
          addNewUser(this.userForm).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.error)
            }
            _this.init()
            this.dialogFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    onCancel() {
      this.dialogFormVisible = false
    },
    // table表格全选点击
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 头部删除按钮
    handleDeleteMore() {
      const _this = this
      if (this.rowIdList.length === 0) {
        this.$message({
          message: '请选择删除项',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要删除所选角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(this.rowIdList).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          _this.init()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 单行删除
    handleDeleteSingle(id) {
      const _this = this
      this.$confirm('确定要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser([id]).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          _this.init()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击修改按钮
    handleUpdate(id) {
      this.updateVisible = true
      getUserInfo(id)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.updateUserForm = res.data.data
          this.updateUserForm.id = res.data.data.id
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 修改区域确定按钮
    handleSubmit() {
      this.$refs.updateUserForm.validate(valid => {
        if (valid) {
          const _this = this
          updateUser(this.updateUserForm).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.error)
            }
            _this.init()
            this.updateVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改区域取消按钮
    handleCancel() {
      this.updateVisible = false
    },
    // 重置密码id
    resetPassword(id) {
      this.$confirm('此操作将会把密码重置为888888, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(id).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#userContainer {
  padding: 30px;
  .tableContainer {
    margin-top: 30px;
  }
  .dialog {
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
