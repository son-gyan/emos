<style lang="scss" scoped>
.warn{
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
    .input-with-select{
        min-width:400px; 
    }
}
</style>

<template>
    <div class="warn">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <!-- <div class="buttons" style="display:inline-block;">
                    <el-button type="primary" @click="addwarn">
                        <i class="fa fa-plus"></i>
                        <span>新建告警策略</span>
                    </el-button>                                       
                </div> -->
                <div style="margin: 20px 0;display:inline-block;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >
                            <el-button type="primary" @click="addwarn">
                                <i class="fa fa-plus"></i>
                                <span>新建告警策略</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-button type="primary" @click="delwarn">
                                <i class="fa fa-trash"></i>
                                <span>删除告警策略</span>
                            </el-button> 
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件">
                                <el-option label="告警名称" value="name"></el-option>
                                <el-option label="设备型号" value="model"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按告警名称，设备型号等字段进行搜索" v-model="searchValue" class="input-with-select"  
                                @input="e => searchValue = validForbid(e)"
                                @keyup.enter.native="search">
                                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-form>

                    
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
                            :data="tableData.list"
                            border
                            height="600"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                            <el-table-column prop="alarmName" label="告警名称" width="180" align="center"></el-table-column>
                            <el-table-column prop="deviceModel" label="设备型号" width="100" align="center"></el-table-column>
                            <el-table-column prop="triggeringCond" label="触发条件" width="130" align="center"></el-table-column>
                            <el-table-column label="告警等级" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.alarmLevel =='1'">警告</span>
                                    <span v-else-if="scope.row.alarmLevel =='0'">一般</span>
                                    <span style="color:red"  v-else-if="scope.row.alarmLevel =='2'">严重</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="area" label="区域" align="center"></el-table-column>
                            <el-table-column prop="company" label="所属公司" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="组织架构" align="center"></el-table-column>
                            <el-table-column prop="notifiedPersonName" label="被通知人" min-width="130" align="center"></el-table-column>
                            <el-table-column prop="pushMethod" label="通知方式" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.pushMethod =='email'">邮箱</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="isEnable" label="启用" align="center">
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
                            <el-table-column fixed="right" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                                    <el-button  @click="handleCope(scope.row)" type="text" size="small">复制</el-button>
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
            :title="warnDialogTitle"
            width="45%"
            @close="handleClose"
            :visible.sync="warnDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="warnForm"
                :rules="warnRule"
                ref="warnForm"
                @keyup.enter.native="submitwarnForm()"
                label-width="140px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="告警名称" prop="alarmName">
                    <el-input v-model.trim="warnForm.alarmName" :placeholder="lookStatus?'':'告警名称'" :disabled="lookStatus" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="设备型号" prop="deviceModel">
                    <el-select v-model="warnForm.deviceModel" :placeholder="lookStatus?'':'请选择设备型号'" class="roleSelect" :disabled="lookStatus">
                        <el-option :label="item.name" :value="item.value" v-for="(item,index) in devModelList" :key="index"></el-option>
                    </el-select>
                    <!-- <el-input v-model.trim="warnForm.deviceModel" placeholder="告警名称" :disabled="lookStatus"></el-input> -->
                </el-form-item>
                <el-form-item label="触发项目" prop="triggeringItem">
                    <el-select v-model="warnForm.triggeringItem" :placeholder="lookStatus?'':'请选择触发项目'" class="roleSelect" :disabled="lookStatus">
                        <el-option label="CPU" value="cpu"></el-option>
                        <el-option label="内存" value="memory"></el-option>
                        <el-option label="硬盘" value="disk"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="触发条件" prop="triggeringCond">
                    <el-select v-model="warnForm.triggeringCond" :placeholder="lookStatus?'':'请选择触发条件'" class="roleSelect" :disabled="lookStatus">
                        <el-option label="60%" value="60"></el-option>
                        <el-option label="70%" value="70"></el-option>
                        <el-option label="80%" value="80"></el-option>
                        <el-option label="90%" value="90"></el-option>
                        <el-option label="100%" value="100"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间间隔（分钟）" prop="pushInterval">
                    <el-input v-model.trim="warnForm.pushInterval" :placeholder="lookStatus?'':'请输入时间间隔'" :disabled="lookStatus" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="告警等级" prop="alarmLevel">
                    <el-select v-model="warnForm.alarmLevel" :placeholder="lookStatus?'':'请选择告警等级'" class="roleSelect" :disabled="lookStatus">
                        <el-option label="一般" value="0"></el-option>
                        <el-option label="警告" value="1"></el-option>
                        <el-option label="严重" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组织架构" prop="orgId" >
                    <popup-tree-input
                        :data="popupTreeData"
                        :disabled="lookStatus"
                        :props="popupTreeProps"
                        :prop="warnForm.orgName==null?'':warnForm.orgName"
                        :nodeKey="''+warnForm.orgId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
                <el-form-item label="被通知人" prop="notifiedPersonId">
                    <el-select v-model="warnForm.notifiedPersonId" filterable multiple :placeholder="lookStatus?'':'可下拉多选被通知的用户'" class="roleSelect"  :disabled="lookStatus">
                        <el-option v-for="(item,n) in userItems" :key="n" :label="item.realName" :value="item.id" ></el-option>
                    </el-select> <!-- filterable -->
                </el-form-item>
                <el-form-item label="通知方式" prop="pushMethod">
                    <el-select v-model="warnForm.pushMethod"  :placeholder="lookStatus?'':'选择通知方式'" class="roleSelect"  :disabled="lookStatus">
                        <el-option  label="邮箱" value="email" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model.trim="warnForm.remark" :placeholder="lookStatus?'':'备注'" :disabled="lookStatus" resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitwarnForm()" v-if="!lookStatus">{{'提交'}}</el-button>                    
                    <el-button :size="size" @click="handleClose" v-if="warnBtnShow">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('warnForm')" v-if="!warnBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
import { toTreeData } from "@/utils/tree"
export default {
    components:{
        PopupTreeInput
	},
    data(){
        return {
            size: 'small',
            searchKey:'',
            searchValue:'',
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
                pageSize: 10
            },
            lookStatus:false,
            editStatus:false,
            userItems:'',
            warnForm:{
                id:'',
                alarmName:'' ,
                deviceModel:'',
                triggeringItem:'' ,
                triggeringCond:'' ,
                pushInterval:60,
                alarmLevel: '',
                area: '',
                company:'',
                orgId:'',
                parentName:'',
                status:'',
                notifiedPerson:[],
                notifiedPersonId:[],
                notifiedPersonName:'',
                pushMethod:'',
                remark:''
            },
            warnRule: {
                id:[
                   { required: true, message: '用户ID不能为空', trigger: 'blur' } 
                ],
                alarmName: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' }
                ],
                pushInterval: [
                    { required: true, message: '时间间隔不能为空', trigger: 'blur' }
                ],
                deviceModel: [
                    { required: true, message: '设备型号不能为空', trigger: 'change' }
                ],
                triggeringItem: [
                    { required: true, message: '触发项目不能为空',trigger: 'change' }
                ],
                triggeringCond: [
                    { required: true, message: '触发条件不能为空',trigger: 'change' }
                ],
                alarmLevel: [
                    { required: true, message: '告警等级不能为空', trigger: 'change' }
                ],
                orgId: [
                    { required: true, message: '组织架构不能为空', trigger: 'change' }
                ],
                notifiedPersonId: [
                    { required: true, message: '被通知人不能为空', trigger: 'change' }
                ],
                pushMethod: [
                    { required: true, message: '通知方式不能为空', trigger: 'change' }
                ]
            },
            warnDialogTitle:'新建告警策略',
            warnDialog:false,
            warnBtnShow:-1,
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
            devModelList:[]
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getTree();
        this.getUserList();
        this.getDevModel()
    },
    methods:{
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },        
        //获取设备型号
        getDevModel(){
            this.$api.device.getDevModel().then(res => {
                if(!res){
                    return
                }
                this.devModelList = res.content;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //启用
        changeSwitch(row) {
            this.$confirm(row.isEnable?'是否启用此告警？':'是否禁用此告警？', '提示', {}).then(() => {
                let params = {
                    uid:row.id,
                    enable:row.isEnable
                }
                this.$api.warn.updEnable(params).then((res) => {
                    if(res.errors.length>0) {
                        this.$message({
                            message: res.errors,
                            type: 'error'
                        })
                    } else {
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
        //获取树形菜单
        getTree: function() {
            this.$api.dept.getTree().then(res => {
                //this.treeList = toTreeData(res.content);
                this.treeList = res.content;
                this.popupTreeData = this.treeList;
                //this.popupTreeData = this.getParentMenuTree(res.data.record)
                this.$store.commit('setDropDownTree', this.treeList) 
            });
        },
        // 机构树选中
        handleTreeSelectChange (data, node) {
            this.warnForm.fateherId = data.id
            this.warnForm.orgId = data.id
            this.warnForm.orgName = data.orgName
            this.warnForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.warnForm.firstLevelId = data.firstLevelId
            }else{
                this.warnForm.firstLevelId = data.id
            }
        }, 
        //获取用户列表
        getUserList(){
            let params = {
                pageNo:0,
                pageSize:999
            }
            this.$api.user
                .findPage(params)
                .then(res => {
                    if(res.result == "success"){
                        this.userItems = res.content.list
                    }else{
                        this.$message({
                            message: '获取列表失败',
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
        //新建
        addwarn(){
            this.warnBtnShow = false
            this.warnDialog = true;
            this.lookStatus = false;
            this.editStatus = false;
            this.warnDialogTitle = "新建告警策略"
            if(this.$refs['warnForm']){                
                this.$refs['warnForm'].clearValidate() 
            }
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
        /* //导出弹窗
        reorder(){
            this.exportDialog = !this.exportDialog
        },
        exportCheckChange(value){
            console.log(value);
        },
        //导出
        exportBtn(){

        }, */
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
            this.$api.warn
                .findPage(this.pageRequest)
                .then(res => {
                    this.tableData = res.content;
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
            debugger
            //console.log(row);
            this.warnBtnShow = true;
            this.warnDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.warnDialogTitle = "查看告警策略"
            this.warnForm = {
                id:row.id,
                alarmName:row.alarmName ,
                deviceModel:row.deviceModel,
                triggeringItem:row.triggeringItem ,
                triggeringCond:row.triggeringCond ,
                pushInterval:row.pushInterval,
                alarmLevel: String(row.alarmLevel),
                area: row.area,
                company:row.company,
                orgId:row.orgId,
                orgName:row.orgName,
                status:row.status,
                notifiedPersonName:row.notifiedPersonName!=null?row.notifiedPersonName.split(","):'',
                notifiedPersonId:row.notifiedPersonName!=null?row.notifiedPerson.split(",").map(Number):'',
                pushMethod:row.pushMethod,
                remark:row.remark
            }
            if(this.$refs['warnForm']){                
                this.$refs['warnForm'].clearValidate() 
            }
        },
        //编辑
        handleEdit(row){
            //debugger
            this.warnBtnShow = false
            this.warnDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.warnDialogTitle = "编辑告警策略"
            if(!row.isEnable){
                this.lookStatus = true;
                this.warnBtnShow = true;
            }
            this.warnForm = {
                id:row.id,
                alarmName:row.alarmName ,
                alarmPushOrgId:row.alarmPushOrgId ,
                deviceModel:row.deviceModel,
                triggeringItem:row.triggeringItem ,
                triggeringCond:row.triggeringCond ,
                pushInterval:row.pushInterval,
                alarmLevel: String(row.alarmLevel),
                area: row.area,
                company:row.company,
                orgId:row.orgId||"",
                orgName:row.orgName,
                status:row.status,
                notifiedPersonName:row.notifiedPersonName!=null?row.notifiedPersonName.split(","):'',
                notifiedPersonId:row.notifiedPersonName!=null?row.notifiedPerson.split(",").map(Number):'',
                pushMethod:row.pushMethod,
                remark:row.remark
            }
        },
        //复制
        handleCope(row){
            this.warnBtnShow = false
            this.warnDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.warnDialogTitle = "复制并新建告警"
            this.warnForm = {
                id:"",
                alarmName:row.alarmName ,
                alarmPushOrgId:row.alarmPushOrgId ,
                deviceModel:row.deviceModel,
                triggeringItem:row.triggeringItem ,
                triggeringCond:row.triggeringCond ,
                pushInterval:row.pushInterval,
                alarmLevel: String(row.alarmLevel),
                area: row.area,
                company:row.company,
                orgId:row.orgId,
                orgName:row.orgName,
                status:row.status,
                notifiedPersonName:row.notifiedPersonName!=null?row.notifiedPersonName.split(","):'',
                notifiedPersonId:row.notifiedPersonName!=null?row.notifiedPerson.split(",").map(Number):'',
                pushMethod:row.pushMethod,
                remark:row.remark
            }
        },
        //删除
        delwarn(){
            let self = this;
            if(self.selections == ""){
                this.$message({
                    message: '请选择告警策略',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要删除此策略吗？删除后该策略管理的告警将失效。', '删除', {
				type: 'warning'
            }).then(() => {
                self.$api.warn
                    .delAlarm({ids:self.selections})
                    .then(res => { 
                        if(res.result == "success"){
                            self.warnDialog = false; 
                            self.findPage();
                        }else{
                            this.$message({
                                message: '删除失败',
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
        //提交
        submitwarnForm(){
            let self =this;
            this.$refs['warnForm'].validate((valid) => {
                if (valid) {
                    //debugger
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        let ids = ""
                        self.warnForm.notifiedPersonId.map((item)=>{
                            ids += item+','
                        }); 
                        self.warnForm.notifiedPerson = ids.substr(0, ids.length - 1); 
                        let names = ""
                        if(self.warnForm.notifiedPersonName&&self.warnForm.notifiedPersonName!=""){
                            let notifiedPersonName = JSON.parse(JSON.stringify(self.warnForm.notifiedPersonName));                            
                            notifiedPersonName.map((item)=>{
                                names += item+','
                            }); 
                            self.warnForm.notifiedPersonName = names.substr(0, names.length - 1); 
                        }
                        if(!self.warnForm.id||self.warnForm.id==""){
                            self.$api.warn
                            .addAlarm(self.warnForm)
                            .then(res => {                                
                                if(res.messages[0]=="12001"){
                                    this.$message({
                                        message: '该组织架构下无设备！',
                                        type: 'error'
                                    })
                                    return
                                }
                                if(res.result == "success"){
                                    self.warnDialog = false;                                
                                    self.findPage();                  
                                    self.warnForm = {
                                        id:'',
                                        alarmName:'' ,
                                        deviceModel:'',
                                        triggeringItem:'' ,
                                        triggeringCond:'' ,
                                        pushInterval:60,
                                        alarmLevel: '',
                                        area: '',
                                        company:'',
                                        orgId:'',
                                        parentName:'',
                                        status:'',
                                        notifiedPersonId:[],
                                        pushMethod:'',
                                        remark:''
                                    }
                                    if(self.$refs['warnForm']){                
                                        self.$refs['warnForm'].clearValidate() 
                                    } 
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    }) 
                                }else{
                                    this.$message({
                                        message: '新增失败',
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
                            self.$api.warn
                            .updAlarm(self.warnForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.warnDialog = false;                                
                                    self.findPage();
                                    self.warnForm = {
                                        id:'',
                                        alarmName:'' ,
                                        deviceModel:'',
                                        triggeringItem:'' ,
                                        triggeringCond:'' ,
                                        pushInterval:60,
                                        alarmLevel: '',
                                        area: '',
                                        company:'',
                                        orgId:'',
                                        parentName:'',
                                        status:'',
                                        notifiedPersonId:[],
                                        pushMethod:'',
                                        remark:''
                                    }
                                    if(self.$refs['warnForm']){                
                                        self.$refs['warnForm'].clearValidate() 
                                    } 
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    }) 
                                }else{
                                    this.$message({
                                        message: '更新失败',
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
                        //this.warnDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        resetBtn(formName){
            this.warnForm = {
                alarmName:'' ,
                deviceModel:'',
                triggeringItem:'' ,
                triggeringCond:'' ,
                pushInterval:60,
                alarmLevel: '',
                area: '',
                company:'',
                orgId:'',
                orgName:'',
                status:'',
                notifiedPersonId:[],
                pushMethod:'',
                remark:''
            }
            this.$refs['warnForm'].clearValidate() 
        },
        handleClose(){ 
            this.warnDialog = false;            
            this.warnForm = {
                alarmName:'' ,
                deviceModel:'',
                triggeringItem:'' ,
                triggeringCond:'' ,
                pushInterval:60,
                alarmLevel: '',
                area: '',
                company:'',
                orgId:'',
                orgName:'',
                status:'',
                notifiedPersonId:[],
                pushMethod:'',
                remark:''
            }
            this.$refs['warnForm'].clearValidate() 
        }
    }
}
</script>

