export const openLink = <T>(link: T): void => {
  const $a: HTMLElement = document.createElement("a");
  // @ts-expect-error
  $a.setAttribute("href", link);
  $a.setAttribute("target", "_blank");
  $a.setAttribute("rel", "noreferrer noopener");
  $a.setAttribute("id", "external");
  document.getElementById("external") &&
    document.body.removeChild(document.getElementById("external"));
  document.body.appendChild($a);
  $a.click();
  $a.remove();
};

export function getLinkParams(str: string) {
  const obj = {
    HASH: "",
    query: {}
  };
  if (str) {
    str.replace(
      /([^?=&#]+)=([^?=&#]+)/g,
      (_, key, value) => (obj.query[key] = value)
    );
    str.replace(/#([^?=&#]+)/g, (_, hash) => (obj["HASH"] = hash));
  }
  for (const key in obj.query) {
    if (Object.prototype.hasOwnProperty.call(obj.query, key)) {
      const element = obj.query[key];
      obj.query[key] = decodeURIComponent(element);
    }
  }
  // TODO 加上 location.pathname
  return obj;
}
export function combineArray(array1, array2, config = { key: "id" }) {
  let length1 = array1.length;
  const length2 = array2.length;
  for (let i = 0; i < length1; i++) {
    for (let j = 0; j < length2; j++) {
      //判断添加的数组是否为空了
      if (array1.length > 0) {
        if (array1[i][config.key] === array2[j][config.key]) {
          array1.splice(i, 1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
          length1--;
          // console.log(array2[j]); //重复元素
        }
      }
    }
  }

  for (let n = 0; n < array2.length; n++) {
    array1.push(array2[n]);
  }
  return array1;
}
