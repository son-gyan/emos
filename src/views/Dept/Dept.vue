<style lang="scss" scoped>
.dept {
    /* background-color: #fff; */
    padding: 0 10px 10px;
  height: 96%;
  .buttons {
    margin: 20px 0;
    text-align: left;
  }
  .deftWrap,
  .el-container,
  .el-aside {
    height: 100%;
  }
  .deftWrap {
    height: 95%;
  }
  .el-aside {
    width: 20% !important;
    border-right: 1px solid #eee;
  }
  .tree {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .el-tree {
    min-height: 100%;
  }
  .searchWrap{
      max-width: 150px;
  }
}

.el-main {
  width: 100%;
  height: 100%;
  padding: 0;
}
.el-main.default {
  height: auto;
  padding: 20px;
}
.default-scrollbar {
  width: 100%;
  height: 100%;
}
.flex-scrollbar {
  width: auto;
  height: auto;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.el-scrollbar__view.p20-scrollbar__view {
  padding: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.custom-tree-node{
    position: relative;
}
.buttonGroup{
    position:absolute;
    top:0;
}

.menu__item {
    display: block;
    line-height: 20px;
    text-align: center;
    margin-top: 10px;
}
.menu {
    padding: 0;
    height: 130px;
    width: 100px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid #999999;
    background-color: #f4f4f4;
}
li:hover {
    background-color: #1790ff;
    color: white;
}
.input-with-select{
    min-width:400px; 
}
.selectWrap{
    width: 100%;
}
</style>


<template>
    <div class="dept">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;">
                <div style="margin: 20px 0;display:inline-block;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >                            
                            <el-button type="primary" @click="addDept">新建架构/门店</el-button>
                        </el-form-item>
                        <el-form-item >                            
                            <el-button type="primary" @click="delAll">批量删除门店</el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件" class="searchWrap">
                                <el-option label="公司" value="company"></el-option>
                                <el-option label="区域" value="area"></el-option>
                                <el-option label="店名" value="shop"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按所属公司，区域，组织架构店名等条件搜索" v-model="searchValue" class="input-with-select"  
                                @input="e => searchValue = validForbid(e)"
                                @keyup.enter.native="search">
                                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <div class="deftWrap">
            <el-container>
                <el-aside>
                    <div class="tree">
                        <el-tree
                            ref="tree"
                            :data="treeList"
                            :props="popupTreeProps"
                            @node-click="handleNodeClick"
                            @node-contextmenu="rightClick"
                            node-key="id"
                            :expand-on-click-node="false"
                            > <!-- :default-expand-all="false" -->
                        </el-tree>

                        <div v-show="menuVisible"> 
                            <ul id="menu" class="menu"> 
                                <li class="menu__item" @click="addChild">添加子架构</li> 
                                <li class="menu__item" @click="addShop">添加门店</li> 
                                <li class="menu__item" @click="editName">编辑架构</li> 
                                <li class="menu__item" @click="remove">删除架构</li> 
                            </ul> 
                        </div>

                    </div>
                </el-aside>
                <el-container>
                    <el-main>
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
                                <el-table-column type="index"  label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                                <el-table-column prop="orgName" label="名称" width="180" align="center"></el-table-column>
                                <el-table-column prop="contactEmp" label="联系人" width="100" align="center"></el-table-column>
                                <el-table-column prop="mobilePhone" label="联系电话" width="130" align="center"></el-table-column>                                
                                <el-table-column prop="realName" label="运维人员" align="center"></el-table-column>
                                <el-table-column prop="area" label="区域" align="center"></el-table-column>
                                <el-table-column prop="address" label="详细地址" align="center"></el-table-column>
                                <el-table-column label="启用" align="center">
                                    <template slot-scope="scope">
                                        <el-switch
                                            on-color="#5B7BFA"
                                            off-color="#dadde5"
                                            v-model="scope.row.isEnable" 
                                            @change=changeSwitch(scope.row)                
                                        >
                                        </el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                                <el-table-column  label="操作" width="180" align="center"> <!-- fixed="right" -->
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                        <el-button  @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                                        <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
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
                    </el-main>
                </el-container>
            </el-container>
        </div>
        <!-- 新增修改门店-->
        <el-dialog
            :title="shopDialogTit"
            width="40%"
            @close="handleClose"
            :visible.sync="shopDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="shopForm"
                :rules="shopRule"
                ref="shopForm"
                @keyup.enter.native="submitShopForm('shopForm')"
                label-width="130px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="名称" prop="orgName">
                    <el-input v-model.trim="shopForm.orgName" placeholder="名称" maxlength=20 :disabled="lookStatus"></el-input>
                </el-form-item>
                <el-form-item label="组织架构">  <!-- prop="parentName" -->
                <popup-tree-input
                    :data="popupTreeData"
                    :disabled="lookStatus"
                    :props="popupTreeProps"
                    :prop="shopForm.parentName==null?'':shopForm.parentName"
                    :nodeKey="''+shopForm.fateherId"
                    :currentChangeHandle="handleTreeSelectChange"
                ></popup-tree-input>
                </el-form-item>
                <el-form-item label="详细地址" ><!-- prop='address' -->
                    <el-input v-model.trim="shopForm.address" :placeholder="lookStatus?'':'详细地址'" :disabled="lookStatus"></el-input>
                </el-form-item>
                <el-form-item label="是否为门店">
                    <el-checkbox v-model="shopForm.isShop" @change='chkShop' :disabled="editStatus||lookStatus||shopForm.fateherId==0||this.shopDialogTit == '添加门店'||this.shopDialogTit == '添加子架构'||this.shopDialogTit == '编辑架构'"></el-checkbox>
                </el-form-item>
                <el-form-item label="联系人" v-if="shopForm.isShop">
                    <!-- <el-input v-model="shopForm.user" placeholder="联系人"></el-input> -->
                    <el-select v-model="shopForm.contactEmp" filterable :placeholder="lookStatus?'':'可搜索联系人，也可下拉选择'"  class="selectWrap" :disabled="lookStatus">                        
                        <el-option :label="item.realName" :value="item.realName" v-for="(item,index) in userList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobilePhone" v-if="shopForm.isShop">
                    <el-input v-model.trim="shopForm.mobilePhone" :placeholder="lookStatus?'':'联系电话'" :disabled="lookStatus"></el-input>
                </el-form-item>
                <el-form-item label="运维人员" v-if="shopForm.isShop">
                    <el-select v-model="shopForm.userId" filterable :placeholder="lookStatus?'':'可搜索运维人员，也可下拉选择'" class="selectWrap" :disabled="lookStatus">
                        <el-option :label="item.realName" :value="item.id" v-for="(item,index) in userList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注"  v-if="shopForm.isShop">
                    <el-input type="textarea" v-model.trim="shopForm.remark" 
                        :placeholder="lookStatus?'':'备注'" :disabled="lookStatus" resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" type="primary" @click="submitShopForm('shopForm')" v-if="!lookStatus">{{'确定'}}</el-button>                
                <el-button :size="size" @click="closeDialog('shopForm')">{{'关闭'}}</el-button>
            </span>
        </el-dialog>
        <!-- 导入架构-->
        <el-dialog
            :title="'导入组织架构门店信息'"
            width="40%"
            :visible.sync="importDialog"
            :close-on-click-modal="false"
            >
            <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="downLoadBtn">下载模板</el-button>
            </el-upload>
            
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click="importDialog = false">{{'关闭'}}</el-button>
                <el-button :size="size" type="primary" @click="submitImport()">{{'确定'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
export default {
    
    components:{
        PopupTreeInput
	},
    data() {
        var CheckTel = (rule, value, callback) => {
            const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
            /* if (!value) {
                callback(new Error('请输入手机号码'));
            }else */ if (value&&value.toString().length != 11) {
                callback(new Error('手机号码必须是11位'));
            } else if (value&&!reg.test(value)) {
                callback(new Error('请输入正确的手机号码'));
            } else {
                callback();
            }
        }
        return {
            searchKey:"",
            searchValue:"",
            size: 'small',
            menuVisible:false,
            treeNode:{},
            shopDialog: false,
            shopDialogTit:'',
            importDialog:false,
            fileList:[],
            shopForm:{
                id: '',
                orgName: '',
                orgLevel:'',
                fateherId: 0,
                parentName: '',
                address: '',
                contactEmp:'',
                mobilePhone:"",
                firstLevelId:"",
                isShop:false,
                isEnable:true,
                status:1,
                userId:'',
                remark:''
            },
            shopRule: {
                orgName: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                parentName: [
                    { required: true, message: '组织架构不能为空', trigger: 'change' }
                ],
                company: [
                    { required: true, message: '所属公司不能为空', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空', trigger: 'blur' }
                ],
                mobilePhone: [
                    { validator: CheckTel,trigger: 'blur' }
                ]
            },
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
                pageSize: 10
            },
            loading: false, // 加载标识
            selections: [], // 列表选中列
            treeList: [],
            tableData: [],
            ids:"",
            userList:[],
            isShop:false,
            delIds:"",
            lookStatus:false,
            editStatus:false
        };
    },
    created() {      
        this.getTree();
        this.refreshPageRequest(1);
        this.queryUserList()
    },
    methods: {
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        queryUserList(){
            let params = {
                pageNo:1,
                pageSize:9999
            }
            this.$api.user.findPage(params).then((res) => {                
                //debugger
                if(res.errors.length>0) {
                    this.$message({
                        message: res.errors,
                        type: 'error'
                    })
                } else {
                    this.userList = res.content.list
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //搜索
        search(){
            if(this.searchKey !=""){                
                this.pageRequest.searchKey = this.searchKey;
                this.pageRequest.searchValue = this.searchValue.replace(/^\s*|\s*$/g,"");
                this.pageRequest.pageNo = 1;
                this.findPage();
            }else{
                this.$message({
                    message:'请先选择搜索条件',
                    type: 'error'
                })
            }
        },
        //监听是否门店变化
        chkShop(val){
            if(val){
                this.shopDialogTit = this.shopDialogTit.replace('架构','门店')
            }else{
                this.shopDialogTit = this.shopDialogTit.replace('门店','架构') 
            }
        },
        //启用
        changeSwitch(row) {
            this.$confirm(row.isEnable?'是否启用此门店？':'是否禁用此门店？', '提示', {}).then(() => {
                //debugger
                let params = {
                    uid:row.id,
                    isEnable:row.isEnable
                }
                this.$api.dept.updEnable(params).then((res) => {
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
                        //debugger
                        this.refreshPageRequest(this.pageRequest.pageNo);
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
        //树形菜单点击
        handleNodeClick(data){
            this.menuVisible = false 
            this.treeNode = data
            //拼接的id字符串
            this.ids=""
            this.ids= this.getNodes(this.treeNode); 
            this.ids = this.ids.substr(0, this.ids.length - 1)
            this.refreshPageRequest(1);
        },
        //树右键菜单
        rightClick(MouseEvent, object, Node, element){
            //debugger
            this.menuVisible = false 
            // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true 
            if(Node.data.isShop == false){                
                this.menuVisible = true 
                // 显示模态窗口，跳出自定义菜单栏 
                var leftMenu = document.querySelector('.el-menu') 
                var headTool = document.querySelector('.headTool') 
                var menu = document.querySelector('#menu') 
                menu.style.left = MouseEvent.clientX - 180  + 'px' 
                document.addEventListener('click', this.foo) 
                // 给整个document添加监听鼠标事件，点击任何位置执行foo方法 
                //menu.style.top = MouseEvent.clientY -headTool.clientHeight- 51 + 'px'
                menu.style.top = MouseEvent.clientY -headTool.clientHeight + 'px'
                this.treeNode = Node;
            }
                        
        },
        foo() { 
            // 取消鼠标监听事件 菜单栏 
            this.menuVisible = false 
            document.removeEventListener('click', this.foo) 
            // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了 
        },
        //添加子架构
        addChild(){
            this.shopForm.parentName = this.treeNode.data.orgName
            this.shopForm.fateherId = this.treeNode.data.id
            if(this.treeNode.data.firstLevelId != 0){                
                this.shopForm.firstLevelId = this.treeNode.data.firstLevelId
            }else{
                this.shopForm.firstLevelId = this.treeNode.data.id
            }
            this.shopDialog = true;
            this.lookStatus = false;
            this.shopDialogTit = '添加子架构';

        },
        //添加门店
        addShop(data){
            this.shopForm.parentName = this.treeNode.data.orgName
            this.shopForm.fateherId = this.treeNode.data.id
            this.shopForm.isShop = true;
            if(this.treeNode.data.firstLevelId != 0){                
                this.shopForm.firstLevelId = this.treeNode.data.firstLevelId
            }else{
                this.shopForm.firstLevelId = this.treeNode.data.id
            }
            this.shopDialog = true;
            this.lookStatus = false;
            this.shopDialogTit = '添加门店'
        },
        //修改
        editName(data){
            //debugger
            this.shopForm = this.treeNode.data
            this.shopForm.parentName = this.treeNode.data.parent?this.treeNode.data.parent.orgName:this.treeNode.data.orgName
            this.shopForm.fateherId = this.treeNode.data.fateherId
            if(this.treeNode.data.firstLevelId != 0){                
                this.shopForm.firstLevelId = this.treeNode.data.firstLevelId
            }else{
                this.shopForm.firstLevelId = this.treeNode.data.id
            }
            this.shopDialog = true;
            this.lookStatus = false;
            this.shopDialogTit = '编辑架构'
        },
        //删除
        remove(){
            let self = this
            this.$confirm('请确认要删除该组织架构吗？请先确保已删除该组织架构下的所有末端节点', '删除架构', {
				type: 'warning'
            }).then(() => {           
                self.json(self.treeNode.data)
                //debugger
                if(self.delIds!=""){
                    this.$message({
                        message: '不允许删除，删除架构只能逐级删除。',
                        type: 'error'
                    })
                    return
                }
                let uid = self.treeNode.data.id
                self.delDept(uid);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            
        },
        json(jsontree) {
            if ((typeof jsontree == 'object') && (jsontree.constructor== Object.prototype.constructor)) {
                var arrey = [];
                arrey.push(jsontree);
            }
            else arrey = jsontree;
            for (var i = 0; i < arrey.length; i++) {
                var jn = arrey[i];
                if (jn.isShop == true) {
                    this.delIds += jn.id
                    return ;
                }else{
                    this.delIds = ""
                }
                if (jn.children && jn.children.length > 0) {
                    this.json(jn.children);
                }
            }
        },
        //新建架构
        addDept: function() {            
            this.shopDialogTit = '新建架构';
            this.shopDialog = true;
            this.lookStatus = false;    
        },
        //编辑架构
        editDept: function() {
            this.shopDialog = true;
            this.shopDialogTit = '编辑架构';
            this.lookStatus = false;
        },
        //删除架构或门店
        delDept(uid) {
            if(uid){
                this.$api.dept.delShop({uid:uid}).then((res) => {
                    //debugger
                    if(res.code==400){
                        if(res.messages[0]=='10006'){
                            this.$message({
                                message: '该组织架构存在设备绑定',
                                type: 'error'
                            })
                            return 
                        } else {                          
                            this.$message({
                                message: '请先删除子架构,删除架构只能逐级删除。',
                                type: 'error'
                            })
                            return 
                        }
                    }
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
                        this.getTree();
                        this.refreshPageRequest(this.pageRequest.pageNo);
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
            }
        },
        
        //导入架构
        importDept() {
            this.importDialog = true
        },
        //文件修改
        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        handlePreview(file) {
        },
        //下载模板
        downLoadBtn(){
        },
        //提交
        submitImport(){
            this.$refs.upload.submit();
        },
        //查看门店
        handleClick(row) {
            //this.shopForm ={};
            this.lookStatus = true;
            this.shopDialogTit = '查看门店' 
            this.shopForm = row;           
            this.shopDetail(row.id);
            //Object.assign(this.shopForm, row);
        },
        // 编辑门店
		handleEdit: function (row) {
            //debugger
            //this.shopForm ={};
            this.lookStatus = false;
            this.editStatus = true;
            this.shopDialogTit = '编辑门店' 
            //this.shopForm = row;           
            this.shopDetail(row.id);
        },
        //门店详情
        shopDetail(uid){
            if(uid){
                this.$api.dept.shopDetail({uid:uid}).then((res) => {                    
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
                        let data = res.content;                         
                        this.shopForm ={
                            id: data.id,
                            orgName: data.orgName,
                            orgLevel:data.id,
                            fateherId: data.fid,
                            parentName: data.area,
                            address: data.address,
                            contactEmp:data.contactEmp,
                            mobilePhone:data.mobilePhone,
                            firstLevelId:data.firstLevelId,
                            isShop:data.isShop,
                            status:1,
                            userId:data.realId,
                            realName:data.realName,
                            remark:data.remark
                        }
                        if(!data.isEnable){
                            this.lookStatus = true;
                        }                     
                        this.shopDialog = true;
                    }
                }).catch((res) => {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                });
            }
        },
        //删除门店
        handleDel:function(row){
            this.$confirm('请确认要删除该门店吗？请先确保已移除该门店下的所有资产设备', '删除门店', {
				type: 'warning'
            }).then(() => {
                let uid = row.id
                this.delDept(uid)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //批量删除门店
        delAll:function(row){
            if(this.selections == ""){
                this.$message({
                    type: 'error',
                    message: '未选择门店，无法删除'
                });
                return
            }
            this.$confirm('请确认要批量删除门店吗？', '删除门店', {
				type: 'warning'
            }).then(() => {
                let ids = this.selections
                this.$api.dept.delAllShop({ids:ids}).then((res) => {
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
                        this.getTree();
                        this.findPage();
                    }
                }).catch((res) => {
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
        //table上的全选
        handleSelectionChange(val) {
            let ids = ""
            val.map((item)=>{
                ids += item.id+','
            }); 
            this.selections = ids.substr(0, ids.length - 1);
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
        // 分页查询
        findPage: function() {
            this.loading = true;
            let callback = res => {
                this.loading = false;
            };
            this.getPage({ pageRequest: this.pageRequest, callback: callback });
        },
        // 换页刷新
        handleSizeChange(size){            
            this.pageRequest.pageSize = size;
            this.findPage();
        },
        refreshPageRequest: function(pageNo) {
            //debugger
            this.pageRequest.pageNo = pageNo;
            this.findPage();
        },
        // 获取分页数据
        getPage: function(data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.pageRequest.shopIds = this.ids
            //debugger
            this.$api.dept
                .findPage(this.pageRequest)
                .then(res => {
                    if(!res){
                        return
                    }
                    this.tableData = res.content;
                })
                .then(data != null ? data.callback : "");
        },
        //获取树形菜单
        getTree: function() {
            //debugger
            this.$api.dept.getTree().then(res => {
                if(!res){
                    return
                }
                var result = res.content;
                var resultNoShop  = JSON.parse(JSON.stringify(res.content));
                //var resultNoShop = result.filter(o=>o.isShop==0);
                //this.treeList = res.content;
                this.treeList = result;
                this.popupTreeData = this.filterShop(resultNoShop);
                console.log(this.popupTreeData);
            });
        }, 
        //过滤门店
        filterShop(arr){
            var child = arr.filter(o=>!o.isShop)
            if (child && child.length>0) {
                child.forEach(oo=>{oo.children=this.filterShop(oo.children)})
            }
            return child;
        },

        
        // 获取上级机构树
        getParentMenuTree: function (tableTreeDdata) {
            let parent = {
                fateherId: 0,
                orgName: '顶级菜单',
                children: tableTreeDdata
            }
            return [parent]
        },          
        // 机构树选中
        handleTreeSelectChange (data, node) {
            this.shopForm.fateherId = data.id
            this.shopForm.parentName = data.orgName
            this.shopForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.shopForm.firstLevelId = data.firstLevelId
            }else{
                this.shopForm.firstLevelId = data.id
            }
            //debugger
        },
        submitShopForm(){
            let self = this;
            this.$refs['shopForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        if(!self.shopForm.id ||self.shopForm.id==""){
                            //新增提交
                            //debugger
                            this.$api.dept.addShop(self.shopForm).then((res) => {
                                //debugger
                                if(res.messages[0]=="ShopName duplication"){
                                    this.$message({
                                        message: "名称重复",
                                        type: 'error'
                                    })
                                    return 
                                }
                                if(res.messages[0]=="RootNode name cannot duplication") {
                                    this.$message({
                                        message: "一级组织架构名称不能重复",
                                        type: 'error'
                                    })
                                } else {
                                    //debugger
                                    this.shopDialog = false;
                                    this.getTree();
                                    this.refreshPageRequest(this.pageRequest.pageNo);                                    
                                    this.$refs['shopForm'].resetFields()
                                    this.shopForm={
                                        id: '',
                                        orgName: '',
                                        orgLevel:'',
                                        fateherId: 0,
                                        parentName: '',
                                        address: '',
                                        contactEmp:'',
                                        mobilePhone:"",
                                        firstLevelId:"",
                                        isShop:false,
                                        isEnable:true,
                                        status:1,
                                        userId:'',
                                        remark:''
                                    }
                                }
                            }).catch((res) => {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            });
                        }else{
                            //更新提交updataShop
                            this.$api.dept.updataShop(self.shopForm).then((res) => {
                                if(res.messages[0]=="ShopName duplication"){
                                    this.$message({
                                        message: "名称重复",
                                        type: 'error'
                                    })
                                    return 
                                }
                                if(res.messages[0]=="RootNode name cannot duplication") {
                                    this.$message({
                                        message: "一级组织架构名称不能重复",
                                        type: 'error'
                                    })
                                } else {
                                    //debugger
                                    this.shopDialog = false;
                                    this.getTree();
                                    this.refreshPageRequest(this.pageRequest.pageNo);                                    
                                    this.$refs['shopForm'].resetFields()
                                    this.shopForm=this.shopForm={
                                        id: '',
                                        orgName: '',
                                        orgLevel:'',
                                        fateherId: 0,
                                        parentName: '',
                                        address: '',
                                        contactEmp:'',
                                        mobilePhone:"",
                                        firstLevelId:"",
                                        isShop:false,
                                        isEnable:true,
                                        status:1,
                                        userId:'',
                                        remark:''
                                    }
                                }
                            }).catch((res) => {
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            });
                        }
                        
                    }).catch(() => {
                        //this.shopDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        //按钮关闭弹窗
        closeDialog(){
            this.getTree();
            this.shopDialog = false
            this.$refs['shopForm'].clearValidate();
            this.shopForm={
                id: '',
                orgName: '',
                orgLevel:'',
                fateherId: 0,
                parentName: '',
                address: '',
                contactEmp:'',
                mobilePhone:"",
                firstLevelId:"",
                isShop:false,
                isEnable:true,
                status:1,
                userId:'',
                remark:''
            }
        },
        handleClose(){
            this.getTree();
            this.shopDialog = false
            this.$refs['shopForm'].clearValidate();
            this.shopForm={
                id: '',
                orgName: '',
                orgLevel:'',
                fateherId: 0,
                parentName: '',
                address: '',
                contactEmp:'',
                mobilePhone:"",
                firstLevelId:"",
                isShop:false,
                isEnable:true,
                status:1,
                userId:'',
                remark:''
            }
        },
        submitDeptForm(){
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                    }).catch(() => {
                        this.shopDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        //获取树形菜单子门店id
        getNodes(treeNode){
            //debugger            
            //获取所有子节点
            var childNodes=treeNode.children;
            //拼接字符串
            if(childNodes.length<1){                
                this.ids+=treeNode.id+",";
            }
            //循环子节点
            for(var i=0;i<childNodes.length;i++){
            //递归调用
                this.getNodes(childNodes[i]);
            }
            return this.ids;          
        },
        toTreeData(data, attr,type) {
            let tree = [];
            let resData = data;
            //debugger
            for (let i = 0; i < resData.length; i++) {
                if (resData[i].fateherId === attr.rootId) {
                    let obj = {
                        id:resData[i][attr.id],
                        orgName:resData[i][attr.orgName],    
                        fateherId: resData[i][attr.fateherId],
                        parentName: resData[i][attr.parentName],
                        address:resData[i][attr.address],
                        isShop:resData[i][attr.isShop],
                        contactEmp:resData[i][attr.contactEmp],
                        isEnable:resData[i][attr.isEnable],
                        firstLevelId:resData[i][attr.firstLevelId],
                        mobilePhone:resData[i][attr.mobilePhone],
                        orgLevel:resData[i][attr.orgLevel],
                        userId:resData[i][attr.userId],
                        status:resData[i][attr.status],
                        remark:resData[i][attr.remark],
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
                            if (treeArrs[i].id === resData[j][attr.fateherId]) {
                                let obj = {
                                    id:resData[j][attr.id],
                                    orgName:resData[j][attr.orgName],    
                                    fateherId: resData[j][attr.fateherId],
                                    parentName: treeArrs[i].orgName,
                                    address:resData[j][attr.address],
                                    isShop:resData[j][attr.isShop],
                                    contactEmp:resData[j][attr.contactEmp],
                                    isEnable:resData[j][attr.isEnable],
                                    firstLevelId:resData[j][attr.firstLevelId],
                                    mobilePhone:resData[j][attr.mobilePhone],
                                    orgLevel:resData[j][attr.orgLevel],
                                    userId:resData[j][attr.userId],
                                    status:resData[j][attr.status],
                                    remark:resData[j][attr.remark],
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
            /* console.log(tree)
            debugger */
            return tree;
        }

    }
};
</script>

