import { App } from "vue";
import KImageCrop from "./KImageCrop.vue";

function setupKImageUpload(app: App) {
  app.component(KImageCrop.name, KImageCrop);
}
export { KImageCrop, setupKImageUpload };
export default KImageCrop;
