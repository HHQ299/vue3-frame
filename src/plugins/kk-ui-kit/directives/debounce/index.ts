import type { Directive, DirectiveBinding } from "vue";

interface IHTMLElement extends HTMLElement {
  $type: string;
  $wait: number;
  $params: any[];
  $immediate: boolean;
  $handler: () => void;
  $proxy: () => any;
}
/**
 * vue3 防抖指令
 * @example
 * <button
  class="submit"
  v-debounce="{
    func: submitHandle,
    wait: 600,
    immediate: true,
    params: [10, 20],
    type: 'click',
  }"
/> 
 * */
export const debounce: Directive = {
  mounted(el: IHTMLElement, binding?: DirectiveBinding) {
    // console.log("mounted", binding);
    const {
      func,
      wait = 600,
      immediate = true,
      params = [],
      type = "click"
    } = binding.value;
    el.$params = params;
    el.$wait = wait;
    el.$immediate = immediate;
    el.$type = type;
    el.$proxy = function (...args) {
      return func.call(this, ...params.concat(args));
    };

    el.$handler = debounceFn(el.$proxy, el.$wait, el.$immediate);
    el.addEventListener(el.$type, el.$handler);
  },
  // beforeUpdate(el: IHTMLElement, binding?: DirectiveBinding) {
  //   console.log("beforeUpdate", binding);
  // },
  updated(el: IHTMLElement, binding?: DirectiveBinding) {
    // console.log("updated", binding);
    if (!binding.oldValue) return;
    if (binding.oldValue.params[0] === binding.value.params[0]) return;
    el.removeEventListener(el.$type, el.$handler);
    const { func, params = [], type = "click" } = binding.value;
    el.$params = params;
    el.$type = type;
    el.$proxy = function (...args) {
      return func.call(this, ...params.concat(args));
    };

    el.$handler = debounceFn(el.$proxy, el.$wait, el.$immediate);
    el.addEventListener(el.$type, el.$handler);
  },
  unmounted(el) {
    el.removeEventListener(el.$type, el.$handler);
  }
};
const debounceFn = function (func, wait, immediate) {
  if (typeof func !== "function")
    throw new TypeError("func must be a function!");
  if (typeof wait === "undefined") {
    wait = 600;
    immediate = false;
  }
  if (typeof wait === "boolean") {
    immediate = wait;
    wait = 600;
  }
  if (typeof immediate === "undefined") {
    immediate = false;
  }
  if (typeof wait !== "number") throw new TypeError("wait must be a number!");
  if (typeof immediate !== "boolean")
    throw new TypeError("immediate must be a boolean!");
  let timer = null,
    result;
  return function proxy(...params) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this,
      callNow = !timer && immediate;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      if (!immediate) result = func.apply(self, params);
    }, wait);
    if (callNow) result = func.apply(self, params);
    return result;
  };
};
