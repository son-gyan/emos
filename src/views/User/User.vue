<style lang="scss" scoped>
.user{
    background-color: #fff;
    padding: 0 10px 10px;
    .roleSelect{
        width: 100%
    }
    .reorder{
        float:right;
        position: relative;
    }
    .exportDialog{
        position: absolute;
        bottom: 4px;
        right: 20px;
        background-color: #fff;
        width: 140px;
        z-index: 9999;
        padding-bottom: 10px;
        .exportList{
            padding: 0 10px;
            list-style-type: none;
            text-align: left;
        }
    }
}
</style>

<template>
    <div class="user">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div class="buttons" style="display:inline-block;">
                    <el-button type="primary" @click="addUser">
                        <i class="fa fa-plus"></i>
                        <span>新建用户</span>
                    </el-button>
                    <!-- <el-button type="primary" @click="delUser">
                        <i class="fa fa-trash"></i>
                        <span>删除用户</span>
                    </el-button> -->                    
                </div>
                <div style="margin: 20px 0;display:inline-block;min-width:320px">
                    <el-input placeholder="按邮箱、手机、真实姓名等条件搜索" v-model="searchVal" class="input-with-select" 
                        @input="e => searchVal = validForbid(e)"
                        @keyup.enter.native="searchSubmit">
                        <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <!-- <el-col>
                <div class="reorder">
                    <el-button class="reorderBtn" icon="fa fa-reorder fa-lg" @click.stop="reorder" type="text"> 
                    </el-button>
                    <div class="exportDialog" v-if="exportDialog">
                        <ul class="exportList">
                            <li>
                                <el-checkbox label="在线状态" v-model="exportSelection.online" @change="exportCheckChange"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="设备名称" v-model="exportSelection.name"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="管理地址"  v-model="exportSelection.managerAddress"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="出口地址"  v-model="exportSelection.address"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="分组"  v-model="exportSelection.group"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="软件版本"  v-model="exportSelection.edition"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="最后离线时间"  v-model="exportSelection.outlineTime"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="设备型号"  v-model="exportSelection.type"></el-checkbox>
                            </li>
                            <li>
                                <el-checkbox label="备注"  v-model="exportSelection.note"></el-checkbox>
                            </li>
                        </ul>
                        <div class="footer">
                            <el-button class="exportBtn" @click="exportBtn" size="small">
                                导出
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-col> -->
            <el-col>                
                <!-- <el-scrollbar
                    class="default-scrollbar"
                    wrap-class="default-scrollbar__wrap"
                    view-class="p20-scrollbar__view"
                    > -->                    
                    <div class="main">                        
                        <el-table
                            ref="multipleTable"
                            border
                            :data="tableData.list"
                            style="width: 100%"
                            height="600"
                            @selection-change="handleSelectionChange"
                            >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                            <el-table-column prop="emailAddr" label="登录邮箱" min-width="150" align="center" v-if="emailStatus"></el-table-column>
                            <el-table-column prop="realName" label="真实姓名" width="100" align="center"></el-table-column>
                            <el-table-column prop="mobilePhone" label="手机号码" width="130" align="center"></el-table-column>
                            <el-table-column prop="regTime" label="注册时间" min-width="130" align="center">
                                <template slot-scope="scope">
                                    <span>{{formatDate(scope.row.regTime)}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column prop="roleName" label="角色" min-width="130" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="组织架构" min-width="100" align="center"></el-table-column>
                            <el-table-column label="启用" align="center">
                                <template slot-scope="scope" >
                                    <el-switch                                    
                                        on-color="#5B7BFA"
                                        off-color="#dadde5"
                                        v-model="scope.row.isEnable"
                                        @change=changeSwitch(scope.row)
                                        v-if="scope.row.roleName!='Administrator'"   
                                    >
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                                    <!-- <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页栏-->
                        <div class="toolbar" style="padding:10px;">
                        <el-button size="mini" type="danger" @click="toggleSelect(tableData.list)" style="float:left;">全选</el-button>
                        <el-pagination
                            layout="total,prev, pager, next,sizes"
                            @size-change="handleSizeChange"
                            @current-change="refreshPageRequest"
                            :current-page="pageRequest.pageNo"
                            :page-sizes="[10, 20, 50, 100]"
                            :total="tableData.total"
                            style="float:right;"
                        ></el-pagination>
                        </div>
                    </div>
                <!-- </el-scrollbar> -->
            </el-col>
        </el-row>

        <!-- 新增修改用户-->
        <el-dialog
            :title="userDialogTitle"
            width="40%"
            @close="handleClose"
            :visible.sync="userDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="userForm"
                :rules="userRule"
                ref="userForm"
                @keyup.enter.native="submitUserForm()"
                label-width="110px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model.trim="userForm.realName" :placeholder="lookStatus?'':'真实姓名'" :disabled="lookStatus" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :rules="[{required: newStatus, validator: validatePass, trigger: 'blur' }]" v-if="!lookStatus">
                    <el-input type="password" v-model.trim="userForm.password" placeholder="请输入密码" maxlength=20></el-input>
                </el-form-item>   
                <el-form-item label="再次输入密码" prop="againPwd" :rules="[{required: newStatus, validator: validatePass2, trigger: 'blur' }]" v-if="!lookStatus">
                    <el-input type="password" v-model.trim="userForm.againPwd" placeholder="再次输入密码" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="角色及权限" prop="roleId">
                    <el-select v-model="userForm.roleId" filterable :placeholder="lookStatus?'':'可搜索角色，也可下拉选择'" class="roleSelect" :disabled="lookStatus">
                        <el-option :label="item.roleName" :value="item.id" v-for='(item,index) in roleList' :key='index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属组织架构" prop="fateherId" >
                    <popup-tree-input
                        :data="popupTreeData"
                        :disabled="lookStatus"
                        :showCheckbox="false"
                        :props="popupTreeProps"
                        :prop="userForm.parentName==null?'':userForm.parentName"
                        :nodeKey="''+userForm.fateherId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobilePhone">
                    <el-input v-model.number="userForm.mobilePhone" :placeholder="lookStatus?'':'手机号码'" :disabled="lookStatus" maxlength=11></el-input>
                </el-form-item>
                
                <el-form-item label="邮箱" prop="emailAddr">
                    <el-input v-model.trim="userForm.emailAddr" :placeholder="lookStatus?'':'邮箱'" :disabled="lookStatus" maxlength=30></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model.trim="userForm.remark" :placeholder="lookStatus?'':'备注'" :disabled="lookStatus"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item label="启用" >
                    <el-switch v-model="userForm.isEnable" :disabled="lookStatus"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitUserForm()" v-if="!lookStatus">{{'提交'}}</el-button>                    
                    <el-button :size="size" @click="userDialog = false" v-if="userBtnShow">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn" v-if="!userBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
import { toTreeData } from "@/utils/tree"
import { format } from "@/utils/datetime"
export default {
    components:{
        PopupTreeInput
	},
    data(){
        var validateName = (rule, value, callback) => {
            const namereg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
            if (value === '') {
                callback(new Error('请输入真实姓名'));
            }else if(!namereg.test(value)){
                callback(new Error('真实姓名格式为中文或英文字母组合'));
            } else {
                callback();
            }
        };
        var CheckTel = (rule, value, callback) => {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            if (!value) {
                callback(new Error('请输入手机号码'));
            }else if (value.toString().length != 11) {
                callback(new Error('手机号码必须是11位'));
            } else if (!reg.test(value)) {
                callback(new Error('请输入正确的手机号码'));
            } else {
                callback();
            }
        };
        return {
            size: 'small',
            searchVal:'',
            tableData:[],
            selections: [], // 列表选中列
            popupTreeData: [],
            popupTreeProps: {
				label: 'orgName',
				children: 'children'
			},
            allSelect: false,
            filters: {
                name: ""
            },
            // 分页信息
            pageRequest: {
                pageNo: 1,
                pageSize: 10,
                subOrgIds:""
            },
            lookStatus:false,
            editStatus:false,
            userForm:{
                id: '',
                emailAddr: '',
                realName:'',
                mobilePhone: '',
                roleName: '',
                orgId:'',
                roleId:'',
                fateherId:'',
                parentName:'',
                isEnable:true,
                password:'',
                againPwd:'',
                remark:''
            },
            userRule: {
                id:[
                   { required: true, message: '用户ID不能为空', trigger: 'blur' } 
                ],
                realName: [
                    { required: true, validator: validateName, trigger: 'blur' }
                ],
                emailAddr: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                mobilePhone: [
                    { required: true, validator: CheckTel,trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '角色及权限不能为空', trigger: 'change' }
                ],
                fateherId: [
                    { required: true, message: '组织架构不能为空', trigger: 'change' }
                ]
            },
            userDialogTitle:'新建用户',
            userDialog:false,
            userBtnShow:-1,
            exportDialog:false,
            exportSelection:{
                online:true,
                name:true,
                address:true,
                managerAddress:true,
                group:true,
                edition:true,
                outlineTime:true,
                type:true,
                note:true
            },
            roleList:{},
            search:{
                email:'',
                phone:'',
                name:''
            },
            newStatus:false,
            emailStatus:true
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getTree();
        this.getRoleList();
        this.$store.commit('setDeptIds', '')
        this.$store.commit('setDeptName', '')
    },
    computed:{
        deptIDs(){
            return this.$store.state.menu.deptIds 
        }
    },
    watch:{
        deptIDs(val){
            //debugger
            this.findPage();
        }
    },
    methods:{
        //验证密码
        validatePass(rule, value, callback){
            const pws = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,30}$/
            //debugger
            if(this.newStatus && value === ''){
                callback(new Error('请输入密码'));
                return
            }
            if(value != ''&&value.toString().length<8 ){
                callback(new Error('密码长度至少为8位'));
            }else if(value != ''&&!pws.test(value)){
                callback(new Error('密码格式为英语大小写字母，数字，常用特殊字符'));
            } else {
                if (value != ''&&this.userForm.againPwd !== '') {
                    this.$refs.userForm.validateField('againPwd');
                }
                callback();
            }
        },
        //验证确认密码
        validatePass2 (rule, value, callback){
            if ( this.newStatus &&value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value != ''&&value !== this.userForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        },
        //序列号转化        
        indexMethod(index){
            //debugger
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        //时间转化
        formatDate(val){
            return format(val)
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
        //获取角色列表
        getRoleList(){
            let pageRequest= {
                pageNo: 0,
                pageSize: 999
            }
            this.$api.role.findPage(pageRequest).then(res => {                    
                this.roleList = res.content.list;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //新建用户
        addUser(){
            this.userBtnShow = false
            this.userDialog = true;
            this.lookStatus = false;
            this.newStatus = true;
            this.$set(this, 'editStatus', false)
            console.log(this.editStatus);
            this.userDialogTitle = "新建用户"            
            this.userForm = {
                id: '',
                emailAddr: '',
                realName:'',
                mobilePhone: '',
                roleName: '',
                orgId:'',
                roleId:'',
                fateherId:"",
                parentName:'',
                isEnable:true,
                password:'',
                againPwd:'',
                remark:''
            }
            if(this.$refs['userForm']){                
                this.$refs['userForm'].clearValidate()
            }
        },
        
        //搜索
        searchSubmit(){
            this.pageRequest.search = this.searchVal
            this.pageRequest.pageNo = 1;
            this.findPage()
        },
        //导出弹窗
        reorder(){
            this.exportDialog = !this.exportDialog
        },
        exportCheckChange(value){
            //console.log(value);
        },
        //导出
        exportBtn(){

        },
        //启用
        changeSwitch(row) {
            this.$confirm(row.isEnable?'是否启用此用户？':'是否禁用此用户？', '提示', {}).then(() => {
                let params = {
                    uid:row.id,
                    enable:row.isEnable
                }
                this.$api.user.updEnable(params).then((res) => {
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
                        //debugger
                        this.findPage();
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
            }).catch(() => {
                row.isEnable = !row.isEnable
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        },
        // 分页查询
        findPage: function() {
            this.loading = true;
            let callback = res => {
                this.loading = false;
            };
            this.getPage({ pageRequest: this.pageRequest, callback: callback });
        },
        // 换页刷新
        refreshPageRequest: function(pageNo) {
            this.pageRequest.pageNo = pageNo;
            this.findPage();
        },
        handleSizeChange(size){
            this.pageRequest.pageSize = size;
            this.findPage();
        },
        // 获取分页数据
        getPage: function(data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            /* this.pageRequest.columnFilters = {
                name: { name: "name", value: this.filters.name }
            }; */
            //debugger
            this.pageRequest.subOrgIds = this.$store.state.menu.deptIds;//localStorage.getItem('deptIds');
            this.$api.user
                .findPage(this.pageRequest)
                .then(res => {
                    this.tableData = res.content;
                    //debugger
                })
                .then(data != null ? data.callback : "");
        },
        //table上的全选
        handleSelectionChange(val) {
            let ids = ""
            val.map((item)=>{
                ids += item.id+','
            }); 
            this.selections = ids.substr(0, ids.length - 1);
            //console.log(this.selections);
        },
        //table下面的全选
        toggleSelect(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
                })
                this.allSelect = !this.allSelect
            }
            let ids = ""
            if(this.allSelect){
                rows.map((item)=>{
                    ids += item.id+','
                }); 
                this.selections = ids.substr(0, ids.length - 1);
            }else{
                this.selections = ids
            }  
        },
        //查看
        handleLook(row){
            //console.log(row);
            this.userBtnShow = true;
            this.userDialog = true;
            this.lookStatus = true;
            this.newStatus = false;
            this.editStatus = false;
            this.userDialogTitle = "查看用户"
            this.userForm = {
                id: row.id,
                emailAddr: row.emailAddr,
                realName:row.realName,
                mobilePhone: row.mobilePhone,
                roleName: row.roleName,
                orgId:row.orgId,
                roleId:row.rid,
                fateherId:row.orgId,
                parentName:row.orgName,
                isEnable:row.isEnable,
                password:row.password,
                againPwd:row.password,
                remark:row.remark
            }
        },
        //编辑
        handleEdit(row){
            this.userBtnShow = false
            this.userDialog = true;
            this.lookStatus = false;
            this.newStatus = false;
            this.$set(this, 'editStatus', true)
            console.log(this.editStatus);
            this.userDialogTitle = "编辑用户"
            if(!row.isEnable){
                this.lookStatus = true;
                this.userBtnShow = true;
            }
            this.userForm = {
                id: row.id,
                emailAddr: row.emailAddr,
                realName:row.realName,
                mobilePhone: row.mobilePhone,
                roleName: row.roleName,
                orgId:row.orgId,
                roleId:row.rid,
                fateherId:row.orgId,
                parentName:row.orgName,
                isEnable:row.isEnable,
                password:'',
                againPwd:'',
                remark:row.remark
            }
        },
        // 机构树选中
        handleTreeSelectChange (data, node) {
            this.userForm.fateherId = data.id
            this.userForm.parentName = data.orgName
            this.userForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.userForm.firstLevelId = data.firstLevelId
            }else{
                this.userForm.firstLevelId = data.id
            }
        }, 
        //提交
        submitUserForm(){
            let self = this;            
            //请求
            let user = self.userForm,
                orgId = self.userForm.fateherId,
                roleId = self.userForm.roleId;
            
            if(!self.userForm.id&&self.userForm.id==""){
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true
                                self.$api.user
                                .addUser(user,'?orgId='+orgId+"&roleId="+roleId)
                                .then(res => {
                                    if(res.messages[0]=="EMail&Phone is Duplication"){
                                        this.$message({
                                            message: '手机号或邮箱重复！',
                                            type: 'error'
                                        })
                                        return  
                                    }
                                    if(res.result == "success"){
                                        self.userDialog = false;                                
                                        self.findPage();                                  
                                        self.$refs['userForm'].resetFields()
                                    }else{
                                        this.$message({
                                            message: '提交失败',
                                            type: 'error'
                                        })  
                                    }
                                })
                                .catch((res) => {
                                    this.$message({
                                        message: res.message,
                                        type: 'error'
                                    })
                                });
                                
                        }).catch(() => {
                            //this.userDialog = false
                            this.$message({
                                type: 'info',
                                message: '已取消提交'
                            });          
                        });
                    }
                });
            }else{ 
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true                       
                            self.$api.user
                            .updUser(user,'?orgId='+orgId+"&roleId="+roleId)
                            .then(res => {
                                if(res.messages[0]=="EMail&Phone is Duplication"){
                                    this.$message({
                                        message: '手机号或邮箱重复！',
                                        type: 'error'
                                    })
                                    return  
                                }
                                if(res.result == "success"){
                                    self.userDialog = false;                                
                                    self.findPage();                                  
                                    self.$refs['userForm'].resetFields()
                                }else{
                                    this.$message({
                                        message: '提交失败',
                                        type: 'error'
                                    })  
                                }
                            })
                            .catch((res) => {
                                /* this.$message({
                                    message: res.message,
                                    type: 'error'
                                }) */
                            });
                        }).catch(() => {
                            //this.userDialog = false
                            this.$message({
                                type: 'info',
                                message: '已取消提交'
                            });          
                        });
                    }
                });
            }
                
        },
        //删除用户
        delUser(){
            //debugger
            if(this.selections==""){
                this.$message({
                    message: '请选择用户',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要删除此用户吗？此操作会删除该用户，并清空用户下所有数据', '删除', {
				type: 'warning'
            }).then(() => {
                this.$api.user
                .delUser({ids:this.selections})
                .then(res => {
                    if(res.result == "success"){
                        this.findPage()
                    }else{
                        this.$message({
                            message: '提交失败',
                            type: 'error'
                        })  
                    }
                })
                .catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        resetBtn(){
            if(this.userDialogTitle == "新建用户" ){           
                this.userForm = {
                    id: '',
                    emailAddr: '',
                    realName:'',
                    mobilePhone: '',
                    roleName: '',
                    orgId:'',
                    roleId:'',
                    fateherId:"",
                    parentName:'',
                    isEnable:true,
                    password:'',
                    againPwd:'',
                    remark:''
                }
                if(this.$refs['userForm']){                
                    this.$refs['userForm'].clearValidate()
                }
            }else{              
                this.userForm.realName = ""
                this.userForm.roleName = ""
                this.userForm.orgId = ""
                this.userForm.roleId = ""
                this.userForm.fateherId = ""
                this.userForm.parentName = ""
                this.userForm.isEnable = true
                this.userForm.password = ""
                this.userForm.againPwd = ""
                this.userForm.remark = ""                
                this.$refs['userForm'].clearValidate()  
            }
        },
        handleClose(){ 
            this.userForm = {
                id: '',
                realName:'',
                roleName: '',
                orgId:'',
                roleId:'',
                fateherId:"",
                parentName:'',
                isEnable:true,
                password:'',
                againPwd:'',
                remark:''
            }           
            this.$refs['userForm'].clearValidate()
        }
    }
}
</script>

