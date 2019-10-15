import axios from '../axios'

// 查找用户列表
export const findPage = (params) => {
    return axios({
        url: '/user/queryUserList',
        method: 'get',
        params
    })
}


// 新增
export const addUser = (data,params) => {
    return axios({
        url: '/user/add'+params,
        method: 'post',
        data
    })
}
// 修改
export const updUser = (data,params) => {
    return axios({
        url: '/user/upd'+params,
        method: 'put',
        data
    })
}
// 删除
export const delUser = (params) => {
    return axios({
        url: '/user/del/all',
        method: 'delete',
        params
    })
}
// 更新启用
export const updEnable = (params) => {
    return axios({
        url: '/user/upd/enable',
        method: 'put',
        params
    })
}