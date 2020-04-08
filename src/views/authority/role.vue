<template>
  <div id="roleContainer">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="roleDate.name" placeholder="名称" clearable @clear="handleClear"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="handleDeleteMore">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      class="roleTable"
      ref="multipleTable"
      :data="roleList"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
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

    <!--
      点击新增后出现的编辑模块
    -->
    <el-dialog title="新增" :visible.sync="dialogFormVisible" class="dialog" :close-on-click-modal="false" @close="closeAddDialog">
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="roleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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
    <el-dialog title="修改" :visible.sync="updateVisible" class="dialog" :close-on-click-modal="false" @close="closeUpdateDialog">
      <el-form
        ref="updateRoleForm"
        :model="updateRoleForm"
        :rules="updateRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="updateRoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="updateRoleForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单授权">
          <el-tree
            :data="menuList"
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="this.checkedList"
            show-checkbox
            accordion
            ref="listTree"
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
} from '../../api/management'
import { getMenuSelect } from '../../api/nav'
export default {
  data() {
    return {
      // 查询角色的参数
      roleDate: {
        name: '',
        page: {
          pageNum: 0,
          pageSize: 10
        }
      },
      // 新增角色的参数
      roleForm: {
        name: '',
        remark: '',
        menuIdList: []
      },
      roleFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      // 修改角色的参数
      updateRoleForm: {
        id: '',
        name: '',
        remark: '',
        menuIdList: []
      },
      updateRoleFormRules: {
        name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
        remark: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      updateVisible: false,
      menuList: [],
      roleList: [],
      rowIdList: [],
      checkedList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      total: 0,
      currentPage: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getRoleList()
      this.getMenuSelect()
    },
    // 查询
    search() {
      this.roleDate.page.pageNum = 0
      this.roleDate.page.pageSize = 10
      this.getRoleList()
    },
    // 获取角色列表
    getRoleList() {
      if (this.roleDate.name === '' || this.roleDate.name === null) {
        delete this.roleDate.name
      }
      getRoleList(this.roleDate)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.error)
          }
          this.roleList = res.data.data.data
          this.total = res.data.data.totalCount
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取菜单列表
    getMenuSelect() {
      getMenuSelect().then(res => {
        this.menuList = res.data.data
      })
    },
    // 点击新增按钮
    addRole() {
      this.dialogFormVisible = true
      this.roleForm = {
        name: '',
        remark: '',
        menuIdList: []
      }
    },
    // 新增框里的确定按钮
    onSubmit() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          const parentArr = this.$refs.menuListTree.getHalfCheckedKeys()
          const childeArr = this.$refs.menuListTree.getCheckedKeys()
          const arr = childeArr.concat(parentArr)
          this.roleForm.menuIdList = arr
          const _this = this
          // 点击确认后，发起新增请求
          addRole(this.roleForm)
            .then(res => {
              if (res.data.code !== 200) {
                return this.$message.error(res.error)
              }
              this.dialogFormVisible = false
              _this.getRoleList()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改框里的确定按钮
    handleSubmit() {
      this.$refs.updateRoleForm.validate(valid => {
        if (valid) {
          const _this = this
          const parentArr = _this.$refs.listTree.getHalfCheckedKeys()
          const childeArr = _this.$refs.listTree.getCheckedKeys()
          const arr = childeArr.concat(parentArr)
          _this.updateRoleForm.menuIdList = arr
          updateRole(this.updateRoleForm).then(res => {
            if (res.data.code !== 200) {
              return this.$message.error(res.data.error)
            }
            _this.getRoleList()
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
    // 新增弹框的取消
    onCancel() {
      this.dialogFormVisible = false
    },
    // 修改弹框的取消
    HandleCancel() {
      this.updateVisible = false
    },
    // 点击修改时
    handleUpdate(id) {
      this.updateVisible = true
      var that = this
      getRoleInfo(id)
        .then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          that.updateRoleForm = res.data.data
          that.checkedList = res.data.data.menuIdList
          const newArr = []
          if (this.checkedList && this.checkedList.length !== 0) {
            this.checkedList.forEach(item => {
              this.checked(item, this.menuList, newArr)
            })
            this.checkedList = newArr
          }
        })
        .catch(err => {
          console.log(err)
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
        deleteRole([id]).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.data.error)
          }
          _this.getRoleList()
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
    // 多选删除
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
        deleteRole(this.rowIdList).then(res => {
          if (res.data.code !== 200) {
            return this.$message.error(res.error)
          }
          _this.getRoleList()
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
    // 角色列表头部勾选
    handleSelectionChange(selection) {
      this.rowIdList = []
      for (let i = 0; i < selection.length; i++) {
        this.rowIdList.push(selection[i].id)
      }
    },
    // 递归筛选
    checked(id, data, newArr) {
      data.forEach(item => {
        if (item.id === id) {
          if (item.children.length === 0) {
            newArr.push(item.id)
          }
        } else {
          if (item.children.length !== 0) {
            this.checked(id, item.children, newArr)
          }
        }
      })
    },
    // 关闭修改弹框
    closeUpdateDialog() {
      // 当弹框关闭时，修改默认勾选的节点数组
      this.$refs.listTree.setCheckedKeys([])
    },
    // 关闭新增弹框
    closeAddDialog() {
      this.$refs.menuListTree.setCheckedKeys([])
    },
    // 选择列表不同页面
    handleSizeChange(val) {
      this.roleDate.page.pageSize = val
      this.getRoleList(this.roleDate)
    },
    // 选择列表每页多少条数据
    handleCurrentChange(val) {
      this.currentPage = val
      this.roleDate.page.pageNum = this.currentPage - 1
      this.getRoleList(this.roleDate)
    },
    // 清空查询框
    handleClear() {
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss" scoped>
#roleContainer {
  padding: 30px;
  .el-pagination {
      padding: 20px 50px;
      text-align: right;
  }
  // .toolbar {
  //   display: flex;
  //   .inputBox {
  //     width: 400px;
  //     display: flex;
  //     .el-input {
  //       margin-right: 30px;
  //     }
  //   }
  //   .btn {
  //     margin-left: 30px;
  //   }
  // }
  .roleTable {
    margin-top: 30px;
  }
  .dialog {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
