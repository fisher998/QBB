<template>
    <div class="eid-start-box">
        <div class="white-board">
            <i class="el-icon-close" @click="close"></i>
            <div class="first-step" v-show="firstStepShow">
                <p class="first-step-top">请填写身份信息</p>
                <div class="first-step-center">
                    <el-form :model="form1" :rules="rules" ref="form1">
                        <el-form-item prop="name">
                            <el-input type="text" placeholder="姓名" v-model="form1.name"></el-input>
                        </el-form-item>
                        <el-form-item prop="IDCard">
                            <el-input type="text" placeholder="身份证号码" v-model="form1.IDCard"></el-input>
                        </el-form-item>
                        <el-form-item prop="email">
                            <el-input type="email" placeholder="电子邮箱" v-model="form1.email"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <button class="first-step-bottom" @click="secondStep">下一步</button>
            </div>
            <div class="second-step" v-show="secondStepShow">
                <p class="second-step-top">链接设备</p>
                <div class="second-step-center">
                    <p class="second-step-center-t">请将eID读卡器与电脑连接，并将eID卡紧贴读卡器</p>
                    <p class="second-step-center-b">(此步骤仅在IE浏览器下生效,请在IE浏览器下打开)</p>
                </div>
                <div class="second-step-bottom"></div>
            </div>
            <div class="third-step" v-show="thirdStepShow">
                <p class="third-step-top">请输入6位PIN码</p>
                <div class="third-step-center">
                    <!-- <input type="password" class="p1" maxlength="1" @keyup="downInput" v-model="p1" />
                    <input type="password" class="p2" maxlength="1" @keyup="nextInput" v-model="p2" />
                    <input type="password" class="p3" maxlength="1" @keyup="nextInput" v-model="p3" />
                    <input type="password" class="p4" maxlength="1" @keyup="nextInput" v-model="p4" />
                    <input type="password" class="p5" maxlength="1" @keyup="nextInput" v-model="p5" />
                    <input type="password" class="p6" maxlength="1" @keyup="upInput" v-model="p6" /> -->
                    <!-- 点此输入PIN码 -->
                </div>
                <!-- <button class="third-step-bottom" @click="lastStep">下一步</button> -->
                <button class="third-step-bottom" @click="lastStep">点此输入PIN码</button>
            </div>
            <!--
            <div class="fourth-step" v-show="fourthStepShow">
                <i class="el-icon-circle-check"></i>
                <div class="fourth-step-center">
                    <p class="fourth-step-center-p1">恭喜,证书申请成功</p>
                    <p class="fourth-step-center-p2">你需要下载APP并在手机上设置签署密码</p>
                    <p class="fourth-step-center-p3">才可以使用电子签名功能</p>
                </div>
                <div class="fourth-step-bottom">
                    <div class="fourth-step-bottom-ma">
                        <img src="../../images/qrcode.png" alt="扫码下载签宝宝" class="qbb">
                    </div>
                    <p class="fourth-step-bottom-p4">扫码下载“签宝宝”</p>
                </div>
            </div>
            -->
        </div>
    </div>
</template>

<script>
import { IDCardNoReg, emailReg } from '../../common/js/validate';
import { datatosignbase64 } from '../../api/timeToBase64';
import { bindingEid } from '../../api/register';
export default {
    data () {
        let validateName = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入姓名'));
            } else {
                callback();
            }
        };
        let validateIDCard = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入身份证号'));
            } else if (!IDCardNoReg.test(value)) {
                callback(new Error('请输入正确的身份证号码'));
            } else {
                callback();
            }
        };
        let validateEmail = function (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else if (!emailReg.test(value)) {
                callback(new Error('请输入正确的邮箱'));
            } else {
                callback();
            }
        };
        return {
            form1: {
                name: '',
                IDCard: '',
                email: ''
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                IDCard: [
                    { validator: validateIDCard, trigger: 'blur' }
                ],
                email: [
                    { validator: validateEmail, trigger: 'blur' }
                ]
            },
            firstStepShow: true,
            secondStepShow: false,
            thirdStepShow: false,
            fourthStepShow: false,
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            p5: '',
            p6: '',
            pin: null,
            eid_signed: '',
            data_to_sign: '',
            eid_user: '',
            eid_issuser_sn: '',
            eid_sn: ''
        };
    },
    methods: {
        close () {
            this.$emit('show');
            this.firstStepShow = true;
            this.secondStepShow = false;
            this.thirdStepShow = false;
            this.fourthStepShow = false;
        },
        secondStep () {
            this.$refs['form1'].validate((valid) => {
                if (valid) {
                    this.firstStepShow = false;
                    this.secondStepShow = true;
                    this.thirdStep();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        showThird () {
            this.secondStepShow = false;
            this.thirdStepShow = true;
        },
        thirdStep () {
            let _this =this;
            eID.detectDeviceBegin((rv, readerSerialList) => {
                if (rv === 0 && readerSerialList.length != 0) {
                    this.secondStepShow = false;
                    this.thirdStepShow = true;
                    for (var i = 0; i < readerSerialList.length; i++) {
                        var reader = readerSerialList[i][0];
                        var serial = readerSerialList[i][1];
                    }
                    _this.reader = reader;
                } else {
                    this.$message({
                        message: '请贴卡',
                        type: 'warning'
                    });
                }
            });
        },
        lastStep () {
            let _this = this;
            _this.close();
            _this.data_to_sign = datatosignbase64();
            eID.sign(signCallback, this.reader, datatosignbase64(), 0);
            this.thirdStepShow = false;
            this.fourthStepShow = true;
            function signCallback(rv, result, idCarrier, issuer, subject, certSn, issuerSn, certbase64, alg) {
                if (rv == 0) {
                    _this.eid_signed = result;
                    _this.eid_user = issuer;
                    _this.eid_issuser_sn = issuerSn;
                    _this.eid_sn = certSn;
                    // console.log( _this.eid_signed);
                    // console.log( _this.eid_user);
                    // console.log( _this.eid_issuser_sn);
                    // console.log( _this.eid_sn);
                    // console.log( _this.data_to_sign);
                    bindingEid(_this.form1.name, _this.form1.IDCard,_this.form1.email, _this.eid_user, _this.eid_issuser_sn, _this.eid_sn, _this.data_to_sign, _this.eid_signed).then(res => {
                        console.log(res);
                        if (res.data.error === 0) {
                            _this.$router.push({
                                path: '/details'
                            });
                        } else {
                            _this.$message({
                                message: '您输入的信息有误',
                                type: 'warning'
                            });
                        }
                    }).catch(error => {
                        console.log("=========")
                        console.log(error)
                    });
                } else {
                    // alert(eID.getMessage(rv));
                    this.$message({
                        message: `${eID.getMessage(rv)}`,
                        type: 'warning'
                    })
                }
            }
        },
        // PIN光标自动下移
        // nextInput (event) {
        //     if (event.keyCode === 8) {
        //         event.target.previousElementSibling.focus();
        //     } else {
        //         // 下一个
        //         event.target.nextElementSibling.focus();
        //     }
        // },
        // upInput (event) {
        //     if (event.keyCode === 8) {
        //         // 上一个
        //         event.target.previousElementSibling.focus();
        //     } else {
        //         // console.log(Number(this.p1 + this.p2 + this.p3 + this.p4 + this.p5 + this.p6));
        //         this.pin = Number(this.p1 + this.p2 + this.p3 + this.p4 + this.p5 + this.p6);
        //     }
        // },
        // downInput () {
        //     if (event.keyCode === 8) {

        //     } else {
        //         event.target.nextElementSibling.focus();
        //     }
        // },
        resetClick () {
            this.$refs['form1'].resetFields();
        }
    },
    computed: {
        
    }
};
</script>

<style lang="less" scoped>
.eid-start-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.7);
    .white-board {
        width: 410px;
        height: 410px;
        background: #fff;
        position: fixed;
        top: 50%;
        margin-top: -205px;
        left: 50%;
        margin-left: -205px;
        z-index: 10;
        .el-icon-close {
            transform: scale(1.7);
            color: #D5D5D5;
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
        }
        .first-step {
            // width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &-top {
                font-size: 24px;
                color: #252525;
            }
            &-center {
                width: 100%;
                height: 180px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                margin: 40px 0;
                .el-form {
                    /deep/input {
                        width: 320px;
                        height: 50px;
                    }
                }
            }
            &-bottom {
                width: 323px;
                height: 46px;
                color: white;
                background-color: #10C786;
                outline: none;
                cursor: pointer;
                border: none;
                border-radius: 4px;
            }
        }
        .second-step {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &-top {
                font-size: 24px;
                color: #252525;
            }
            &-center {
                font-size: 14px;
                color: #999999;
                margin: 20px 0 40px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                &-t {
                    margin-bottom: 10px;
                }
            }
            &-bottom {
                width: 128px;
                height: 195px;
                background: url(../../images/pcH.svg) center center no-repeat;
            }
        }
        .third-step {
            width: 323px;
            height: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &-top {
                font-size: 24px;
                color: #252525;
            }
            &-center {
                width: 323px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 50px 0 60px 0;
                [type="password"] {
                    width: 46px;
                    height: 46px;
                    outline: none;
                    border: 1px solid #D5D5D5;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 24px;
                }
            }
            &-bottom {
                width: 323px;
                height: 46px;
                color: white;
                background-color: #10C786;
                outline: none;
                cursor: pointer;
                border: none;
                border-radius: 4px;
            }
        }
        // .fourth-step {
        //     width: 100%;
        //     height: 100%;
        //     display: flex;
        //     flex-direction: column;
        //     justify-content: center;
        //     align-items: center;
        //     .el-icon-circle-check {
        //         transform: scale(4.2);
        //         color: #10C786;
        //     }
        //     &-center {
        //         width: 100%;
        //         margin: 25px 0 24px 0;
        //         p {
        //             width: 100%;
        //             text-align: center;
        //         }
        //         &-p1 {
        //             font-size: 24px;
        //             color: #252525;
        //         }
        //         &-p2, &-p3 {
        //             font-size: 16px;
        //             color: #8E8E8E;
        //         }
        //         &-p2 {
        //             margin: 10px 0 6px 0;
        //         }
        //     }
        //     &-bottom {
        //         &-ma {
        //             width: 159px;
        //             height: 159px;
        //             margin-bottom: 10px;
        //             .qbb {
        //                 width: 159px;
        //                 height: 159px;
        //             }
        //         }
        //         &-p4 {
        //             text-align: center;
        //         }
        //     }
        // }
    }
}
</style>
