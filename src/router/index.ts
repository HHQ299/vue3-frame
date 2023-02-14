import { isUrl } from "/@/utils/is";
import { getConfig } from "/@/config";
import { toRouteType } from "./types";
import { getLinkParams, openLink } from "/@/utils/link";
import NProgress from "/@/utils/progress";
import { findIndex } from "lodash-unified";
import { buildHierarchyTree } from "/@/utils/tree";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import {
  Router,
  RouteMeta,
  createRouter,
  RouteRecordRaw,
  RouteComponent,
  RouteRecordName
} from "vue-router";
import {
  ascending,
  initRouter,
  getHistoryMode,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import { getToken } from "../utils/auth";
import { loadEnv } from "@build/index";

import homeRouter from "./modules/home";
import errorRouter from "./modules/error";
import remainingRouter from "./modules/remaining";
// import agentManage from "./modules/agentManage"; 示例

// 原始静态路由（未做任何处理）
const routes = [
  homeRouter,
  errorRouter
  // agentManage, 示例
];
console.log("routes:", routes);
// 导出处理后的静态路由（三级及以上的路由全部拍成二级）
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

// 用于渲染菜单，保持原始层级
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

// 不参与菜单的路由
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

// 创建路由实例
export const router: Router = createRouter({
  history: getHistoryMode(),
  routes: constantRoutes.concat(...remainingRouter),
  strict: true
});

// 路由白名单
const whiteList = ["/login", "/payH5"];
router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "redirect") {
      handleAliveRoute(newMatched);
    }
  }
  const token = getToken();
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  const externalLink = isUrl(to?.name as string);
  if (!externalLink)
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title) document.title = `${item.meta.title} | ${Title}`;
      else document.title = item.meta.title as string;
    });
  if (token) {
    if (to.path === "/login") {
      next("/");
      return;
    }
    // console.log("_from", _from, "to", to);
    // console.log(router.options.routes);
    // const routePartent = getParentPaths(
    //   to.path,
    //   router.options.routes[0].children
    // );
    // console.log("routePartent", routePartent);

    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeMenus.length === 0) {
        // usePermissionStoreHook().isFetchAsyncRoutes === false
        console.log("_from", _from, "to", to);
        initRouter(token).then((router: Router) => {
          usePermissionStoreHook().setIsFetchAsyncRoutes(true);
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const pathQuery = getLinkParams(location.hash).query;
            const handTag = (
              path: string,
              parentPath: string,
              name: RouteRecordName,
              meta: RouteMeta
            ): void => {
              useMultiTagsStoreHook().handleTags("push", {
                path,
                parentPath,
                name,
                meta,
                query: pathQuery
              });
            };
            // 未开启标签页缓存，刷新页面重定向到顶级路由（参考标签页操作例子，只针对静态路由）
            if (to.meta?.refreshRedirect) {
              const routes = router.options.routes;
              const { refreshRedirect } = to.meta;
              const { name, meta } = findRouteByPath(refreshRedirect, routes);
              handTag(
                refreshRedirect,
                getParentPaths(refreshRedirect, routes)[1],
                name,
                meta
              );
              console.log("to.meta?.refreshRedirect", refreshRedirect);
              // return router.push(refreshRedirect);
              next({ path: refreshRedirect, replace: true });
            } else {
              const { path } = to;
              const index = findIndex(remainingRouter, v => {
                return v.path == path;
              });
              console.log("to.path 是否在 remainingRouter 中", index);
              let routes = [];
              if (index === -1) {
                routes = router.options.routes[0].children;
                console.log(" / 的子routes", routes);
              } else {
                routes = router.options.routes;
                console.log("所有 routes", routes);
              }
              const route = findRouteByPath(path, routes);
              const routePartent = getParentPaths(path, routes);
              console.log(`${path} 当前路由信息 route`, route);
              // TODO 为什么权限路由的详情页F5刷新获取不到 routePartent
              console.log("其父路由路径 routePartent", routePartent);

              // 未开启标签页缓存，刷新页面重定向到顶级路由（参考标签页操作例子，只针对动态路由）
              if (
                path !== routes[0].path &&
                route?.meta?.rank !== 0 &&
                routePartent.length === 0
              ) {
                if (!route?.meta?.refreshRedirect) {
                  if (route && route.name) {
                    handTag(
                      path,
                      routePartent[0] || "/",
                      route.name,
                      route.meta
                    );
                    next({ ...to, replace: true });
                  } else {
                    next("/error/404");
                  }
                  // next({ path: to.fullPath, replace: true });
                  return;
                }
                const { name, meta } = findRouteByPath(
                  route.meta.refreshRedirect,
                  routes
                );
                handTag(
                  route.meta?.refreshRedirect,
                  getParentPaths(route.meta?.refreshRedirect, routes)[0],
                  name,
                  meta
                );
                // return router.push(route.meta?.refreshRedirect);
                next({ path: route.meta?.refreshRedirect, replace: true });
              } else {
                handTag(
                  route.path,
                  routePartent[routePartent.length - 1],
                  route.name,
                  route.meta
                );
                // return router.push({
                //   path: path,
                //   query: pathQuery
                // });
                // next();
                // 保证权限路由挂载完成
                next({ ...to, replace: true });
              }
            }
          } else {
            next({ ...to, replace: true });
            // router.push(to.fullPath);
          }
        });
      } else next();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        // next({ path: "/login" });
        if (loadEnv().PROD) {
          location.href = "/";
        } else {
          next("/login");
        }
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(error => {
  if (error.message === "Invalid route component") {
    router.push("/error/404");
  } else {
    console.dir(error);
  }
});

export default router;
