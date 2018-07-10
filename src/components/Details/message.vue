<template>
    <div class="message-box">
        <div class="top">消息</div>
        <div class="ul">
            <ul class="message-ul">
                <div v-if="getLists.length === 0" class="no-message">暂无消息</div>
                <li v-else class="message-ul-li" v-for="(getList, index) in getLists" :key="index">
                    <div class="li-bg"></div>
                    <div class="li-bottom">
                        <p class="p1">签宝宝团队</p>
                        <p class="p2">{{ getList.message }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="bottom" @click="showAllMessage">查看全部</div>
    </div>
</template>
<script>
export default {
    props: {
        getLists: Array
    },
    data () {
        return {

        }
    },
    methods: {
        showAllMessage () {
            this.$router.push({
                path: '/details/all-message-page',
                query: {
                    getLists: JSON.stringify(this.getLists)
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.message-box {
    width: 250px;
    padding: 32px 0;
    position: relative;
    .ul {
        min-height: 180px;
        max-height: 270px;
        overflow-y: scroll;
        .no-message {
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 180px;
            font-size: 12px;
            color: #B8B8B8;
        }
        .message-ul {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            &-li {
                width: 100%;
                padding: 0 25px;
                height: 64px;
                display: flex;
                // justify-content: flex-start;
                align-items: center;
                border-bottom: 1px solid #E8E8E8;
                .li-bg {
                    width: 31px;
                    height: 31px;
                    background: url(../../images/message1.svg) center center no-repeat;
                }
                .li-bottom {
                    width: 120px;
                    height: 30px;
                    margin-left: 10px;
                    .p1 {
                        font-size: 12px;
                        color: #222222;
                    }
                    .p2 {
                        font-size: 12px;
                        color: #929292;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
    .top {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        background: #F7F7F7;
        text-align: center;
        color: #222222;
        border-bottom: 1px solid #E8E8E8;
    }
    .bottom {
        position: absolute;
        bottom: 0px;
        left: 0px;
        right: 0px;
        text-align: center;
        line-height: 30px;
        background: #F7F7F7;
        border-top: 1px solid #E8E8E8;
        width: 100%;
        height: 32px;
        font-size: 12px;
        color: #222222;
        cursor: pointer;
    }
}
</style>
