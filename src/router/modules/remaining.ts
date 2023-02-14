import Layout from "/@/layout/index.vue";

const remainingRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("/@/views/login.vue"),
    meta: {
      title: "登陆",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/error/500",
    name: "Page500",
    component: () => import("/@/views/error/500.vue"),
    meta: {
      title: "500",
      showLink: false
    }
  },

  {
    path: "/redirect",
    name: "redirect",
    component: Layout,
    redirect: "/redirect/welcome",
    meta: {
      icon: "home-filled",
      title: "首页",
      showLink: false,
      rank: 104
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirectPath",
        component: () => import("/@/views/redirect.vue")
      }
    ]
  }
];

export default remainingRouter;
