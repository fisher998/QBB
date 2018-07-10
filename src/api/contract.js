import fetch from '../common/js/fetch';
// import axios from 'axios';
// import { getToken } from '../common/js/auth';

// 文件上传接口
// export function upload(contract) {
//     const baseURL = '/api/qbb/web';
//     const config = {
//         headers: {
//             'source': 'web',
//             'auth-token': getToken(),
//             'Content-Type': 'multipart/form-data',
//         }
//     }
//     return axios({
//         method: 'post',
//         baseURL: baseURL,
//         url: 'contracts/management/upload',
//         data: {
//             contract
//         },
//         headers: {
//             'auth-token': getToken(),
//             'source': 'web',
//             'Content-Type': 'multipart/form-data',
//         }
//     });
// }


// 合同管理 填写合同文字信息
/* 
cntrt_no            上传完成后返回的合同标识
title               用户填写的合同标题
in_sequence         是否为顺序签署 0：无序签署 1：顺序签署
signers             json格式的数组，内容仅为用户的sn标识 例：[321,323]
expire_time         2010-11-10 00:00:00格式的字符串,不填写时为0
set_email           0:不填写email  1.填写email
email               可选，当set_email为0时默认为空
remark              可选，不填默认为空
*/
export function fillInContactInformation (cntrt_no, title, in_sequence, signers, expire_time, set_email, email, remark) {
    const data = {
        cntrt_no,
        title,
        in_sequence,
        signers,
        expire_time,
        set_email,
        email,
        remark
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/setinfo',
        data
    });
}
// 合同管理-完成坐标信息发起合同签署
/* 
json            json格式的数组，用来传递签署人标识和坐标信息 例：[{"SignerSn":321,"LbX":100,"LbY":100,"RtX":100,"RtY":100,"PageWidth":1000,"PageIndex":5},{"SignerSn":322,"LbX":120,"LbY":120,"RtX":120,"RtY":120,"PageWidth":1000,"PageIndex":4}]
cntrt_no        合同对外标识
*/
export function setCoordinate (json, cntrt_no) {
    const params = {
        json,
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/start',
        params
    });
}
// 合同管理-获取审核通过图章列表
export function getStampsByCheckPass() {
    return fetch({
        method: 'get',
        url: 'contracts/sign/getsignstamps',
    });
}
// 合同签署-获取文件hash值
/* 
cntrt_no        合同对外的识别编号
stamp_sn        用户用到的签署图章标识
ukey_info       可选（目前），不输入时默认使用最新申请的CA证书
*/
export function getHashByContract(cntrt_no, stamp_sn) {
    const params = {
        cntrt_no,
        stamp_sn
    };
    return fetch({
        method: 'post',
        url: 'contracts/sign/gethash',
        params
    });
}
// 合同管理-将合同设为草稿
/* 
cntrt_no        合同对外标识
title           可选，用户填写的合同标题
in_sequence     可选，是否为顺序签署 0：无序签署 1：顺序签署
signers         可选，json格式的数组，内容仅为用户的sn标识 例：["321","323"]
expire_time     可选，2010-11-10 00:00:00格式的字符串,不填写时为0
set_email       可选，0:不填写email  1.填写email
email           可选，当set_email为0时默认为空
remark          可选，不填默认为空
*/
export function setDraft(cntrt_no, title, in_sequence, signers, expire_time, set_email, email, remark) {
    const params = {
        cntrt_no,
        title,
        in_sequence,
        signers,
        expire_time,
        set_email,
        email,
        remark
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/setdraft',
        params
    });
}
// 合同管理-获取指定合同信息
/* 
cntrt_no    合同对外的识别编号
*/
export function getContractInformation(cntrt_no) {
    const params = {
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/getone',
        params
    });
}
// 合同管理-查找合同信息
/* 
str     合同名称或者用户姓名
*/
export function searchContractInformation (str) {
    const params = {
        str
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/search',
        params
    });
}
// 合同管理-查找某一类型合同信息
/* 
type            合同类型：1.草稿 2.已过期 3.已完成 4.已撤销 5.待他人签署 6.待我签署 7.最近合同
page_no         页码
page_size       单页数量
*/
export function searchAKindOfContractInformation (type, page_no, page_size) {
    const params = {
        type,
        page_no,
        page_size
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/getonepage',
        params
    });
}
// 合同管理-撤销合同
/* 
cntrt_no    合同对外的识别编号
*/
export function repealContract (cntrt_no) {
    const params = {
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/undo',
        params
    });
}
// 合同管理-删除合同
/* 
cntrt_no        合同对外的识别编号
*/
export function deleteContract(cntrt_no) {
    const params = {
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/delete',
        params
    });
}
// 合同管理-合同存证-在合同详情页面中
/* 
cntrt_no    合同对外的识别编号
*/
export function contractDepositCertificate(cntrt_no) {
    const params = {
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/save',
        params
    });
}
// 扫码签名-二维码信息
/* 
json        json格式的合同信息 例：[{"cntrt_no":123,"title":123,"time":123,"name":"lqh"}, {"cntrt_no":123,"title":123,"time":123,"name":"lqh"}]
stamp_sn    签名所用图章标识
*/
export function getQRCode(json, stamp_sn) {
    const params = {
        json,
        stamp_sn
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/qrCode',
        params
    })
}
// 通知管理-查看通知列表
export function getList () {
    return fetch({
        method: 'get',
        url: 'user/notice/getlist',
    });
}
// 合同签署-发送GDCA签名过的文件hash值
/* 
key             上一步获取的16位随机字符串，用来绑定签名操作
signed_hash     GDCA签名过的文件哈希值
cntrt_no        合同对外的识别编号
*/
export function sendHashAfterSign(key, signed_hash, cntrt_no) {
    const params = {
        key,
        signed_hash,
        cntrt_no
    };
    return fetch({
        method: 'post',
        url: 'contracts/sign/sendsignedcontract',
        params
    });
}
// 通知管理-发起通知-合同详情页中
/* 
ReceiverSn      接收人的标识
Model           要发起通知的类型，详情见下
CntrtNo         合同对外的统一识别编号
Jpush           可选，是否推送 0.不推送，1.推送，默认推送

model:1.给签署人-合同签署开始 2.给签署人-合同撤销 3.给未签署签署人-合同过期 4.给发起人-合同过期 5.给签署人-合同过期 6.给发起人-合同完成 7.给签署人-合同完成
*/
export function sendToRemind(ReceiverSn, Model, CntrtNo, Jpush) {
    const params = {
        ReceiverSn,
        Model,
        CntrtNo,
        Jpush
    };
    return fetch({
        method: 'post',
        url: 'user/notice/send',
        params
    });
}
// export function checkSignStatus() {
//     return fetch({
//         method: 'get',
//         url: 'contracts/management/checksignstatus'
//     });
// }

// 轮询关闭二维码 sign.vue
export function checkFinish (qrcode_id) {
    const params = {
        qrcode_id
    };
    return fetch({
        method: 'post',
        url: 'contracts/qrcode/checkfinish',
        params
    });
}
// 合同管理
/* 
start_date          开始时间
end_date            结束时间
page_no             页码
page_size           页数
*/
export function searchContractByTime(start_date, end_date, page_no, page_size) {
    const params = {
        start_date,
        end_date,
        page_no,
        page_size
    };
    return fetch({
        method: 'post',
        url: 'contracts/management/search/date',
        params
    });
}