<style lang="scss" scoped>
.device {
  background-color: #fff;
  padding: 10px;
  .deviceSelect {
    width: 100%;
  }
  .reorder {
    float: right;
    position: relative;
  }
  .exportDialog{
        position: absolute;
        bottom: -20px;
        right: 20px;
        background-color: #fff;
        width: 140px;
        z-index: 9999;
        padding-bottom: 10px;
        border:1px solid rgba(180, 190, 190, 0.8);
        .exportList{
            padding: 0 10px;
            list-style-type: none;
            text-align: left;
        }
    }
  .red {
    color: red !important;
  }
  .upgradeSelect {
    width: 100%;
  }
}
.input-with-select{
    min-width:400px; 
}
</style>
<style lang="scss">
.device {
  .warnInfo {
    .el-form-item__label,
    .el-input.is-disabled .el-input__inner {
      color: red;
    }
    .el-textarea__inner {
      color: red;
    }
  }
  .el-input--suffix .el-input__inner {
    padding-right: 15px;
  }
}
</style>

<template>
  <div class="device">
    <el-row>
      <el-col :span="24" class="headTool" style="text-align:left;">
        <!-- <div class="buttons" style="display:inline-block;">
          <el-button type="primary">
            <span>更多操作</span>
          </el-button>
        </div> -->
        <div style="margin: 20px 0;display:inline-block;">
          <!-- <el-input
            placeholder="按序列号或设备名称等条件进行搜索"
            v-model="searchVal"
            class="input-with-select"
            @input="e => searchVal = validForbid(e)"
            @keyup.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input> -->
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
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="reorder">
            <el-button class="reorderBtn" icon="fa fa-reorder fa-lg" @click.stop="reorder" type="text"> 
            </el-button>
            <div class="exportDialog" v-if="exportDialog">
                <ul class="exportList">
                    <li>
                        <el-checkbox label="设备名称" v-model="exportSelection.deviceName"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="固件版本" v-model="exportSelection.firmwareVersion"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="软件版本"  v-model="exportSelection.softwareVersion"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="序列号"  v-model="exportSelection.serialNumber"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="外网IP地址"  v-model="exportSelection.extrnalIP"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="内网IP地址"  v-model="exportSelection.intranetIp"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="型号"  v-model="exportSelection.deviceModel"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="注册时间"  v-model="exportSelection.regTime"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="区域"  v-model="exportSelection.area"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="所属公司"  v-model="exportSelection.company"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="组织架构"  v-model="exportSelection.orgName"></el-checkbox>
                    </li>
                    <li>
                        <el-checkbox label="状态"  v-model="exportSelection.status"></el-checkbox>
                    </li>
                </ul>
            </div>
        </div>
    </el-col>
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
              <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
                :index="indexMethod"
              ></el-table-column>
              <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
              <el-table-column prop="deviceName" label="设备名称" width="180" align="center" v-if="exportSelection.deviceName"></el-table-column>
              <el-table-column prop="firmwareVersion" label="固件版本" width="180" align="center" v-if="exportSelection.firmwareVersion"></el-table-column>
              <el-table-column prop="softwareVersion" label="软件版本" width="180" align="center" v-if="exportSelection.softwareVersion"></el-table-column>
              <!-- <el-table-column prop="softwareVersion" label="截止保修期" width="180" align="center"></el-table-column> -->
              <el-table-column prop="serialNumber" label="序列号" width="150" align="center" v-if="exportSelection.serialNumber"></el-table-column>
              <el-table-column prop="extrnalIP" label="外网IP地址" width="130" align="center" v-if="exportSelection.extrnalIP"></el-table-column>
              <el-table-column prop="intranetIp" label="内网IP地址" width="130" align="center" v-if="exportSelection.intranetIp"></el-table-column>
              <el-table-column prop="deviceModel" label="型号" width="130" align="center" v-if="exportSelection.deviceModel"></el-table-column>
              <el-table-column prop="regTime" label="注册时间" width="130" align="center" v-if="exportSelection.regTime">
                <template slot-scope="scope">
                  <span>{{formatDate(scope.row.regTime)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="area" label="区域" width="130" align="center" v-if="exportSelection.area"></el-table-column>
              <el-table-column prop="company" label="所属公司" width="130" align="center" v-if="exportSelection.company"></el-table-column>
              <el-table-column prop="orgName" label="组织架构" width="130" align="center" v-if="exportSelection.orgName"></el-table-column>
              <el-table-column label="状态" align="center" v-if="exportSelection.status">
                <template slot-scope="scope">
                  <span :class="scope.row.status != 1?'red':''">{{scope.row.status == 1?'在线':'离线'}}</span>
                </template>
              </el-table-column>
              <el-table-column  label="操作" min-width="280" align="center">
                <template slot-scope="scope">
                  <el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
                  <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button @click="handleUpgrade(scope.row)" type="text" size="small">升级</el-button>
                  <el-button @click="handleRestart(scope.row)" type="text" size="small">重启</el-button>
                  <el-button @click="handleSSH(scope.row)" type="text" size="small">SSH</el-button>
                  <el-button @click="handleWeb(scope.row)" type="text" size="small">Web</el-button>
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
      width="50%"
      @close="handleClose"
      :visible.sync="deviceDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="deviceForm"
        :rules="deviceRule"
        ref="deviceForm"
        label-width="120px"
        :size="size"
        border
        style="text-align:left;"
      >
        <el-row type="flex" class="row-bg">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input
                v-model.trim="deviceForm.deviceName"
                placeholder="设备名称"
                :disabled="lookStatus"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备型号">
              <el-input v-model.trim="deviceForm.deviceModel" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="设备序列号">
              <el-input v-model.trim="deviceForm.serialNumber" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-cascader
                class="deviceSelect"
                :disabled="lookStatus"
                v-model="deviceForm.area"
                :options="areaList"
                :props="{ expandTrigger: 'hover',value:'id',label:'name' }"
                @change="handleAreaChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="组织架构">
              <popup-tree-input
                :data="popupTreeData"
                :props="popupTreeProps"
                :disabled="lookStatus"
                :prop="deviceForm.parentName==null?'':deviceForm.parentName"
                :nodeKey="''+deviceForm.fateherId"
                :currentChangeHandle="handleTreeSelectChange"
              ></popup-tree-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                type="textarea"
                v-model="deviceForm.remark"
                :placeholder="lookStatus?'':'备注信息'"
                :disabled="lookStatus"
                style="width:100%;"
                resize="none"
                rows="5"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固件版本">
              <el-input v-model.trim="deviceForm.firmwareVersion" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="软件版本">
              <el-input v-model.trim="deviceForm.softwareVersion" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="外网IP">
              <el-input v-model.trim="deviceForm.extrnalIP" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="内网IP">
              <el-input v-model.trim="deviceForm.intranetIp" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="运维人员">
              <el-input v-model.trim="deviceForm.realName" disabled maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="设备日志">
              <el-input
                readonly
                @click.native="$router.push({path:'/log/devicelog',query:{serialNumber:deviceForm.serialNumber}})"
                placeholder="点击查看"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备策略">
              <el-input
                readonly
                @click.native="$router.push({path:'/device/upgrade',query:{id:deviceForm.id}})"
                placeholder="点击查看"
                style="text-align: center;"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="警示" class="warnInfo" v-if="lookStatus">
                        <el-input v-model.trim="warnInfo" placeholder="警示" :disabled="lookStatus" class="red" maxlength=50></el-input>
            </el-form-item>-->
          </el-col>
        </el-row>
        <el-form-item style="width:100%;text-align:center">
          <el-button
            :size="size"
            type="primary"
            @click="submitdeviceForm('deviceForm')"
            v-if="!lookStatus"
          >{{'确认'}}</el-button>
          <el-button :size="size" @click="deviceDialog = false" v-if="lookStatus">{{'取消'}}</el-button>
          <el-button :size="size" @click="resetBtn('deviceForm')" v-if="!lookStatus">{{'重置'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 升级弹窗 -->
    <el-dialog
      title="升级设备"
      width="50%"
      @close="upgradeDialogClose"
      :visible.sync="upgradeDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="upgradeForm"
        :rules="upgradeRule"
        ref="upgradeForm"
        label-width="120px"
        :size="size"
        border
        style="text-align:left;"
      >
        <el-form-item label="升级固件" prop='fileVersion'>
          <el-select
            v-model="upgradeForm.fileVersion"
            :placeholder="lookStatus?'':'请选择固件版本'"
            class="upgradeSelect"
            :disabled="lookStatus"
          >
            <el-option
              v-for="item in select.softVersion"
              :key="item.id"
              :label="item.name+' - '+item.version"
              :value="item.version"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="警示" class="warnInfo">
          <el-input
            type="textarea"
            v-model.trim="warnInfo"
            readonly
            class="red"
            color="red"
            resize="none"
            rows="5"
            maxlength="200"
          ></el-input>
        </el-form-item>

        <el-form-item style="width:100%;text-align:center">
          <el-button :size="size" type="primary" @click="submitUpgrade('upgradeForm')">{{'确认'}}</el-button>
          <el-button :size="size" @click="resetUpgrade('upgradeForm')">{{'重置'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 重启弹窗 -->
    <el-dialog
      title="重启设备"
      width="50%"
      @close="restartDialogClose"
      :visible.sync="restartDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="restartForm"
        ref="restartForm"
        label-width="120px"
        :size="size"
        border
        style="text-align:left;"
      >
        <el-form-item label="警示" class="warnInfo">
          <el-input
            type="textarea"
            v-model.trim="restartWarnInfo"
            readonly
            class="red"
            color="red"
            resize="none"
            rows="5"
            maxlength="200"
          ></el-input>
        </el-form-item>

        <el-form-item style="width:100%;text-align:center">
          <el-button :size="size" type="primary" @click="submitRestart('restartForm')">{{'确认'}}</el-button>
          <el-button :size="size" @click="restartDialogClose">{{'取消'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 远程弹窗 -->
    <el-dialog
      title="远程设备"
      width="50%"
      @close="remoteDialogClose"
      :visible.sync="remoteDialog"
      :close-on-click-modal="false"
    >
      <iframe id="iframe" :src="this.remoteForm.sshUrl" frameborder="0" width="100%" height="500px"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import mock from "@/mock/index";
import PopupTreeInput from "@/components/PopupTreeInput";
import { toTreeData } from "@/utils/tree";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput
  },
  data() {
    return {
      size: "small",
      searchKey:'',
      searchValue: "",
      tableData: [],
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
      warnInfo:"注意，点击确定后将会分批开始升级，请确保升级时间不影响用户正常业务工作，稍后可以在日志中查看升级情况。",
      lookStatus: false,
      editStatus: false,
      deviceDialogTitle: "注册新设备",
      deviceDialog: false,
      power: [],
      exportDialog:false,
      exportSelection:{
        deviceName:true,
        firmwareVersion:true,
        softwareVersion:true,        
        serialNumber:true,
        alarmNum: true,
        area: true,
        company:true,
        deviceModel:true,
        regTime:true,
        extrnalIP:true,
        intranetIp:true,
        orgId:true,
        orgName:true,
        status:true
      },
      deviceForm: {
        id: "",
        alarmNum: "",
        area: "",
        company: "",
        deviceModel: "",
        deviceName: "",
        extrnalIP: "",
        firmwareVersion: "",
        intranetIp: "",
        orgId: "",
        orgName: "",
        serialNumber: "",
        softwareVersion: "",
        status: ""
      },
      deviceRule: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        serialNumber: [
          { required: true, message: "序列号不能为空", trigger: "blur" }
        ],
        area: [{ required: true, message: "区域不能为空", trigger: "change" }],
        fateherId: [
          { required: true, message: "所属组织架构不能为空", trigger: "change" }
        ]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "orgName",
        children: "children"
      },
      areaList: [],
      /* 升级 */
      upgradeDialog: false,
      upgradeForm: {},
      upgradeRule:{
          fileVersion: [{ required: true, message: "升级固件不能为空", trigger: "change" }],
      },
      select: {
        softVersion: []
      },
      /* 重启 */
      restartDialog: false,
      restartForm: {},
      restartWarnInfo:"注意，点击确定后将会对当前设备重启，请确保重启时间不影响用户正常业务工作，稍后可以在日志中查看重启情况。",
      timerRestart:'',
      /* 远程 */
      remoteDialog: false,
      remoteForm: {
          sshUrl:''
      }
    };
  },
  created() {
    this.refreshPageRequest(1);
    this.getTree();
    this.findArea();
    this.getVersion();
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
  methods: {
    //获取升级版本
    getVersion() {
      let request = {
        pageNo: 1,
        pageSize: 9999
      };
      this.$api.device
        .queryDevFileList(request)
        .then(res => {
          if (res != null) {
            this.select.softVersion = res.content.list;
          }
        })
        .catch(res => {
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    //序号转换
    indexMethod(index) {
      return (
        index + 1 + (this.pageRequest.pageNo - 1) * this.pageRequest.pageSize
      );
    },
    //时间格式化
    formatDate(val) {
      return format(val);
    },
    //区域查询
    findArea() {
      this.$api.device
        .findArea()
        .then(res => {
          this.areaList = res.content;
        })
        .catch(res => {
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    //区域选择
    handleAreaChange(value) {
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
        this.$store.commit("setDropDownTree", this.treeList);
      });
    },
    //树节点选择
    handleTreeSelectChange(data, node) {
      this.deviceForm.fateherId = data.id;
      this.deviceForm.orgId = data.id;
      this.deviceForm.parentName = data.orgName;
      this.deviceForm.orgLevel = data.id;
      if (data.firstLevelId != 0) {
        this.deviceForm.firstLevelId = data.firstLevelId;
      } else {
        this.deviceForm.firstLevelId = data.id;
      }
    },
    //导出弹窗
    reorder(){
        this.exportDialog = !this.exportDialog
    },
    //搜索
    search() {
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
    handleSizeChange(size) {
      this.pageRequest.pageSize = size;
      this.findPage();
    },
    // 获取分页数据
    getPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.subOrgIds = this.$store.state.menu.deptIds;
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
    //查看设备
    handleLook(row) {
      //console.log(row);
      this.deviceDialog = true;
      this.lookStatus = true;
      this.editStatus = false;
      this.deviceDialogTitle = "查看设备";
      this.deviceForm = {
        id: row.id,
        alarmNum: row.alarmNum,
        area: row.area,
        company: row.company,
        deviceModel: row.deviceModel,
        deviceName: row.deviceName,
        extrnalIP: row.extrnalIP,
        firmwareVersion: row.firmwareVersion,
        intranetIp: row.intranetIp,
        fateherId: row.orgId,
        orgId: row.orgId,
        parentName: row.orgName,
        orgName: row.orgName,
        serialNumber: row.serialNumber,
        softwareVersion: row.softwareVersion,
        remark: row.remark,
        status: row.status
      };
      this.$api.device
        .queryDev({ id: row.id })
        .then(res => {
          if (res.result == "success") {
            this.deviceForm.realName = res.content.realName;
            this.deviceForm.fateherId = res.content.orgId;
            this.deviceForm.area = [res.content.provId, res.content.cityId];
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    //编辑
    handleEdit(row) {
      this.deviceDialog = true;
      this.lookStatus = false;
      this.editStatus = true;
      this.deviceDialogTitle = "编辑设备";
      this.deviceForm = {
        id: row.id,
        alarmNum: row.alarmNum,
        area: row.area,
        company: row.company,
        deviceModel: row.deviceModel,
        deviceName: row.deviceName,
        extrnalIP: row.extrnalIP,
        firmwareVersion: row.firmwareVersion,
        intranetIp: row.intranetIp,
        fateherId: row.orgId,
        orgId: row.orgId,
        orgName: row.orgName,
        parentName: row.orgName,
        serialNumber: row.serialNumber,
        softwareVersion: row.softwareVersion,
        remark: row.remark,
        status: row.status
      };
      this.$api.device
        .queryDev({ id: row.id })
        .then(res => {
          if (res.result == "success") {       
            this.deviceForm.realName = res.content.realName;
            this.deviceForm.fateherId = res.content.orgId;
            this.deviceForm.area = [res.content.provId, res.content.cityId];
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.message,
            type: "error"
          });
        });
    },
    //升级
    handleUpgrade(row) {
      this.upgradeDialog = true;
      this.upgradeForm.did = row.id;
      this.upgradeForm.upgradeTime = row.upgradeTime;
      if(this.$refs.upgradeForm){        
        this.$refs.upgradeForm.clearValidate();
      }
    },
    //升级设备提交
    submitUpgrade(upgradeForm) {
      let self = this;
      this.$refs["upgradeForm"].validate(valid => {
        if (valid) {
            const loading = this.$loading({
                lock: true,
                text: '设备升级中。。。',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$api.device
                .upgradeDev(this.upgradeForm)
                .then(res => {
                  if (res.result == "success") {
                      this.upgradeDialog = false;
                  }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            let timeOut = 0;
            let timerRestart = setInterval(()=>{
              if(timeOut>60*30){
                clearInterval(timerRestart);
                loading.close();
                this.$message({
                    message: '升级设备超时，请重新升级',
                    type: "error"
                });
                return
              }
              self.$api.device
                .singleDev({id:self.upgradeForm.did})
                .then(res => {
                    timeOut++;
                    if (res.result == "success"&&res.content.upgradeStatus&&res.content.upgradeTime != self.upgradeForm.upgradeTime) {                                                        
                        //debugger
                        clearInterval(timerRestart);
                        loading.close();
                        self.findPage();
                    }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            },1000); 
        }
      });
    },
    //重启
    handleRestart(row) {
      this.restartDialog = true;
      this.restartForm.did = row.id;
      this.restartForm.gmtModified = row.gmtModified;
    },
    //重启提交
    submitRestart(restartForm) {
      let self = this;
      this.$refs["restartForm"].validate(valid => {
        if (valid) {          
            const loading = this.$loading({
                lock: true,
                text: '设备重启中。。。',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            self.$api.device
                .restartDev(self.restartForm)
                .then(res => {
                    if (res.result == "success") {             
                        self.restartDialog = false;                            
                    }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            let timeOut = 0;
            this.timerRestart = setInterval(()=>{
              if(timeOut>60){
                clearInterval(timerRestart);
                loading.close();
                this.$message({
                    message: '重启设备超时，请重新重启',
                    type: "error"
                });
                return
              }
                self.$api.device
                .singleDev({id:self.restartForm.did})
                .then(res => {
                    timeOut++;
                    if (res.result == "success"&&res.content.gmtModified != self.restartForm.gmtModified) {
                        clearInterval(self.timerRestart);
                        loading.close();
                        self.findPage();
                    }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            },1000); 
        }
      });
    },
    //提交
    submitdeviceForm(deviceForm) {
      let self = this;
      this.$refs["deviceForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              this.editLoading = true;
              //请求
              if (!self.deviceForm.id && self.deviceForm.id == "") {
                self.$api.device
                  .addDev(self.deviceForm)
                  .then(res => {
                    if (res.result == "success") {
                      self.deviceDialog = false;
                      self.findPage();
                      self.$refs["deviceForm"].resetFields();
                    } else {
                      this.$message({
                        message: "新增失败",
                        type: "error"
                      });
                    }
                  })
                  .catch(res => {
                    this.$message({
                      message: res.message,
                      type: "error"
                    });
                  });
              } else {
                if (!self.lookStatus) {
                  self.$api.device
                    .updDev(self.deviceForm)
                    .then(res => {
                      if (res.result == "success") {
                        self.deviceDialog = false;
                        self.findPage();
                        self.$refs["deviceForm"].resetFields();
                      } else {
                        this.$message({
                          message: "更新失败",
                          type: "error"
                        });
                      }
                    })
                    .catch(res => {
                      this.$message({
                        message: res.message,
                        type: "error"
                      });
                    });
                } else {
                  self.$api.device
                    .delDev({ uid: self.deviceForm.id })
                    .then(res => {
                      //debugger;
                      if (res.result == "success") {
                        self.deviceDialog = false;
                        self.findPage();
                        self.$refs["deviceForm"].resetFields();
                      } else {
                        this.$message({
                          message: "删除失败",
                          type: "error"
                        });
                      }
                    })
                    .catch(res => {
                      this.$message({
                        message: res.message,
                        type: "error"
                      });
                    });
                }
              }
            })
            .catch(() => {
              //this.deviceDialog = false
              this.$message({
                type: "info",
                message: "已取消提交"
              });
            });
        }
      });
    },
    //远程
    handleSSH(row) {
        this.remoteForm.did = row.id;
        this.remoteForm.remoteStatus = 'ssh';
        this.remoteForm.gmtModified = row.gmtModified;
        this.$api.device
            .remote(this.remoteForm)
            .then(res => {
            })
            .catch(res => {
                this.$message({
                    message: res.message,
                    type: "error"
                });
            });
        const loading = this.$loading({
            lock: true,
            text: '远程设备连接中。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        let modifyTime = '',
            IPPath = "",
            portPath = "",
            timeOut = 0;
        this.$api.device
            .singleDev({id:this.remoteForm.did})
            .then(res => {
                if (res.result == "success") { 
                  modifyTime = res.content.gmtModified;
                  let result = [];
                  if(res.content.remoteUrl !=""){
                    result = res.content.remoteUrl.split(':')                    
                    IPPath = result[0];
                    portPath = result[1];
                  }
                }
            })
            .catch(res => {
                this.$message({
                    message: res.message,
                    type: "error"
                });
            });
        let timerRestart = setInterval(()=>{
            if(timeOut>60){
              clearInterval(timerRestart);
              loading.close();
              this.$message({
                  message: '远程设备超时，请重新连接',
                  type: "error"
              });
              return
            }
            this.$api.device
                .singleDev({id:this.remoteForm.did})
                .then(res => {
                    timeOut++;
                    if (res.result == "success"&&res.content.gmtModified != modifyTime) { 
                      let result = [];
                      if(res.content.remoteUrl !=""){
                        result = res.content.remoteUrl.split(':')
                      }else{
                        /* this.$message({
                            message: '获取远程设备地址或端口号失败，请重新连接',
                            type: "error"
                        }); */
                        return;
                      }
                      if(result[0]!=IPPath||result[1]!=portPath){
                        clearInterval(timerRestart);
                        loading.close();
                        this.remoteDialog = true;                        
                        this.remoteForm.sshUrl = 'http://52.83.174.110:8888/?hostname='+result[0]+'&port='+result[1]+'&username=root&password=dmbox';
                      }
                    }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            },1000);
    },
    //远程web
    handleWeb(row){
      this.remoteForm.did = row.id;
        this.remoteForm.remoteStatus = 'web';
        this.remoteForm.gmtModified = row.gmtModified;
        this.$api.device
            .remote(this.remoteForm)
            .then(res => {
            })
            .catch(res => {
                this.$message({
                    message: res.message,
                    type: "error"
                });
            });
        const loading = this.$loading({
            lock: true,
            text: '远程设备连接中。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        let modifyTime = '',
            IPPath = "",
            portPath = "",
            timeOut = 0;
        this.$api.device
            .singleDev({id:this.remoteForm.did})
            .then(res => {
                if (res.result == "success") { 
                  modifyTime = res.content.gmtModified;
                  let result = [];
                  if(res.content.remoteUrl !=""){
                    result = res.content.remoteUrl.split(':')                    
                    IPPath = result[0];
                    portPath = result[1];
                  }
                }
            })
            .catch(res => {
                this.$message({
                    message: res.message,
                    type: "error"
                });
            });
        let timerRestart = setInterval(()=>{
            if(timeOut>60){
              clearInterval(timerRestart);
              loading.close();
              this.$message({
                  message: '远程设备超时，请重新连接',
                  type: "error"
              });
              return
            }
            this.$api.device
                .singleDev({id:this.remoteForm.did})
                .then(res => {
                  timeOut++;
                    if (res.result == "success"&&res.content.gmtModified != modifyTime) { 
                      let result = [];
                      if(res.content.remoteUrl !=""){
                        result = res.content.remoteUrl.split(':')
                      }else{
                        /* this.$message({
                            message: '获取远程设备地址或端口号失败，请重新连接',
                            type: "error"
                        }); */
                        return;
                      }
                      if(result[0]!=IPPath||result[1]!=portPath){
                        //debugger
                        clearInterval(timerRestart);
                        loading.close();
                        //this.remoteDialog = true;
                        this.remoteForm.sshUrl = "http://"+res.content.remoteUrl;
                        window.open(this.remoteForm.sshUrl, '_blank');
                      }
                        
                    }
                })
                .catch(res => {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                });
            },1000);
    },
    //远程弹窗关闭
    remoteDialogClose(){
        this.remoteDialog = false;
    },
    //远程提交
    submitRemote(remoteForm){

    },
    //重启弹窗关闭
    restartDialogClose() {
      this.restartDialog = false;
    },
    //重置升级弹窗
    resetUpgrade(upgradeForm) {
      this.upgradeForm.fileVersion = "";
    },
    //升级弹窗关闭事件
    upgradeDialogClose() {
      this.upgradeDialog = false;
      this.upgradeForm.fileVersion = "";
      this.$refs.upgradeForm.clearValidate();
    },
    /* 重置事件 */
    resetBtn(formName) {
      this.deviceForm.area ="";
      this.deviceForm.orgId ="";
      this.deviceForm.orgName ="";
      this.deviceForm.parentName ="";
      this.deviceForm.fateherId ="";
      this.deviceForm.deviceName ="";
      this.deviceForm.remark ="";
      this.$refs["deviceForm"].clearValidate();
    },
    /* 查看、编辑弹窗关闭 */
    handleClose() {
      this.deviceForm = {
        id: "",
        alarmNum: "",
        area: "",
        company: "",
        deviceModel: "",
        deviceName: "",
        extrnalIP: "",
        firmwareVersion: "",
        intranetIp: "",
        fateherId: "",
        orgId: "",
        orgName: "",
        provId: "",
        cityId: "",
        serialNumber: "",
        softwareVersion: "",
        remark: "",
        status: ""
      };
      this.$refs["deviceForm"].clearValidate();
    }
  }
};
</script>
