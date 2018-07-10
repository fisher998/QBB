<template>
    <div class="lost-pass-box">
        <h4 class="title">找回密码</h4>
        <el-form class="label" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="mobile" class="tel" :error="resetErrors.mobile">
                <el-input v-model="ruleForm.mobile" placeholder="手机号" class="label-tel"></el-input>
            </el-form-item>
            <div class="yzm">
                <el-form-item prop="graphCode" :error="resetErrors.graphCode">
                    <el-input type="text" placeholder="图形验证码" class="graph-code" v-model="ruleForm.graphCode"></el-input>
                </el-form-item>
                <img
                    ref="graphCode"
                    @click="refresh"
                    :src="'http://beta.51zbb.net/qbb/system/register/graphics/'+ key" 
                    class="second"
                    width="90px"
                    height="50px"
                    alt="验证码">
            </div>
            <el-form-item prop="mobile" class="tel" :error="resetErrors.noteCode">
                <el-input v-model="ruleForm.noteCode" placeholder="短信验证码" class="noteCode"></el-input>
                <el-button type="text" class="message-code" :disabled="time !== 0" @click="getNoteCode">{{ time === 0 ? '发送' : time }}</el-button>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" v-model="ruleForm.password" placeholder="密码" class="label-psd"></el-input>
            </el-form-item>

            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" placeholder="确认密码" class="label-psd"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="resetPassword">重置</el-button>
    </div>
</template>

<script>
import { telReg, passwordReg, graphReg } from '../../../common/js/validate';
import { createRandom } from '../../../common/js/random';
import { getResetPasswordNoteCode, resetPassword } from '../../../api/register';
export default {
    data () {
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
            } else if (!passwordReg.test(value)) {
                callback(new Error('密码需要包含一个英文字母和数字,且只能为英文字母和数字的组合,并不少于6位'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback();
            }
        };
        let validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('图形验证码不能为空'));
            } else if (!graphReg.test(value)) {
                callback(new Error('图形验证码为四位数字'));
            } else {
                callback();
            }
        };
        let validateCodeByNote = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入短信验证码'));
            } else {
                callback();
            }
        };
        return {
            key: null,
            time: 0,
            startTime: 60,
            ruleForm: {
                mobile: '',
                graphCode: '',
                noteCode: '',
                password: '',
                checkPass: ''
            },
            resetErrors: {
                mobile: '',
                graphCode: '',
                noteCode: ''
            },
            rules: {
                mobile: [
                    { validator: validateTel, trigger: 'blur' }
                ],
                graphCode: [
                    { validator: validateCode, trigger: 'blur' }
                ],
                noteCode: [
                    { validator: validateCodeByNote, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.key = createRandom();
    },
    methods: {
        refresh () {
            this.key = createRandom();

        },
        getNoteCode () {
            this.$refs['ruleForm'].validateField('mobile', error => {
                this.resetErrors.mobile = '';
                this.resetErrors.graphCode = '';
                if (!error) {
                    this.$refs['ruleForm'].validateField('graphCode', error => {
                        if (!error) {
                            getResetPasswordNoteCode(this.ruleForm.mobile, this.key, this.ruleForm.graphCode).then(res => {
                                switch (res.data.error) {
                                    case 0:
                                        this.start();
                                        break;
                                    case 30001:
                                        this.resetErrors.noteCode = '短信验证码发送失败';
                                        break;
                                    case 30004:
                                        this.resetErrors.noteCode = '24小时内发送短信数目超过限制';
                                        break;
                                    case 30016:
                                        this.resetErrors.graphCode = '图形验证码错误';
                                        break;
                                    case 30019:
                                        this.resetErrors.noteCode = '60秒内存在尚未使用的验证码';
                                        break;
                                    default:
                                        break;
                                }
                            }).catch(error => {
                                console.log(error);
                            })

                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        resetPassword () {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    resetPassword(this.ruleForm.mobile, this.ruleForm.checkPass, this.ruleForm.noteCode).then(res => {
                        this.resetErrors.mobile = '';
                        this.resetErrors.noteCode = '';
                        switch (res.data.error) {
                            case 0:
                                alert('密码重置成功')
                                break;
                            case 30007:
                                this.resetErrors.noteCode = '请输入正确的手机验证码'
                                break;
                            case 30017:
                                this.resetErrors.noteCode = '操作等待时间过长';
                                break;
                            default:
                                break;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                } else {
                    console.log('error submit!！');
                    return false;
                }
            });
        },
        start () {
            this.time = this.startTime;
            this.timer();
        },
        timer () {
            if (this.time > 0) {
                this.time--;
            };
            setTimeout(this.timer, 1000);
        }
    }
}
</script>

<style lang="less" scoped>
.lost-pass-box {
    .title {
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        margin-bottom: 30px;
    }
    input {
        width: 323px;
    }
    /deep/input {
        height: 50px;
    }
    .el-form-item {
        margin-bottom: 30px;
    }
    .yzm {
        width: 323px;
        display: flex;
        justify-content: space-between;
        /deep/.graph-code {
            width: 220px;
        }
        img {
            border: 1px solid #d5d5d5;
            border-radius: 4px;
        }
    }
    .tel {
        position: relative;
        /deep/.el-button {
            width: auto;
            position: absolute;
            top: 50%;
            margin-top: -25px;
            right: 15px;
        }
    }
    .el-button {
        width: 323px;
        height: 50px;
    }
}
</style>
