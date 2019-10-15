<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #505458;
    }
    /* .remember {
      margin: 0px 0px 35px 0px;
    } */
    .serverInfo{
        float:left;
    }
    .forgetPwd{
        float:right;
        margin-right:0;
    }
    // drag verify
    .drag_verify {
        border-radius: 4px!important;
        .dv_progress_bar {
            border-radius: 4px!important;
        }
        .dv_handler {
            border-radius: 4px!important;
            top: 1px!important;
        }
        .dv_text{
            background: -webkit-gradient(linear,left top,right top,color-stop(0, #4d4d4d),color-stop(0.4, #4d4d4d),color-stop(0.5, white),color-stop(0.6, #4d4d4d),color-stop(1, #4d4d4d)); 
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            -webkit-text-size-adjust: none;
            -webkit-animation: slidetounlock 5s infinite;
        }
        @-webkit-keyframes slidetounlock {  
            0% {background-position: -200px 0;}
            100%{background-position: 200px 0;}
        }
    }
  }
</style>
<style lang="scss" >
    .login {
        .el-checkbox__input.is-checked+.el-checkbox__label{
            color:#333;
            
        }
        .server{
            float: left;
            color:#409EFF;
            text-decoration: none;
            cursor: pointer;
        } 
        .forget{
            float: right;
        }
        .drag_verify .dv_handler{
            cursor: grab;
        }       
    }
</style>

<template>
  <div class="page login">
    <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title" style="padding-left:22px;" >DVO运维平台登录</h2>
        <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" :show-password="passwordStatus" 
                v-model="loginForm.password" @keyup.enter.native="login('loginForm')" 
                auto-complete="off" placeholder="密码"
                @input="e => loginForm.password = validPwd(e)"></el-input>
        </el-form-item>
        <el-form-item>
            <drag-verify 
                :width="350"
                :height="40"
                handlerIcon='el-icon-d-arrow-right'
                successIcon='el-icon-check'
                text="请将滑块拖动到右侧"
                success-text="验证成功" 
                background="#ddd"
                progress-bar-bg="#2ACBF8"
                text-size="14px"
                :circle="false"
                ref="Verify">
            </drag-verify> 
        </el-form-item>
        <el-form-item  prop="type">
            <el-checkbox-group v-model="loginForm.type">
                <el-checkbox  v-model="loginForm.checkedServer" checked class="remember serverInfo" name='type'>同意并遵守</el-checkbox>                
            </el-checkbox-group>
            <span class="server" @click="clickServer">《服务条款》</span>
            <el-checkbox v-model="loginForm.checkedForget"  class="remember forgetPwd">记住用户名和密码</el-checkbox>            
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:48%;" @click.native.prevent="login('loginForm')"  :loading="loading">登 录</el-button>
        </el-form-item>
        <!-- <el-form-item>
            <span class="server forget" @click="hanldeForget">忘记密码？</span>
        </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
    import mock from "@/mock/index.js";
    import Cookies from "js-cookie";
    import router from "@/router";
    import dragVerify from 'vue-drag-verify'
    export default{
        name: "Login",
        components:{
            dragVerify
        },
        data() {
            return {
                loading: false,
                loginForm: {
                    account: '',
                    password: '',
                    captcha:'',
                    src: '',
                    type:[],
                    checkedServer: true,
                    checkedForget: true
                },
                fieldRules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    // captcha: [
                    //   { required: true, message: '请输入验证码', trigger: 'blur' }
                    // ]
                    type: [
                        { required: true, message: '您还未接受服务条款', trigger: 'change' }
                    ],
                },
                passwordStatus:true
            }
        },
        created(){
            this.BrowserType()
        },
        //页面加载调用获取cookie值
        mounted() {
            this.getCookie();
            var self = this;
            document.onkeydown = function(e) {
                var key = window.event.keyCode;
                if (key == 13) {
                    self.login('loginForm');
                }
            }
        },
        methods:{
            //判断当前浏览类型
            BrowserType()
            {
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                var isIE = userAgent.indexOf("MSIE") > -1; //判断是否IE浏览器 userAgent.indexOf("compatible") > -1 && 
                var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
                var u = window.navigator.userAgent.toLocaleLowerCase(),
                    ie11 = /(trident)\/([\d.]+)/,
                    b = u.match(ie11);
                if(isIE||isEdge||b){
                    this.passwordStatus =false
                }else{
                    this.passwordStatus =true
                }
            },
            //获取cookie
            getCookie(){
                //debugger
                if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'userName') {
                            //  console.log(arr2[1])
                            this.loginForm.account = arr2[1]; //保存到保存数据的地方
                        } else if (arr2[0] == 'password') {
                            // console.log(arr2[1])
                            this.loginForm.password = arr2[1];
                        }
                    }
                    this.loginForm.checkedForget = true;
                }else{
                    this.loginForm.checkedForget = false;
                }
            },
            //设置cookie
            setCookie(c_name, c_pwd, exdays) {
                var exdate = new Date(); //获取时间
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
                //字符串拼接cookie
                window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
                window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
            },
            //清除cookie
            clearCookie: function() {
                this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
            },
            login(loginForm){
                let $self = this
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        // 如果没有滑动到右侧，则提示
                        if (!$self.$refs.Verify.isPassing) {
                            $self.$message.warning('请将滑块拖动到右侧')
                            return false
                        }                        
                        this.loading = true;
                        //console.log(this.loginForm);
                        let userInfo = {account:$self.loginForm.account, pwd:$self.loginForm.password}
                        $self.$api.login.login(userInfo).then((res) => {
                            if(res.messages[0] == "10003"){
                                $self.resetVerify();
                                $self.$message({
                                    message: '用户已失效',
                                    type: 'error'
                                })
                            }else if(res.messages[0] == "10001"||res.code == "10002"){
                                $self.resetVerify();
                                $self.$message({
                                    message: '用户名或密码错误',
                                    type: 'error'
                                })
                            }else if(res.messages[0] == "The number of requests exceeded the limit.") {
                                $self.resetVerify();
                                $self.$message({
                                    message: '系统登录失败超10次，请稍后重试!',
                                    type: 'error'
                                })
                            } else {
                                var data = res.content;
                                //debugger
                                //Cookies.set('token', data.Access_Token) // 放置token到Cookie
                                //Cookies.set('JSESSIONID', data.Access_Token) // 放置JSESSIONID到Cookie
                                localStorage.setItem('Authorization', data.user_token.token) // 放置token到Cookie
                                var userInfo = data.user;
                                userInfo.userRole = data.user_role;
                                userInfo.user_token = data.user_token
                                localStorage.setItem('user',  JSON.stringify(userInfo)) // 保存用户到本地会话
                                $self.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
                                let attr = {
                                    parentId: 'fatherId',
                                    gmtCreate: "gmtCreate",
                                    icon: "icon",
                                    id: 'id',
                                    level: 'menuLevel',
                                    name: "menuName",
                                    type: 'menuType',
                                    url: "menuUrl",
                                    sort: 'sort',
                                    rootId: 0
                                };
                                let menuTree = $self.toTreeData(data.user_module,attr);
                                //console.log(menuTree); 
                                $self.$store.commit('setNavTree',menuTree)
                                //sessionStorage.setItem('menuTree',JSON.stringify(menuTree))
                                //console.log(this.$store.state.menu.navTree);
                                const self = this;
                                //判断复选框是否被勾选 勾选则调用配置cookie方法
                                if (self.loginForm.checkedForget == true) { 
                                    //传入账号名，密码，和保存天数3个参数
                                    self.setCookie(self.loginForm.account, self.loginForm.password, 7);
                                }else {
                                    //console.log("清空Cookie");
                                    //清空Cookie
                                    self.clearCookie();
                                }                            
                                this.$router.push('/index')  // 登录成功，跳转到主页
                            }
                            this.loading = false
                        }).catch((res) => {
                            this.loading = false;
                            $self.resetVerify();
                        });
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
             resetVerify () {
                // 恢复滑动到原点
                this.$refs.Verify.isMoving = false
                this.$refs.Verify.x = 0
                this.$refs.Verify.isPassing = false
                this.$refs.Verify.$refs.handler.style.left = '0';
                this.$refs.Verify.$refs.progressBar.style.width = '0';
            },
            clickServer(){
                //this.$router.push('/serverInfo') 
                let routeData = this.$router.resolve({
                    name: "服务条款"
                });
                window.open(routeData.href, '_blank');
            },
            hanldeForget(){
                this.$router.push('/forgetPwd')
            },
            toTreeData(data, attr) {
                let tree = [];
                let resData = data;
                for (let i = 0; i < resData.length; i++) {
                    if (resData[i].fatherId === attr.rootId) {
                        let obj = {
                            parentId: resData[i][attr.parentId],
                            gmtCreate: resData[i][attr.gmtCreate],
                            icon:resData[i][attr.icon],
                            id: resData[i][attr.id],
                            level: resData[i][attr.level],
                            name: resData[i][attr.name],
                            type: resData[i][attr.type],
                            url: resData[i][attr.url],
                            sort: resData[i][attr.sort],
                            children: []
                        };
                        tree.push(obj);
                        resData.splice(i, 1);
                        i--;
                    }
                }
                var run = function(treeArrs) {
                    if (resData.length > 0) {
                        for (let i = 0; i < treeArrs.length; i++) {
                            //console.log(i);
                            for (let j = 0; j < resData.length; j++) {
                                if (treeArrs[i].id === resData[j][attr.parentId]) {
                                    let obj = {
                                        parentId: resData[j][attr.parentId],
                                        gmtCreate: resData[j][attr.gmtCreate],
                                        icon:resData[j][attr.icon],
                                        id: resData[j][attr.id],
                                        level: resData[j][attr.level],
                                        name: resData[j][attr.name],
                                        type: resData[j][attr.type],
                                        url: resData[j][attr.url],
                                        sort: resData[j][attr.sort],
                                        children: []
                                    };
                                    treeArrs[i].children.push(obj);
                                    resData.splice(j, 1);
                                    j--;
                                }
                            }
                            run(treeArrs[i].children);
                        }
                    }
                };
                run(tree);
                return tree;
            }
        }

    }

</script>