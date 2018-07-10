<template>
    <div class="register-box">
        <h4>{{ activeName == 'first' ? '个人用户注册' : '企业用户注册' }}</h4>
        <el-tabs v-model="activeName" class="register" @tab-click="handleClick">
            <el-tab-pane label="个人用户注册" name="first" class="register-title" >
                <Personal ref="resetClick1" />
            </el-tab-pane>
            <el-tab-pane label="企业用户注册" name="second" class="register-title">
                <enterprise ref='resetClick2' />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Personal from './personal-register.vue';
import Enterprise from './enterprise-register.vue';
export default {
    data () {
        return {
            activeName: 'first'
        }
    },
    components: {
        Personal,
        Enterprise
    },
    methods: {
        handleClick () {
            this.$refs['resetClick1'].resetClick();
            this.$refs['resetClick2'].resetClick();
        }
    }
};
</script>

<style lang="less" scoped>
.register-box {
    width: 323px;
    height: 100%;
    padding: 50px 0;
    h4 {
        font-size: 28px;
        color: #252525;
        letter-spacing: 0;
        margin-bottom: 20px;
    }
    .el-tabs ::after{
        background-color: #fff;
    }
}
</style>
