<template>
    <div class="register">
        <div class="label">
            <el-form v-show="firstShow" class="label-first" :model="enterpriseForm1" :rules="rules" ref="enterpriseForm1">
                <div class="enterprise-mobile">
                    <el-form-item>
                        <el-input type="text" value="+86" :disabled="true" class="left"></el-input>
                    </el-form-item>
                    <el-form-item prop="enterpriseTel" :error="registerErrors.enterpriseTel">
                        <el-input type="text" placeholder="负责人手机号" class="right" v-model="enterpriseForm1.enterpriseTel"></el-input>
                    </el-form-item>
                </div>
                <div class="yzm">
                    <el-form-item prop="graphCode" :error="registerErrors.graphCode">
                        <el-input type="text" placeholder="图形验证码" class="first" v-model="enterpriseForm1.graphCode"></el-input>
                    </el-form-item>
                    <!-- <el-form-item> -->
                        <!-- <el-input type="text" placeholder="" :disabled="true" class="second"></el-input> -->
                            <!-- :src="'http://beta.51zbb.net/qbb/web/system/register/graphics/get?ignore=1&key=' + key" -->
                        <img
                            ref="graphCode"
                            :src="'http://beta.51zbb.net/qbb/system/register/graphics/' + key"
                            class="second"
                            width="90px"
                            height="50px"
                            @click="refresh"
                            alt="验证码">
                    <!-- </el-form-item> -->
                </div>
                <el-form-item class="email-yzm" prop="noteCode" :error="registerErrors.noteCode">
                    <el-input type="text" placeholder="短信验证码" v-model="enterpriseForm1.noteCode"></el-input>
                    <el-button type="text" :disabled="time !== 0" @click="getNoteCode">{{ time === 0 ? '发送' : time }}</el-button>
                </el-form-item>
                <el-button type="success" class="personal-register-btn" @click="firstNext">下一步</el-button>
                <el-button type="text" class="personal-back-btn" @click="backLogin">返回登录</el-button>
            </el-form>
            <el-form v-show="secondShow" class="label-second" :model="enterpriseForm2" :rules="rules" ref="enterpriseForm2">
                <el-form-item class="enterprise-name" prop="enterpriseName">
                    <el-input type="text" placeholder="企业名称" v-model="enterpriseForm2.enterpriseName"></el-input>
                </el-form-item>
                <el-form-item class="contact-name" prop="creditCode">
                    <el-input type="text" placeholder="企业信用代号" v-model="enterpriseForm2.creditCode"></el-input>
                </el-form-item>
                <el-form-item prop="principal">
                    <el-input type="text" placeholder="企业负责人姓名" class="second" v-model="enterpriseForm2.principal"></el-input>
                </el-form-item>
                <el-form-item class="message-yzm" prop="IDCardNo" :error="registerErrors.IDCardNo">
                    <el-input type="text" placeholder="负责人身份证" v-model="enterpriseForm2.IDCardNo"></el-input>
                </el-form-item>
                <el-button type="success" class="personal-register-btn" @click="secondNext">下一步</el-button>
                <el-button type="text" class="enterprise-register-btn" @click="secondNextBack">返回上一步</el-button>
            </el-form>
            <el-form class="label-third" v-show="thirdShow" :model="enterpriseForm3" :rules="rules" ref="enterpriseForm3">
                <el-form-item prop="pass">
                    <el-input type="password" placeholder="设置密码" v-model="enterpriseForm3.pass"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" placeholder="确认密码" v-model="enterpriseForm3.checkPass"></el-input>
                </el-form-item>
                <el-form-item class="checkbox" prop="protocol">
                    <el-checkbox v-model="enterpriseForm3.protocol"></el-checkbox>
                    <span @click.stop="seeDeal">我同意'<router-link to="/protocal" target="_blank">签宝宝用户协议</router-link>'</span>
                </el-form-item>
                <el-button type="success" class="personal-register-btn" @click="enterpriseRegister" v-show="thirdShow" >注册</el-button>
                <el-button type="text" class="enterprise-register-btn" @click="thirdBack">返回上一步</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
import { telReg, passwordReg, emailReg, graphReg, IDCardNoReg, creditCodeReg } from '../../../common/js/validate';
import { createRandom } from "../../../common/js/random";
import { sendMobileCode, getGraphCode, enterprisePassword } from "../../../api/register";
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
                if (this.enterpriseForm3.checkPass !== '') {
                    this.$refs.enterpriseForm3.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.enterpriseForm3.pass) {
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
        let validateProtocol = (rule, value, callback) => {
            if (!value) {
                callback(new Error('该选项必须勾选'));
            } else {
                callback();
            }
        };
        let validateCreditCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入企业社会信用代码'));
            } else if (!creditCodeReg.test(value)) {
                callback(new Error('企业信用代码格式不正确'));
            } else {
                callback();
            }
        };
        let validateIDCardNo = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入身份证号'));
            } else if (!IDCardNoReg.test(value)) {
                callback(new Error('身份号格式不正确'));
            } else {
                callback();
            }
        };
        return {
            firstShow: true,
            secondShow: false,
            thirdShow: false,
            enterpriseForm1: {
                enterpriseTel: '',
                graphCode: '',
                noteCode: ''
            },
            enterpriseForm2: {
                ukey: '',
                enterpriseName: '',
                creditCode: '',
                principal: '',
                IDCardNo: ''
            },
            enterpriseForm3: {
                pass: '',
                checkPass: '',
                protocol: true
            },
            registerErrors: {
                enterpriseTel: '',
                graphCode: '',
                noteCode: '',
                IDCardNo: ''
            },
            key: '',
            time: 0,
            startTime: 60,
            rules: {
                enterpriseTel: [
                    { validator: validateTel, trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                protocol: [
                    { validator: validateProtocol, trigger: 'change' }
                ],
                graphCode: [
                    { validator: validateCode, trigger: 'blur' }
                ],
                noteCode: [
                    { validator: validateCodeByNote, trigger: 'blur' }
                ],
                creditCode: [
                    { validator: validateCreditCode, trigger: 'blur' }
                ],
                IDCardNo: [
                    { validator: validateIDCardNo, trigger: 'blur' }
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
            this.$refs['enterpriseForm1'].validateField('enterpriseTel', error => {
                if (!error) {
                    this.$refs['enterpriseForm1'].validateField('graphCode', error => {
                        if (!error) {
                            this.registerErrors.enterpriseTel = '';
                            this.registerErrors.graphCode = '';
                            this.registerErrors.noteCode = '';
                            sendMobileCode(this.enterpriseForm1.enterpriseTel, this.key, this.enterpriseForm1.graphCode).then(res => {
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
                                        this.registerErrors.enterpriseTel = '该手机号已经被注册';
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
        start () {
            this.time = this.startTime;
            this.timer();
        },
        timer () {
            if (this.time > 0) {
                this.time--;
                setTimeout(this.timer, 1000);
            }
        },
        backLogin () {
            this.$router.push({
                path: '/initial/login'
            });
        },
        // 第一步
        firstNext () {
            this.$refs['enterpriseForm1'].validate((valid) => {
                if (valid) {
                    this.registerErrors.noteCode = '';
                    this.$store.dispatch('verficationMobileCode', this.enterpriseForm1).then(res => {
                        switch (res.data.error) {
                            case 0:
                                this.firstShow = false;
                                this.secondShow = true;
                                break;
                            case 30006:
                                this.registerErrors.noteCode = '参数错误'
                                break;
                            case 30007:
                                this.registerErrors.noteCode = '手机验证码验证失败';
                            default:
                                break;
                        }
                    }).catch(error => {
                        console.log('error')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 第二步
        secondNext () {
            this.$refs['enterpriseForm2'].validate((valid) => {
                if (valid) {
                    this.registerErrors.IDCardNo = '';
                    this.enterpriseForm2.ukey = this.$store.getters.ukey;
                    this.$store.dispatch('enterpriseInformation', this.enterpriseForm2).then(res => {
                        if (res === 0) {
                            this.secondShow = false;
                            this.thirdShow = true;
                        } else {
                            switch (res.data.error) {
                                case 30018:
                                    this.secondShow = false;
                                    this.thirdShow = true;
                                    this.registerErrors.IDCardNo = '无权操作';
                                    break;
                            
                                default:
                                    break;
                            }
                        }
                    }).catch(error => {

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        secondNextBack () {
            this.firstShow = true;
            this.secondShow = false;
            this.thirdShow = false;
        },
        thirdBack () {
            this.firstShow = false;
            this.secondShow = true;
            this.thirdShow = false;
        },
        // 企业注册
        enterpriseRegister () {
            this.$refs['enterpriseForm3'].validate((valid) => {
                if (valid) {
                    const enterprise_info = {
                        ukey: this.$store.getters.ukey,
                        checkPass: this.enterpriseForm3.checkPass
                    }
                    this.$store.dispatch('enterprisePassword', enterprise_info).then(res => {
                        console.log('企业注册回调外结果')
                        switch (res.data.error) {
                            case 0:
                                this.$router.push({
                                    path: '/registered-successfully'
                                })
                                break;
                            case 30018:
                                alert('无权操作');
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
        resetClick () {
            this.$refs['enterpriseForm1'].resetFields();
            this.$refs['enterpriseForm2'].resetFields();
            this.$refs['enterpriseForm3'].resetFields();
            this.firstShow = true;
            this.secondShow = false;
            this.thirdShow = false;
        }
    }
};
</script>

<style lang="less" scoped>
.register {
    .label {
        margin-top: 20px;
        /deep/input {
            height: 50px;
        }
        .personal-register-btn {
            background: #10C786;
            width: 323px;
            height: 50px;
        }
        .personal-back-btn {
            color: #b8b8b8;
            margin: 20px 0 0 0;
            padding: 0;
        }
        .enterprise-register-btn {
            color: #B8B8B8;
            margin-left: 0px;
        }
        /deep/.el-input {
            width: 323px;
        }
        &-first {
            .enterprise-mobile {
                width: 100%;
                display: flex;
                justify-content: space-between;
                .left {
                    width: 85px;
                }
                .right {
                    width: 232px;
                }
            }
            .yzm {
                display: flex;
                justify-content: space-between;
                .first {
                    width: 223px;
                }
                .second {
                    width: 90px;
                    height: 50px;
                    border: 1px solid #d5d5d5;
                    border-radius: 3px;
                }
            }
            .email-yzm  {
                position: relative;
                .el-button {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    margin-top: -20px;
                }
            }
            .personal-register-btn {
                margin-top: 20px;
            }
        }
        &-second {
            .tel {
                display: flex;
                justify-content: space-between;
                .first {
                    width: 83px;
                }
                .second {
                    width: 232px;
                }
            }
            .graph-yzm {
                display: flex;
                justify-content: space-between;
                .first {
                    width: 222px;
                }
                .second {
                    width: 93px;
                }
            }
            .message-yzm {
                position: relative;
                span {
                    font-size: 14px;
                    color: #10C786;
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    margin-top: -20px;
                    cursor: pointer;
                }
            }
            .personal-register-btn {
                margin-top: 20px;
            }
        }
        &-third {
            // .personal-register-btn {
            //     height: 50px;
            //     margin-top: 20px;
            // }
            width: 100%;
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: left;
            .enterprise-register-btn {
                width: 50px;
                margin-left: 0px;
            }
            .checkbox {
                width: 100%;
                display: flex;
                align-items: center;
                span {
                    margin-left: 5px;
                    cursor: pointer;
                    color: #dcdfe6;
                }
                a {
                    color: #10C786;
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
        }
    }
}
</style>
