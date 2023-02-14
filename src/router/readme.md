```js
const routes = {
  // 路由地址
  path: "/permission",
  // 路由名字（对应不要重复）
  name: "permission",
  // Layout组件，一般不用动（如需整体空白页面，请去掉）
  component: Layout,
  // 路由重定向
  redirect: "/permission/page",
  meta: {
    // 菜单名称
    title: "message.permission",
    // 菜单图标（只针对顶级路由，也就是与当前meta平级的component为Layout的路由）
    icon: "Lollipop",
    // 是否在菜单中显示（可不写，默认true）
    showLink: true,
    // 菜单升序排序，值越高排的越后（只针对顶级路由，也就是与当前meta平级的component为Layout的路由）
    rank: 4
  },
  // 子路由配置项
  children: [
    {
      // 子路由地址
      path: "/permission/page",
      // 路由名字（对应不要重复，根当前组件的name保持一致）
      name: "permissionPage",
      // 按需加载组件
      component: () => import("/@/views/permission/page/index.vue"),
      meta: {
        // 菜单名称
        title: "message.permissionPage",
        // 是否在菜单中显示（可不写，默认true）
        showLink: true,
        // 路由权限设置
        authority: ["admin"],
        // 路由组件缓存（开启 true、关闭 false）
        keepAlive: true,
        // 页面加载动画（有两种形式，一种直接采用vue内置的transitions动画，另一种是使用animate.css写进、离场动画）
        transition: {
          // 当前路由动画效果，参考https://next.router.vuejs.org/guide/advanced/transitions.html#transitions
          name: "fade",
          // 进场动画
          enterTransition: "animate__zoomIn",
          // 离场动画
          leaveTransition: "animate__zoomOut"
        },
        // 动态路由可打开的最大数量
        dynamicLevel: 3,
        // 刷新重定向（用于未开启标签页缓存，刷新页面获取不到动态title）
        refreshRedirect: "/tabs/index"
      },
      // 菜单名称右侧的额外图标，支持fontawesome、iconfont、element-plus-icon
      extraIcon: {
        svg: true,
        name: "team-iconxinpinrenqiwang"
      }
    }
  ]
};
```
