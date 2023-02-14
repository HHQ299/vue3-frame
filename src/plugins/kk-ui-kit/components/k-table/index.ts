import { App } from "vue";
import RenderCell from "./RenderCell";
import KTable from "./KTable.vue";
import { Alert, AlertCard } from "./alert";

function setupKTable(app: App) {
  app.component(KTable.name, KTable);
  // TODO 组件挂载组件
  // KTable.Alert = Alert;
  // KTable.AlertCard = AlertCard;
  app.component(Alert.name, Alert);
  app.component(AlertCard.name, AlertCard);
}

export { KTable, RenderCell, setupKTable };
export default KTable;
