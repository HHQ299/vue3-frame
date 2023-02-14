/* eslint-disable no-prototype-builtins */
export const encryption = (obj = {}) => {
  /**
   * 服务器下发的appid
   */
  // const val appId = "c5311528363"
  // const val appKey = "awo6ureum8bn"

  if (isEmptyObj(obj)) return "";

  // 根据key排序
  const keyArr = Object.keys(obj);
  // 按照key生序排列
  keyArr.sort();
  const newObj = {};

  for (let i = 0; i < keyArr.length; i++) {
    if (isNotEmpty(obj[keyArr[i]])) {
      newObj[keyArr[i]] = obj[keyArr[i]];
    }
  }

  const newArr = Object.keys(newObj);

  let str = "";
  for (let j = 0; j < newArr.length; j++) {
    const value = newObj[newArr[j]];

    if (isObj(value) || isArray(value) || strIsEmpty(value)) continue;
    str += `${newArr[j]}=${value}&`;
  }

  if (str.endsWith("&")) {
    // console.log(str.substring(0, str.length - 1))
    return str.substring(0, str.length - 1);
  }
  return str;
};

const isNotEmpty = str => {
  if (typeof str === "number") return true;
  if (typeof str === "undefined") return true;
  if (
    (typeof str === "string" && str.trim() === "") ||
    (Array.prototype.isPrototypeOf(str) && str.length === 0) ||
    (Object.prototype.isPrototypeOf(str) && Object.keys(str).length === 0)
  ) {
    return false;
  }

  return true;
};

const isEmptyObj = obj => {
  return Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0;
};

const isObj = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const isArray = obj => {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

const strIsEmpty = str => {
  if (typeof str === "number") return false;
  return str === "" || str == null || str === undefined;
};
