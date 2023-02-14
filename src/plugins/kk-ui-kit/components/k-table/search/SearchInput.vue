<template>
  <el-popover
    placement="bottom"
    :width="160"
    :title="title"
    trigger="click"
    v-model:visible="visible"
    ref="popoverRef"
  >
    <div v-click-outside="onClickOutside">
      <el-input
        :model-value="modelValue"
        @input="change"
        size="small"
        placeholder="请输入"
        clearable
      />
      <div style="text-align: right; margin: 8px 0 0 0">
        <el-button size="small" type="text" @click="close">重置</el-button>
        <el-button size="small" type="primary" @click="ok"> 确认 </el-button>
      </div>
    </div>
    <template #reference>
      <span
        @click="visible = true"
        class="kk-table-filter__icon"
        :class="{ active: !!modelValue }"
      >
        <IconSearch
          :style="{
            width: '20px',
            height: '20px'
          }"
        ></IconSearch>
      </span>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconSearch from "../../../assets/ic_search.svg";
const visible = ref(false);
const popoverRef = ref();
// const modelValue = ref("");
//
const props = defineProps({
  title: String,
  list: Array as any,
  modelValue: {
    default: "",
    type: [Number, String]
  }
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
  (e: "change", v: string | number): void;
  (e: "ok", v: string | number): void;
  (e: "close"): void;
}>();

const change = value => {
  let val = value;
  if (typeof value === "string") {
    val = value.trim();
  }
  emit("update:modelValue", val);
  emit("change", val);
};
const close = () => {
  visible.value = false;
  emit("update:modelValue", "");
  // modelValue.value = "";
  emit("close");
};
const ok = () => {
  visible.value = false;
  // emit("ok", modelValue.value);
  emit("ok", props.modelValue);
};
const onClickOutside = () => {
  visible.value = false;
};
</script>

<style scoped lang="scss">
@import url("./searchComponent.scss");
</style>
