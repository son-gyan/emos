import axios from '../axios'

// 查找告警列表
export const findPage = (params) => {
    return axios({
        url: '/alarm/push/findAlarmPushList',
        method: 'get',
        params
    })
}
// 新增告警
export const addAlarm = (data) => {
    return axios({
        url: '/alarm/push/add',
        method: 'post',
        data
    })
}
// 更新告警
export const updAlarm = (data) => {
    return axios({
        url: '/alarm/push/upd',
        method: 'put',
        data
    })
}
// 删除告警
export const delAlarm = (params) => {
    return axios({
        url: '/alarm/push/del/all',
        method: 'delete',
        params
    })
}
// 删除告警
export const updEnable = (params) => {
    return axios({
        url: '/alarm/push/upd/enable',
        method: 'put',
        params
    })
}

//查询告警处理列表
export const getWarnDetail = (params) => {
    return axios({
        url: '/alarm/log/findAlarmLogList',
        method: 'get',
        params
    })
}
//查询告警更新
export const updWarnDetail = (data) => {
    return axios({
        url: '/alarm/log/upd',
        method: 'put',
        data
    })
}

//查询告警处理列表
export const delWarnDetail = (params) => {
    return axios({
        url: '/alarm/log/del/all',
        method: 'delete',
        params
    })
}