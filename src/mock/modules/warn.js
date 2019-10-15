export function findPage(params) {
    let findPageData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"100001",
                    "warnName":"大润发DG-20X设备离线告警",
                    "deviceType":"DG-20X",
                    "condition":"设备状态为离线",
                    "level":"严重",
                    "area":"全国",
                    "company":"大润发",
                    "parentId":"1",
                    'parentName':'大润发全部',
                    'notifier': '张三，大润发总部督导',
                    'notifyWay': '微信，钉钉，短信，邮件，web',
                    "status":true,
                    "note":''
                },
                {
                    "id":"100002",
                    "warnName":"大润发DG-20X设备负荷过高告警",
                    "deviceType":"DG-20X",
                    "condition":"设备CPU指标超过90%",
                    "level":"轻微",
                    "area":"上海",
                    "company":"大润发",
                    "parentId":"3",
                    'parentName':'大润发一区',
                    'notifier': '李四，大润发一区督导',
                    'notifyWay': '微信，钉钉，短信，邮件，web',
                    "status":false,
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
        url: "warn/findPage",
        type: "get",
        data: findPageData
    }
}

//查看警告 查询
export function getWarnDetail(params) {
    let getWarnDetailData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"100001",
                    "warnTime":"20190329-22：00",
                    "orderNum":"KWR-86182686",
                    "deviceName":"大润发001店网关",
                    "deviceType":"DG-20X",
                    "warnContent":"设备状态为离线",
                    "level":"严重",
                    "area":"上海",
                    "parentId":"1",
                    'parentName':'大润发',
                    'notifier': '张三，大润发总部督导',
                    "status":'未处理',
                    "note":''
                },
                {
                    "id":"100002",
                    "warnTime":"20190329-19：00",
                    "orderNum":"KWR-91231231",
                    "deviceName":"大润发一区002店网关",
                    "deviceType":"DG-20X",
                    "warnContent":"设备CPU指标超过90%",
                    "level":"严重",
                    "area":"江苏",
                    "parentId":"1",
                    'parentName':'大润发一区',
                    'notifier': '李四，大润发一区督导',
                    "status":'已处理',
                    "note":'已升级软件解决'
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
        url: "warn/getWarnDetail",
        type: "get",
        data: getWarnDetailData
    }
}