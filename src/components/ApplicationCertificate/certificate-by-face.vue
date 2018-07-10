<template>
    <div class="face">
        <div class="face-top">
            <p class="face-top-title">身份认证</p>
            <p class="face-top-remind">使用app人脸识别</p>
        </div>
        <div class="face-center">
            <div class="face-center-top">扫描二维码，下载"签宝宝app"</div>
            <div class="face-center-center">
                <div class="center-left">
                    <img class="qr-code" src="http://zbb-qrcode.oss-cn-beijing.aliyuncs.com/XuWKlnCWp5NoTxxuIL2E7u7ay4.png" alt="">
                </div>
                <div class="center-center"></div>
                <div class="center-right"></div>
            </div>
            <div class="face-center-bottom">在app中使用您的账号登录后，选择使用人脸识别的方式进行实名认证</div>
        </div>
        <div class="face-bottom">
            <button class="btn" @click="enterDetails"></button>
        </div>
    </div>
</template>

<script>
import { getHomePageInformation } from '../../api/details';
export default {
    data () {
        return {
            eid_vercify: ''
        }
    },
    methods: {
        enterDetails () {
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
    }
}
</script>

<style lang="less" scoped>
.face {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .face-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        .face-top-title {
            margin-top: 50px;
            font-size: 30px;
            font-weight: bold;
            color: #252525;
        }
        .face-top-remind {
            font-size: 16px;
            color: #8E8E8E;
            margin-top: 10px;
        }
    }
    .face-center {
        width: 1000px;
        height: 488px;
        margin-top: 35px;
        border: 1px solid #DCDCDC;
        border-radius: 4px;
        padding: 50px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .face-center-top {
            font-size: 16px;
            color: #000000;
            font-weight: bold;
        }
        .face-center-center {
            width: 100%;
            height: 300px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .center-left {
                width: 350px;
                height: 244px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .qr-code {
                    width: 244px;
                    height: 244px
                }
            }
            .center-center {
                width: 1px;
                height: 200px;
                background: #DCDCDC;
            }
            .center-right {
                width: 350px;
                height: 244px;
                background: url(../../images/face.png) left center no-repeat;
            }
        }
        .face-center-bottom {
            font-size: 14px;
            color: #8E8E8E;
        }
    }
    .face-bottom {
        margin-top: 25px;
        .btn {
            width: 120px;
            height: 32px;
            border: 1px solid #10C786;
            outline: none;
            cursor: pointer;
            background: #ffffff;
            color: #10C786;
            border-radius: 4px;
            &::after {
                content: '我已认证完成'
            }
            &:hover {
                background: #10C786;
                color: #ffffff;
                &::after {
                    content: '进入主页';
                }
            }
        }
    }
}
</style>
