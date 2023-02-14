```html
<template>
  <input v-model="inputValue" v-emoji />
</template>

<script>
  import { defineComponent, ref } from "vue";
  export default defineComponent({
    setup() {
      let inputValue = ref("");
      return {
        inputValue
      };
    }
  });
</script>
```
