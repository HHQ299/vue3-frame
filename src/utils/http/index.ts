import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  // resultType,
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import qs from "qs";
import NProgress from "../progress";
import { loadEnv } from "@build/index";
import { getToken, removeToken, setToken } from "/@/utils/auth";
// import { useUserStoreHook } from "/@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";

import { is } from "../is";
import { useUserStoreHook } from "/@/store/modules/user";
import { version } from "../../../package.json";
import { getBrowserVersion } from "../browser";
import { buildUUID } from "../uuid";
import { dataEncryption } from "/@/plugins/kk-ui-kit/utils/requestBodySignature";

// 加载环境变量 VITE_PROXY_DOMAIN（开发环境）  VITE_PROXY_DOMAIN_REAL（打包后的线上环境）
const { VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = loadEnv();

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? VITE_PROXY_DOMAIN_REAL
      : VITE_PROXY_DOMAIN,
  // 当前使用mock模拟请求，将baseURL制空，如果你的环境用到了http请求，请删除下面的baseURL启用上面的baseURL，并将11行、16行代码注释取消
  // baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "kk-version": version,
    "kk-from": "web",
    "kk-terminal-type": "pc",
    "kk-os": getBrowserVersion()[1] || navigator.userAgent,
    "kk-modle": getBrowserVersion()[0] || navigator.userAgent,
    // TODO 从第三方api接口获取
    "kk-ip": ""
  },
  // 数组格式参数序列化
  paramsSerializer: params => qs.stringify(params, { indices: false })
  // transformRequest(data: any, headers) {}
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 初始化配置对象
  private static initConfig: PureHttpRequestConfig = {};
  // beforeRequestCallback($config) {
  //   console.log($config);
  //   console.log($config.method);
  // }

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  // 请求拦截
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      (config: PureHttpRequestConfig) => {
        const $config = config;
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback($config);
          return $config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback($config);
          return $config;
        }
        const token = useUserStoreHook().getToken || getToken();
        if ($config.method === "post") {
          $config.data = dataEncryption(token, $config.data);
        }
        if (token) {
          // const data = JSON.parse(token);
          // const now = new Date().getTime();
          // const expired = parseInt(data.expires) - now <= 0;
          // if (expired) {
          //   // token过期刷新
          //   useUserStoreHook()
          //     .refreshToken(data)
          //     .then((res: resultType) => {
          //       config.headers["Authorization"] = "Bearer " + res.accessToken;
          //       return $config;
          //     });
          // } else {
          //   config.headers["Authorization"] = "Bearer " + data.accessToken;
          //   return $config;
          // }
          config.headers["kk-token"] = token;
          config.headers["kk-request-id"] = buildUUID() + Date.now().toString();
          return $config;
        } else {
          return $config;
        }
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        const $data = response.data;
        // 关闭进度条动画
        localStorage.setItem("serviceTime", response.headers.date);
        NProgress.done();
        if (is($data, "Blob")) {
          return response;
        }
        const kkToken = response.headers["kk-token"];
        if (useUserStoreHook().getToken !== kkToken) {
          kkToken && setToken({ token: kkToken });
        }
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return $data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return $data;
        }
        if ($data.code === "10000") {
          return $data;
        } else {
          if ($data.code === "11105" || $data.code === "10041") {
            ElMessageBox.confirm(
              $data.msg || "登录已失效，请重新登录",
              "确定退出",
              {
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                confirmButtonText: "确定",
                // cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                // TODO 清除token 移到 finally 方法
                removeToken();
                location.reload();
              })
              .catch(() => {
                removeToken();
                location.reload();
              });
            return;
          } else {
            ElMessage({
              message: $data.msg,
              type: "warning"
            });
          }
          console.log($data);
          return Promise.reject(response.data);
        }
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  // 通用请求工具函数
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // 单独抽离的post工具函数
  public post<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  // 单独抽离的get工具函数
  public get<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp();
