<template>
  <div class="index" @load="check">
    <h1>这是首页</h1>
  </div>
</template>

<script>
export default {
  methods: {
    check () {
      if (!sessionStorage.getItem('username')) {
        sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    this.check()
  }
}
</script>

<type>

</type>
