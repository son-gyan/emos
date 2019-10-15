let attr = {
    id:"id",
    orgName:"orgName",    
    fateherId: 'fateherId',
    parentName: 'orgName',
    address:"address",
    isShop:'isShop',
    status:'status',
    contactEmp:'contactEmp',
    enable:'enable',
    firstLevelId:'firstLevelId',
    mobilePhone:'mobilePhone',
    orgLevel:'orgLevel',
    userId:'userId',
    remark:"remark",
    rootId: 0
};
export function toTreeData(data) {
    let tree = [];
    let resData = data;    
    for (let i = 0; i < resData.length; i++) {
        if (resData[i].fateherId === attr.rootId) {
            let obj = {
                id:resData[i][attr.id],
                orgName:resData[i][attr.orgName],    
                fateherId: resData[i][attr.fateherId],
                parentName: resData[i][attr.parentName],
                address:resData[i][attr.address],
                isShop:resData[i][attr.isShop],
                contactEmp:resData[i][attr.contactEmp],
                enable:resData[i][attr.enable],
                firstLevelId:resData[i][attr.firstLevelId],
                mobilePhone:resData[i][attr.mobilePhone],
                orgLevel:resData[i][attr.orgLevel],
                userId:resData[i][attr.userId],
                status:resData[i][attr.status],
                remark:resData[i][attr.remark],
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
                //console.log(i);
                for (let j = 0; j < resData.length; j++) {
                    if (treeArrs[i].id === resData[j][attr.fateherId]) {
                        let obj = {
                            id:resData[j][attr.id],
                            orgName:resData[j][attr.orgName],    
                            fateherId: resData[j][attr.fateherId],
                            parentName: treeArrs[i].orgName,
                            address:resData[j][attr.address],
                            isShop:resData[j][attr.isShop],
                            contactEmp:resData[j][attr.contactEmp],
                            enable:resData[j][attr.enable],
                            firstLevelId:resData[j][attr.firstLevelId],
                            mobilePhone:resData[j][attr.mobilePhone],
                            orgLevel:resData[j][attr.orgLevel],
                            userId:resData[j][attr.userId],
                            status:resData[j][attr.status],
                            remark:resData[j][attr.remark],
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
    /* console.log(tree)
    debugger */
    return tree;
}

//权限树
let propobject = {
    rootId: 0,
    fatherId: 'fatherId',
    gmtCreate: "gmtCreate",
    icon: "icon",
    id: 'id',
    menuLevel: 'menuLevel',
    menuName: "menuName",
    menuType: 'menuType',
    menuUrl: "menuUrl",
    sort: 'sort'
}

export function moduleTree(data) {
    let tree = [];
    let resData = data;    
    for (let i = 0; i < resData.length; i++) {
        if (resData[i].fatherId === propobject.rootId) {
            let obj = {
                id:resData[i][propobject.id],
                menuName:resData[i][propobject.menuName],    
                fatherId: resData[i][propobject.fatherId],
                menuLevel: resData[i][propobject.menuLevel],
                menuUrl: resData[i][propobject.menuUrl],
                menuType: resData[i][propobject.menuType],
                icon: resData[i][propobject.icon],
                gmtCreate: resData[i][propobject.gmtCreate],
                sort: resData[i][propobject.sort],
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
                //console.log(i);
                for (let j = 0; j < resData.length; j++) {
                    if (treeArrs[i].id === resData[j][propobject.fatherId]) {
                        let obj = {
                            id:resData[j][propobject.id],
                            menuName:resData[j][propobject.menuName],    
                            fatherId: resData[j][propobject.fatherId],
                            menuLevel: resData[j][propobject.menuLevel],
                            menuUrl: resData[j][propobject.menuUrl],
                            menuType: resData[j][propobject.menuType],
                            icon: resData[j][propobject.icon],
                            gmtCreate: resData[j][propobject.gmtCreate],
                            sort: resData[j][propobject.sort],
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
    /* console.log(tree)
    debugger */
    return tree;
}