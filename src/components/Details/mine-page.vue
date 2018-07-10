<template>
    <div>
        <div class="mine-top-box">
            <div class="mine-top">
                <div class="mine-top-left">
                    <!-- <div class="avatar"></div> -->
                    <img src="../../images/avatar.png" alt="avatar" class="avatar">
                    <div class="avatar-info">
                        <div class="avatar-info-name">
                            <div class="avatar-info-name-l">{{ name || '暂未绑定' }}</div>
                            <div class="avatar-info-name-r">{{ ca_issuer ? 'GDCA' : '未绑定' }}</div>
                        </div>
                        <div class="avatar-info-tel">账号:(+86){{ mobile }}</div>
                    </div>
                </div>
                <div class="mine-top-center">
                    <div>注册时间: {{ create_at }}</div>
                    <!-- <div>身份证号: {{ id_card == '' ? '210504199301290319' : id_card }}</div> -->
                    <div>账号类型: {{ account_type === 1 ?  '个人' : '企业' }}</div>
                </div>
                <div class="mine-top-right">
                    <div v-show="account_type === 1" class="mine-top-right-b">
                        电子邮箱: {{ email || '未绑定' }}
                        <!-- <button class="btn">修改</button> -->
                    </div>
                    <div v-show="account_type === 2" class="mine-top-right-b">联系人: {{ name }}</div>
                    <div v-show="account_type === 2" class="mine-top-right-b">信用号码: {{ company_no }}</div>
                </div>
            </div>
        </div>
        <div class="mine-bottom-box">
            <div class="mine-bottom">
                <router-link v-for="list in lists" :to="list.to" :key="list.id">{{ list.name }}</router-link>
            </div>
        </div>
        <div class="mine-main">
            <router-view />
        </div>
    </div>
</template>

<script>
import { getHomePageInformation } from '../../api/details';
const lists = [
    {
        name: '证书管理',
        to: '/details/mine-page/management'
    },
    {
        name: '购买套餐',
        to: '/details/mine-page/recharge'
    },
    {
        name: '消费流水',
        to: '/details/mine-page/expenditure'
    },
    {
        name: '印章设置',
        to: '/details/mine-page/stamp'
    },
    {
        name: '安全设置',
        to: '/details/mine-page/security-settings'
    },
    {
        name: '联系人',
        to: '/details/mine-page/contact'
    },
    {
        name: '问题反馈',
        to: '/details/mine-page/feedback'
    },
]
export default {
    data () {
        return {
            lists: lists,
            name: '',
            mobile: '',
            ca: '',
            create_at: '',
            account_type: '',
            email: '',
            id_card: '',
            ca_no: '',
            company_no: '',
            ca_issuer: ''
        }
    },
    created () {
        this.$store.dispatch('getAccountInformation').then(res => {
            console.log(res)
            if (res.data.error === 0) {
                this.name = this.$store.getters.name;
                this.mobile = this.$store.getters.mobile;
                this.ca = this.$store.getters.ca;
                this.create_at = this.$store.getters.create_at;
                this.account_type = this.$store.getters.account_type;
                this.email = this.$store.getters.email;
                this.id_card = this.$store.getters.id_card;
                this.ca_no = this.$store.getters.ca_no;
                this.company_no = this.$store.getters.company_no;
            }
        }).catch(error => {

        });
        getHomePageInformation().then(res => {
            if (res.data.error === 0) {
                this.mobile = this.$store.getters.mobile;
                let data = res.data.data;
                this.ca_issuer = data.ca_issuer;
            }
        }).catch(error => {

        });
    },
};
</script>

<style lang="less" scoped>
.mine-top-box {
    width: 100%;
    height: 180px;
    background-image: url(../../images/mineBG.png);
    background-size: 100% 100%;
    display: flex;
    display: -ms-flexbox;
    flex-direction: column;
    align-items: center;
    .mine-top {
        width: 1100px;
        height: 180px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &-left {
            width: 300px;
            display: flex;
            display: -ms-flexbox;
            justify-content: flex-start;
            align-items: center;
            .avatar {
                width: 63px;
                height: 63px;
                border-radius: 50%;
                background: #fff;
                margin-right: 30px;
            }
            .avatar-info {
                height: 58px;
                display: flex;
                display: -ms-flexbox;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                .avatar-info-name {
                    width: 100%;
                    height: 22px;
                    display: flex;
                    display: -ms-flexbox;
                    justify-content: left;
                    align-items: center;
                    .avatar-info-name-l {
                        font-size: 16px;
                        width: 80px;
                        height: 20px;
                        color: #fff;
                        line-height: 20px;
                        margin-right: 20px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .avatar-info-name-r {
                        border: 1px solid #10C786;
                        background: #fff;
                        font-size: 12px;
                        color: #10C786;
                        padding: 4px 8px;
                        border-radius: 14px;
                    }
                }
                &-tel {
                    height: 20px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #FFF;
                }
            }
        }
        &-center {
            width: 305px;
            height: 50px;
            font-size: 14px;
            color: #ffffff;
            display: flex;
            display: -ms-flexbox;
            flex-direction: column;
            align-items: left;
            justify-content: space-between;
            padding: 0 45px;
            border-left: 1px solid #fff;
            border-right: 1px solid #fff;
            margin-left: 15px;
        }
        &-right {
            width: 350px;
            height: 50px;
            font-size: 14px;
            color: #ffffff;
            display: flex;
            display: -ms-flexbox;
            flex-direction: column;
            align-items: left;
            justify-content: space-between;
            padding: 0 45px;
            &-b {
                position: relative;
                width: 100%;
                .btn {
                    width: 58px;
                    height: 26px;
                    outline: none;
                    border: 1px solid #ffffff;
                    font-size: 12px;
                    color: #fff;
                    background: #10C786;
                    border-radius: 5px;
                    position: absolute;
                    top: 50%;
                    margin-top: -13px;
                    right: -30px;
                }
            }
        }
    }
}
.mine-bottom-box {
    width: 100%;
    height: 60px;
    // padding-left: 25px;
    display: flex;
    display: -ms-flexbox;
    justify-content: center;
    background: #FAFAFA;
    .mine-bottom {
        // width: 730px;
        width: 1100px;
        height: 60px;
        line-height: 60px;
        display: flex;
        display: -ms-flexbox;
        justify-content: space-between;
        a {
            font-size: 14px;
            color: #909090;
            // height: 100%;
        }
        .router-link-exact-active {
            border-bottom: 2px solid #0FBC7F;
            color: #0FBC7F;
            font-weight: bold;
        }
    }
}
.mine-main {
    width: 1100px;
    margin: auto;
    min-height: 500px;
    padding-top: 40px;
}
</style>
