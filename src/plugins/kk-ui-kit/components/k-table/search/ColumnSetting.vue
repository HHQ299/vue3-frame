<template>
  <el-popover
    :width="160"
    placement="left-start"
    trigger="click"
    v-model:visible="visible"
    ref="popoverRef"
    popper-class="kk-table-popover"
  >
    <div v-click-outside="onClickOutside">
      <el-checkbox-group
        class="kk-table-filter__checkbox-group"
        v-model="modelValue"
        @change="change"
      >
        <el-checkbox
          v-for="item in _list"
          :key="item.prop"
          :label="item.prop"
          :checked="item.checked"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
      <div class="kk-table-filter__footer">
        <el-button size="small" type="text" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="ok"> 确认 </el-button>
      </div>
    </div>
    <template #reference>
      <el-button @click="visible = true">
        <IconList
          :style="{
            width: '18px',
            height: '18px'
          }"
        ></IconList>
      </el-button>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, PropType } from "vue";
import IconList from "../../../assets/ic_list.svg";

const visible = ref(false);
const popoverRef = ref();
const modelValue = ref([]);
//
const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
    required: true
  },
  localStorageColumnsKey: {
    type: String,
    required: true
  }
});
const _list = computed(() => {
  return props.list
    .filter(v => {
      if (v.prop === "operate" || v.type === "selection") {
        return false;
      }
      return true;
    })
    .map(v => {
      return {
        label: v.label,
        prop: v.prop,
        disabled: v.minWidth ? true : false,
        checked: true
      };
    });
});
const emit = defineEmits<{
  (e: "change", list: string[]): void;
  (e: "ok", list: string[]): void;
  (e: "close"): void;
}>();
onMounted(() => {
  const showColumnPropList = JSON.parse(
    localStorage.getItem(props.localStorageColumnsKey) || "[]"
  );
  if (showColumnPropList.length) {
    modelValue.value = showColumnPropList;
  }
});

const change = values => {
  emit("change", values);
};
const close = () => {
  visible.value = false;
  emit("close");
};
const ok = () => {
  visible.value = false;
  localStorage.setItem(
    props.localStorageColumnsKey,
    JSON.stringify(modelValue.value || [])
  );
  emit("ok", modelValue.value);
};
const onClickOutside = () => {
  visible.value = false;
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
