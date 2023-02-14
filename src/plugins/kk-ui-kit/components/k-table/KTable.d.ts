import { ElTable } from "element-plus";

declare module 'vue' {
  export interface GlobalComponents {
    KTable: typeof ElTable & typeof import('./index')['KTable']
  }
}