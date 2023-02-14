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
      <el-radio-group
        class="kk-table-filter__radio-group"
        :model-value="modelValue"
        @change="change"
      >
        <el-radio
          v-for="item in newList"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-radio-group>
      <div class="kk-table-filter__footer">
        <el-button size="small" type="text" @click="close">重置</el-button>
        <el-button size="small" type="primary" @click="ok"> 确认 </el-button>
      </div>
    </div>
    <template #reference>
      <span
        @click="show"
        class="kk-table-filter__icon"
        :class="{ active: !isNullValue(modelValue) }"
      >
        <IconFilter
          :style="{
            width: '20px',
            height: '20px'
          }"
        ></IconFilter>
      </span>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { IOptions } from "../../../types";
import { isNullValue } from "../../../utils";
import IconFilter from "../../../assets/ic_filtrate.svg";
import { getEnumList } from "/@/api/common/dict";
const visible = ref(false);
const popoverRef = ref();
const newList = ref([]);
type IValue = string | number | boolean;
const props = defineProps<{
  title?: string;
  list?: IOptions[];
  dictKey: string;
  modelValue?: IValue;
  defaultValue?: IValue;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", list: IValue): void;
  (e: "change", list: IValue): void;
  (e: "ok", list: IValue): void;
  (e: "close"): void;
  // (e: "show"): void;
}>();

const change = value => {
  emit("update:modelValue", value);
  emit("change", value);
};
const close = () => {
  visible.value = false;
  emit("update:modelValue", "");
  emit("close");
};
const ok = () => {
  visible.value = false;
  emit("ok", props.modelValue);
};
const onClickOutside = () => {
  visible.value = false;
};
const show = () => {
  if (props.list && props.list.length > 0) {
    newList.value = props.list;
    visible.value = true;
    return;
  }
  getEnumList(props.dictKey).then(res => {
    newList.value = res;
    visible.value = true;
  });
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
