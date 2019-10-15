import axios from '../axios'

// 查找角色列表
export const findPage = (params) => {
    return axios({
        url: '/role/queryRoleList',
        method: 'get',
        params
    })
}
// 查找模块列表
export const queryModuleList = (params) => {
    return axios({
        url: '/module/queryModuleList',
        method: 'get'
    })
}
// 角色添加
export const addRole = (data,moduleIds) => {
    return axios({
        url: '/role/add?moduleIds='+moduleIds,
        method: 'post',
        data
    })
}
// 角色更新
export const updRole = (data,moduleIds) => {
    return axios({
        url: '/role/upd?moduleIds='+moduleIds,
        method: 'put',
        data
    })
}
// 角色删除
export const delRole = (params) => {
    return axios({
        url: '/role/del/all',
        method: 'delete',
        params
    })
}
// 查找模块列表
export const findModuleListByRole = (params) => {
    return axios({
        url: '/module/findModuleListByRole',
        method: 'get',
        params
    })
}