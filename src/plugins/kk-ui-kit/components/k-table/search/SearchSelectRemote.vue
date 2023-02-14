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
        remote
        size="small"
        :remote-method="remoteMethod"
        :loading="loading"
        :teleported="false"
        @change="change"
      >
        <!-- :placeholder="`请选择${item.label}`" -->
        <el-option
          v-for="option of options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
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
const options = ref([]);
const visible = ref(false);
const loading = ref(false);
const popoverRef = ref();
// const modelValue = ref("");
//
const props = defineProps({
  title: String,
  multiple: Boolean,
  remoteRequest: Function,
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
const remoteMethod = async query => {
  if (query !== "") {
    const res = await props.remoteRequest(query);
    options.value = res.data.list.map(v => {
      return {
        label: v[props.labelKey],
        value: v[props.valueKey]
      };
    });
  } else {
    options.value = [];
  }
};
</script>

<style scoped lang="scss">
@import url("./searchComponent.scss");
</style>
