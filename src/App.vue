<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () { 
    //在页面加载时读取sessionStorage里的状态信息 
    if (sessionStorage.getItem("store") ) { 
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 
    //在页面刷新时将vuex里的信息保存到sessionStorage里 
    window.addEventListener("beforeunload",()=>{ 
      sessionStorage.setItem("store",JSON.stringify(this.$store.state)) 
    }) 
  }

}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}


.el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #409EFF !important;
}

.el-message{
  top:20px !important;
}
#app th .el-checkbox {
  display: none;
}

/* body .el-table th.gutter,
body .el-table colgroup.gutter{
  display: table-cell!important;
} */
// 全局设置
/* body .el-table th.gutter{
    display: table-cell!important;
}
 
body .el-table colgroup.gutter{
    display: table-cell!important;
} */
.el-table--border th.gutter:last-of-type{ display: table-cell !important; width:50px !important; }
table{
  overflow: hidden;
}

/* .table-fixed {
  .el-table__fixed-right {
    height: 100% !important
  }
} */


.el-loading-spinner .path{
  stroke:#ed4014!important;
}
.el-loading-spinner .el-loading-text{
  color: #ed4014!important;
}

.el-loading-parent--hidden {
    margin: 0;
}
/* .el-input__suffix .el-input__suffix-inner {
    pointer-events: none;
} */
</style>
