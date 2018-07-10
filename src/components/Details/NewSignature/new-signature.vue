<template>
    <div class="box">
        <div class="top">
            <div class="header-b">
                <Header class="header" />
            </div>
        </div>
        <new-signature-top :fileName="fileName" :DocKey="Doc_key"></new-signature-top>
        <div class="write">
            <el-form class="write-contract" :model="form" :rules="rules" ref="form">
                <p class="write-contract-title"><span></span>合同信息填写</p>
                <div class="write-contract-content">
                    <div class="write-contract-content-name">
                        <span>合同名称:</span>
                        <el-form-item prop="title">
                            <el-input type="text" placeholder="请填写合同名称" v-model.trim="form.title"></el-input>
                        </el-form-item>
                    </div>
                    <div class="write-contract-content-time">
                        <span>截止时间:</span>
                        <div class="write-contract-content-time-right">
                            <!-- <div>
                                <el-radio v-model="form.timeRadio" label="1">有</el-radio>
                                <el-radio v-model="form.timeRadio" label="0">无</el-radio>
                            </div> -->
                            <el-form-item class="block" prop="expire_time">
                                <el-date-picker
                                    v-model="form.expire_time"
                                    type="datetime"
                                    placeholder="无截止时间"
                                    size="small"
                                    :picker-options="pickerOptions"
                                    >
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="write-contract-content-order">
                        <span>签署顺序:</span>
                        <div class="order-radio">
                            <el-radio v-model="form.in_sequence" label="1">顺序签署</el-radio>
                            <el-radio v-model="form.in_sequence" label="0">无序签署</el-radio>
                        </div>
                    </div>
                    <div class="write-contract-content-email">
                        <span>签署完成副本发至邮箱:</span>
                        <div class="send-email">
                            <div class="radio">
                                <el-radio v-model="form.set_email" label="1">是</el-radio>
                                <el-radio v-model="form.set_email" label="0">否</el-radio>
                            </div>
                            <el-form-item prop="email">
                                <el-input type="email" placeholder="请填写邮箱地址" v-model="form.email" :disabled="form.set_email === '0'"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <div class="write-people">
                <p class="write-people-title"><span></span>添加签署人</p>
                <table class="write-people-table">
                    <tr class="table-header">
                        <th style="width: 10%">顺序</th>
                        <th style="width: 10%">姓名</th>
                        <th style="width: 20%">手机号码</th>
                        <th style="width: 25%">邮箱</th>
                        <!-- <th style="width: 15%">状态</th> -->
                        <th style="width: 20%">操作</th>
                    </tr>
                    <tr v-for="(item, index) in arr" :key="index">
                        <td><div>{{ index + 1 }}</div></td>
                        <td><div>{{ item.name }}</div></td>
                        <td><div>{{ item.mobile }}</div></td>
                        <td><div>{{ item.email }}</div></td>
                        <!-- <td><div class="waitting">{{ item.is_register ? '已注册' : '未注册'}}<div class="waitting-icon" :class="item.is_register ? 'waitting-icon-green' : 'waitting-icon-red'"></div></div></td> -->
                        <td class="btn">
                            <el-button type="primary" @click="up(index)" :disabled="index === 0" :class="{ 'disab' : index === 0 }">上移</el-button>
                            <span class="bg">|</span>
                            <el-button type="primary" @click="down(index)" :disabled="index === arr.length-1" :class="{ 'disab' : index === arr.length-1 }">下移</el-button>
                            <span class="bg">|</span>
                            <el-button type="primary" @click="deleted(index)">删除</el-button>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td>1</td>
                        <td>风清扬</td>
                        <td>12349850419</td>
                        <td>xxx@123.com</td>
                        <td class="waitting">已注册<div class="waitting-icon" :class="true ? 'waitting-icon-green' : 'waitting-icon-red'"></div></td>
                        <td class="btn">
                            <button>上移</button>
                            <span class="bg">|</span>
                            <button>下移</button>
                        </td>
                    </tr> -->
                </table>
                <div class="write-people-btn">
                    <button @click="addContracts">从联系人添加</button>
                    <!-- <button @click="addNewContract">添加新的签署人</button> -->
                </div>
            </div>
            <div class="write-remark">
                <p class="write-remark-title"><span></span>合同备注（选填）</p>
                <textarea class="write-remark-text" placeholder="请填写合同备注信息（不超过50个字符）" v-model="form.remark" maxlength="50" />
                <div class="write-remark-btn">
                    <el-button @click="next">下一步</el-button>
                    <button @click="setToDraft">保存到草稿箱</button>
                </div>
            </div>
            <div class="addContracts" v-show="show1">
                <div class="contracts-box">
                    <i class="el-icon-close" @click="close"></i>
                    <p class="title">选择联系人</p>
                    <div class="contracts">
                        <div class="search-box">
                            <input type="text" class="str" placeholder="输入新联系人名称或手机号" v-model="str" />
                            <el-button type="primary" class="search" @click="search">搜索</el-button>
                        </div>
                        <ul class="ul" v-if="!str">
                            <li class="li" v-for="(contact, index) in contacts" :key="index">
                                <div class="name">{{ contact.realName || contact.name }}</div>
                                <div class="number">{{ contact.cell_phone || contact.mobile }}</div>
                                <el-button @click="addContract(index)" type="text">添加</el-button>
                            </li>
                        </ul>
                        <ul class="ul" v-else>
                            <li class="li" v-for="(contact, index) in searchContacts" :key="index">
                                <div class="name">{{ contact.name }}</div>
                                <div class="number">{{ contact.mobile }}</div>
                                <el-button @click="addContact(contact.mobile)" type="text">添加联系人</el-button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- <div class="addContracts" v-show="show2">
                <div class="contracts-box">
                    <i class="el-icon-close" @click="close"></i>
                    <p class="title">新添签署人</p>
                    <div class="contracts">
                        <ul class="ul">
                            <li class="li" v-for="(contact, index) in contacts" :key="index">
                                <div class="name">{{ contact.realName }}</div>
                                <div class="number">{{ contact.cell_phone }}</div>
                                <el-button @click="addContract(index)" type="text">添加</el-button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import NewSignatureTop from './new-signature-top';
import Header from '../header';
import { timeDisposal } from '../../../common/js/timeDisposal';
import { fillInContactInformation, setDraft, getContractInformation } from '../../../api/contract';
import { emailReg } from '../../../common/js/validate';
import { getContacts, searchContact, addContact } from '../../../api/details';
export default {
    data () {
        let validateTitle = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入文件标题'));
            } else {
                callback();
            }
        };
        let validateExpire_time = (rule, value, callback) => {
            // if (this.form.timeRadio === '1') {
                if (value === '') {
                    callback(new Error('请输入截止时间'));
                } else {
                    callback();
                }
            // } else {
            //     callback();
            // }
        };
        let validateEmail = (rule, value, callback) => {
            if (this.form.set_email === '1') {
                if (value === '') {
                    callback(new Error('请输入邮箱'));
                } else if (!emailReg.test(value)) {
                    callback(new Error('请输入正确的邮箱格式'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            arr: [],
            contractInfo: {},
            contacts: [],
            searchContacts: [],
            show1: false,
            show2: true,
            cntrt_no: null, // 上传完成后返回的合同标识
            Doc_key: null,
            url: null,
            fileName: '',
            img_key: null,
            signers: [], // json格式的数组，内容仅为用户的sn标识 例：[321,323]
            form: {
                title: '', // 合同标题
                in_sequence: '1', // 签署顺序
                // timeRadio: '0', // 是否截至时间
                expire_time: '', // 截至时间
                set_email: '0', // 是否发送邮箱
                email: '', // 邮箱
                remark: '' // 合同备注
            },
            str: '',
            mine: {},
            rules: {
                title: [
                    { validator: validateTitle, trigger: 'blur' }
                ],
                // expire_time: [
                //     { validator: validateExpire_time, trigger: 'change' }
                // ],
                email: [
                    { validator: validateEmail, trigger: 'blur' }
                ]
            },
            pickerOptions: {
                disabledDate (time) {
                    // return time - 0 < new Date() - 0;
                    return time - 0 < Date.now();
                }
            }
        }
    },
    created () {
        this.getContacts(this);
        console.log(this.$route.query)
        this.cntrt_no = this.$route.query.cntrt_no;
        getContractInformation(this.cntrt_no).then(res => {
            console.log(res)
            this.contractInfo = res.data.data;
            let data = res.data.data;
            this.fileName = data.file_name;
            this.Doc_key = data.file_path;
            this.form.email = data.email;
            this.form.remark = data.remark;
            this.form.in_sequence = '' + data.in_sequence;
            this.img_key = data.preview;
            this.arr = data.signer || [];
            // this.form.expire_time = data.expire_time || '';
            this.form.title = this.fileName.split('.')[0];
        })
        this.form.email = this.$store.getters.email;
    },
    methods: {
        getContacts (_this) {
            console.log('================')
            _this.mine = {
                realName: _this.$store.getters.name + ' (自己)',
                cell_phone: _this.$store.getters.mobile,
                cntt_user_sn: _this.$store.getters.user_sn,
                email: _this.$store.getters.email
            }
            getContacts(0, 0, 0).then(res => {
                _this.contacts = res.data.data || [];
                _this.contacts.unshift(_this.mine);
                console.log(_this.contacts)
            }).catch(error => {
                console.log(error)
            });
        },
        // 上移
        up (index) {
            if (index > 0) {
                this.arr.splice(index-1, 0, this.arr.splice(index, 1)[0]);
            }
        },
        // 下移
        down (index) {
            if (index < this.arr.length) {
                this.arr.splice(index+1, 0, this.arr.splice(index, 1)[0]);
            }
        },

        // 删除
        deleted (index) {
            this.arr.splice(index, 1);
        },
        next(){
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.signers.length = 0;
                    for (var item of this.arr) {
                        this.signers.push(item.ID);
                    }
                    if (this.signers.length === 0) {
                        this.$message({
                            message: '请添加签署人',
                            type: 'warning'
                        });
                    } else {
                        console.log(this.signers)
                        this.form.expire_time = this.form.expire_time === '' ? 0 : this.form.expire_time;
                        fillInContactInformation(this.cntrt_no, this.form.title, this.form.in_sequence, JSON.stringify(this.signers), timeDisposal(this.form.expire_time), this.form.set_email, this.form.email, this.form.remark).then(res => {
                            res.data.cntrt_no = this.cntrt_no;
                            console.log(res)
                            let data = JSON.stringify(res.data);
                            this.$router.push({
                                path:'add-signature',
                                query: {
                                    data,
                                    Doc_key: this.Doc_key,
                                    img_key: this.img_key
                                }
                            });
                        }).catch(error => {
                            console.log('发起失败')
                        });
                    }
                } else {
                    return false;
                }
            })
        },
        search () {
            searchContact(this.str).then(res => {
                console.log(res)
                this.searchContacts = [];
                if (res.data.data) {
                    for (var i=0; i<res.data.data.length; i++) {
                        this.searchContacts.push(res.data.data[i]);
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
                console.log(res)
                switch (res.data.error) {
                    case 0:
                        this.$message({
                            message: '联系人添加成功',
                            type: 'success',
                            showClose: true
                        });
                        this.searchContacts = [];
                        this.str = '';
                        this.getContacts(this);
                        break;
                    case 30026:
                        this.$message({
                            message: '联系人已经存在, 请不要重复添加',
                            type: 'warning',
                            showClose: true
                        })
                        break;
                    case 30018:
                        this.$message({
                            message: '请不要添加自己作为联系人',
                            type: 'warning',
                            showClose: true
                        });
                        break;
                    default:
                        break;
                }
            }).catch(error => {

            });
        },
        addContracts () {
            this.getContacts(this);
            this.show1 = true;
            // console.log(this.contacts)
        },
        addContract (index) {
            if (index > 0 && this.contacts[index].has_ca === 1) {
                let flag = true;
                for (var item of this.arr) {
                    if (item.ID === this.contacts[index].cntt_user_sn) {
                        flag = false;
                    }
                }
                if (flag) {
                    this.arr.push({
                        name: this.contacts[index].realName || this.contacts[index].name,
                        mobile: this.contacts[index].cell_phone || this.contacts[index].mobile,
                        ID: this.contacts[index].cntt_user_sn,
                        email: this.contacts[index].email
                    })
                } else {
                    this.$message({
                        message: '联系人已经存在,请不要重复添加',
                        type: 'warning'
                    });
                }
            } else if (index === 0) {
                let flag = true;
                for (var item of this.arr) {
                    if (item.ID === this.contacts[index].cntt_user_sn) {
                        flag = false;
                    }
                }
                if (flag) {
                    this.arr.push({
                        name: this.contacts[index].realName || this.contacts[index].name,
                        mobile: this.contacts[index].cell_phone || this.contacts[index].mobile,
                        ID: this.contacts[index].cntt_user_sn,
                        email: this.contacts[index].email
                    })
                } else {
                    this.$message({
                        message: '联系人已经存在,请不要重复添加',
                        type: 'warning'
                    });
                }
            } else {
                this.$message({
                    message: '该联系人尚未绑定CA证书,无法添加到签署人',
                    type: 'warning'
                });
            }
        },
        close () {
            this.show1 = false;
        },
        setToDraft () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.signers.length = 0;
                    for (var item of this.arr) {
                        this.signers.push(item.ID);
                    }
                    if (this.signers.length === 0) {
                        this.$message({
                            message: '请添加签署人',
                            type: 'warning'
                        });
                    } else {
                        this.form.expire_time = this.form.expire_time === '' ? 0 : this.form.expire_time;
                        setDraft(this.cntrt_no, this.form.title, this.form.in_sequence, JSON.stringify(this.signers), timeDisposal(this.form.expire_time), this.form.set_email, this.form.email, this.form.remark).then(res => {
                            console.log(res)
                            res.data.cntrt_no = this.cntrt_no;
                            let data = JSON.stringify(res.data);
                            this.$router.push({
                                    path:'/',
                                    // query: {
                                    //     data,
                                    //     Doc_key: this.Doc_key,
                                    // }
                            });
                        }).catch(error => {
                            console.log('shibai ')
                        });
                    }
                } else {
                    return false;
                }
            });
        }
    },
    components: {
        NewSignatureTop,
        Header
    }
}
</script>
<style lang="less" scoped>
.box {
    width: 100%;
    .top {
        width: 100%;
        height: 67px;
        .header-b {
            width: 100%;
            height: 67px;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            box-shadow: 0 0 5px 0 #d5d5d5;
            .header {
                margin: 0 auto;
            }
        }
    }
    .write {
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 1100px;
        margin-top: 35px;
        &-contract {
            width: 100%;
            padding-left: 10px;
            /deep/input {
                width: 305px;
                height: 35px;
            }
            &-title {
                display: flex;
                justify-content: left;
                align-items: center;
                height: 27px;
                line-height: 27px;
                font-size: 18px;
                color: #252525;
                font-weight: bold;
                span {
                    width: 3px;
                    height: 18px;
                    background: #000;
                    margin-right: 15px;
                }
            }
            &-content {
                width: 100%;
                height: 525px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: left;
                &-name {
                    width: 100%;
                    height: 80px;
                    padding-left: 20px;
                    font-size: 16px;
                    color: #595959;
                    border-bottom: 1px solid #F7F7F7;
                    display: flex;
                    align-items: center;
                    .el-form-item {
                        margin: auto 0;
                    }
                    span {
                        margin-right: 35px;
                        color: #595959;
                    }
                }
                &-time {
                    width: 100%;
                    height: 80px;
                    border-bottom: 1px solid #F7F7F7;
                    padding-left: 20px;
                    // margin-top: 40px;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    span {
                        margin-right: 35px;
                        color: #595959;
                    }
                    // &-right {
                        // height: 65px;
                        // display: flex;
                        // flex-direction: column;
                        // justify-content: space-between;
                        // align-items: left;
                        // .el-input--small {
                        //     width: 303px;
                        //     margin-top: 15px;
                        // }
                    // }
                    .block {
                        margin-top: 20px;
                    }
                }
                &-order {
                    width: 100%;
                    height: 120px;
                    border-bottom: 1px solid #F7F7F7;
                    padding-left: 20px;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    span {
                        margin-right: 35px;
                        color: #595959;
                    }
                }
                &-email {
                    width: 100%;
                    height: 120px;
                    padding-left: 20px;
                    font-size: 16px;
                    display: flex;
                    align-items: top;
                    margin-top: 50px;
                    span {
                        margin-right: 20px;
                        color: #595959;
                    }
                    .send-email {
                        display: flex;
                        flex-direction: column;
                        .radio {
                            width: 100px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-left: 13px;
                        }
                        .el-form-item {
                            width: 323px;
                            margin-top: 30px;
                            outline: none;
                            border-radius: 4px;
                            text-indent: 15px;
                        }
                    }
                }
            }
        }
        &-people {
            width: 100%;
            padding-left: 10px;
            &-title {
                display: flex;
                justify-content: left;
                align-items: center;
                height: 27px;
                line-height: 27px;
                font-size: 18px;
                color: #252525;
                font-weight: bold;
                span {
                    width: 3px;
                    height: 18px;
                    background: #000;
                    margin-right: 15px;
                }
            }
            .write-people-table {
                border: 1px solid #E8E8E8;
                margin: 30px 0 0 20px;
            }
            .write-people-table {
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
                        color: #252525;
                        font-weight: bold;
                    }
                    td {
                        color: #595959;
                    }
                    .waitting {
                        position: relative;
                        .waitting-icon {
                            width: 8px;
                            height: 8px;
                            position: absolute;
                            top: 50%;
                            margin-top: -4px;
                            left: 40px;
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
                        /deep/button {
                            border: none;
                            font-size: 14px;
                            color: #10C786;
                            background: #fff;
                            padding: 0;
                        }
                        .disab {
                            color: #cccccc;
                        }
                        .bg {
                            color: #E7E7E7;
                        }
                        .disabled {
                            color: #D9D9D9;
                            cursor: initial;
                        }
                    }
                }
            }
            &-btn {
                margin-top: 20px;
                margin-left: 20px;
                margin-bottom: 20px;
                button {
                    width: 162px;
                    height: 44px;
                    font-size: 16px;
                    color: #10C786;
                    border: 1px solid #7CE0BD;
                    border-radius: 5px;
                    background: #fff;
                    outline: none;
                    cursor: pointer;
                    margin-right: 25px;
                }
            }
        }
        &-remark {
            width: 100%;
            padding-left: 10px;
            &-title {
                display: flex;
                justify-content: left;
                align-items: center;
                height: 27px;
                line-height: 27px;
                font-size: 18px;
                color: #252525;
                font-weight: bold;
                span {
                    width: 3px;
                    height: 18px;
                    background: #000;
                    margin-right: 15px;
                }
            }
            &-text {
                min-width: 1150px;
                max-width: 1150px;
                max-height: 125px;
                min-height: 125px;
                padding: 20px;
                font-size: 16px;
                margin-top: 30px;
                margin-left: 20px;
                border: 1px solid #E8E8E8;
                border-radius: 5px;
                outline: none;
            }
            &-btn {
                margin-top: 65px;
                margin-left: 20px;
                margin-bottom: 60px;
                button {
                    width: 162px;
                    height: 44px;
                    font-size: 16px;
                    color: #10C786;
                    border: 1px solid #7CE0BD;
                    border-radius: 5px;
                    background: #fff;
                    outline: none;
                    cursor: pointer;
                    margin-right: 25px;
                }
                button:first-child {
                    background: #10C786;
                    color: #fff;
                }
            }
        }
        .addContracts {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.46);
            display: flex;
            align-items: center;
            justify-content: center;
            .contracts-box {
                width: 420px;
                height: 524px;
                background: #fff;
                position: relative;
                .el-icon-close {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    transform: scale(1.5);
                }
                .title {
                    text-align: center;
                    margin-top: 20px;
                    margin-bottom: 20px;
                    font-size: 18px;
                    color: #252525;
                }
                .contracts {
                    width: 350px;
                    margin: 0 auto;
                    height: 370px;
                    .search-box {
                        width: 100%;
                        height: 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                        .str {
                            width: 250px;
                            height: 100%;
                            font-size: 14px;
                            color: #888888;
                            text-indent: 10px;
                            outline: none;
                            border-radius: 4px;
                            border: none;
                            border: 1px solid #e4e4e4;
                        }
                        .search {
                            width: 90px;
                            height: 40px;
                            text-align: center;
                        }
                    }
                    .ul {
                        width: 100%;
                        height: 370px;
                        overflow-y: scroll;
                        border: 1px solid #e4e4e4;
                        border-radius: 4px;
                        .li {
                            margin: 0 auto;
                            width: 300px;
                            height: 60px;
                            font-size: 14px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .name {
                                width: 75px;
                                text-align: center;
                                color: #252525;
                            }
                            .number {
                                width: 150px;
                                text-align: center;
                                color: #B3B3B3;
                            }
                            .el-button {
                                width: 75px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
