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
                <div style="margin: 20px 0;display:inline-block;min-width: 30%;">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item >
                            <!-- <el-button type="primary" @click="exportLog">
                                <span>导出日志</span>
                            </el-button> -->
                        </el-form-item>
                        <el-form-item >
                            <el-select v-model="searchKey" placeholder="请选择搜索条件">
                                <el-option label="日期" value="time"></el-option>
                                <el-option label="登录账号" value="user"></el-option>
                                <!-- <el-option label="操作类型" value="deviceName"></el-option>
                                <el-option label="结果" value="deviceModel"></el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <el-input placeholder="按登录日期，登录账号条件进行搜索" v-model="searchValue" class="input-with-select"  
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
                            height="580"
                            @selection-change="handleSelectionChange"
                            >
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column type="index" label="序号" width="55" align="center" :index="indexMethod"></el-table-column>
                            <el-table-column prop="logTime" label="日期" width="180" align="center">
                                <template slot-scope="scope">
                                    <span>{{formatDate(scope.row.logTime)}}</span>
                                </template> 
                            </el-table-column>
                            <el-table-column prop="loginName" label="登录账号" width="180" align="center"></el-table-column>
                            <el-table-column prop="realName" label="真实姓名" width="100" align="center"></el-table-column>
                            <el-table-column prop="loginIp" label="外网IP地址" width="150" align="center"></el-table-column>
                            <!-- <el-table-column prop="operationType" label="操作类型" width="120">
                                <template slot-scope="scope">
                                    <span style="color:red" v-if="scope.row.operationType =='1'">{{ scope.row.result }}</span>
                                    <span v-else-if="scope.row.operationType =='0'">{{ scope.row.status }}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column prop="detailedLog" label="详细日志" min-width="200" align="center"></el-table-column>
                            <el-table-column prop="status" label="结果" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status =='1'">成功</span>
                                    <span style="color:red" v-else>失败</span>
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
            }
        }
    },
    created() {        
        this.refreshPageRequest(1);
    },
    methods:{
        indexMethod(index){
            return (index+1)+((this.pageRequest.pageNo-1)*this.pageRequest.pageSize);
        },
        formatDate(val){
            return format(val)
        },
        //导出日志
        exportLog(){
            this.$confirm('确认导出日志？', '导出日志', {
				type: 'success'
            }).then(() => {

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消导出日志'
                });          
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
            this.$api.log
                .getUserLog(this.pageRequest)
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
            rows.map((item)=>{
                ids += item.id+','
            }); 
            this.selections = ids.substr(0, ids.length - 1);
        }
    }
}
</script>

