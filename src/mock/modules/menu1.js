/* 
 * 菜单管理模块
 */

// 获取导航菜单树
export function findNavTree() {
    const navTreeData = {
        "code": 200,
        "msg": null,
        "data": [
            {
                "id": 1,
                "parentId": 0,
                "name": "首页",
                "url": "/",
                "icon": "fa fa-home fa-lg",
                "type": 0,
                "delFlag": 0,
                "level": 0,
                "orderNum": 0,
                "children": []
            },
            {
                "id": 2,
                "createBy": "admin",
                "createTime": "2018-12-27T02:57:29.000+0000",
                "lastUpdateBy": "admin",
                "lastUpdateTime": "2018-12-27T03:02:26.000+0000",
                "parentId": 0,
                "name": "组织架构",
                "url": "/dept/dept",
                "perms": "",
                "type": 0,
                "icon": "el-icon-menu",
                "orderNum": 1,
                "delFlag": 0,
                "parentName": null,
                "level": 0,
                "children": []
            }, {
                "id": 3,
                "createBy": "admin",
                "createTime": "2018-12-27T02:57:29.000+0000",
                "lastUpdateBy": "admin",
                "lastUpdateTime": "2018-12-27T03:02:26.000+0000",
                "parentId": 0,
                "name": "用户管理",
                "url": "/User/User",
                "perms": "",
                "type": 0,
                "icon": "el-icon-user-solid",
                "orderNum": 2,
                "delFlag": 0,
                "parentName": null,
                "level": 0,
                "children": []
            }, {
                "id": 4,
                "createBy": "admin",
                "createTime": "2018-12-27T02:57:29.000+0000",
                "lastUpdateBy": "admin",
                "lastUpdateTime": "2018-12-27T03:02:26.000+0000",
                "parentId": 0,
                "name": "角色管理",
                "url": "/role/role",
                "perms": "",
                "type": 0,
                "icon": "el-icon-view",
                "orderNum": 2,
                "delFlag": 0,
                "parentName": null,
                "level": 0,
                "children": []
            }, {
                "id": 5,
                "parentId": 0,
                "name": "资产管理",
                "url": null,
                "perms": "",
                "icon": "el-icon-office-building",
                "level": 0,
                "children": [
                    {
                        "id": 51,
                        "parentId": 5,
                        "name": "注册设备",
                        "url": '/device/device',
                        "perms": "",
                        "icon": "el-icon-service",
                        "level": 1,
                        "children": []
                    },
                    {
                        "id": 52,
                        "parentId": 5,
                        "name": "查看设备",
                        "url": "http://router.vuejs.org/zh-cn/essentials/nested-routes.html",
                        "perms": "",
                        "icon": "el-icon-service",
                        "level": 1,
                        "children": []
                    }
                ]
            },{
                "id": 6,
                "parentId": 0,
                "name": "工单管理",
                "url": "http://router.vuejs.org/zh-cn/essentials/nested-routes.html",
                "perms": "",
                "icon": "el-icon-s-order",
                "level": 0,
                "children": []
            },{
                "id": 7,
                "parentId": 0,
                "name": "系统设置",
                "url": "http://router.vuejs.org/zh-cn/essentials/nested-routes.html",
                "perms": "",
                "icon": "el-icon-s-tools",
                "level": 0,
                "children": []
            },{
                "id": 8,
                "parentId": 0,
                "name": "日志管理",
                "url": "http://router.vuejs.org/zh-cn/essentials/nested-routes.html",
                "perms": "",
                "icon": "el-icon-edit-outline",
                "level": 0,
                "children": []
            }
        ]
    }
    return {
        url: 'menu/findNavTree',
        type: 'get',
        data: navTreeData
    }
}
  

export function setParentName(data) {
    if(data == null) {
        return
    }
    let len = data.length
    for(let i=0; i<len; i++) {
        let menu = data[i]
        menu.parentName = 'menu' + menu.parentId
        if(menu.children != null) {
            setParentName(menu.children)
        }
    }
}