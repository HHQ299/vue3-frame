<template>
  <template v-if="ossInstance">
    <div v-for="(item, i) in _list" :key="item">
      {{ name[i] }}
      <el-button
        v-if="isChange"
        type="text"
        v-downLoad-url="{ url: item, name: name[i] }"
        style="color: #126efe; margin-left: 8px; position: relative; top: -1px"
        v-action:change_download_receipt
      >
        {{ title }}
      </el-button>
      <el-button
        v-else
        type="text"
        v-downLoad-url="{ url: item, name: name[i] }"
        style="color: #126efe; margin-left: 8px; position: relative; top: -1px"
        v-action:all_download_receipt
      >
        {{ title }}
      </el-button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ClusterClient } from "ali-oss";
import { ref, unref, watch } from "vue";

export interface Props {
  isPrivate: boolean;
  list: string[];
  expires?: number;
  ossInstance: ClusterClient;
  name: string[];
  title: string;
}
const props = withDefaults(defineProps<Props>(), {
  expires: 1800,
  isPrivate: false,
  list: () => [],
  title: "下载"
});
// const ossInstance = inject<ClusterClient>("ossInstance");

const _list = ref([]);
watch(
  () => props.list,
  (n, o) => {
    if (n !== o) {
      console.log(props.isPrivate, "props.isPrivate");
      if (props.isPrivate) {
        _list.value = props.list.map(v => {
          let pathname = "";
          if (v.indexOf("http") > -1) {
            const arr = v.split("/");
            pathname = arr.slice(3).join("/");
          } else {
            pathname = v;
          }
          const url = unref(props.ossInstance).signatureUrl(pathname, {
            expires: props.expires
          });
          console.log(url);
          return url;
        });
      } else {
        _list.value = props.list.map(v => {
          let pathname = "";
          if (v.indexOf("http") > -1) {
            pathname = v;
          } else {
            const url = unref(props.ossInstance).signatureUrl(v, {
              expires: props.expires
            });
            pathname = url.split("?")[0];
            console.log(pathname);
          }
          return pathname;
        });
      }
    }
  },
  { immediate: true }
);

const isChange = inject("isChange");
// 下载合同
// function loadfile(item) {
//   window.open(item);
// }
</script>

<style scoped></style>
