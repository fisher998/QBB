<template>
    <div>
        <div class="signature-top-box">
            <div class="signature-top">
                <div class="signature-top-left">
                    <!-- <router-link to="/details/home-page" class="home-page">&lt; 返回上一页</router-link> -->
                    <a href="javascript:history.back(-1)" class="home-page">&lt; 返回上一页</a>
                    <!-- <span>|</span>
                    <span class="details" @click="detailsPage">首页</span>
                    <span>发起签名</span> -->
                    <step :step="1" />
                </div>
            </div>
        </div>
        <div class="signature-header-box">
            <div class="signature-header">
                <div class="signature-header-left">
                    <div class="signature-header-left-images"></div>
                    <div class="signature-header-left-name">
                        <div class="signature-header-left-name-t">{{ fileName }}</div>
                        <a class="signature-header-left-name-b" target="blank" :href="'https://user-contract.oss-cn-beijing.aliyuncs.com/' + DocKey">预览</a>
                    </div>
                </div>
                <div class="signature-header-center">

                </div>
                <div class="signature-header-right">
                    <div class="signature-header-right-top">
                        注意：电子签名不适用于以下文书:
                    </div>
                    <div class="signature-header-right-bottom">
                        <div class="signature-header-right-bottom-l">
                            <p>1、涉及婚姻，继承，收养等人身关系的；</p>
                            <p>2、涉及土地、房屋等不动产权益转让的；</p>
                        </div>
                        <div class="signature-header-right-bottom-r">
                            <p>3、涉及停止供水、供热、供气、供电等公共事业服务的；</p>
                            <p>4、法律、行政法规规定的不适用电子文书的其他情形。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Step from '../Step/step';
export default {
    props: {
        fileName: {
            type: String
        },
        DocKey: {
            type: String
        }
    },
    data () {
        return {
            
        }
    },
    methods: {
        detailsPage () {
            this.$router.push({
                path: '/details'
            });
        }
    },
    components: {
        Step
    }
}
</script>

<style lang="less" scoped>
.signature-top-box {
    width: 100%;
    height: 57px;
    background: #323439;
    display: flex;
    justify-content: center;
    .signature-top {
        width: 1100px;
        font-size: 14px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        &-left {
            display: flex;
            // width: 300px;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            .home-page {
                color: #fff;
            }
            .details {
                cursor: pointer;
            }
        }
    }
}
.signature-header-box {
    width: 100%;
    height: 180px;
    background: #10C786;
    display: flex;
    justify-content: center;
    align-items: center;
    .signature-header {
        width: 1100px;
        height: 125px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-left {
            height: 125px;
            display: flex;
            align-content: space-between;
            align-items: center;
            &-images {
                width: 101px;
                height: 125px;
                margin-right: 10px;
                background: url(../../../images/compact.svg) center center no-repeat;
            }
            &-name {
                width: 180px;
                height: 60px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: left;
                font-size: 14px;
                &-t {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #fff;
                }
                &-b {
                    width: 60px;
                    height: 30px;
                    text-align: center;
                    line-height: 28px;
                    opacity: 0.7;
                    outline: none;
                    border: 1px solid #fff;
                    background: #10C786;
                    border-radius: 4px;
                    color: #FEFEFE;
                }
                &-b:hover {
                    font-weight: bold;
                    opacity: 1;
                }
            }
        }
        &-center {
            width: 1px;
            height: 100px;
            background: #e8e8e8;
            opacity: 0.46;
        }
        &-right {
            width: 824px;
            height: 125px;
            // border: 1px dashed #fff;
            border-radius: 5px;
            padding-left: 90px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: left;
            color: #FFFFFF;
            &-top {
                height: 27px;
                line-height: 27px;
                font-size: 18px;
            }
            &-bottom {
                width: 100%;
                height: 50px;
                font-size: 14px;
                display: flex;
                justify-content: left;
                align-items: center;
                p {
                    height: 21px;
                    line-height: 21px;
                }
                &-l, &-r {
                    height: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: left;
                }
                &-l {
                    margin-right: 20px;
                }
            }
        }
    }
}
</style>
