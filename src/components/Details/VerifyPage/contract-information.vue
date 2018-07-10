<template>
    <div class="box">
        <div class="contract-information-box">
            <div class="first">
                <div class="first-title"><span></span>合同信息</div>
                <div class="first-info">合同名称:{{ name.split('.').shift() }}</div>
                <div class="border"></div>
            </div>
            <div class="second">
                <div class="second-title"><span></span>电子印章信息<p>(该电子合同有以下<span>{{ signInfoList.length }}</span>个有效的电子印章信息)</p></div>
                <div class="second-info">
                    <stamp-information v-for="(stamp, index) in signInfoList" :key="index" class="stamp" :stamp="stamp"></stamp-information>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StampInformation from './stamp-information';
/* const stamp =  {
    name: '李大白',
    time: '2018-05-12',
    company: 'GuangDong Certificate Authotity'
}; */
export default {
    props: {
        signInfoList: Array,
        name: String
    },
    data () {
        return {
            // stamp: stamp
        }
    },
    created () {
        console.log(this.$props.signInfoList)
    },
    components: {
        StampInformation
    }
}
</script>

<style lang="less" scoped>
.box {
    width: 100%;
    .contract-information-box {
        margin: 0 auto;
        width: 1100px;
        .first {
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 16px;
                color: #000000;
                span {
                    width: 3px;
                    height: 14px;
                    background: #3C3C3C;
                    margin-left: 5px;
                    margin-right: 10px;
                }
            }
            &-info {
                font-size: 16px;
                color: #595959;
                padding-left: 18px;
            }
            .border {
                width: 1100px;
                margin-left: 5px;
                height: 1px;
                background: #cbcbcb;
            }
        }
        .second {
            margin-top: 20px;
            &-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 16px;
                color: #000000;
                &>span {
                    width: 3px;
                    height: 14px;
                    background: #3C3C3C;
                    margin-left: 5px;
                    margin-right: 10px;
                }
                &>p {
                    color: #595959;
                    margin-left: 15px;
                }
            }
            &-info {
                width: 100%;
                margin-top: 24px;
                padding-left: 20px;
                padding-bottom: 20px;
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items: center;
                border: 1px solid #d8d8d8;
                margin-bottom: 50px;
                .stamp {
                    border-right: 1px solid #d8d8d8;
                }
                .stamp:nth-of-type(3n) {
                    border-right: none;
                }
            }
        }
    }
}
</style>
