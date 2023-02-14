<script setup lang="ts" name="Page500">
import Image500 from "/@/assets/default-page/500.png";
import { useNav } from "/@/layout/hooks/nav";
const { logout } = useNav();
</script>

<template>
  <div class="error-page h-screen-sm">
    <img :src="Image500" alt="Page500" class="error-page__image" />
    <div class="error-page__main">
      <p class="error-page__main-title">抱歉，服务器出错了</p>
      <!-- <el-button type="primary" @click="$router.push('/')">返回首页</el-button> -->
      <el-button type="primary" @click="logout()">返回登录</el-button>
    </div>
  </div>
</template>
<style lang="scss">
@import "./error-page.scss";
</style>
