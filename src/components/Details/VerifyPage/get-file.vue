<template>
    <div class="box">
        <el-upload 
        ref="upload"
        drag 
        action="api/qbb/web/contracts/management/checksign"
        name="contract"
        :auto-upload="false" 
        :multiple="false" 
        :limit="1"
        :headers="headers"
        :show-file-list="false"
        :on-change="getFile" 
        :before-upload="beforeUpload"
        :on-progress="uploadProgress"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        >
            <div class="get-file-box">
                <div class="get-file-bg"></div>
                <div class="get-file-center">
                    <p class="first">点击选择文件或将文件拖入该区域</p>
                    <p class="second">(仅支持PDF格式的电子签名文件)</p>
                </div>
                <el-button class="get-file-bottom" type="info" disabled>开始验证</el-button>
            </div>
        </el-upload>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import { getFileExtension } from '../../../common/js/feature';
import { getToken } from '../../../common/js/auth';
export default {
    data () {
        return {
            getFileShow: true,
            fileName: '',
            fileSha256: '',
            headers: {
                'source': 'web',
                'auth-token': getToken(),
            },
            flag: true
        }
    },
    methods: {
        getFile (file) {
            // let reader = new FileReader;
            // reader.readAsArrayBuffer(file.raw);
            // const _this = this;
            // reader.onload = function () {
                // console.log(reader.result)
                // let wordArray = CryptoJS.lib.WordArray.create(reader.result);
                // console.log(wordArray)
                // _this.fileSha256 = CryptoJS.SHA256(wordArray).toString();
                // console.log(_this.fileSha256)
            // }
            if (this.flag) {
                if (/(pdf)/.test(getFileExtension(file.name))) {
                    this.getFileShow = false;
                    this.fileName = file.name;
                    this.$emit('getFile', this.fileName, this.getFileShow);
                    this.flag = false;
                } else {
                    this.$message({
                        message: '合同格式不正确',
                        type: 'warning',
                        showClose: true
                    });
                    this.$refs['upload'].clearFiles();
                    return false;
                }
            } else {
                return false;
            }
        },
        beforeUpload (file) {
            
        },
        uploadProgress (event, file, fileList) {
            this.percentage = Number(event.percent.toFixed(0));
        },
        uploadSuccess (response, file, fileList) {
            if (response.data.returnCode === '001') {
                if (response.data.checkResult === 'true' && response.data.distort === 'false') {
                    this.$emit('successInfo', response.data.signInfoList);
                } else {
                    this.$emit('defeatInfo');
                }
            } else {
                    this.$emit('defeatInfo');
            }
        },
        uploadError (err, file, fileList) {
            this.$message({
                message: '上传失败',
                type: 'warning'
            });
            this.$refs['upload'].clearFiles();
        },
        start () {
            this.$refs['upload'].submit();
        },
        clear () {
            this.flag = true;
            this.getFileShow = true;
            this.$refs['upload'].clearFiles();
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    /deep/.el-upload-dragger {
        width: 500px;
        height: 230px;
        border: none;
        .get-file-box {
            width: 500px;
            height: 230px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            .get-file-bg {
                width: 90px;
                height: 90px;
                background: url(../../../images/addFile.svg) right center no-repeat;
            }
            .get-file-center {
                height: 45px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                .first {
                    font-size: 20px;
                    color: #666666;
                }
                .second {
                    font-size: 14px;
                    color: #dddddd;
                }
            }
            .get-file-bottom {
                width: 210px;
                height: 50px;
            }
        }
    }
}
</style>
