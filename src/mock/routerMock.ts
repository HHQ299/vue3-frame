// import IconMaterial from "/@/router/assets/svg/ic_material.svg";
/**
 * 菜单路由规范：
 * https://alidocs.dingtalk.com/i/nodes/2X3LRMZdxkAJpjxbPzyqWGgrBYeOq5Ew
 */
export const roleList = [
  {
    id: "0",
    name: "学服中心",
    tag: "student-service",
    webPath: "/student-service-center/",
    backPath: "",
    parentId: "0",
    systemId: "2",
    componentName: "NewPageTargetBlank",
    type: 1,
    isCache: 1,
    isSubSystem: 1,
    activationMenuPath: "",
    menuHidden: 0,
    redirectPath: "/",
    dataPrivilege: [],
    children: [
      {
        id: "2",
        name: "学员管理",
        tag: "newfileOne",
        webPath: "/newfileOne",
        backPath: "/newfileOne",
        icon: "ic_agent",
        parentId: "0",
        systemId: "2",
        componentName: "Layout",
        type: 1,
        isCache: 1,
        isSubSystem: 0,
        activationMenuPath: "",
        menuHidden: 0,
        redirectPath: "/newfile/newfile",
        dataPrivilege: [],
        children: [
          {
            id: "3",
            name: "全部学员列表",
            tag: "students_all",
            webPath: "/students_all",
            backPath: "/students_all",
            parentId: "2",
            systemId: "2",
            componentName: "/newfile/newfile.vue",
            type: 2,
            isCache: 0,
            isSubSystem: 0,
            activationMenuPath: "",
            menuHidden: 0,
            redirectPath: "",
            dataPrivilege: []
          },
          {
            id: "4",
            name: "转班学员列表",
            tag: "students_change",
            webPath: "/students_change",
            backPath: "/students_change",
            parentId: "2",
            systemId: "2",
            componentName: "/newfile/newfile.vue",
            type: 2,
            isCache: 0,
            isSubSystem: 0,
            activationMenuPath: "",
            menuHidden: 0,
            redirectPath: "",
            dataPrivilege: []
          },
          {
            id: "5",
            name: "退费学员列表",
            tag: "students_refund",
            webPath: "/students_refund",
            backPath: "/students_refund",
            parentId: "2",
            systemId: "2",
            componentName: "/newfile/newfile.vue",
            type: 2,
            isCache: 0,
            isSubSystem: 0,
            activationMenuPath: "",
            menuHidden: 0,
            redirectPath: "",
            dataPrivilege: []
          },
          {
            id: "6",
            name: "我的学员列表",
            tag: "students_my",
            webPath: "/students_my",
            backPath: "/students_my",
            parentId: "2",
            systemId: "2",
            componentName: "/newfile/newfile.vue",
            type: 2,
            isCache: 0,
            isSubSystem: 0,
            activationMenuPath: "",
            menuHidden: 0,
            redirectPath: "",
            dataPrivilege: []
          }
        ]
      }
    ]
  }
];
