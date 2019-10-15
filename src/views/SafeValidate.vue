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
    .disabled{
        background-color: #ddd;
        border-color: #ddd;
        color:#57a3f3;
        cursor: not-allowed; // 鼠标变化
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
        .el-button{
            padding: 12px 0;
        }       
    }
</style>

<template>
  <div class="page login">
    <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title" style="padding-left:22px;" >安全验证</h2>
        <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="手机"></el-input>
        </el-form-item>
        <div class="block" style="text-align:left;margin-top: -9px;margin-bottom:10px;">
            <span class="demonstration">点击获取验证码，短信将发送至安全手机</span>
        </div>
        <el-form-item >
            <el-col :span="16">
                <el-form-item prop="captcha">
                <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码"
                    style="width: 100%;">
                </el-input>
                </el-form-item>
            </el-col>
            <!-- <el-col class="line" :span="1">&nbsp;</el-col> -->
            <el-col :span="8">
                <el-form-item>
                    <el-button type="primary" @click="getCode" :class="{disabled: !this.canClick}" style="width:100%">{{content}}</el-button>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:48%;" @click.native.prevent="submitBtn('loginForm')" :loading="loading">下一步</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
    import mock from "@/mock/index.js";
    import Cookies from "js-cookie";
    import router from "@/router";
    export default{
        name: "Login",
        data() {
            return {
                loading: false,
                content: '获取验证码',
                totalTime: 10,
                canClick: true, //添加canClick
                loginForm: {
                    account: '',
                    captcha:'',
                    src: '',
                    type:[],
                    checkedServer: true,
                    checkedForget: true
                },
                fieldRules: {
                    account: [
                        { required: true, message: '请输入手机或邮箱', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    captcha: [
                      { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            //this.refreshCaptcha()
        },
        methods:{
            submitBtn(loginForm){
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {                        
                        this.loading = true;
                        //console.log(this.loginForm);
                        sessionStorage.setItem('account', this.loginForm.account) // 保存用户到本地会话
                        this.$route.push('/safeValidate');

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getCode(){
                if (!this.canClick) return  //改动的是这两行代码
                    this.canClick = false
                    this.content = this.totalTime + 's后重新发送'
                let clock = window.setInterval(() => {
                    this.totalTime--
                    this.content = this.totalTime + 's后重新发送'
                    if (this.totalTime < 0) {
                        window.clearInterval(clock)
                        this.content = '重新获取验证码'
                        this.totalTime = 10
                        this.canClick = true  //这里重新开启
                    }
                },1000)
            }
        }

    }

</script>