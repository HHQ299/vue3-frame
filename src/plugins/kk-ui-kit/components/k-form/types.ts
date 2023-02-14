/*
 * @Author: wangzhengyang yangyang_123_456@163.com
 * @Date: 2022-07-25 10:06:13
 * @LastEditors: wangzhengyang yangyang_123_456@163.com
 * @LastEditTime: 2022-07-27 17:13:26
 * @FilePath: /order-center/src/plugins/kk-ui-kit/components/k-form/types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IOptions } from "../../types";

type IFormType =
  | "custom"
  | "cascader"
  | "select"
  | "select-remote"
  | "radio"
  | "radio-button"
  | "checkbox"
  | "checkbox-button"
  | "date"
  | "datetime"
  | "daterange"
  | "datetimerange"
  | "number"
  | "textarea"
  | "datepicker"
  | "numberInput"
  | "select-group";

export interface IFormItem {
  name: string;
  label: string;
  type: IFormType;
  span?: number;
  offset?: number;
  min?: number;
  max?: number;
  slot?: any;
  filterable?: boolean;
  multiple?: boolean;
  props?: object;
  inputType?: "text" | "password";
  placeholder: string;
  labelWidth: string | number;
  rules?: any[];
  options?: IOptions[];
  otherOptions?: any;
  labelKey?: keyof IOptions;
  valueKey?: keyof IOptions;
  style?: any;
  defaultValue?: any;
  noDataText?: string;
  maxlength?: number;
}

export interface IForm {
  fields: IFormItem[];
  labelWidth?: string | number;
  gutter?: number;
  rules?: any[];
  colLayout?: any;
}
