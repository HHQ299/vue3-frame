import QRCode from "qrcode";
import Logo from "/@/assets/common/logo.png";

export default () => {
  const generateQR = async text => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };
  // https://juejin.cn/post/6844903640272994312
  const generateQrLogo = async (
    text,
    options = { qrcodeWidth: 148, margin: 0 }
  ): Promise<string> => {
    try {
      const canvas = await QRCode.toCanvas(text, {
        width: options.qrcodeWidth,
        margin: options.margin
      });
      return new Promise((resolve, reject) => {
        const ctx = canvas.getContext("2d");
        const img = document.createElement("img");
        img.src = Logo;
        // img.style.width = "40px";
        img.onerror = reject;
        img.onload = function () {
          const logoW = img.width;
          const logoH = img.height;
          ctx.drawImage(
            img,
            options.qrcodeWidth / 2 - logoW / 4,
            options.qrcodeWidth / 2 - logoH / 4,
            logoW / 2,
            logoH / 2
          );
          return resolve(canvas.toDataURL("image/png"));
        };
      });
    } catch (err) {
      console.error(err);
    }
  };
  return {
    generateQR,
    generateQrLogo
  };
};
