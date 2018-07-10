<template>
    <div class="home-page-box">
        <div class="top">
            <div class="top-t">
                <Header class="header"/>
            </div>
        </div>
        <router-view />
        <div class="eid-start-box"  v-show="fourthStepShow">
            <div class="white-board">
                <i class="el-icon-close" @click="close"></i>
                <div class="fourth-step">
                    <i class="el-icon-circle-check"></i>
                    <div class="fourth-step-center">
                        <p class="fourth-step-center-p1">恭喜,证书申请成功</p>
                        <p class="fourth-step-center-p2">你需要下载APP并在手机上设置签署密码</p>
                        <p class="fourth-step-center-p3">才可以使用电子签名功能</p>
                    </div>
                    <div class="fourth-step-bottom">
                        <div class="fourth-step-bottom-ma">
                            <img src="http://zbb-qrcode.oss-cn-beijing.aliyuncs.com/XuWKlnCWp5NoTxxuIL2E7u7ay4.png" alt="扫码下载签宝宝" class="qbb">
                        </div>
                        <p class="fourth-step-bottom-p4">扫码下载“签宝宝”</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './header';
let mark = false;
export default {
    data () {
        return {
            fourthStepShow: false,
            route: ''
        }
    },
    created () {
        this.fourthStepShow = mark;
        this.route = this.$route.path;
        console.log(this.$route.path)
    },
    beforeRouteEnter (to, from ,next) {
        if (from.path === '/application-certificate/eid-attestation' || from.path === '/certificate-by-face') {
            mark = true;
            next();
        } else {
            next();
        }
    },
    methods: {
        close () {
            this.fourthStepShow = false;
        }
    },
    components: {
        Header,
    },
};
</script>

<style lang="less" scoped>
.home-page-box {
    width: 100%;
    .top {
        width: 100%;
        height: 67px;
        .top-t {
            position: fixed;
            background: #fff;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            width: 100%;
            height: 67px;
            box-shadow: 0 0 5px 0 #d5d5d5;
            .header {
                margin: 0 auto;
            }
        }
    }
    // .footer {
    //     position: fixed;
    //     left: 0;
    //     bottom: 0;
    //     right: 0;
    // }
    .eid-start-box {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.7);
        .white-board {
            width: 410px;
            height: 410px;
            background: #fff;
            position: fixed;
            top: 50%;
            margin-top: -205px;
            left: 50%;
            margin-left: -205px;
            z-index: 10;
            .el-icon-close {
                transform: scale(1.7);
                color: #D5D5D5;
                position: absolute;
                top: 15px;
                right: 15px;
                cursor: pointer;
            }
            .fourth-step {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .el-icon-circle-check {
                    transform: scale(4.2);
                    color: #10C786;
                    cursor: pointer;
                }
                &-center {
                    width: 100%;
                    margin: 25px 0 24px 0;
                    p {
                        width: 100%;
                        text-align: center;
                    }
                    &-p1 {
                        font-size: 24px;
                        color: #252525;
                    }
                    &-p2, &-p3 {
                        font-size: 16px;
                        color: #8E8E8E;
                    }
                    &-p2 {
                        margin: 10px 0 6px 0;
                    }
                }
                &-bottom {
                    &-ma {
                        width: 159px;
                        height: 159px;
                        margin-bottom: 10px;
                        .qbb {
                            width: 159px;
                            height: 159px;
                        }
                    }
                    &-p4 {
                        text-align: center;
                    }
                }
            }
        }
    }
}
</style>
