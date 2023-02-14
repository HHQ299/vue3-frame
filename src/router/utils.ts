import {
  RouterHistory,
  RouteRecordRaw,
  RouteComponent,
  createWebHistory,
  createWebHashHistory,
  RouteRecordNormalized
} from "vue-router";
import { router } from "./index";
import { loadEnv } from "../../build";
import { useTimeoutFn } from "@vueuse/core";
import { RouteConfigs } from "/@/layout/types";
import { buildHierarchyTree } from "/@/utils/tree";
import { usePermissionStoreHook } from "/@/store/modules/permission";
// 本地路由
import { roleList } from "/@/mock/routerMock";
// 动态路由
import { getUserInfo } from "/@/api/user";
import { storageSession } from "../utils/storage";
import { useUserStoreHook } from "../store/modules/user";
import { IRouteRecord } from "./types";

const Layout = () => import("/@/layout/index.vue");
const IFrame = () => import("/@/layout/frameView.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
// TODO 排除 /components/
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");
// const modulesRoutes2 = import.meta.globEager("/src/views/**/*.{vue,tsx}");

// 动态路由数据tag 切换路由需修改
const configTag = "student-service";
// 按照路由中meta下的rank等级升序来排序路由
function ascending(arr: any[]) {
  arr.forEach(v => {
    if (v?.meta?.rank === null) v.meta.rank = undefined;
    if (v?.meta?.rank === 0) {
      if (v.name !== "home" && v.path !== "/") {
        console.warn("rank only the home page can be 0");
      }
    }
  });
  return arr.sort(
    (a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
      return a?.meta?.rank - b?.meta?.rank;
    }
  );
}

// 过滤meta中showLink为false的路由
function filterTree(data: RouteComponent[]) {
  const newTree = data.filter(
    (v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false
  );
  newTree.forEach(
    (v: { children }) => v.children && (v.children = filterTree(v.children))
  );
  return newTree;
}

// 批量删除缓存路由(keepalive)
function delAliveRoutes(delAliveRouteList: Array<RouteConfigs>) {
  delAliveRouteList.forEach(route => {
    usePermissionStoreHook().cacheOperate({
      mode: "delete",
      name: route?.name
    });
  });
}

// 通过path获取父级路径
function getParentPaths(path: string, routes: RouteRecordRaw[]) {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], path: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 找到path则返回父级path
      if (item.path === path) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, path, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, path, []);
}

// 查找对应path的路由信息
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (
        routes[i].children instanceof Array &&
        routes[i].children.length > 0
      ) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }
}

// 重置路由
function resetRouter(): void {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// 初始化路由
function initRouter(token: string) {
  return new Promise((resolve, reject) => {
    getUserInfo({ token })
      .then(({ data }) => {
        storageSession.setItem("info", {
          username: data.trueName,
          userId: data.adminUserId,
          accessToken: token,
          mobileCount: data.mobileCount
        });
        useUserStoreHook().SET_NAME(data.trueName);
        useUserStoreHook().SET_ID(data.adminUserId);
        useUserStoreHook().SET_MOBILE_COUNT(data.mobileCount || 0);

        // 切换本地路由
        const roleData = roleList;
        // 动态路由
        // const roleData = data.roleList;
        const agentMenu =
          roleData.find(v => v.tag === configTag && v.isSubSystem === 1) || {};
        const info = agentMenu.children || [];
        if (info.length) {
          formatFlatteningRoutes(addAsyncRoutes(info)).map(
            (v: RouteRecordRaw) => {
              // 防止重复添加路由
              if (
                router.options.routes[0].children.findIndex(
                  value => value.path === v.path
                ) !== -1
              ) {
                return;
              } else {
                // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
                router.options.routes[0].children.push(v);
                // 最终路由进行升序
                ascending(router.options.routes[0].children);
                if (!router.hasRoute(v?.name)) router.addRoute(v);
                const flattenRouters = router
                  .getRoutes()
                  .find(n => n.path === "/");
                router.addRoute(flattenRouters);
              }
            }
          );
          usePermissionStoreHook().changeSetting(info, []);
        } else {
          usePermissionStoreHook().changeSetting(info, []);
        }

        router.addRoute({
          path: "/:pathMatch(.*)*",
          name: "pathMatch",
          redirect: "/error/403"
        });
        if (!info.length) {
          if (loadEnv().PROD) {
            location.href = "/";
          } else {
            router.replace("/error/403");
          }
        } else {
          resolve(router);
        }
      })
      .catch(() => {
        // console.log(e)
        // if (loadEnv().PROD) {
        //   location.href = "/";
        // } else {
        //   router.replace("/error/403");
        // }
        reject();
      });
  });
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList
        .slice(0, i + 1)
        .concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/xiaoxian521/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      });
    } else {
      newRoutesList[0].children.push({ ...v });
    }
  });
  return newRoutesList;
}

// 处理缓存路由（添加、删除、刷新）
function handleAliveRoute(matched: RouteRecordNormalized[], mode?: string) {
  switch (mode) {
    case "add":
      matched.forEach(v => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      useTimeoutFn(() => {
        matched.forEach(v => {
          usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
        });
      }, 100);
  }
}

// 过滤后端传来的动态路由 重新生成规范路由
function addAsyncRoutes(arrRoutes: Array<IRouteRecord>) {
  if (!arrRoutes || !arrRoutes.length) return [];
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: IRouteRecord) => {
    if (v.redirect) {
      v.component = Layout;
    } else if (v.meta?.frameSrc) {
      v.component = IFrame;
    } else {
      v.meta = {
        showParent: true,
        title: v.name,
        // rank: i + 1,
        keepAlive: !!v.isCache,
        showLink: !v.menuHidden,
        hasChildren: v.children && v.children.length,
        activeMenu: v.activationMenuPath || ""
        // icon: "IF-icon-" + v.icon + " svg"
      };
      v._id = v.id;
      v.name = v.tag;
      v.path = v.webPath;
      // 菜单类型重定向
      if (v.type === 1) {
        v.meta.icon = "IF-icon-" + v.icon + " svg";
        v.redirect = v.redirectPath;
      }
      // // TODO 合作商管理页面要求菜单合并 这里特殊处理
      // if (v.name === "agentManage_list") {
      //   v.meta.showParent = false;
      // }

      if (v?.componentName === "Layout") {
        v.component = Layout;
      } else {
        const index = v?.componentName
          ? modulesRoutesKeys.findIndex(ev => ev.includes(v.componentName))
          : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
        v.component = modulesRoutes[modulesRoutesKeys[index]];
      }
      delete v.activationMenuPath;
      delete v.dataPrivilege;
      delete v.backPath;
      delete v.webPath;
      delete v.menuHidden;
      delete v.redirectPath;
      delete v.tag;
      delete v.componentName;
      delete v.isCache;
      delete v.icon;
    }

    if (v.meta.hasChildren && [2].includes(v.type)) {
      const btns = v.children
        .filter(btn => btn.type === 4 && btn.buttonType === 1)
        .map(p => p.buttonTag);
      const tabBtns = v.children
        .filter(btn => btn.type === 3)
        .reduce((prev, cur) => {
          const arr = cur.children
            ? cur.children
                .filter(btn => btn.type === 4 && btn.buttonType === 1)
                .map(p => p.buttonTag)
            : [];
          prev.push(...arr);
          return prev;
        }, []);

      const hasTab = v.children.filter(v => v.type === 3);
      if (hasTab && hasTab.length) {
        const tabs = hasTab.map(tab => {
          const { children = [] } = tab;
          const btns = children.map(btn => {
            let buttonTag = btn.buttonTag;
            if (btn.buttonType === 1) {
              buttonTag = btn.buttonTag;
            } else if (btn.buttonType === 2) {
              buttonTag = btn.tag;
            }
            return {
              id: btn.id,
              name: btn.name,
              type: btn.type,
              parentId: btn.parentId,
              buttonType: btn.buttonType,
              buttonTag,
              // componentName: btn.componentName,
              webPath: btn.webPath,
              backPath: btn.backPath
            };
          });
          return {
            id: tab.id,
            parentId: tab.parentId,
            type: tab.type,
            backPath: tab.backPath,
            btns: btns,
            // componentName: tab.componentName,
            tabKey: tab.tag,
            tabName: tab.webPath,
            // buttonTag: tab.buttonTag,
            tabLabel: tab.name
          };
        });
        v.meta.permissionTab = {
          tabs: Object.freeze(tabs),
          index: 0
        };
      }

      v.meta.btnPermissions = Object.freeze([...btns, ...tabBtns]);
    }
    if (v.meta.hasChildren && [1].includes(v.type)) {
      const pageBtnList = getPageBtnList(v.children);
      v.children = v.children.concat(pageBtnList);
      addAsyncRoutes(v.children);
    } else {
      delete v.children;
    }
  });
  return arrRoutes;
}

const getPageBtnList = (data = []) => {
  const result = [];
  const fn = tree => {
    for (let index = 0; index < tree.length; index++) {
      const node = tree[index];
      if (node.type === 4 && node.buttonType === 2) {
        result.push(node);
      }
      if (node && node.children) {
        fn(node.children);
      }
    }
  };
  fn(data);
  return result;
};

// 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html
function getHistoryMode(): RouterHistory {
  const routerHistory = loadEnv().VITE_ROUTER_HISTORY;
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

// 是否有权限
function hasPermissions(value: Array<string>): boolean {
  if (value && value instanceof Array && value.length > 0) {
    const roles = usePermissionStoreHook().buttonsAuth;
    const permissionRoles = value;

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

export {
  ascending,
  filterTree,
  initRouter,
  resetRouter,
  hasPermissions,
  getHistoryMode,
  addAsyncRoutes,
  delAliveRoutes,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
};
