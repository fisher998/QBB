<template>
    <div class="start-box">
        <div class="start-bg"></div>
        <div class="file-name">
            文件名:
            {{ fileName }}
        </div>
        <div class="btn">
            <el-button type="primary" class="btn1" @click="startVerify">开始验证</el-button>
            <el-button type="text" class="btn2" @click="chooseAgain">重新选择</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        fileName: {
            type: String,
            required: true
        }
    },
    data () {
        return {

        }
    },
    methods: {
        startVerify () {
            this.$emit('startVerify');
        },
        chooseAgain () {
            this.$emit('continueVerify');
        }
    }
}
</script>

<style lang="less" scoped>
.start-box {
    height: 230px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .start-bg {
        width: 60px;
        height: 70px;
        background: url(../../../images/pdf.svg) center center no-repeat;
    }
    .file-name {
        font-size: 20px;
    }
    .btn {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        /deep/.btn1 {
            width: 210px;
            height: 50px;
        }
        /deep/.btn2 {
            margin: 0;
        }
    }
}
</style>
