<template>
  <el-upload
    ref="refUpload"
    list-type="picture-card"
    action=""
    :auto-upload="true"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
    :on-change="handleChange"
    :on-exceed="handleExceed"
    :multiple="multiple"
    :limit="limit"
    :file-list="fileList"
    :show-file-list="true"
    :disabled="disabled"
    :http-request="uploadHttp"
    accept="image/*"
    :class="{ disabled: fileList.length > 0 }"
  >
    <!-- v-bind="$attrs" -->
    <template #file="{ file }">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url"
        @error="handleImageLoadError"
        alt=""
      />
      <label class="el-upload-list__item-status-label">
        <el-icon class="el-icon--upload-success el-icon--check">
          <Check />
        </el-icon>
      </label>
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <el-icon><ZoomIn /></el-icon>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file, fileList)"
        >
          <el-icon><Delete /></el-icon>
        </span>
      </span>
    </template>
    <el-icon class="is-loading" v-if="loading"><Loading /></el-icon>
    <el-icon v-if="!loading" style="font-size: 16px"><Plus /></el-icon>
    <div v-if="!loading">上传图片</div>
    <template #tip>
      <div class="el-upload__tip">
        {{ tip }}
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible" title="查看图片" top="40px" width="640px">
    <div style="text-align: center">
      <img
        style="max-width: 600px; max-height: 600px; display: inline-block"
        :src="dialogImageUrl"
        alt=""
      />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed, ref, unref, watch } from "vue";
import { configOSS } from "/@/utils/oss";
import { Plus, Loading, Delete, ZoomIn, Check } from "@element-plus/icons-vue";

import { ElMessage, ElMessageBox } from "element-plus";
import type {
  UploadFile,
  UploadRawFile,
  UploadFiles,
  UploadRequestOptions
} from "element-plus";
import useOSS from "../../alioss";
import { generateFilename } from "/@/plugins/kk-ui-kit/utils/requestBodySignature";

const refUpload = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const loading = ref(false);
const fileList = ref([]);

// 生成默认图片组
const initImages = n => {
  if (!n) {
    fileList.value = [];
    return;
  }
  // if (n !== o) {
  let list = [];
  if (props.limit > 1) {
    list = n.split(",");
  } else {
    list = [n];
  }
  fileList.value = list.map(item => {
    // TODO 必须http开头
    // TODO 兼容性
    const urlParams = new URL(item);
    const pathname = urlParams.pathname.slice(1);
    let url = "";
    if (props.isPrivate) {
      console.log("私有路径 - 签名前", pathname);
      url = unref(props.ossInstance).signatureUrl(pathname, {
        expires: props.expires
      });
      console.log("私有路径 - 签名后的", url);
    } else {
      url = item;
    }
    return {
      name: pathname,
      uid: pathname,
      response: item,
      // uid: new Date().getTime(),
      status: "success",
      url: url
    };
  });
  // }
};
watch(() => props.modelValue, initImages, { immediate: true });

const props = defineProps({
  // loading: {
  //   type: Boolean,
  //   default: false
  // },
  // defaultFileList: {
  //   type: Array,
  //   default: () => []
  // },
  modelValue: {
    type: String,
    default: ""
  },
  tip: {
    type: String,
    default: ""
  },
  limit: {
    type: Number,
    default: 9
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxSize: {
    type: Number,
    default: 10
  },
  expires: {
    type: Number,
    default: 1800
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  ossInstance: {
    type: Object,
    required: true
  },
  osspath: {
    type: String,
    validator: function (str: string) {
      const arr = str.split("/");
      return arr[arr.length - 1] === "pc" || arr[arr.length - 1] === "h5";
    },
    required: true
  }
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "change", v: string, array: string[]): void;
}>();

const getOssFolder = computed(() => {
  if (props.isPrivate) {
    return `private/ordercenter/${props.osspath || ""}/`;
  } else {
    return `img/ordercenter/${props.osspath || ""}/`;
  }
});
const ossInstance = ref(null);
const uploadHttp = (options: UploadRequestOptions) => {
  // onProgress
  const { file, onError, onSuccess } = options;

  loading.value = true;

  unref(ossInstance)
    .put(generateFilename(file, getOssFolder.value), file)
    .then(response => {
      console.log(`阿里云OSS上传图片成功回调`, response);
      const { res, url } = response;
      if (res && res.statusCode === 200) {
        onSuccess(url);
      } else {
        ElMessage.error("图片上传失败！");
        onError(response);
      }
    })
    .catch(err => {
      console.table(err);
      ElMessage.error("图片上传失败！");
      onError(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
// 图片上传
const handleUploadSuccess = (
  response: any,
  file: UploadFile,
  fileList: UploadFile[]
) => {
  console.log("handleUploadSuccess", response, file, fileList);
  // if (props.limit > 1) {
  //   let urls = [];
  //   if (props.modelValue) {
  //     // TODO 判断是否是http开头
  //     urls = props.modelValue.split(",");
  //     if (response.indexOf("blob:") > -1) {
  //       ElMessage.error("图片上传错误！");
  //     } else {
  //       urls.push(response);
  //     }
  //   } else {
  //     urls = [response];
  //   }
  //   const str = urls.join(",");
  //   emit("update:modelValue", str);
  //   emit("change", str, urls);
  // } else {
  //   emit("update:modelValue", response);
  //   emit("change", response, [response]);
  // }
};
const { getOSSInstance } = useOSS();
const beforeUpload = async (file: UploadRawFile) => {
  // TODO 文件类型 props支持配置式
  const isImage = configOSS.UPLOAD_TYPES.indexOf(file.type) > -1;
  const isLt2M = file.size / 1024 / 1024 < props.maxSize;
  if (!isImage) {
    ElMessage.error("必须是 .png 和 .jpg 图片！");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error(`请上传小于 ${props.maxSize} M的图片`);
    return false;
  }
  // return isImage && isLt2M;
  return new Promise((reslove, reject) => {
    getOSSInstance()
      .then(res => {
        ossInstance.value = res.value;
        if (isImage && isLt2M) {
          reslove(true);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

const handleRemove = (file: UploadFile, fileList2: UploadFiles) => {
  console.log("handleRemove", file, fileList2);
  // TODO 使用uid是因为 url是个签名后的（可以自己解析删除签名参数）
  // const list = fileList2.map(v => v.response).join(",");
  // emit("update:modelValue", list);
  ElMessageBox.confirm(`确定要删除图片吗？`).then(() => {
    refUpload.value.handleRemove(file);
    const list = fileList.value
      .filter(v => v.response !== file.response)
      .map(v => v.response);

    emit("update:modelValue", list.join(","));
    emit("change", list.join(","), list);
  });
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
const beforeRemove = (file: UploadFile) => {
  console.log("beforeRemove", file);
  // if (file.status === "success") {
  // return ElMessageBox.confirm(`确定要删除图片吗？`)
  // return new Promise((reslove, reject) => {
  //   ElMessageBox.confirm(`确定要删除图片吗？`)
  //     .then(() => {
  //       const list = fileList.value
  //         .filter(v => v.response !== file.response)
  //         .map(v => v.response);

  //       emit("update:modelValue", list.join(","));
  //       emit("change", list.join(","), list);
  //       reslove(file);
  //     })
  //     .catch(reject);
  // });
  // }
};
const handleExceed = () => {
  ElMessage.warning(`图片数量最多 ${props.limit} 个`);
};
const handleChange = (file, fileList) => {
  console.log("handleChange", file, fileList);
  // if (file.status === "success") {
  if (fileList.every(v => v.status === "success")) {
    const urls = fileList.filter(v => v.response).map(v => v.response);
    const len = urls.length;
    if (props.limit > 1) {
      const str = urls.join(",");
      emit("update:modelValue", str);
      emit("change", str, urls as string[]);
    } else {
      emit("update:modelValue", urls[len - 1]);
      emit("change", urls[len - 1], urls);
    }
  }
};
let errorImageLoadCount = ref(0);
const handleImageLoadError = async error => {
  if (!props.isPrivate) return;
  errorImageLoadCount.value++;
  if (errorImageLoadCount.value > fileList.value.length) {
    ElMessage.warning("页面停留时间超过15分钟，请刷新后重试。");
    return;
  }
  const urlParams = new URL(error.target.src);
  const pathname = urlParams.pathname.slice(1);
  // TODO 只在 errorImageLoadCount == 1 时获取实例
  const ossInstance = await getOSSInstance();
  const newUrl = unref(ossInstance).signatureUrl(pathname, {
    expires: props.expires
  });
  error.target.src = newUrl;
};
</script>

<style scoped lang="scss">
.disabled :deep(.el-upload) {
  display: none;
}

:deep(.el-upload-list__item) {
  transition: none !important;
}

:deep(.el-upload-list__item-actions) {
  transition: none !important;
}

:deep(.el-upload--picture-card) {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #999999;
  padding-top: 20px;
}
</style>
