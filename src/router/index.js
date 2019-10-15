import Vue from "vue";
import Router from "vue-router";
import Cookies from "js-cookie"
import store from '@/store'
import Home from "@/views/Home";
import Login from "@/views/Login";
import ServerInfo from "@/views/ServerInfo";
import ForgetPwd from "@/views/ForgetPwd";
import SafeValidate from "@/views/SafeValidate";
import Index from '@/views/Index/Index'
import NotFound from "@/views/Error/404";
import api from '@/http/api'

import { getIFramePath, getIFrameUrl } from '@/utils/iframe'
Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router =  new Router({
    //mode: 'history',
    routes: [
        {
            path: "/",
            name: "首页",
            component: Home,
            /* redirect: '/index', */            
            children: [
                { 
                    path: '/index', 
                    name: '首页', 
                    component: Index,
                    meta: {
                        icon: 'fa fa-home fa-lg',
                        index: 0
                    }                  
                }
            ]
        },
        {
            path: "/login",
            name: "登录",
            component: Login
        },{
            path: "/serverInfo",
            name: "服务条款",
            component: ServerInfo
        },{
            path: "/forgetPwd",
            name: "忘记密码",
            component: ForgetPwd
        },{
            path: "/safeValidate",
            name: "安全验证",
            component: SafeValidate
        },
        {
            path: "/404",
            name: "notFound",
            component: NotFound
        }
    ]
});

router.beforeEach((to, from, next) => {
    // 登录界面登录成功之后，会把用户信息保存在会话
    // 存在时间为会话生命周期，页面关闭即失效。
    //let token = Cookies.get('token')
    let userName = localStorage.getItem('user')
    let Authorization =localStorage.getItem("Authorization");
    //debugger
    if(to.path === '/User/User' || to.path === '/warn/warnDetail'|| to.path === '/device/manager'){
        store.commit('onDeptDown',true)        
    }else{
        store.commit('onDeptDown',false)
    }
    /* if (to.path === '/login' || to.path === '/serverInfo' || to.path === '/forgetPwd' || to.path === '/safeValidate') {
      // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
        if(token) {
            next({ path: '/index' })
        } else {
            next()
        }
    } else {
        if (!token) {
            // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
            next({ path: '/login' })
        } else {
            // 加载动态菜单和路由
            addDynamicMenuAndRoutes(userName, to, from) 
            next()
        }
    } */
    // 加载动态菜单和路由
    //debugger
    if (to.path != '/login'&&to.path != '/serverInfo'&&to.path != '/forgetPwd'&&to.path != '/safeValidate'){
        addDynamicMenuAndRoutes(userName, to, from,function(){            
            if(to.path == '/'){
                let resData = store.state.menu.navTree
                next(resData[0].url)
            }
            /* let resData = store.state.menu.navTree
            next(resData[0].url) */
        })     
    }
    //debugger
    next()
})

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to, from,callBack) {
    // 处理IFrame嵌套页面
    handleIFrameUrl(to.path)
    /* console.log(store.state.menu.navTree);
    console.log(store.state.app.menuRouteLoaded); */
    //debugger
    if(store.state.app.menuRouteLoaded) {
        console.log('动态菜单和路由已经存在.')
        return
    }
    // 添加动态路由
    api.menu.findNavTree().then((res) => {
        //debugger
        if(!res){
            return
        }
        var data = res.content;
        let attr = {
            parentId: 'fatherId',
            gmtCreate: "gmtCreate",
            icon: "icon",
            id: 'id',
            level: 'menuLevel',
            name: "menuName",
            type: 'menuType',
            url: "menuUrl",
            sort: 'sort',
            rootId: 0
        };
        let menuTree = toTreeData(res.content,attr);

        let resData = menuTree
        //let resData = JSON.parse(sessionStorage.getItem('menuTree'))
        //let resData = store.state.menu.navTree
        let dynamicRoutes = addDynamicRoutes(resData)
        // 处理静态组件绑定路由
        handleStaticComponent(router, dynamicRoutes)
        router.addRoutes(router.options.routes)
        // 保存加载状态
        store.commit('menuRouteLoaded', true)
        // 保存菜单树
        store.commit('setNavTree', resData)
        callBack&&callBack();
    })
    /* api.menu.findNavTree({'userName':userName})
    .then(res => {
        // 添加动态路由
        let dynamicRoutes = addDynamicRoutes(res.data)
        // 处理静态组件绑定路由
        handleStaticComponent(router, dynamicRoutes)
        router.addRoutes(router.options.routes)
        // 保存加载状态
        store.commit('menuRouteLoaded', true)
        // 保存菜单树
        store.commit('setNavTree', res.data)
    }).then(res => {
    //   api.user.findPermissions({'name':userName}).then(res => {
    //     // 保存用户权限标识集合
    //     store.commit('setPerms', res.data)
    //   })
    })
    .catch(function(res) {
    }) */
}

function toTreeData(data, attr) {
    let tree = [];
    let resData = data;
    if(data==null){
        return
    }
    for (let i = 0; i < resData.length; i++) {
        if (resData[i].fatherId === attr.rootId) {
            let obj = {
                parentId: resData[i][attr.parentId],
                gmtCreate: resData[i][attr.gmtCreate],
                icon:resData[i][attr.icon],
                id: resData[i][attr.id],
                level: resData[i][attr.level],
                name: resData[i][attr.name],
                type: resData[i][attr.type],
                url: resData[i][attr.url],
                sort: resData[i][attr.sort],
                children: []
            };
            tree.push(obj);
            resData.splice(i, 1);
            i--;
        }
    }
    var run = function(treeArrs) {
        if (resData.length > 0) {
            for (let i = 0; i < treeArrs.length; i++) {
                for (let j = 0; j < resData.length; j++) {
                    if (treeArrs[i].id === resData[j][attr.parentId]) {
                        let obj = {
                            parentId: resData[j][attr.parentId],
                            gmtCreate: resData[j][attr.gmtCreate],
                            icon:resData[j][attr.icon],
                            id: resData[j][attr.id],
                            level: resData[j][attr.level],
                            name: resData[j][attr.name],
                            type: resData[j][attr.type],
                            url: resData[j][attr.url],
                            sort: resData[j][attr.sort],
                            children: []
                        };
                        treeArrs[i].children.push(obj);
                        resData.splice(j, 1);
                        j--;
                    }
                }
                run(treeArrs[i].children);
            }
        }
    };
    run(tree);
    return tree;
}
/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
    for(let j=0;j<dynamicRoutes.length; j++) {
        if(dynamicRoutes[j].name == '代码生成') {
            dynamicRoutes[j].component = Generator
            break
        }
    }
    router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
    // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
    let url = path
    let length = store.state.iframe.iframeUrls.length
    for(let i=0; i<length; i++) {
        let iframe = store.state.iframe.iframeUrls[i]
        if(path != null && path.endsWith(iframe.path)) {
            url = iframe.url
            debugger
            store.commit('setIFrameUrl', url)
            break
        }
    }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
    //debugger
    var temp = []
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].children && menuList[i].children.length >= 1) {
            temp = temp.concat(menuList[i].children)
        } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
            menuList[i].url = menuList[i].url.replace(/^\//, '')
            // 创建路由配置
            var route = {
                path: menuList[i].url,
                component: null,
                name: menuList[i].name,
                meta: {
                    icon: menuList[i].icon,
                    index: menuList[i].id
                }
            }
            let path = getIFramePath(menuList[i].url)
            if (path) {
                // 如果是嵌套页面, 通过iframe展示
                route['path'] = path
                route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
                // 存储嵌套页面路由路径和访问URL
                let url = getIFrameUrl(menuList[i].url)
                let iFrameUrl = {'path':path, 'url':url}
                store.commit('addIFrameUrl', iFrameUrl)
            } else {
                try {
                    // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
                    // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
                    let array = menuList[i].url.split('/')
                    let url = ''
                    for(let i=0; i<array.length; i++) {
                      url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
                    }
                    url = url.substring(0, url.length - 1)
                    route['component'] = resolve => require([`@/views/${url}`], resolve)
                } catch (e) {}
            }
            routes.push(route)
        }
    }
    if (temp.length >= 1) {
        addDynamicRoutes(temp, routes)
    } else {
        console.log('动态路由加载...')
        console.log(routes)
        console.log('动态路由加载完成.')
    }
    //sessionStorage.setItem('menuTree',JSON.stringify(routes))
    return routes
 }

 export default router