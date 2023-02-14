import { defineStore } from "pinia";
import { store } from "/@/store";
import { cacheType } from "./types";
import { constantMenus } from "/@/router";
import { cloneDeep } from "lodash-unified";
import { RouteConfigs } from "/@/layout/types";
import { ascending, filterTree } from "/@/router/utils";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 深拷贝一个菜单树，与导航菜单不突出
    menusTree: [],
    buttonsAuth: [],
    isFetchAsyncRoutes: false,
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    // 获取异步路由菜单
    asyncActionRoutes(routes, excludeRouteNames?: string[]) {
      if (this.wholeMenus.length > 0) return;
      let list = [];
      if (excludeRouteNames && excludeRouteNames.length) {
        list = this.constantMenus.filter(v => {
          if (!excludeRouteNames.includes(v.name)) {
            return true;
          } else {
            return false;
          }
        });
      } else {
        list = this.constantMenus;
      }
      this.wholeMenus = filterTree(ascending(list.concat(routes)));

      this.menusTree = cloneDeep(filterTree(ascending(list.concat(routes))));

      const getButtonAuth = (arrRoutes: Array<RouteConfigs>) => {
        if (!arrRoutes || !arrRoutes.length) return;
        arrRoutes.forEach((v: RouteConfigs) => {
          // if (v.meta && v.meta.authority) {
          if (v.meta && v.meta.btnPermissions) {
            // this.buttonsAuth.push(...v.meta.authority);
            this.buttonsAuth.push(...v.meta.btnPermissions);
          }
          if (v.children) {
            getButtonAuth(v.children);
          }
        });
      };

      getButtonAuth(this.wholeMenus);
    },
    async changeSetting(routes, excludeRouteNames) {
      await this.asyncActionRoutes(routes, excludeRouteNames);
    },
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case "add":
          this.cachePageList.push(name);
          this.cachePageList = [...new Set(this.cachePageList)];
          break;
        case "delete":
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex(v => v === name);
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
    },
    //
    setIsFetchAsyncRoutes(b: boolean) {
      this.isFetchAsyncRoutes = b;
    },
    // 清空缓存页面
    clearAllCachePage() {
      // this.wholeMenus = [];
      // this.menusTree = [];
      // this.buttonsAuth = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
