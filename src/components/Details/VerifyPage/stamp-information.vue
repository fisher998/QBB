<template>
    <div class="stamp-box">
        <div class="name"><div class="left">签约人:</div>{{ signCertName | signCertName }}</div>
        <div class="time"><div class="left">签约时间:</div>{{ stamp.signTime }}</div>
        <div class="company"><div class="left">颁发机构:</div>{{ stamp.auth }}</div>
    </div>
</template>

<script>
export default {
    props: {
        stamp : {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            signCertName: this.$props.stamp.signCertName
        }
    },
    filters: {
        signCertName: function (value) {
            var name = ''
            value.split('').forEach(key => {
                if (/^[\u4e00-\u9fa5]$/.test(key)) {
                    name += key;
                }
            });
            return name;
        }
    }
}
</script>

<style lang="less" scoped>
.stamp-box {
    width: 380px;
    height: 90px;
    margin-top: 30px;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    color: #595959;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name, .time, .company {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .left {
            display: inline-block;
            width: 80px;
        }
    }
}
</style>
