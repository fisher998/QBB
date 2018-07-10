import fetch from '../common/js/fetch';
// 微信支付
/* 
package_id      选择的套餐id 1.10次签名18元 2.30次签名50元 3.50次签名88元
*/
export function payByWechat (package_id) {
    const params = {
        package_id
    };
    return fetch({
        method: 'post',
        url: 'user/pay/wechat',
        params
    });
}
// 支付宝支付
/* 
package_id      选择的套餐id 1.10次签名18元 2.30次签名50元 3.50次签名88元
*/
export function payByAli (package_id) {
    const params = {
        package_id
    };
    return fetch({
        method: 'post',
        url: 'user/pay/ali',
        params
    });
}
// 查询微信支付订单状态
/* 
order_no    订单编号
*/
export function getStatusByWechat(order_no) {
    const params = {
        order_no
    };
    return fetch({
        method: 'post',
        url: 'user/pay/order/status',
        params
    });
}