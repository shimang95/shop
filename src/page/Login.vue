<template>
  <div class="login">
    <el-form class="loginForm" status-icon :rules="rules" label-width="100px" ref="ruleForm" :model='ruleForm'>
      <el-form-item>
       <img class="logo" src="../assets/avatar.jpg" alt="">
      </el-form-item>
      <el-form-item  label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item  label="密  码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm')" type="primary" class="loginBth">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async submitForm (formName) {
      try {
        await this.$refs[formName].validate()
        this.getInfo()
      } catch (e) {

      }
    },
    async getInfo () {
      const res = await this.$axios.post('login', this.ruleForm)
      const { meta: { msg, status }, data } = res
      // console.log(msg, status, data)
      if (status === 200) {
        this.$message({
          message: msg,
          type: 'success',
          duration: 2000
        })
        localStorage.setItem('token', data.token)
        this.$router.push('/')
      } else {
        this.$message({
          message: msg,
          type: 'warning',
          duration: 2000
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  background-color: skyblue;
  width: 100%;
  height: 100%;
  position: relative;;
  .loginForm{
    width: 400px;
    padding: 20px;
    padding-top: 70px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 20px;
    .loginBth{
      margin-right: 70px;
    }
    .logo{
      position: absolute;
      left: 38%;
      transform: translateX(-50%);
      width: 130px;
      // height: 100px;
      top: -130px;
      border: 5px solid #fff;
      border-radius: 50%;
    }
  }
}
</style>
