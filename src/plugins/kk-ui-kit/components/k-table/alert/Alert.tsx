import { defineComponent, PropType } from "vue";
import type { IOptions } from "../../../types";
import alertStyle from "./alert.module.scss";
export default defineComponent({
  name: "KTableAlert",
  props: {
    list: {
      type: Array as PropType<IOptions[]>,
      default: () => []
    }
  },
  setup(props) {
    return () => {
      return (
        <div class={alertStyle["alert-list"]}>
          {props.list.map((v, i) => {
            return (
              <span key={i} class={alertStyle.alertItem}>
                {v.label}：
                <a href="javascrpt:;">
                  {v.unit}
                  {v.value}
                </a>
              </span>
            );
          })}
        </div>
      );
    };
  }
});
