<template>
    <div class="batch-sign-box">
        <div class="batch-sign">
            <div class="top">批量签署</div>
            <div class="center">
                <div class="center-top">
                    <el-checkbox label="全选" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></el-checkbox>
                </div>
                <div class="center-bottom">
                    <el-checkbox-group v-model="cntrtnoArr">
                        <div class="contract-box" v-for="(contract, index) in contracts" :key="index">
                            <el-checkbox :label="contract">
                                <div class="content">
                                    <div class="title">{{ contract.title }}</div><div class="name">发起人:{{ contract.name }}</div>
                                </div>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="bottom">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { searchAKindOfContractInformation } from '../../../api/contract';
export default {
    data () {
        return {
            contracts: [],
            cntrtnoArr: [],
            checkAll: false,
            isIndeterminate: false,
            cntrnoOptions: []
        }
    },
    created () {
        searchAKindOfContractInformation(6).then(res => {
            if (res.data.error === 0) {
                this.contracts = res.data.data.contracts;
                this.contracts.forEach(contract => {
                    this.cntrnoOptions.push(contract)
                })
            }
        }).catch(error => {
            
        });
    },
    methods: {
        confirm () {
            if (this.cntrtnoArr.length > 0) {
                this.$emit('confirm', this.cntrtnoArr)
                console.log(this.cntrtnoArr)
            } else {
                this.$message({
                    message: '请至少选择一个文件进行签署',
                    type: 'warning'
                });
            }
        },
        cancel () {
            this.$emit('cancel');
        },
        handleCheckAllChange(val) {
            this.cntrtnoArr = val ? this.cntrnoOptions : [];
            this.isIndeterminate = false;
        },
    }
}
</script>

<style lang="less" scoped>
.batch-sign-box {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.46);
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    .batch-sign {
        width: 500px;
        height: 600px;
        background: #ffffff;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .top {
            width: 100%;
            height: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 16px;
            color: #252525;
        }
        .center {
            width: 420px;
            height: 430px;
            border: 1px solid #E8E8E8;
            .center-top {
                width: 100%;
                height: 30px;
                padding-left: 20px;
                border-bottom: 1px solid #E8E8E8;
                display: flex;
                align-items: center;
            }
            .center-bottom {
                width: 100%;
                height: 400px;
                padding: 20px;
                overflow-y: scroll;
                .contract-box {
                    height: 50px;
                    font-size: 14px;
                    color: #252525;
                    .el-checkbox {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        /deep/.el-checkbox__label {
                            display: block;
                            width: 350px;
                            height: 50px;
                            .content {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                .title {
                                    width: 150px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .name {
                                    width: 90px;
                                    font-size: 12px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                }
            }
        }
        .bottom {
            width: 420px;
            height: 110px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-button {
                width: 160px;
                height: 40px;
            }
        }
    }
}
</style>
