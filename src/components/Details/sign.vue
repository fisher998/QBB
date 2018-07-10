<template>
    <div class="sign-box">
        <div class="sign">
            <i class="el-icon-close" @click="close"></i>
            <div class="box1" v-show="loginPinShow">
                <div class="p">
                    <p>请将<span>U-key</span>插入电脑的USB接口或</p>
                    <p>使用“签宝宝app”中的“<span>扫一扫</span>”功能</p>
                </div>
                <div class="qrcode-box">
                    <img :src="stampUrl" alt="" class="qrcode">
                    <!-- <div class="qrcode"></div> -->
                    <p>扫描上方二维码完成签署</p>
                </div>
                <el-button class="btn" type="primary" @click="sign" >立即签署</el-button>
            </div>
            <div class="first-step" v-show="!loginPinShow">
                <p class="first-step-top">请将您的设备插入USB接口</p>
                <p class="first-step-second">请输入6位PIN码</p>
                <div class="first-step-center">
                    <input type="password" class="p1" maxlength="1" @keyup="downInput" v-model="p1" />
                    <input type="password" class="p2" maxlength="1" @keyup="nextInput" v-model="p2" />
                    <input type="password" class="p3" maxlength="1" @keyup="nextInput" v-model="p3" />
                    <input type="password" class="p4" maxlength="1" @keyup="nextInput" v-model="p4" />
                    <input type="password" class="p5" maxlength="1" @keyup="nextInput" v-model="p5" />
                    <input type="password" class="p6" maxlength="1" @keyup="upInput" v-model="p6" />
                </div>
                <button class="first-step-bottom" @click="confirm">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
import { getHashByContract, getQRCode, sendHashAfterSign, checkFinish } from '../../api/contract';
export default {
    props: {
        cntrtno: {
            type: Array
        },
        stampSn: {
            type: Number
        },
    },
    data () {
        return {
            stampUrl: '',
            qrcode_id: '',
            // hash: '',
            // key: '',
            // hashArr: [],
            // keyArr: [],
            contractArr: [],
            userName: '',
            isDisable: true,
            loginPinShow: true,
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            p5: '',
            p6: '',
            pin: '',
            flag: false
        }
    },
    created () {
        // if (this.$props.cntrtno.length <= 1) {
            getQRCode(JSON.stringify(this.$props.cntrtno), this.$props.stampSn).then(res => {
                console.log(res)
                this.stampUrl = res.data.data.aliyun_url;
                this.qrcode_id = res.data.data.qrcode_id;
                this.flag = true;
                this.checkFinish();
            });
        // }
        this.$props.cntrtno.forEach(cntrtno => {
            // 签署
            getHashByContract(cntrtno.cntrtno, this.$props.stampSn).then(res => {
                // this.hash = res.data.data.hash;
                // this.hashArr.push(res.data.data.hash);
                // this.key = res.data.data.key;
                // this.keyArr.push(res.data.data.key);
                this.contractArr.push({
                    hash: res.data.data.hash,
                    key: res.data.data.key,
                    cntrtno: cntrtno
                });
                console.log('拿hash成功')
            }).catch(error => {
                console.log('拿hash失败')
            });
        });

        // Ukey签署
        let _this = this;
        $GDCA.getUserList(0, function (res) {
            _this.$message({
                message: `恭喜您，您现在可以开始使用Ukey签名了`,
                type: 'success'
            });
            res = res[0];
            var arg = res.split('||');
            var con = arg[1];
            var fdata = con.split('"');
            var ddata = fdata[0];
            _this.userName = ddata;
            _this.isDisable = false;
        }, function (err) {
            var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
            _this.$message({
                message: `请插入Ukey`,
                type: 'warning'
            });
        });
    },
    methods: {
        sign () {
            let _this = this;

            $GDCA.getUserList(0, function (res) {
                res = res[0];
                var arg = res.split('||');
                var con = arg[1];
                var fdata = con.split('"');
                var ddata = fdata[0];
                _this.userName = ddata;
                _this.isDisable = false;
                let flag = _this.contractArr.length;
                for (let contract of _this.contractArr) {
                    $GDCA.setSignMethod(16, function (res) {
                        $GDCA.signData(_this.userName, contract.hash, function (res) {
                            sendHashAfterSign(contract.key, res, contract.cntrtno).then(res => {
                                if (res.data.error === 0) {
                                    _this.$message({
                                        message: '恭喜您，签名成功',
                                        type: 'success'
                                    });
                                    flag--;
                                    if (flag === 0) {
                                        _this.$emit('refresh', 1);
                                    }
                                    _this.close();
                                }
                            }).catch(error => {
                                console.log('发送签名成功hash失败')
                            });
                        }, function (err) {
                            _this.$message({
                                message: '签名失败,请登录Ukey',
                                type: 'warning'
                            });
                            _this.loginPinShow = false;
                        });
                    }, function (err) {
                        
                    });
                }
            }, function (err) {
                var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                _this.$message({
                    message: `请插入Ukey`,
                    type: 'warning'
                });
            });
        },
        //  PIN光标自动下移
        nextInput (event) {
            if (event.keyCode === 8) {
                event.target.previousElementSibling.focus();
            } else {
                // 下一个
                event.target.nextElementSibling.focus();
            }
        },
        upInput (event) {
            if (event.keyCode === 8) {
                // 上一个
                event.target.previousElementSibling.focus();
            } else {
                this.pin = Number(this.p1 + this.p2 + this.p3 + this.p4 + this.p5 + this.p6);
            }
        },
        downInput () {
            if (event.keyCode === 8) {

            } else {
                event.target.nextElementSibling.focus();
            }
        },
        // 登录PIN码
        confirm() {
            let _this = this;
            _this.pin = '' + _this.p1 + _this.p2 + _this.p3 + _this.p4 + _this.p5 + _this.p6;
            if (_this.pin.length === 6) {
                $GDCA.Login(_this.userName, Number(_this.pin), function (res) {
                    _this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    _this.loginPinShow = true;
                }, function (err) {
                    _this.$message({
                        message: 'PIN码输入有误，请重新输入',
                        type: 'warning'
                    });
                });
            } else {
                _this.$message({
                    message: 'PIN码输入有误，请重新输入',
                    type: 'warning'
                });
            }
        },
        checkFinish () {
            setTimeout(() => {
                checkFinish(this.qrcode_id).then(res => {
                    if (this.flag && res.data.data === 1) {
                        this.checkFinish();
                    } else {
                        if (res.data.data === 2) {
                            this.$message({
                                message: '签署完成',
                                type: 'success'
                            });
                        } else if (res.data.data === -1) {
                            this.$message({
                                message: '二维码已失效',
                                type: 'warning'
                            });
                        }
                        this.close();
                    }
                });
            }, 3000);
        },
        close () {
            this.flag = false;
            this.$emit('close');
        }
    }
}
</script>

<style lang="less" scoped>
 .sign-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: rgba(0, 0, 0, 0.46);
    display: flex;
    justify-content: center;
    align-items: center;
    .sign {
        width: 410px;
        height: 500px;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        .el-icon-close {
            position: absolute;
            top: 10px;
            right: 10px;
            transform: scale(1.5);
            cursor: pointer;
        }
        .box1 {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .p {
                margin-top: 50px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                font-size: 18px;
                color: #252525;
                span {
                    color: #10C786;
                }
            }
            .qrcode-box {
                margin-top: 70px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .qrcode {
                    width: 200px;
                    height: 200px;
                    border: 1px solid #000;
                }
                p {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #999999;
                }
            }
            .btn {
                margin-top: 40px;
                width: 320px;
                height: 45px;
            }
        }
        .first-step {
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
            &-second {
                margin: 20px 0;
                font-size: 14px;
                color: #999999;
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
                    border: 1px solid #d5d5d5;
                    border-radius: 4px;
                    text-align: center;
                    font-size: 24px;
                }
            }
            &-bottom {
                width: 323px;
                height: 46px;
                color: white;
                background-color: #10c786;
                outline: none;
                cursor: pointer;
                border: none;
                border-radius: 4px;
            }
        }
    }
}
</style>
