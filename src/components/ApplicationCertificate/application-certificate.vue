<template>
    <div class="box">
        <div class="certificate-top">
            <p class="certificate-top-first">证书申请</p>
            <p class="certificate-top-second">{{ this.$route.path == '/application-certificate/choose-the-type' ? '选择身份类型' : 'eID身份认证' }}</p>
        </div>
        <router-view />
    </div>
</template>

<script>
export default {
    data () {
        return {

        };
    },
    methods: {
        
    }
};
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    height: 750px;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .certificate-top {
        width: 780px;
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-first {
            font-size: 30px;
            color: #252525;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        &-second {
            font-size: 16px;
            color: #8E8E8E;
        }
    }
}
</style>
