export default {
    state: {
        navTree: [],  // 导航菜单树
        deptIds:'',  // 点击组织架构获取其及子id字符串
        deptName:'',
    },
    getters: {
   
    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            //debugger
            state.navTree = navTree;
        },
        setDeptIds(state, deptIds){
            state.deptIds = deptIds;
        },
        setDeptName(state, deptName){
            state.deptName = deptName;
        }
    },
    actions: {
        
    }
}