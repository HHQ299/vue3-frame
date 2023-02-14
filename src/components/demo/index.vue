<script setup>
import { useRouter } from "vue-router";
import { post } from "../../utils/request";
import Toast, { useToastEffect } from "./../../components/Toast.vue";
import { useLoginEffect } from "./useLoginEffect";

const router = useRouter();
// 弹窗组件相关功能
const { show, toastMassage, showToast } = useToastEffect();
// 登陆操作相关功能
const { username, password, handleLogin } = useLoginEffect(showToast);

const handleRegisterClick = () => {
  router.push({ name: "Register" });
};
</script>
<template>
  <div>
    {{ username }}
  </div>
</template>
