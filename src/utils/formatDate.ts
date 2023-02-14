// 获取当前年月日时分秒 true为年月日时分秒 false为年月日
export const nowTime = (isAllDate: boolean) => {
  return format(isAllDate);
};
// 格式化时间 true为年月日时分秒 false为年月日 timeData不传值默认为当前时间
export const format = (isAllDate: boolean, timeData?) => {
  let data;
  if (timeData) {
    data = timeData;
  } else {
    data = new Date();
  }
  const year = data.getFullYear();
  const mouth =
    data.getMonth() + 1 < 10
      ? "0" + (data.getMonth() + 1)
      : data.getMonth() + 1;
  const date = data.getDate() < 10 ? "0" + data.getDate() : data.getDate();
  const hours = data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
  const minutes =
    data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
  const seconds =
    data.getSeconds() < 10 ? "0" + data.getSeconds() : data.getSeconds();
  const dates = year + "-" + mouth + "-" + date;
  const time = hours + ":" + minutes + ":" + seconds;
  return isAllDate ? dates + " " + time : dates;
};
// 获取当年年份的第一天 true为年月日时分秒 false为年月日
export const yearFirstDay = (isAllDate: boolean) => {
  const data = new Date();
  const year = data.getFullYear();
  return isAllDate ? year + "-01-01 00:00:00" : year + "-01-01";
};
