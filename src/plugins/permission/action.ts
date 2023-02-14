import { App, DirectiveBinding, Plugin } from "vue";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { router } from "/@/router/index";
//
const plugin = <Plugin>{
  install(app: App) {
    app.directive("action", {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        let hasAction = null;
        const actionName = binding.arg;
        // console.log("el, binding, vnode, prevVnode");
        // console.log(el, binding, vnode, prevVnode);
        const currentRouteBtns = usePermissionStoreHook().buttonsAuth || [];
        // const currentRouteBtns =
        //   unref(router.currentRoute).meta.btnPermissions || [];
        hasAction = unref(currentRouteBtns).includes(actionName);

        if (!hasAction) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      },
      updated() {
        // console.log("updated", params);
      }
    });
    //
    app.directive("hasRoute", {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        let hasAction = null;
        const routeName = binding.arg;
        hasAction = router.hasRoute(routeName);

        if (!hasAction) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      },
      updated() {}
    });
  }
};

const useAuth = () => {
  const $action = (value, modifiers?) => {
    const { one = true, all } = modifiers || {};
    let actions = [];
    let hasAction = null;
    if (Array.isArray(value)) {
      actions = value;
    } else {
      value && (actions = [value]);
    }
    const buttonsAuth = usePermissionStoreHook().buttonsAuth || [];
    if (actions.length > 1) {
      if (one) {
        hasAction = buttonsAuth.some(v => actions.includes(v));
        // console.log(`${actions}`, hasAction);
      }
      if (all) {
        hasAction = actions.every(v => buttonsAuth.includes(v));
      }
    } else {
      hasAction = buttonsAuth.includes(actions[0]);
    }
    return hasAction;
  };
  const $hasRoute = routeName => {
    return router.hasRoute(routeName);
  };

  return { $action, $hasRoute };
};
export { plugin, useAuth };
export default plugin;
