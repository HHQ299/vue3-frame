import { http } from "/@/utils/http";
export const fetchOSSConfig = (data: object) => {
  return http.request(
    "post",
    `${import.meta.env.VITE_OSS_API_BASE_URL || ""}/kukeopen/oss/stsToken`,
    { data, baseURL: "" }
  );
};
