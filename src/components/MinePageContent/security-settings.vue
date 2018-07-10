<template>
    <div class="settings-box">
        <div class="settings">
            <div class="settings-title bold"><span></span>安全设置</div>
            <el-tabs v-model="activeName" @tab-click="resetForm">
                <el-tab-pane label="修改密码" name="first">
                    <el-form class="change-psd" :model="changePsdForm" :rules="rules" ref="changePsdForm">
                        <el-form-item class="input-box" prop="oldPsd">
                            <el-input type="password" placeholder="输入旧密码" v-model="changePsdForm.oldPsd"></el-input>
                        </el-form-item>
                        <el-form-item class="input-box" prop="noteCode">
                            <el-input type="text" placeholder="短信验证码" v-model="changePsdForm.noteCode"></el-input>
                            <el-button type="text" class="get-yzm1" :disabled="time3 !== 0" @click="getNoteCodeByResetPassword">{{ time3 !== 0 ?  time3 : '获取验证码' }}</el-button>
                            <span></span>
                        </el-form-item>
                        <el-form-item class="input-box" prop="newPsd">
                            <el-input type="password" placeholder="输入新密码" v-model="changePsdForm.newPsd"></el-input>
                        </el-form-item>
                        <el-form-item class="input-box" prop="newCheckPsd">
                            <el-input type="password" placeholder="确认新密码" v-model="changePsdForm.newCheckPsd"></el-input>
                        </el-form-item>
                    </el-form>
                    <button class="btn1" @click="setNewPassword">确认</button>
                </el-tab-pane>
                <el-tab-pane label="修改手机" name="second">
                    <div v-show="isShow" class="change-tel-first">
                        <el-form :model="changeTelForm1" :rules="rules" ref="changeTelForm1">
                            <p>使用当前手机{{ mobile }}接收验证码</p>
                            <el-form-item class="input-box" prop="noteCode" :error="resetErrors.noteCode">
                                <el-input type="text" placeholder="短信验证码" v-model="changeTelForm1.noteCode"></el-input>
                                <el-button class="get-yzm2" type="text" :disabled="time1 !== 0" @click="getNoteCodeByOldMobile">{{ time1 !== 0 ?  time1 : '获取验证码' }}</el-button>
                            </el-form-item>
                        </el-form>
                        <button class="next-step" @click="nextStep">下一步</button>
                    </div>
                    <div v-show="!isShow" class="change-tel-second">
                        <el-form :model="changeTelForm2" :rules="rules" ref="changeTelForm2">
                            <el-form-item class="input-box" prop="newTel">
                                <el-input type="text" placeholder="输入新手机号" v-model="changeTelForm2.newTel" ></el-input>
                            </el-form-item>
                            <el-form-item class="input-box">
                                <el-input type="text" placeholder="短信验证码" v-model="changeTelForm2.newNoteCode" ></el-input>
                                <el-button type="text" class="get-yzm3" @click="getNoteCodeByNewMobile">{{ time2 !== 0 ?  time2 : '获取验证码' }}</el-button>
                            </el-form-item>
                            <div class="change-tel-second-btn">
                            </div>
                        </el-form>
                        <div>
                            <!-- <button @click="nextStep" class="next-step">上一步</button> -->
                            <button class="btn2" @click="sendNoteCodeByNewMobile">确定</button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { telReg, passwordReg } from '../../common/js/validate';
import { removeToken } from '../../common/js/auth';
import { getNoteCodeByOldMobile, sendNoteCodeByOldMobile, getNoteCodeByNewMobile, sendNoteCodeByNewMobile, getNoteCodeByResetPassword, setNewPassword } from '../../api/details';
export default {
    data () {
        let validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入短信验证码'));
            } else {
                callback();
            }
        };
        let validateTel = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!telReg.test(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback();
            }
        };
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.changePsdForm.newCheckPsd !== '') {
                    this.$refs.changePsdForm.validateField('newCheckPsd');
                }
                callback();
            }
        };
        let validatePass1 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (!passwordReg.test(value)) {
                callback(new Error('密码需要包含一个英文字母和数字,且只能为英文字母和数字的组合,并不少于6位'))
            } else {
                if (this.changePsdForm.newCheckPsd !== '') {
                    this.$refs.changePsdForm.validateField('newCheckPsd');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.changePsdForm.newPsd) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback();
            }
        };
        return {
            activeName: 'first',
            time1: 0,
            time2: 0,
            time3: 0,
            startTime: 60,
            mobile: '',
            isCountDown: false,
            isShow: true,
            ukey: '',
            changePsdForm: {
                oldPsd: '',
                noteCode: '',
                newPsd: '',
                newCheckPsd: ''
            },
            changeTelForm1: {
                noteCode: ''
            },
            resetErrors: {
                noteCode: '',
                newNoteCode: ''
            },
            changeTelForm2: {
                newTel: '',
                newNoteCode: ''
            },
            rules: {
                oldPsd: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                newPsd: [
                    { validator: validatePass1, trigger: 'blur' }
                ],
                newCheckPsd: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                newTel: [
                    { validator: validateTel, trigger: 'blur' }
                ],
                noteCode: [
                    { validator: validateCode, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        nextStep () {
            this.$refs['changeTelForm1'].validate(valid => {
                if (valid) {
                    sendNoteCodeByOldMobile(this.changeTelForm1.noteCode).then(res => {
                        this.resetErrors.noteCode = '';
                        switch (res.data.error) {
                            case 0:
                                this.ukey = res.data.data;
                                this.isShow = !this.isShow;
                                break;
                            case 30007:
                                this.resetErrors.noteCode = '手机验证码验证失败';
                                break;
                            default:
                                break;
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        },
        getNoteCodeByResetPassword () {
            this.$refs['changePsdForm'].validateField('oldPsd', error => {
                if (!error) {
                    getNoteCodeByResetPassword(this.changePsdForm.oldPsd).then(res => {
                        switch (res.data.error) {
                            case 0:
                                this.start3();
                                break;
                        
                            default:
                                break;
                        }
                        
                    }).catch(error => {

                    });
                } else {
                    return false;
                }
            })
        },
        getNoteCodeByOldMobile () {
            getNoteCodeByOldMobile().then(res => {
                if (res.data.error === 0) {
                    this.start1();
                }
            })
        },
        getNoteCodeByNewMobile () {
            getNoteCodeByNewMobile(this.ukey, this.changeTelForm2.newTel).then(res => {
                console.log(res)
            }).catch(error => {

            });
        },
        sendNoteCodeByNewMobile () {
            this.$refs['changeTelForm2'].validate(valid => {
                if (valid) {
                    sendNoteCodeByNewMobile(this.changeTelForm2.newNoteCode).then(res => {
                        switch (res.data.error) {
                            case 0:
                                this.$message({
                                    message: '手机重置成功',
                                    type: 'success',
                                });
                                this.$refs['changeTelForm1'].resetFields();
                                this.$refs['changeTelForm2'].resetFields();
                                break;
                        
                            default:
                                break;
                        }
                    }).catch(error => {

                    });

                }
            })
        },
        start1 () {
            this.time1 = this.startTime;
            this.timer1();
        },
        start2 () {
            this.timer2 = this.startTime;
            this.timer2();
        },
        start3 () {
            this.time3 = this.startTime;
            this.timer3();
        },
        timer1 () {
            if (this.time1 > 0) {
                this.time1--;
            };
            setTimeout(this.timer1, 1000);
        },
        timer2 () {
            if (this.time2 > 0) {
                this.time2--;
            };
            setTimeout(this.timer2, 1000);
        },
        timer3 () {
            if (this.time3 > 0) {
                this.time3--;
            };
            setTimeout(this.timer3, 1000);
        },
        setNewPassword () {
            this.$refs['changePsdForm'].validate((valid) => {
                if (valid) {
                    setNewPassword(this.changePsdForm.noteCode, this.changePsdForm.newCheckPsd).then(res => {
                        switch (res.data.error) {
                            case 0:
                                this.$message({
                                    message: '密码重置成功',
                                    type: 'success',
                                });
                                removeToken();
                                this.$router.push({
                                    path: '/initial'
                                });
                                break;
                        
                            default:
                                this.$message({
                                    message: '密码重置失败',
                                    type: 'warning',
                                });
                                break;
                        }
                    }).catch(error => {

                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm () {
            this.mobile = this.$store.getters.mobile;
            this.$refs['changePsdForm'].resetFields();
            this.$refs['changeTelForm1'].resetFields();
            this.$refs['changeTelForm2'].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.settings-box {
    width: 100%;
    .settings {
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
        .el-tabs {
            margin-top: 30px;
            margin-left: 20px;
            ::after {
                background-color: #ffffff;
            }
            /deep/input {
                height: 50px;
                width: 320px;
            }
            .btn1 {
                width: 80px;
                height: 30px;
                outline: none;
                border: none;
                background: #10C786;
                color: #ffffff;
                border-radius: 5px;
                margin-top: 20px;
                cursor: pointer;
                margin-bottom: 50px;
            }
            .change-psd {
                height: 300px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: left;
                margin-top: 30px;
                .input-box {
                    width: 320px;
                    padding-bottom: 8px;
                    position: relative;
                    .get-yzm1 {
                        width: 80px;
                        height: 28px;
                        border: none;
                        text-decoration: underline;
                        position: absolute;
                        top: 50%;
                        margin-top: -18px;
                        right: 15px;
                    }
                }
            }
            .change-tel-first {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: left;
                margin-top: 30px;
                margin-bottom: 50px;
                .input-box {
                    width: 320px;
                    margin: 20px 0 40px 0;
                    position: relative;
                    .get-yzm2 {
                        width: 80px;
                        height: 28px;
                        border: none;
                        position: absolute;
                        top: 50%;
                        margin-top: -18px;
                        right: 15px;
                    }
                }
                .next-step {
                    width: 80px;
                    height: 30px;
                    border-radius: 5px;
                    outline: none;
                    border: none;
                    background: #10C786;
                    color: #fff;
                }
            }
            .change-tel-second {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: left;
                margin-top: 30px;
                .el-form {
                    height: 150px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }
                .input-box {
                    width: 320px;
                    margin-bottom: 10px;
                    position: relative;
                    .get-yzm3 {
                        width: 80px;
                        height: 28px;
                        border: none;
                        position: absolute;
                        top: 50%;
                        margin-top: -18px;
                        right: 15px;
                    }
                }
                .btn2 {
                    width: 80px;
                    height: 30px;
                    border-radius: 5px;
                    outline: none;
                    border: none;
                    background: #10C786;
                    color: #fff;
                }
                .next-step {
                    width: 80px;
                    height: 30px;
                    border-radius: 5px;
                    outline: none;
                    border: 1px solid #10C786;
                    background: #fff;
                    color: #10C786;
                    margin-right: 60px;
                }
            }
        }
    }
}
</style>
