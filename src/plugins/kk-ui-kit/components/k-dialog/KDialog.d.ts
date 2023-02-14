import { ElDialog } from "element-plus";

declare module 'vue' {
  export interface GlobalComponents {
    // KDialog: typeof ElDialog
    KDialog: typeof import("./index")["KDialog"]
  }
}