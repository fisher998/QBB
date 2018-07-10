<template>
    <div class="verify-page">
        <div class="header-box">
            <div class="header">
                <div class="header-left">验名文件验证</div>
                <div class="header-right">合同验签是对电子合同的有效性进行验证,帮助您确定电子合同的真实性和有效性</div>
            </div>
        </div>
        <div class="verify-box">
            <get-file ref="getFile" @getFile="getFile" v-show="getFileShow" @defeatInfo="defeatInfo1" @successInfo="successInfo1"></get-file>
            <start-verify v-show="startVerifyShow" :fileName="fileName" @startVerify="startVerify1" @continueVerify="continueVerify"></start-verify>
            <defeat ref="defeat" v-show="defeatShow" @continueVerify="continueVerify"></defeat>
            <success ref="success" v-show="successShow" :caCompany="caCompany" @continueVerify="continueVerify"></success>
        </div>
        <div class="contract-information-box">
            <contract-information ref="info" v-show="successShow" :signInfoList="signInfoList" :name="fileName"></contract-information>
        </div>
    </div>
</template>

<script>
import GetFile from "./VerifyPage/get-file";
import StartVerify from "./VerifyPage/start-verify";
import Defeat from "./VerifyPage/defeat";
import Success from "./VerifyPage/success";
import ContractInformation from "./VerifyPage/contract-information";
export default {
    data () {
        return {
            fileName: '',
            fileSha256: '',
            getFileShow: true,
            startVerifyShow: false,
            defeatShow: false,
            successShow: false,
            caCompany: '',
            signInfoList: []
        }
    },
    methods: {
        getFile (fileName, getFileShow) {
            this.fileName = fileName;
            // this.fileSha256 = fileSha256;
            this.getFileShow = false;
            // console.log(fileName, fileSha256)
            this.startVerifyShow = true;
        },
        startVerify1 () {
            this.$refs['getFile'].start();
        },
        successInfo1 (value) {
            this.getFileShow = false;
            this.startVerifyShow = false;
            this.successShow = true;
            this.caCompany = 'GDCA';
            this.signInfoList = value;
        },
        defeatInfo1 () {
            this.getFileShow = false;
            this.startVerifyShow = false;
            this.defeatShow = true;
        },
        continueVerify () {
            this.getFileShow = true;
            this.startVerifyShow = false;
            this.defeatShow = false;
            this.successShow = false;
            this.$refs['getFile'].clear();
        }
    },
    components: {
        GetFile,
        StartVerify,
        Defeat,
        Success,
        ContractInformation
    }
}
</script>

<style lang="less" scoped>
.header-box {
    width: 100%;
    height: 70px;
    background: #0FBC7F;
    .header {
        width: 1100px;
        height: 100%;
        margin: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #fff;
        &-left {
            font-size: 16px;
        }
        &-right {
            margin-left: 50px;
            font-size: 14px;
        }
    }
}
.verify-box {
    width: 1100px;
    height: 320px;
    margin: 25px auto 20px auto;
    border: 1px dotted #cbcbcb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.contract-information-box {
    width: 100%;
    margin-bottom: 200px;
}
</style>
