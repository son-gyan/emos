import axios from '../axios'

// 查找导航菜单树
export const login = (params) => {
    return axios({
        url: '/login',
        method: 'post',
        params
    })
}
export const logout = (params) => {
    return axios({
        url: '/logout',
        method: 'get'
    })
}
// 传token
export const postToken = () => {
    return axios({
        url: '/api/token',
        method: 'post'
    })
}