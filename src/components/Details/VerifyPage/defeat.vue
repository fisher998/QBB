<template>
    <div class="defeat-box">
        <div class="defeat-bg"></div>
        <div class="defeat-info">
            <p class="p1">验证失败</p>
            <p class="p2">签名信息无效或文件被更改过</p>
        </div>
        <el-button type="primary" class="btn" @click="continueVerify">继续验证</el-button>
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
.defeat-box {
    height: 230px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .defeat-bg {
        width: 80px;
        height: 90px;
        background: url(../../../images/defeat.svg) center bottom no-repeat;
    }
    .defeat-info {
        height: 45px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .p1 {
            font-size: 20px;
            color: red;
        }
        .p2 {
            font-size: 14px;
            color: #cccccc;
        }
    }
    /deep/.btn {
        width: 210px;
        height: 50px;
    }
}
</style>
