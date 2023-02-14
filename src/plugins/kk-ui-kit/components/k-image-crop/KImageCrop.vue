<template>
  <el-upload
    ref="refUpload"
    list-type="picture-card"
    action=""
    :auto-upload="false"
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
    <template #file>
      <img
        class="el-upload-list__item-thumbnail"
        :src="imgUrl"
        alt=""
        @error="handleImageLoadError"
      />
      <label class="el-upload-list__item-status-label">
        <el-icon class="el-icon--upload-success el-icon--check">
          <Check />
        </el-icon>
      </label>
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview()"
        >
          <el-icon><ZoomIn /></el-icon>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove()"
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
  <el-dialog
    v-model="dialogVisible"
    title="查看图片"
    top="40px"
    width="440px"
    custom-class="dialog-image"
  >
    <div style="text-align: center">
      <img
        style="width: 400px; height: 400px; display: inline-block"
        :src="dialogImageUrl"
        alt=""
        @error="handleImageLoadError"
      />
    </div>
  </el-dialog>
  <el-dialog
    v-model="isShowImage"
    title="图片裁剪"
    width="500px"
    custom-class="dialog-image"
    :close-on-click-modal="false"
  >
    <div class="cropper-content">
      <div class="cropper" style="text-align: center">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          :enlarge="option.enlarge"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
        />
      </div>
    </div>
    <template #footer>
      <el-button
        @click="
          isShowImage = false;
          fileList = [];
        "
        >取 消</el-button
      >
      <el-button type="primary" @click="finish">确认</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed, ref, unref, watch } from "vue";
import { configOSS } from "/@/utils/oss";
import { Plus, Loading, Delete, ZoomIn, Check } from "@element-plus/icons-vue";

import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadFile } from "element-plus";
// import type { UploadFile, UploadRawFile } from "element-plus";
import useOSS from "../../alioss";
import { generateFilename } from "/@/plugins/kk-ui-kit/utils/requestBodySignature";

const refUpload = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const loading = ref(false);
const fileList = ref([]);
const imgUrl = ref<string>("");
//图片裁剪
let isShowImage = ref<boolean>(false);
let option = ref<any>({
  img: "", // 裁剪图片的地址
  size: 1, // 裁剪生成图片的质量
  full: false, // 是否输出原图比例的截图 默认false
  outputType: "png", // 裁剪生成图片的格式 默认jpg
  canMove: false, // 上传图片是否可以移动
  fixedBox: false, // 固定截图框大小 不允许改变
  original: false, // 上传图片按照原始比例渲染
  canMoveBox: true, // 截图框能否拖动
  autoCrop: true, // 是否默认生成截图框
  // 只有自动截图开启 宽度高度才生效
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 150, // 默认生成截图框高度
  centerBox: true, // 截图框是否被限制在图片里面
  high: false, // 是否按照设备的dpr 输出等比例图片
  enlarge: 1, // 图片根据截图框输出比例倍数
  mode: "contain", // 图片默认渲染方式
  maxImgSize: 2000, // 限制图片最大宽度和高度
  limitMinSize: [100, 120], // 更新裁剪框最小属性
  infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
  fixedNumber: [16, 16] // 截图框的宽高比例
});
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
  let url = "";
  fileList.value = list.map(item => {
    // TODO 必须http开头
    // TODO 兼容性
    const urlParams = new URL(item);
    const pathname = urlParams.pathname.slice(1);
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
  imgUrl.value = url;
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
const uploadHttp = file => {
  // onProgress
  // const { file, onError, onSuccess } = options;

  loading.value = true;
  unref(ossInstance)
    .put(generateFilename(file, getOssFolder.value), file)
    .then(response => {
      const { res, url } = response;
      if (res && res.statusCode === 200) {
        fileList.value = [fileinfo.value];
        // onSuccess(url);
        emit("update:modelValue", url);
        emit("change", url, [url]);
        console.log("上传成功");
      } else {
        ElMessage.error("图片上传失败！");
        // onError(response);
      }
    })
    .catch(err => {
      console.table(err);
      ElMessage.error("图片上传失败！");
      // onError(err);
    })
    .finally(() => {
      loading.value = false;
    });
};
// 图片上传
const handleUploadSuccess = (
  response: any
  // file: UploadFile,
  // fileList: UploadFile[]
) => {
  // console.log("handleUploadSuccess", response, file, fileList);
  if (props.limit > 1) {
    let urls = [];
    if (props.modelValue) {
      // TODO 判断是否是http开头
      urls = props.modelValue.split(",");
      if (response.indexOf("blob:") > -1) {
        ElMessage.error("图片上传错误！");
      } else {
        urls.push(response);
      }
    } else {
      urls = [response];
    }
    const str = urls.join(",");
    emit("update:modelValue", str);
    emit("change", str, urls);
  } else {
    emit("update:modelValue", response);
    emit("change", response, [response]);
  }
};
const { getOSSInstance } = useOSS();

// const beforeUpload = async (file: UploadRawFile) => {
//   // TODO 文件类型 props支持配置式
//   const isImage = configOSS.UPLOAD_TYPES.indexOf(file.type) > -1;
//   const isLt2M = file.size / 1024 / 1024 < props.maxSize;
//   if (!isImage) {
//     ElMessage.error("必须是 .png 和 .jpg 图片！");
//     return false;
//   }
//   if (!isLt2M) {
//     ElMessage.error(`请上传小于 ${props.maxSize} M的图片`);
//     return false;
//   }
//   // return isImage && isLt2M;
//   return new Promise((reslove, reject) => {
//     alert("666");
//     getOSSInstance()
//       .then(res => {
//         ossInstance.value = res.value;
//         if (isImage && isLt2M) {
//           reslove(true);
//         } else {
//           reject();
//         }
//       })
//       .catch(() => {
//         reject();
//       });
//   });
// };

const handleRemove = () => {
  // console.log("handleRemove", file, fileList2);
  // TODO 使用uid是因为 url是个签名后的（可以自己解析删除签名参数）
  // const list = fileList2.map(v => v.response).join(",");
  // emit("update:modelValue", list);
  ElMessageBox.confirm(`确定要删除图片吗？`).then(() => {
    fileList.value = [];
    emit("update:modelValue", "");
    emit("change", "", []);
    // refUpload.value.handleRemove(file);
    // const list = fileList.value
    //   .filter(v => v.response !== file.response)
    //   .map(v => v.response);

    // emit("update:modelValue", list.join(","));
    // emit("change", list.join(","), list);
  });
};

const handlePictureCardPreview = () => {
  dialogImageUrl.value = imgUrl.value;
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
const fileinfo = ref<any>();
// fileList
const handleChange = file => {
  //图片校验
  const isImage = configOSS.UPLOAD_TYPES.indexOf(file.raw.type) > -1;
  const isLt2M = file.raw.size / 1024 / 1024 < props.maxSize;
  if (!isImage) {
    fileList.value = [];
    ElMessage.error("必须是 .png 和 .jpg 图片！");
    return;
  }
  if (!isLt2M) {
    fileList.value = [];
    ElMessage.error(`请上传小于 ${props.maxSize} M的图片`);
    return;
  }
  getOSSInstance()
    .then(res => {
      ossInstance.value = res.value;
      fileinfo.value = file;
      let reader = new FileReader(); // 创建文件读取对象
      reader.onload = async e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        option.value.img = data; // 设置option的初始image
        imgUrl.value = data;
      };
      reader.readAsArrayBuffer(file.raw);
      option.value.fixedNumber = [1, 1];
      isShowImage.value = true;
    })
    .catch(() => {});
  // 图片的裁剪宽高比在这里也可以进行设置
  // if (file.status === "success") {
  //   if (fileList.every(v => v.status === "success")) {
  //     const urls = fileList.filter(v => v.response).map(v => v.response);
  //     const len = urls.length;
  //     if (props.limit > 1) {
  //       const str = urls.join(",");
  //       emit("update:modelValue", str);
  //       emit("change", str, urls as string[]);
  //     } else {
  //       emit("update:modelValue", urls[len - 1]);
  //       emit("change", urls[len - 1], urls);
  //     }
  //   }
  // }
};
// let errorImageLoadCount = ref(0);
// const handleImageLoadError = async error => {
//   if (!props.isPrivate) return;
//   errorImageLoadCount.value++;
//   if (errorImageLoadCount.value > fileList.value.length) {
//     ElMessage.warning("图片失效，请刷新重试！");
//     return;
//   }
//   const urlParams = new URL(error.target.src);
//   const pathname = urlParams.pathname.slice(1);
//   // TODO 只在 errorImageLoadCount == 1 时获取实例
//   const ossInstance = await getOSSInstance();
//   const newUrl = unref(ossInstance).signatureUrl(pathname, {
//     expires: props.expires
//   });
//   error.target.src = newUrl;
// };
const cropper = ref(null);
//完成后提交
const finish = () => {
  cropper.value.getCropBlob(data => {
    // fileList.value = [
    //   new File([data], fileinfo.value.name, { type: fileinfo.value.type })
    // ];
    // 获取当前裁剪好的数据
    // 注此时的data是一个Blob数据，部分接口接收的是File转化的FormData数据
    let file = new File(
      [data], // 将Blob类型转化成File类型
      fileinfo.value.name, // 设置File类型的文件名称
      { type: fileinfo.value.type } // 设置File类型的文件类型
    );

    let reader = new FileReader(); // 创建文件读取对象
    reader.onload = async e => {
      let data;
      if (typeof e.target.result === "object") {
        // 把Array Buffer转化为blob 如果是base64不需要
        data = window.URL.createObjectURL(new Blob([e.target.result]));
      } else {
        data = e.target.result;
      }
      option.value.img = data; // 设置option的初始image
      // imgUrl.value = data;
    };
    reader.readAsArrayBuffer(file);
    option.value.fixedNumber = [1, 1];
    isShowImage.value = false;
    uploadHttp(file);
  });
};

let errorImageLoadCount = ref(0);
const handleImageLoadError = async error => {
  if (!imgUrl.value) return;
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

// :deep(.el-upload-list__item) {
//   transition: none !important;
// }

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

:deep(.el-upload-list__item) {
  width: 104px !important;
  height: 104px !important;
}

.dialog-footer {
  margin-top: 20px;
  text-align: right;
}

.cropper-content {
  margin: auto;

  .cropper {
    width: auto;
    height: 400px;
  }
}
</style>
