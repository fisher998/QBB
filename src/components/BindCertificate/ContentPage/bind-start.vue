<template>
    <div class="bind-start-box">
        <div class="white-board">
            <i class="el-icon-close" @click="close"></i>
            <div class="first-step" v-show="firstStepShow">
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
                <button class="first-step-bottom" @click="lastStep">确定</button>
            </div>
            <div class="fourth-step" v-show="secondStepShow">
                <i class="el-icon-circle-check"></i>
                <div class="fourth-step-center">
                    <p class="fourth-step-center-p1">恭喜,证书绑定成功</p>
                </div>
                <div class="fourth-step-btn">
                    <button class="btn" @click="next">进入主页</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { bindingUkey } from '../../../api/register';
export default {
    props: {
        version: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            firstStepShow: true,
            secondStepShow: false,
            userName: '',
            cert: '',
            certNo: '',
            p1: '',
            p2: '',
            p3: '',
            p4: '',
            p5: '',
            p6: '',
            pin: '',
            flag: false
        };
    },
    created () {
        this.detection();
    },
    methods: {
        close () {
            this.$emit("show");
            this.flag = false;
        },
        detection () {
            setTimeout(() => {
                let _this = this;
                $GDCA.getUserList(0, function (res) {
                    _this.$message({
                        message: `恭喜您，您现在可以开始绑定Ukey了`,
                        type: 'success'
                    });
                    res = res[0];
                    var arg = res.split('||');
                    var con = arg[1];
                    var fdata = con.split('"');
                    var ddata = fdata[0];
                    _this.userName = ddata;
                    _this.flag = false;
                }, function (err) {
                    /* var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                    _this.$message({
                        message: `${txt},请插入Ukey`,
                        type: 'warning'
                    }); */
                    if (!_this.flag) {
                        _this.$message({
                            message: `请插入Ukey`,
                            type: 'warning'
                        });
                    }
                    _this.detection();
                    _this.flag = true;
                });
            }, 3000);
        },
        lastStep() {
            let _this = this;
            _this.pin = '' + _this.p1 + _this.p2 + _this.p3 + _this.p4 + _this.p5 + _this.p6;
            if (_this.pin.length === 6) {
                $GDCA.Login(_this.userName, Number(_this.pin), function (res) {
                    $GDCA.exportUserCert(_this.userName, function (res) {
                        _this.cert = res;
                        bindingUkey(_this.cert, _this.$props.version).then(res => {
                            console.log(res)
                            if (res.data.error === 0) {
                                _this.firstStepShow = false;
                                _this.secondStepShow = true;
                            } else if (res.data.error === 30036) {
                                _this.$message({
                                    message: 'CA已经存在,请勿重复绑定',
                                    type: 'warning'
                                });
                                _this.close();
                            };
                        });
                        /* var webroot = "http://jsign.95105813.cn";
                        $.ajax({
                            type: "GET",
                            async: true,
                            url: webroot + "/JustSignService/v1/cus/getCertInfo",
                            contentType: 'application/json',
                            data: {
                                "cert": res
                            },
                            dataType: "json",
                            success: function (result) {
                                if (result.meta.success) {
                                    var certInfo = result.data;
                                    console.log(certInfo);
                                    _this.certNo = certInfo.certNo;
                                }
                            }
                        }); */
                    }, function (err) {
                        var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                    });
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
        next() {
            if (true) {
                this.$router.push({
                    path: "/details/home-page"
                });
            }
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
                // console.log(Number(this.p1 + this.p2 + this.p3 + this.p4 + this.p5 + this.p6));
                this.pin = Number(this.p1 + this.p2 + this.p3 + this.p4 + this.p5 + this.p6);
            }
        },
        downInput () {
            if (event.keyCode === 8) {

            } else {
                event.target.nextElementSibling.focus();
            }
        },
    }
};
</script>

<style lang="less" scoped>
@import "../../../../static/css/index.less";
.bind-start-box {
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
            color: #d5d5d5;
            position: absolute;
            top: 15px;
            right: 15px;
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
        .fourth-step {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .el-icon-circle-check {
                transform: scale(4.2);
                color: #10c786;
            }
            &-center {
                width: 100%;
                margin: 25px 0 24px 0;
                p {
                    width: 100%;
                    text-align: center;
                }
                &-p1 {
                    margin: 30px 0;
                    font-size: 24px;
                    color: #252525;
                }
            }
            &-btn {
                margin: 20px 0 0 0;
                .btn {
                    width: 280px;
                    height: 40px;
                    outline: none;
                    color: #fff;
                    background: @color-main;
                    border: none;
                    border-radius: 4px;
                }
                .btn:hover {
                    background: @color-main-1;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
