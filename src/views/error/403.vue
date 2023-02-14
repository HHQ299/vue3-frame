<script setup lang="ts" name="Page403">
import Image403 from "/@/assets/default-page/403.png";
import { useNav } from "/@/layout/hooks/nav";
const { logout } = useNav();
// const refreshHandle = () => {
//   window.location.reload();
// };
</script>

<template>
  <div class="error-page h-screen-sm">
    <img :src="Image403" alt="Page403" class="error-page__image" />
    <div class="error-page__main">
      <p class="error-page__main-title">抱歉，您无权访问该页面</p>
      <el-button type="primary" @click="logout"> 返回登录 </el-button>
      <!-- <el-button type="primary" @click="refreshHandle()">刷新</el-button> -->
    </div>
  </div>
</template>
<style lang="scss">
@import "./error-page.scss";
</style>
