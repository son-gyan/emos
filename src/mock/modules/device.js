export function findPage(params) {
    let findPageData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[
                {
                    "id":"1000001",
                    "deviceName":"DG网关",
                    "orderNum":"SD-324-E-WER-124",
                    "extranetIP":"58.116.24.12",
                    "intranetIP":"192.168.1.254",
                    "deviceType":"DG-20x",
                    "createTime":"2019/1/5",
                    "area":"深圳市",
                    'company':'大润发',
                    'dept': '待分配',
                    'parentId':2,
                    'parentName':"大润发",
                    'note':'测试设备1',
                    'status': 0
                },
                {
                    "id":"1000002",
                    "deviceName":"DG网关",
                    "orderNum":"SD-324-E-234R-124",
                    "extranetIP":"117.59.32.65",
                    "intranetIP":"192.168.2.254",
                    "deviceType":"DG-20x",
                    "createTime":"2019/1/5",
                    "area":"宁波市",
                    'company':'三江超市',
                    'dept': '三江001店',
                    'parentId':2,
                    'parentName':"大润发",
                    'note':'测试设备2',
                    'status': 1
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
        url: "device/findPage",
        type: "get",
        data: findPageData
    }
}