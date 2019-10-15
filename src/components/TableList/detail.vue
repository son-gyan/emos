<template >
    <div>
        <el-table
            ref="multipleTable"
            border
            :data="tableData"
            style="width: 100%"
            height="600"
            >
            <el-table-column prop="upgradeName" label="升级策略名称" min-width="130" align="center"></el-table-column>
            <el-table-column prop="startTime" label="开始时间"  min-width="140" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间"  min-width="140" align="center"></el-table-column>
            <!-- <el-table-column prop="realName" label="创建人"  min-width="100" align="center"></el-table-column> -->
            <el-table-column label="状态"  min-width="180" align="center">
                <template  slot-scope="scope" >
                    <span style="color:red" v-if="scope.row.status==0">{{'升级失败'}}</span>
                    <span style="color:green" v-if="scope.row.status!=0">{{'升级成功'}}</span>
                </template>
            </el-table-column>
        </el-table>        
    </div>
</template>
<script>
export default {
    name:'LogDetail',
    props: {
        tableData: {
            type: Array,
            default: []
        }
    }
}
</script>   