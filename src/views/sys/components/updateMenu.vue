<template>
    <div class="updateMenu" >
        <el-dialog
            title="修改"
            :visible.sync="dialogFormVisible"
            @close="closeDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="menuForm"
                ref="appendForm"
                >
                <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
                    <el-radio-group v-model="menuForm.type" disabled>
                        <el-radio :label="0">菜单</el-radio>
                        <el-radio :label="1">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="menuForm.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="parentName">
                    <el-popover
                        placement="bottom-start"
                        width="200"
                        trigger="click"
                        ref="popover"
                        v-model="visible"
                        >
                        <el-tree
                            :data="MenuData"
                            :props="defaultProps"
                            :expand-on-click-node="false"
                            node-key="id"
                            @node-click="handleNodeClick"
                            >
                        </el-tree>
                    </el-popover>
                    <el-input v-model="menuForm.parentName" v-popover:popover autocomplete="off"  clearable></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
                    <el-input-number v-model="menuForm.sort" controls-position="right" @change="handleChange" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="路由" v-if="menuForm.type === 0" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="menuForm.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" v-if="menuForm.type === 0" :label-width="formLabelWidth" prop="url">
                     <el-popover
                        v-model="iconListVisible"
                        ref="iconListPopover"
                        placement="bottom-start"
                        trigger="click"
                        popper-class="mod-sys__menu-icon-popover">
                        <div class="mod-sys__menu-icon-inner">
                            <div class="mod-sys__menu-icon-list">
                                <el-button
                                    v-for="(item, index) in iconList"
                                    :key="index"
                                    @click="iconListCurrentChangeHandle(item)"
                                    class="icon-btn">
                                    <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${item}`"></use></svg>
                                </el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input v-model="menuForm.icon" v-popover:iconListPopover :readonly="true" placeholder="图标"></el-input>
                </el-form-item>
                <el-form-item label="权限标识"  :label-width="formLabelWidth" v-if="menuForm.type === 1" prop="permissions" >
                    <el-input v-model="menuForm.permissions" ></el-input>
                </el-form-item>
                <el-form-item
                    :label-width="formLabelWidth"
                    prop="permissions"
                    v-for="(item,index) in menuForm.resourceList"
                    :key="item.key"
                    :label="index === 0 ? '授权资源' : ''"
                    >
                    <el-row>
                        <el-col :span="22">
                            <el-input v-model="item.resourceUrl" placeholder="资源URL">
                                <el-select
                                    class="url-select"
                                    v-model="item.resourceMethod"
                                    slot="prepend"
                                    placeholder="GET"
                                    >
                                    <el-option label="GET" value="GET"></el-option>
                                    <el-option label="POST" value="POST"></el-option>
                                    <el-option label="PUT" value="PUT"></el-option>
                                    <el-option label="DELETE" value="DELETE"></el-option>
                                </el-select>
                            </el-input>
                        </el-col>
                        <el-col :span="2" class="text-center">
                            <el-button @click="resourceDeleteHandle(item)" size="small" type="text">删除</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item
                    :label="menuForm.resourceList.length <= 0 ? '授权资源' : ''"
                    :label-width="formLabelWidth"
                >
                    <el-button @click="resourceAddHandle()" class="aui-button--dashed w-percent-100">添加一项</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getMenuByID, updateMenu, getMenuListById, getIconList } from '@/api/sys'
export default {
  name: 'UpdateMenu',
  props: {
    show: Boolean,
    id: String
  },
  data() {
    return {
      MenuData: [],
      iconList: [],
      menuForm: {
        name: '',
        parentName: '一级菜单',
        type: 0,
        icon: '',
        permissions: '',
        pid: '0',
        resourceList: [],
        sort: 0,
        url: ''
      },
      formLabelWidth: '100px',
      dialogFormVisible: false,
      visible: false,
      iconListVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.dialogFormVisible = this.show
    this.getMenuByID(this.id)
    this.iconList = getIconList()
  },
  watch: {
    show(newVal, oldVal) {
      this.dialogFormVisible = newVal
    }
  },
  methods: {
    closeDialog() {
      this.$emit('changeShow')
    },
    handleNodeClick(data, checked) {
      this.visible = false
      this.menuForm.parentName = data.name
      this.menuForm.pid = data.pid
    },
    resourceDeleteHandle(resource) {
      this.menuForm.resourceList = this.menuForm.resourceList.filter(item => item.key !== resource.key)
    },
    resourceAddHandle() {
      this.menuForm.resourceList.push({
        key: new Date().getTime(),
        resourceMethod: 'GET',
        resourceUrl: ''
      })
    },
    handleSubmit() {
      updateMenu(this.menuForm).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('操作成功')
        this.dialogFormVisible = false
        this.$emit('refresh')
      })
    },
    getMenuListById() {
      getMenuListById(this.menuForm.type).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.MenuData = res.data.data
      })
    },
    handleChange(value) {
      this.menuForm.sort = value
    },
    // 图标, 选中
    iconListCurrentChangeHandle(icon) {
      this.menuForm.icon = icon
      this.iconListVisible = false
    },
    getMenuByID(id) {
      getMenuByID(id).then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.menuForm = res.data.data
        this.getMenuListById()
      })
    }
  }

}
</script>

<style lang="scss">

</style>
