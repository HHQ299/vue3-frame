import { App } from "vue";
import KImageUpload from "./KImageUpload.vue";

function setupKImageUpload(app: App) {
  app.component(KImageUpload.name, KImageUpload);
}
export { KImageUpload, setupKImageUpload };
export default KImageUpload;
