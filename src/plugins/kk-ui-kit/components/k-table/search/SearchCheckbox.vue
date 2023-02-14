<template>
  <el-popover
    placement="bottom"
    :width="160"
    :title="title"
    trigger="click"
    v-model:visible="visible"
    ref="popoverRef"
    popper-class="kk-table-popover"
  >
    <div v-click-outside="onClickOutside">
      <el-checkbox-group
        class="kk-table-filter__checkbox-group"
        :model-value="modelValue"
        @change="change"
      >
        <el-checkbox v-for="item in list" :key="item.value" :label="item.value">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="kk-table-filter__footer">
        <el-button size="small" type="text" @click="close">重置</el-button>
        <el-button size="small" type="primary" @click="ok"> 确认 </el-button>
      </div>
    </div>
    <template #reference>
      <span
        @click="visible = true"
        class="kk-table-filter__icon"
        :class="{ active: modelValue && modelValue.length }"
      >
        <IconFilter
          :style="{
            width: '20px',
            height: '20px'
          }"
        />
      </span>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconFilter from "../../../assets/ic_filtrate.svg";
import type { IOptions } from "../../../types";
const visible = ref(false);
const popoverRef = ref();
//
type IValue = string[] | number[];
type Props = {
  title: string;
  list: IOptions[];
  modelValue?: IValue;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
  list: () => [],
  modelValue: () => []
});
const emit = defineEmits<{
  (e: "update:modelValue", list: IValue): void;
  (e: "change", list: IValue): void;
  (e: "ok", list: IValue): void;
  (e: "close"): void;
}>();

const change = values => {
  emit("update:modelValue", values);
  emit("change", values);
};
const close = () => {
  visible.value = false;
  emit("update:modelValue", []);
  emit("close");
};
const ok = () => {
  visible.value = false;
  emit("ok", props.modelValue);
};
const onClickOutside = () => {
  visible.value = false;

  // unref(popoverRef).popperRef?.delayHide?.();
};
</script>
<style lang="scss">
.kk-table-popover {
  padding: 0 !important;
}
</style>
<style scoped lang="scss">
@import url("./searchComponent.scss");
</style>
