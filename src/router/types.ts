import { RouteLocationNormalized, _RouteRecordBase } from "vue-router";

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    btnPermissions?: string[];
    keepAlive?: boolean;
    refreshRedirect: string;
    dynamicLevel?: string;
    permissionTab?: Tabs;
  };
}
export interface Tabs {
  tabs: any;
  index: number;
}
export interface IRouteRecord extends _RouteRecordBase {
  meta: {
    title?: string;
    btnPermissions?: readonly string[];
    rank?: number;
    keepAlive?: boolean;
    showLink?: boolean;
    dynamicLevel?: string;
    frameSrc?: string;
    activeMenu?: string;
    icon?: string;
    showParent?: boolean;
    hasChildren?: boolean | number;
    permissionTab?: Tabs;
  };
  children: IRouteRecord[];
  component: any;
  name: string;
  isCache: number;
  menuHidden: number;
  activationMenuPath: string;
  redirectPath: string;
  icon: string;
  tag: string;
  type: number;
  componentName: string;
  webPath: string;
  backPath: string;
  dataPrivilege: any[];
  id: string | number;
  _id: string | number;
  buttonType: 1 | 2;
  buttonTag: string;
  parentId?: string;
}
