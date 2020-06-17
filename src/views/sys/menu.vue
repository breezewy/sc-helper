
<template>
    <div class="menu">
        <div class="toolbar">
             <el-button type="primary" @click="appendMenu">新增</el-button>
        </div>
        <div class="menuTable">
            <el-table
                :data="menuList"
                empty-text="暂无数据"
                style="width: 100%"
                border
                row-key="id"
            >
                <el-table-column
                    label="名称"
                    prop="name"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="图标"
                    prop="icon"
                    align="center"
                >
                    <template slot-scope="scope">
                        <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${scope.row.icon}`"></use></svg>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类型"
                    prop="type"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.type == 0">菜单</el-tag>
                        <el-tag type="success" size="mini" v-if="scope.row.type == 1">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="排序"
                    prop="sort"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="路由"
                    prop="url"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="授权标识"
                    prop="permissions"
                    align="center"
                >
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
                            <el-button type="text" size="small" @click="handleDeleteSingle(scope.row.id)">删除</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </div>
        <append-menu
            v-if="showAppend"
            :show="showAppend"
            @changeShow="changeShowAppend"
            @refresh="refresh"
        >
        </append-menu>
        <update-menu
            v-if="show"
            :show="showUpdate"
            :id="id"
            @changeShow="changeShowUpdate"
            @refresh="refresh"
        >
        </update-menu>
    </div>
</template>

<script>
import AppendMenu from './components/AppendMenu'
import UpdateMenu from './components/updateMenu'
import { getMenuList, deleteMenu, getMenuByID } from '@/api/sys'

export default {
  name: 'Menu',
  data() {
    return {
      showAppend: false,
      showUpdate: false,
      show: false,
      menuList: [],
      id: ''
    }
  },
  components: {
    AppendMenu,
    UpdateMenu
  },
  created() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      getMenuList().then(res => {
        if (res.data.code !== 200) {
          return this.$message.error(res.data.error)
        }
        this.menuList = res.data.data
      })
    },
    appendMenu() {
      this.showAppend = true
    },
    changeShowAppend() {
      this.showAppend = false
    },
    changeShowUpdate() {
      this.showUpdate = false
      this.show = false
    },
    handleUpdate(id) {
      this.showUpdate = true
      this.show = true
      this.id = id
    },
    handleDeleteSingle(id) {
      deleteMenu(id).then(res => {
        if (res.data.code != 200) {
          return this.$message.error(res.data.error)
        }
        this.$message.success('操作成功')
        this.refresh()
      })
    },
    refresh() {
      this.getMenuList()
    }

  }
}
</script>

<style lang="scss" scoped>
    .menu{
        padding:30px;
        .menuTable{
            margin-top:30px;
            .icon-svg {
                width: 1em;
                height: 1em;
                fill: currentColor;
                vertical-align: middle;
                overflow: hidden;
            }
        }
    }
</style>
