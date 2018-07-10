import fetch from '@/common/js/fetch';
import CryptoJS from 'crypto-js';
// 用户手机号登录
/* 
area_code       地区码（默认中国）+86
mobile          11位用户手机号
password        密文密码 MD5加密
*/
export function adminLogin (mobile, password, area_code) {
    const data = {
        mobile: mobile,
        password: CryptoJS.MD5(password).toString(),
        area_code: area_code
    };
    return fetch({
        method: 'post',
        url: 'user/login',
        data
    });
}
// 退出登录
export function logOut () {
    return fetch({
        method: 'get',
        url: 'user/logout'
    });
}
// 用户找回登录密码-重置密码
/* 
mobile          用户注册手机号
password        用户密码md5加密后的32位字符串
code            手机验证码
*/
export function resetPass(tel) {
    const data = {
        tel: tel
    };
    return fetch({
        method: 'post',
        url: 'user/password/reset',
        data
    })
}
// 我也不知道这是什么了
export function task() {
    return fetch({
        method: 'get',
        url: 'statistic/task'
    })
}
