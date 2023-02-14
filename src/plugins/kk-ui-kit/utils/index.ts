/* eslint-disable no-useless-escape */
export const formatDate = (date, format) => {
  const obj = {
    "M+": date.getMonth() + 1,
    "D+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S+": date.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (const k in obj) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? obj[k]
          : ("00" + obj[k]).substr(("" + obj[k]).length)
      );
    }
  }
  return format;
};
export const getType = (data): string => {
  return Object.prototype.toString.call(data).slice(8, -1);
};
export const getDataTypeString = data => {
  return Object.prototype.toString.call(data);
};
export const isType = (
  data,
  type: "String" | "Number" | "Object" | "Null" | "Undefined" | "Array"
) => {
  return getDataTypeString(data) === `[object ${type}]`;
};
// TODO 方法兼容性
export const isEmptyObject = (obj: object) => {
  return !Reflect.ownKeys(obj).length;
};
export const isNullValue = data => {
  return data === null || data === undefined || data === "";
};
export const type = function (data) {
  const toString = Object.prototype.toString;
  const dataType =
    data instanceof Element
      ? "element" // 为了统一DOM节点类型输出
      : toString
          .call(data)
          .replace(/\[object\s(.+)\]/, "$1")
          .toLowerCase();
  return dataType;
};
export const getSearchParams = (paramsModelList, type) => {
  const searchModel = {};
  let search = [];
  if (type === "search") {
    search = paramsModelList.fields;
  } else if (type === "columns") {
    search = paramsModelList
      .filter(v => {
        return v.searchConfig && v.searchConfig.type;
      })
      .map(v => v.searchConfig);
  }
  if (search.length) {
    search.forEach(item => {
      switch (item.type) {
        case "checkbox":
        case "checkbox-button":
          searchModel[item.name] = [];
          break;
        default:
          break;
      }
      if (item.defaultValue !== undefined) {
        searchModel[item.name] = item.defaultValue;
        // 日期范围和时间范围真实变量默认值
        if (
          (item.type === "daterange" || item.type === "datetimerange") &&
          !!item.trueNames &&
          Array.isArray(item.defaultValue)
        ) {
          item.defaultValue.forEach((val, index) => {
            searchModel[item.trueNames[index]] = val;
          });
        }
      }
    });
  }
  return searchModel;
};
/**
 *
 * 优化搜索字段
 * 1、如果搜索配置有transform处理函数，执行transform
 * 2、删除日期范围默认的name字段
 * */
export const optimizeParams = (paramsModelList, type, searchParams) => {
  let search = [];
  if (type === "search") {
    search = paramsModelList.fields;
  } else if (type === "columns") {
    search = paramsModelList
      .filter(v => {
        return v.searchConfig && v.searchConfig.type;
      })
      .map(v => v.searchConfig);
  }
  const params = JSON.parse(JSON.stringify(searchParams));

  if (search.length) {
    search.forEach(item => {
      if (!Object.prototype.hasOwnProperty.call(item, "name")) {
        return;
      }
      if (item.transform) {
        params[item.name] = item.transform(params[item.name]);
      }
      if (
        (item.type === "daterange" || item.type === "datetimerange") &&
        !!item.trueNames
      ) {
        delete params[item.name];
      }
    });
  }
  return params;
};
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}
