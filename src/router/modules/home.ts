import Layout from "/@/layout/index.vue";
const homeRouter = {
  path: "/",
  name: "home",
  component: Layout,
  redirect: "/welcome",
  // meta: {
  //   icon: "home-filled",
  //   // showLink: false,
  //   title: "首页",
  //   rank: 0
  // },
  children: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("/@/views/welcome.vue"),
      meta: {
        title: "首页"
      }
    }
  ]
};

export default homeRouter;
