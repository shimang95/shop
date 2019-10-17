
<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>

    <!-- 添加用户 -->
     <el-button type="success" plain class="adduser" @click="dialogAddgsVisible=true">添加用户</el-button>

     <!-- 表格 -->
    <template>
      <el-table
        :data="userList"
        border
        style="width: 100%">
        <el-table-column
          prop="username"
          align="center"
          label="姓名"
          width="120">
        </el-table-column>

        <el-table-column
          align="center"
          prop="email"
          label="邮箱">
        </el-table-column>

        <el-table-column
          prop="mobile"
          align="center"
          label="电话">
        </el-table-column>

        <el-table-column
          align="center"
          label="用户状态"
          >
          <template v-slot:default="obj">
            <el-switch
            @change="changeSwitch(obj.row)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作">
          <template v-slot:default='obj'>
            <el-button plain size="small" type="primary" icon="el-icon-edit" @click="showEditDialog(obj.row)"></el-button>
            <el-button plain size="small" type="danger" icon="el-icon-delete" @click="delUser(obj.row.id)"></el-button>
            <el-button plain size="small" type="success" icon="el-icon-check" @click="showAssignDialog(obj.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 分页器 -->
     <el-pagination
      background
      @size-change="changePageSize"
      @current-change="changeCurrentPage"
      :current-page= pagenum
      :page-sizes="[2,4,6,8]"
      :page-size= pagesize
      layout="total, sizes, prev, pager, next, jumper"
      :total= total>
    </el-pagination>

    <!-- 添加用户模态框 -->
    <el-dialog title="添加用户"
      width="40%"
      modal
      :visible.sync="dialogAddgsVisible">
      <el-form
        :model="addUserInfo"
        status-icon
        :rules="rules"
        label-width="100px"
        ref="addForm" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserInfo.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model.number="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
       <el-button @click="closeMadal('dialogAddgsVisible')">取 消</el-button>
       <el-button type="primary" @click="subAddForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户模态框 -->
    <el-dialog
      title="编辑用户"
      width="40%"
      :visible.sync="editModalVisible">
      <el-form :model="editUserInfo" status-icon :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editUserInfo.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="editUserInfo.email" ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input type="tel" v-model="editUserInfo.mobile" ></el-input>
        </el-form-item>

      </el-form>
      <template>
        <span slot="footer">
          <el-button @click="closeMadal('editModalVisible')">取 消</el-button>
          <el-button type="primary" @click="subEditForm(editUserInfo)">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色模态框 -->
    <el-dialog
      title="分配角色"
      width="40%"
      :visible.sync="assign">
      <el-form :model="asignList" status-icon  ref="assignForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{asignList.username}}</el-tag>
        </el-form-item>

        <el-form-item label="角色列表" prop="roleName">
          <!-- <el-tag type="info">{{asignList.roleName}}</el-tag> -->
          <el-select v-model="asignList.rid" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>

      <template>
        <span slot="footer">
          <el-button @click="closeMadal('assign')">取 消</el-button>
          <el-button type="primary" @click="assignRoles">分配</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1, // 当前页
      pagesize: 2, // 每页显示的数目
      total: 10, // 总页数
      userList: [], // 用户数据列表
      dialogAddgsVisible: false, // 添加用户模态框的显示
      editModalVisible: false, // 编辑用户模态框的显示
      assign: false, // 分配模态框的显示
      // 添加用户表单
      addUserInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      // 编辑用户模态框
      editUserInfo: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editRules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      // 分配
      asignList: {
        username: '',
        rid: '',
        id: ''
      },
      // jueseliebiao
      rolesList: []
    }
  },
  methods: {

    // 修改用户状态
    async changeSwitch (row) {
      // console.log(row.id, row.mg_state)
      const { meta: { msg, status } } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (status === 200) {
        // this.$message.success(msg)
        this.$message({
          message: msg,
          type: 'success',
          duration: 1000
        })
      } else {
        // this.$message.error(msg)
        this.$message({
          message: msg,
          type: 'error',
          duration: 1000
        })
      }

      // console.log(msg)
      // console.log(status)
      // console.log(data)
    },

    // 获取用户列表数据
    async getUserList () {
      const { meta: { msg, status }, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(msg)
      }
      // console.log(msg)
      // console.log(status)
      // console.log(data)
    },
    changePageSize (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    changeCurrentPage (val) {
      this.pagenum = val
      this.getUserList()
    },

    // 搜索
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },

    // 删除用户
    async delUser (id) {
      try {
        await this.$confirm('确认删除该用户吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta: { msg, status } } = await this.$axios.delete(`users/${id}`)
        if (status === 200) {
          this.$message.success(msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      } catch (e) {
        // console.log(e)
      }
    },

    // 添加用户
    async subAddForm () {
      try {
        await this.$refs.addForm.validate()
        const { meta: { msg, status } } = await this.$axios.post('users', this.addUserInfo)
        if (status === 201) {
          // 成功提示
          this.$message.success(msg)
          // 重置表单
          this.$refs.addForm.resetFields()
          // 重新渲染最后一页
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          // 重新渲染视图
          this.getUserList()
          // 隐藏模态框
          this.dialogAddgsVisible = false
        } else {
          this.$message.error(msg)
        }
      } catch (e) {
        // console.log(e)
      }
    },

    // 展示编辑模态框
    showEditDialog ({ id, username, email, mobile }) {
      this.editModalVisible = true
      this.editUserInfo.id = id
      this.editUserInfo.username = username
      this.editUserInfo.email = email
      this.editUserInfo.mobile = mobile
    },
    async subEditForm (editForm) {
      // this.editModalVisible = false
      const { meta: { msg, status } } = await this.$axios.put(`users/${editForm.id}`, this.editUserInfo)
      if (status === 200) {
        this.$message.success(msg)
        this.getUserList()
        this.editModalVisible = false
      } else {
        this.$message.error(msg)
      }
    },

    // 展示分配模态框
    async showAssignDialog (row) {
      this.assign = true
      this.asignList.id = row.id
      this.asignList.username = row.username
      // 根据用户ID 获取用户角色
      const userRoles = await this.$axios.get(`users/${row.id}`)
      if (userRoles.meta.status === 200) {
        const rid = userRoles.data.rid
        this.asignList.rid = rid === -1 ? '' : rid
      }
      // 获取角色信息
      const { meta: { status }, data } = await this.$axios.get('roles')
      if (status === 200) {
        this.rolesList = data
      }
    },
    // 确认分配角色
    async assignRoles () {
      const { id, rid } = this.asignList
      // 分配请求
      if (!rid) return this.$message.error('请选择角色')
      const { meta: { msg, status } } = await this.$axios.put(`users/${id}/role`, { rid })
      if (status === 200) {
        this.$message.success(msg)
        this.assign = false
      } else {
        this.$message.error(msg)
      }
    },

    // 关闭模态框
    closeMadal (param) {
      if (param === 'dialogAddgsVisible') {
        this.$refs.addForm.resetFields()
      }
      this[param] = false
      this.$message.info('已取消操作')
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="scss" scoped>
.user{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #C5C5C5;
  }
  .input-with-select {
    width: 300px;
    margin-top: 20px;
    margin-right: 20px;
  }
  .adduser{
    margin-top: 30px;
  }
  .el-table{
    margin-top: 30px;
  }
  .el-pagination{
    margin-top: 20px;
  }
}

</style>
