<template>
  <template v-if="_list.length">
    <el-image
      :class="isBig ? 'bigwidth' : 'defaultwidth'"
      v-for="(item, i) in _list"
      :key="item + i"
      :src="item"
      :preview-src-list="_list"
      @error="e => handleImageLoadError(e, i)"
    ></el-image>
  </template>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, unref, watch } from "vue";
import useOSS from "../composables/useOSS";

export interface Props {
  isPrivate: boolean;
  list: string[];
  expires?: number;
  isBig?: boolean;
  // ossInstance: ClusterClient;
}
const props = withDefaults(defineProps<Props>(), {
  expires: 1800,
  isPrivate: false,
  isBig: false,
  list: () => []
});
const { getOSSInstance } = useOSS();
const signatureUrlHandler = (list2 = []) => {
  getOSSInstance().then(ossInstance => {
    const result = list2.map(v => {
      let pathname = "";
      if (v.indexOf("http") > -1) {
        const arr = v.split("/");
        pathname = arr.slice(3).join("/");
      } else {
        pathname = v;
      }
      const options = {
        expires: props.expires
      };
      const url = unref(ossInstance).signatureUrl(pathname, options);
      return url;
    });
    _list.value = result;
  });
};

const _list = ref([]);
watch(
  () => props.list,
  n => {
    if (n.length) {
      if (props.isPrivate) {
        signatureUrlHandler(n);
      } else {
        _list.value = n;
      }
    }
  },
  { immediate: true }
);

let errorImageLoadCount = ref(0);
const handleImageLoadError = async (e, i) => {
  if (!props.isPrivate) return;
  errorImageLoadCount.value++;
  if (errorImageLoadCount.value > props.list.length) {
    ElMessage.warning("图片失效，请刷新重试！");
    return;
  }
  const arr = props.list[i].split("/");
  const pathname = arr.slice(3).join("/");
  const ossInstance = await getOSSInstance();
  _list.value[i] = unref(ossInstance).signatureUrl(pathname, {
    expires: props.expires
  });
  console.log("新URL", JSON.stringify(_list.value));
};
</script>

<style scoped>
.defaultwidth {
  width: 104px;
  height: 104px;
  margin-right: 10px;
}

.bigwidth {
  width: 400px;
  height: 400px;
  text-align: center;
}
</style>
