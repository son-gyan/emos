<style scoped lang="scss">
    .headbar {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1030;
        height: 60px;
        line-height: 60px;
        border-color: rgba(180, 190, 190, 0.8);
        border-left-width: 1px;
        border-left-style: solid;
        background: #fff;
        border-bottom: 1px solid rgba(180, 190, 190, 0.8);
    }
    .hamburg, .navbar {
        float: left;
    }
    .navbar {
        /* width: 30%; */
    }
    .toolbar {
        float: right;
    }
    .lang-item {
        font-size: 16px;
        padding-left: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
        cursor: pointer;
    }
    .lang-item:hover {
        font-size: 18px;
        background: #b0d6ce4d;
    }
    .user-info {
        font-size: 20px;
        color: #000;
        cursor: pointer;
        img {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            margin: 10px 0px 10px 10px;
            float: right;
        }
    }
    .badge {
        line-height: 18px;
    }
    .position-left {
        left: 200px;
    }
    .position-collapse-left {
        left: 65px;
    }
    .el-form-tree{        
        padding-top:10px;
    }
</style>
<style lang="scss">
.el-form-tree{
    .el-form-item__label{
        color:#000;
    }
    .el-form-item__content{
        float: left;
        width: 200px;
    }
}
.headbar{
    .el-menu--horizontal>.el-menu-item.is-active{
        border:none;
    }
}
.toolbar{
    .el-menu.el-menu--horizontal{
        color:#000
    }
}
.userPopover.el-popover{
    overflow: hidden;
}
</style>

<template> 
    <div class="headbar"  
        :class="$store.state.app.collapse?'position-collapse-left':'position-left'"> <!-- :style="{'background':themeColor}" -->
        <!-- 导航收缩 -->
        <span class="hamburg">
            <el-menu class="el-menu-demo" text-color="#000"  mode="horizontal"> <!--vertical  :background-color="themeColor"  :active-text-color="themeColor"-->
                <el-menu-item index="1" @click="onCollapse">
                    <i class="el-icon-s-fold" style="color:#000" v-if="!collapse"></i>
                    <i class="el-icon-s-unfold" style="color:#000" v-if="collapse"></i>
                </el-menu-item><!-- <hamburger :isActive="collapse"></hamburger> -->
            </el-menu>
        </span>
        <!-- 导航菜单 -->
        <span class="navbar" v-if='deptDown'>
            <el-form class="el-form-tree" :model="treeForm">
                <el-form-item label="组织架构：" prop="parentName">
                    <popup-tree-input
                        :data="popupTreeData"
                        :props="popupTreeProps"
                        :disabled="disabled"
                        :prop="treeForm.parentName==null?'请选择':treeForm.parentName"
                        :nodeKey="''+treeForm.fateherId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
            </el-form>
        </span>
        <!-- 工具栏 -->
        <span class="toolbar">
            <el-menu class="el-menu-demo" mode="horizontal"> <!--  :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" -->
                <!-- 主题切换 -->
                <el-menu-item index="1">                
                <!-- <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker> -->
                </el-menu-item>
                <!-- 我的私信 -->
                <!-- <el-menu-item index="3" v-popover:popover-message>                    
                    <el-badge :value="5" :max="99" class="badge" type="success">
                        <li style="color:#fff;" class="fa fa-envelope-o fa-lg"></li>
                    </el-badge>
                    <el-popover ref="popover-message" placement="bottom-end" trigger="click">
                        <message-panel :messageData="messageData"></message-panel>
                    </el-popover>
                </el-menu-item> -->
                <!-- 系统通知 -->
                <!-- <el-menu-item index="4" v-popover:popover-notice>                    
                    <el-badge :value="4" :max="99" class="badge" type="success">
                        <li style="color:#fff;" class="fa fa-bell-o fa-lg"></li>
                    </el-badge>
                    <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
                        <notice-panel :noticeData="noticeData"></notice-panel>
                    </el-popover>
                </el-menu-item> -->
                <el-menu-item index="5" v-popover:popover-personal>
                <!-- 用户信息 -->
                    <span class="user-info"><img :src="user.avatar" />当前用户：{{user.name}}</span>
                    <el-popover popper-class="userPopover" ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
                        <personal-panel :user="user"></personal-panel>
                    </el-popover>
                </el-menu-item>
            </el-menu>
        </span>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import hamburger from '@/components/Hamburger'
import MessagePanel from "@/views/Core/MessagePanel"
import NoticePanel from "@/views/Core/NoticePanel"
import PersonalPanel from "@/views/Core/PersonalPanel"
import PopupTreeInput from "@/components/PopupTreeInput"
import { format } from "@/utils/datetime"
import { toTreeData } from "@/utils/tree"
export default {
    components:{
        hamburger,
        MessagePanel,
        NoticePanel,
        PersonalPanel,
        PopupTreeInput
    },
    data() {
        return {
            popupTreeData: [],
            popupTreeProps: {
				label: 'orgName',
				children: 'children'
            },
            treeForm: {
                id: "",
                name: '',
                fateherId: 0,
                parentName: '',
                address: '',
                note:''
            },
            user: {
                name: "Louis",
                avatar: require("@/assets/user.png"),
                role: "超级管理员",
                registeInfo: "注册时间：2018-12-20 "
            },
            activeIndex: '1',
            langVisible: false,
            messageData:[
                {
                    key: "1",
                    avatar:'@/assets/user.png',
                    content:'你修改了用户密码',
                    sender:'诸葛亮',
                    time:'5分钟前'
                }
            ],
            noticeData:[
                {
                    key: "1",
                    icon:'fa fa-envelope-o',
                    content:'你修改了用户密码'
                }
            ],
            treeList:[],
            ids:'',
            disabled:false
        }
    },
    mounted() {
        this.sysName = "eoms"
        var user = JSON.parse(localStorage.getItem("user"))
        //console.log(user);
        //debugger
        if (user) {
            this.user.name = user.realName
            this.user.avatar = user.user_token.avatar //require("@/assets/user.png")
            this.user.registeInfo = format(user.regTime)
        }
        this.getTree();
        
        window.addEventListener('beforeunload', this.handleRoute(this.$route))
    },    
    computed:{
        ...mapState({
            themeColor: state=>state.app.themeColor,
            collapse: state=>state.app.collapse,
            deptDown:state=>state.app.deptDown
        }),
        deptName(){
            //console.log(this.$store.state.menu.deptName);
            return this.$store.state.menu.deptName 
        },
    },
    watch:{
        deptName(val){
            //debugger
            this.treeForm.parentName = val            
            //console.log(this.treeForm.parentName);
            //debugger
        },
        $route: 'handleRoute'
    },
    methods: {
        handleRoute(route){
            if(route.path == '/User/User' || route.path == '/warn/warnDetail' || route.path == '/device/manager'){
                this.$store.commit('setDeptIds', "")
                localStorage.setItem('deptIds',"")
                this.treeForm.parentName = ""
            }
        },
        // 折叠导航栏
        onCollapse(){
            this.$store.commit("onCollapse");
        },
        // 机构树选中
        handleTreeSelectChange (data, node) {
            //debugger
            this.treeForm.fateherId = data.id
            this.treeForm.parentName = data.orgName
            this.treeForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.treeForm.firstLevelId = data.firstLevelId
            }else{
                this.treeForm.firstLevelId = data.id
            }
            //拼接的id字符串
            localStorage.setItem('deptIds','')
            this.ids=""
            this.ids= this.getNodes(data); 
            this.ids = this.ids.substr(0, this.ids.length - 1)         
            //console.log(this.ids);
            this.$store.commit('setDeptIds', this.ids)
            localStorage.setItem('deptIds',this.ids)
            //debugger
        }, 
        //获取树形菜单
        getTree: function() {
            this.$api.dept.getTree().then(res => {
                if(res.content.length>0){                    
                    //this.treeList = toTreeData(res.content);
                    this.treeList = res.content;
                    this.popupTreeData = this.treeList;
                    //this.popupTreeData = this.getParentMenuTree(res.data.record)
                    this.$store.commit('setDropDownTree', this.treeList)  
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //获取树形菜单子门店id
        getNodes(treeNode){
            //debugger            
            //拼接字符串     
            this.ids+=treeNode.id+",";          
            //获取所有子节点
            var childNodes=treeNode.children;
            //循环子节点
            for(var i=0;i<childNodes.length;i++){
            //递归调用
                this.getNodes(childNodes[i]);
            }
            return this.ids;          
        },
    }

}
</script>
