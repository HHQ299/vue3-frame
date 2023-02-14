import { defineComponent } from "vue";
import { cooperationStatusFilter } from "./cooperationStatus";
export default defineComponent({
  name: "CooperationStatusTag",
  props: {
    type: {
      type: [Number, String],
      required: false
    }
  },
  setup(props) {
    const obj = cooperationStatusFilter(props.type);
    if (!obj.label) return () => null;
    return () => <el-tag type={obj.tagType}>{obj.label}</el-tag>;
  }
});
