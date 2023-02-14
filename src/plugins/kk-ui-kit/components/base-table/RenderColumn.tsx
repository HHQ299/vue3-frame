import { defineComponent } from "vue";

export default defineComponent({
  name: "RenderColumn",
  props: {
    row: Object,
    index: Number,
    column: {
      type: Object,
      default: null
    },
    // render: Object as PropType<RootRenderFunction>
    render: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    // const slots = {
    //   default: () => <span>B</span>
    // };
    return () => (
      // <span class="cell" v-slots={slots} />
      // <span class="cell">
      //   {{
      //     default: () => <div class="a">A</div>
      //   }}
      // </span>
      <div class="cell">
        {props.render({
          row: props.row,
          column: props.column,
          index: props.index
        })}
      </div>
    );
  }
  // proxy: getCurrentInstance(),
  // render() {
  //   return this.render(h, this.row, this.column, this.index);
  // }
});
