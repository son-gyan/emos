import axios from '../axios'

// 查找设备列表
export const findPage = (params) => {
    return axios({
        url: '/dev/queryRegDevList',
        method: 'get',
        params
    })
}

//获取设备型号/dev/model
export const getDevModel = () => {
    return axios({
        url: '/dev/model',
        method: 'get'
    })
}
//获取DG内核型号
export const getCoreList = () => {
    return axios({
        url: '/dev/reg/core-model',
        method: 'get'
    })
}

// 查找区域列表
export const findArea = (params) => {
    return axios({
        url: '/comm/prov-city',
        method: 'get',
        params
    })
}

//判断是否存在相同序列号
export const existSerial = (params) => {
    return axios({
        url: '/dev/serial-exist',
        method: 'get',
        params
    })
}

// 新增设备
export const addDev = (data) => {
    return axios({
        url: '/dev/reg/add',
        method: 'post',
        data
    })
}
// 更新设备
export const updDev = (data) => {
    return axios({
        url: '/dev/reg/upd',
        method: 'put',
        data
    })
}
// 删除设备
export const delDev = (params) => {
    return axios({
        url: '/dev/reg/del',
        method: 'delete',
        params
    })
}
// 查询单个设备
export const queryDev = (params) => {
    return axios({
        url: '/dev/reg/query',
        method: 'post',
        params
    })
}

//设备版本号重复检查
export const checkVersion = (params) => {
    return axios({
        url: '/dev/reg/file/check',
        method: 'get',
        params
    })
}

//查询设备文件列表
export const queryDevFileList = (params) => {
    return axios({
        url: '/dev/reg/files',
        method: 'get',
        params
    })
}
//查询设备文件列表
export const uploadSubmit = (data) => {
    return axios({
        url: '/dev/reg/upload',
        method: 'post',
        data
    })
}

//检查版本 /dev/reg/file/check
export const checkName = (params) => {
    return axios({
        url: '/dev/reg/file/check',
        method: 'get',
        params
    })
}
//删除设备文件   /dev/reg/files/del
export const delFiles = (params) => {
    return axios({
        url: '/dev/reg/files/del',
        method: 'delete',
        params
    })
}

/* 
* 自动升级策略模块  start
* ys
* 2019/9/5
*/
//获取自动升级策略列表
export const getUpgradeList = (params) => {
    return axios({
        url: '/strategy/query',
        method: 'get',
        params
    })
}

//新增
export const addUpgrade = (data) => {
    return axios({
        url: '/strategy/add',
        method: 'post',
        data
    })
}
//更新
export const updUpgrade = (data) => {
    return axios({
        url: '/strategy/upd',
        method: 'put',
        data
    })
}
//更新
export const delUpgrade = (params) => {
    return axios({
        url: '/strategy/all/del',
        method: 'delete',
        params
    })
}
//更新
export const updEnable = (params) => {
    return axios({
        url: '/strategy/enable',
        method: 'put',
        params
    })
}
//日志列表
export const logList = (params) => {
    return axios({
        url: '/strategy/log',
        method: 'get',
        params
    })
}
//日志详情列表
export const logDetailList = (params) => {
    return axios({
        url: '/strategy/detail/log',
        method: 'get',
        params
    })
}

/* 
 * 自动升级策略模块 end
 * ys
 * 2019/9/5
 */

/*
 * 管理设备模块 start
 * ys
 * 2019/9/9
 */

//获取管理设备列表
export const getManagerList = (params) => {
    return axios({
        url: '/strategy/query',
        method: 'get',
        params
    })
}
//单个设备查询
export const singleDev = (params) => {
    return axios({
        url: '/dev/reg/query',
        method: 'post',
        params
    })
}
//升级设备
export const upgradeDev = (params) => {
    return axios({
        url: '/dev/reg/upgrade',
        method: 'post',
        params
    })
}
//重启设备
export const restartDev = (params) => {
    return axios({
        url: '/dev/reg/restart',
        method: 'post',
        params
    })
}
//设备状态ssh/web   /dev/reg/remote
export const remote = (params) => {
    return axios({
        url: '/dev/reg/remote',
        method: 'put',
        params
    })
}
/*
 * 管理设备模块 end
 * ys
 * 2019/9/9
 */