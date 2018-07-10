<template>
    <div class="bind-success">
        <p>恭喜！CA证书绑定成功！您现在可以使用电子签名了。</p>
        <div class="bind-success-btn">
            <button class="btn" @click="next">进入主页</button>
        </div>
  </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        next () {
            if (true) {
                this.$router.push({
                    path: '/details/home-page'
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../../../static/css/index.less";
.bind-success {
    margin: 100px;
  p {
      text-align: center;
      font-size: 18px;
      color: #3f3e3e;
  }
  &-btn {
      margin-top: 50px;
    .btn {
      width: 180px;
      height: 40px;
      outline: none;
      color: #fff;
      background: @color-main;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover{
        background:@color-main-1
    }
  }
}
</style>


