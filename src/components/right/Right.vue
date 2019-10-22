<template>
  <div class="right">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="rightList" style="width: 100%">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级">
        <!-- 自定义此列的内容 作用域插槽scopedSlot -->

        <template slot-scope="{row: {level}}">
          <!-- <span>{{level}}</span> -->
          <span v-if="level === '0'">一级</span>
          <span v-else-if="level === '1'">二级</span>
          <span v-else>三级</span>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRight () {
      const { meta: { status }, data } = await this.$axios.get('rights/list')
      if (status === 200) {
        this.rightList = data
      }
    }
  },
  created () {
    this.getRight()
  }
}
</script>

<style lang="scss">
.right{
  .el-breadcrumb{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #C5C5C5;
  }
  .el-table{
    margin-top: 30px
  }
}

</style>
