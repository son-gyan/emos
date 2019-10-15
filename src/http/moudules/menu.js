import axios from '../axios'

// 查找导航菜单树
export const findNavTree = () => {
    return axios({
        url: '/login/menu',
        method: 'get'
    })
}