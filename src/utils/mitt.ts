import type { Emitter } from "mitt";
import mitt from "mitt";
export enum EnumCoursePerformanceOrdersRouteName {
  coursePerformance_order_orders = "1",
  coursePerformance_agentOrders_orders = "2"
}

type Events = {
  resize: {
    detail: {
      width: number;
      height: number;
    };
  };
  openPanel: string;
  tagViewsChange: string;
  tagViewsShowModel: string;
  logoChange: string;
  changLayoutRoute: {
    indexPath: string;
    parentPath: string;
  };
  dataMaterial: boolean;
  courseMaterial: boolean;
  cpfOrderChange: string;
  ChangeOrder: boolean;
  GiftOrder: boolean;
  AllOrder: boolean;
  RefundOrder: boolean;
  FlowList: boolean;
};

export const emitter: Emitter<Events> = mitt<Events>();
