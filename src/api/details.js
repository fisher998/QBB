import fetch from '../common/js/fetch';
import CryptoJS from 'crypto-js';
// 获取首页信息
export function getHomePageInformation () {
    return fetch({
        method: 'get',
        url: 'user/gethomepage'
    });
}
// 账号管理-获取账号信息
export function getAccountInformation () {
    return fetch({
        method: 'get',
        url: 'user/account/info'
    });
}
// 账号管理-获取图章列表
export function getStampLists (type) {
    return fetch({
        method: 'get',
        url: `user/account/stamp/getlist/${type}`

    });
}
// 用户账号管理-添加印章
/* 
stamp_url   印章在服务器上的key(阿里云返回给前端的图章路径)，由前端自行上传阿里云，将文件存储于阿里云上的key返回给服务器保存
*/
export function addStamp (stamp_url) {
    const params = {
        stamp_url
    };
    return fetch({
        method: 'post',
        url: 'user/account/stamp/add',
        params
    });
}
// 用户账号管理-删除印章
/* 
stamp_id    印章的id
*/
export function deleteStamp (stamp_id) {
    const params = {
        stamp_id
    };
    return fetch({
        method: 'post',
        url: 'user/account/stamp/delete',
        params
    });
}
// 用户账号管理-获取联系人列表
/* 
type            联系人列表是否分页，分页：1 不分页：2
page_size       页面显示数量大小
page_no         页码
*/
export function getContacts (type, page_size, page_no) {
    const params = {
        type,
        page_size,
        page_no
    }
    return fetch({
        method: 'post',
        url: 'user/account/contacts/getlist',
        params
    });
}
// 用户账号管理-添加联系人
/* 
mobile      联系人手机号
*/
export function addContact (mobile) {
    const params = {
        mobile
    };
    return fetch({
        method: 'post',
        url: 'user/account/contacts/add',
        params
    });
}
// 用户账号管理-删除联系人
/* 
ctt_id          申请删除的联系人的id
*/
export function deleteContact(ctt_id) {
    const params = {
        ctt_id
    };
    return fetch({
        method: 'post',
        url: 'user/account/contacts/delete',
        params
    });
}
// 用户账号管理-查找联系人
/* 
str     用户输入的手机号或邮箱或姓名
*/
export function searchContact(str) {
    const params = {
        str
    };
    return fetch({
        method: 'post',
        url: 'user/account/contacts/search',
        params
    });
}
// 用户账号管理-修改登录手机号-申请旧手机验证码
export function getNoteCodeByOldMobile () {
    return fetch({
        method: 'get',
        url: 'user/account/oldmobile/text'
    });
}
// 用户账号管理-修改登录手机号-验证旧手机验证码
/* 
code        旧手机验证码
*/
export function sendNoteCodeByOldMobile (code) {
    const params = {
        code
    };
    return fetch({
        method: 'post',
        url: 'user/account/oldmobile/verfication',
        params
    });
}
// 用户账号管理-修改登录手机号-申请新手机验证码
/* 
ukey        验证旧手机验证码成功后返回的16位随机字符串
mobile      设置的新手机号
*/
export function getNoteCodeByNewMobile (ukey, mobile) {
    const params = { 
        ukey,
        mobile
    };
    return fetch({
        method: 'post',
        url: 'user/account/newmobile/set',
        params
    });
}
// 用户账号管理-修改登录手机号-验证新手机验证码
/* 
code        验证新手机验证码
*/
export function sendNoteCodeByNewMobile (code) {
    const params = {
        code
    };
    return fetch({
        method: 'post',
        url: 'user/account/newmobile/verfication',
        params
    })
}
// 用户账号管理-修改登录密码-获取短信验证码
/* 
password    用户旧登录密码
*/
export function getNoteCodeByResetPassword(password) {
    const params = {
        password: CryptoJS.MD5(password).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/account/password/text',
        params
    });
}
// 用户账号管理-修改登录密码-设置新密码
/* 
code            用户旧登录密码
new_password    用户旧登录密码
*/
export function setNewPassword(code, new_password) {
    const params = {
        code: code,
        new_password: CryptoJS.MD5(new_password).toString()
    };
    return fetch({
        method: 'post',
        url: 'user/account/password/modify',
        params
    });
}
// 账号管理-账单管理-获取交易流水列表
/* 
page_size       页面显示数量大小
page_no         页码
*/
export function getExpenditure (page_size, page_no) {
    const params = {
        page_size,
        page_no
    };
    return fetch({
        method: 'post',
        url: 'user/ConsumptionLog/getall',
        params
    });
}
// 账号管理-账单管理-查看某一月份账单列表
/* 
date            查询月份，格式为 2018-2
page_size       页面显示数量大小
page_no         页码
*/
export function getExpenditureByMonth (date, page_size, page_no) {
    const params = {
        date,
        page_size,
        page_no
    };
    return fetch({
        method: 'post',
        url: 'user/ConsumptionLog/getmonth',
        params
    });
}
// 用户账号管理-设置默认图章
/* 
stamp_sn        印章的标识
*/
export function setDefaultStamp(stamp_sn) {
    const params = {
        stamp_sn
    };
    return fetch({
        method: 'post',
        url: 'user/account/stamp/setdefault',
        params
    });
}
// 账号管理-问题反馈-获取问题反馈列表
export function getFeedBack () {
    return fetch({
        method: 'get',
        url: 'user/feedback/getlist'
    });
}
// 账号管理-问题反馈-提交问题反馈
/* 
text    问题描述的文本，最大长度512个字符
imgs    问题描述的图片url，可以为空，最大长度1024个字符
*/
export function sendFeedBack (text, imgs) {
    const params = {
        text,
        imgs
    };
    return fetch({
        method: 'post',
        url: 'user/feedback/add',
        params
    });
}
// 通知管理-查看通知详情
/* 
NoticeSn        通知标识
*/
export function getNoticeMessage(NoticeSn) {
    const params = {
        NoticeSn
    };
    return fetch({
        method: 'post',
        url: 'user/notice/getinfo',
        params
    });
}
// 获取证书信息
/* 
type    1 软证书 2 ukey
*/
export function getCAInfo(type) {
    return fetch({
        method: 'get',
        url: `user/ca/getinfo/${type}`
    });
}
// 通知管理-批量已读
/* 
NoticeSn        json格式的NoticeSn数组
*/
export function readAllNotice(NoticeSn) {
    const params = {
        NoticeSn
    };
    return fetch({
        method: 'post',
        url: 'user/notice/read',
        params
    });
}
// 获取手写签章图片二维码
export function getQrCodeByHandleStamp() {
    return fetch({
        method: 'get',
        url: 'system/get/qrcode/writingboard'
    });
}