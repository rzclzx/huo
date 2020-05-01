/**
 * 设置axios参数和拦截器
 */
import Vue from 'vue'
import iView from 'iview'
import axios from 'axios'
import { getText } from '__util/i18n-setup'
import Cookies from 'js-cookie';
// console.log(getText('关闭'))
const http = axios.create({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    requestId:String(Math.random()).replace('0.',''),
    withCredentials: true
})

const defaultURL = ''
let defaulHeader = {}

// 获取token
export const refresh = (token) => {
    if (!token) {
        defaulHeader = {}
    } else {
        defaulHeader = {
            token: token
        }
    }
    defaulHeader.requestId = String(Math.random()).replace('0.','')
}
// 从Cookies里拿出token
refresh(Cookies.get('token'))

// 环境判断
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
// 系统对应的域名
const baseURL = {
    mgt: env === 'dev' ? '//dev.jp-mgt.com:9091/v1' : '',
    uc: ''
}

// 发送请求
function send (option) {
    if (!option || !option.method || !option.url) {
        console.error('缺少axios请求配置（method、url、system）')
        return
    }
    let url = option.path ? pathReplace(option) : option.url
    // http.defaults.baseURL = option.system ? baseURL[option.system] : defaultURL
    // switch (option.method) {
    //     case 'get':
    //         return http.get(option.url)
    //     case 'post':
    //         return http.post(option.url, option.data || {})
    //     case 'put':
    //         return http.put(option.url, option.data || {})
    //     case 'delete':
    //         return http.delete(option.url)
    //     default:
    //         console.error('不支持的请求类型：' + option.method)
    //         return http
    // }
    return http({
        url: url,
        method: option.method,
        headers: option.headers ? {...defaulHeader, ...option.headers} : defaulHeader,
        params: option.params || {},
        data: option.data || {}
    })
}

// 处理url上的变量path
function pathReplace (option) {
    let url = option.url
    for (let i in option.path) {
		url = url.replace(new RegExp('\{(' + i + ')\}', 'ig'), option.path[i])
	}
    return url
}

export function initAxios () {
    http.defaults.baseURL = defaultURL
    Vue.prototype.$axios = send
}

// 请求拦截器
http.interceptors.request.use(function(config){
    // 在请求发出之前进行一些操作
    console.log(
        '%c 请求地址: ','background:#333;color:#bada55',
        config.baseURL + config.url,
        '   method:' + config.method,
        '   data:', config.data
    )
    return config;
},function(err){
    // Do something with request error
    return Promise.reject(err);
});
// 响应拦截器
http.interceptors.response.use(function(res){
    // 在这里对返回的数据进行处理
    if(env === 'dev') {
        if ( res.status === 200) {
            console.log(
                '%c 响应: ' + 'status ' + res.status, 'background:#333;color:#bada55',
                '   data:', res.data
            )
        } else {
            console.log(
                '%c 响应: ' + 'status ' + res.status, 'background:#d8ddf1;color:#ec1b1b',
                '   data:', res.data
            )
        }
    }

    if (res.data.code === 'MGT00000') {
        return res.data
    } else {
        const config = {
            title: getText('错误'),
            content: res.data.code + ': ' + getText(`errorCode['${res.data.code}']`),
        };
        if (res.data.code === 'MGT00136') {
            // 首次登陆,修改密码
            return res.data
        }
        if (res.data.code === 'MGT00135') {
            // 首次登陆，绑定ga
            return res.data
        }
        if (res.data.code === 'MGT00019') {
            // 如果token过期则跳到登陆页面
            config.onOk = () =>{
                Cookies.remove('user')
                localStorage.userData = null
                Cookies.remove('token');
                refresh()
                window.location.href = '/';
            }
        }
        setTimeout(()=>{
            iView.Modal.error(config);
        }, 300)
        return Promise.reject(res.data.code);
    }
},function(err){
    // Do something with response error
    setTimeout(()=> {
        iView.Modal.error({
            title: getText('错误'),
            content: getText('连接服务失败')
        })
    },300);
    return Promise.reject(err);
})
