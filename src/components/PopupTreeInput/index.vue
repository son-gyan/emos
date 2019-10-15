<style lang="scss" scoped>
.hide{
  display: none !important;
}

</style>
<style>
.el-popover{
  max-height: 400px;
  overflow: auto;
}
</style>

<template>
  <div class="treeWrap">
    <el-popover ref="popover" :placement="placement" trigger="hover" class="treeDialog" :disabled="disabledStatus" 
        style="max-height:500px;">
      <el-tree
        :data="data"
        :props="props"
        node-key="nodeKey"
        ref="popupTree"        
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
        :expand-on-click-node="true"
        show-checkbox
        @check-change="currentChangeHandle"
        v-if="showCheckbox"
        >
      </el-tree>
      <el-tree
        :data="data"
        :props="props"
        node-key="nodeKey"
        ref="popupTree"
        @current-change="currentChangeHandle"
        :default-expand-all="defaultExpandAll"
        :highlight-current="true"
        :expand-on-click-node="true"
        v-else
        >
      </el-tree>
    </el-popover>
    <el-input v-model="prop" v-popover:popover :readonly="true" :placeholder="disabledStatus?'':placeholder" style="cursor:pointer;" :disabled='disabledStatus'></el-input>
  </div>
</template>

<script>
export default {
  name: 'PopupTreeInput',
  props: {
    data: {
      type: Array,
      default: []
    },
    props: {
      type: Object,
      default: {}
    },
    prop: {
      type: String,
      default: ''
    },
    nodeKey: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    currentChangeHandle: {
      type: Function,
      default: null
    }
  },
  computed:{
    disabledStatus(){
      /* console.log(this.disabled);
      debugger */
      return this.disabled
    }
  }
}
</script>

<style scoped>

</style>