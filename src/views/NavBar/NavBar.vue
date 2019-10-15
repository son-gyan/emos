<style scoped lang="scss">
    .menu-bar-container {
        position: fixed;
        /* width: 200px; */
        top: 0px;
        left: 0;
        bottom: 0;
        z-index: 1020;
        background-color: #000;
        .el-menu {
            position:absolute;
            top: 60px;
            bottom: 0px;
            text-align: left;
            // background-color: #2968a30c;
        }
        .logo {
            position:absolute;
            top: 0px;
            height: 60px;   
            line-height: 60px;
            //background: #545c64;
            background: #000;
            cursor:pointer;
            img {
                width: 40px;
                height: 40px;
                border-radius: 0px;
                margin: 10px 10px 10px 10px;
                float: left;
            }
            div {
                font-size: 25px;
                color: white;
                text-align: left;
                margin:0 20px;
            }
        }
        .menu-bar-width {
            width: 200px;
            border-right: none;
        }
        .menu-bar-collapse-width {
            width: 65px;
        }
        .menuImg{
            position:absolute;
            bottom: 20px;
            width: 100%; 
            margin-top: 40px;
        }
    } 
       
</style>
<style lang="scss"> 
.menu-bar-container {   
    .el-menu{
        background-color: #000;
    }
    .el-submenu__title i{
        color:#fff;
    }
    .el-menu-item i{
        color:#fff
    }
    .fa.fa-lg {
        font-size: 18px;
        line-height: 1;
        vertical-align: middle;
        width: 24px;
        margin-right: 5px;
        text-align: center;
    }
    .el-menu.menu-bar-width{        
        border-top: 3px solid #fff;
        background-color: #000;
        color:#fff;
    }
    .el-menu-item,.el-submenu__title{
        color:#fff;
    }
    .el-submenu__title{
        &:hover{
            color: #fff;
            background-color: rgba(0, 204, 153, 1);
        }
    }
    .el-menu-item:focus, .el-menu-item:hover{
        color: #fff;
        background-color: rgba(0, 204, 153, 1);
    }
    .el-menu-item.is-active {
        color: #fff;
        background-color: rgba(0, 204, 153, 1);
    }
}
</style>

<template>
	<div class="menu-bar-container">
        <!-- logo -->
        <div class="logo"  :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
            @click="$router.push('/')"><!-- :style="{'background-color':themeColor}" -->
            <img v-if="collapse" src="@/assets/logo.png"/> <div>{{collapse?'':appName}}</div>
        </div>
        <!-- 导航菜单 -->
        <el-menu ref="navmenu" :default-active="defaultActive" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
            :collapse="collapse" :collapse-transition="false" :unique-opened="true"
            @open="handleopen" @close="handleclose" @select="handleselect"
            > <!-- background-color="#000" text-color="#fff" -->
            <!-- 导航菜单树组件，动态加载菜单 -->
            <menu-tree v-for="item in navTree" :key="item.id" :menu="item"></menu-tree>
            <img src="@/assets/u123.png" class="menuImg"/>
        </el-menu>
	</div>
</template>
<script>
    import { mapState } from 'vuex'
    import MenuTree from "@/components/MenuTree"
    export default {
        components:{
            MenuTree
        },
        data(){
            return {
                defaultActive : ""
            }
        },
        computed: {
            ...mapState({
                appName: state=>state.app.appName,
                themeColor: state=>state.app.themeColor,
                collapse: state=>state.app.collapse,
                navTree: state=>state.menu.navTree
            }),
            mainTabs: {
                get () { return this.$store.state.tab.mainTabs },
                set (val) { this.$store.commit('updateMainTabs', val) }
            },
            mainTabsActiveName: {
                get () { return this.$store.state.tab.mainTabsActiveName },
                set (val) { this.$store.commit('updateMainTabsActiveName', val) }
            }
        },
        watch: {
            $route: 'handleRoute'
        },
        created () {
            this.handleRoute(this.$route)
            //debugger
            if(this.$route.path == '/index'){                
                this.defaultActive = ''+(this.$route.meta.index+1);
            }else{
                this.defaultActive = ''+this.$route.meta.index;
            }
            
            
        },
        methods: {
            handleopen() {
                //console.log('handleopen')
            },
            handleclose() {
                //console.log('handleclose')
            },
            handleselect(a, b) {
                //console.log(this.navTree)
                //debugger
            },
            // 路由操作处理
            handleRoute (route) {                
                //debugger;
                // tab标签页选中, 如果不存在则先添加
                var tab = this.mainTabs.filter(item => item.name === route.name)[0]
                if (!tab) {
                    tab = {
                        name: route.name,
                        title: route.name,
                        icon: route.meta.icon
                    }
                    this.mainTabs = this.mainTabs.concat(tab)
                }
                this.mainTabsActiveName = tab.name
                // 切换标签页时同步更新高亮菜单
                //debugger
                let self = this;
                this.$nextTick(() => {  
                    if(self.$refs.navmenu != null) {
                        if(route.path == '/index'){
                            self.$refs.navmenu.activeIndex = '' + (route.meta.index+1);
                        }else{                            
                            self.$refs.navmenu.activeIndex = '' + route.meta.index
                        }
                        self.$refs.navmenu.initOpenedMenu()
                    }
                })
            }
        }
    }


</script>