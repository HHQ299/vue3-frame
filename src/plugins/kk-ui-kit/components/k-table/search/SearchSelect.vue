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
      <el-select
        :model-value="modelValue"
        filterable
        :multiple="!!multiple"
        clearable
        size="small"
        :loading="loading"
        :teleported="true"
        @change="change"
      >
        <!-- :placeholder="`请选择${item.label}`" -->
        <el-option
          v-for="option of options"
          :key="option[labelKey || 'label']"
          :label="option[labelKey || 'label']"
          :value="option[valueKey || 'value']"
        ></el-option>
      </el-select>
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
// import { isNullValue } from "../../../utils";
const visible = ref(false);
const loading = ref(false);
const popoverRef = ref();
// const modelValue = ref("");
//
const props = defineProps({
  title: String,
  multiple: Boolean,
  options: Array,
  modelValue: {
    default: "",
    type: [Number, String]
  },
  labelKey: {
    default: "label",
    type: String
  },
  valueKey: {
    default: "value",
    type: String
  }
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
  (e: "change", v: string | number): void;
  (e: "ok", v: string | number): void;
  (e: "close"): void;
}>();

const change = value => {
  emit("update:modelValue", value);
  emit("ok", value);
  emit("change", value);
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
