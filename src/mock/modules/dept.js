export function findPage(params) {
    let findPageData = {
        "code": 200,
        "msg": null,
        "data": {
            record:[{
                "id":"自动产生",
                "shopName":"大润店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"杭州",
                "adress":"雨花石路",
                "note":"",
                "devOps":"张三",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":false
            },{
                "id":"0000002",
                "shopName":"江南i店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"广州",
                "adress":"长安路",
                "note":"",
                "devOps":"张三",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":true
            },{
                "id":"0000003",
                "shopName":"南京店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"江苏",
                "adress":"东门路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":false
            },{
                "id":"0000004",
                "shopName":"淮海店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"上海",
                "adress":"淮海路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":false
            },{
                "id":"0000004",
                "shopName":"淮海店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"上海",
                "adress":"淮海路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":true
            },{
                "id":"0000004",
                "shopName":"淮海店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"上海",
                "adress":"淮海路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":true
            },{
                "id":"0000004",
                "shopName":"淮海店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"上海",
                "adress":"淮海路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":false
            },{
                "id":"0000004",
                "shopName":"淮海店",
                "contacts":"大润发",
                "phone":"13301885888",
                "city":"上海",
                "adress":"淮海路",
                "note":"",
                "devOps":"李四",
                'company':'杭州事业1部',
                'parentId': 21,
                'parentName': '杭州事业1部',
                "status":true
            }],
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
        url: "dept/findPage",
        type: "get",
        data: findPageData
    }
}

export function getTree(pageNum, pageSize) {
    let tree = {
        code:200,
        msg: null,
        data:{
            record:[{
                id: '01',
                name: '上海DVO运维系统',
                parentId:'0',
                parentName: "上海DVO运维系统",
                address: '',
                note:'',
                children: [{
                    id: '1',
                    name: '大润发公司',
                    parentId:'01',
                    parentName: "上海DVO运维系统",
                    address: '',
                    note:'',
                    children: [{
                        id: '11',
                        name: '华东区',
                        parentId:'1',
                        parentName: "大润发公司",
                        address: '',
                        note:'',
                        children: [{
                            id: '111',
                            name: '苏州省',
                            parentId:'11',
                            parentName: "华东区",
                            address: '',
                            note:''
                        }]
                    }, {
                        id: '12',
                        name: '华南区',
                        parentId:'1',
                        parentName: "大润发公司",
                        address: '',
                        note:'',
                        children: [{
                            id: '121',
                            name: '超市1',
                            parentId:'12',
                            parentName: "华南区",
                            address: '',
                            note:''
                        }]
                    }]
                }, {
                    id: '2',
                    name: '三江超市',
                    parentId:'01',
                    parentName: "上海DVO运维系统",
                    address: '',
                    note:'',
                    children: [{
                        id: '21',
                        name: '杭州事业1部',
                        parentId:'2',
                        parentName: "三江超市",
                        address: '',
                        note:'',
                        children: [{
                            id: '211',
                            name: 'XX门店',
                            parentId:'21',
                            parentName: "杭州事业1部",
                            address: '',
                            note:''
                        },{
                            id: '212',
                            name: 'XX门店',
                            parentId:'21',
                            parentName: "杭州事业1部",
                            address: '',
                            note:''
                        },{
                            id: '213',
                            name: 'XX门店',
                            parentId:'21',
                            parentName: "杭州事业1部",
                            address: '',
                            note:''
                        }]
                    }]
                }]
            }]
        }
    };
    return {
        url: "dept/getTree",
        type: "get",
        data: tree
    }
}