import fetch from '../common/js/fetch';
import CryptoJS from 'crypto-js';
// 请求图形验证码
/*
key 用来绑定验证码的标识，必须位16位长度字符串，由客户端设置，直接替换掉路径中的{key}
*/
// export function getGraphCode (key) {
//     return fetch({
//         method: 'get',
//         url: `system/register/graphics/${key}`
//     });
// }
// 发送短信验证码
/* 
key     与申请图片验证码为同一key，绑定验证生成的图片验证码
mobile  用户注册手机号
code    用户输入的图片验证码
*/
export function sendMobileCode (mobile, key, code) {
    const params = {
        mobile,
        key,
        code
    };
    return fetch({
        method: 'post',
        url: 'system/register/text',
        params
    });
}

// 个人注册
/*  
mobile      用户注册手机号
password    用户密码md5加密后的32位字符串
code        手机验证码
*/
export function register (mobile, code, password) {
    const params = {
        mobile,
        code,
        password: CryptoJS.MD5(password).toString()
    };
    return fetch({
        method: 'post',
        url: 'personaluser/register/setpassword',
        params
    });
}
// 企业注册
// 发送手机验证码
/*
mobile  用户注册手机号
code    用户输入的手机验证码
*/
export function verficationMobileCode (mobile, code) {
    const params = {
        mobile,
        code
    };
    return fetch({
        method: 'post',
        url: 'user/register/verfication',
        params
    });
}
// 发送企业注册信息
/*
ukey            上一步返回的16位随机字符串
company_name    企业名称
company_no      企业信用编号
principal_name  负责人姓名
principal_id    负责人身份证号
*/
export function enterpriseInformation (ukey, company_name, company_no, principal_name, principal_id) {
    const params = {
        ukey,
        company_name,
        company_no,
        principal_name,
        principal_id
    };
    return fetch({
        method: 'post',
        url: 'user/register/setcompanyinfo',
        params
    });
}
// 企业注册设置登录密码
/*
ukey        设置企业信息时返回的16位字符串
password    用户密码md5加密后的32位字符串
*/
export function enterprisePassword (ukey, password) {
    const params = {
        ukey,
        password: CryptoJS.MD5(password).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/register/setpassword',
        params
    });
}
// 绑定eid
/*
name            用户姓名
IDcard          用户身份证
eid_user        eid卡中读取
eid_issuser_sn  eid卡中读取
eid_sn          eid卡中读取
data_to_sign    eid卡中读取
eid_signed      eid卡中读取
*/
export function bindingEid(name, IDcard, email, eid_user, eid_issuser_sn, eid_sn, data_to_sign, eid_signed) {
    const params = {
        name,
        IDcard,
        email,
        eid_user,
        eid_issuser_sn,
        eid_sn,
        data_to_sign,
        eid_signed
    };
    return fetch({
        method: 'post',
        url: 'user/ca/eid/vercify',
        params
    });
}
// 申请找回密码时候的短信验证码
/*
key     与申请图片验证码为同一key，绑定验证生成的图片验证码
mobile  用户注册手机号
code    用户输入的图片验证码
*/
export function getResetPasswordNoteCode(mobile, key, code) {
    const params = {
        mobile,
        key,
        code
    };
    return fetch({
        method: 'post',
        url: 'system/resetpassword/text',
        params
    });
}

// 找回登录密码
/*
mobile      用户注册手机号
password    用户密码md5加密后的32位字符串
code        手机验证码
*/
export function resetPassword(mobile, password, code) {
    const params = {
        mobile: mobile,
        password: CryptoJS.MD5(password).toString(),
        code: code
    };
    return fetch({
       method: 'post',
       url: 'user/password/reset',
       params 
    });
}
// 绑定ukey
/* 
cert        ukey中读取的签名证书
version     ukey版本号
*/
export function bindingUkey (cert, version) {
    const params = {
        cert,
        version
    };
    return fetch({
        method: 'post',
        url: 'user/ca/ukey',
        params
    });
}
// 获取ukey列表
export function getUkeyList() {
    return fetch({
        method: 'get',
        url: 'ukey/getlist'
    });
}