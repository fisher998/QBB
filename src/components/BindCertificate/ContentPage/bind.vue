<template>
    <div class="bind-certificate-box">
        <p class="bind-certificate-box-title">目前支持以下类型的UKEY,若您持有列表中列出的UKEY则绑定后即可进行电子签名,否则可返回申请新的CA证书。</p>
        <div class="bind-certificate-box-select">
            <el-select placeholder="请选择UKEY类型" class="select" v-model="value">
                <el-option v-for="(ukey, index) in ukeyList" :key="index" :label="ukey.ukey_version" :value="ukey.ukey_id"></el-option>
            </el-select>
        </div>
        <div class="bind-certificate-box-btn">
            <button class="btn" @click="bindStart">下一步</button>
        </div>
        <bind-start @show="bindStartShow" v-if="isShow" :version="value"></bind-start>
  </div>
</template>
<script>
import BindStart from "./bind-start";
import { getUkeyList } from '../../../api/register';
export default {
    components: {
        BindStart
    },
    data() {
        return {
            value: null,
            isShow: false,
            ukeyList: []
        };
    },
    created () {
        getUkeyList().then(res => {
            this.ukeyList = res.data.data;
        });
    },
    methods: {
        bindStartShow: function() {
            this.isShow = false;
        },
        bindStart() {
            if (!this.value) {
                this.$message({
                    message: '请选择您的ukey类型',
                    type: 'warning'
                });
            } else {
                this.isShow = true;
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.bind-certificate-box {
    margin: 100px 0;
    text-align: center;
    &-title {
        font-size: 16px;
    }
    &-select {
            margin: 50px 0;
        .select {
            width: 400px;
        }
    }
    &-btn {
        .btn {
            width: 180px;
            height: 40px;
            outline: none;
            color: #fff;
            background: @color-main;
            border: none;
            border-radius: 4px;
        }
        .btn:hover {
            background: @color-main-1;
            cursor: pointer;
        }
    }
}
</style>
