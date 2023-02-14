import { App, Plugin } from "vue";
import KTable, { setupKTable } from "./components/k-table";

//
import { debounce } from "./directives/debounce/index";
import useOSS from "./alioss/composables/useOSS";
import BaseTable, { setupBaseTable } from "./components/base-table";
import KDialog, { setupKDialog } from "./components/k-dialog";
import KForm, { setupKForm } from "./components/k-form";
import KImageUpload, { setupKImageUpload } from "./components/k-image-upload";

const kkUiKit = <Plugin>{
  install(app: App, options = {}) {
    const { appId, appKey, custom = false } = options;
    app.config.globalProperties.$oss = {
      appId,
      appKey
    };

    app.directive("debounce", debounce);
    if (!custom) {
      // 表格组件
      setupKTable(app);
      setupBaseTable(app);
      setupKDialog(app);
      setupKForm(app);
      setupKImageUpload(app);
    }
  }
};

export {
  KTable,
  BaseTable,
  KDialog,
  KForm,
  KImageUpload,
  debounce,
  kkUiKit,
  useOSS
};
export default kkUiKit;
