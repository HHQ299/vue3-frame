import { unref } from "vue";

export const setColumnsOptions = (
  data,
  columnsProp,
  columnList,
  objKey = "options"
) => {
  const index = unref(columnList).findIndex(v => {
    return v.prop === columnsProp;
  });
  unref(columnList)[index].searchConfig[objKey] = data;
};
export const setFieldsOptions = (list, fieldName, searchConfig) => {
  const index = searchConfig.fields.findIndex(v => {
    return v.name === fieldName;
  });
  searchConfig.fields[index].options = list;
};

export const useMergeSpan = columnProp => {
  const mergeSpanArray = []; // 空数组，记录每一行的合并数
  let mergeSpanArrayIndex = 0; // mergeSpanArr的索引
  function getMergeSpan(data) {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        mergeSpanArray.push(1);
        mergeSpanArrayIndex = 0;
      } else {
        // 判断当前元素与上一个元素是否相同
        if (data[i][columnProp] === data[i - 1][columnProp]) {
          mergeSpanArray[mergeSpanArrayIndex] += 1;
          mergeSpanArray.push(0);
        } else {
          mergeSpanArray.push(1);
          mergeSpanArrayIndex = i;
        }
      }
    }
    // 如果第一条记录索引为0，向数组中push 1，设置索引值
    // 如果不是第一条记录，判断与前一条记录是否相等，相等则向mergeSpanArr添加元素0
    // 且将前一条记录+1，即需要合并的行数+1，直到得到所有需要合并的行数
  }
  return {
    mergeSpanArray,
    mergeSpanArrayIndex,
    getMergeSpan
  };
};
