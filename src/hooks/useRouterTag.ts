import { isNavigationFailure, useRoute, useRouter } from "vue-router";
import { useMultiTagsStoreHook } from "../store/modules/multiTags";

export function useRouterTag() {
  const router = useRouter();
  const route = useRoute();
  const useMultiTagsStore = useMultiTagsStoreHook();

  function useRouterToPush(
    path,
    { query, name, title, showLink = false, dynamicLevel = 1 }
  ) {
    if (!router.hasRoute(name)) return;
    useMultiTagsStore.handleTags("push", {
      path: path,
      parentPath: route.matched[0].path,
      name: name,
      query: { ...query },
      meta: {
        title: title,
        showLink: showLink,
        dynamicLevel: dynamicLevel
      }
    });
    // TODO 用path拼接
    router
      .push({ name, query: { ...query } })
      .then(failure => {
        if (isNavigationFailure(failure)) {
          console.warn("useRouterToPush.then", failure);
        }
      })
      .catch(error => {
        console.error("useRouterToPush.catch", error);
      });
  }
  return { useRouterToPush };
}

export default useRouterTag;
