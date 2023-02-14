import md5 from "md5";
import { encryption } from "./encryption";

export function dataEncryption(token, data?) {
  const appId = import.meta.env.VITE_DATA_ENCRYPTION_APPID;
  const appKey = import.meta.env.VITE_DATA_ENCRYPTION_APPKEY;
  if (!appId || !appKey) {
    throw new Error("请传入数据加密的 appId 和 appKey");
  }
  const kktoken = !token ? "" : `&token=${token}`;
  const startStr = encryption(data);
  const time = parseInt(new Date().getTime() / 1000);
  const str = `${
    startStr !== "" ? `${startStr}&` : ""
  }appId=${appId}&appKey=${appKey}&time=${time}${kktoken}`;

  const mStr = md5(str).toLowerCase();

  const dataAll = {
    appId: appId,
    sign: mStr,
    time: time,
    bizContent: {}
  };

  data ? (dataAll.bizContent = data) : (dataAll.bizContent = {});
  data = dataAll;
  return data;
}

export const UPLOAD_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  // TODO
  xlsx: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
  ]
};

/**
 * 生成文件名及存储路径
 * @example
 * file/clue/pc/日期/文件名
 * @param { File } file
 * @param { string } ossPath
 */
export const generateFilename = (file, ossPath = "") => {
  if (typeof ossPath !== "string") {
    throw new Error("类型错误, 请传入字符串");
  }
  let ext = "";
  if (file.name) {
    ext = file.name.split(".");
    ext = "." + ext[ext.length - 1];
  }
  return (
    ossPath +
    getDayNumber() +
    "/" +
    new Date().getTime() +
    "_" +
    parseInt(Math.random() * 10 ** 4) +
    ext
  );
};

/**
 * 获取但当前日期
 */
function getDayNumber() {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return `${yy}${mm.toString().padStart(2, "0")}${dd
    .toString()
    .padStart(2, "0")}`;
}
