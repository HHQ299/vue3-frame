<template>
  <el-upload
    class="upload-excel"
    accept=".xls, .xlsx, .csv"
    action="#"
    :multiple="false"
    drag
    :show-file-list="false"
    :on-change="handleChange"
    :auto-upload="true"
    :before-upload="beforeUpload"
    :http-request="uploadHttp"
  >
    <!-- :limit="1" -->
    <div v-if="uploadFile.name && modelValue" class="filestyle">
      <img :src="fileicon" style="width: 48px" />
      <div>
        {{ uploadFile.name }}
        <span class="size">（{{ uploadFile.sizeText }}）</span>
      </div>
      <el-button>重新选择</el-button>
    </div>
    <template v-else>
      <el-icon class="el-icon--upload"><Plus /></el-icon>
      <div class="el-upload__text">点击选择文件或将文件拖拽至此</div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import fileicon from "/@/assets/common/file-icon.png";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { UploadFile, ElFile } from "element-plus";
import { unref, ref } from "vue";
import { configOSS } from "/@/utils/oss";
import { useOSS } from "/@/plugins/kk-ui-kit/alioss/composables/useOSS";
import { generateFilename } from "/@/plugins/kk-ui-kit/utils/requestBodySignature";
const props = defineProps({
  accept: {
    type: String
  },
  modelValue: {
    type: String
  },
  flieType: {
    type: String,
    default: "file"
  }
});
const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const ossInstance = ref(null);
const { getOSSInstance } = useOSS();
const beforeUpload = (file: ElFile) => {
  console.log(file.type, "file.type");
  const isExcel = configOSS.UPLOAD_TYPES_XLSX.indexOf(file.type) > -1;
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isExcel) {
    ElMessage.error("必须是表格！");
  }
  if (!isLt2M) {
    ElMessage.error(`文件必须小于 2MB！`);
  }
  // return isExcel && isLt2M;
  return new Promise((reslove, reject) => {
    getOSSInstance()
      .then(res => {
        ossInstance.value = res.value;
        if (isExcel && isLt2M) {
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

const uploadFile = ref<any>({});
const handleChange = (file: UploadFile) => {
  uploadFile.value = file;
  uploadFile.value.sizeText = (file.size / 1024).toFixed(2) + "kb";
  console.log(uploadFile);
};

const uploadHttp = ({ file }) => {
  // TODO v-loading 效果
  unref(ossInstance)
    .put(
      generateFilename(file, props.flieType + "/ordercenter/materia/pc/"),
      file
    )
    .then(({ res, url, name }) => {
      if (res && res.status === 200) {
        console.log(`阿里云OSS上传文件成功回调`, res, url, name);

        emit("update:modelValue", url);
      } else {
        ElMessage.error("上传失败！");
      }
    })
    .catch(err => {
      console.table(err);
    });
};
</script>

<style scoped lang="scss">
.filestyle {
  color: #333;
  text-align: center;

  img {
    display: inline-block;
    padding-top: 30px;
  }
}

.upload-excel {
  padding-bottom: 10px;

  :deep(.el-upload-dragger) {
    border: 1px solid #d9d9d9 !important;
    width: 440px !important;
    height: 208px;
  }

  .el-upload-dragger .el-icon--upload {
    font-size: 24px;
    margin-top: 70px;
  }
}

span.size {
  line-height: 46px;
  padding-bottom: 10px;
}
</style>
