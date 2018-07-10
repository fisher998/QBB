<template>
    <div class="recent-box">
        <div class="recent-document">
            <div class="recent-document-title">
                <span>最近文件</span>
                <span @click="allFile">全部文件 ></span>
            </div>
            <table class="recent-document-table">
                <tr class="table-header">
                    <th class="bold">合同主题</th>
                    <th class="bold">发起人</th>
                    <th class="bold">发起时间</th>
                    <th class="bold">截止时间</th>
                    <th class="waitting bold">合同状态</th>
                    <th class="bold">操作</th>
                </tr>
                <tr v-for="item in recent" :key="item.id" class="trColor" @click="showContract(item)">
                    <td ><div class="b1">{{ item.title }}</div></td>
                    <td><div class="b2">{{ item.name }}</div></td>
                    <td><div class="b3">{{ item.time }}</div></td>
                    <td><div class="b4">{{ item.expire_time === 0 ? '无' : item.expire_time}}</div>  </td>
                    <td><div class="waitting b5">{{ item.status | test }}<div class="waitting-icon" :class="item.status === 'finish' ? 'waitting-icon-green' : 'waitting-icon-red'"></div></div></td>
                    <td>
                        <!-- <el-button type="text" :class="{ 'disabled': item.status === 'finish'}" :disabled="item.status === 'wait_for_me'" @click="sign(item.cntrtno)">签署</el-button> -->
                        <!-- <el-button type="text" v-if="item.status === 'wait_for_me'" @click="sign(item.cntrtno)">签署</el-button> -->
                        <!-- <span class="bg" v-if="item.status === 'wait_for_me'">|</span> -->
                        <!-- <el-button type="text" v-if="item.status === 'wait_for_others'" @click="remind(item.cntrtno)">提醒</el-button> -->
                        <!-- <span class="bg" v-if="item.status === 'wait_for_others'">|</span> -->
                        <!-- <el-button type="text">下载</el-button> -->
                        <!-- <span class="bg">|</span> -->
                        <!-- <el-button type="text" @click="contractDetails(item.cntrtno)">详情</el-button> -->

                        <div class="btn b6">
                            <button type="text"  @click.stop="sign(item)" :class="{'disabled': item.status !== 'wait_for_me'}" :disabled="item.status !== 'wait_for_me'">签署</button>
                            <span>|</span>
                            <button type="text" :class="{'disabled': item.status !== 'draft'}" :disabled="item.status !== 'draft'" @click.stop="redact(item)">编辑</button>
                            <span>|</span>
                            <button :class="{'disabled': item.status === 'draft'}" :disabled="item.status === 'draft'" @click.stop="contractDetails(item)">详情</button>
                            <span>|</span>
                            <button :class="{'disabled': item.status !== 'draft'}" :disabled="item.status !== 'draft'" @click.stop="deleted(item.cntrtno)" type="text">删除</button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <Sign v-if="cntrtno.length > 0" :cntrtno="cntrtno" :stampSn='stampSn' @refresh="refresh1" @close="close"></Sign>
    </div>
</template>

<script>
import Sign from './sign';
import { searchAKindOfContractInformation, deleteContract, getStampsByCheckPass, searchContractInformation } from '../../api/contract';
import { getHomePageInformation } from '../../api/details';
export default {
    props: {
        recent: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            cntrtno: [],
            stampSn: null
        }
    },
    created () {
        getStampsByCheckPass().then(res => {
            this.stampSn = res.data.data[0].StpSn;
        });
    },
    methods: {
        contractDetails (contract) {
            this.$router.push({
                name: 'ContractDetails',
                query: {
                    contract: JSON.stringify(contract)
                }
            })
        },
        allFile () {
            this.$router.push({
                name: 'FilePage',
                params: {
                    idx: 6
                }
            });
        },
        sign (cntrtno) {
            this.cntrtno.push(cntrtno);
            console.log(cntrtno)
            /* let _this = this;
            _this.loginPinShow = true;
            console.log(_this.userName, _this.hash)
            $GDCA.signMessage(_this.userName, _this.hash, function (res) {
                sendHashAfterSign(_this.key, _this.hash, _this.$props.cntrtno).then(res => {
                    console.log(res);
                    if (res.data.error === 0) {
                        _this.$message({
                            message: '恭喜您，签名成功',
                            type: 'success'
                        });
                    }
                });
            }, function (err) {
                var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                _this.$message({
                    message: '签名失败,请登录Ukey',
                    type: 'warning'
                });
                _this.loginPinShow = false;
            }); */
        },
        // 发送提醒函数
        remind () {

        },
        close () {
            this.cntrtno = [];
        },
        redact (contract) {
            let cntrt_no = contract.cntrtno;
            let Doc_key = contract.doc_key;
            let fileName = contract.title;
            getHomePageInformation().then(res => {
                if (res.data.error === 0) {
                    let img_key = res.data.data.stamp_url;
                    this.$router.push({
                        path: '/new-signature',
                        name: 'NewSignature',
                        query:{
                            cntrt_no,
                            Doc_key,
                            img_key,
                            fileName
                        }
                    })
                }
            }).catch(error => {

            });
        },
        showContract (item) {
            window.open(`https://user-contract.oss-cn-beijing.aliyuncs.com/${ item.doc_key }`, '_blank');
        },
        deleted (cntrt_no) {
            this.$confirm('此操作会删除该草稿, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteContract(cntrt_no).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '文件删除成功',
                            type: 'success'
                        });
                        this.$emit('deleteContract');
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        refresh1 (val) {
            switch (val) {
                case 0:
                    this.idx = 5;
                    this.btnShow = false;
                    this.cntrtno = [];
                    break;
                case 1:
                    this.idx = 2;
                    this.btnShow = false;
                    this.cntrtno = [];
                    break;
                default:
                    break;
            }
        },
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
    }
}
</script>

<style lang="less" scoped>
.recent-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    -ms-flex-direction: column;
    align-items: center;
    .recent-document {
        width: 1100px;
        min-height: 450px;
        &-title {
            width: 100%;
            height: 33px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:first-child {
                padding-left: 7px;
                color: #222222;
                border-left: 5px solid #000;
            }
            span:last-child {
                color: #10C786;
                cursor: pointer;
            }
        }
        .recent-document-table {
            border: 1px solid #E8E8E8;
        }
        .recent-document-table {
            width: 1100px;
            border-collapse: collapse;
            text-align: center;
            tr:first-child {
                background: #FAFAFA;
            }
            tr {
                font-size: 14px;
                height: 58px;
                line-height: 58px;
                border: 1px solid #E8E8E8;
                th {
                    text-align: left;
                    color: #252525;
                }
                th:nth-of-type(1) {
                    padding-left: 40px;
                }
                th:nth-of-type(4) {
                    padding-left: 20px;
                }
                th:nth-of-type(5) {
                    padding-left: 20px;
                }
                th:nth-of-type(6) {
                    padding-left: 0px;
                }
                td {
                    color: #888888;
                    .b1, .b2, .b3, .b4 , .b5, .b6 {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: left;
                    }
                    .b1 {
                        width: 200px;
                        padding-left: 40px;
                        padding-right: 40px;
                    }
                    .b2 {
                        width: 150px;
                        padding-right: 40px;
                    }
                    .b3 {
                        width: 180px;
                    }
                    .b4 {
                        width: 230px;
                        padding-right: 40px;
                        padding-left: 20px;
                    }
                    .b5 {
                        width: 170px;
                        padding-left: 20px;
                        padding-right: 40px;
                        
                    }
                    .b6 {
                        width: 170px;
                        span {
                            color: #D9D9D9;
                        }
                    }
                }
                .waitting {
                    padding-left: 10px;
                    position: relative;
                    .waitting-icon {
                        width: 8px;
                        height: 8px;
                        position: absolute;
                        top: 50%;
                        margin-top: -4px;
                        left: 1px;
                        border-radius: 50%;
                    }
                    .waitting-icon-red {
                        background: red;
                    }
                    .waitting-icon-green {
                        background: #10C786;
                    }
                }
                .btn {
                    button {
                        outline: none;
                        border: none;
                        font-size: 14px;
                        color: #10C786;
                        background: #fff;
                        cursor: pointer;
                        padding: 0;
                    }
                    .bg {
                        color: #E7E7E7;
                    }
                    .disabled {
                        color: #D9D9D9;
                        cursor: no-drop;
                    }
                }
            }
            .trColor:hover {
                background: #F1F9F6;
                button {
                    background: #F1F9F6;
                }
            }
        }
    }
}
</style>
