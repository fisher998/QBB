<template>
    <div class="box">
        <div class="certificate-center">
            <div class="certificate-center-up">
                <p>您是否拥有
                    <el-tooltip placement="top">
                            <div slot="content">eID是以密码技术为基础、以智能安全芯片为载体、由“公安部公民网络身份识别系统”签<br/>发给公民的网络身份标识,
                            能够在不泄露身份信息的前提下在线远程识别身份。</div>
                        <span class="eid">eID?</span>
                    </el-tooltip>
                </p>
                <p class="certificate-center-up-psb">(有eID并使用有NFC功能的安卓手机或有eID读卡器的用户可选择该项)</p>
                <div class="certificate-center-up-choose">
                    <div class="certificate-center-up-choose-left">
                        <label for="yes">
                            <div class="circle-box">
                                <input type="radio" id="yes" name="eID" class="radio" v-model="isHaveeID" :disabled="true" :value='true'>
                                <el-tooltip placement="top">
                                    <div slot="content">eID功能即将开放</div>
                                    <i class="circle" v-show="!isHaveeID"></i>
                                </el-tooltip>

                                <i class="el-icon-circle-check" v-show="isHaveeID"></i>
                            </div>
                            有
                        </label>
                    </div>
                    <div class="certificate-center-up-choose-right">
                        <label for="no">
                            <div class="circle-box">
                                <input type="radio" id="no" name="eID" class="radio" v-model="isHaveeID" :value='false'>
                                <i class="circle" v-show="isHaveeID"></i>
                                <i class="el-icon-circle-check" v-show="!isHaveeID"></i>
                            </div>
                            无
                        </label>
                    </div>
                </div>
            </div>
            <div class="certificate-center-down">
                <p>选择您希望申请证书的CA公司</p>
                <p class="certificate-center-up-psb">(您可以根据所处的地区选择你想申请的CA公司)</p>
                <el-select placeholder="请选择CA公司" class="select" v-model="value">
                    <el-option label="GDCA" value="GDCA"></el-option>
                    <!-- <el-option label="CA公司二" value="company2"></el-option>
                    <el-option label="CA公司三" value="company3"></el-option> -->
                </el-select>
            </div>
        </div>
        <div class="certificate-bottom">
            <button class="certificate-bottom-btn" @click="next">下一步</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            isHaveeID: false,
            value: 'GDCA'
        }
    },
    created () {
        
    },
    methods: {
        next () {
            if (this.isHaveeID) {
                this.$router.push({
                    path: '/application-certificate/eid-attestation'
                });
            } else {
                this.$router.push({
                    path: '/certificate-by-face'
                });
            }
        }
    },
    computed: {
        isshow () {
            return this.isHaveeID;
        }
    }
};
</script>

<style lang="less" scoped>
.box {
    width: 780px;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .certificate-center {
        width: 780px;
        height: 430px;
        border: 1px solid #F2F2F2;
        font-size: 18px;
        &-up, &-down {
            width: 778px;
            height: 50%;
        }
        &-up {
            /deep/.el-tooltip__popper {
                width: 500px;
                height: 300px;
            }
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .eid {
                color: #10C786;
            }
            &-psb {
                color: #8E8E8E;
                margin: 20px 0;
            }
            &-choose {
                width: 200px;
                height: 40px;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &-left, &-right {
                    label {
                        width: 45px;
                        height: 35px;
                        line-height: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
                &-left {
                    .circle-box:nth-of-type(1) {
                        cursor: not-allowed;
                    }
                }
                .radio {
                    display: none;
                }
                .el-icon-circle-check {
                    color: #10C786;
                    transform: scale(1.2)
                }
                .circle {
                    display: block;
                    width: 18px;
                    height: 18px;
                    border: 1px solid #8E8E8E;
                    border-radius: 50%;
                    background: #eeeeee;
                }
            }
        }
        &-down {
            border-top: 1px solid #F2F2F2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .select {
                width: 350px;
                margin-top: 15px;
            }
        }
    }
    .certificate-bottom {
        &-btn {
            width: 180px;
            height: 40px;
            outline: none;
            color: #fff;
            background: #10C786;
            border: none;
            border-radius: 4px;
            margin-bottom: 20px;
            cursor: pointer;
        }
    }
}
</style>
