<template>
    <div class="box">
        <div class="registered-successfully">
            <div class="registered-top">
                <i class="el-icon-circle-check" v-show="back !== '1'"></i>
                <p class="congratulation">{{ back === '1' ? '绑定或申请CA证书' : '恭喜，您已完成账号注册' }}</p>
                <div class="hint-box">
                    <p class="hint">您需要持有CA证书，才可以使用电子签名功能</p>
                    <p class="hint">您是否持有CA证书？目前支持U KEY形式的CA证书绑定</p>
                </div>
            </div>
            <div class="registered-center">
                <div class="registered-center-left">
                    <div class="registered-center-left-bg"></div>
                    <!-- 有证书按钮 -->
                    <button class="registered-center-left-btn" @click="binding"></button>
                    <!-- <el-button type="success" class="registered-center-left-btn">成功按钮</el-button> -->
                </div>
                <div class="registered-center-right">
                    <div class="registered-center-right-bg"></div>
                    <!-- 无证书按钮 -->
                    <button class="registered-center-right-btn" @click="application"></button>
                </div>
            </div>
            <div class="registered-bottom">
                <p class="registered-bottom-first" @click="toDetailsPage">跳过认证，直接进入主页</p>
                <el-tooltip placement="top">
                    <div slot="content">CA证书是由CA（Certification Authority）机构发布的数字证书。CA证书是能提供在 Internet 上
                        <br/>进行身份验证的一种权威性电子文档，人们可以在互联网交往中用它来证明自己的身份和识别对方<br/>的身份。</div>
                    <el-button class="registered-bottom-second">什么是CA证书?</el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import { getAccountInformation } from '../../api/details';
export default {
    data () {
        return {
            back: '0'
        };
    },
    created () {
        this.back = this.$route.query.back;
        console.log(this.back)
    },
    methods: {
        binding () {
            this.$router.push({
                path: '/bind-certificate/bind'
            });
        },
        application () {
            getAccountInformation().then(res => {
                if (res.data.data.account_type === 1) {
                    this.$router.push({
                        path: '/application-certificate/choose-the-type'
                    });
                } else {
                    window.open('https://wt.szca.net/index', '_blank');
                }
            })
        },
        toDetailsPage () {
            this.$router.push({
                path: '/details'
            })
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index.less';
.box {
    height: 750px;
    display: flex;
    justify-content: center;
    align-items: center;
    .registered-successfully {
        width: 460px;
        height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .registered-top {
            width: 100%;
            height: 160px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            .el-icon-circle-check {
                transform: scale(3.8);
                color: #10C786;
            }
            .congratulation {
                font-size: 30px;
                color: #252525;
                letter-spacing: 0;
            }
            .hint-box {
                width: 100%;
                font-size: 16px;
                color: #8E8E8E;
                letter-spacing: 0;
            }
            .hint {
                height: 24px;
                line-height: 24px;
                letter-spacing: 1px;
                text-align: center;
            }
        }
        .registered-center {
            width: 100%;
            height: 270px;
            display: flex;
            justify-content: space-between;
            &-left, &-right {
                width: 200px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;
                border: 1px solid #DCDCDC;
                &-bg {
                    width: 94px;
                    height: 100px;
                    margin-top: 30px;
                }
                &-btn {
                    margin-bottom: 30px;
                    cursor: pointer;
                }
            }
            &-left-bg {
                background: url(../../images/haveCAH1.svg) center center no-repeat;
            }
            &-left-btn, &-right-btn {
                background: #fff;
                width: 120px;
                height: 32px;
                outline: none;
                border: 1px solid #10C786;
                border-radius: 4px;
                color: #10C786;
            }
            &-left-btn::after {
                content: '我已有CA证书'
            }
            &-left:hover {
                border: 1px solid #10C786;
                .registered-center-left-bg {
                    background: url(../../images/haveCAH2.svg) center center no-repeat;
                }
                .registered-center-left-btn {
                    background: #10C786;
                    color: #fff;
                }
                .registered-center-left-btn::after {
                    content: '开始绑定'
                }
            }
            &-right-bg {
                background: url(../../images/noCAH1.svg) center center no-repeat;
            }
            &-right-btn::after {
                content: '我没有CA证书'
            }
            &-right:hover {
                border: 1px solid @color-main;
                .registered-center-right-bg {
                    background: url(../../images/noCAH2.svg) center center no-repeat;
                }
                .registered-center-right-btn {
                    background: @color-main;
                    color: #fff;
                }
                .registered-center-right-btn::after {
                    content: '认证申请'
                }
            }
        }
        .registered-bottom {
            font-size: 16px;
            &-first, &-second {
                height: 24px;
                line-height: 24px;
                text-align: center;
            }
            &-first {
                color: #10C786;
                margin-bottom: 14px;
                cursor: pointer;
            }
            &-second {
                width: 100%;
                color: #B8B8B8;
                border: none;
                text-align: center;
                &:hover {
                    background: #ffffff;
                }
            }
        }
    }
}
</style>
