<template>
    <div class="contact-box">
        <div class="contact">
            <div class="contact-title">
                <div class="contact-title-left bold">
                    <span></span>
                    联系人
                </div>
                <div class="contact-title-right">
                    <el-input class="search" type="text" placeholder="输入联系人名称或手机号" v-model="search"></el-input>
                    <el-button type="primary" plain @click="searchContact">查询</el-button>
                </div>
            </div>
            <table class="contact-table" v-if="this.searchLists.length === 0">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>类型</th>
                        <th>手机号</th>
                        <th>邮箱</th>
                        <!-- <th style="width: 15%">注册状态</th> -->
                        <th>CA证书</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(contact, index) in contactLists" :key="index">
                        <td><div class="d1">{{ contact.realName }}</div></td>
                        <td><div class="d2">{{ contact.account_type === 1 ? '个人' : '企业' }}</div></td>
                        <td><div class="d3">{{ contact.cell_phone }}</div></td>
                        <td><div class="d4">{{ contact.email || '暂未绑定邮箱' }}</div></td>
                        <!-- <td>{{ contact.is_register === 1 ? '已注册' : '未注册' }}</td> -->
                        <td><div class="d5">{{ contact.has_ca === 1 ? '已绑定' : '未绑定' }}</div></td>
                        <td>
                            <!-- <button>编辑</button> -->
                            <!-- <span class="s1">|</span> -->
                            <div class="d6"><el-button type="text" @click="deleteContact(contact.cntt_user_sn)">删除</el-button></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="contact-table-else" v-else>
                <tr>
                    <th style="width: 35%">姓名</th>
                    <th style="width: 35%">电话</th>
                    <th style="width: 30%">操作</th>
                </tr>
                <tr v-for="searchContact in searchLists" :key="searchContact.id">
                    <td style="width: 35%">{{ searchContact.name }}</td>
                    <td style="width: 35%">{{ searchContact.mobile }}</td>
                    <td style="width: 30%">
                        <el-button type="text" @click="addContact(searchContact.mobile)">添加到联系人</el-button>
                    </td>
                </tr>
            </table>
            <div class="contact-bottom">
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
        </div>
    </div>
</template>

<script>
import { getContacts, deleteContact, searchContact, addContact } from '../../api/details'
export default {
    data () {
        return {
            search: '',
            contactLists: [],
            searchLists: [],
            count: null,
            current_page: 1,
            page_size: 6
        };
    },
    created () {
        getContacts(1, this.page_size, this.current_page).then(res => {
            this.contactLists = res.data.data.data;
            this.count = res.data.data.count;
        })
    },
    watch: {
        current_page: function (value) {
            getContacts(1, this,page_size, value).then(res => {
                this.contactLists = res.data.data.data;
                this.count = res.data.data.count;
            });
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
        deleteContact (ctt_id) {
            this.$confirm('此操作将删除该联系人, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteContact(ctt_id).then(res => {
                    switch (res.data.error) {
                        case 0:
                            this.$message({
                                message: '联系人删除成功',
                                type: 'success',
                            });
                            break;
                        default:
                            break;
                    }
                }).catch(error => {
    
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        searchContact () {
            searchContact(this.search).then(res => {
                this.searchLists = [];
                if (res.data.data) {
                    for (var i=0; i<res.data.data.length; i++) {
                        this.searchLists.push(res.data.data[i]);
                    }
                } else {
                    this.$message({
                        message: '对不起, 没有查询到该联系人',
                        type: 'warning'
                    });
                }
            })
        },
        addContact (mobile) {
            addContact(mobile).then(res => {
                switch (res.data.error) {
                    case 0:
                        this.$message({
                            message: '联系人添加成功',
                            type: 'success',
                            showClose: true
                        });
                        this.searchLists = [];
                        break;
                    case 30026:
                        this.$message({
                            message: '联系人已经存在, 请不要重复添加',
                            type: 'warning',
                            showClose: true
                        })
                    default:
                        break;
                }
            }).catch(error => {

            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.contact-box {
    width: 100%;
    .contact {
        width: 100%;
        min-height: 350px;
        &-title {
            width: 100%;
            font-size: 14px;
            color: #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            &-left {
                display: flex;
                align-items: center;
                span {
                    display: inline-block;
                    width: 3px;
                    height: 14px;
                    background: #3C3C3C;
                    margin-right: 15px;
                }
            }
            &-right {
                font-size: 12px;
                display: flex;
                display: -ms-flex;
                justify-content: space-between;
                align-items: center;
                margin-right: 50px;
                /deep/input {
                    width: 360px;
                    height: 30px;
                    margin-right: 20px;
                }
                .el-button {
                    width: 60px;
                    height: 30px;
                    line-height: 6px;
                    padding-left: 15px;
                }
                .is-plain {
                    background: #ffffff;
                    color: #10C786;
                }
                .is-plain:hover {
                    background: #10C786;
                    color: #ffffff;
                }
            }
        }
        &-table {
            width: 100%;
            margin-top: 50px;
            text-align: left;
            border: 1px solid #EAEAEA;
            border-collapse: collapse;
            font-size: 14px;
            color: #252525;
            tr {
                height: 60px;
                line-height: 60px;
                border: 1px solid #EAEAEA;
                th {
                    background: #FAFAFA;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: bold;
                }
                th:nth-of-type(1) {
                    padding-left: 40px;
                }
                td {
                    color: #595959;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    div {
                        .s1 {
                            margin: 0 15px;
                            color: #EAEAEA;
                        }
                        button {
                            color: #10C786;
                            outline: none;
                            border: none;
                            background: #fff;
                        }
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .d1 {
                        width: 200px;
                        padding-left: 40px;
                    }
                    .d2 {
                        width: 150px;
                    }
                    .d3 {
                        width: 220px;
                    }
                    .d4 {
                        width: 230px;
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
        &-table-else {
            width: 100%;
            margin-top: 50px;
            text-align: left;
            border: 1px solid #EAEAEA;
            border-collapse: collapse;
            text-indent: 40px;
            tr {
                height: 60px;
                line-height: 60px;
                border: 1px solid #EAEAEA;
                th {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    background: #FAFAFA;
                }
                td {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    button {
                        color: #10C786;
                        outline: none;
                        border: none;
                        background: #fff;
                    }
                }
            }
        }
        &-bottom {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            button {
                width: 120px;
                height: 30px;
                outline: none;
                background: #10C786;
                border: none;
                border-radius: 4px;
                color: #fff;
            }
        }
    }
}
</style>
