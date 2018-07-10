<template>
    <div class="header-box">
        <div class="header-box-left">
            <h1>签宝宝</h1>
            <router-link to="/details/home-page" class="router" active-class="green">首页</router-link>
            <router-link to="/details/file-page" class="router" active-class="green">文件管理</router-link>
            <router-link to="/details/mine-page" class="router" active-class="green">个人中心</router-link>
            <router-link to="/details/verify-page" class="router" active-class="green">验签</router-link>
        </div>
        <div class="header-box-right">
                <!-- height="340px" -->
                <!-- width="250px" -->
            <el-popover
                trigger="hover"
            >
                <div slot="reference" class="header-box-right-left">
                    <span v-if="total > 0" class="header-box-right-left-icon">{{ total }}</span>
                </div>
                <message :getLists="getLists" />
            </el-popover>
            <div class="header-box-right-right" @click="logOut"></div>
        </div>
    </div>
</template>

<script>
import Message from './message';
import { getList } from '../../api/contract';
import { getHomePageInformation } from '../../api/details';
export default {
    data () {
        return {
            getLists: [],
            total: 1
        }
    },
    created () {
        this.$store.dispatch('getAccountInformation').then(res => {
            if (res === 0) {

            }
        }).catch(error => {

        });
        getHomePageInformation().then(res => {
            if (res.data.error === 0) {
                this.mobile = this.$store.getters.mobile;
                let data = res.data.data;
                this.stampUrl = data.stamp_url;
                this.total = data.notice_status;
            }
        }).catch(error => {

        });
        getList().then(res => {
            this.getLists = res.data.data;
        }).catch(error => {

        })
    },
    methods: {
        // 退出登陆
        logOut () {
            this.$store.dispatch('adminLoginOut').then(res => {
                if (res === 0) {
                    this.$router.push({
                        path: '/initial'
                    });
                }
            }).catch(error => {
                
            });
        }
    },
    components: {
        Message
    }
};
</script>

<style lang="less" scoped>
.header-box {
    width: 1100px;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    &-left {
        width: 580px;
        height: 65px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h1 {
            width: 75px;
            height: 25px;
            background: url(../../images/logo.svg) center center no-repeat;
            font-size: 0px;
            margin-right: 60px;
        }
        .router {
            height: 65px;
            line-height: 61px;
            font-size: 14px;
            border-top: 2px solid #fff;
            color: #B8B8B8;
            padding: 0 2px;
        }
        .green {
            font-weight: bold;
            color: #10C786;
            border-top: 2px solid #10C786;
        }
    }
    &-right {
        width: 80px;
        height: 65px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-left {
            width: 22px;
            height: 22px;
            background: url(../../images/message.svg) center 1px no-repeat;
            position: relative;
            &-icon {
                font-size: 12px;
                color: #ffffff;
                background: #F5434D;
                padding: 2px 4px 1px 4px;
                border-radius: 8px;
                position: absolute;
                top: -8px;
                left: 12px;
            }
            /deep/.message{
                ul {
                    li {
                        color: red;
                    }
                }
            }
        }
        &-right {
            width: 20px;
            height: 20px;
            background: url(../../images/logout.svg) center top no-repeat;
        }
    }
}
</style>
