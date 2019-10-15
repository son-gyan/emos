import axios from '../axios'

// 用户日志查询
export const getUserLog = (params) => {
    return axios({
        url: '/user/log/findUserLogList',
        method: 'get',
        params
    })
}
// 设备日志查询
export const getDeviceLog = (params) => {
    return axios({
        url: '/dev/log/findDevLogList',
        method: 'get',
        params
    })
}