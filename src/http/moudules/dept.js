import axios from '../axios'

// 查找导航菜单树
export const findPage = (params) => {
    return axios({
        url: '/org/queryShopList',
        method: 'get',
        params
    })
}

//获取树形菜单
export const getTree = () => {
    return axios({
        url: '/org/query/all',
        method: 'get'
    })
}
//删除门店
export const delShop = (params) => {
    return axios({
        url: '/org/del',
        method: 'DElETE',
        params
    })
}
//批量删除门店
export const delAllShop = (params) => {
    return axios({
        url: '/org/del/all',
        method: 'DElETE',
        params
    })
}
//新建门店
export const addShop = (data) => {
    return axios({
        url: '/org/add',
        method: 'post',
        data
    })
}
//更新组织架构
export const updataShop = (data) => {
    return axios({
        url: '/org/upd',
        method: 'put',
        data
    })
}
//编辑当前节点
export const shopDetail = (params) => {
    return axios({
        url: '/org/query/shop',
        method: 'get',
        params
    })
}
//组织架构是否启用
export const updEnable = (params) => {
    return axios({
        url: '/org/upd/enable',
        method: 'put',
        params
    })
}