<template>
    <div class="box">
        <div class="top">
            <div class="top-t">
                <div class="t">
                    <a href="javascript:history.back(-1)">&lt; 返回上一页</a>
                    <!-- <span>|</span>
                    <a @click="go('/details/home-page')">首页</a>
                    <span>></span>
                    <a @click="go('/new-signature')">发起签名</a>
                    <span>></span>
                    <a>设置签名位置</a> -->
                    <Step :step="2" class="step" />
                </div>
            </div>
            <div class="top-b">
                <span>请将签名印章拖动到签署人所需要签署的位置</span>
            </div>
        </div>
        <div class="center">
            <div class="box clearFloat">
                <div class="left">
                    <div class="title"><span></span>添加签名印章</div>
                    <div class="stamp-box">
                        <img class="stamp" v-for="(stamp, index) in stamps" 
                            :key="index"  
                            :id="stamp.signer_sn"
                            :draggable="true"
                            :src="'http://user-imgs.oss-cn-beijing.aliyuncs.com/' + stamp.stamp_key"
                            @dragstart="dragstart"
                            @dragend="dragend">
                    </div>
                </div>
                <!-- <div class="center">
                    <div class="center-btn">
                        <el-button type="primary" @click="previousPage">上一页</el-button>
                        <el-button type="primary" @click="nextPage">下一页</el-button>
                        <el-button type="primary" @click="recordSite">记录签署点</el-button>
                    </div>
                </div> -->
                <div class="right"
                >
                    <div 
                        @dragover="dragover"
                        @drop="drop"
                        @dragenter="dragenter" 
                        class="imgBg" 
                        v-for="(img, index) in img_key" :key="index" 
                        :id="'imgBg' + ++index"
                        :style="{'backgroundImage': 'url(http://user-imgs.oss-cn-beijing.aliyuncs.com/' + img + ')', 'backgroundSize': '800px 1132px'}"
                    ></div>
                        
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="btn-box">
                <div class="box">
                    <div class="start">
                        <el-button class="btn1" type="primary" @click="startSign">发起</el-button>
                        <el-button class="btn2" type="primary" plain @click="setDraft">保存到草稿箱</el-button>
                    </div>
                    <el-button class="btn wid" @click="deleteContract(cntrt_no)">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Step from '../Step/step';
import { getStampsByCheckPass, setCoordinate, deleteContract } from '../../../api/contract';
export default {
    data () {
        return {
            Doc_key: null,
            currentPage: 1,
            pageWidth: 800,
            stamps: [],
            // 设置签章位置
            style:null,
            targetImg: '',
            flag: false,
            LbX: '', // 左下横坐标
            LbY: '', // 坐下纵坐标
            RtX: '', // 右上横坐标
            RtY: '', // 右上纵坐标
            coordinates: [],
            currentSignerSn: '',
            cntrt_no: '',
            url: null,
            img_key: [],
            e: null,
            iconUrl: require('../../../images/icon.svg'),
            SignerSnArr: []
        };
    },
    created () {
        let interim = JSON.parse(this.$route.query.data);
        this.stamps = interim.data;
        this.cntrt_no = interim.cntrt_no;
        this.Doc_key = this.$route.query.Doc_key;
        this.img_key = JSON.parse(this.$route.query.img_key);
    },
    methods: {
        go(url){
            this.$router.push({
                path:url
            });
        },
        startSign () {
            this.searchStamp();
            if (this.coordinates.length === 0) {
                    this.$message({
                        message: '请至少添加一个签署点',
                        type: 'warning'
                    });
            } else {
                setCoordinate(JSON.stringify(this.coordinates), this.cntrt_no).then(res => {
                    console.log(res)
                    switch (res.data.error) {
                        case 0:
                            this.$message({
                                message: '发起签名成功',
                                type: 'success'
                            });
                            this.$router.push({
                                path: '/details/home-page',
                            });
                            break;
                        case 30018:
                            this.$message({
                                message: '请不要重复发起',
                                type: 'warning'
                            })
                            break;
                        case 30038:
                            this.$message({
                                message: '每个印章至少设置一次',
                                type: 'warning'
                            });
                            break;
                        default:
                            break;
                    }
                })
            }
        },
        dragstart (e) {
            this.targetImg = this.targetImg === e.target.src ? null : e.target.src;
            this.currentSignerSn = e.target.id;
        },
        dragend (e) {

        },
        dragover (e) {
            e.preventDefault();
        },
        dragenter (e) {
        },
        drop (e) {
            let left = e.layerX - 72;
            let bottom = e.target.offsetHeight - e.layerY - 58;
            left = left < 0 ? 0 : left > e.target.offsetWidth - 144 ? e.target.offsetWidth - 144 : left;
            bottom = bottom < 0 ? 0 : bottom > e.target.offsetHeight - 116 ? e.target.offsetHeight - 116 : bottom;
            this.flag = true;
            // 计算 左下右上两点坐标
            this.LbX = left;
            this.LbY = bottom;
            this.RtX = left + 144;
            this.RtY = bottom + 116;
            if (this.targetImg) {
                var stamp = this.createStamp(this.targetImg);
                this.e = stamp;
                let flag2 = true;
                for (var SignerSn of this.SignerSnArr) {
                    if (this.e.currentSignerSn === SignerSn) {
                        this.$message({
                            message: '不可重复添加印章',
                            type: 'warning'
                        });
                        flag2 = false;
                    }
                }
                if (flag2) {
                    this.SignerSnArr.push(this.e.currentSignerSn);
                    e.target.appendChild(stamp);
                    this.currentSignerSn = null;
                }
            }
            if (this.e) {
                this.e.style.left = this.LbX + 'px';
                this.e.style.bottom = this.LbY + 'px';
                this.e.LbX = this.LbX;
                this.e.LbY = this.LbY;
                this.e.RtX = this.RtX;
                this.e.RtY = this.RtY;
                this.e.currentPage = e.target.id.split('imgBg').pop();
            } 
            console.log(this.e)
        },
        /* createStamp (src) {
            let img = document.createElement('img');
            img.className = 'stampSite';
            img.style.width = '144px';
            img.style.height = '116px';
            img.draggable = true;
            img.style.position = 'absolute';
            img.src = this.targetImg;
            img.currentSignerSn = this.currentSignerSn;
            this.targetImg = null;
            img.addEventListener('dragstart', (e) => {
                this.e = e.target;
            });
            return img;
        }, */
        createStamp (src) {
            let _this = this;
            let div = document.createElement('div');
            div.className = 'stampSite';
            div.style.width = '144px';
            div.style.height = '116px';
            div.currentSignerSn = this.currentSignerSn;
            div.draggable = true;
            div.style.position = 'absolute';

            let img = document.createElement('img');
            img.style.width = '144px';
            img.style.height = '116px';
            img.src = this.targetImg;

            let icon = document.createElement('img');
            icon.style.position = 'absolute';
            icon.style.top = '-5px';
            icon.style.right = '-1px';
            icon.style.color = 'red';
            icon.style.width = '16px';
            icon.style.height = '16px';
            icon.style.zIndex = '100';
            icon.src = this.iconUrl;
            this.targetImg = null;
            div.appendChild(icon);
            div.appendChild(img)
            icon.addEventListener('click', function (e) {
                _this.SignerSnArr.splice(_this.SignerSnArr.indexOf(this.parentNode.currentSignerSn), 1);
                console.log(_this.SignerSnArr)
                this.parentNode.parentNode.removeChild(this.parentNode)
                
            })
            div.addEventListener('dragstart', (e) => {
                this.e = e.target.parentNode;
            });
            return div;
        },
        searchStamp () {
            let _this = this;
            _this.coordinates.length = 0;
            let stampList = this.$el.querySelectorAll('.stampSite');
            for (let stamp of stampList) {
                _this.coordinates.push({
                    SignerSn: stamp.currentSignerSn,
                    LbX: stamp.LbX,
                    LbY: stamp.LbY,
                    RtX: stamp.RtX,
                    RtY: stamp.RtY,
                    PageWidth: _this.pageWidth,
                    PageIndex: stamp.currentPage
                });
            }
            console.log(_this.coordinates)
        },
        setDraft () {
            this.$message({
                message: '保存草稿箱成功',
                type: 'success'
            })
            this.$router.push({
                path: '/details'
            });
        },
        deleteContract (cntrt_no) {
            deleteContract(cntrt_no).then(res => {
                if (res.data.error === 0) {
                    this.$message({
                        message: '已取消发起签署',
                    });
                    this.$router.push({
                        path: '/details'
                    });
                }
            })
        }
    },
    components: {
        Step
    }
};
</script>

<style lang="less" scoped>
.box {
    .top {
        width: 100%;
        &-t {
            width: 100%;
            // height: 60px;
            background: #323439;
            height: 48px;
            .t {
                margin: auto;
                width: 1100px;
                height: 48px;
                display: flex;
                align-items: center;
                line-height: 48px;
                .step {
                    height: 48px;
                }
                a {
                    font-size: 14px;
                    color: #FFFFFF;
                    cursor: pointer;
                }
                span {
                    margin: 0 15px;
                    font-size: 14px;
                    color: #FFFFFF;
                }
            }
        }
        &-b{
            width: 100%;
            // height: 45px;
            height: 60px;
            line-height: 56px;
            background: #10C786;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            color: #FFFFFF;
        }
    }
    .center {
        width: 100%;
        .clearFloat::after {
            content: '';
            visibility: hidden;
            display: block;
            clear: both;
        }
        .box {
            margin: 10px auto;
            width: 1100px;
            // height: 900px;
            .left {
                width: 230px;
                font-size: 18px;
                font-weight: bold;
                float: left;
                color: #3C3C3C;
                .title {
                    width: 220px;
                    height: 40px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    span {
                        width: 3px;
                        height: 18px;
                        background: #000;
                        margin-right: 10px;
                    }

                }
                .stamp-box {
                    width: 220px;
                    margin-top: 10px;
                    .stamp {
                        /* width: 144px;
                        height: 116px; */
                        width: 150px;
                        height: 50px;
                        border: 1px solid #e8e8e8;
                    }
                }
            }
            .center {
                float: left;
                width: 120px;
                height: 800px;
                display: flex;
                align-items: center;
                // margin: auto 0;
                .center-btn {
                    height: 200px;
                    width: 120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    .el-button {
                        margin-left: 0px;
                    }
                }
            }
            .right {
                float:right;
                width: 820px;
                border: 1px solid #d5d5d5;
                box-shadow: 0px 0px 10px 0 #d5d5d5;
                height: 600px;
                overflow-y: scroll;
                .imgBg {
                    width: 800px;
                    height: 1132px;
                    position: relative;
                    border-bottom: 1px solid #d5d5d5;
                }
                .imgBg:last-of-type {
                    border-bottom: none;
                }
                .box {
                    width: 650px;
                    height: 840px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: rgba(0, 0, 0, 0.01);
                }
                .ball {
                    width: 220px;
                    height: 60px;
                    position: absolute;
                    z-index: 9999;
                }
            }
        }
    }
    .bottom {
        width: 100%;
        height: 90px;
        .btn-box {
            // position: relative;
            width: 1100px;
            height: 90px;
            margin: 0 auto;
            display: flex;
            justify-content: flex-end;
            padding-right: 20px;
            align-items: center;
            .box {
                width: 800px;
                display: flex;
                justify-content: space-between;;
                // position: absolute;
                // top: 0;
                // left: 0;
                .start {
                    .el-button {
                        width: 130px;
                        height: 40px;
                    }
                    .btn2 {
                        margin-left: 25px;
                    }
                }
                .el-button {
                    width: 130px;
                    height: 40px;
                }
            }
        }
    }
}
</style>
