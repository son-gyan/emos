<style lang="scss" scoped>
.role{
    background-color: #fff;
    padding: 0 10px 10px;
    .roleSelect{
        width: 100%
    }
    .reorder{
        float:right;
        position: relative;
    }
}
</style>

<template>
    <div class="role">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div class="buttons" style="display:inline-block;">
                    <el-button type="primary" @click="addRole">
                        <i class="fa fa-plus"></i>
                        <span>新建角色</span>
                    </el-button>
                    <el-button type="primary" @click="delRole">
                        <i class="fa fa-trash"></i>
                        <span>删除角色</span>
                    </el-button>                    
                </div>
                <div style="margin: 20px 0;display:inline-block;">
                    <el-input placeholder="按角色名搜索" v-model="searchVal" class="input-with-select" 
                    @input="e => searchVal = validForbid(e)"
                    @keyup.enter.native="search">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col>                
                <el-scrollbar
                    class="default-scrollbar"
                    wrap-class="default-scrollbar__wrap"
                    view-class="p20-scrollbar__view"
                    >
                    
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
                            <el-table-column type="index" label="序号" width="55"  align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="id" label="ID" min-width="100" align="center"></el-table-column>
                            <el-table-column prop="roleName" label="角色名" min-width="100" align="center"></el-table-column>
                            <el-table-column prop="groupName" label="所属用户" min-width="180" align="center"></el-table-column>
                            <el-table-column prop="roleDsc" label="角色说明"  min-width="300" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="180" align="center">
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
                </el-scrollbar>
            </el-col>
        </el-row>

        <!-- 新增修改用户-->
        <el-dialog
            :title="roleDialogTitle"
            width="40%"
            :visible.sync="roleDialog"
            @close="handleClose"
            :close-on-click-modal="false"
            >
            <el-form :model="ruleForm" :rules="roleRule" ref="ruleForm" 
                label-width="100px" 
                :size="size"
                style="text-align:left;">
                
                <el-form-item label="角色名" prop="role.roleName">
                    <el-input v-model.trim="ruleForm.role.roleName" :placeholder="lookStatus?'':'角色名'" maxlength=20 :disabled="lookStatus"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <!-- <el-checkbox-group v-model="ruleForm.power">
                        <el-checkbox v-for="menu in powerOptions" :key="menu" :label="menu" name="power" :disabled="lookStatus"></el-checkbox>
                    </el-checkbox-group> -->
                    <el-tree :data="moduleList" node-key="id" :props="defaultProps" :show-checkbox=true ref="allTree" 
                            @check="checkstation"> <!-- default-expand-all -->
                    </el-tree>
                </el-form-item>
                <!-- <el-form-item label="选择用户">
                    <el-select v-model="ruleForm.user" multiple placeholder="请选择" class="roleSelect"  :disabled="lookStatus">
                        <el-option v-for="item in userItems" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                    </el-select> 
                </el-form-item> -->
                <el-form-item label="角色说明">
                    <el-input type="textarea" v-model.trim="ruleForm.role.roleDsc" :placeholder="lookStatus?'':'角色说明'" :disabled="lookStatus"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitRoleForm('ruleForm')" v-if="!lookStatus">{{'提交'}}</el-button>
                    <el-button :size="size" @click="roleDialog = false" v-if="roleBtnShow">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('ruleForm')" v-if="!roleBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import { moduleTree } from "@/utils/tree"
export default {    
    data(){
        var validateName = (rule, value, callback) => {
            const namereg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            if (value === '') {
                callback(new Error('请输入角色名'));
            }else if(!namereg.test(value)){
                callback(new Error('角色名格式为中文、英文（大小写）、数字、下划线的组合'));
            } else {
                callback();
            }
        };
        return {
            size: 'small',
            searchVal:'',
            tableData:[],
            selections: [], // 列表选中列
            allSelect: false,
            filters: {
                name: ""
            },
            userInfo:JSON.parse(sessionStorage.getItem("user")),
            // 分页信息
            pageRequest: {
                pageNo: 1,
                pageSize: 10
            },
            lookStatus:false,
            editStatus:false,
            roleDialogTitle:'新建用户',
            roleDialog:false,
            roleBtnShow:-1,
            ruleForm: {
                role: {
                    id:'',
                    roleDsc:"",
                    roleName:''
                },
                moduleIds: ''
            },
            roleRule: {
                role:{
                    roleName: [
                        { required: true,validator: validateName, trigger: 'blur' }
                    ],
                },                
                moduleIds: [
                    { required: true, message: '请至少选择一个权限', trigger: 'change' }
                ]
            },
            moduleList:[],
            defaultProps: {
                children: 'children',
                label: 'menuName',
                disabled:'disabled'
            },
            arrey:[]
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.queryModuleList()
    },
    methods:{
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        //查询模块列表
        queryModuleList(){
            this.$api.role
                .queryModuleList()
                .then(res => {
                    if(res.result == "success"){
                        this.moduleList = moduleTree(res.content)
                    }
                })
                .catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
        },
        checkstation(){
            var lzj = this.$refs.allTree.getCheckedKeys()
            var parentId = this.$refs.allTree.getCheckedKeys().concat(this.$refs.allTree.getHalfCheckedKeys()) ;
            debugger
            let ids = ""
            parentId.map((item)=>{
                ids += item+','
            });       
            this.ruleForm.moduleIds = ids.substr(0,ids.length - 1)
            //console.log(this.ruleForm.moduleIds);
        },
        //选项改变
        handleCheckedCitiesChange(value){

        },
        //新建角色
        addRole(){
            this.roleBtnShow = false
            this.roleDialog = true;
            this.lookStatus = false;
            this.editStatus = false;
            this.roleDialogTitle = "新建角色" 
            
            this.ruleForm = {
                role: {                    
                    id: "",
                    roleDsc:"",
                    roleName:""
                }
            }
            let list = this.json(this.moduleList,false);
            this.moduleList = list;
            this.$nextTick(() => {               
                this.$refs.allTree.setCheckedNodes(this.moduleList)
            })
            this.$nextTick(() => {          
                this.$refs.allTree.setCheckedKeys([]);
            })
        },
        //删除角色
        delRole(){
            //debugger
            if(this.selections==""){
                this.$message({
                    message: '请选择角色',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要删除“运维”角色吗？删除后角色下级的用户权限也同时删除。', '删除', {
				type: 'warning'
            }).then(() => {
                //del
                this.$api.role
                .delRole({ids:this.selections})
                .then(res => {
                    if(res.messages[0]=="Role cannot be removed!"){
                        this.$message({
                            message: "角色被使用，不能删除",
                            type: 'error'
                        })
                        return 
                    }
                    if(res.result == "success"){
                        this.refreshPageRequest(this.pageRequest.pageNo);
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
        //搜索
        search(){
            //console.log(this.searchVal);
            this.pageRequest.roleName = this.searchVal
            this.pageRequest.pageNo = 1;
            this.findPage();
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
            this.$api.role
                .findPage(this.pageRequest)
                .then(res => {
                    if(res.result == "success"){                        
                        this.tableData = res.content;
                    }
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
            /* this.selections = val.map((item)=>{
                return item.id
            });  */
            //console.log(this.selections);
        },
        //table下面的全选
        toggleSelect(rows) {             
            var self = this          
            if (rows) {
                rows.forEach(row => {
                    self.$refs.multipleTable.toggleRowSelection(row, !self.allSelect)
                })
                self.allSelect = !self.allSelect
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
        json(jsontree,disabled) {
            //debugger
            let self = this;
            jsontree.forEach(item => {
                if(disabled){
                    self.$set(item, 'disabled', disabled)                     
                    //item.disabled = disabled 
                }
                if(!disabled&&item.disabled){
                    self.$set(item, 'disabled', disabled) 
                    //item.disabled = false;
                    //delete item.disabled // 删除disabled属性
                }
                item.children && item.children.length > 0 && self.json(item.children,disabled) // 如果有children，递归调用
            })
            return jsontree
        },
        //查看
        handleLook(row){
            //console.log(row);
            this.roleBtnShow = true;
            this.roleDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.roleDialogTitle = "查看角色"
            this.ruleForm = {
                role: {                    
                    id: row.id,
                    roleDsc:row.roleDsc,
                    roleName:row.roleName
                }
            }                        
            
            this.findModuleListByRole(row.id,(modIds)=>{
                //debugger                 
                this.ruleForm.moduleIds = modIds 
                //modIds = [8,9,13]
                this.$refs.allTree.setCheckedKeys(modIds);              
            });
            let list = this.json(this.moduleList,true);
            this.moduleList = list;
            console.log(this.moduleList);
            /*this.$nextTick(() => {               
                this.$refs.allTree.setCheckedNodes(list)
            });  */
        },
        //编辑
        handleEdit(row){            
            this.roleBtnShow = false
            this.roleDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.roleDialogTitle = "编辑角色"
            this.ruleForm = {
                role: {                    
                    id: row.id,
                    roleDsc:row.roleDsc,
                    roleName:row.roleName
                }
            }            
            let list = this.json(this.moduleList,false);
            this.moduleList = list;
            /* this.$nextTick(() => {               
                this.$refs.allTree.setCheckedNodes(this.moduleList)
            }) */
            this.findModuleListByRole(row.id,(modIds)=>{
                this.$refs.allTree.setCheckedKeys(modIds); 
                this.ruleForm.moduleIds = modIds               
            });
        },
        findModuleListByRole(id,callback){
            this.$api.role
                .findModuleListByRole({roleId:id})
                .then(res => {
                    if(res.result == "success"){                        
                        let arr = res.content.filter(item=>item.fatherId!==0)
                        let tempArr = arr.map(o=>o.fatherId)
                        let result = res.content.filter(o=>!tempArr.includes(o.id))
                        let arry= result.map(item=>{
                            return item.id
                        })                        
                        callback(arry);
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
        },
        submitRoleForm(roleForm){
            let self =this;
            this.$refs[roleForm].validate((valid) => {
                if (valid) {
                    //debugger
                    if(!self.ruleForm.moduleIds){
                        this.$message({
                            message: '请至少选择一个权限',
                            type: 'error'
                        }) 
                        return
                    }
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        //debugger
                        if(!self.ruleForm.role.id ||self.ruleForm.role.id ==""){                            
                            self.$api.role
                            .addRole(self.ruleForm.role,self.ruleForm.moduleIds)
                            .then(res => {
                                if(res.messages[0]=="RoleName cannot duplication"){
                                    this.$message({
                                        message: "角色名重复",
                                        type: 'error'
                                    })
                                    return 
                                }
                                if(res.result == "success"){
                                    self.roleDialog = false;                                
                                    self.refreshPageRequest(self.pageRequest.pageNo);                                    
                                    self.$refs['ruleForm'].resetFields()
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
                        }else{
                            self.$api.role
                            .updRole(self.ruleForm.role,self.ruleForm.moduleIds)
                            .then(res => {
                                if(res.messages[0]=="RoleName cannot duplication"){
                                    this.$message({
                                        message: "角色名重复",
                                        type: 'error'
                                    })
                                    return 
                                }
                                if(res.result == "success"){
                                    self.roleDialog = false;                                
                                    self.refreshPageRequest(self.pageRequest.pageNo);                                    
                                    self.$refs['ruleForm'].resetFields()
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
                        }
                    }).catch(() => {
                        //self.roleDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        handleClose(){
            this.roleDialog = false;            
            this.ruleForm={                
                role: {
                    roleDsc:"",
                    roleName:''
                },
                moduleIds: ''
            }
            this.$refs['ruleForm'].clearValidate()
            let list = this.json(this.moduleList,false);
            this.moduleList = list;
            this.$nextTick(() => {               
                this.$refs.allTree.setCheckedNodes(this.moduleList)
                this.$refs.allTree.setCheckedKeys([]);
            })
        },
        resetBtn(formName){
            this.ruleForm={                
                role: {
                    roleDsc:"",
                    roleName:''
                },
                moduleIds: ''
            }
            this.$refs['ruleForm'].clearValidate()
            let list = this.json(this.moduleList,false);
            this.moduleList = list;
            this.$nextTick(() => {               
                this.$refs.allTree.setCheckedNodes(this.moduleList)
                this.$refs.allTree.setCheckedKeys([]);
            })
        }
    }
}
</script>
