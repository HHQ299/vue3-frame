import { Directive } from "vue";
import type { DirectiveBinding } from "vue";

// <template>
//   <button v-copy:[copySuccess]="'点击复制'"> 点击复制 < /button>
// </template>

// <script setup lang="ts" >
// const copySuccess = (value: string) => {
//   console.log("copy的值为：", value);
// }
// </script>

interface IHTMLElement extends HTMLElement {
  $value: string;
  handler: () => void;
}

export const copy: Directive = {
  beforeMount(el: IHTMLElement, binding?: DirectiveBinding) {
    el.$value = binding.value;
    const copySuccess: any = binding.arg;
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示。
        console.log("没有需要复制的内容");
        return;
      }
      const textarea = document.createElement("textarea");
      textarea.readOnly = true;
      // 设置标签的相关属性
      // textarea.style.position = "fixed";
      textarea.style.position = "absolute";
      textarea.style.top = "-999999px";
      // 将目标内容复制个textarea标签
      textarea.value = el.$value;
      document.body.appendChild(textarea);
      // 调用onselect方法
      textarea.select();
      // 把目标内容复制进剪贴板, 该API会返回一个Boolean
      const res = document.execCommand("Copy");
      res && copySuccess
        ? copySuccess(el.$value)
        : console.log("复制成功，剪贴板内容：" + el.$value);
      document.body.removeChild(textarea);
    };
    el.addEventListener("click", el.handler);
  },
  updated(el, binding) {
    // 实时更新最新的目标内容
    el.$value = binding.value;
  },
  unmounted(el) {
    el.removeEventListener("click", el.handler);
  }
};
