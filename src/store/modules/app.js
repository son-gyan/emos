export default {
    state: {
        appName: "运维管理系统",  // 应用名称
        themeColor: "#14889A",  // 主题颜色
        oldThemeColor: "#14889A",   // 上一次主题颜色
        collapse:false,  // 导航栏收缩状态
        menuRouteLoaded:false,    // 菜单和路由是否已经加载
        deptDown:false        //导航栏组织架构下拉框显隐
    },
    mutations: {
        onCollapse(state){
            state.collapse = !state.collapse
        },
        setThemeColor(state, themeColor){  // 改变主题颜色
            state.oldThemeColor = state.themeColor
            state.themeColor = themeColor
        },
        menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
            state.menuRouteLoaded = menuRouteLoaded;
        },
        onDeptDown(state,deptDown){
            state.deptDown = deptDown
        }

    }
}