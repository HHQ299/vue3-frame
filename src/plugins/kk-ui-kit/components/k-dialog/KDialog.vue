<template>
  <el-dialog
    v-model="_visible"
    ref="refElDialog"
    :before-close="beforeClose"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    v-bind="attrs"
  >
    <slot></slot>

    <template #footer>
      <span class="dialog-footer" v-if="!$slots.footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="ok"> 确认 </el-button>
      </span>
      <slot name="footer" v-else></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: "KDialog"
};
</script>
<script setup lang="ts">
import { useAttrs, ref, watch } from "vue";
import type { ElDialog } from "element-plus";
const _visible = ref(false);
const refElDialog = ref<InstanceType<typeof ElDialog>>();
const attrs = useAttrs();
interface Props {
  modelValue?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false
});

const emit = defineEmits<{
  (e: "update:modelValue", boolean: boolean): void;
  (e: "cancel", done: () => void): void;
  (e: "ok", done: () => void): void;
}>();

// const _visible = computed<boolean>({
//   get() {
//     return props.modelValue;
//   },
//   set(value) {
//     emit("update:modelValue", value);
//   }
// });

watch(
  () => props.modelValue,
  (n, o) => {
    if (n !== o) {
      _visible.value = n;
    }
  },
  {
    immediate: true
  }
);
const beforeClose = (done: () => void) => {
  console.log("beforeClose");
  emit("update:modelValue", false);
  done();
};
// 暴露关闭方法
const showDialog = () => {
  _visible.value = true;
};
// 暴露开启方法
const closeDialog = () => {
  _visible.value = false;
};
// 内部私有关闭方法
const _close = () => {
  _visible.value = false;
  emit("update:modelValue", false);
};
const cancel = e => {
  e.stopPropagation();
  e.preventDefault();
  emit("cancel", _close);
};
const ok = e => {
  e.stopPropagation();
  e.preventDefault();
  emit("ok", _close);
};

defineExpose({
  showDialog,
  closeDialog
});
</script>
