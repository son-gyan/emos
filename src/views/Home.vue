<style lang="scss">
.el-table td, .el-table th{
    text-align: center
}
</style>

<template>
  <div class="container">
      <!-- 导航菜单栏 -->
      <nav-bar></nav-bar>
      <!-- 头部区域 -->
      <head-bar></head-bar>
      <!-- 主内容区域 -->
      <main-content></main-content>
  </div>
</template>
<script>
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"
export default {
    components:{
        HeadBar,
        NavBar,
        MainContent
    }
}
</script>
