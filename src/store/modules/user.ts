import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { getLogin, refreshToken } from "/@/api/user";
import { storageSession } from "/@/utils/storage";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { loadEnv } from "@build/index";

const data = getToken();
let token = "";
let name = "";
if (data) {
  token = data;
  name = "";
  // const dataJson = JSON.parse(data);
  // if (dataJson) {
  // token = dataJson?.accessToken;
  // name = dataJson?.name ?? "admin";
  // }
}

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token,
    mobileCount: 0,
    name,
    id: ""
  }),
  getters: {
    getToken(state) {
      return state.token;
    }
  },
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_ID(id) {
      this.id = id;
    },
    SET_MOBILE_COUNT(data) {
      this.mobileCount = data;
    },
    // TODO 登陆操作
    async loginByUsername(data) {
      return new Promise<any>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data.data) {
              setToken({ ...data.data, name: "admin" });
              resolve({ ...data.data, name: "admin" });
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出 清空缓存
    logOut() {
      this.token = "";
      this.name = "";
      removeToken();
      // storageSession.removeItem("info");
      storageSession.clear();
      console.log("77777");
      useMultiTagsStoreHook().handleTags("equal", [
        {
          path: "/welcome",
          parentPath: "/",
          meta: {
            title: "首页",
            icon: "home-filled"
          }
        }
      ]);
      if (loadEnv().PROD) {
        location.href = "/";
      } else {
        router.replace("/login");
      }
    },
    // 刷新token
    async refreshToken(data) {
      return refreshToken(data).then(data => {
        if (data) {
          setToken(data);
          return data;
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
