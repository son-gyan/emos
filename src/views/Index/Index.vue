
<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 10px;
    color: #fff;
    &.device{        
        background: rgba(51, 204, 255, 1);
    }
    &.offline{        
        background: rgba(255, 153, 51, 1);
    }
    &.workOrder{        
        background: rgba(102, 153, 51, 1);
    }
    &.alarm{        
        background: rgba(0, 102, 255, 1);
    }
    h4{
        margin:0;
        text-align: left;
        font-weight: 500;
    }
    h2{
        padding: 10px 0 15px;
        font-weight: 500;
    }
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
    text-align: left;
  }

  .alarmTable .el-table td, .el-table th{
      text-align: center
  }
    .roleSelect{
        width: 100%
    }

    .inp{
        min-width:300px;
    }
</style>
<template>
    <div class="index">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="grid-content device">
                    <h4>设备总数</h4>
                    <h2>{{device}}台</h2>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content offline">
                    <h4>离线设备</h4>
                    <h2>{{offline}}台</h2>
                </div>
            </el-col>
            <!-- <el-col :span="6">
                <div class="grid-content workOrder">
                    <h4>待处理工单</h4>
                    <h2>{{workOrder}}条</h2>
                </div>
            </el-col> -->
            <el-col :span="8">
                <div class="grid-content alarm">
                    <h4>告警事件</h4>
                    <h2>{{alarm}}条</h2>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="distribute">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>设备分布情况</span>
                    </div>
                    <div class="text item">
                        <div id="deviceChart1" style="height:300px"></div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>设备注册情况</span>
                    </div>
                    <div class="text item">
                        <div id="deviceChart2" style="max-width:100%;height:300px"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row class="alarmTable">
            <el-col :span="24">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>设备告警数据列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click='jump'>查看全部</el-button>
                    </div>
                    <div class="text item">
                        <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                            <el-table-column
                                type="index"
                                label="序号"
                                width="80"
                                 align="center">
                            </el-table-column>
                            <el-table-column
                                prop="alarmTime"
                                label="时间"
                                width="180" align="center">
                                <template slot-scope = "scope">
                                    <span>
                                        {{scope.row.alarmTime.substr(0,10)}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="orgName"
                                label="地区"
                                width="180" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="deviceModel"
                                label="设备" align="center">
                            </el-table-column>
                            <el-table-column
                                prop="alarmType"
                                label="类型" align="center">
                            </el-table-column>
                            <el-table-column
                                label="状态" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status ==0">未处理</span>
                                    <span v-if="scope.row.status ==1">已处理</span>
                                    <span v-if="scope.row.status ==2">关闭</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button  @click="handleEdit(scope.row)" type="text" size="small"  :disabled="scope.row.status=='1'">处理</el-button> 
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 新增修改查看告警-->
        <el-dialog
            :title="warnDialogTitle"
            width="40%"
            :visible.sync="warnDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :model="warnForm"
                :rules="warnRule"
                ref="warnForm"
                @keyup.enter.native="submitwarnForm()"
                label-width="110px"
                size="small"
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

        <!-- 查看设备 -->
        <!-- <el-row class="deviceInfo">
            <el-col :span="24">                
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>设备信息数据列表</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click='jumpDeviceInfo'>查看全部</el-button>
                    </div>
                    <div class="text item">                        
                        <el-table
                            ref="multipleTable"
                            border
                            :data="deviceTableData.list"
                            style="width: 100%"
                            >
                            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
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
                                    <span >{{scope.row.alarmNum||0}}条</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="realName" label="运维人员" align="center"></el-table-column>
                            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="130"  align="center">
                                <template slot-scope="scope">
                                    <el-button  @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row> -->

        <!-- 新增修改设备查看-->
        <!-- <el-dialog
            :title="deviceInfoDialogTitle"
            width="48%"
            top="10vh"
            :visible.sync="deviceInfoDialog"
            :close-on-click-modal="false"
            >
            <el-form
                :inline="true"
                :model="deviceInfoForm"
                :rules="deviceInfoRule"
                ref="deviceInfoForm"
                @keyup.enter.native="submitdeviceInfoForm()"
                label-width="110px"
                :size="size"
                style="text-align:left;"
            >
                <el-form-item label="设备名称">
                    <el-input class="inp" v-model.trim="deviceInfoForm.deviceName" :placeholder="lookDeviceStatus?'':'设备名称'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="固件版本">
                    <el-input class="inp" v-model.trim="deviceInfoForm.firmwareVersion" :placeholder="lookDeviceStatus?'':'固件版本'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="设备型号">
                    <el-input class="inp" v-model.trim="deviceInfoForm.deviceModel" :placeholder="lookDeviceStatus?'':'设备型号'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="软件版本">
                    <el-input class="inp" v-model.trim="deviceInfoForm.softwareVersion" :placeholder="lookDeviceStatus?'':'软件版本'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                    <el-input class="inp" v-model.trim="deviceInfoForm.serialNumber" :placeholder="lookDeviceStatus?'':'设备序列号'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="网络状态">
                    <el-input class="inp" v-model.trim="deviceInfoForm.status" :placeholder="lookDeviceStatus?'':'网络状态'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="区域">
                    <el-input class="inp" v-model.trim="deviceInfoForm.area" :placeholder="lookDeviceStatus?'':'区域'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="告警信息">
                    <el-input class="inp" v-model.trim="deviceInfoForm.alarmNum" :placeholder="lookDeviceStatus?'':'告警信息'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="所属公司">
                    <el-input class="inp" v-model.trim="deviceInfoForm.company" :placeholder="lookDeviceStatus?'':'所属公司'" :disabled="lookDeviceStatus"></el-input>
                </el-form-item>
                <el-form-item label="组织架构">
                    <popup-tree-input
                        class="inp"
                        :data="popupTreeData"
                        :disabled="lookDeviceStatus"
                        :props="popupTreeProps"
                        :prop="deviceInfoForm.orgName==null?'':deviceInfoForm.orgName"
                        :nodeKey="''+deviceInfoForm.orgId"
                        :currentChangeHandle="handleTreeSelectChange"
                    ></popup-tree-input>
                </el-form-item>
                <el-form-item label="运维人员">
                    <el-select v-model="deviceInfoForm.realNameId" multiple :placeholder="lookDeviceStatus?'':'运维人员'" class="inp"  :disabled="lookDeviceStatus">
                        <el-option v-for="item in userItems" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input class="inp" type="textarea" v-model.trim="deviceInfoForm.remark" :placeholder="lookDeviceStatus?'':'备注'" :disabled="lookDeviceStatus"  resize="none" rows=5 maxlength="200"></el-input>
                </el-form-item>
                <el-form-item style="display:block;text-align:center;">
                    <el-button :size="size" type="primary" @click="submitDeviceInfoForm()" v-if="!lookDeviceStatus">{{'提交'}}</el-button>                    
                    <el-button :size="size" @click="deviceInfoDialog = false" v-if="deviceInfoBtnShow" style="min-width:100px;">{{'关闭'}}</el-button>
                    <el-button :size="size" @click="resetBtn('deviceInfoForm')" v-if="!deviceInfoBtnShow">{{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog> -->

    </div>
</template>
<script>
import echarts from "echarts"
import router from "@/router";
import PopupTreeInput from "@/components/PopupTreeInput"
export default {
    components:{
        PopupTreeInput
	},
    data(){
        return {
            device:0,
            offline:0,
            workOrder:0,
            alarm:0,
            tableData:[],
            charts: '',
            opinion:[],
            opinionData:[],
            chartArry1:[],
            chartArry2:[],
            lookStatus:false,
            editStatus:false,
            size:'samll',
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
            warnBtnShow:-1,
            lookDeviceStatus:false,
            editDeviceStatus:false,
            deviceInfoForm:{},
            deviceInfoDialogTitle:'新建告警策略',
            deviceInfoDialog:false,
            deviceInfoBtnShow:-1,
            userItems:"",
            deviceTableData:'',
            popupTreeData: [],
            popupTreeProps: {
				label: 'orgName',
				children: 'children'
            },
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
        }
    },
    computed:{
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
    created(){
        this.getWarnDetailData()
        this.getDeviceInfo()
    },
    mounted(){        
        let params = {
            pageNo:1,
            pageSize:10
        }
        /* 初始化首页数据 */
        this.$api.index.getIndex(params).then(res => {
            if(!res){
                return
            }
            var data = res.content 
            this.device = data.devTotal||0
            this.offline = data.devOfflineNum||0
            this.alarm = data.alarmNum||0
            this.opinionData = data.devInfo.map((item) => {
                return { value: item.num, name: item.orgName }
            })
            this.opinion = data.devInfo.map((item) => {
                return item.orgName
            })
            this.chartArry1 = data.regList.map((item) => {
                return item.ym
            })
            this.chartArry2 = data.regList.map((item) => {
                return item.num
            })
            this.$nextTick(function() {
                this.drawPie('deviceChart1')
                this.drawPie2('deviceChart2')
            })
        }).catch((res) => {
            this.$message({
                message: res.message,
                type: 'error'
            })
        });
    },
    methods:{ 
        /* 获取查看告警列表 */       
        getWarnDetailData(){
            let params = {
                pageNo:1,
                pageSize:10
            }
            this.$api.warn
                .getWarnDetail(params).then(res => {
                if(!res){
                    return
                }
                this.tableData = res.content.list;
            })
        },
        /* 跳转告警 */
        jump(){
            this.$router.push('/warn/warnDetail')
        },
        /* 跳转查看设备 */
        jumpDeviceInfo(){
            this.$router.push('/device/deviceInfo')
        },
        /* 饼状图 */
        drawPie:function(id){
            // 基于准备好的dom，初始化echarts实例
            this.charts = echarts.init(document.getElementById(id));
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c}台 ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    top: 'top',
                    data:this.opinion
                },
                series: [
                    {
                        name:'',
                        type:'pie',
                        radius: ['40%', '55%'],
                        label: {
                            normal: {
                                formatter: ' {b|{b}：}{c}台 ',
                                backgroundColor: '#eee',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    b: {
                                        fontSize: 14,
                                        lineHeight: 33
                                    }
                                }
                            }
                        },
                        data:this.opinionData
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            this.charts.setOption(option);
        },
        /* 柱状图 */
        drawPie2:function(id){
            // 基于准备好的dom，初始化echarts实例
            this.charts = echarts.init(document.getElementById(id));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: ''
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data:['注册数量']
                },
                grid: {
                    left: '3%',
                    right: '40px',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.chartArry1
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'注册数量',
                        type:'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {normal: {}},
                        data:this.chartArry2
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            this.charts.setOption(option);
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
        /* 告警处理提交 */
        submitwarnForm(){
            let self = this;
            this.$refs['warnForm'].validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.editLoading = true
                        //请求
                        if(self.warnForm.id&&self.warnForm.id!=""){
                            self.$api.warn
                            .updWarnDetail(self.warnForm)
                            .then(res => {
                                if(res.result == "success"){
                                    self.warnDialog = false;                                
                                    self.getWarnDetailData();                                  
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
        getDeviceInfo(){
            let params = {
                pageNo:1,
                pageSize:10
            }
            this.$api.device
                .findPage(params)
                .then(res => {
                    this.deviceTableData = res.content;
                })
        },
        //查看
        handleLook(row){
            this.deviceInfoBtnShow = true;
            this.deviceInfoDialog = true;
            this.lookDeviceStatus = true;
            this.editDeviceStatus = false;
            this.deviceInfoDialogTitle = "查看告警策略"
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
    }
}
</script>

