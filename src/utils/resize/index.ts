import ResizeObserver from "resize-observer-polyfill";

// 判断是否在浏览器环境中，还是在node中
const isServer = typeof window === "undefined";

const resizeHandler = function (entries) {
  for (const entry of entries) {
    // entry.target通过这个访问监听的DOM对象，然后，这个对象上有__resizeListeners__属性。遍历存储的监听回调
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
};

// 接受DOM元素和方法
export const addResizeListener = function (element, fn) {
  if (isServer) return;
  if (!element.__resizeListeners__) {
    // 在DOM元素对象上，设置__resizeListeners__属性，存储监听器（回调函数）。
    element.__resizeListeners__ = [];
    // ResizeObserver：MDN上解释可以监听DOM元素的变化（什么变化呢？位置变化和大小变化）
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element); // 这里观察主体是DOM对象。（本质就是观察一个对象）
  }
  element.__resizeListeners__.push(fn);
};

export const removeResizeListener = function (element, fn) {
  if (!element || !element.__resizeListeners__) return; // 先判断下
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  if (!element.__resizeListeners__.length) {
    // 取消element.__ro__观察者身上所有的元素的观察
    element.__ro__.disconnect();
  }
};
