<template>
  <div id="roleContainer">
    <div class="toolbar">
      <div class="inputBox">
        <el-input v-model="roleDate.name" placeholder="名称" clearable></el-input>
      </div>
      <div class="btn">
        <el-button @click="init">查询</el-button>
        <el-button type="primary" @click="addRole">新增</el-button>
        <el-button type="danger" @click="handleDeleteMore">删除</el-button>
      </div>
    </div>
    <el-table
      class="roleTable"
      ref="multipleTable"
      :data="roleList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
      <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      点击新增后出现的编辑模块
    -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dislog">
      <el-form :model="roleForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="roleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roleForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单授权">
          <el-tree
            :data="menuList"
            :props="defaultProps"
            node-key="id"
            show-checkbox
            accordion
            ref="menuListTree"
          ></el-tree>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 
      点击修改后出现的编辑模块 
    -->
    <el-dialog title="修改" :visible.sync="updateVisible" class="dislog">
      <el-form :model="updateRoleForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="updateRoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="updateRoleForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单授权">
          <el-tree
            :data="menuList"
            :props="defaultProps"
            node-key="id"
            show-checkbox
            accordion
            ref="menuListTree"
          ></el-tree>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="HandleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  deleteRole,
  updateRole,
  getRoleInfo
} from "../../api/sys";
import { getMenuSelect } from "../../api/nav";
export default {
  data() {
    return {
      // 查询角色的参数
      roleDate: {
        name: "",
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      //新增角色的参数
      roleForm: {
        name: "",
        remark: "",
        menuIdList: []
      },
      //修改角色的参数
      updateRoleForm: {
        id: "",
        name: "",
        remark: "",
        menuIdList: []
      },
      dialogFormVisible: false,
      updateVisible: false,
      menuList: [],
      roleList: [],
      rowIdList: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.roleDate.name.length == 0) {
        delete this.roleDate.name;
      }
      this.getRoleList();
      this.getMenuSelect();
    },
    getRoleList() {
      getRoleList(this.roleDate)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error(res.error);
          }
          this.roleList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMenuSelect() {
      getMenuSelect().then(res => {
        this.menuList = res.data;
      });
    },
    addRole() {
      this.dialogFormVisible = true;
      this.roleForm = {
        name: "",
        remark: "",
        menuIdList: []
      };
    },
    onSubmit() {
      this.roleForm.menuIdList = this.$refs.menuListTree.getCheckedKeys();
      let _this = this;
      //点击确认后，发起新增请求
      addRole(this.roleForm)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error(res.error);
          }
          this.dialogFormVisible = false;
          _this.getRoleList();
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改
    handleSubmit() {
      let _this = this;
      updateRole(this.updateRoleForm).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getRoleList();
        this.updateVisible = false;
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    onCancel() {
      this.dialogFormVisible = false;
    },
    HandleCancel() {
      this.updateVisible = false;
    },
    handleUpdate(id) {
      this.updateVisible = true;
      getRoleInfo(id)
        .then(res => {
          if (res.code != 200) {
            return this.$message.error(res.error);
          }
          this.updateRoleForm = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //单行删除
    handleDeleteSingle(id) {
      let _this = this;
      deleteRole([id]).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getRoleList();
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    // 多选删除
    handleDeleteMore() {
      let _this = this;
      if (this.rowIdList.length === 0) {
        this.$message({
          message: "请选择删除项",
          type: "warning"
        });
        return;
      }
      deleteRole(this.rowIdList).then(res => {
        if (res.code != 200) {
          return this.$message.error(res.error);
        }
        _this.getRoleList();
        this.$message({
          message: "操作成功",
          type: "success"
        });
      });
    },
    handleSelectionChange(selection) {
      this.rowIdList = [];
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#roleContainer {
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
  .roleTable {
    margin-top: 30px;
  }
  .dislog {
    width: 90%;
    margin: 0 auto;
  }
}
</style>