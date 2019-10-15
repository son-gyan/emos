/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

 // 后台管理系统服务器地址
//export const baseUrl = 'http://139.196.87.48:8001'
let urlPath = "",
    flag = true;
if(flag){
    urlPath = '/api'
}else{
    //urlPath = 'http://192.168.102.205:8779/api/'
    urlPath = process.env.BASE_URL
}
 export const baseUrl = urlPath
 //export const baseUrl = '/api'
 //export const baseUrl = 'http://192.168.102.205:8800/api/'
 //export const baseUrl = 'http://192.168.102.205:8762/api/'
 //export const baseUrl = 'http://192.168.102.205:8779/api/'
 // 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://139.196.87.48:8002'
// export const backupBaseUrl = 'http://localhost:8002'

export default {
    baseUrl,
    backupBaseUrl
}