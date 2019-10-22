<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色 -->
    <el-button type="success" plain class="addRoles" @click="addRolesModal=true">添加角色</el-button>

    <!-- 角色列表 -->
    <el-table
      :data="rolesList"
      style="width: 100%">

      <!-- 展开行 -->
      <el-table-column type="expand">

        <template slot-scope="{row}">
          <!-- <p>{{children}}</p> -->
          <p v-if="row.children.length === 0">暂无权限</p>

          <!-- 一级权限要独占一行 -->
          <el-row class="no1" v-for="item in row.children" :key="item.id">
            <el-col :span="4">
              <!-- {{item}} -->
              <el-tag @close="delRight(row, item.id)" closable>{{item.authName}}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <!-- 右侧权限 -->
            <el-col :span="20" >

              <!-- 二级权限 -->
              <el-row class="no2" v-for="item2 in item.children" :key="item2.id" >
                <el-col :span="4">
                  <el-tag @close="delRight(row, item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag @close="delRight(row, item3.id)" type="warning" class="no3" closable  v-for="item3 in item2.children" :key="item3.id">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>

            </el-col>
          </el-row>

        </template>

      </el-table-column>

      <el-table-column
        label="#"
        min-width="50px"
        type="index">
      </el-table-column>

      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>

      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>

      <el-table-column label="操作">

        <template v-slot:default='obj'>
          <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEditRoles(obj.row)"></el-button>
          <el-button plain size="small" type="danger" icon="el-icon-delete" @click="delRoles(obj.row)"></el-button>
          <el-button plain size="small" type="success" icon="el-icon-check" @click="showAssignModal(obj.row)">分配权限</el-button>
        </template>

      </el-table-column>

    </el-table>

    <!-- 添加角色模态框 -->
    <el-dialog
      title="添加角色"
      width="40%"
      modal
      show-close
      center
      :close-on-click-modal=false
      :visible.sync='addRolesModal'>

      <el-form :model="addRolesInfo" status-icon :rules="rules" ref="addRolesForm" label-width="100px"      class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesInfo.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model="addRolesInfo.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <template>
          <span slot="footer">
            <el-button @click="closeMadal('addRolesModal', 'addRolesForm')">取消</el-button>
            <el-button class="addRolesBtn" type="primary" @click="addRoles">确定</el-button>
          </span>
      </template>

    </el-dialog>

    <!-- 修改角色模态框 -->
    <el-dialog
      title="修改角色"
      width="40%"
      modal
      show-close
      center
      :close-on-click-modal=false
      :visible.sync='editRolesModal'>

      <el-form :model="editRolesInfo" status-icon :rules="rules" ref="editRolesForm" label-width="100px"      class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesInfo.roleName" ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model="editRolesInfo.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <template>
          <span slot="footer">
            <el-button @click="closeMadal('editRolesModal', 'editRolesForm')">取消</el-button>
            <el-button class="addRolesBtn" type="primary" @click="editRoles(editRolesInfo)">确定</el-button>
          </span>
      </template>

    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" show-close :visible.sync="assignModal">

      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :props="defaultProps"
        default-expand-all>
      </el-tree>

      <!-- <el-tree :data="data2" show-checkbox :props="defaultProps1"></el-tree> -->

      <div slot="footer">
        <el-button @click="closeMadal('assignModal')">取消</el-button>
        <el-button type="primary" @click="assginRight">分配</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      addRolesModal: false,
      editRolesModal: false,
      assignModal: false,
      addRolesInfo: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请描述角色', trigger: ['blur', 'change'] }
        ]
      },
      // 修改
      editRolesInfo: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    // 角色列表
    async getRolesList () {
      const { meta: { status }, data } = await this.$axios.get('roles')
      if (status === 200) {
        this.rolesList = data
      }
    },

    // 关闭模态框
    closeMadal (param, formName) {
      if (formName) {
        this.$refs[formName].resetFields()
      }
      this[param] = false
      this.$message.info('已取消操作')
    },

    // 添加角色
    async addRoles () {
      const { meta: { msg, status } } = await this.$axios.post('roles', this.addRolesInfo)
      if (status === 201) {
        this.$message.success(msg)
        this.$refs.addRolesForm.resetFields()
        this.getRolesList()
        this.addRolesModal = false
      } else {
        this.$message.error(msg)
      }
    },

    // 展示点击框
    async showEditRoles ({ id }) {
      const { meta: { status }, data } = await this.$axios.get(`roles/${id}`)
      if (status === 200) {
        this.editRolesInfo.roleName = data.roleName
        this.editRolesInfo.roleDesc = data.roleDesc
        this.editRolesInfo.id = data.roleId
        this.editRolesModal = true
      }
    },

    // 编辑角色
    async editRoles ({ id }) {
      const { meta: { status } } = await this.$axios.put(`roles/${id}`, this.editRolesInfo)
      if (status === 200) {
        this.$message.success('操作成功')
        this.editRolesModal = false
      }
    },

    // 删除角色
    async delRoles ({ id }) {
      const { meta: { msg, status } } = await this.$axios.delete(`roles/${id}`)
      if (status === 200) {
        this.$message.success(msg)
        this.getRolesList()
      } else {
        this.$message.error(msg)
      }
    },

    // 展示分配模态框
    async showAssignModal (row) {
      this.assignModal = true
      this.roleId = row.id
      const { meta: { status }, data } = await this.$axios.get('rights/tree ')
      if (status === 200) {
        this.data = data
        const arr = []
        row.children.forEach(item1 => {
          item1.children.forEach(item2 => {
            item2.children.forEach(item3 => {
              arr.push(item3.id)
            })
          })
        })
        console.log(arr)
        console.log(row.children)
        this.$refs.tree.setCheckedKeys(arr)
      }
    },

    // 点击删除权限
    async delRight (row, rightId) {
      const { meta: { msg, status }, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (status === 200) {
        this.$message.success(msg)
        row.children = data
      } else {
        this.$message.error(msg)
      }
      // console.log(meta)
      // console.log(data)
    },

    // 分配权限
    async assginRight () {
      // 全选中的
      const ids = this.$refs.tree.getCheckedKeys()
      // 部分选中的
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      // 权限 ID 列表
      const rids = [...ids, ...halfs].join(',')
      const { meta: { msg, status } } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      console.log(msg)
      console.log(status)
      if (status === 200) {
        this.$message.success(msg)
        this.assignModal = false
        this.getRolesList()
      } else {
        this.$message.error(msg)
      }
      // console.log(rids)
    }

  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="scss" scoped>
.roles{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #C5C5C5;
  }
  .addRoles{
    margin-top: 30px
  }
  .no1{
    padding: 10px 0;
    // background-color: pink;
    border-bottom: 1px dashed #ccc
  }
  .no2 {
    margin-bottom: 10px
  }
  .no3 {
    margin: 0 5px  5px 0;
  }
  .addRolesBtn {
    margin-left: 80px
  }
}
.el-table{
    margin-top: 30px
  }

</style>
