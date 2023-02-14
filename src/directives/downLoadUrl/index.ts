import { Directive } from "vue";
import type { DirectiveBinding } from "vue";

export const downLoadUrl: Directive = {
  mounted(el: HTMLElement, binding?: DirectiveBinding) {
    if (binding.value.url) {
      el.addEventListener("click", () => {
        const a = document.createElement("a");
        // TODO 若是不完整的url则需要拼接baseURL
        //   let url = baseUrl + binding.value
        const url = binding.value.url; // 完整的url则直接使用
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            a.href = URL.createObjectURL(blob);
            // a.download = binding.value.name || "";
            const arr = url.split("/");

            a.download = binding.value.name || arr[arr.length - 1] || ""; // 下载文件的名字
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
          });
      });
    }
  },
  unmounted() {}
};
