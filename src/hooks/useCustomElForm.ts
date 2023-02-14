import { inject } from "vue";
// https://juejin.cn/post/7041489184938262564
//  触发el-form-item的校验事件 trigger
export function useTrigger() {
  const elFormItem: any = inject("elFormItem");
  const emitTrigger = (value: any) => {
    if (elFormItem?.formItemMitt?.emit) {
      elFormItem.formItemMitt.emit("el.form.blur", value);
      elFormItem.formItemMitt.emit("el.form.change", value);
    }
  };
  return { elFormItem, emitTrigger };
}
