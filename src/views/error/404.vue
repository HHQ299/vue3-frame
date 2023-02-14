<script setup lang="ts" name="Page404">
import Image404 from "/@/assets/default-page/404.png";
// const refreshHandle = () => {
//   window.location.reload();
// };
</script>

<template>
  <div class="error-page h-screen-sm">
    <img :src="Image404" alt="Page404" class="error-page__image" />
    <div class="error-page__main">
      <p class="error-page__main-title">抱歉，您访问的页面不存在。</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
      <!-- <el-button type="primary" @click="refreshHandle()">刷新</el-button> -->
    </div>
  </div>
</template>
<style lang="scss">
@import "./error-page.scss";
</style>
