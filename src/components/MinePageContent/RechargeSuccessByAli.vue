<template>
    <div class="recharge-success-box">
        <div class="top"></div>
        <div class="center">
            <p class="top-text">恭喜,您已完成支付</p>
            <p class="bottom-text">已成功支付: {{ totalAmount }}元</p>
        </div>
        <div class="bottom">
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        totalAmount: {
            type: String,
        }
    },
    data () {
        return {

        }
    },
    methods: {
        confirm () {
            this.$router.push({
                path: '/details/mine-page/recharge'
            });
            this.$emit('confirm');
        }
    }
}
</script>

<style lang="less" scoped>
.recharge-success-box {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .top {
        width: 46px;
        height: 46px;
        background: url(../../images/对号.svg) center center no-repeat;
    }
    .center {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .top-text {
            font-size: 30px;
            color: #252525;
        }
        .bottom-text {
            font-size: 16px;
            color: #10C786;
            margin-top: 25px;
        }
    }
    .bottom {
        .el-button {
            width: 120px;
            height: 40px;
        }
    }
}
</style>
