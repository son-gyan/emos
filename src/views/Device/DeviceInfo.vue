<style lang="scss" scoped>
.deviceInfo{
    background-color: #fff;
    padding: 0 10px 10px;
    .roleSelect{
        width: 100%
    }
    .inp{
        /* min-width:150px;  */
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
    <div class="deviceInfo">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div style="margin: 20px 0;display:inline-block;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件">
                                <el-option label="序列号" value="serial"></el-option>
                                <el-option label="设备名称" value="name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按序列号或设备名称等条件进行搜索" v-model="searchValue" class="input-with-select"  
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
                            <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="id" label="设备ID" width="100" align="center"></el-table-column>
                            <el-table-column prop="deviceName" label="设备名称" width="100" align="center"></el-table-column>
                            <el-table-column prop="serialNumber" label="序列号" width="180" align="center"></el-table-column>
                            <el-table-column prop="deviceModel" label="型号" width="100" align="center"></el-table-column>
                            <el-table-column prop="company" label="所属公司" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="组织架构" align="center"></el-table-column>
                            <el-table-column prop="cpu" label="cpu使用" align="center"></el-table-column>
                            <el-table-column prop="mem" label="内存使用" align="center"></el-table-column>
                            <el-table-column prop="disk" label="硬盘使用" align="center"></el-table-column>
                            <el-table-column prop="status" label="网络状态"  width="158" align="center">
                                <template slot-scope="scope">
                                    <span style="color:red" v-if="scope.row.status =='0'">{{'离线(最后离线时间：'+scope.row.gmtModified+')'}}</span>
                                    <span style="color:green" v-else-if="scope.row.status =='1'">在线</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="firmwareVersion" label="固件版本" width="180" align="center"></el-table-column>
                            <el-table-column prop="softwareVersion" label="软件版本" align="center"></el-table-column>
                            <el-table-column prop="alarmNum" label="告警信息" align="center">
                                <template slot-scope="scope">
                                    <span >{{scope.row.alarmNum||0}}条</span> <!-- style="color:red" -->
                                </template>
                            </el-table-column>
                            <el-table-column prop="realName" label="运维人员" align="center"></el-table-column>
                            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="130"  align="center">
                                <template slot-scope="scope">
                                    <el-button  @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                                    <!-- <el-button  @click="handleEdit(scope.row)" type="text" size="small">报修</el-button> -->
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

        <!-- 新增修改设备查看-->
        <el-dialog
            :title="deviceInfoDialogTitle"
            width="50%"
            top="10vh"
            :visible.sync="deviceInfoDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="deviceInfoForm"
                :rules="deviceInfoRule"
                ref="deviceInfoForm"
                @keyup.enter.native="submitdeviceInfoForm()"
                label-width="110px"
                :size="size"
                style="text-align:left;"
            >
                <el-row type="flex" class="row-bg">
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input class="inp" v-model.trim="deviceInfoForm.deviceName" :placeholder="lookStatus?'':'设备名称'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="设备型号">
                            <el-input class="inp" v-model.trim="deviceInfoForm.deviceModel" :placeholder="lookStatus?'':'设备型号'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="设备序列号">
                            <el-input class="inp" v-model.trim="deviceInfoForm.serialNumber" :placeholder="lookStatus?'':'设备序列号'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="区域">
                            <el-input class="inp" v-model.trim="deviceInfoForm.area" :placeholder="lookStatus?'':'区域'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="所属公司">
                            <el-input class="inp" v-model.trim="deviceInfoForm.company" :placeholder="lookStatus?'':'所属公司'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="运维人员">
                            <el-select class="roleSelect" v-model="deviceInfoForm.realNameId" filterable :placeholder="lookStatus?'':'可搜索运维人员，也可下拉选择'" :disabled="lookStatus"  >  <!-- -->
                                <el-option :label="item.realName" :value="item.id" v-for="(item,index) in userList" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="状态" prop="status">
                            <el-select v-model="deviceInfoForm.status" placeholder="请选择状态：已处理、未处理，关闭"   :disabled="lookStatus">
                                <el-option v-for="item in userItems" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                            </el-select>
                        </el-form-item> -->                    
                    </el-col>
                    <el-col :span="12">                    
                        <el-form-item label="固件版本">
                            <el-input class="inp" v-model.trim="deviceInfoForm.firmwareVersion" :placeholder="lookStatus?'':'固件版本'" :disabled="lookStatus"></el-input>
                        </el-form-item>                    
                        <el-form-item label="软件版本">
                            <el-input class="inp" v-model.trim="deviceInfoForm.softwareVersion" :placeholder="lookStatus?'':'软件版本'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="网络状态">
                            <el-input class="inp" v-model.trim="deviceInfoForm.status" :placeholder="lookStatus?'':'网络状态'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="告警信息">
                            <el-input class="inp" v-model.trim="deviceInfoForm.alarmNum" :placeholder="lookStatus?'':'告警信息'" :disabled="lookStatus"></el-input>
                        </el-form-item>
                        <el-form-item label="组织架构">
                            <popup-tree-input
                                class="inp"
                                :data="popupTreeData"
                                :disabled="lookStatus"
                                :props="popupTreeProps"
                                :prop="deviceInfoForm.orgName==null?'':deviceInfoForm.orgName"
                                :nodeKey="''+deviceInfoForm.orgId"
                                :currentChangeHandle="handleTreeSelectChange"
                            ></popup-tree-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input class="inp" type="textarea" v-model.trim="deviceInfoForm.remark" :placeholder="lookStatus?'':'备注'" :disabled="lookStatus"  resize="none" rows=5 maxlength="200"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                
                <el-form-item style="display:block;text-align:center;">
                    <el-button :size="size" type="primary" @click="submitDeviceInfoForm()" v-if="!lookStatus">{{'提交'}}</el-button>                    
                    <el-button :size="size" @click="deviceInfoDialog = false" v-if="deviceInfoBtnShow" style="min-width:100px;">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('deviceInfoForm')" v-if="!deviceInfoBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
import { format } from "@/utils/datetime"
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
            userList:'',
            deviceInfoForm:{},
            deviceInfoRule: {
                status:[
                   { required: true, message: '状态不能为空', trigger: 'change' } 
                ],
                note: [
                    { required: true, message: '处理意见不能为空', trigger: 'blur' }
                ],
                parentName: [
                    { required: true, message: '组织架构不能为空', trigger: 'change' }
                ],
                notifier: [
                    { required: true, message: '被通知人不能为空', trigger: 'change' }
                ]
            },
            deviceInfoDialogTitle:'新建告警策略',
            deviceInfoDialog:false,
            deviceInfoBtnShow:-1
        }
    },    
    computed:{
        deptIDs(){
            return this.$store.state.menu.deptIds 
        },
    },
    watch:{
        deptIDs(val){
            //debugger
            this.findPage();
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getTree();
        this.getUserList();
    },
    methods:{
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        formatDate(val){
            return format(val)
        },
        //获取树形菜单
        getTree: function() {
            this.$api.dept.getTree().then(res => {
                this.popupTreeData = res.content;
            });
        },
        // 机构树选中
        handleTreeSelectChange (data, node) {
            this.deviceInfoForm.fateherId = data.id
            this.deviceInfoForm.orgId = data.id
            this.deviceInfoForm.orgName = data.orgName
            this.deviceInfoForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.deviceInfoForm.firstLevelId = data.firstLevelId
            }else{
                this.deviceInfoForm.firstLevelId = data.id
            }
        }, 
        //获取用户列表
        getUserList(){
            let params = {
                pageNo:0,
                pageSize:999
            }
            let self = this
            this.$api.user
                .findPage(params)
                .then(res => {
                    if(res.result == "success"){
                        self.userList = res.content.list
                        console.log(self.userList);
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
            this.pageRequest.subOrgIds = this.$store.state.menu.deptIds;
            this.$api.device
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
            this.deviceInfoBtnShow = true;
            this.deviceInfoDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.deviceInfoDialogTitle = "查看设备"
            //debugger
            this.deviceInfoForm = {
                id:row.id,
                deviceName:row.deviceName ,
                deviceModel:row.deviceModel,
                serialNumber:row.serialNumber ,
                company: row.company,
                area: row.area,
                cpu:row.cpu,
                mem:row.mem,
                disk:row.disk,
                firmwareVersion:row.firmwareVersion,
                softwareVersion:row.softwareVersion,
                orgId:row.orgId,
                orgName:row.orgName,
                realNameId:row.realNameId,
                realName:row.realName,
                alarmNum:row.alarmNum==null?0:row.alarmNum,
                status:row.status=='0'?'离线(最后离线时间：'+row.gmtModified+')':'在线',
                remark:row.remark
            }
        },
        //编辑
        handleEdit(row){
            this.deviceInfoBtnShow = false
            this.deviceInfoDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.deviceInfoDialogTitle = "告警处理"
            this.deviceInfoForm = {
                id:row.id,
                deviceInfoTime:row.deviceInfoTime ,
                orderNum:row.orderNum,
                deviceName:row.deviceName ,
                deviceType: row.deviceType,
                deviceInfoContent: row.deviceInfoContent,
                level:row.level,
                area:row.area,
                parentId:row.parentId,
                parentName:row.parentName,
                notifier:row.notifier,
                status:row.status,
                note:row.note
            }
        },        
        //关闭警告
        deldeviceInfo(){            
            let self = this;
            if(self.selections == ""){
                this.$message({
                    message: '请选择告警',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要关闭此告警吗？关闭后此告警将处于关闭状态，不再被提醒。', '删除', {
				type: 'deviceInfoing'
            }).then(() => {
                self.$api.DeviceInfo
                    .deldeviceInfoDetail({ids:self.selections})
                    .then(res => { 
                        debugger
                        if(res.result == "success"){
                            self.deviceInfoDialog = false; 
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
        
        submitDeviceInfoForm(){
            this.$refs['deviceInfoForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        let ids = ""
                        self.deviceInfoForm.notifiedPerson.map((item)=>{
                            ids += item+','
                        }); 
                        self.deviceInfoForm.notifiedPerson = ids.substr(0, ids.length - 1); 
                        let names = ""
                        self.deviceInfoForm.notifiedPersonName.map((item)=>{
                            names += item+','
                        }); 
                        self.deviceInfoForm.notifiedPersonName = names.substr(0, names.length - 1); 
                        if(!self.deviceInfoForm.id&&self.deviceInfoForm.id==""){
                            self.$api.deviceInfo
                            .addAlarm(self.deviceInfoForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.deviceInfoDialog = false;                                
                                    self.findPage();                                  
                                    self.deviceInfoForm = {
                                        id:'',
                                        alarmName:'' ,
                                        deviceModel:'',
                                        triggeringCond:'' ,
                                        alarmLevel: '',
                                        area: '',
                                        company:'',
                                        orgId:'',
                                        parentName:'',
                                        status:'',
                                        notifiedPerson:[],
                                        pushMethod:'',
                                        remark:''
                                    }
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
                            self.$api.deviceInfo
                            .updAlarm(self.deviceInfoForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.deviceInfoDialog = false;                                
                                    self.findPage();                                  
                                    self.$refs['deviceInfoForm'].resetFields()
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
                        //this.deviceInfoDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        resetBtn(formName){
            this.$refs[formName].resetFields()
        }
    }
}
</script>

