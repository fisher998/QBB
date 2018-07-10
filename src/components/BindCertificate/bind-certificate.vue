<template>
  <div class="bind-certificate">
        <div class="bind-certificate-top">
            <p class="bind-certificate-top-first">绑定CA证书</p>
            <p class="bind-certificate-top-second">{{ this.$route.path == '/bind-certificate/bind-success' ? '' : '选择证书类型' }}</p>
        </div>
        <router-view />
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.bind-certificate {
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  &-top-first {
    font-size: 30px;
    color: #252525;
    letter-spacing: 1px;
  }
  &-top-second {
    margin-top: 20px;
    font-size: 16px;
    color: #8e8e8e;
  }
}
</style>


