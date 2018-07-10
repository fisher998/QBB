<template>
    <div>
        <div class="top-box">
            <div class="top">
                <Header class="header" />
            </div>
        </div>
        <div class="contract-top-box">
            <div class="contract-top">
                <span class="go-back" @click="goBack">&lt; 返回上一页</span>
            </div>
        </div>
        <div class="contract-header-box">
            <div class="contract-header">
                <div class="contract-header-left">
                    <div class="contract-header-left-images"></div>
                    <div class="contract-header-left-name">
                        <div class="contract-header-left-name-t">{{ contractInfo.Title }}</div>
                        <button class="contract-header-left-name-b">{{ status | test }}</button>
                    </div>
                </div>
                <div class="contract-header-center">
                    <div class="contract-header-center-left" :class="{ 'disable': status === 'finish' || status === 'expire' }" @click="sendMsg">
                        <div v-if="status === 'wait_for_me'" class="contract-header-center-left-t1"></div>
                        <div v-else class="contract-header-center-left-t"></div>
                        <el-button type="text" :disabled="status === 'finish'" class="contract-header-center-left-b">{{ status === 'wait_for_me' ? '签署' : '提醒' }}</el-button>
                    </div>
                    <a class="contract-header-center-right" :href="'https://user-contract.oss-cn-beijing.aliyuncs.com/' + contractInfo.DocKey || contractInfo.filePath" target="_blank" download="">
                        <div class="contract-header-center-right-t"></div>
                        <div class="contract-header-center-right-b">预览</div>
                    </a>
                </div>
                <div class="contract-header-right">
                    <!-- <a class="contract-header-right-left" @click="downloadFile">
                        <div class="contract-header-right-left-t"></div>
                        <div class="contract-header-right-left-b">下载</div>
                    </a> -->
                    <div class="contract-header-right-center" @click="contractDepositCertificate">
                        <div class="contract-header-right-center-t"></div>
                        <div class="contract-header-right-center-b">存证</div>
                    </div>
                    <!-- <div class="contract-header-right-right">
                        <div class="contract-header-right-right-t"></div>
                        <div class="contract-header-right-right-b">打印</div>
                    </div> -->

                </div>
            </div>
        </div>
        <div class="contract-main">
            <div class="contract-main-first">
                <div class="contract-main-first-top"><span></span>合同信息</div>
                <table class="contract-main-first-bottom">
                    <tr>
                        <td style="width: 20%" class="title">合同主题:</td>
                        <td style="width: 30%">{{ contractInfo.Title }}</td>
                        <td style="width: 20%" class="title">截止时间:</td>
                        <td style="width: 30%">{{ contractInfo.ExpireTime }}</td>
                    </tr>
                    <tr>
                        <td style="width: 20%" class="title">发起人:</td>
                        <td style="width: 30%">{{ contractInfo.Initiator.InitiatorName || '555' }}</td>
                        <td style="width: 20%" class="title">备注:</td>
                    <td style="width: 30%">
                        <el-popover
                            placement="top-start"
                            title="备注"
                            width="300"
                            trigger="hover"
                            :content="contractInfo.Remark || '无'">
                            <div class="btn" slot="reference">{{ '鼠标移入查看' }}</div>
                            <!-- <el-button slot="reference">hover 激活</el-button> -->
                        </el-popover>
                    </td>
                        <!-- <td style="width: 30%"><button class="btn">点击查看</button></td> -->
                    </tr>
                    <tr>
                        <td style="width: 20%" class="title">发起时间:</td>
                        <td style="width: 30%">{{ contractInfo.CreateTime }}</td>
                        <td style="width: 20%" class="title">签署顺序:</td>
                        <td style="width: 30%">{{ contractInfo.InSequence === 1 ? '顺序签署' : '无序签署'}}</td>
                    </tr>
                </table>
            </div>

            <div class="contract-main-second">
                <div class="contract-main-second-top"><span></span>合同信息</div>
                <table class="contract-main-second-bottom">
                    <tr>
                        <th>顺序</th>
                        <th>姓名</th>
                        <th>签署人账号</th>
                        <th>状态</th>
                        <th>签署时间</th>
                        <th>操作</th>
                    </tr>
                    <!-- <tr  v-for="item in arr" :key="item.id">
                        <td style="width: 150px">{{ item.id }}</td>
                        <td style="width: 150px" class="contract-people"><div class="people">{{ '签署人' }}</div>{{ item.name }}</td>
                        <td style="width: 280px">{{ `(+86)${item.tel}` }}</td>
                        <td style="width: 150px" class="contract-state"><div class="icon" :class="true ? 'icon-red' : 'icon-green'"></div>{{ '已完成' }}</td>
                        <td style="width: 280px">{{ '2018-08-08 17:20:00' }}</td>
                        <td style="width: 100px">{{ '发送' }}</td>
                    </tr> -->
                    <tr v-for="(singer, index) in contractInfo.Signers" :key="index">
                        <td><div class="d1">{{ singer.Sequence || 1 }}</div></td>
                        <td><div class="d2"><div class="people contract-people">{{ '签署人' }}</div>{{ singer.name }}</div></td>
                        <td><div class="d3">(+86){{ singer.mobile }}</div></td>
                        <td><div class="d4 contract-state"><div class="icon" :class="singer.SignStatus === 1 ? 'icon-green' : 'icon-red'"></div>{{ singer.SignStatus === 1 ? '已完成' : '待签署' }}</div></td>
                        <td><div class="d5">{{ singer.SignedTime || '——' }}</div></td>
                        <td><div class="d6"><el-button type="text" :disabled="status === 'expire' || singer.SignStatus === 1" @click="sendRemind(singer.SignerSn)">发送</el-button></div></td>
                    </tr>
                </table>
            </div>
        </div>
        <Sign v-if="cntrtno.length > 0" :cntrtno="cntrtno" :stampSn='stampSn' @close="close" @refresh="refresh"></Sign>
        <div v-show="shade" class="shade"></div>
    </div>
</template>

<script>
import { getContractInformation, contractDepositCertificate, sendToRemind, getStampsByCheckPass, searchContractInformation } from '../../api/contract';
import Header from '../details/header';
import Sign from '../details/sign';
export default {
    data () {
        return {
            cntrt_no: '',
            status: '',
            stampSn: null,
            shade: false,
            contractInfo: {
                Initiator: {
                    InitiatorName: ''
                }
            },
            cntrtno: [],
            contract: null
        };
    },
    created () {
        this.contract = JSON.parse(this.$route.query.contract);
        this.cntrt_no = this.contract.cntrtno;
        this.status = this.contract.status;
        getContractInformation(this.cntrt_no).then(res => {
            if (res.data.error === 0) {
                this.contractInfo = res.data.data;
            }
        }).catch(error => {

        });
        getStampsByCheckPass().then(res => {
            this.stampSn = res.data.data[0].StpSn;
        });
    },
    methods: {
        goBack () {
            window.history.go(-1);
        },
        downloadFile () {
            // https://user-contract.oss-cn-beijing.aliyuncs.com/+doc_key

        },
        contractDepositCertificate () {
            this.shade = true;
            contractDepositCertificate(this.cntrt_no).then(res => {
                switch (res.data.error) {
                    case 0:
                        this.$message({
                            message: '恭喜您，合同存证成功',
                            type: 'success'
                        });
                        break;
                    case 30014:
                        this.$message({
                            message: '合同存证失败，没有足够的储存空间',
                            type: 'warning'
                        });
                        break;
                    default:
                        break;
                }
                this.shade = false;
            })
        },
        sendRemind (ReceiverSn) {
            sendToRemind(ReceiverSn, 1, this.cntrt_no, 1).then(res => {
                if (res.data.error === 0) {
                    this.$message({
                        message: '发送提醒成功',
                        type: 'success'
                    })
                }
            }).catch(error => {

            });
        },
        sendMsg () {
            if (this.status === 'wait_for_me') {
                this.cntrtno.push(this.contract);
            } else if (this.status === 'wait_for_others') {
                this.contractInfo.Signers.forEach(signer => {
                    if (signer.SignStatus === 0) {
                        sendToRemind(signer.SignerSn, 1, this.cntrt_no, 1).then(res => {
                            if (res.data.error === 0) {
                                this.$message({
                                    message: '发送提醒成功',
                                    type: 'success'
                                })
                            }
                        }).catch(error => {
    
                        });
                    } else {
    
                    }
                });
            }
        },
        close () {
            this.cntrtno = [];
        },
        refresh () {
            this.$router.push({
                path: '/details/file-page'
            });
        }
    },
    filters: {
        test: function (value) {
            switch (value) {
                case 'expire':
                    return '已过期';
                case 'finish':
                    return '已完成';
                case 'wait_for_others':
                    return '待他人签署';
                case 'wait_for_me': 
                    return '待我签署';
                default:
                    return '草稿';
            }
        }
    },
    components: {
        Sign,
        Header
    }
}
</script>

<style lang="less" scoped>
.top-box {
    width: 100%;
    height: 67px;
    .top {
        width: 100%;
        height: 67px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background: #ffffff;
        box-shadow: 0 0 5px 0 #d5d5d5;
        .header {
            margin: 0 auto;
        }
    }
}
.contract-top-box {
    width: 100%;
    height: 57px;
    background: #323439;
    display: flex;
    justify-content: center;
    .contract-top {
        width: 1100px;
        height: 57px;
        line-height: 57px;
        .go-back {
            font-size: 14px;
            color: #fff;
            cursor: pointer;
        }
    }
}
.contract-header-box {
    width: 100%;
    height: 180px;
    background: #10C786;
    display: flex;
    justify-content: center;
    align-items: center;
    .contract-header {
        width: 1100px;
        height: 125px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &-left {
            height: 125px;
            display: flex;
            align-content: space-between;
            align-items: center;
            &-images {
                width: 101px;
                height: 125px;
                margin-right: 10px;
                background: url(../../images/compact.svg) center center no-repeat;
            }
            &-name {
                height: 60px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: left;
                font-size: 14px;
                &-t {
                    width: 110px;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                &-b {
                    width: 114px;
                    height: 34px;
                    opacity: 0.7;
                    outline: none;
                    border: 1px solid #fff;
                    background: #10C786;
                    border-radius: 4px;
                    color: #FEFEFE;
                }
            }
        }
        &-center {
            width: 320px;
            height: 90px;
            border-left: 1px solid rgba(255, 255, 255, 0.5);
            border-right: 1px solid rgba(255, 255, 255, 0.5);
            padding: 0 30px 0 30px;
            margin: 0 70px 0 70px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            &-left {
                height: 60px;
                display: flex;
                flex-direction: column;
                -ms-flex-direction: column;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                cursor: pointer;
                &-t {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/remind.svg) center top no-repeat;
                }
                &-t1 {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/签署.svg) center top no-repeat;
                }
                .el-button {
                    height: 0px;
                    color: #fff;
                    font-size: 12px;
                    // margin-top: 10px;
                    span {
                        margin-bottom: 0px;
                    }
                }
            }
            .disable {
                cursor: not-allowed;
                color: #666666;
            }
            &-right {
                height: 60px;
                display: flex;
                flex-direction: column;
                -ms-flex-direction: column;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                &-t {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/preview.svg) center top no-repeat;
                }
            }
        }
        &-right {
            width: 360px;
            height: 90px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            &-left {
                height: 60px;
                display: flex;
                flex-direction: column;
                -ms-flex-direction: column;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                &-t {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/download.svg) center top no-repeat;
                }
            }
            &-center {
                height: 60px;
                display: flex;
                flex-direction: column;
                -ms-flex-direction: column;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                margin-left: 30px;
                cursor: pointer;
                &-t {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/certify.svg) center top no-repeat;
                }
            }
            &-right {
                height: 60px;
                display: flex;
                flex-direction: column;
                -ms-flex-direction: column;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                &-t {
                    width: 35px;
                    height: 35px;
                    background: url(../../images/print.svg) center top no-repeat;
                }
            }
        }
    }
}
.contract-main {
    width: 1100px;
    height: 300px;
    margin: auto;
    &-first {
        width: 100%;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        -ms-flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        &-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: bold;
            span {
                width: 4px;
                height: 16px;
                background: #000;
                margin-right: 10px;
            }
        }
        &-bottom {
            width: 500px;
            margin-left: 15px;
            margin-top: 25px;
            tr {
                height: 45px;
                line-height: 45px;
                text-align: left;
                font-size: 14px;
                color: #3C3C3C;
                .title {
                    color: #666666;
                }
                .btn {
                    width: 100%;
                    height: 100%;
                    font-size: 14px;
                    background: #fff;
                    color: #10C786;
                    text-align: left;
                    padding: 0;
                    outline: none;
                    border: none;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    &-second {
        width: 100%;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        font-size: 14px;
        &-top {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: bold;
            span {
                width: 4px;
                height: 16px;
                background: #000;
                margin-right: 10px;
            }
        }
        &-bottom {
            width: 1100px;
            border: 1px solid #E8E8E8;
            text-align: left;
            margin-top: 30px;
            tr {
                font-size: 14px;
                height: 55px;
                line-height: 55px;
                color: #666666;
                border: 1px solid #E8E8E8;
                th {
                    font-size: 14px;
                    color: #3C3C3C;
                    font-weight: bold;
                }
                th:nth-of-type(1) {
                    padding-left: 40px;
                }
                th:nth-of-type(2) {
                    padding-left: 80px;
                }
                th:nth-of-type(4) {
                    padding-left: 40px;
                }
                .d1 {
                    width: 120px;
                    padding-left: 40px;
                }
                .d2 {
                    width: 230px;
                    padding-left: 80px;
                    position: relative;
                    .people {
                        width: 55px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 12px;
                        font-size: 12px;
                        color: #fff;
                        background: #000;
                        position: absolute;
                        left: 0px;
                        top: 50%;
                        margin-top: -12px;
                        z-index: 10;
                    }
                }
                .d3 {
                    width: 200px;
                }
                .d4 {
                    width: 200px;
                    padding-left: 40px;
                }
                .d5 {
                    width: 200px;
                }
                .d6 {
                    width: 150px;
                }
                td {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .contract-state {
                    position: relative;
                    .icon {
                        width: 8px;
                        height: 8px;
                        position: absolute;
                        top: 50%;
                        margin-top: -3px;
                        left: 10px;
                        border-radius: 50%;
                    }
                    .icon-red {
                        background: red;
                    }
                    .icon-green {
                        background: #10C786;
                    }
                }
                
            }
            tr:first-child {
                height: 50px;
                line-height: 50px;
                border: 1px solid #E8E8E8;
                background: #FAFAFA;
                color: #000;
            }
        }
    }
}
.shade {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
}
</style>
