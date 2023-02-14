import { defineComponent } from "vue";
// 结合业务二次封装的 <ElTag /> 组件
export default defineComponent({
  props: {
    //
    type: {
      type: [Number, String],
      required: false
    },
    // 存储到本地的数据key
    dictKey: {
      type: String,
      required: false
    },
    // 可选 label | value
    filterKey: {
      type: String,
      default: "value"
    }
  },
  setup(props) {
    const dictList = JSON.parse(sessionStorage.getItem(props.dictKey) || "[]");
    const obj = dictList.find(v => v[props.filterKey] == props.type) || {
      label: "",
      tagType: ""
    };
    if (!obj.label) return () => null;
    return () => <el-tag type={obj.tagType}>{obj.label}</el-tag>;
  }
});
