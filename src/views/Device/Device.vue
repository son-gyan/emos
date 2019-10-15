<style lang="scss" scoped>
.device{
    background-color: #fff;
    padding: 10px;
    .deviceSelect{
        width: 100%
    }
    .reorder{
        float:right;
        position: relative;
    }
    .red{
        color:red;
    }
}
</style>
<style lang="scss">
.device{
    .warnInfo{
        .el-form-item__label,.el-input.is-disabled .el-input__inner{            
            color:red;
        }
    }
    
}
</style>

<template>
    <div class="device">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div class="buttons" style="display:inline-block;">
                    <el-button type="primary" @click="adddevice">
                        <i class="fa fa-plus"></i>
                        <span>注册新设备</span>
                    </el-button>                  
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
                            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                            <el-table-column prop="deviceName" label="设备名称" width="180" align="center"></el-table-column>
                            <el-table-column prop="serialNumber" label="序列号" width="150" align="center"></el-table-column>
                            <el-table-column prop="extrnalIP" label="外网IP地址" width="130" align="center"></el-table-column>
                            <el-table-column prop="intranetIp" label="内网IP地址" width="130" align="center"></el-table-column>
                            <el-table-column prop="deviceModel" label="型号" align="center"></el-table-column>
                            <el-table-column prop="regTime" label="注册时间" align="center">
                                <template slot-scope="scope">
                                    <span>{{formatDate(scope.row.regTime)}}</span>
                                </template>    
                            </el-table-column>
                            <el-table-column prop="area" label="区域" align="center"></el-table-column>
                            <el-table-column prop="company" label="所属公司" align="center"></el-table-column>
                            <el-table-column prop="orgName" label="组织架构" align="center"></el-table-column>
                            <el-table-column label="状态" align="center">
                                <template slot-scope="scope">
                                    <span :class="scope.row.status != 1?'red':''">{{scope.row.status == 1?'在线':'离线'}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                                    <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页栏-->
                        <div class="toolbar" style="padding:10px;">
                        <!-- <el-button size="mini" type="danger" @click="toggleSelect(tableData.list)" style="float:left;">全选</el-button> -->
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

        <!-- 新增修改-->
        <el-dialog
            :title="deviceDialogTitle"
            width="40%"
            @close="handleClose"
            :visible.sync="deviceDialog"
            :close-on-click-modal="false"
            >
            <el-form :model="deviceForm" :rules="deviceRule" ref="deviceForm" 
                label-width="120px" 
                :size="size"
                border
                style="text-align:left;">                
                <el-form-item label="设备名称" prop="deviceName">
                    <el-input v-model.trim="deviceForm.deviceName" placeholder="设备名称" :disabled="lookStatus" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="序列号" prop="serialNumber">
                    <el-input v-model.trim="deviceForm.serialNumber" placeholder="序列号" :disabled="lookStatus" maxlength=20></el-input>
                </el-form-item>
                <el-form-item label="区域" prop="area">
                    <el-cascader
                        class="deviceSelect"
                        :disabled="lookStatus"
                        v-model="deviceForm.area"
                        :options="areaList"
                        :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
                        @change="handleAreaChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="所属组织架构" prop="fateherId">
                    <popup-tree-input
                        :data="popupTreeData"
                        :props="popupTreeProps"
                        :disabled="lookStatus"
                        :prop="deviceForm.parentName==null?'':deviceForm.parentName"
                        :nodeKey="''+deviceForm.fateherId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
                <!-- <el-form-item label="备注">
                    <el-input type="textarea" v-model="deviceForm.remark" placeholder="备注" :disabled="lookStatus"></el-input>
                </el-form-item> -->
                <el-form-item label="警示" class="warnInfo" v-if="lookStatus">
                    <el-input v-model.trim="warnInfo" placeholder="警示" :disabled="lookStatus" class="red" maxlength=50></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitdeviceForm('deviceForm')" >{{'确认'}}</el-button>
                    <el-button :size="size" @click="deviceDialog = false" v-if="lookStatus">{{'取消'}}</el-button>
                    <el-button :size="size" @click="resetBtn('deviceForm')" v-if="!lookStatus" >{{'重置'}}</el-button>
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
        return {
            size: 'small',
            searchVal:'',
            tableData:[],
            selections: [], // 列表选中列
            allSelect: false,
            filters: {
                name: ""
            },
            // 分页信息
            pageRequest: {
                pageNo: 1,
                pageSize: 10
            },
            warnInfo:"确认删除此设备？系统中此设备的数据将清除",
            lookStatus:false,
            editStatus:false,
            deviceDialogTitle:'注册新设备',
            deviceDialog:false,
            power: [],
            deviceForm: {
                id: '',
                alarmNum: '',
                area: "",
                company: "",
                deviceModel: "",
                deviceName: "",
                extrnalIP: "",
                firmwareVersion: "",
                intranetIp: "",
                orgId: '',
                orgName: "",
                serialNumber: "",
                softwareVersion: "",
                status: '' 
            },
            deviceRule: {
                deviceName: [
                    { required: true, message: '设备名称不能为空', trigger: 'blur' }
                ],
                serialNumber: [
                    { required: true, message: '序列号不能为空', trigger: 'blur'}
                ],
                area: [
                    { required: true, message: '区域不能为空', trigger: 'change'}
                ],
                fateherId: [
                    { required: true, message: '所属组织架构不能为空', trigger: 'change'}
                ]
            },
            popupTreeData: [],
            popupTreeProps: {
				label: 'orgName',
				children: 'children'
            },
            areaList:[]
        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getTree();
        this.findArea()
    },
    methods:{
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        formatDate(val){
            return format(val)
        },
        //区域查询
        findArea(){
            this.$api.device.findArea().then(res => {
                this.areaList = res.content;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
        //区域选择
        handleAreaChange(value){
            //console.log(value);
            this.deviceForm.provId = value[0];
            this.deviceForm.cityId = value[1];
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
        //树节点选择
        handleTreeSelectChange(data, node){
            this.deviceForm.isShop = data.isShop
            this.deviceForm.fateherId = data.id
            this.deviceForm.orgId = data.id
            this.deviceForm.parentName = data.orgName
            this.deviceForm.orgLevel = data.id
            if(data.firstLevelId != 0){                
                this.deviceForm.firstLevelId = data.firstLevelId
            }else{
                this.deviceForm.firstLevelId = data.id
            }
        },
        //新建设备
        adddevice(){
            this.deviceDialog = true;
            this.lookStatus = false;
            this.editStatus = false;
            this.deviceDialogTitle = "注册新设备"
            this.deviceForm = {                
                id: '',
                alarmNum: '',
                area: "",
                company: "",
                deviceModel: "",
                deviceName: "",
                extrnalIP: "",
                firmwareVersion: "",
                intranetIp: "",
                fateherId:"",
                orgId: '',
                orgName: "",
                provId:'',
                cityId:'',
                serialNumber: "",
                softwareVersion: "",
                remark:'',
                status: ''              
            }
            if(this.$refs['deviceForm']){                
                this.$refs['deviceForm'].clearValidate()
            }
        },
        //搜索
        search(){
            //console.log(this.searchVal);
            this.$message({
                type: 'success',
                message: this.searchVal
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
            //debugger
            this.$api.device
                .findPage(this.pageRequest)
                .then(res => {
                    this.tableData = res.content;
                })
                .then(data != null ? data.callback : "");
        },
        //table上的全选
        handleSelectionChange(val) {
            this.selections = val;
            //console.log(this.selections);
        },
        //table下面的全选
        toggleSelect(rows) {
            //console.log(this.selections);
        },
        //删除
        handleDel(row){
            //console.log(row);
            this.deviceDialog = true;
            this.lookStatus = true;
            this.editStatus = false;
            this.deviceDialogTitle = "删除设备"
            this.deviceForm = {
                id:row.id,
                alarmNum: row.alarmNum,
                area: row.area,
                company: row.company,
                deviceModel: row.deviceModel,
                deviceName: row.deviceName,
                extrnalIP: row.extrnalIP,
                firmwareVersion: row.firmwareVersion,
                intranetIp: row.intranetIp,
                fateherId:row.orgId,
                orgId: row.orgId,
                parentName: row.orgName,
                orgName: row.orgName,
                serialNumber: row.serialNumber,
                softwareVersion: row.softwareVersion,
                status: row.status 
            }
            this.$api.device
                .queryDev({id:row.id})
                .then(res => {
                    if(res.result == "success"){
                        this.deviceForm.fateherId = res.content.orgId
                        this.deviceForm.area = [res.content.provId,res.content.cityId];
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
        //编辑
        handleEdit(row){
            this.deviceDialog = true;
            this.lookStatus = false;
            this.editStatus = true;
            this.deviceDialogTitle = "编辑设备"
            this.deviceForm = {
                id:row.id,
                alarmNum: row.alarmNum,
                area: row.area,
                company: row.company,
                deviceModel: row.deviceModel,
                deviceName: row.deviceName,
                extrnalIP: row.extrnalIP,
                firmwareVersion: row.firmwareVersion,
                intranetIp: row.intranetIp,
                fateherId:row.orgId,
                orgId: row.orgId,
                orgName: row.orgName,
                parentName: row.orgName,
                serialNumber: row.serialNumber,
                softwareVersion: row.softwareVersion,
                status: row.status 
            }
            this.$api.device
                .queryDev({id:row.id})
                .then(res => {
                    if(res.result == "success"){
                        this.deviceForm.fateherId = res.content.orgId
                        this.deviceForm.area = [res.content.provId,res.content.cityId];
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
        submitdeviceForm(deviceForm){
            let self = this;
            if(self.deviceForm.isShop==false&&!self.lookStatus){
                this.$message({
                    message: '设备只能在门店里!',
                    type: 'error'
                }) 
                return
            }
            //请求
            if(!self.deviceForm.id&&self.deviceForm.id==""){
                self.$api.device
                .existSerial({serial:self.deviceForm.serialNumber})
                .then(res => {
                    if(res.content){
                        this.$message({
                            message: '设备序列号重复!',
                            type: 'error'
                        }) 
                        return
                    }else{
                        this.$refs['deviceForm'].validate((valid) => {
                            if (valid) {
                                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                    this.editLoading = true
                                    self.$api.device
                                    .addDev(self.deviceForm)
                                    .then(res => {
                                        if(res.result == "success"){
                                            self.deviceDialog = false;                                
                                            self.findPage();                                  
                                            self.$refs['deviceForm'].resetFields()
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

                                }).catch(() => {
                                    //this.deviceDialog = false
                                    this.$message({
                                        type: 'info',
                                        message: '已取消提交'
                                    });          
                                });
                            }
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
                if(!self.lookStatus){
                    this.$refs['deviceForm'].validate((valid) => {
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.editLoading = true
                                    self.$api.device
                                    .updDev(self.deviceForm)
                                    .then(res => {
                                        if(res.result == "success"){
                                            self.deviceDialog = false;                                
                                            self.findPage();                                  
                                            self.$refs['deviceForm'].resetFields()
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
                            }).catch(() => {
                                //this.deviceDialog = false
                                this.$message({
                                    type: 'info',
                                    message: '已取消提交'
                                });          
                            });
                        }
                    })  
                }else{
                    self.$api.device
                    .delDev({uid:self.deviceForm.id})
                    .then(res => {                                    
                        debugger
                        if(res.result == "success"){
                            self.deviceDialog = false; 
                            self.findPage();                                  
                            self.$refs['deviceForm'].resetFields()
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
                }
                
            }
            
        },
        resetBtn(formName){
            this.deviceForm = {                
                id: '',
                alarmNum: '',
                area: "",
                company: "",
                deviceModel: "",
                deviceName: "",
                extrnalIP: "",
                firmwareVersion: "",
                intranetIp: "",
                fateherId:"",
                orgId: '',
                orgName: "",
                provId:'',
                cityId:'',
                serialNumber: "",
                softwareVersion: "",
                remark:'',
                status: ''              
            }
            this.$refs['deviceForm'].clearValidate()
        },
        handleClose(){
            this.deviceForm = {                
                id: '',
                alarmNum: '',
                area: "",
                company: "",
                deviceModel: "",
                deviceName: "",
                extrnalIP: "",
                firmwareVersion: "",
                intranetIp: "",
                fateherId:"",
                orgId: '',
                orgName: "",
                provId:'',
                cityId:'',
                serialNumber: "",
                softwareVersion: "",
                remark:'',
                status: ''              
            }
            this.$refs['deviceForm'].clearValidate()
        }
    }
}
</script>
