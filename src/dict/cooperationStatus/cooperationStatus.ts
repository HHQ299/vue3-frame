import { IDictItem } from "/@/api/types";

interface ICooperationStatusDict extends IDictItem {
  tagType: "" | "primary" | "success" | "warning" | "info" | "danger";
}
export const dict_cooperationStatus: ICooperationStatusDict[] = [
  {
    label: "即将到期",
    value: 3,
    tagType: "warning"
  },
  {
    label: "合作中",
    value: 2,
    tagType: "success"
  },
  {
    label: "待合作",
    value: 1,
    tagType: "info"
  },
  {
    label: "合作到期",
    value: 4,
    tagType: "danger"
  },
  {
    label: "合作终止",
    value: 5,
    tagType: "danger"
  }
];
export const cooperationStatusFilter = value => {
  const temp = dict_cooperationStatus.find(v => v.value == value) || {
    label: "",
    tagType: ""
  };
  return temp;
};
