import { IDictItem } from "../api/types";

/**  翻译字典值 */
export const useDictItemByValue = (value, dictKey, filterKey = "value") => {
  const dictList: IDictItem[] = JSON.parse(
    sessionStorage.getItem(dictKey) || "[]"
  );
  const obj = dictList.find(v => v[filterKey] == value) || {
    label: "",
    value: "",
    tagType: ""
  };
  return obj;
};
