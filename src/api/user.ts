import { http } from "../utils/http";
import { ApiResponse } from "./types";

interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
}

// 获取用户基本信息
export const getUserInfo = (_params?: object) => {
  return http.request("post", "/kukeadmin/user/getAdminUserInfoProt", {});
};

// 获取验证码
export const getVerify = (): userType => {
  return http.request("get", "/captcha");
};

// 登录
export const getLogin = (
  data: object
): Promise<ApiResponse<{ token: string }>> => {
  return http.request("post", "/kukeadmin/user/login", { data });
};

// 刷新token
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};
