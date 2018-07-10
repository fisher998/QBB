<template>
    <div class="stamp-box">
        <div class="stamp">
            <div class="stamp-title bold"><span></span>印章设置</div>
            <div class="current-stamp">
                <span>当前印章:</span>
                <img class="currentImg" v-if="stampUrl" :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stampUrl" alt="" />
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="预设印章" name="first">
                    <div class="el-tab-pane1">
                        <label v-for="(stampList, index) in stampLists1" :for="'preinstall' + index" :key="index">
                            <img :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stampList.stamp_oss_key" :alt="index" />
                            <input type="radio" name="stamp1" :id="'preinstall' + index" :value="stampList.stamp_sn" v-model="Stp1" />
                        </label>
                        <!-- <label for="preinstall2">
                            <img src="../../images/bg.png" alt="" />
                            <input type="radio" name="stamp1" id="preinstall2" value="2" />
                        </label>
                        <label for="preinstall3">
                            <img src="../../images/bg.png" alt="" />
                            <input type="radio" name="stamp1" id="preinstall3" value="3" />
                        </label> -->
                        <!-- <label for="preinstall2">
                            <div >
                                <img src="../../images/bg.png" alt="" />
                                <input type="radio" name="stamp1" id="preinstall2" value="2" />
                                <i class="el-icon-circle-check"></i>
                            </div>
                        </label> -->
                    </div>
                    <button class="btn1"  @click="setDefaultStamp">保存</button>
                    <button class="btn2"  @click="deleteStamp1">删除</button>
                </el-tab-pane>
                <el-tab-pane label="用户上传" name="second">
                    <div class="el-tab-pane2">
                        <div class="top">
                                <!-- <el-button slot="trigger" size="small" type="primary">上传印章</el-button> -->
                            <!-- <el-upload
                                action=""
                                ref="upload"
                                :auto-upload="false"
                                :show-file-list="true"
                                :on-change="uploadChange"
                                :limit="1"
                                >
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadStamp">上传到服务器</el-button>
                            </el-upload> -->
                            <!-- <input type="file" accept="image/*" /> -->
                            <!-- <button class="uploading" @click="upLoading">上传印章</button> -->
                            <p>支持:jpg、jpeg、png、bmp格式,大小不超过10M,最多保存4个</p>
                        </div>
                        <div class="center">
                            <label v-for="(stampList, index) in stampLists2" :for="'uploading' + index" :key="index">
                                <img v-if="stampLists2.length > 0" :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stampList.stamp_oss_key" :alt="index" />
                                <input v-if="stampLists2.length > 0" type="radio" name="stamp2" :id="'uploading' + index" :value="stampList.stamp_sn" v-model="Stp2"/>
                            </label>
                            <el-upload
                                action=""
                                ref="upload"
                                :auto-upload="false"
                                :show-file-list="true"
                                :on-change="uploadChange"
                                :limit="1"
                                list-type="picture-card"
                                >
                                <!-- <el-button slot="trigger" size="small" type="primary">上传印章</el-button> -->
                                <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
                            </el-upload>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadStamp">上传</el-button>
                            <!-- <label for="uploading2">
                                <img src="../../images/bg.png" alt="" />
                                <input type="radio" name="stamp2" id="uploading2" value="2" />
                            </label>
                            <label for="uploading3">
                                <img src="../../images/bg.png" alt="" />
                                <input type="radio" name="stamp2" id="uploading3" value="3" />
                            </label> -->
                        </div>
                        <div class="btn-box">
                            <button class="btn1" @click="setDefaultStampByAliOss">保存</button>
                            <button class="btn2"  @click="deleteStamp2">删除</button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="手写签名" name="third">
                    <div class="el-tab-pane3">
                        <label v-for="(stampList, index) in stampLists3" :for="'uploading' + index" :key="index">
                            <img v-if="stampLists3.length > 0" :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stampList.stamp_oss_key" :alt="index" />
                            <input v-if="stampLists3.length > 0" type="radio" name="stamp3" :id="'uploading' + index" :value="stampList.stamp_sn" v-model="Stp3"/>
                        </label>
                        <div class="pane3-box">
                            <img :src="url" alt="二维码" class="hand-stamp" />
                            <span>用手机扫描二维码,在手机上完成签名操作</span>
                        </div>
                    </div>
                    <button class="bottom" @click="setDefaultStampByCanvasBoard">保存</button>
                    <button class="btn2"  @click="deleteStamp3">删除</button>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { getStampLists, addStamp, setDefaultStamp, deleteStamp, getHomePageInformation, getQrCodeByHandleStamp } from '../../api/details'; 
import { getAliyunOSS } from '../../api/upload';
import { getFileExtension } from '../../common/js/feature';
export default {
    data () {
        return {
            activeName: 'first',
            type: 1,
            stampUrl: '',
            stampLists1: [],
            Stp1: null,
            Stp2: null,
            Stp3: null,
            stampLists2: [],
            deleteStp2: null,
            stampLists3: [],
            fileList: [],
            uploadImgs: [],
            url: '',
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
        getHomePageInformation().then(res => {
            if (res.data.error === 0) {
                this.stampUrl = res.data.data.stamp_url;
            }
        }).catch(error => {

        });
        getStampLists(this.type).then(res => {
            if (res.data.error === 0) {
                this.stampLists1 = res.data.data || [];
            }
        }).catch(error => {
            console.log(error);
        });
        getQrCodeByHandleStamp().then(res => {
            this.url = res.data.data;
        })
    },
    methods: {
        upLoading () {
            this.$el.querySelector('[type="file"]').click();
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
        handleClick (tab, event) {
            switch (tab.name) {
                case 'first':
                    getStampLists(1).then(res => {
                        console.log(res)
                        if (res.data.error === 0) {
                            this.stampLists1 = res.data.data || [];
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    break;
                case 'second':
                    getStampLists(2).then(res => {
                        console.log(res)
                        if (res.data.error === 0) {
                            this.stampLists2 = res.data.data || [];
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    break;
                case 'third':
                    getStampLists(3).then(res => {
                        console.log(res)
                        if (res.data.error === 0) {
                            this.stampLists3 = res.data.data || [];
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                    break;
                default:
                    break;
            }
        },
        uploadStamp () {
            this._getAliyunOSS().then(res => {
                let _this = this;
                // 提交印章图片
                new Promise(resolve => {
                    let flag = 0;
                    for (let i=0; i<this.fileList.length; i++) {
                        let file = this.fileList[i].raw;
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
                            flag++;
                            if (flag === _this.fileList.length) resolve();
                        });
                    }
                }).then(() => {
                    let imgs = JSON.parse(JSON.stringify(this.uploadImgs));
                    let img = imgs[0].split('/').pop();
                    addStamp(img).then(res => {
                        if (res.data.error === 0) {
                            this.$message({
                                message: '图片上传成功',
                                type: 'success'
                            });
                            this.$refs['upload'].clearFiles();
                            getStampLists(2).then(res => {
                                if (res.data.error === 0) {
                                    this.stampLists2 = res.data.data || [];
                                }
                            }).catch(error => {
                                console.log(error);
                            });
                        } else if (res.data.error === 30025) {
                            this.$message({
                                message: '图片上传数量超过限制',
                                type: 'warning'
                            })
                        }
                    });
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
        setDefaultStamp () {
            setDefaultStamp(this.Stp1).then(res => {
                if (res.data.error === 0) {
                    this.$message({
                        message: '恭喜您，设置默认印章成功',
                        type: 'success'
                    });
                    getHomePageInformation().then(res => {
                        if (res.data.error === 0) {
                            this.stampUrl = res.data.data.stamp_url;
                        }
                    }).catch(error => {

                    });
                }
            }).catch(error => {

            });
        },
        setDefaultStampByAliOss () {
            if (this.Stp2) {
                setDefaultStamp(this.Stp2).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '恭喜您，设置默认印章成功',
                            type: 'success'
                        });
                        getHomePageInformation().then(res => {
                            if (res.data.error === 0) {
                                this.stampUrl = res.data.data.stamp_url;
                            }
                        }).catch(error => {

                        });
                    }
                }).catch(error => {
    
                });
            } else {
                this.$message({
                    message: '清选择印章',
                    type: 'warning'
                });
            }
        },
        setDefaultStampByCanvasBoard () {
            if (this.Stp3) {
                setDefaultStamp(this.Stp3).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '恭喜您，设置默认印章成功',
                            type: 'success'
                        });
                        getHomePageInformation().then(res => {
                            if (res.data.error === 0) {
                                this.stampUrl = res.data.data.stamp_url;
                            }
                        }).catch(error => {

                        });
                    }
                }).catch(error => {
    
                });
            } else {
                this.$message({
                    message: '清选择印章',
                    type: 'warning'
                });
            }
        },
        deleteStamp1 () {
            if (this.Stp1) {
                this.$message({
                    message: '请选择印章',
                    type: 'warning'
                })
            } else {
                deleteStamp(this.Stp1).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '印章删除成功',
                            type: 'success'
                        });
                        getStampLists(1).then(res => {
                            if (res.data.error === 0) {
                                this.stampLists2 = res.data.data || [];
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        },
        deleteStamp2 () {
            if (!this.Stp2) {
                this.$message({
                    message: '请选择印章',
                    type: 'warning'
                })
            } else {
                deleteStamp(this.Stp2).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '印章删除成功',
                            type: 'success'
                        });
                        getStampLists(2).then(res => {
                            if (res.data.error === 0) {
                                this.stampLists2 = res.data.data || [];
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        },
        deleteStamp3 () {
            if (!this.Stp3) {
                this.$message({
                    message: '请选择印章',
                    type: 'warning'
                })
            } else {
                deleteStamp(this.Stp3).then(res => {
                    if (res.data.error === 0) {
                        this.$message({
                            message: '印章删除成功',
                            type: 'success'
                        });
                        getStampLists(3).then(res => {
                            if (res.data.error === 0) {
                                this.stampLists3 = res.data.data || [];
                            }
                        }).catch(error => {
                            console.log(error);
                        });
                    }
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../static/css/index';
.stamp-box {
    width: 100%;
    font-size: 14px;
    color: #666666;
    .stamp {
        width: 100%;
        &-title {
            font-size: 14px;
            color: #000000;
            display: -ms-flexbox; 
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
        img {
            width: 80px;
            height: 64px;
            margin-right: 10px;
        }
        .current-stamp {
            height: 105px;
            line-height: 104px;
            padding-left: 20px;
            border-bottom: 1px solid #F7F7F7;
            display: flex;
            display: -ms-flexbox;
            justify-content: flex-start;
            align-items: center;
            .currentImg {
                width: 60px;
                height: 48px;
            }
            span {
                margin-right: 15px;
            }
        }
        .el-tabs {
            margin-left: 20px;
            ::after {
                background: #fff;
            }
            .el-tab-pane1 {
                display: flex;
                display: -ms-flexbox;
                justify-content: flex-start;
                min-height: 100px;
                margin: 20px 0;
                label {
                    height: 60px;
                    display: flex;
                    display: -ms-flexbox;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    input {
                        margin-top: 5px;
                        transform: scale(1.1);
                        outline: none;
                    }
                }
            }
            .btn1 {
                width: 80px;
                height: 30px;
                border: 1px solid #979797;
                font-size: 12px;
                color: #666666;
                background: #fff;
                border-radius: 5px;
                outline: none;
                cursor: pointer;
            }
            .btn2 {
                width: 80px;
                height: 30px;
                border: none;
                font-size: 12px;
                color: #fff;
                background: rgb(243, 76, 76);
                border-radius: 5px;
                outline: none;
                cursor: pointer;
                margin-left: 20px;
            }
            .el-tab-pane2 {
                height: 250px;
                display: flex;
                display: -ms-flexbox;
                flex-direction: column;
                justify-content: space-around;
                .top {
                    height: 20px;
                    display: flex;
                    display: -ms-flexbox;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: left;
                    position: relative;
                    .uploading {
                        width: 70px;
                        height: 30px;;
                        font-size: 12px;
                        position: absolute;
                        border: none;
                        border-radius: 5px;
                        background: #13C384;
                        color: #fff;
                        outline: none;
                    }
                }
                .center {
                    width: 360px;
                    display: flex;
                    display: -ms-flexbox;
                    justify-content: flex-start;
                    align-items: center;
                    label {
                        height: 60px;
                        display: flex;
                        margin-right: 10px;
                        display: -ms-flexbox;
                        flex-direction: column;
                        justify-content: space-around;
                        align-items: center;
                    }
                    /deep/.el-upload--picture-card {
                        width: 50px;
                        height: 50px;
                        position: relative;
                        background: url(../../images/add.svg) center center no-repeat;
                        background-size: 14px 14px;
                    }
                    /deep/.el-upload-list__item {
                        margin-left: 20px;
                        width: 50px;
                        height: 50px;
                    }
                }
                .btn-box {
                    width: 200px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .btn1 {
                        width: 80px;
                        height: 30px;
                        border: 1px solid #979797;
                        font-size: 12px;
                        color: #666666;
                        background: #fff;
                        border-radius: 5px;
                        outline: none;
                        cursor: pointer;
                    }
                    .btn2 {
                        width: 80px;
                        height: 30px;
                        border: none;
                        font-size: 12px;
                        color: #fff;
                        background: rgb(243, 76, 76);
                        border-radius: 5px;
                        outline: none;
                        cursor: pointer;
                        margin-left: 20px;
                    }
                }
            }
            .el-tab-pane3 {
                height: 200px;
                display: flex;
                display: -ms-flexbox;
                justify-content: flex-start;
                align-items: center;
                label {
                    height: 60px;
                    display: flex;
                    margin-right: 10px;
                    display: -ms-flexbox;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                }
                .pane3-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: left;
                    text-indent: 8px;
                    .hand-stamp {
                        width: 144px;
                        height: 144px;
                    }
                    .btn2 {
                        width: 80px;
                        height: 30px;
                        border: none;
                        font-size: 12px;
                        color: #fff;
                        background: rgb(243, 76, 76);
                        border-radius: 5px;
                        outline: none;
                        cursor: pointer;
                        margin-left: 20px;
                    }
                }
            }
            .bottom {
                width: 80px;
                height: 30px;
                border: 1px solid #979797;
                font-size: 12px;
                color: #666666;
                background: #fff;
                border-radius: 5px;
                outline: none;
                cursor: pointer;
                margin-bottom: 50px;
            }
        }
    }
}
</style>
