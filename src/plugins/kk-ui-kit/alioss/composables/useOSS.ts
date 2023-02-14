import OSS from "ali-oss";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { fetchOSSConfig } from "../api/oss";
import { isUrl } from "../../utils";

function initOSS(result) {
  const difference =
    new Date(result.expiration).getTime() - new Date().getTime();
  console.log("refreshSTSTokenInterval", difference / 1000 / 60);
  // 获取域名的二级子域名
  const region = result.endPoint.split(".")[0];
  return new OSS({
    region: region,
    accessKeyId: result.accessKeyId,
    accessKeySecret: result.accessKeySecret,
    stsToken: result.securityToken,
    bucket: result.bucketName,
    endPoint: result.endPoint,
    expiration: result.expiration,
    refreshSTSToken: async () => {
      const expire = new Date(result.expiration).getTime() - 1 * 60 * 1000;
      if (expire > new Date().getTime()) {
        console.log(
          "还未过期：",
          "当前时间 ",
          new Date(),
          "过期时间 ",
          result.expiration
        );
        return {
          accessKeyId: result.accessKeyId,
          accessKeySecret: result.accessKeySecret,
          stsToken: result.securityToken
        };
      }

      const { data } = await fetchOSSConfig({});
      console.log(
        "过期刷新：",
        "当前时间 ",
        new Date(),
        "过期时间 ",
        result.expiration,
        "新的过期时间",
        data.expiration
      );
      return {
        // region: "oss-cn-beijing",
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.securityToken
        // bucket: data.bucketName,
        // endPoint: data.endPoint,
        // expiration: data.expiration
      };
    },
    refreshSTSTokenInterval: 5 * 60 * 1000,
    // refreshSTSTokenInterval: difference,
    success_action_status: "200",
    "x-oss-security-token": result.securityToken,
    secure: true
  });
}
function useOSS() {
  const ossInstance = ref(null);
  const getOSSInstance = async () => {
    try {
      const { data } = await fetchOSSConfig({});
      ossInstance.value = initOSS(data || {});
      return ossInstance;
    } catch (error) {
      ElMessage.error("OSS 获取失败！");
    }
  };
  const signatureUrl = (fileName, options = { expires: 1800 }) => {
    if (isUrl(fileName)) {
      throw new Error("请输入OSS文件路径");
    }
    if (!ossInstance.value) {
      throw new Error("请先实例化 OSS");
    }
    return ossInstance.value.signatureUrl(fileName, options);
  };
  const getDownloadUrl = (fileName, options = { expires: 1800 }) => {
    if (isUrl(fileName)) {
      throw new Error("请输入OSS文件路径");
    }
    if (!ossInstance.value) {
      throw new Error("请先实例化 OSS");
    }
    const arr = fileName.split("/");
    return ossInstance.value.signatureUrl(fileName, {
      expires: options.expires,
      response: {
        "content-disposition":
          'attachment; filename="' + arr[arr.length - 1] + '"'
      }
    });
  };
  // const put = async (pathName, file) => {
  //   if (!ossInstance.value) {
  //     throw new Error("请先实例化 OSS");
  //   }
  //   return new Promise((reslove, reject) => {
  //     ossInstance.value
  //       .put(pathName, file)
  //       .then(response => {
  //         reslove(response);
  //       })
  //       .catch(reject);
  //   });
  // };
  return { ossInstance, getOSSInstance, signatureUrl, getDownloadUrl };
}

export { useOSS };
export default useOSS;
