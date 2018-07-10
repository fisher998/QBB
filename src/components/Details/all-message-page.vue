<template>
    <div class="box">
        <div class="all-title-box">
            <div class="title">
                消息中心
            </div>
        </div>
        <div class="main">
            <div class="li" v-for="(getList, index) in getLists" :key="index" @click="handleClick(getList.NoticeSn)">
                <div class="li-bg"></div>
                <div class="li-info">
                    <div class="top">
                        <div class="left">签宝宝团队</div>
                        <div class="right">{{ getList.time }}</div>
                    </div>
                    <div class="bottom">{{ getList.message }}</div>
                </div>
            </div>
        </div>
        <div class="message" v-if="messageInfo">
            <div class="messageinfo">
                <i class="el-icon-close" @click="close"></i>
                <div class="top">消息通知</div>
                <!-- <div class="title">{{ messageInfo.title }}</div> -->
                <!-- <div class="time">{{ messageInfo.time }}</div> -->
                <div class="info">{{ messageInfo.message }}</div>
                <el-button type="primary" @click="examine">查看</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getNoticeMessage, readAllNotice } from '../../api/details';
export default {
    data () {
        return {
            getLists: null,
            messageInfo: null,
            NoticeSn: []
        }
    },
    created () {
        this.getLists = JSON.parse(this.$route.query.getLists);
        this.getLists.forEach(getList => {
            if (getList.status === 0) {
                this.NoticeSn.push(getList.NoticeSn);
            }
        })
        readAllNotice(JSON.stringify(this.NoticeSn)).then(res => {

        })
    },
    methods: {
        handleClick (NoticeSn) {
            getNoticeMessage(NoticeSn).then(res => {
                this.messageInfo = res.data.data;
            })
        },
        close () {
            this.messageInfo = null;
        },
        examine () {
            this.$router.push({
                path: '/details/file-page'
            });
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    .all-title-box {
        width: 100%;
        height: 70px;
        background: #10C786;
        .title {
            margin: auto;
            width: 1100px;
            height: 70px;
            line-height: 70px;
            font-size: 16px;
            font-weight: bold;
            color: #fff;
        }
    }
    .main {
        margin: auto;
        width: 1100px;
        .li {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 130px;
            border-bottom: 1px solid #efefef;
            cursor: pointer;
            &-bg {
                width: 58px;
                height: 58px;
                background: url(../../images/message2.svg) center center no-repeat;
            }
            &-info {
                width: 1000px;
                height: 50px;
                margin-left: 25px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .top {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .left {
                        font-size: 16px;
                        font-weight: bold;
                        color: #2D2D2D;
                    }
                    .right {
                        margin-left: 55px;
                        font-size: 16px;
                        color: #929292;
                    }
                }
                .bottom {
                    width: 100%;
                    font-size: 14px;
                    color: #929292;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
    }
    .message {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.46);
        display: flex;
        justify-content: center;
        align-items: center;
        .messageinfo {
            width: 410px;
            height: 280px;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 18px;
                color: #868686;
                transform: scale(1.5);
            }
            .top {
                width: 100%;
                height: 50px;
                text-align: center;
                line-height: 49px;
                border-bottom: 1px solid #D5D5D5;
                font-size: 16px;
                color: #868686;
            }
            .info {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 280px;
                height: 135px;
                text-align: center;
                font-size: 16px;
                color: #252525;
            }
            .el-button {
                width: 220px;
                height: 46px;
            }
        }
    }
}
</style>
