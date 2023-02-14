import { ElPopover } from "element-plus";
import { computed, defineComponent, ref } from "vue";
import IndexClass from "./index.module.scss";

export default defineComponent({
  name: "CollapseItems",
  props: {
    listString: {
      type: [String, null],
      default: ""
      // required: true
    },
    showCount: {
      type: Number,
      default: 2
    },
    delimiter: {
      type: String,
      default: ","
    },
    title: {
      type: String,
      default: ""
    }
  },
  emits: ["onView"],
  setup(props) {
    if (!props.listString) {
      return () => null;
    }
    // const allCount = ref(0);
    const allList = ref([]);
    allList.value = (props.listString || "").split(props.delimiter);
    const rightCount = computed(() => {
      return allList.value.length - props.showCount;
    });

    // const onView = () => {
    //   ElMessageBox({
    //     title: "适用合作机构",
    //     message: allList.value.join("<br />"),
    //     dangerouslyUseHTMLString: true
    //   }).catch(() => {});
    //   emit("onView", allList);
    // };
    // onClick={() => onView()}
    return () => (
      <div class={IndexClass.CollapseItems}>
        {allList.value.slice(0, 2).join(props.delimiter)}
        {rightCount.value > 0 ? (
          <ElPopover
            effect="dark"
            title={props.title}
            trigger="hover"
            width="360px"
            placement="auto"
            content={props.listString}
            v-slots={{
              reference: () => {
                return (
                  <a class={IndexClass.rightCount}>查看 +{rightCount.value}</a>
                );
              }
            }}
          ></ElPopover>
        ) : null}
      </div>
    );
  }
});
