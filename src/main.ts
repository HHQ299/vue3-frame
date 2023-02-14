import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import { getServerConfig } from "./config";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import ElementPlus, { ClickOutside } from "element-plus";
import kkUiKit from "./plugins/kk-ui-kit";
import permissionPlugin from "./plugins/permission/action";
import { injectResponsiveStorage } from "/@/utils/storage/responsive";

import "animate.css";
import "virtual:windi.css";
// 导入公共样式
import "./style/index.scss";
// 导入字体图标
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "./assets/font/iconfont.js";
import "./assets/font/iconfont.css";
// 引入裁剪
import VueCropper from "vue-cropper";
import "vue-cropper/dist/index.css";

const app = createApp(App);
app.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info);
};

// 自定义指令
import * as directives from "/@/directives";
app.directive("ClickOutside", ClickOutside);
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册`@iconify/vue`图标库
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);
//
import GeneralTag from "/@/dict/GeneralTag";
app.component("GeneralTag", GeneralTag);

getServerConfig(app).then(async config => {
  app.use(VueCropper);
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app.use(permissionPlugin);
  app.use(ElementPlus);
  app.use(MotionPlugin).use(kkUiKit, {
    appId: import.meta.env.VITE_DATA_ENCRYPTION_APPID,
    appKey: import.meta.env.VITE_DATA_ENCRYPTION_APPKEY
  });
  app.mount("#app");
});
