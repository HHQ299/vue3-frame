## 使用

```bash
(p)npm install element-plus vue-router -S
(p)npm installali-oss @types/ali-oss md5 axios -S
main.ts 注册 element-plus 等
# 配置 oss 环境变量
VITE_DATA_ENCRYPTION_APPID = ******
VITE_DATA_ENCRYPTION_APPKEY = ******
```

## KTable 组件使用

### 使用参考 /src/views/agentManage/list

- [x] 支持远程搜索
- [x] 支持表头远程搜索

## KForm 组件使用

```html
<template>
  <div>
    <KForm
      :search="search"
      footerAlign="start"
      title="表单标题"
      maxWidth="800px"
      subtitle="表单小标题"
      footerTip="底部提示"
    >
      <template #action> 自定义操作栏 </template>
    </KForm>
  </div>
</template>
<script setup lang="ts">
  const search = reactive({
    gutter: 48,
    labelWidth: 120,
    fields: [
      {
        type: "text",
        label: "合作机构编号",
        name: "mechanismCode",
        span: 24,
        rules: [
          {
            required: true,
            message: "请输入合作机构编号"
          }
        ],
        defaultValue: ""
      },
      {
        type: "text",
        label: "合作机构名称",
        name: "mechanismName",
        span: 24,
        rules: [
          {
            required: true,
            message: "请输入合作机构名称"
          }
        ],
        defaultValue: ""
      }
    ]
  });
</script>
```

## 指令

- 默认全局注册`v-debounce`指令
