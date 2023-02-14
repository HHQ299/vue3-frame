import { ElDivider } from "element-plus";
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "RenderCell",
  props: {
    row: Object,
    index: Number,
    column: {
      type: Object,
      default: null
    },
    render: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const Spacer = h(ElDivider, { direction: "vertical" });
    return () => (
      <el-space class="" size={1} spacer={Spacer}>
        {props.render({
          row: props.row,
          column: props.column,
          $index: props.index
        })}
      </el-space>
    );
  }
  // render() {
  //   return this.render(h, this.row, this.column, this.index);
  // }
});
