export function findPage(params) {
    let findPageData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"100001",
                    "mail":"dvo@diveo.com.cn",
                    "realName":"张三",
                    "phone":"13001230342",
                    "createTime":"2019/1/13",
                    "role":"运维管理员",
                    "dept":"迪维欧总部",
                    "parentId":"0",
                    'parentName':'迪维欧总部',
                    'status': false,
                    'password': '123456',
                    "againPwd":'123456',
                    "note":''
                },
                {
                    "id":"100002",
                    "mail":"dvo2@diveo.com.cn",
                    "realName":"李四",
                    "phone":"13001110342",
                    "createTime":"2019/1/13",
                    "role":"普通运维员",
                    "dept":"大润发001区-001门店",
                    "parentId":"3",
                    'parentName':'大润发001区-001门店',
                    'status': true,
                    'password': '123456',
                    "againPwd":'123456',
                    "note":''
                }
            ],
            'pageNum':1,
            'pageSize':8,
            'totalSize':50
        }
    }
    let pageNum = 1
    let pageSize = 8
    if(params !== null) {
    // pageNum = params.pageNum
    }
    if(params !== null) {
    // pageSize = params.pageSize
    }
    return {
        url: "user/findPage",
        type: "get",
        data: findPageData
    }
}