<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { initRouter } from "/@/router/utils";
// import { addClass, removeClass } from "/@/utils/operate";
import { useUserStoreHook } from "/@/store/modules/user";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { loadEnv } from "@build/index";
const { VITE_CATE_NAME } = loadEnv();

const router = useRouter();
usePermissionStoreHook().setIsFetchAsyncRoutes(false);

let loginForm = reactive({
  username: "",
  password: ""
});
let rules = reactive({
  username: [
    {
      required: true
    }
  ],
  password: [
    {
      required: true
    }
  ]
});

const onLogin = async () => {
  const { token } = await useUserStoreHook().loginByUsername(loginForm);
  usePermissionStoreHook().clearAllCachePage();
  initRouter(token).then(() => {});
  router.push("/");
};
</script>

<template>
  <div class="bg">
    <div class="login-bg">
      <div class="login-container">
        <div class="img">
          <img src="/page-login/logo.png" class="logo" />
          <span class="tit">“ 资源共享，合作共赢 ”</span>
        </div>
        <div class="login-box">
          <div class="login-form">
            <!-- <avatar class="avatar" /> -->
            <h2
              v-motion
              :initial="{
                opacity: 0,
                y: 100
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 100
                }
              }"
            >
              <!-- 学服中心 -->
              {{ VITE_CATE_NAME }}
            </h2>
            <el-form
              :model="loginForm"
              ref="form"
              :rules="rules"
              label-width="80px"
              :inline="false"
              size="default"
              label-position="top"
            >
              <el-form-item label="用户名">
                <el-input v-model="loginForm.username" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  clearable
                  show-password
                ></el-input>
              </el-form-item>
              <!-- <el-form-item label="">
                <el-button type="primary" style="width: 100%" @click="onLogin">
                  登录
                </el-button>
              </el-form-item> -->
            </el-form>

            <button
              class="btn"
              v-motion
              :initial="{
                opacity: 0,
                y: 10
              }"
              :enter="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 400
                }
              }"
              @click="onLogin"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("/@/style/login.css");
</style>
