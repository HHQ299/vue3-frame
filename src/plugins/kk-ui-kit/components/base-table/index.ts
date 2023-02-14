import { App } from "vue";
import BaseTable from "./BaseTable.vue";

function setupBaseTable(app: App) {
  app.component(BaseTable.name, BaseTable);
}
export { BaseTable, setupBaseTable };
export default BaseTable;
