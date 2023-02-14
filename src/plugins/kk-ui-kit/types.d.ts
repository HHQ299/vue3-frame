
declare type IOptions = {
  label: string;
  value: string | number;
  [key: string]: any;
};

export interface ISearchItem {
  type: string;
  name: string;
  placeholder: string;
  labelSlot: string;
  options?: IOptions[];
  fixed: Boolean | "right" | "left";
  align: "center" | "right" | "left";
  defaultValue: string | string[];
  trueNames: string | string[];
  style?: object;
}
export interface IColumnItem {
  label?: string | undefined;
  type?: "checkbox" | "radio" | "text";
  prop: string;
  width?: number;
  searchConfig?: ISearchItem;
}
