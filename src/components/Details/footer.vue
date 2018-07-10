<template>
    <div class="footer">
        <div class="box">
            <div class="left">
                <p><a href="https://www.fa123.com" target="_blank">法123</a><span class="divide">|</span><a href="https://www.zhengbaobao.com" target="_blank">证宝宝</a></p>
                <p>Copyright &copy; www.qianbaobao.net 北京枫玉科技有限公司All Rights Reserved 京ICP备16026386号-7</p>
            </div>
            <div class="qr">
                <!-- <div class="qr-code"></div> -->
                <img class="qr-code" src="http://zbb-qrcode.oss-cn-beijing.aliyuncs.com/XuWKlnCWp5NoTxxuIL2E7u7ay4.png" alt="">
                <p>扫码下载“签宝宝”APP</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
.footer {
    width: 100%;
    height: 80px;
    background: #303C43;
    display: flex;
    justify-content: center;
    margin-top: 60px;
    .box {
        width: 1100px;
        height: 80px;
        font-size: 12px;
        color: #888888;
        display: flex;
        align-items: center;
        position: relative;
        .left {
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: space-between;
            height: 40px;
            a {
                color: #888888;
            }
            .divide {
                margin: 0 20px;
            }
        }
        .qr {
            width: 130px;
            height: 95px;
            position: absolute;
            right: 0;
            top: -28px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            white-space: nowrap;
            .qr-code {
                width: 70px;
                height: 70px;
            }
        }
    }
}
</style>
