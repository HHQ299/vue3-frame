const downloadStreamFile = async <T>(
  exportFilePromise,
  body: T,
  filename?: string
) => {
  const response = await exportFilePromise(body);
  // TODO 封装
  // new Blob([data])用来创建URL的file对象或者blob对象
  // new Blob 类型: BlobPart
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  // let timestamp = new Date().getTime();
  if (filename) {
    link.download = filename;
  } else {
    link.download = decodeURIComponent(
      // TODO 获取文件流文件名字的方法
      // TODO 注意响应头 content-disposition 的返回格式
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
  }
  document.body.appendChild(link);
  link.click();
};
export const useStream = () => {
  return { downloadStreamFile };
};
