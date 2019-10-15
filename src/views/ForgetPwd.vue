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
    }
</style>

<template>
  <div class="page login">
    <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title" style="padding-left:22px;" >找回密码</h2>
        <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="手机或邮箱"></el-input>
        </el-form-item>
        <el-form-item >
            <el-col :span="12">
                <el-form-item prop="captcha">
                <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码, 单击图片刷新"
                    style="width: 100%;">
                </el-input>
                </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="11">
                <el-form-item>
                    <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
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
            this.refreshCaptcha()
        },
        methods:{
            submitBtn(loginForm){
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {                        
                        this.loading = true;
                        //console.log(this.loginForm);
                        sessionStorage.setItem('account', this.loginForm.account) // 保存用户到本地会话
                        this.$router.push('/safeValidate');

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            refreshCaptcha: function(){
                this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
            },
        }

    }

</script>