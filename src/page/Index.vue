/* eslint-disable vue/no-parsing-error */
<template>
    <el-container class="index">
      <!-- header 部分 -->
      <el-header>
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="logout">
          欢迎光临~
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-menu router
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          :default-active="defaultActive"
          active-text-color="#ffd04b">

            <el-submenu  v-for="item in menusInfo" :key="item.id" :index="item.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>

                <el-menu-item v-for="submenus in item.children" :key="submenus.id" :index="submenus.path">
                  <i class="el-icon-menu"></i>
                  {{submenus.authName}}
                </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  computed: {
    defaultActive () {
      return this.$route.path.slice(1)
    }
  },
  data () {
    return {
      menusInfo: []
    }
  },
  methods: {
    logout () {
      this.$confirm('亲，您忍心退出吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('成功退出')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          message: '退出已取消',
          type: 'info'
        })
      })
    },
    async getMenus () {
      const { meta: { status }, data } = await this.$axios.get('menus')
      if (status === 200) {
        this.menusInfo = data
      }
      // console.log(msg)
      // console.log(status)
      // console.log(data)
    }
  },
  created () {
    this.getMenus()
  }
}
</script>

<style lang='scss' scoped>
.index{
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    height: 60px;
    display: flex;
    .logo{
      width: 200px;
      float: left;
      img{
        height: 40px;
        margin: 10px;
      }
    }
    .title{
      flex: 1;
      text-align: center;
      h1{
        height: 60px;
        line-height: 60px;
      }
    }
    .logout{
      width: 200px;
      float: right;
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      text-align: center;
      a{
        color: orange;
      }
    }
  }
  .el-aside{
    background-color: #545c64;
    .el-menu{
      border: 0;
      .el-menu-item-group{
        .el-menu-item-group__title{
          padding: 0;
        }
      }
    }
  }
  .el-main{
  background-color: #ecf0f1;
  }
}
</style>
