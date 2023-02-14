import { defineComponent, PropType } from "vue";
import type { IOptions } from "../../../types";
import alertStyle from "./alert.module.scss";
export default defineComponent({
  name: "KTableAlertCard",
  props: {
    list: {
      type: Array as PropType<IOptions[]>,
      default: () => []
    }
  },
  setup(props) {
    return () => {
      return (
        <div class={alertStyle.alertCards}>
          {props.list.map((v, i) => {
            return (
              <div class={alertStyle.alertCard} key={i}>
                <div class={alertStyle.alertCard_value}>{v.value}</div>
                <div class={alertStyle.alertCard_label}>{v.label}</div>
              </div>
            );
          })}
        </div>
      );
    };
  }
});
