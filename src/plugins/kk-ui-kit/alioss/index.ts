import { App, computed } from "vue";
import useOSS from "./composables/useOSS";
import AliossImagePreview from "./components/AliossImagePreview.vue";
import AliossFileLoad from "./components/AliossFileLoad.vue";

export { useOSS, AliossImagePreview, AliossFileLoad };

export function setupOSS(app: App) {
  // app.component(AliossImagePreview.name, AliossImagePreview);
  // app.component(AliossFileLoad.name, AliossFileLoad);
  const { ossInstance, getOSSInstance } = useOSS();
  getOSSInstance();
  app.provide(
    "ossInstance",
    computed(() => ossInstance.value)
  );
}

export default useOSS;
