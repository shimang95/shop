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
        <el-aside width="200px">Aside</el-aside>
        <!-- 主体内容 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
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
    }
  }

/*  methods: {
    // check () {
    //   if (!sessionStorage.getItem('token')) {
    //     sessionStorage.clear()
    //     this.$router.push('/login')
    //   }
    // }
  }

  // mounted () {
  //   // this.check()
  // } */
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
  }
  .el-main{
  background-color: #ecf0f1;
  }
}
</style>
