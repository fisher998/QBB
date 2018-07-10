<template>
    <div class="step">
        <div class="step-text" :class="{ 'text-gery': !(step >= 1) }"><div class="step-circle" :class="{ 'gery': !(step >= 1) }"></div>合同信息填写</div>
        <div class="step-dashed"></div>
        <div class="step-text" :class="{ 'text-gery': !(step >= 2) }"><div class="step-circle" :class="{ 'gery': !(step >= 2) }"></div>设置签章位置</div>
        <div class="step-dashed"></div>
        <div class="step-text" :class="{ 'text-gery': !(step >= 3) }"><div class="step-circle" :class="{ 'gery': !(step >= 3) }"></div>发起合同</div>
    </div>
</template>

<script>
export default {
    props: {
        step: {
            type: Number
        }
    },
    data () {
        return {

        }
    }
}
</script>

<style lang="less" scoped>
.step {
    font-size: 12px;
    height: 57px;
    margin: auto;
    display: flex;
    align-items: center;
    color: #FFFFFF;
    .step-circle {
        width: 7px;
        height: 7px;
        background: #ffffff;
        border: 1px solid #FFFFFF;
        border-radius: 50%;
        margin-right: 7px;
    }
    .gery {
        background: #222222;
        opacity: 0.21;
        border: 1px solid #FFFFFF;
    }
    .text-gery {
        opacity: 0.21;
    }
    .step-text {
        display: flex;
        align-items: center;
        margin-right: 15px;
    }
    .step-dashed {
        width: 60px;
        height: 2px;
        border-bottom: 1px dashed #5A6369;
        margin-right: 15px;
    }
}
</style>
