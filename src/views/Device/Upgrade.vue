<style lang="scss" scoped>
.upgrade{
    background-color: #fff;
    padding: 0 10px 10px;
    .upgradeSelect{
        width: 100%
    }
}
</style>

<template>
    <div class="upgrade">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div class="buttons" style="display:inline-block;">
                    <el-button type="primary" @click="addupgrade">
                        <i class="fa fa-plus"></i>
                        <span>新建升级策略</span>
                    </el-button>
                    <el-button type="primary" @click="delupgrade">
                        <i class="fa fa-trash"></i>
                        <span>删除升级策略</span>
                    </el-button>                    
                </div>
                <div style="margin: 20px 0;display:inline-block;">
                    <el-input placeholder="按升级策略名称搜索" v-model="searchVal" class="input-with-select" 
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
                            <el-table-column prop="upgradeName" label="升级策略名称" min-width="130" align="center"></el-table-column>
                            <el-table-column label="升级类型" min-width="180" align="center">
                                <template  slot-scope="scope" >
                                    <span>{{scope.row.upgradeType=='1'?'固件':'软件'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="deviceModel" label="升级设备型号"  min-width="180" align="center"></el-table-column>
                            <el-table-column prop="area" label="区域"  min-width="180" align="center"></el-table-column>
                            <el-table-column prop="company" label="所属公司"  min-width="180" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="升级组织架构"  min-width="180" align="center"></el-table-column>
                            <el-table-column prop="upgradeTime" label="升级时间"  min-width="180" align="center"></el-table-column>
                            <el-table-column prop="realName" label="创建人"  min-width="180" align="center"></el-table-column>
                            <el-table-column label="启用" align="center">
                                <template slot-scope="scope" >
                                    <el-switch                                    
                                        on-color="#5B7BFA"
                                        off-color="#dadde5"
                                        v-model="scope.row.isEnable"
                                        @change="changeSwitch(scope.row)"   
                                    >
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                                    <el-button @click="handleLog(scope.row)" type="text" size="small">日志</el-button>
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
            :title="upgradeDialogTitle"
            width="40%"
            :visible.sync="upgradeDialog"
            @close="handleClose"
            :close-on-click-modal="false"
            >
            <el-form :model="upgradeForm" :rules="upgradeRule" ref="upgradeForm" 
                label-width="110px" 
                :size="size"
                style="text-align:left;">
                
                <el-form-item label="升级策略名称" prop="upgradeName">
                    <el-input v-model.trim="upgradeForm.upgradeName" :placeholder="lookStatus?'':'输入名称'" maxlength=20 :disabled="lookStatus"></el-input>
                </el-form-item>
                <el-form-item label="升级类型" prop='upgradeType'>
                    <el-select v-model="upgradeForm.upgradeType" :placeholder="lookStatus?'':'点击选择硬件还是软件'" class="upgradeSelect"  :disabled="lookStatus">
                        <el-option v-for="item in select.upgradeType" :key="item.id" :label="item.label" :value="item.value" ></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="升级设备型号" prop='deviceModel'>
                    <el-select v-model="upgradeForm.deviceModel" :placeholder="lookStatus?'':'点击选择型号'" class="upgradeSelect"  :disabled="lookStatus">
                        <el-option :label="item.unitTypeName" :value="item.unitTypeName" v-for='(item,index) in coreList' :key='index'></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="版本选择" prop='softVersion'>
                    <el-select v-model="upgradeForm.softVersion" :placeholder="lookStatus?'':'点击选择对应版本'" class="upgradeSelect"  :disabled="lookStatus">
                        <el-option v-for="item in select.softVersion" :key="item.id" :label="item.name+' - '+item.version" :value="item.version" ></el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="升级组织架构" prop='orgId'>
                    <popup-tree-input
                        :data="popupTreeData"
                        :disabled="lookStatus"
                        :showCheckbox="false"
                        :props="popupTreeProps"
                        :prop="upgradeForm.orgName==null?'':upgradeForm.orgName"
                        :nodeKey="''+upgradeForm.orgId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
                <el-form-item label="升级时间" prop='upgradeTime'>
                    <el-date-picker
                        class="upgradeSelect"
                        v-model="upgradeForm.upgradeTime"
                        type="datetime"
                        :placeholder="lookStatus?'':'选择日期时间'"
                        default-time="12:00:00"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="lookStatus">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model.trim="upgradeForm.remark" :placeholder="lookStatus?'':'输入备注信息'" :disabled="lookStatus"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitupgradeForm('upgradeForm')" v-if="!lookStatus">{{'提交'}}</el-button>
                    <el-button :size="size" @click="upgradeDialog = false" v-if="upgradeBtnShow">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('upgradeForm')" v-if="!upgradeBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!-- 日志-->
        <el-dialog
            :title="logDialogTitle"
            width="60%"
            :visible.sync="logDialog"
            @close="logDialogClose"
            :close-on-click-modal="false"
            >
            <table-List :tableData='logData' @detailLook="detailLook"></table-List> <!--  -->
        </el-dialog>
        <!-- 详情 -->
        <el-dialog
            :title="logDetailDialogTitle"
            width="60%"
            :visible.sync="logDetailDialog"
            @close="logDetailDialogClose"
            :close-on-click-modal="false"
            >
            <log-detail :tableData='logDetailData' ></log-detail>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
import TableList from "@/components/TableList"
import LogDetail from "@/components/TableList/detail"
import { toTreeData } from "@/utils/tree"
export default { 
    components:{
        PopupTreeInput,
        TableList,
        LogDetail
	},   
    data(){
        return {
            size: 'small',
            searchVal:'',
            tableData:[],
            selections: [], // 列表选中列
            allSelect: false,
            popupTreeData: [],
            popupTreeProps: {
				label: 'orgName',
				children: 'children'
			},
            // 分页信息
            pageRequest: {
                pageNo: 1,
                pageSize: 10,
                id:this.$route.query.id||""
            },
            lookStatus:false,
            editStatus:false,
            upgradeDialogTitle:'新建自动升级策略',
            upgradeDialog:false,
            upgradeBtnShow:-1,
            select:{
                deviceModel:'',
                softVersion:'',
                upgradeType:[{
                    label:'固件',
                    value:1
                }],
            },
            coreList:[],
            upgradeForm: {
                upgradeName:'',
                deviceModel:'',
                softVersion:'',
                upgradeType:'',
                orgId:'',
                orgName:'',
                isEnable:true,
                upgradeTime:'',
                createUser:'',
                remark:''
            },
            upgradeRule: {
                upgradeName: [
                    { required: true, message: '升级策略名称不能为空',trigger: 'blur' }
                ],
                deviceModel: [
                    { required: true, message: '升级设备型号不能为空',trigger: 'change' }
                ],
                softVersion: [
                    { required: true, message: '版本选择不能为空',trigger: 'change' }
                ],
                upgradeType: [
                    { required: true, message: '升级类型不能为空',trigger: 'change' }
                ],
                orgId: [
                    { required: true, message: '升级组织架构不能为空',trigger: 'change' }
                ],
                upgradeTime: [
                    { required: true, message: '升级时间不能为空',trigger: 'change' }
                ]
            },
            logDialog:false,
            logDialogTitle:'单个升级策略日志',
            logData:{},
            logDetailDialogTitle:'升级详情日志',
            logDetailDialog:false,
            logDetailData:{}
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getCoreList();
        this.getTree();
        this.getVersion();
    },
    methods:{
        //获取DG内核型号
        getCoreList(){
            this.$api.device.getCoreList().then(res => {                  
                this.coreList = res.content;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //获取设备型号
        getDevType(){
            this.$api.device.getDevModel().then(res => {                  
                this.select.deviceModel = res.content;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //获取升级版本
        getVersion(){
            let pageRequest = {
                pageNo: 1,
                pageSize: 9999
            }
            this.$api.device.queryDevFileList(pageRequest).then(res => {
                if(res != null){                    
                    this.select.softVersion = res.content.list;
                }                  
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //获取树形菜单
        getTree: function() {
            this.$api.dept.getTree().then(res => {
                if(res.content.length>0){
                    let treeList = res.content;
                    this.popupTreeData = treeList; 
                }
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        // 机构树选中
        handleTreeSelectChange (data, node) {
            this.upgradeForm.orgId = data.id
            this.upgradeForm.orgName = data.orgName
            this.upgradeForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.upgradeForm.firstLevelId = data.firstLevelId
            }else{
                this.upgradeForm.firstLevelId = data.id
            }
        }, 
        //弹窗table查看事件
        detailLook(row){
            this.$api.device.logDetailList({
                sid:row.id
            }).then(res => { 
                this.logDialog = false;
                this.logDetailDialog = true;
                this.logDetailData = res.content;
                this.logDetailData.map((item)=>{                    
                    item.upgradeName = row.upgradeName
                    item.realName = row.realName
                });
                console.log(this.logDetailData);
                debugger
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //关闭
        logDetailDialogClose(){
            this.logDetailDialog = false;
        },
        //序列号
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        //启用
        changeSwitch(row){
            this.$confirm(row.isEnable?'是否启用此升级策略？':'请确认要禁用此升级策略吗？禁用后对应设备的自动升级功能策略将失效', '提示', {}).then(() => {
                //debugger
                let params = {
                    sid:row.id,
                    enable:row.isEnable
                }
                this.$api.device.updEnable(params).then((res) => {
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
        //新建角色
        addupgrade(){
            this.upgradeBtnShow = false            
            this.upgradeDialog = true;
            this.lookStatus = false;
            this.editStatus = false;
            this.upgradeDialogTitle = "新建自动升级策略"             
            this.upgradeForm = {
                upgradeName:'',
                deviceModel:'',
                softVersion:'',
                upgradeType:'',
                orgId:'',
                orgName:'',
                isEnable:true,
                upgradeTime:'',
                createUser:'',
                remark:''
            }
            if(this.$refs['upgradeForm']){                
                this.$refs['upgradeForm'].clearValidate()
            }
        },
        //删除角色
        delupgrade(){
            //debugger
            if(this.selections==""){
                this.$message({
                    message: '请选择升级策略',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要删除此升级策略吗？删除后对应设备的自动升级功能策略将失效', '删除', {
				type: 'warning'
            }).then(() => {
                //del
                this.$api.device
                .delUpgrade({sids:this.selections})
                .then(res => {
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
            this.pageRequest.name = this.searchVal
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
        //页码改变事件
        handleSizeChange(size){
            this.pageRequest.pageSize = size;
            this.findPage();
        },
        // 获取分页数据
        getPage: function(data) {
            if (data !== null) {
                this.pageRequest = data.pageRequest;
            }
            this.$api.device
                .getUpgradeList(this.pageRequest)
                .then(res => {
                    if(res.result == "success"){  
                        //debugger                      
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
        //查看
        handleLook(row){
            //console.log(row);
            this.upgradeBtnShow = true;
            this.upgradeDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.upgradeDialogTitle = "查看自动升级策略"
            this.upgradeForm = JSON.parse(JSON.stringify(row));
        },
        //编辑
        handleEdit(row){
            if(!row.isEnable){
                this.upgradeBtnShow = true;
                this.upgradeDialog = true;
                this.lookStatus = true;
                this.editStatus = false;
            }else{               
                this.upgradeBtnShow = false
                this.upgradeDialog = true;
                this.lookStatus = false;
                this.editStatus = true;
            }
            this.upgradeDialogTitle = "编辑自动升级策略"
            this.upgradeForm = JSON.parse(JSON.stringify(row));
            
        },
        //列表日志事件
        handleLog(row){
            let sid = row.id;
            //this.logData =
            this.$api.device.logList({sid:sid}).then(res =>{
                //debugger
                this.logData = res;                
                this.logDialog = true;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //提交
        submitupgradeForm(upgradeForm){
            let self =this;
            this.$refs[upgradeForm].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        if(!self.upgradeForm.id ||self.upgradeForm.id ==""){                            
                            self.$api.device
                            .addUpgrade(self.upgradeForm)
                            .then(res => {
                                if(res.messages[0] == '12001'){
                                    this.$message({
                                        message: '该组织架构未绑定设备。',
                                        type: 'error'
                                    }) 
                                    return
                                }
                                if(res.messages[0] == '12000'){
                                    this.$message({
                                        message: '升级型号和时间不能重复。',
                                        type: 'error'
                                    }) 
                                    return
                                }
                                if(res.result == "success"){
                                    self.upgradeDialog = false;                                
                                    self.refreshPageRequest(self.pageRequest.pageNo);                                    
                                    self.$refs['upgradeForm'].resetFields()
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
                            self.$api.device
                            .updUpgrade(self.upgradeForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.upgradeDialog = false;                                
                                    self.refreshPageRequest(self.pageRequest.pageNo);                                    
                                    self.$refs['upgradeForm'].resetFields()
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
                        //self.upgradeDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        //关闭日志弹窗
        logDialogClose(){
            this.logDialog = false;
        },
        //关闭弹窗
        handleClose(){
            this.upgradeDialog = false;            
            this.upgradeForm.upgradeName = "";
            this.upgradeForm.deviceModel = "";
            this.upgradeForm.softVersion = "";
            this.upgradeForm.upgradeType = "";
            this.upgradeForm.orgId = "";
            this.upgradeForm.orgName = "";
            this.upgradeForm.upgradeTime = "";
            this.upgradeForm.remark = "";
            this.$refs['upgradeForm'].clearValidate()
        },
        resetBtn(formName){
            this.upgradeForm.upgradeName = "";
            this.upgradeForm.deviceModel = "";
            this.upgradeForm.softVersion = "";
            this.upgradeForm.upgradeType = "";
            this.upgradeForm.orgId = "";
            this.upgradeForm.orgName = "";
            this.upgradeForm.upgradeTime = "";
            this.upgradeForm.remark = "";
            this.$refs['upgradeForm'].clearValidate()
        }
    }
}
</script>
