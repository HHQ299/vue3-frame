<template>
  <el-upload
    action="#"
    :auto-upload="true"
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleUploadSuccess"
    :on-exceed="handleExceed"
    :multiple="multiple"
    :limit="limit"
    :file-list="fileList"
    :show-file-list="true"
    :disabled="disabled"
    :http-request="uploadHttp"
  >
    <el-button>
      <i style="margin-right: 4px" class="iconfont icon-ic_uploading"></i>
      选择文件</el-button
    >
    <template #tip>
      <div class="el-upload__tip">
        支持扩展名：rar 、zip 、doc 、docx 、pdf 、jpg
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { computed, unref, ref, watch } from "vue";
import type {
  ElFile,
  UploadFile
} from "element-plus/es/components/upload/src/upload.type";
import { ElMessage, ElMessageBox } from "element-plus";
import { useOSS } from "/@/plugins/kk-ui-kit/alioss/composables/useOSS";
import { generateFilename } from "/@/plugins/kk-ui-kit/utils/requestBodySignature";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  defaultFileList: {
    type: Array,
    default: () => []
  },
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
    default: 1
  },
  multiple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  maxSize: {
    type: Number,
    default: 30
  }
});

let filename = "";
const loading = ref(false);
const _defaultFileList = ref([]);

const fileList = computed(() => {
  if (props.modelValue) {
    return [
      {
        name: filename ? filename : props.name,
        url: props.modelValue
      }
    ];
  }
  return [];
});
watch(props.defaultFileList, n => {
  _defaultFileList.value = n.map(item => {
    return {
      name: props.name,
      url: item
    };
  });
});
// 生成默认图片组
watch(
  () => props.modelValue,
  (n, o) => {
    if (!n) {
      fileList.value = [];
      return;
    }
    if (n !== o) {
      let list = [];
      if (props.multiple) {
        list = n.split(",");
      } else {
        list = [n];
      }
      fileList.value = list.map(item => {
        return {
          name: props.name,
          uid: new Date().getTime(),
          status: "success",
          url: item
        };
      });
    }
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "update:sendname", v: string): void;
}>();

const ossInstance = ref(null);

const uploadHttp = ({ file }) => {
  filename = file.name;
  let ext = "";
  let name = "";
  if (file.name) {
    ext = file.name.split(".");
    name = ext[0];
    ext = "." + ext[ext.length - 1];
  }
  if (name.length > 100) {
    filename = name.slice(0, 100) + ext;
  }
  emit("update:sendname", filename);
  loading.value = true;
  unref(ossInstance)
    .put(generateFilename(file, "file/ordercenter/pc/"), file)
    .then(({ res, url }) => {
      if (res && res.status === 200) {
        // console.log(`阿里云OSS上传图片成功回调`, res, url, name);
        if (props.multiple) {
          let urls = [];
          if (props.modelValue) {
            if (props.modelValue.indexOf("blob:") == -1) {
              urls = props.modelValue.split(",");
            }
            urls.push(url);
          } else {
            urls = [url];
          }
          emit("update:modelValue", urls.join(","));
        } else {
          console.log("url", url);
          emit("update:modelValue", url);
        }
      } else {
        ElMessage.error("上传失败！");
      }
      loading.value = false;
    })
    .catch(err => {
      console.table(err);
      loading.value = false;
    });
};
// 图片上传
const handleUploadSuccess = (
  response,
  file: UploadFile,
  fileList: UploadFile[]
) => {
  console.log("handleUploadSuccess", fileList);
  emit("update:modelValue", file.response as string);
};
const { getOSSInstance } = useOSS();
const beforeUpload = (file: ElFile) => {
  console.log(file.type);
  const UPLOAD_TYPES = [
    "image/jpeg",
    "image/jpg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    ""
  ];
  const isImage = UPLOAD_TYPES.indexOf(file.type) > -1;
  const isLt2M = file.size / 1024 / 1024 < props.maxSize;

  if (!isImage) {
    ElMessage.error("选择正确格式的文件！");
  }
  if (!isLt2M) {
    ElMessage.error(`文件必须小于 ${props.maxSize} MB！`);
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

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  const list = fileList.map(v => v.url).join(",");
  emit("update:modelValue", list);
  emit("update:sendname", "");
};
const beforeRemove = (file: UploadFile) => {
  if (file.status == "success") {
    return ElMessageBox.confirm(`确定要删除文件吗？`);
  }
};
const handleExceed = () => {
  ElMessage.warning(`数量最多 ${props.limit} 个`);
};
</script>
<style lang="scss" scoped>
:deep(.el-upload-list__item .el-upload-list__item-name) {
  white-space: normal;
}
</style>
