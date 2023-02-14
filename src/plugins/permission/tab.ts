import { router } from "/@/router/index";

export const mixin_permissionTab = function () {
  const { permissionTab = {} }: any = unref(router.currentRoute).meta;
  if (!permissionTab.tabs) return { tabs: [] };
  return permissionTab;
};

export const mixin_computedCurrentTab = function (elTabName) {
  const { tabs = [], index = 0 } = mixin_permissionTab();
  if (!elTabName) return tabs[index];
  const result = tabs.find(v => v.tabName === elTabName);
  return result || {};
};

export const $tabAuth = (value, currentTab) => {
  // const that = this
  // console.log('$tabAuth', value, currentTab)
  if (!currentTab || !currentTab.btns) {
    return;
  }
  let actions = [];
  let hasAction = null;
  if (Array.isArray(value)) {
    actions = value;
  } else {
    value && (actions = [value]);
  }
  // const route = that.$route
  // const { permissionTab = {} } = route.meta
  const { btns } = currentTab;
  hasAction = btns.find(v => actions.includes(v.buttonTag));

  return hasAction;
};
