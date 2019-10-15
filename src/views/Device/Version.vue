<style lang="scss" scoped>
.version{
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
.input-with-select{
    min-width:400px; 
}
</style>

<template>
    <div class="version">
        <el-row>
            <el-col :span="24" class="headTool" style="text-align:left;margin-bottom:50px">
                <div style="margin: 20px 0;display:inline-block;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >
                            <el-button type="primary" @click="addversion">
                                <i class="fa fa-plus"></i>
                                <span>上传新升级包</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件">
                                <el-option label="设备型号" value="name"></el-option>
                                <el-option label="版本名称" value="version"></el-option>
                                <el-option label="升级包名称" value="filename"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按设备型号、版本名称，升级包名称搜索" v-model="searchValue" class="input-with-select" 
                                @input="e => searchValue = validForbid(e)"
                                @keyup.enter.native="searchSubmit">
                                <el-button slot="append" icon="el-icon-search" @click="searchSubmit"></el-button>
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
                            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                            <el-table-column prop="name" label="对应设备型号" min-width="150" align="center"></el-table-column>
                            <el-table-column label="升级类型" width="100" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.type=='SOFTWARE'?'固件':''}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column prop="version" label="版本号" width="130" align="center"></el-table-column>
                            <el-table-column prop="targetName" label="升级包名称" min-width="130" align="center">
                                <!-- <template slot-scope="scope">
                                    <span>{{formatDate(scope.row.regTime)}}</span>
                                </template>  -->
                            </el-table-column>
                            <el-table-column prop="description" label="备注" min-width="130" align="center"></el-table-column>
                            <el-table-column prop="ownerName" label="上传人" min-width="100" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="180" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="delVersion(scope.row)" type="text" size="small">删除</el-button>
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
            :title="versionDialogTitle"
            width="40%"
            @close="handleClose"
            :visible.sync="versionDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="versionForm"
                :rules="versionRule"
                ref="versionForm"
                @keyup.enter.native="submitVersionForm()"
                label-width="110px"
                :size="size"
                style="text-align:left;"
            >        
                <el-form-item label="对应设备型号" prop="name">
                    <el-select v-model="versionForm.name" placeholder="选择设备型号" class="roleSelect">
                        <el-option :label="item.name" :value="item.name" v-for='(item,index) in devType' :key='index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="升级类型" prop="type">
                    <el-select v-model="versionForm.type" placeholder="点击选择固件还是软件" class="roleSelect">
                        <el-option :label="item.label" :value="item.value" v-for='(item,index) in promotionType' :key='index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="DG内核型号" prop="core">
                    <el-select v-model="versionForm.core" placeholder="点击选择固件还是软件" class="roleSelect">
                        <el-option :label="item.unitTypeName" :value="item.unitTypeId" v-for='(item,index) in coreList' :key='index'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本号" prop="version">
                    <el-input v-model.trim="versionForm.version" placeholder="输入版本号" maxlength=20  
                        oninput = "value=value.replace(/[^\d.]/g,'')" 
                        @blur="inpBlur"></el-input>
                </el-form-item>
                <el-form-item label="升级包名称" prop="file" >
                    <el-upload
                        class="upload"
                        ref="upload"
                        :limit="1"
                        action=""
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :before-upload="beforeAvatarUpload"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">点击上传本地升级包</el-button>
                        <div slot="tip" class="el-upload__tip"></div>
                    </el-upload>   
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model.trim="versionForm.desc" placeholder="备注"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :size="size" type="primary" @click="submitVersionForm()">{{'确定上传'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import mock from "@/mock/index";
import { format } from "@/utils/datetime"
export default {
    data(){
        return {
            size: 'small',
            searchKey:'',
            searchValue:'',
            tableData:{
                list:[],
                total:0
            },
            selections: [], // 列表选中列
            allSelect: false,
            // 分页信息
            pageRequest: {
                pageNo: 1,
                pageSize: 10
            },
            devType:[],
            coreList:[],
            versionForm:{
                name:'',
                type:'',
                version:'',
                desc:'',
                core:'',
                file:[]
            },
            versionRule: {
                type:[
                   { required: true, message: '升级类型不能为空', trigger: 'change' } 
                ],
                name: [
                    { required: true, message: '对应设备型号不能为空',trigger: 'change' }
                ],
                core: [
                    { required: true, message: 'DG内核型号不能为空',trigger: 'change' }
                ],
                version: [
                    { required: true, message: '版本名称不能为空',trigger: 'blur' }
                ],
                file: [
                    { required: true, message: '升级包名称不能为空',trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '备注不能为空',trigger: 'blur' }
                ]
            },
            versionDialogTitle:'新建用户',
            versionDialog:false,
            versionBtnShow:-1,
            promotionType:[{
                label:'固件',
                value:'SOFTWARE'
            }],
            fileList:[],
            search:{},
            fileStatus:false,
            versionStatus:true

        }
    },
    created() {        
        this.refreshPageRequest(1);
        this.getDevType();
        this.getCoreList();
    },
    methods:{
        //列表序号
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        //时间转换
        formatDate(val){
            return format(val)
        },
        //获取设备型号
        getDevType(){
            this.$api.device.getDevModel().then(res => {                  
                this.devType = res.content;
            }).catch((res) => {
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            });
        },
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
        //新建版本
        addversion(){
            this.versionBtnShow = false
            this.versionDialog = true;
            this.versionDialogTitle = "上传新升级包" 
            if(this.$refs['versionForm']){                
                this.$refs['versionForm'].clearValidate()
            }
        },
        
        //搜索
        searchSubmit(){
            this.pageRequest.search = this.searchVal
            this.pageRequest.pageNo = 1;
            this.findPage()

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
        //页码改变刷新列表
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
                .queryDevFileList(this.pageRequest)
                .then(res => {
                    if(res.content !=null){                        
                        this.tableData = res.content;
                    }
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
        //删除上传文件
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.versionForm.file = '';
            debugger
        },
        //显示上传文件
        handlePreview(file) {
            debugger
            console.log(file);
            this.versionForm.file = file;
        },
        //上传前
        beforeAvatarUpload(file){
            //debugger
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const isLt2M = file.size / 1024 / 1024 < 50
            if(!isLt2M) {
                this.fileStatus = true;
                /* this.$message({
                    message: '上传文件大小不能超过 50MB!',
                    type: 'warning'
                }); */
            }
            return isLt2M
        },
        //文件上传改变
        handleChange(file, fileList) {
            //debugger
            this.versionForm.file = file.raw;
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const isLt2M = file.size / 1024 / 1024 < 50
            if(!isLt2M) {
                this.fileStatus = true;
                /* this.$message({
                    message: '上传文件大小不能超过 50MB!',
                    type: 'warning'
                }); */
            }else{
                this.fileStatus = false;
            }
            return isLt2M
        },
        //版本号检查
        inpBlur(e){
            console.log(e.target.value);
            this.$api.device.checkVersion({
                version:'V'+e.target.value
            }).then(res => { 
                if(res.code == 11000){
                    this.versionStatus = false;
                    this.$message({
                        message: '版本号重复！',
                        type: 'error'
                    });                
                    return
                }
            })
        },
        //上传提交
        submitVersionForm(){
            let self = this; 
            if(!this.versionStatus){
                this.$message({
                    message: '版本号重复！',
                    type: 'error'
                });                
                return
            }
            if(this.fileStatus){
                this.$message({
                    message: '上传文件大小不能超过 50MB!',
                    type: 'warning'
                });                
                return
            }           
            this.$refs['versionForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: '文件上传中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.3)'
                        });
                        //请求
                        let version = self.versionForm;
                        let formData = new FormData();
                        formData.append('uploadFile', this.versionForm.file)
                        formData.append('name', this.versionForm.name)
                        formData.append('core', this.versionForm.core)
                        formData.append('type', this.versionForm.type)
                        formData.append('version', 'V'+this.versionForm.version)
                        formData.append('desc', this.versionForm.desc||"")
                        self.$api.device
                            .uploadSubmit(formData)
                            .then(res => {
                                if(res.result == "success"){
                                    loading.close();
                                    self.versionDialog = false; 
                                    self.$refs.upload.clearFiles()                               
                                    self.findPage();        
                                }else{
                                    loading.close();
                                    this.$message({
                                        message: '新增失败',
                                        type: 'error'
                                    })  
                                }
                            })
                            .catch((res) => {
                                loading.close();
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                })
                            });
                    }).catch(() => {
                        //this.versionDialog = false
                        this.$message({
                            type: 'info',
                            message: '已取消提交'
                        });          
                    });
				}
            })
        },
        //删除用户
        delVersion(row){
            this.$confirm('请确认要删除此“版本”吗？如该版本已绑定升级策略，请先解除绑定再执行删除。', '删除', {
				type: 'warning'
            }).then(() => {
                this.$api.device
                .delFiles({fids:row.id})
                .then(res => {
                    debugger
                    if(res.messages[0] == '11001'){
                        this.$message({
                            message: '删除失败，该升级包已绑定升级策略。',
                            type: 'error'
                        }) 
                        return; 
                    }
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
        handleClose(){ 
            this.versionForm = {
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
            this.$refs.upload.clearFiles();        
            this.$refs['versionForm'].clearValidate()
        }
    }
}
</script>

