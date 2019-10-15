<template >
    <div>
        <el-table
            ref="multipleTable"
            border
            :data="tableData.content"
            style="width: 100%"
            height="600"
            >
            <el-table-column prop="id" label="ID" min-width="100" align="center"></el-table-column>
            <el-table-column prop="upgradeName" label="升级策略名称" min-width="130" align="center"></el-table-column>
            <el-table-column label="升级类型" min-width="100" align="center">
                <template  slot-scope="scope" >
                    <span>{{scope.row.upgradeType=='1'?'固件':'软件'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="deviceModel" label="升级设备型号"  min-width="120" align="center"></el-table-column>
            <el-table-column prop="area" label="区域"  min-width="100" align="center"></el-table-column>
            <el-table-column prop="company" label="所属公司"  min-width="100" align="center"></el-table-column>
            <el-table-column prop="orgName" label="升级组织架构"  min-width="110" align="center"></el-table-column>
            <el-table-column prop="startTime" label="开始时间"  min-width="150" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"  min-width="150" align="center"></el-table-column>
            <!-- <el-table-column prop="realName" label="创建人"  min-width="100" align="center"></el-table-column> -->
            <el-table-column label="状态"  min-width="180" align="center">
                <template  slot-scope="scope" >
                    <span style="color:red" v-if="scope.row.status==0">{{'部分完成'}}</span>
                    <span style="color:green" v-if="scope.row.status!=0">{{'全部完成'}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="详细日志" width="180" align="center"> <!-- fixed="right" -->
                <template slot-scope="scope">
                    <el-button @click="tableDetailLook(scope.row)" type="text" size="small">查看详细</el-button>
                </template>
            </el-table-column>
        </el-table>        
    </div>
</template>
<script>
export default {
    name:'TableList',
    props: {
        tableData: {
            type: Object,
            default: {}
        }
    },
    methods:{
        tableDetailLook(row){
            this.$emit('detailLook',row);
        }
    }
}
</script>   