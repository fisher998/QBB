<template>
    <div class="recharge-box">
        <div class="rechage-big-box" v-if="!total_amount">
            <div class="recharge">
                <div class="recharge-title bold"><span></span>购买套餐</div>
                <div class="recharge-main">
                    <div class="c1">
                        账户剩余签署次数:
                        <span>{{ signtimes }}次</span>
                    </div>
                    <div class="c2">
                        充值金额:
                        <el-radio-group v-model="radio">
                            <el-radio-button label="1">10次签名18元</el-radio-button>
                            <el-radio-button label="2">30次签名50元</el-radio-button>
                            <el-radio-button label="3">50次签名88元</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="c5 bold">支付方式:<span></span></div>
                    <div class="c6">
                        <div class="c6-zfb">
                            <label for="zfb">
                                <div class="circle-box">
                                    <input type="radio" id="zfb" name="c6" class="radio" v-model="payment" value='zfb' />
                                    <i class="circle" v-show="!(payment === 'zfb')"></i>
                                    <i class="el-icon-circle-check" v-show="payment === 'zfb'"></i>
                                </div>
                                <div class="c6-zfb-bg"></div>
                                支付宝支付
                            </label>
                        </div>
                        <div class="c6-wx">
                            <label for="wx">
                                <div class="circle-box">
                                    <input type="radio" id="wx" name="c6" class="radio" v-model="payment" value='wx' />
                                    <i class="circle" v-show="!(payment === 'wx')"></i>
                                    <i class="el-icon-circle-check" v-show="payment === 'wx'"></i>
                                </div>
                                <div class="c6-wx-bg"></div>
                                微信支付
                            </label>
                        </div>
                    </div>
                    <div class="c7">
                        <el-button @click="recharge">确定</el-button>
                    </div>
                </div>
            </div>
            <div class="qr-code-box" v-if="wechatQRCode">
                <div class="qr-code">
                    <i class="el-icon-close" @click="close"></i>
                    <p>请扫描下方二维码完成支付</p>
                    <img class="img" :src="wechatQRCode" alt="">
                </div>
            </div>
        </div>
        <RechargeSuccessByAli v-else class="ali" :totalAmount="total_amount" @confirm="confirm"></RechargeSuccessByAli>
    </div>
</template>

<script>
import { payByWechat, payByAli, getStatusByWechat } from '../../api/pay';
import { getHomePageInformation } from '../../api/details';
import RechargeSuccessByAli from './RechargeSuccessByAli';
export default {
    data () {
        return {
            payment: 'zfb',
            radio: '3',
            wechatQRCode: '',
            order_no: '',
            signtimes: '',
            flag: true,
            total_amount: ''
        };
    },
    created () {
        getHomePageInformation().then(res => {
            if (res.data.error === 0) {
                this.signtimes = res.data.data.signtimes;
            }
        }).catch(error => {

        });
        this.total_amount = this.$route.query.total_amount;
    },
    methods: {
        recharge () {
            let _this = this;
            switch (this.payment) {
                case '':
                    _this.$message({
                        message: '请选择支付方式',
                        type: 'warning'
                    });
                    break;
                case 'zfb':
                    const newTab = window.open();
                    payByAli(this.radio).then(res => {
                        const div = document.createElement('div');
                        div.innerHTML = res.data;
                        newTab.document.body.appendChild(div);
                        newTab.document.forms.alipaysubmit.submit();
                    }).catch(error => {

                    });
                    break;
                case 'wx':
                    payByWechat(this.radio).then(res => {
                        if (res.data.error === 0) {
                            this.flag = true;
                            this.wechatQRCode = res.data.data.qrcode_url;
                            this.order_no = res.data.data.order_no;
                            this._getStatusByWechat();
                        }
                    }).catch(error => {

                    });
                    break;
                default:
                    break;
            }
        },
        confirm () {
            this.total_amount = false;
        },
        _getStatusByWechat () {
            if (this.flag) {
                setTimeout(() => {
                    getStatusByWechat(this.order_no).then(res => {
                        if (res.data.data === 1) {
                            this.wechatQRCode = '';
                            this.$message({
                                message: '恭喜您，支付成功',
                                type: 'success'
                            });
                        } else {
                            this._getStatusByWechat();
                        }
                    });
                }, 3000);
            }
        },
        close () {
            this.wechatQRCode = '';
            this.flag = false;
        }
    },
    components: {
        RechargeSuccessByAli
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.recharge-box {
    width: 100%;
    min-height: 400px;
    .ali {
        margin-top: 100px;
    }
    .rechage-big-box {
        width: 100%;
        height: 100%;
        .recharge {
            width: 100%;
            &-title {
                font-size: 14px;
                color: #000000;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                span {
                    width: 3px;
                    height: 14px;
                    background: #3C3C3C;
                    margin-right: 15px;
                }
            }
            &-main {
                height: 400px;
                font-size: 14px;
                color: #666666;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-top: 30px;
                .c1 {
                    span {
                        font-size: 14px;
                        margin-left: 20px;
                        color: #3C3C3C;
                    }
                }
                .c2 {
                    // width: 600px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    // [type="radio"] {
                    //     display: none;
                    // }
                    // div {
                    //     width: 68px;
                    //     height: 30px;
                    //     line-height: 30px;
                    //     text-align: center;
                    //     border: 1px solid #979797;
                    //     border-radius: 5px;
                    // }
                    .el-radio-group {
                        margin-left: 50px;
                        display: flex;
                        justify-content: flex-start;
    
                    }
                }
                .c4 {
                    [type="number"] {
                        width: 405px;
                        height: 30px;
                        text-align: center;
                        outline: none;
                    }
                }
                .c5 {
                    font-size: 14px;
                    color: #000000;
                    span {
                        width: 3px;
                        height: 14px;
                        background: #3C3C3C;
                        margin-right: 15px;
                        float: left;
                    }
                }
                .c6 {
                    width: 100%;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eaeaea;
                    display: flex;
                    justify-content: flex-start;
                    &-zfb {
                        width: 210px;
                        margin-right: 70px;
                        label {
                            width: 100%;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            .circle-box {
                                .circle {
                                    display: flex;
                                    align-items: center;
                                    width: 15px;
                                    height: 15px;
                                    background: #F7F8F8;
                                    border: 1px solid #C1C1C1;
                                    border-radius: 50%;
                                }
                                .el-icon-circle-check {
                                    width: 15px;
                                    height: 15px;
                                    transform: scale(1.3);
                                    color: #10C786;
                                }
                                input {
                                    display: none;
                                }
                            }
                            .c6-zfb-bg {
                                width: 45px;
                                height: 45px;
                                background: url(../../images/zfb.svg) center center no-repeat;
                            }
                        }
                    }
                    &-wx {
                        width: 210px;
                        label {
                            width: 100%;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            .circle-box {
                                display: flex;
                                align-items: center;
                                .circle {
                                    width: 15px;
                                    height: 15px;
                                    background: #F7F8F8;
                                    border: 1px solid #C1C1C1;
                                    border-radius: 50%;
                                }
                                .el-icon-circle-check {
                                    width: 15px;
                                    height: 15px;
                                    transform: scale(1.3);
                                    color: #10C786;
                                }
                                input {
                                    display: none;
                                }
                            }
                            .c6-wx-bg {
                                width: 45px;
                                height: 45px;
                                background: url(../../images/wx.svg) center center no-repeat;
                            }
                        }
                    }
                }
                .c7 {
                    button {
                        width: 160px;
                        height: 45px;
                        outline: none;
                        background: #10C786;
                        color: #fff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
        .qr-code-box {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.46);
            display: flex;
            justify-content: center;
            align-items: center;
            .qr-code {
                width: 300px;
                height: 300px;
                background: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                p {
                    width: 100%;
                    font-size: 14px;
                    color: #666666;
                    text-align: center;
                    margin-top: 30px;
                }
                .img {
                    width: 200px;
                    height: 200px;
                    margin: 15px auto 0 auto;
                }
                .el-icon-close {
                    transform: scale(1.5);
                    position: absolute;
                    right: 8px;
                    top: 8px;
    
                }
            }
        }
    }
}
</style>
