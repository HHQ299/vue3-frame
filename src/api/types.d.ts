export interface ApiPageQuery {
  pageSize: number;
  page: number;
  [key: string]: any;
}
export interface ApiResponse<T = any> {
  code: string;
  msg: string;
  time: string;
  data: T;
}
export interface ApiPageResponse<P = any> {
  code: string;
  msg: string;
  time: string;
  data: {
    count: number;
    list: P;
    [key: string]: any;
  };
}
export interface IDictItem {
  label: string;
  value: string | number;
  tagType?: string;
  [key: string]: any;
}
