import axios from 'axios';
import store from '../../store';
import { getToken, removeToken } from './auth';
// 创建axios实例
const service = axios.create({
    baseURL: 'api/qbb/web',
    timeout: 5000, // 请求超时,
});
service.interceptors.request.use(config => {
    // 请求拦截,检测token
    config.headers['source'] = 'web';
    if (store.getters.token) {
        // 添加请求头
        config.headers['auth-token'] = getToken(); // 为每个请求添加token
    } else {
        config.headers['auth-token'] = '555'; // 没有获取到该值的时候,默认值为555,登录后可以获取到该值
    }
    return config;
}, error => {
    return Promise.reject(error);
});
service.interceptors.response.use(function (res) {
    if (res.data.error && res.data.error === 30008) {
        removeToken();
    }
    return res;
}, function (error) {
    return Promise.reject(error);
});
export default service;