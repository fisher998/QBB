<template>
    <div class="login">
        <h4>登录</h4>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="个人登陆" name="first"> -->
                <el-form class="label" :model="ruleForm1" :rules="rules" ref="ruleForm1">
                    <el-form-item prop="mobile" class="tel" :error="loginErrors.mobile">
                        <el-input v-model="ruleForm1.area_code" :disabled="true" class="label-ph"></el-input>
                        <el-input v-model="ruleForm1.mobile" placeholder="手机号" class="label-tel"></el-input>
                    </el-form-item>
                    <el-form-item class="tel" prop="password" :error="loginErrors.password">
                        <el-input type="password" v-model="ruleForm1.password" placeholder="密码" class="label-psd"></el-input>
                    </el-form-item>
                    <!-- <span class="lost-psd">忘记密码?</span> -->
                    <router-link class="lost-psd" to="lost-pass">忘记密码?</router-link>
                    <el-button type="success" class="login-btn" @click="login">登录</el-button>
                </el-form>
            <!-- </el-tab-pane> -->
            <!-- 
            <el-tab-pane label="企业登陆" name="second">
                <el-form class="label" :model="ruleForm2" :rules="rules" ref="ruleForm2">
                    <el-form-item prop="mobile" :error="loginErrors.mobile">
                        <el-input v-model="ruleForm2.area_code" :disabled="true" class="label-ph"></el-input>
                        <el-input type="text" placeholder="负责人手机号" v-model="ruleForm2.mobile" class="label-tel"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" :error="loginErrors.password">
                        <el-input type="password" placeholder="密码" v-model="ruleForm2.password"></el-input>
                    </el-form-item>
                    <router-link class="lost-psd" to="lost-pass">忘记密码?</router-link>
                    <el-button type="success" class="login-btn" @click="entsso()">登陆</el-button>
                </el-form>
            </el-tab-pane> 
            -->
        </el-tabs>
        <div class="register">没有账户？<router-link to="register">现在注册</router-link></div>
    </div>
</template>

<script>
import { telReg, passwordReg, emailReg } from '../../../common/js/validate';
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
        // let validatePass = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入密码'));
        //     } else if (!passwordReg.test(value)) {
        //         callback(new Error('密码需要包含一个英文字母和数字,且只能为英文字母和数字的组合,并不少于6位'))
        //     } else {
        //         callback();
        //     }
        // };
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        return {
            activeName: "first",
            ruleForm1: {
                mobile: '',
                password: '',
                area_code: '+86'
            },
            ruleForm2: {
                mobile: '',
                password: '',
                area_code: '+86'
            },
            loginErrors: {
                mobile: '',
                password: ''
            },
            rules: {
                mobile: [
                    { validator: validateTel, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 个人登陆
        login () {
            this.$refs['ruleForm1'].validate((valid) => {
                if (valid) {
                    // 成功
                    this.loginErrors.mobile = '';
                    this.loginErrors.password = '';
                    this.$store.dispatch('adminLogin', this.ruleForm1).then(res => {
                        switch (res.data.error) {
                            case 0:
                                this.$router.push({
                                    path: '/'
                                });
                                break;
                            case 30009:
                                this.loginErrors.mobile = '用户不存在';
                                break;
                            case 30010:
                                this.loginErrors.password = '用户密码错误';
                                break;
                            default:
                                break;
                        }
                    }).catch( error => {
                        
                    });
                } else {
                    return false;
                }
            });
        },
        // 企业登陆
        entsso () {
            this.$refs['ruleForm2'].validate((valid) => {
                if (valid) {
                // 登陆成功
                    this.loginErrors.mobile = '';
                    this.loginErrors.password = '';
                    this.$store.dispatch('adminLogin', this.ruleForm2).then(res => {
                        switch (res) {
                            case 0:
                                this.$router.push({
                                    path: '/'
                                });
                                break;
                            case 30009:
                                this.loginErrors.mobile = '用户不存在';
                                break;
                            case 30010:
                                this.loginErrors.password = '用户密码错误';
                                break;
                            default:
                                break;
                        }
                    }).catch( error => {
                        
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleClick () {
        this.$refs['ruleForm1'].resetFields();
        this.$refs['ruleForm2'].resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
.login {
    width: 323px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: #b8b8b8;
    font-size: 14px;
    h4 {
        color: #252525;
        font-size: 28px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 20px;
    }
    .el-tabs ::after {
        background-color: #fff;
    }
    .label {
        width: 323px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /deep/.el-form-item {
            input {
            height: 50px;
            }
            .label-ph {
            width: 80px;
            float: left;
            }
            .label-tel {
            width: 225px;
            float: right;
            }
            .label-psd {
            width: 323px;
            }
        }
        .lost-psd {
        margin-top: 26px;
        height: 21px;
        line-height: 21px;
        }
        .login-btn {
        background: #10c786;
        width: 323px;
        height: 50px;
        margin-top: 26px;
        }
        .email {
        margin-bottom: 26px;
        }
    }
    .register {
        margin-top: 42px;
        a {
        color: #10c786;
        }
    }
}
</style>
