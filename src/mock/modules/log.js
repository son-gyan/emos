//用户日志 查询
export function getUserLog(params) {
    let getUserLogData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"100001",
                    "date":"2019/3/31 10:26",
                    "mail":"dvo@diveo.com.cn",
                    "realName":"张三",
                    "extranetIP":"58.246.241.88",
                    "type":"登陆WEB系统",
                    "logInfo":"张三在IP地址58.246.241.10（中国），登陆系统成功",
                    "result":"成功"
                },
                {
                    "id":"100002",
                    "date":"2019/3/31 22:26",
                    "mail":"dvo1@diveo.com.cn",
                    "realName":"李四",
                    "extranetIP":"218.79.35.75",
                    "type":"登陆WEB系统",
                    "logInfo":"李四在IP地址218.79.35.75（美国），登陆系统密码错误10次被锁定",
                    "result":"失败"
                },
                {
                    "id":"100003",
                    "date":"2019/3/31 23:26",
                    "mail":"dvo@diveo.com.cn",
                    "realName":"张三",
                    "extranetIP":"58.246.241.88",
                    "type":"升级设备",
                    "logInfo":"张三在IP地址58.246.241.10（中国），升级10台设备，9台成功，1台失败",
                    "result":"失败"
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
        url: "log/getUserLog",
        type: "get",
        data: getUserLogData
    }
}
//设备日志 查询
export function getDeviceLog(params) {
    let getDeviceLogData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"100001",
                    "date":"2019/3/31 10:26",
                    "deviceName":"001店DG网关",
                    "orderNum":"SD-324-E-WER-001",
                    "deviceType":"DG-20x",
                    "company":"大润发",
                    "dept":"大润发001店",
                    "parentId":"3",
                    'parentName':'大润发001区-001门店',
                    'operator':'张三',
                    "extranetIP":"58.246.241.88",
                    "operationType":"升级设备",
                    "logInfo":"001店DG网关在IP地址58.246.241.10（中国），升级策略失败",
                    "result":"失败"
                },
                {
                    "id":"100002",
                    "date":"2019/3/31 22:26",
                    "deviceName":"002店DG网关1",
                    "orderNum":"SD-324-E-234R-002",
                    "deviceType":"DG-20x",
                    "company":"大润发",
                    "dept":"大润发002店",
                    "parentId":"3",
                    'parentName':'大润发001区-002门店',
                    'operator':'李四',
                    "extranetIP":"58.246.111.21",
                    "operationType":"升级设备",
                    "logInfo":"002店DG网关1在IP地址58.246.241.10（中国），升级策略成功",
                    "result":"成功"
                },
                {
                    "id":"100003",
                    "date":"2019/3/31 23:26",
                    "deviceName":"002店DG网关2",
                    "orderNum":"SD-324-E-234R-003",
                    "deviceType":"DG-20x",
                    "company":"大润发",
                    "dept":"大润发002店",
                    "parentId":"3",
                    'parentName':'大润发001区-002门店',
                    'operator':'张三',
                    "extranetIP":"58.246.241.88",
                    "operationType":"下发策略",
                    "logInfo":"002店DG网关2在IP地址58.246.241.10（中国），下发升级策略成功",
                    "result":"成功"
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
        url: "log/getDeviceLog",
        type: "get",
        data: getDeviceLogData
    }
}