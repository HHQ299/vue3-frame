import { App } from "vue";
import KDialog from "./KDialog.vue";

function setupKDialog(app: App) {
  app.component(KDialog.name, KDialog);
}
export { KDialog, setupKDialog };
export default KDialog;
