<template>
    <div>
        <el-container class="el-container-box">
            <el-header>
                <div class="header">
                    <div class="header-title">{{ btnArr[handleActive].text }}</div>
                    <div class="block">
                        <el-date-picker
                            v-model="date"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm"
                            align="right">
                        </el-date-picker>
                    </div>
                    <button class="inquire" @click="inquire">查询</button>
                    <input type="text" placeholder="请填写合同主题/发起人" v-model.trim="str" />
                </div>
            </el-header>
            <el-container class="el-container-main">
                <el-aside>
                    <label v-for="(btn, index) in btnArr" :key="index" :for="btn.name" :class="btnArr[handleActive].name == btn.name ? 'hightlight' : null">
                        {{ btn.text }}
                        <input type="radio" :id="btn.name" name="file" :value="index" v-model="idx" />
                    </label>
                </el-aside>
                <el-container class="el-container-table">
                    <el-main>
                        <table v-if="contracts.length > 0" class="el-main-table">
                            <tr>
                                <th><div class="d1">合同主题</div></th>
                                <th><div class="d2">发起人</div></th>
                                <th><div class="d3">发起时间</div></th>
                                <th><div class="d4">截止时间</div></th>
                                <th><div class="d5">合同状态</div></th>
                                <th><div class="d6">操作</div></th>
                            </tr>
                            <tr v-for="(contract, index) in contracts" :key="index" class="trColor" @click.stop="showContract(contract)">
                                <td>
                                    <div class="d1">
                                        {{ contract.title }}
                                    </div>
                                </td>
                                <td><div class="d2">{{ contract.name || contract.initiator }}</div></td>
                                <td><div class="d3">{{ contract.time }}</div></td>
                                <td><div class="d4">{{ contract.expire_time ? contract.expire_time : '无' }}</div></td>
                                <td>
                                    <div class="d5 waitting">
                                        {{ contract.status | status }}
                                        <div class="waitting-icon" :class="contract.status === 'finish' ? 'waitting-icon-green' : 'waitting-icon-red'"></div>
                                    </div>
                                </td>
                                <td>
                                    <div class="d6 btn">
                                        <button type="text" v-if="contract.status === 'wait_for_me'" @click.stop="sign(contract)">签署</button>
                                        <button type="text" v-if="contract.status === 'draft'" @click.stop="redact(contract)">编辑</button>
                                        <button v-show="contract.status === 'draft'" @click.stop="deleted(contract.cntrtno)" type="text">删除</button>
                                        <button type="text" v-if="contract.status !== 'draft'" @click.stop="contractDetails(contract)">详情</button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div v-else class="blank">
                            <p class="blank-txt">暂无签名文件</p>
                        </div>
                    </el-main>
                    <el-footer >
                        <div class="footer-left">
                            <div v-show="idx === 5 && contracts.length > 0">
                                <div v-show="!batchSignShow"><button class="batch" @click="batch">批量签署</button></div>
                            </div>
                        </div>
                        <div v-show="contracts.length > 0" class="footer-right">
                            <el-pagination
                                layout="prev, pager, next"
                                :page-size="page_size"
                                prev-text="上一页"
                                next-text="下一页"
                                :current-page="current_page"
                                @current-change="setCurrentPage"
                                @prev-click="prevPage"
                                @next-click="nextPage"
                                :total="count">
                            </el-pagination>
                        </div>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
        <Sign v-if="cntrtno.length > 0" :cntrtno="cntrtno" :stampSn='stampSn' @refresh="refresh1" @close="close"></Sign>
        <batch-sign v-if="batchSignShow" @confirm="confirm" @cancel="cancel"></batch-sign>
    </div>
</template>

<script>
import Sign from './sign';
import BatchSign from './BatchSign/batch-sign';
import { searchAKindOfContractInformation, deleteContract, getStampsByCheckPass, searchContractInformation, searchContractByTime } from '../../api/contract';
import { getHomePageInformation } from '../../api/details';
const btnArr = [
    { name: 'draft', text: '草稿箱' },
    { name: 'past', text: '已过期' },
    { name: 'finish', text: '已完成' },
    { name: 'repeal', text: '已撤销' },
    { name: 'wait-sb', text: '待他人签署' },
    { name: 'wait-me', text: '待我签署' },
    { name: 'all', text: '全部文件' }
];
export default {
    data () {
        return {
            contracts: [],
            count: 0,
            str: '',
            page_size: 6,
            current_page: null,
            idx: null,
            btnArr,
            date: null,
            batchSignShow: false,
            // checkboxArr: [],
            // checkboxAll: false,
            cntrtno: [],
            stampSn: null
        };
    },
    created () {
        let idx = this.$store.getters.idx || 5;
        this.$store.dispatch('set_idx', null);
        this.idx = this.$route.params.idx || idx;
        console.log(this.idx)
        getStampsByCheckPass().then(res => {
            this.stampSn = res.data.data[0].StpSn;
        });
    },
    watch: {
        idx: function (value) {
            this.batchSignShow = false;
            // this.checkboxArr = [];
            // this.checkboxAll = false;
            if (this.idx === 5) {
                this.batchSignShow = false;
            }
            this.current_page = 1;
            this.contracts = [];
            searchAKindOfContractInformation(value + 1, this.current_page, this.page_size).then(res => {
                if (res.data.error === 0) {
                    this.contracts = res.data.data.contracts;
                    this.count = res.data.data.count;
                }
            }).catch(error => {
                
            });
        },
        current_page: function (value) {
            this.batchSignShow = false;
            if (this.date) {
                searchContractByTime(this.date[0], this.date[1],this.current_page, this.page_size).then(res => {
                    this.contracts = res.data.data.contracts;
                    this.count = res.data.data.count;
                })
            } else {
                searchAKindOfContractInformation(this.idx + 1, value, this.page_size).then(res => {
                    if (res.data.error === 0) {
                        this.contracts = res.data.data.contracts;
                        this.count = res.data.data.count;
                    }
                }).catch(error => {
    
                });
            }
        },
        str: function (value) {
            if (value === '') {
                this.idx = 6;
            } else {
                searchContractInformation(value).then(res => {
                    if (res.data.error === 0 && res.data.data) {
                        this.contracts = res.data.data.contracts;
                    } else {
                        this.contracts = [];
                    }
                }).catch(error => {

                })
            }
        }
    },
    methods: {
        sign (cntrtno) {
            this.cntrtno.push(cntrtno);
        },
        batch () {
            this.batchSignShow = true;
        },
        showContract (contract) {
            window.open(`https://user-contract.oss-cn-beijing.aliyuncs.com/${ contract.doc_key }`, '_blank');
        },
        // batchConfirm () {
        //     if (this.checkboxArr.length === 0) {
        //         this.$message({
        //             message: '请至少选择一个文件进行签署',
        //             type: 'warning'
        //         });
        //     } else {
        //         this.cntrtno = this.checkboxArr;
        //     }
        // },
        confirm (cntrtno) {
            this.cntrtno = cntrtno;
            this.batchSignShow = false;
        },
        cancel () {
            this.batchSignShow = false;
            // this.checkboxArr = [];
            // this.checkboxAll = false;
        },
        contractDetails (contract) {
            this.$store.dispatch('set_idx', this.idx);
            this.$router.push({
                path: '/contract-details',
                query: {
                    contract: JSON.stringify(contract)
                }
            });
        },
        setCurrentPage (val) {
            this.current_page = val;
        },
        prevPage (val) {
            this.current_page = val;
        },
        nextPage (val) {
            this.current_page = val;
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
                        searchAKindOfContractInformation(this.idx + 1, this.current_page, this.page_size).then(res => {
                            if (res.data.error === 0) {
                                this.contracts = res.data.data.contracts;
                                this.count = res.data.data.count;
                            }
                        });
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // searchContractByName () {
        //     searchContractInformation(this.str).then(res => {
        //         console.log(res)
        //         this.contracts = res.data.data.contracts || [];
        //     }).catch(error => {

        //     })
        // },
        // 编辑
        redact (contract) {
            let cntrt_no = contract.cntrtno;
            let Doc_key = contract.doc_key;
            let fileName = contract.title;
            this.$store.dispatch('set_idx', this.idx);
            getHomePageInformation().then(res => {
                if (res.data.error === 0) {
                    let img_key = res.data.data.stamp_url;
                    this.$router.push({
                        path: '/new-signature',
                        name: 'NewSignature',
                        query:{
                            cntrt_no,
                            // Doc_key,
                            // img_key,
                            // fileName
                        }
                    })
                }
            }).catch(error => {

            });
            
        },
        close () {
            this.cntrtno = [];
        },
        refresh1 (val) {
            switch (val) {
                case 0:
                    this.idx = 5;
                    this.batchSignShow = false;
                    this.cntrtno = [];
                    break;
                case 1:
                    this.idx = 2;
                    this.batchSignShow = false;
                    this.cntrtno = [];
                    break;
                default:
                    break;
            }
        },
        inquire () {
            this.current_page = 1;
            if (this.date) {
                searchContractByTime(this.date[0], this.date[1],this.current_page, this.page_size).then(res => {
                    this.contracts = res.data.data.contracts;
                    this.count = res.data.data.count;
                })
            } else {
                this.$message({
                    message: '请选择查询时间',
                    type: 'warning'
                });
            }
        },
        funDownload (content, filename) {
            // 创建隐藏的可下载链接
            var eleLink = document.createElement('a');
            eleLink.download = filename;
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            var blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        }
    },
    computed: {
        handleActive () {
            return this.idx;
        },
        time () {
            return this.value;
        }
    },
    filters: {
        status: function (value) {
            if (value === 'expire') {
                return '已过期';
            } else if (value === 'wait_for_others') {
                return '待他人签署';
            } else if (value === 'wait_for_me') {
                return '待我签署';
            } else if (value === 'finish') {
                return '已完成';
            } else if (value === 'draft') {
                return '草稿';
            } else {
                return '已撤销'
            }
        }
    },
    components: {
        Sign,
        BatchSign
    }
};
</script>

<style lang="less" scoped>
.el-container-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-header {
        width: 100%;
        height: 70px!important;
        background: #0FBC7F;
        .header {
            width: 1100px;
            height: 100%;
            margin: auto;
            display: flex;
            justify-content: left;
            align-items: center;
            &-title {
                width: 120px;
                font-size: 16px;
                color: #fff;
                margin-right: 150px;
            }
            .block {
                transform: scale(0.9);
            }
            .inquire {
                width: 62px;
                height: 30px;
                outline: none;
                border: 1px solid rgba(255, 255, 255, 0.58);
                border-radius: 4px;
                background: #0FBC7F;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
            }
            [type="text"] {
                width: 220px;
                height: 30px;
                border: 1px solid #fff;
                border-radius: 4px;
                outline: none;
                background: #fff;
                font-size: 12px;
                text-indent: 15px;
                margin-left: 177px;
            }
        }
    }
    .el-container-main {
        width: 1100px;
        height: 600px;
        display: flex;
        justify-content: space-between;
        align-items: top;
        .el-aside {
            width: 120px!important;
            height: 370px!important;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            label {
                width: 105px;
                height: 50px;
                line-height: 50px;
                font-size: 14px;
                color: #000000;
                text-align: left;
                text-indent: 20px;
                color: #666666;
                border-left: 1px solid rgba(0, 0, 0, 0.1);
                [name="file"] {
                    display: none;
                }
            }
            .hightlight {
                border-left: 2px solid #1ABF82;
                color: #10C786;
                background: rgba(26, 191, 130, 0.05);
                // text-indent: 19px;
            }
        }
        .el-container-table {
            width: 980px;
            display: flex;
            justify-content: space-between;
            .el-main {
                padding: 20px 0;
                width: 100%;
                height: 500px;
                &-table {
                    width: 100%;
                    font-size: 14px;
                    border: 1px solid #EAEAEA;
                    border-collapse: collapse;
                    .trColor:hover {
                        background: #F1F9F6;
                        button {
                            background: #F1F9F6;
                        }
                    }
                    tr {
                        height: 60px;
                        line-height: 60px;
                        border: 1px solid #EAEAEA;
                        text-align: left;
                        th {
                            background: #FAFAFA;
                            font-weight: bold;
                            color: #252525;
                        }
                        td, th {
                            button {
                                padding: 0;
                            }
                            .d1 {
                                width: 178px;
                                padding-left: 40px;
                                padding-right: 20px;
                            }
                            .d2 {
                                width: 130px;
                                padding-right: 20px;
                            }
                            .d3 {
                                width: 180px;
                                padding-right: 15px;
                            }
                            .d4 {
                                width: 180px;
                                padding-right: 15px;
                            }
                            .d5 {
                                width: 130px;
                                padding-left: 25px;
                                padding-right: 15px;
                            }
                            .d6 {
                                width: 179px;
                            }
                            div {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                        .waitting {
                            position: relative;
                            padding-left: 15px;
                            .waitting-icon {
                                width: 8px;
                                height: 8px;
                                position: absolute;
                                top: 50%;
                                margin-top: -4px;
                                left: 5px;
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
                                margin-right: 5px;
                                cursor: pointer;
                            }
                            .bg {
                                color: #E7E7E7;
                            }
                            .disabled {
                                color: #D9D9D9;
                                cursor: no-drop;
                            }
                            // 禁用样式
                            .disabled {
                                color: #D9D9D9;
                                cursor: no-drop;
                            }
                        }
                    }
                }
                .blank {
                    width: 100%;
                    height: 500px;
                    background: url(../../images/无文件状态.svg) center center no-repeat;
                    position: relative;
                    .blank-txt {
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 14px;
                        color: #d8d8d8;
                        position: absolute;
                        top: 68%;
                        left: 50%;
                        margin-left: -70px;
                    }
                }
            }
            .el-footer {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .footer-left {
                    .batch {
                        width: 90px;
                        height: 30px;
                        font-size: 12px;
                        color: #fff;
                        background: #10C786;
                        outline: none;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .confirm {
                        width: 76px;
                        height: 30px;
                        font-size: 12px;
                        color: #fff;
                        background: #10C786;
                        outline: none;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .cancel {
                        width: 76px;
                        height: 30px;
                        font-size: 12px;
                        color: #000;
                        background: #fff;
                        outline: none;
                        border: 1px solid #D9D9D9;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
