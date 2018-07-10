<template>
    <div class="initial-box">
        <div class="initial">
            <div class="initial-left">
                <div class="left-bg"></div>
                <p class="left-t">欢迎使用<span>签宝宝</span></p>
                <p class="left-c">快捷高效的一站式电子合同签署平台</p>
                <el-button type="primary" @click="learnMore">了解更多</el-button>
            </div>
            <div class="initial-right">
                <router-view class="right" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        learnMore () {
            window.open('http://www.qianbaobao.net', 'blank');
        }
    }
};
</script>

<style lang="less" scoped>
.initial-box {
    position: absolute;
    width: 100%;
    min-width: 1350px;
    height: 100%;
    .initial {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: flex-start;
        &-left {
            background-image: url(../../images/bg2.png);
            width: 55%;
            height: 100%;
            background-size: cover;
            position: relative;
            .left-bg {
                width: 75px;
                height: 22px;
                background: url(../../images/Group.svg) left center no-repeat;
                position: absolute;
                top: 5%;
                left: 25%;
            }
            .left-t {
                font-size: 64px;
                color: #ffffff;
                position: absolute;
                left: 25%;
                top: 35%;
                span {
                    color: #10C786
                }
            }
            .left-c {
                color: #9d9d9d;
                font-size: 24px;
                position: absolute;
                left: 25%;
                top: 47%;
            }
            .el-button {
                width: 140px;
                height: 48px;
                font-size: 16px;
                position: absolute;
                top: 58%;
                left: 25%;
            }
        }
        &-right {
            width: 45%;
            height: 100%;
            padding-top: 0.1px;
            // padding: 50px 0;
            display: flex;
            justify-content: left;
            align-items: center;
            padding-left: 100px;
            overflow-y: scroll;
        }
    }
}
</style>
