<template>
    <div class="register">
        <div class="label">
            <el-form :model="personalForm" :rules="rules" ref="personalForm">
                <div class="tel">
                    <el-form-item>
                        <el-input type="number" :disabled="true" placeholder="+86" class="first"></el-input>
                    </el-form-item>
                    <el-form-item prop="personalTel" :error="registerErrors.personalTel">
                        <el-input type="text" placeholder="手机号" class="second" v-model="personalForm.personalTel"></el-input>
                    </el-form-item>
                </div>
                <div class="yzm">
                    <el-form-item prop="graphCode" :error="registerErrors.graphCode">
                        <el-input type="text" placeholder="图形验证码" class="first" v-model="personalForm.graphCode"></el-input>
                    </el-form-item>
                    <!-- <el-form-item> -->
                        <!-- <el-input type="text" class="second" :disabled="true"></el-input> -->
                        <img
                            ref="graphCode"
                            @click="refresh"
                            :src="'http://beta.51zbb.net/qbb/system/register/graphics/'+ key" 
                            class="second"
                            width="90px"
                            height="50px"
                            alt="验证码">
                    <!-- </el-form-item> -->
                </div>
                <el-form-item class="dxyzm" prop="noteCode" :error="registerErrors.noteCode">
                    <el-input type="text" placeholder="短信验证码" v-model="personalForm.noteCode"></el-input>
                    <el-button type="text" class="message-code" :disabled="time !== 0" @click="getNoteCode">{{ time === 0 ? '发送' : time }}</el-button>
                </el-form-item>
                <el-form-item prop="pass">
                    <el-input type="password" class="firstPsd" placeholder="密码" v-model="personalForm.pass"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" class="secondPsd" placeholder="确认密码" v-model="personalForm.checkPass"></el-input>
                </el-form-item>
                <el-form-item class="checkbox" prop="protocol">
                    <el-checkbox v-model="personalForm.protocol"></el-checkbox>
                    <span @click.stop="seeDeal">我同意'<router-link to="/protocal" target="_blank">签宝宝用户协议</router-link>'</span>
                </el-form-item>
                <el-button type="success" class="personal-register-btn" @click="personal">注册</el-button>
                <el-button type="text" class="personal-back-btn" @click="backLogin">返回登录</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import { telReg, passwordReg, emailReg, graphReg } from '../../../common/js/validate';
import { createRandom } from '../../../common/js/random';
import { sendMobileCode } from "../../../api/register";
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
                if (this.personalForm.checkPass !== '') {
                    this.$refs.personalForm.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.personalForm.pass) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback();
            }
        };
        let validateProtocol = (rule, value, callback) => {
            if (!value) {
                callback(new Error('该选项必须勾选'));
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
            personalForm: {
                personalTel: '',
                graphCode: '',
                noteCode: '',
                pass: '',
                checkPass: '',
                protocol: true
            },
            registerErrors: {
                personalTel: '',
                graphCode: '',
                noteCode: ''
            },
            key: '',
            time: 0,
            startTime: 60,
            rules: {
                personalTel: [
                    { validator: validateTel, trigger: 'blur' }
                ],
                graphCode: [
                    { validator: validateCode, trigger: 'blur' }
                ],
                noteCode: [
                    { validator: validateCodeByNote, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                protocol: [
                    { validator: validateProtocol, trigger: 'change' }
                ]
            }
        };
    },
    created () {
        this.key = createRandom();
    },
    methods: {
        // 重置图形验证码
        refresh () {
            this.key = createRandom();
        },
        getNoteCode () {
            this.$refs['personalForm'].validateField('personalTel', error => {
                if (!error) {
                    this.$refs['personalForm'].validateField('graphCode', error => {
                        if (!error) {
                            this.registerErrors.personalTel = '';
                            this.registerErrors.graphCode = '';
                            this.registerErrors.noteCode = '';
                            sendMobileCode(this.personalForm.personalTel, this.key, this.personalForm.graphCode).then(res => {
                                switch (res.data.error) {
                                    case 0:
                                        // 发送短信验证码成功
                                        this.start();
                                        break;
                                    case 30001:
                                        this.registerErrors.noteCode = '短信验证码发送失败';
                                        break;
                                    case 30004:
                                        this.registerErrors.noteCode = '24小时内发送短信数目超过限制';
                                        break;
                                    case 30005:
                                        this.registerErrors.personalTel = '该手机号已经被注册';
                                        break;
                                    case 30016:
                                        this.registerErrors.graphCode = '图形验证码错误';
                                        break;
                                    case 30019:
                                        this.registerErrors.noteCode = '60秒内存在尚未使用的验证码';
                                        break;
                                    default:
                                        break;
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        personal () {
            this.$refs['personalForm'].validate((valid) => {
                if (valid) {
                    this.registerErrors.noteCode = '';
                    this.$store.dispatch('register', this.personalForm).then(res => {
                        switch (res.data.error) {
                            case 0:
                                // 注册成功
                                this.$router.push({
                                    path: '/registered-successfully'
                                });
                                break;
                            case 30007:
                                this.registerErrors.noteCode = '请输入正确的手机验证码'
                                break;
                            case 30017:
                                this.registerErrors.noteCode = '操作等待时间过长';
                                break;
                            default:
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
        start () {
            this.time = this.startTime;
            this.timer();
        },
        timer () {
            if (this.time>0) {
                this.time--;
                setTimeout(this.timer, 1000);
            }
        },
        seeDeal () {
            console.log('5555555555555')
        },
        resetClick () {
            this.$refs['personalForm'].resetFields();
        },
        backLogin () {
            this.$router.push({
                path: '/initial/login'
            });
        }
    },
};
</script>

<style lang="less" scoped>
.register {
    .label {
        // margin-top: 20px;
        /deep/input {
            height: 50px;
            margin-top: 10px;
        }
        .tel {
            display: flex;
            justify-content: space-between;
            .first {
                width: 85px;
            }
            .second {
                width: 232px;
            }
        }
        .yzm {
            display: flex;
            justify-content: space-between;
            .first {
                width: 220px;
            }
            .second {
                border: 1px solid #d5d5d5;
                border-radius: 5px;
                margin-top: 10px;
            }
        }
        .dxyzm {
            position: relative;
            .message-code {
                position: absolute;
                top: 50%;
                margin-top: -15px;
                right: 15px;
                border: none;
                background: none;
            }
        }
        .checkbox {
            width: 100%;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            a {
                color: #10C786;
            }
            span {
                margin-left: 5px;
                cursor: pointer;
                color: #dcdfe6;
            }
            input {
                width: 28px;
                height: 28px;
                margin-right: 20px;
                cursor: pointer;
            }
            /deep/.el-checkbox {
                width: 30px;
                height: 28px;
                .el-checkbox__input {
                    width: 28px;
                    height: 28px;
                    .el-checkbox__inner {
                        width: 28px;
                        height: 28px;
                        &::after {
                            background: none;
                            transform: rotate(45deg) scale(2.5) translate(3.5px, -0.5px);
                        }
                    }
                }
            }
            label {
                font-size: 14px;
                color: #B8B8B8;
                letter-spacing: 0;
                cursor: pointer;
            }
        }
        .personal-register-btn {
            background: #10C786;
            width: 320px;
            height: 50px;
            // margin-top: 10px;
        }
        .personal-back-btn {
            color: #b8b8b8;
            margin: 20px 0 0 0;
            padding: 0;
        }
        // 企业用户注册
    }
}
</style>
