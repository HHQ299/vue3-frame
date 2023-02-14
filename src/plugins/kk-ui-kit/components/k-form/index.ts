import { App } from "vue";
import KForm from "./KForm.vue";

function setupKForm(app: App) {
  app.component(KForm.name, KForm);
}
export { KForm, setupKForm };

export * from "./types";

export default KForm;
