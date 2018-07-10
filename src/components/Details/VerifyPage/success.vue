<template>
    <div class="success-box">
        <div class="success-bg"></div>
        <div class="success-info">
            <p class="p1">验证成功</p>
            <p class="p2">签名信息有效且文件未被更改</p>
            <p class="p3">(本验签服务由<span>{{ '广东CA' }}</span>提供,由广东CA为结果提供保证)</p>
        </div>
        <el-button type="primary" @click="continueVerify">继续验证</el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        continueVerify () {
            this.$emit('continueVerify');
        }
    }
}
</script>

<style lang="less" scoped>
.success-box {
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .success-bg {
        width: 100px;
        height: 75px;
        background: url(../../../images/success.svg) center center no-repeat;
    }
    .success-info {
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .p1 {
            font-size: 20px;
            color: #10C786; 
        }
        .p2 {
            font-size: 14px;
            color: #cdcdcd;
        }
        .p3 {
            font-size: 14px;
            color: #000;
            span {
                color: #10C786;
            }
        }
    }
    .el-button {
        width: 210px;
        height: 50px;
    }
}
</style>
