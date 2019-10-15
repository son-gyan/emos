import axios from '../axios'

// 查找导航菜单树
export const getIndex = (params) => {
    return axios({
        url: '/index/inform',
        method: 'get',
        params
    })
}