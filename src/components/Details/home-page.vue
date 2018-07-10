<template>
    <div class="home-box">
        <div class="home">
            <div class="account-information">
                <div class="in-left">
                    <div class="in-left-box">
                        <div class="in-left-top">
                            <!-- <div class="avatar"></div> -->
                            <!-- <div v-if="!stampUrl" class="avatar"></div> -->
                            <img src="../../images/avatar.png" alt="avatar" class="avatar">
                            <div class="avatar-info">
                                <div class="avatar-info-name">
                                    <div class="avatar-info-name-l">{{ name || '暂未绑定' }}</div>
                                    <button v-if="!ca_issuer" class="avatar-info-name-btn" @click="bandding">去绑定</button>
                                    <div v-else class="avatar-info-name-r">{{ ca_issuer || '未绑定' }}</div>
                                </div>
                                <div class="avatar-info-tel">账号:(+86){{ mobile }}</div>
                            </div>
                        </div>
                        <div class="in-left-bottom">
                            <div class="in-left-bottom-top" @click="recharge">
                                <div class="bold">签名次数:</div>
                                <div class="times bold">{{ signtimes }}</div>
                                <!-- <button class="recharge" @click="recharge">充值</button> -->
                            </div>
                            <div class="in-left-bottom-center"></div>
                            <div class="in-left-bottom-bottom" @click="changeStamp">
                                <div class="sign bold">签名图章: </div>
                                <img v-if="stampUrl" :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stampUrl" alt="" class="sign-stamp" />
                                <img class="sign-stamp1" v-else src="../../images/无图章状态.svg" alt="" />
                                <!-- <div class="sign-stamp">风清扬</div> -->
                                <!-- <button class="change" @click="changeStamp">修改</button> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="in-center">
                    <div class="in-center-top">
                        <div class="in-center-top-l" @click="waitMe">
                            <div class="in-center-top-l-bg"></div>
                            <div class="in-center-top-l-sign">
                                <span>待我签的</span>
                                <span>{{ ca_type === 0 ? '-' : wait_for_me }}</span>
                            </div>
                        </div>
                        <div class="in-center-top-r" @click="waitSb">
                            <div class="in-center-top-r-bg"></div>
                            <div class="in-center-top-r-sign">
                                <span>待他人签署</span>
                                <span>{{ ca_type === 0 ? '-' : wait_for_others }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="in-center-bottom">
                        <div class="in-center-bottom-l" @click="finish">
                            <div class="in-center-bottom-l-bg"></div>
                            <div class="in-center-bottom-l-sign">
                                <span>已完成</span>
                                <span>{{ ca_type === 0 ? '-' : finishNo }}</span>
                            </div>
                        </div>
                        <div class="in-center-bottom-r" @click="draft">
                            <div class="in-center-bottom-r-bg"></div>
                            <div class="in-center-bottom-r-sign">
                                <span>草稿箱</span>
                                <span>{{ ca_type === 0 ? '-' : draftNo }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="in-right">
                    <div class="in-right-box">
                        <div class="in-right-box-top"></div>
                            <!-- 本地项目上传 -->
                            <!-- action="api/contracts/management/upload" -->
                        <el-upload
                            action="api/qbb/web/contracts/management/upload"
                            name="contract"
                            :multiple="false"
                            :limit="1"
                            :headers="headers"
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :on-progress="uploadProgress"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            :disabled="!ca_issuer"
                        >
                            <button class="in-right-box-bottom" @click="beginSign">发起新签名</button>
                        </el-upload>
                    </div>
                </div>
            </div>
        </div>
        <div class="keepout-box" v-show="percentage !==0">
            <div class="keepout">
                <el-progress v-show="percentage !== 0" :percentage="percentage"></el-progress>
            </div>
        </div>
        <home-page-recent-document v-if="recent.length > 0" :recent="recent" @deleteContract="deleteContract"></home-page-recent-document>
        <div v-else class="blank">
            <p class="nofile">暂无签名文件</p>
        </div>
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import Footer from './footer';
import HomePageRecentDocument from './home-page-recent-document';
import { getHomePageInformation } from '../../api/details';
import { getFileExtension } from '../../common/js/feature';
import { upload } from '../../api/contract';
import { getToken } from '../../common/js/auth';
export default {
    data () {
        return {
            headers: {
                'source': 'web',
                'auth-token': getToken(),
            },
            name: '',
            mobile: '',
            stampUrl: '',
            cash: '',
            wait_for_me: '',
            wait_for_others: '',
            finishNo: '',
            draftNo: '',
            ca_issuer: '',
            signtimes: '',
            recent: [],
            percentage: 0,
            ca_type: ''
        };
    },
    components: {
        HomePageRecentDocument,
        Footer
    },
    created () {
        getHomePageInformation().then(res => {
            console.log(res)
            if (res.data.error === 0) {
                this.mobile = this.$store.getters.mobile;
                let data = res.data.data;
                this.stampUrl = data.stamp_url;
                this.cash = data.cash || 0;
                this.wait_for_me = data.wait_for_me || 0;
                this.wait_for_others = data.wait_for_others || 0;
                this.finishNo = data.finish || 0;
                this.draftNo = data.draft || 0;
                this.recent = data.recent || [];
                this.ca_issuer = data.ca_issuer;
                this.name = data.name;
                this.signtimes = data.signtimes;
                this.ca_type = data.ca_type;
            }
        }).catch(error => {

        });
    },
    methods: {
        newSignature () {
            this.$router.push({
                path: '/new-signature'
            });
        },
        recharge () {
            this.$router.push({
                path: '/details/mine-page/recharge'
            });
        },
        changeStamp () {
            this.$router.push({
                path: '/details/mine-page/stamp'
            });
        },
        waitMe () {
            this.$router.push({
                name: 'FilePage',
                params: {
                    idx: '5'
                }
            });
        },
        waitSb () {
            this.$router.push({
                name: 'FilePage',
                params: {
                    idx: '4'
                }
            });
        },
        finish () {
            this.$router.push({
                name: 'FilePage',
                params: {
                    idx: '2'
                }
            });
        },
        draft () {
            this.$router.push({
                name: 'FilePage',
                params: {
                    idx: '0'
                }
            });
        },
        beginSign () {
            if (!this.ca_issuer) {
                this.$confirm('您还未绑定CA证书, 是否去绑定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /* this.$message({
                        type: 'success',
                        message: '删除成功!'
                    }); */
                    this.$router.push({
                        path: '/registered-successfully',
                        query: {
                            back: '1'
                        }
                    })
                }).catch(() => {
                    /* this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });   */        
                });
            }
        },
        bandding () {
            if (!this.ca_issuer) {
                this.$router.push({
                    path: '/registered-successfully',
                    query: {
                        back: '1'
                    }
                });
            }
        },
        uploadProgress (event, file, fileList) {
            this.percentage = Number(event.percent.toFixed(0));
        },
        uploadSuccess (response, file, fileList) {
            this.percentage = 0;
            let fileName = file.name;
            switch (response.error) {
                case 0:
                    let cntrt_no = response.data.cntrt_no;
                    let Doc_key = response.data.Doc_key;
                    let img_key = JSON.stringify(response.data.img_key);
                    this.$router.push({
                        path: '/new-signature',
                        name: 'NewSignature',
                        query:{
                            cntrt_no,
                            Doc_key,
                            img_key,
                            fileName,

                        }
                    })
                    break;
                case 30033:
                    this.$message({
                        message: '草稿箱已满',
                        type: 'warning'
                    })
                default:
                    break;
            }
        },
        uploadError (err, file, fileList) {
        },
        beforeUpload (file) {
            this.url = file.url;
            if (/(doc|docx|txt|jpg|jpeg|png|gif|bmp|pdf)/.test(getFileExtension(file.name))) {
                
            } else {
                this.$message({
                    message: '合同格式不正确',
                    type: 'warning',
                    showClose: true
                })
                return false;
            }
        },
        deleteContract () {
            getHomePageInformation().then(res => {
                if (res.data.error === 0) {
                    this.mobile = this.$store.getters.mobile;
                    let data = res.data.data;
                    this.recent = data.recent || [];
                }
            }).catch(error => {

            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.home-box {
    width: 100%;
    height: 100%;
    .home {
        width: 100%;
        height: 150px;
        margin-bottom: 150px;
        // background: #10C786;
        display: flex;
        justify-content: center;
        background-image: url(../../images/homeBG.png);
        background-size: 100% 150px;
        position: relative;
        .account-information {
            width: 1100px;
            height: 220px;
            background: #fff;
            position: absolute;
            border-radius: 6px;
            top: 40px;
            left: 50%;
            margin-left: -550px;
            box-shadow: 0 12px 25px 0 rgba(218,221,225,0.50);
            display: flex;
            justify-content: space-between;
            align-items: center;
            // 左边盒子
            .in-left {
                width: 300px;
                height: 160px;
                display: flex;
                justify-content: center;
                align-items: center;
                .in-left-box {
                    width: 240px;
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    .in-left-top {
                        width: 100%;
                        height: 63px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .avatar {
                            width: 63px;
                            height: 63px;
                            border-radius: 50%;
                            // border: 1px solid #666666;
                        }
                        .avatar-info {
                            width: 155px;
                            height: 63px;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            align-items: center;
                            .avatar-info-name {
                                width: 100%;
                                height: 22px;
                                padding-top: 2px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding-right: 20px;
                                .avatar-info-name-l {
                                    font-size: 14px;
                                    font-weight: bold;
                                    line-height: 20px;
                                    margin-right: 20px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .avatar-info-name-r {
                                    border: 1px solid #10C786;
                                    background: rgba(16,199,134,0.10);
                                    font-size: 12px;
                                    color: #10C786;
                                    padding: 4px 8px;
                                    border-radius: 14px;
                                }
                                .avatar-info-name-btn {
                                    padding: 3px 10px;
                                    color: #ffffff;
                                    background: #E7555D;
                                    border: none;
                                    outline: none;
                                    font-size: 12px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                }
                            }
                            &-tel {
                                width: 100%;
                                height: 20px;
                                line-height: 20px;
                                font-size: 12px;
                                color: #B8B8B8;
                            }
                        }
                    }
                    .in-left-bottom {
                        width: 100%;
                        height: 65px;
                        font-size: 12px;
                        color: #B8B8B8;
                        padding: 5px 10px;
                        display: flex;
                        // flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        button {
                            outline: none;
                            border: none;
                            border-radius: 4px;
                            width: 59px;
                            height: 28px;
                            font-size: 12px;
                        }
                        &-top {
                            width: 90px;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: left;
                            cursor: pointer;
                            .recharge {
                                background: #F5434D;
                                color: #fff;
                            }
                            .times {
                                font-size: 24px;
                                color: #222222;
                                cursor: pointer;
                            }
                        }
                        &-center {
                            width: 1px;
                            height: 100%;
                            background: #E8E8E8;
                        }
                        &-bottom {
                            width: 100px;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: left;
                            padding-left: 35px;
                            position: relative;
                            cursor: pointer;
                            .sign-stamp {
                                width: 50px;
                                height: 40px;
                                // width: 70px;
                                // height: 28px;
                                // border: 1px solid #d8d8d8;
                                position: absolute;
                                bottom: -10px;
                            }
                            .sign-stamp1 {
                                // position: absolute;
                                // bottom: 10px;
                            }
                            .change {
                                border: 1px solid #666666;
                                background: #fff;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            // 中间盒子
            .in-center {
                width: 500px;
                height: 160px;
                border-left: 1px solid #E8E8E8;
                border-right: 1px solid #E8E8E8;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .in-center-top, .in-center-bottom {
                    width: 335px;
                    height: 55px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    &-l {
                        width: 60%;
                        height: 100%;
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        cursor: pointer;
                        &-bg {
                            width: 50px;
                            height: 100%;
                            margin-right: 20px;
                            background: url(../../images/mine.svg) center bottom no-repeat;
                        }
                        &-sign {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            align-items: left;
                            :first-child {
                                font-size: 12px;
                                color: #B8B8B8;
                            }
                            :last-child {
                                font-size: 24px;
                                font-weight: bold;
                                color: #222222;
                            }
                        }
                    }
                    &-r {
                        width: 40%;
                        height: 100%;
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        cursor: pointer;
                        &-bg {
                            width: 50px;
                            height: 100%;
                            margin-right: 20px;
                            background: url(../../images/he.svg) center bottom no-repeat;
                        }
                        &-sign {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-around;
                            align-items: left;
                            :first-child {
                                font-size: 12px;
                                color: #B8B8B8;
                            }
                            :last-child {
                                font-size: 24px;
                                font-weight: bold;
                                color: #222222;
                            }
                        }
                    }
                }
                .in-center-bottom {
                    &-l {
                        &-bg {
                            background: url(../../images/complete.svg) left center no-repeat;
                        }
                    }
                    &-r {
                        &-bg {
                            background: url(../../images/draft.svg) left center no-repeat;
                        }
                    }
                }
            }
            // 右边盒子
            .in-right {
                width: 300px;
                height: 160px;
                display: flex;
                justify-content: center;
                align-items: center;
                .in-right-box {
                    width: 225px;
                    height: 160px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    &-top {
                        width: 120px;
                        height: 95px;
                        background: url(../../images/contract.svg) center center no-repeat;
                    }
                    &-bottom {
                        width: 100px;
                        height: 32px;
                        font-size: 12px;
                        border: none;
                        outline: none;
                        border-radius: 4px;
                        background: #FFA141;;
                        color: #FFFFFF;
                        border-radius: 100px;
                        box-shadow: 0 2px 5px 0 rgba(255,161,65,0.36);
                        cursor: pointer;
                    }
                }
            }
            
        }
    }
    .keepout-box {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.46);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
        .keepout {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/.el-progress {
                transform: scale(2);
                width: 200px;
                height: 30px;
                .el-progress__text {
                    color: #fff;
                }
            }
        }
    }
    .blank {
        width: 100%;
        height: 440px;
        background-image: url(../../images/无文件状态.svg);
        background-repeat: no-repeat;
        background-position: center 80px;
        position: relative;
        .nofile {
            width: 100px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            font-size: 14px;
            color: #B8B8B8;
            position: absolute;
            top: 60%;
            margin-top: -10px;
            left: 50%;
            margin-left: -65px;
        }
    }
    .footer {
        margin-top: 100px;
    }
}
</style>
