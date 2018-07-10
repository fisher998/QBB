<template>
    <div class="management-box">
        <div class="management">
            <div class="management-title bold"><span></span>证书管理</div>
            <div class="management-content">
                <div class="management-content-left">
                    <el-tabs v-if="account_type === 1" v-model="activeName" type="border-card" @tab-click="handleClick" :stretch="false">
                        <el-tab-pane label="U-KEY" name="2">
                            <div class="ukey-box">
                                <div class="ukey-bg"></div>
                                <p class="ukey-txt">U-KEY</p>
                                <div class="ukey-btn-box">
                                    <div class="ukey-btn" v-if="ca_type === 2">
                                        <div class="btn-top">
                                            <el-button type="text">更换U-KEY</el-button>
                                            <el-button type="text">修改PIN码</el-button>
                                        </div>
                                        <div class="btn-bottom">
                                            <el-button type="text">补办U-KEY</el-button>
                                            <el-button type="text">证书解锁</el-button>
                                        </div>
                                    </div>
                                    <el-button v-if="ca_type !== 2" type="warning" @click="bindCertificate">去绑定</el-button>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="手机盾" name="1">
                            <div class="eid-box">
                                <div class="eid-bg"></div>
                                <p class="eid-txt">手机盾</p>
                                <div class="eid-btn">
                                    <p v-if="account_type === 1 && ca_type === 1" class="eid-btn-txt">请在签宝宝app上进行管理</p>
                                    <el-button v-if="account_type === 1 && (ca_type === 0 || ca_type === 2)" type="warning" @click="bindingEid">去申请</el-button>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <div v-else class="ukey-box1">
                        <div class="ukey-bg"></div>
                        <p class="ukey-txt">U-KEY</p>
                        <div class="ukey-btn-box">
                            <div class="ukey-btn" v-if="ca_type === 2">
                                <div class="btn-top">
                                    <el-button type="text">更换U-KEY</el-button>
                                    <el-button type="text">修改PIN码</el-button>
                                </div>
                                <div class="btn-bottom">
                                    <el-button type="text">补办U-KEY</el-button>
                                    <el-button type="text">证书解锁</el-button>
                                </div>
                            </div>
                            <el-button v-if="ca_type !== 2" type="warning" @click="bindCertificate">去绑定</el-button>
                        </div>
                    </div>
                </div>
                <div class="management-content-right">
                    <table class="table">
                        <tr>
                            <td><div>颁发给</div></td>
                            <td><div>{{ management.user_name || '无' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>颁发者</div></td>
                            <td><div>{{ management.issuer || '无' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>证书编号</div></td>
                            <td><div>{{ management.ca_no || '--' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>序列号</div></td>
                            <td><div>{{ management.original_ca_no || '无' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>有效期</div></td>
                            <td><div>{{ management.validity_period || '无' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>付费方</div></td>
                            <td><div>{{ management.pay_user || '无' }}</div></td>
                        </tr>
                        <tr>
                            <td><div>DN</div></td>
                            <td><div>{{ management.dn || '暂时无法查看' }}</div></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCAInfo } from '../../api/details';
import { getHomePageInformation } from '../../api/details';
export default {
    data () {
        return {
            management: {},
            activeName: '2',
            account_type: '',
            ca_type: ''
        };
    },
    created () {
        getHomePageInformation().then(res => {
            console.log(res)
            this.ca_type = res.data.data.ca_type;
        })
        this.$store.dispatch('getAccountInformation').then(res => {
            this.account_type = this.$store.getters.account_type;
            if (this.account_type === 2) {
                this.activeName = 2;
            }
            getCAInfo(this.activeName).then(res => {
                this.management = res.data.data || {};
            }).catch(error => {

            });
        })
    },
    methods: {
        bindCertificate () {
            this.$router.push({
                path: '/bind-certificate/bind'
            });
        },
        bindingEid () {
            this.$router.push({
                path: '/application-certificate/choose-the-type'
            });
            /* this.$router.push({
                path: '/application-certificate/eid-attestation'
            }); */
        },
        handleClick () {
            console.log(this.activeName)
            getCAInfo(this.activeName).then(res => {
                console.log(res)
                this.management = res.data.data || {};
                console.log(this.management)
            }).catch(error => {

            });
        },
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.management-box {
    width: 100%;
    .management {
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
        .management-content {
            width: 1100px;
            height: 360px;
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .management-content-left {
                width: 190px;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                .ukey-box1 {
                    width: 100%;
                    height: 322px;
                    box-shadow: 0 0px 0px 1px #e8e8e8;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    .ukey-bg {
                        width: 100%;
                        height: 135px;
                        background: url(../../images/u-key.svg) center bottom no-repeat;
                    }
                    .ukey-txt {
                        font-size: 16px;
                        color: #3C3C3C;
                        font-weight: bold;
                    }
                    .ukey-btn-box {
                        width: 100%;
                        height: 100px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .el-button {
                            width: 120px;
                            height: 40px;
                        }
                        .ukey-btn {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            .btn-top {
                                width: 100%;
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                .el-button {
                                    font-size: 12px;
                                }
                            }
                            .btn-bottom {
                                width: 100%;
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                .el-button {
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
                .el-tabs--border-card {
                    box-shadow: 0 0px 0px 1px #e8e8e8;
                }
                .el-tabs {
                    width: 100%;
                    height: 100%;
                    /deep/.el-tabs__nav {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                    }
                    /deep/.el-tabs__item {
                        width: 50%;
                        text-align: center;
                    }
                    .ukey-box {
                        width: 100%;
                        height: 290px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        .ukey-bg {
                            width: 100%;
                            height: 135px;
                            background: url(../../images/u-key.svg) center bottom no-repeat;
                        }
                        .ukey-txt {
                            font-size: 16px;
                            color: #3C3C3C;
                            font-weight: bold;
                        }
                        .ukey-btn-box {
                            width: 100%;
                            height: 100px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: flex-end;
                            .el-button {
                                width: 120px;
                                height: 40px;
                            }
                            .ukey-btn {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-around;
                                .btn-top {
                                    width: 100%;
                                    display: flex;
                                    justify-content: space-around;
                                    align-items: center;
                                    .el-button {
                                        font-size: 12px;
                                    }
                                }
                                .btn-bottom {
                                    width: 100%;
                                    display: flex;
                                    justify-content: space-around;
                                    align-items: center;
                                    .el-button {
                                        font-size: 12px;
                                    }
                                }
                            }
                        }
                    }
                    .eid-box {
                        width: 100%;
                        height: 290px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        .eid-bg {
                            width: 100%;
                            height: 135px;
                            background: url(../../images/eid.svg) center bottom no-repeat;
                        }
                        .eid-txt {
                            margin-top: 10px;
                            font-size: 16px;
                            color: #3C3C3C;
                            font-weight: bold;
                        }
                        .eid-btn {
                            width: 100%;
                            height: 100px;
                            font-size: 12px;
                            color: #d8d8d8;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-end;
                            .eid-btn-txt {
                                margin-bottom: 10px;
                            }
                        }
                    }
                }
            }
            .management-content-right {
                width: 880px;
                height: 322px;
                .table {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #E8E8E8;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    tr {
                        width: 100%;
                        height: 100%;
                        td:nth-of-type(1) {
                            background: #FAFAFA;
                            height: 100%;
                            div {
                                width: 120px;
                                height: 100%;
                                line-height: 45px;
                                text-align: center;
                                font-size: 14px;
                                color: #252525;
                                font-weight: bold;
                            }
                        }
                        td:nth-of-type(2) {
                            width: 100%;
                            height: 100%;
                            line-height: 45px;
                            div  {
                                width: 100%;
                                height: 100%;
                                padding-left: 40px;
                                font-size: 14px;
                                color: #595959;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
