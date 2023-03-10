import { computed } from "vue";
import { router } from "/@/router";
import { emitter } from "/@/utils/mitt";
import { routeMetaType } from "../types";
import { remainingPaths } from "/@/router";
import { useAppStoreHook } from "/@/store/modules/app";
import { getConfig } from "/@/config";
import { useUserStoreHook } from "/@/store/modules/user";
// import { isNavigationFailure, NavigationFailureType } from "vue-router";

const errorInfo = "当前路由配置不正确，请检查配置";

export function useNav() {
  const pureApp = useAppStoreHook();
  // 用户名
  // const username: string = storageSession.getItem("info")?.username;
  const username = computed(() => {
    return useUserStoreHook().name;
  });

  // 设置国际化选中后的样式

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  // 动态title
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${meta.title} | ${Title}`;
    else document.title = meta.title;
  }

  // 退出登录
  function logout() {
    // removeToken();
    // storageSession.removeItem("info");
    // router.push("/login");
    useUserStoreHook().logOut();
  }

  function backHome() {
    router.push("/");
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(
    indexPath: string,
    routers,
    indexPath2?,
    item?,
    routeResult?
  ): void {
    routeResult &&
      routeResult
        .then(failure => {
          if (failure) {
            console.log(indexPath, routers, indexPath2, item, routeResult);
            console.error("menuSelect.routeResult:", failure);
          }
        })
        .catch(error => {
          console.error("menuSelect.catch", error);
        });
    if (isRemaining(indexPath)) return;
    let parentPath = "";
    const parentPathIndex = indexPath.lastIndexOf("/");
    if (parentPathIndex > 0) {
      parentPath = indexPath.slice(0, parentPathIndex);
    }
    // 找到当前路由的信息
    function findCurrentRoute(indexPath: string, routes) {
      if (!routes) return console.error(errorInfo);
      return routes.map(item => {
        if (item.path === indexPath) {
          if (item.redirect) {
            findCurrentRoute(item.redirect, item.children);
          } else {
            // 切换左侧菜单 通知标签页
            emitter.emit("changLayoutRoute", {
              indexPath,
              parentPath
            });
          }
        } else {
          if (item.children) findCurrentRoute(indexPath, item.children);
        }
      });
    }
    findCurrentRoute(indexPath, routers);
  }

  // 判断路径是否参与菜单
  function isRemaining(path: string): boolean {
    return remainingPaths.includes(path);
  }

  return {
    logout,
    backHome,
    onPanel,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    username
  };
}
