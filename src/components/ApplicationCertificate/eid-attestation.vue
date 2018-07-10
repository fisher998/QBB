<template>
    <div class="eid-box">
        <div class="eid">
            <div class="eid-left">
                <div class="eid-left-top">
                    <p>通过手机认证</p>
                    <p>(请使用有NFC功能的安卓手机并下载app进行认证)</p>
                </div>
                <div class="eid-left-center">
                    <div class="eid-left-center-l">
                        <img src="http://zbb-qrcode.oss-cn-beijing.aliyuncs.com/XuWKlnCWp5NoTxxuIL2E7u7ay4.png" alt="签宝宝二维码" class="eid-left-center-l-t">
                        <p class="eid-left-center-l-b">扫码下载“签宝宝”</p>
                    </div>
                    <div class="eid-left-center-m"></div>
                    <div class="eid-left-center-r">
                        <div class="eid-left-center-r-t"></div>
                        <div class="eid-left-center-r-b">
                            <p>下载后登陆账号</p>
                            <p>eID认证</p>
                        </div>
                    </div>
                </div>
                <div class="eid-left-bottom">
                    <button class="eid-right-bottom-btn" @click="FinishEid">我已认证完成</button>
                </div>
            </div>
            <div class="eid-right">
                <div class="eid-right-top">
                    <p>通过PC认证</p>
                    <p>(通过eID专用读卡器进行认证)</p>
                </div>
                <div class="eid-right-center">
                    
                </div>
                <div class="eid-right-bottom">
                    <button  class="eid-right-bottom-btn" @click="eidStart">开始认证</button>
                </div>
            </div>
        </div>
        <eid-attestation-start @show="eidStartShow" v-show="isShow" ref="attestationStart"></eid-attestation-start>
    </div>
</template>

<script>
import EidAttestationStart from './eid-attestation-start';
import { getHomePageInformation } from '../../api/details';
export default {
    components : {
        EidAttestationStart
    },
    data () {
        return {
            isShow: false,
            eid_vercify: ''
        }
    },
    methods: {
        eidStartShow: function () {
            this.isShow = false;
        },
        eidStart () {
            this.$alert('这是一段内容', '标题名称', {
            confirmButtonText: '确定',
                callback: action => {
                    this.isShow = true;
                    this.$refs['attestationStart'].resetClick();
                }
            });

            this.$confirm('为保证认证效果请在IE10以上浏览器中打开, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isShow = true;
                this.$refs['attestationStart'].resetClick();
            }).catch(() => {
                        
            });
        },
        FinishEid () {
            getHomePageInformation().then(res => {
                if (res.data.error === 0) {
                    let data = res.data.data;
                    this.eid_vercify = data.eid_vercify;
                    if (data.eid_vercify === 1) {
                        this.$router.push({
                            path: '/details'
                        });
                    } else {
                        this.$message({
                            message: '您尚未完成身份认证',
                            type: 'warning'
                        });
                    }
                }
            }).catch(error => {

            });
        }
    },
};
</script>

<style lang="less" scoped>
.eid-box {
    width: 100%;
    height: 488px;
    .eid {
        width: 1090px;
        height: 488px;
        margin: 30px auto;
        display: flex;
        justify-content: space-between;
        &-left, &-right {
            width: 530px;
            height: 488px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            border: 1px solid #DCDCDC;
            border-radius: 4px;
            &-top {
                font-size: 18px;
                color: #252525;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                & :first-child {
                    height: 27px;
                    line-height: 27px;
                    margin: 0 auto;
                }
                & :last-child {
                    font-size: 14px;
                    height: 21px;
                    line-height: 21px;
                    color: #999999;
                }
            }
            &-bottom {
                display: flex;
                justify-content: center;
                &-btn {
                    width: 120px;
                    height: 32px;
                    border: 1px solid #10C786;
                    border-radius: 3px;
                    color: #10C786;
                    background-color: #fff;
                    outline: none;
                    cursor: pointer;
                }
            }
        }
        &-left {
            &-center {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: top;
                &-l {
                    width: 159px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    &-t {
                        width: 159px;
                        height: 159px;
                        margin-bottom: 10px;
                    }
                }
                &-m {
                    width: 1px;
                    height: 159px;
                    margin: 0 30px;
                    background: #DCDCDC;
                }
                &-r {
                    width: 213px;
                    // height: 159px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    // 右侧背景图
                    &-t {
                        width: 213px;
                        height: 159px;
                        margin-bottom: 10px;
                        background: url(../../images/tel.svg) center center no-repeat;
                    }
                    &-b {
                        display: flex;
                        width: 213px;
                        justify-content: space-between;
                        p {
                            width: 91px;
                            text-align: center;
                        }
                    }
                }
            }
        }
        &-right {
            &-center {
                width: 100%;
                height: 195px;
                background: url(../../images/pc.svg) center center no-repeat;
            }
        }
        &-right:hover {
            .eid-right-top {
                p {
                    color: #10C786;
                }
            }
            border: 1px solid #10C786;
            .eid-left-center-r-t {
                background-image: url(../../images/telH.svg)
            }
            .eid-right-center {
                background-image: url(../../images/pcH.svg)
            }
            .eid-left-bottom-btn, .eid-right-bottom-btn {
                background: #10C786;
                color: #fff;
            }
        }
        &-left:hover {
            .eid-left-top {
                p {
                    color: #10C786;
                }
            }
            border: 1px solid #10C786;
            .eid-left-center-r-t {
                background-image: url(../../images/telH.svg)
            }
            .eid-right-center {
                background-image: url(../../images/pcH.svg)
            }
            .eid-left-bottom-btn, .eid-right-bottom-btn {
                background: #10C786;
                color: #fff;
            }
        }
    }
}
</style>
