<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img 
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" 
            alt=""
            style="width:40px;height:40px;"  
          >
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="changePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


  <el-dialog title="修改密码" 
      :visible.sync="showChangePasswordForm" 
      :close-on-click-modal="false" 
      @close="resetForm">
      <el-form :model="form" :rules="formRules" ref="changePassword">
        <el-form-item label="账号" label-width="80px">
          <el-input v-model="this.$store.getters.name"  autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="原密码" label-width="80px" prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="80px" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="80px" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChangePasswordForm = false">取 消</el-button>
        <el-button type="primary" @click="handleChange">确 定</el-button>
      </div>
  </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {changePwd} from '@/api/user'
export default {
  data(){
     var validateConfirmPassword = (rule, value, callback) => {
      if (this.form.newPwd != value) {
        return callback(new Error("两次密码输入不一致"));
      }
      callback();
    };
    return {
      showChangePasswordForm:false,
      form:{
        confirmPwd:"",
        newPwd:"",
        oldPwd:""
      },
      formRules: {
        newPwd: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        oldPwd: [
          { required: true, message: "必填项不能为空", trigger: "blur" },
        ],
        confirmPwd:[
          { required: true, message: "必填项不能为空", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      },
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassword(){
      this.showChangePasswordForm = true;
    },
    resetForm(){
      this.$refs.changePassword.resetFields()
    },
    handleChange(){
      this.$refs.changePassword.validate(valid=>{
          if(valid){
            let _this = this;
            changePwd(this.form).then(res=>{
              if(res.data.code != 200){
                return _this.$message.error(res.data.msg)
              }
              _this.showChangePasswordForm = false
              _this.$message.success('修改密码成功')
            })
          }else{
            console.log("error submit!!");
            return false;
          }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
