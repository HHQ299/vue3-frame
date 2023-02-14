import Layout from "/@/layout/index.vue";

const externalLink = {
  path: "/external",
  name: "external",
  component: Layout,
  meta: {
    icon: "link",
    title: "外链",
    rank: 190
  },
  children: [
    {
      path: "https://github.com/xiaoxian521/vue-pure-admin",
      meta: {
        title: "外链"
      }
    }
  ]
};

export default externalLink;
