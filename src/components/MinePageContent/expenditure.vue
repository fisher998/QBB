<template>
    <div class="expenditure-box">
        <div class="expenditure">
            <div class="expenditure-title">
                <div class="expenditure-title-left bold">
                    <span></span>
                    消费流水
                </div>
                <div class="expenditure-title-right">
                    <div class="block">
                            <!-- type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" -->
                        <el-date-picker
                            type="month"
                            v-model="data"
                            placeholder="选择月"
                            value-format="yyyy-MM"
                            align="right">
                        </el-date-picker>
                    </div>
                    <button class="inquire" @click="inquire">查询</button>
                </div>
            </div>
            <table class="expenditure-table">
                <tr>
                    <th>订单号</th>
                    <th>活动类型</th>
                    <th>时间</th>
                    <th>备注</th>
                    <th>使用次数</th>
                    <th>剩余次数</th>
                </tr>
                <tr v-for="(expenditure, index) in expenditures" :key="index">
                    <td><div class="d1">{{ expenditure.log_no }}</div></td>
                    <td><div class="d2">{{ expenditure.type }}</div></td>
                    <td><div class="d3">{{ expenditure.time }}</div></td>
                    <td><div class="d4">{{ expenditure.title }}</div></td>
                    <td><div class="d5">{{ expenditure.cost }}</div></td>
                    <td><div class="d6">{{ expenditure.signtimes_reamain }}</div></td>
                </tr>
            </table>
            <div class="expenditure-bottom">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="page_size"
                    :current-page="current_page"
                    prev-text="上一页"
                    next-text="下一页"
                    @current-change="setCurrentPage"
                    @prev-click="prevPage"
                    @next-click="nextPage"
                    :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getExpenditure, getExpenditureByMonth } from '../../api/details';
export default {
    data () {
        return {
            current_page: 1,
            page_size: 4,
            data: '',
            expenditures: [],
            count: null
        };
    },
    created () {
        getExpenditure(this.page_size, this.current_page).then(res => {
            this.expenditures = res.data.data.data;
            this.count = res.data.data.count;
        }).catch(error => {

        });
    },
    watch: {
        current_page: function (val) {
            if (this.data === '') {
                getExpenditure(this.page_size, val).then(res => {
                    this.expenditures = res.data.data.data;
                    this.count = res.data.data.count;
                }).catch(error => {
    
                });
            } else {
                getExpenditureByMonth(this.data, this.page_size, this.current_page).then(res => {
                    this.expenditures = res.data.data.data;
                    this.count = res.data.data.count;
                }).catch(error => {

                });
            }
        }
    },
    methods: {
        setCurrentPage (val) {
            this.current_page = val;
        },
        prevPage (val) {
            this.current_page = val;
        },
        nextPage (val) {
            this.current_page = val;
        },
        inquire () {
            if (!this.data) {
                    this.$message({
                        message: '请输入您需要查询的月份',
                        type: 'warning'
                    });
                    getExpenditure(this.page_size, this.current_page).then(res => {
                        this.expenditures = res.data.data.data;
                        this.count = res.data.data.count;
                    }).catch(error => {

                    });
            } else {
                getExpenditureByMonth(this.data, this.page_size, this.current_page).then(res => {
                    if (!res.data.data) {
                        this.$message({
                            message: '当月没有消费流水',
                            type: 'warning'
                        });
                    } else {
                        this.expenditures = res.data.data.data;
                        this.count = res.data.data.count || 0;
                    }
                }).catch(error => {
    
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.expenditure-box {
    width: 100%;
    .expenditure {
        width: 100%;
        min-height: 360px;
        &-title {
            width: 100%;
            font-size: 14px;
            position: relative;
            color: #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-left {
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
            &-right {
                width: 500px;
                position: absolute;
                right: 0px;
                top: 50%;
                margin-top: -20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .block {
                    transform: scale(0.9);
                }
                .inquire {
                    width: 60px;
                    height: 30px;
                    outline: none;
                    color: #13C384 ;
                    background: #fff;
                    border: 1px solid #13C384;
                    border-radius: 4px;
                    margin-left: 50px;
                    cursor: pointer;
                }
            }
        }
        &-table {
            width: 1100px;
            margin-top: 40px;
            font-size: 14px;
            // min-height: 200px;
            border: 1px solid #E8E8E8;
            border-collapse: collapse;
            tr {
                height: 60px;
                line-height: 60px;
                border: 1px solid #E8E8E8;
                text-align: left;
                th {
                    background: #FAFAFA;
                    font-weight: bold;
                    color: #252525;
                }
                th:nth-of-type(1) {
                    padding-left: 40px;
                }
                th:nth-of-type(2) {
                    padding-left: 40px;
                }
                th:nth-of-type(3) {
                    padding-left: 20px;
                }
                th:nth-of-type(4) {
                    padding-left: 40px;
                }
                td {
                    color: #595959;
                    div {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .d1 {
                        width: 200px;
                        padding-left: 40px;
                        padding-right: 30px;
                    }
                    .d2 {
                        width: 200px;
                        padding-left: 40px;
                    }
                    .d3 {
                        width: 200px;
                        padding-left: 20px;
                    }
                    .d4 {
                        width: 200px;
                        padding-left: 40px;
                    }
                    .d5 {
                        width: 150px;
                    }
                    .d6 {
                        width: 150px;
                    }
                }
            }
        }
        &-bottom {
            width: 100%;
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
