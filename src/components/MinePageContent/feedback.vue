<template>
    <div class="feedback-box">
        <div class="feedback">
            <div class="feedback-title bold"><span></span>问题反馈</div>
            <div class="question">
                <textarea name="questions" id="" class="question-box" v-model="text" placeholder="请输入问题(最多200字)"></textarea>
                <div class="bottom">
                    <el-upload
                        action=""
                        ref="upload"
                        :auto-upload="false"
                        :show-file-list="true"
                        :on-change="uploadChange"
                        :limit="1"
                        list-type="picture-card"
                        :on-exceed="enough"
                    >
                        <!-- :disabled="fileList.length === 1" -->
                        <div class="question-bg"></div>
                    </el-upload>
                    <div class="question-right">
                        <input type="tel" placeholder="填入联系方式(选填)" v-model="tel" />
                        <button @click="handleClick">提交</button>
                    </div>
                </div>

            </div>
            <div class="feedback-title bold"><span></span>反馈记录</div>
            <table class="feedback-table">
                <thead>
                    <tr>
                        <th>反馈时间</th>
                        <th class="feedback-info">反馈内容</th>
                        <th>回复情况</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(feedback, index) in feedbackList" :key="index">
                        <td><div class="d1">{{ feedback.request_time }}</div></td>
                        <td><div class="feedback-info">{{ feedback.reply_content || '——' }}</div></td>
                        <td><div class="d3">{{ feedback.status === 1 ? '已回复' : '未回复' }}</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { getFeedBack, sendFeedBack } from '../../api/details';
import { getAliyunOSS } from '../../api/upload';
import { getFileExtension } from '../../common/js/feature';
export default {
    data () {
        return {
            feedbackList: [],
            text: '',
            tel: '',
            fileList: [],
            uploadImgs: [],
            img: '',
            aliyunData: {
                'AccessKeyId': '',
                'AccessKeySecret': '',
                'Expiration': '',
                'SecurityToken': '',
                'Bucket': '',
                'Host': ''
            },
        };
    },
    created () {
        getFeedBack().then(res => {
            this.feedbackList = res.data.data;
        });
    },
    methods: {
        handleClick () {
            if (this.text === '') {
                this.$message({
                    message: '请输入反馈类容',
                    type: 'warning'
                });
            } else if (this.text.length > 200) {
                this.$message({
                    message: '反馈类容超过限制',
                    type: 'warning'
                });
            } else if (this.fileList.length !== 0) {
                this.uploadStamp();
            } else {
                this.sendFeedBack('');
            }
        },
        sendFeedBack (img) {
            sendFeedBack(this.text, img).then(res => {
                if (res.data.error === 0) {
                    this.$message({
                        message: '恭喜您，反馈提交成功',
                        type: 'success'
                    });
                    this.text = '';
                    this.$refs['upload'].clearFiles();
                }
            });
        },
        uploadStamp () {
            this._getAliyunOSS().then(res => {
                let _this = this;
                // 提交印章图片
                new Promise(resolve => {
                    let flag = 0;
                    for (let i=0; i<this.fileList.length; i++) {
                        let file = this.fileList[i].raw;
                        console.log(file)
                        let suffix = getFileExtension(file.name); // 获取文件扩展名
                        let name = new Date() - 0; // 随机生成文件名
                        let storeAs = name + '.' + suffix;
                        let client = new OSS.Wrapper({
                            accessKeyId: this.aliyunData.AccessKeyId,
                            accessKeySecret: this.aliyunData.AccessKeySecret,
                            region: 'oss-cn-beijing',
                            stsToken: this.aliyunData.SecurityToken,
                            bucket: this.aliyunData.Bucket
                        });
                        client.multipartUpload(storeAs, file).then(function (res) {
                            _this.uploadImgs.push(res.res.requestUrls[0].replace(/\?.*$/g, ''));
                            console.log(res)
                            console.log(_this.uploadImgs)
                            flag++;
                            if (flag === _this.fileList.length) resolve();
                        });
                    }
                }).then(() => {
                    let imgs = JSON.parse(JSON.stringify(this.uploadImgs));
                    this.img = imgs[0].split('/').pop();
                    this.sendFeedBack(this.img);
                })
            })
        },
        _getAliyunOSS () {
            return new Promise(resolve => {
                getAliyunOSS().then(res => {
                    this.aliyunData = Object.assign({}, this.aliyunData, res.data.data);
                    resolve();
                })
            });
        },
        uploadChange (file, fileList) {
            if (/(jpg|jpeg|png|gif|bmp)/.test(getFileExtension(file.name))) {
                this.fileList = fileList;
            } else {
                this.$message({
                    message: '图片格式不正确',
                    type: 'warning',
                })
                this.$refs['upload'].clearFiles();
                return false;
            }
        },
        enough () {
            this.$message({
                message: '您最多只能添加一张图片',
                type: 'warning'
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.feedback-box {
    width: 100%;
    .feedback {
        width: 100%;
        &-title {
            font-size: 14px;
            color: #000000;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span {
                width: 3px;
                height: 14px;
                background: #3C3C3C;
                margin-right: 15px;
            }
        }
        .question {
            margin-top: 25px;
            font-size: 14px;
            margin-bottom: 35px;
            &-box {
                max-width: 100%;
                min-width: 100%;
                max-height: 150px;
                min-height: 150px;
                padding: 15px;
                outline: none;
                border: 1px solid #DEDEDE;
            }
            .bottom {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                /deep/.el-upload--picture-card {
                    background: url(../../images/feedback.svg) center center no-repeat;
                    width: 44px;
                    height: 44px;
                }
                /deep/.el-upload-list__item {
                    width: 44px;
                    height: 44px;
                }
                .question-right {
                    [type="tel"] {
                        width: 360px;
                        height: 30px;
                        line-height: 30px;
                        border: 1px solid #DEDEDE;
                        border-radius: 4px;
                        text-indent: 15px;
                    }
                    button {
                        width: 70px;
                        height: 30px;
                        margin-left: 20px;
                        font-size: 12px;
                        color: #FFFFFF;
                        background: #13C384;
                        outline: none;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                }
            }
        }
        .feedback-table {
            margin-top: 20px;
            width: 100%;
            border: 1px solid #EAEAEA;
            border-collapse: collapse;
            text-align: left;
            margin-bottom: 80px;
                tr {
                    border: 1px solid #EAEAEA;
                    height: 60px;
                    line-height: 60px;
                    th {
                        background: #FAFAFA;
                        padding-left: 40px;
                        font-weight: bold;
                    }
                    td {
                        padding-left: 40px;
                        .d1 {
                            width: 300px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .feedback-info {
                            width: 500px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .d3 {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            width: 300px;
                        }
                    }
                }
        }
    }
    width: 100%;
    .feedback {
        width: 100%;
            &-title {
            font-size: 14px;
            color: #000000;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span {
                width: 3px;
                height: 14px;
                background: #3c3c3c;
                margin-right: 15px;
            }
        }
    }
}
</style>
