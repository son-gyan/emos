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
                <div style="margin: 20px 0;display:inline-block;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >                            
                            <el-button type="primary" @click="delwarn">
                                <span>关闭告警</span>
                            </el-button>   
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件">
                                <el-option label="告警时间" value="time"></el-option>
                                <el-option label="设备序列号" value="serial"></el-option>
                                <el-option label="名称" value="name"></el-option>
                                <el-option label="型号" value="model"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按告警时间，设备序列号、名称、型号等条件搜索" v-model="searchValue" class="input-with-select"  
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
                    <div class="main">                        
                        <el-table
                            ref="multipleTable"
                            border
                            :data="tableData.list"
                            height="600"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="id" label="告警ID" width="100" align="center"></el-table-column>
                            <el-table-column label="告警时间" width="180" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.alarmTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="serialNumber" label="设备序列号" width="180" align="center"></el-table-column>
                            <el-table-column prop="deviceName" label="设备名称" width="100" align="center"></el-table-column>
                            <el-table-column prop="deviceModel" label="设备型号" width="100" align="center"></el-table-column>
                            <el-table-column prop="alarmContent" label="告警内容" min-width="200" align="center"></el-table-column>
                            <el-table-column prop="alarmLevel" label="告警等级"  align="center">
                                <template slot-scope="scope">
                                    <span style="color:red" v-if="scope.row.alarmLevel =='2'">{{'严重'}}</span>
                                    <span v-else-if="scope.row.alarmLevel =='0'">{{ '一般' }}</span>
                                    <span v-else-if="scope.row.alarmLevel =='1'">{{ '警告' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="area" label="区域" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="组织架构" align="center"></el-table-column>
                            <el-table-column prop="notifiedPersonName" label="被通知人" align="center"></el-table-column>
                            <el-table-column prop="status" label="状态" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status =='0'">未处理</span>
                                    <span style="color:red" v-else-if="scope.row.status =='1'">已处理</span>
                                    <span style="color:red" v-else-if="scope.row.status =='2'">关闭</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="processingOpinions" label="处理意见" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="180"  align="center">
                                <template slot-scope="scope">
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small"  :disabled="scope.row.status=='1'">处理</el-button> 
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
            </el-col>
        </el-row>

        <!-- 新增修改查看告警-->
        <el-dialog
            :title="warnDialogTitle"
            width="40%"
            top="5vh"
            :visible.sync="warnDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="warnForm"
                :rules="warnRule"
                ref="warnForm"
                @keyup.enter.native="submitwarnForm()"
                label-width="110px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="告警ID">
                    <el-input v-model.trim="warnForm.id" :placeholder="lookStatus||editStatus?'':'告警ID'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="告警时间">
                    <el-input v-model.trim="warnForm.alarmTime" :placeholder="lookStatus||editStatus?'':'告警时间'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input v-model.trim="warnForm.serialNumber" :placeholder="lookStatus||editStatus?'':'设备序列号'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="设备名称">
                    <el-input v-model.trim="warnForm.deviceName" :placeholder="lookStatus||editStatus?'':'设备名称'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="设备型号">
                    <el-input v-model.trim="warnForm.deviceModel" :placeholder="lookStatus||editStatus?'':'设备型号'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="告警内容">
                    <el-input v-model.trim="warnForm.alarmContent" :placeholder="lookStatus||editStatus?'':'告警内容'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="告警等级">
                    <el-input v-model.trim="alarmLevel" :placeholder="lookStatus||editStatus?'':'告警等级'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="区域">
                    <el-input v-model.trim="warnForm.area" :placeholder="lookStatus||editStatus?'':'区域'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="组织架构">
                    <el-input v-model.trim="warnForm.orgName" :placeholder="lookStatus||editStatus?'':'区域'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="被通知人">
                    <el-input v-model.trim="warnForm.notifiedPersonName" :placeholder="lookStatus||editStatus?'':'被通知人'" :disabled="lookStatus||editStatus"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="warnForm.status" :placeholder="lookStatus||editStatus?'':'请选择状态：未处理、已处理、关闭'" class="roleSelect">
                        <el-option label="未处理" value="0" ></el-option>
                        <el-option label="已处理" value="1" ></el-option>
                        <el-option label="关闭" value="2" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理意见" prop="processingOpinions">
                    <el-input type="textarea" v-model.trim="warnForm.processingOpinions" :placeholder="lookStatus||editStatus?'':'处理意见'"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitwarnForm()" v-if="!lookStatus">{{'提交'}}</el-button>                    
                    <el-button :size="size" @click="warnDialog = false" v-if="warnBtnShow">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('warnForm')" v-if="!warnBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput"
import { myFunction } from "@/utils/datetime"
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
            warnForm:{},
            warnRule: {
                status:[
                   { required: true, message: '状态不能为空', trigger: 'change' } 
                ],
                processingOpinions: [
                    { required: true, message: '处理意见不能为空', trigger: 'blur' }
                ]
            },
            warnDialogTitle:'新建告警策略',
            warnDialog:false,
            warnBtnShow:-1
        }
    },    
    computed:{
        deptIDs(){
            return this.$store.state.menu.deptIds 
        },
        alarmLevel(){
            if(this.warnForm.alarmLevel == '0'){
                return '一般'
            }else if(this.warnForm.alarmLevel == '1'){
                return '警告'
            }else if(this.warnForm.alarmLevel == '2'){
                return '严重'
            }
        }
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
            return myFunction(val)
        },
        //获取树形菜单
        getTree: function() {
            this.$api.dept.getTree().then(res => {
                this.popupTreeData = res.content;
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
            this.$api.warn
                .getWarnDetail(this.pageRequest)
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
            this.warnBtnShow = true;
            this.warnDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.warnDialogTitle = "查看告警策略"
            this.warnForm = {
                id:row.id,
                alarmTime:row.alarmTime ,
                serialNumber:row.serialNumber,
                deviceName:row.deviceName ,
                deviceModel: row.deviceModel,
                alarmContent: row.alarmContent,
                alarmLevel:row.alarmLevel,
                area:row.area,
                orgName:row.orgName,
                notifiedPerson:row.notifiedPerson,
                notifiedPersonName:row.notifiedPersonName,
                status:row.status.toString(),
                processingOpinions:row.processingOpinions
            }
        },
        //编辑
        handleEdit(row){
            //debugger
            this.warnBtnShow = false
            this.warnDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.warnDialogTitle = "告警处理"
            this.warnForm = {
                id:row.id,
                alarmTime:row.alarmTime ,
                serialNumber:row.serialNumber,
                deviceName:row.deviceName ,
                deviceModel: row.deviceModel,
                alarmContent: row.alarmContent,
                alarmLevel:row.alarmLevel,
                alarmType:row.alarmType,
                area:row.area,
                orgId:row.orgId,
                orgName:row.orgName,
                notifiedPerson:row.notifiedPerson,
                notifiedPersonName:row.notifiedPersonName,
                status:row.status.toString(),
                processingOpinions:row.processingOpinions
            }
        },        
        //关闭警告
        delwarn(){            
            let self = this;
            if(self.selections == ""){
                this.$message({
                    message: '请选择告警',
                    type: 'error'
                }) 
                return
            }
            this.$confirm('请确认要关闭此告警吗？关闭后此告警将处于关闭状态，不再被提醒。', '关闭告警', {
				type: 'warning'
            }).then(() => {
                self.$api.warn
                    .delWarnDetail({ids:self.selections})
                    .then(res => { 
                        debugger
                        if(res.result == "success"){
                            self.warnDialog = false; 
                            self.findPage();
                        }else{
                            this.$message({
                                message: '关闭告警失败',
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
                    message: '已取消关闭告警'
                });          
            });
        },
        
        submitwarnForm(){
            let self = this;
            this.$refs['warnForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        if(!self.warnForm.id&&self.warnForm.id==""){
                            self.$api.warn
                            .addAlarm(self.warnForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.warnDialog = false;                                
                                    self.findPage();                                  
                                    self.warnForm = {
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
                            self.$api.warn
                            .updWarnDetail(self.warnForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.warnDialog = false;                                
                                    self.findPage();                                  
                                    self.$refs['warnForm'].clearValidate() 
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
            this.warnForm.processingOpinions ="";
            this.warnForm.status = '0';
            this.$refs['warnForm'].clearValidate() 
        }
    }
}
</script>

