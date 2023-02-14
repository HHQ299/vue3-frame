import { RouteConfigs } from "../../types";
import { computed, ComputedRef, nextTick } from "vue";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { handleAliveRoute } from "/@/router/utils";
import { useRoute, useRouter } from "vue-router";
import { isEqual } from "lodash-unified";
import { ElMessage } from "element-plus";

export function useMultiTags() {
  const multiTags: ComputedRef<Array<RouteConfigs>> = computed(() => {
    return useMultiTagsStoreHook()?.multiTags;
  });
  const router = useRouter();
  const route = useRoute();

  function deleteDynamicTag(obj: any, current: any, cb?: () => void) {
    // 存放被删除的缓存路由
    // const delAliveRouteList = [];
    const valueIndex: number = multiTags.value.findIndex((item: any) => {
      if (item.query) {
        if (item.path === obj.path) {
          // return item.query === obj.query;
          return isEqual(item.query, obj.query);
        }
      } else {
        return item.path === obj.path;
      }
    });

    const spliceRoute = (startIndex?: number, length?: number): void => {
      // delAliveRouteList =
      useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex,
        length
      });
    };

    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
    const newRoute = useMultiTagsStoreHook().handleTags("slice");
    if (current === route.path) {
      // 删除缓存路由
      handleAliveRoute(route.matched, "delete");
      // 如果删除当前激活tag就自动切换到最后一个tag
      nextTick(() => {
        router
          .push({
            path: newRoute[0].path,
            query: newRoute[0].query
          })
          .then(() => {
            cb && cb();
          })
          .catch(() => {
            ElMessage.warning("路由切换失败，请重试");
          });
      });
    }
  }
  return { deleteDynamicTag };
}
