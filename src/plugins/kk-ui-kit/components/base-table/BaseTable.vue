<template>
  <div class="baseTable">
    <table>
      <colgroup>
        <col
          :width="column.wdith"
          v-for="(column, index2) in columns"
          :key="index2"
        />
      </colgroup>
      <thead>
        <th v-for="item in columns" :key="item.prop">{{ item.label }}</th>
      </thead>
      <tbody>
        <tr v-for="(row, index) in list" :key="index">
          <td
            v-for="(column, index2) in columns"
            :key="index2"
            :class="[`is-${column.align || 'left'}`]"
          >
            <template v-if="column.customSlot === true">
              <slot
                :name="column.prop"
                :row="row"
                :column="column"
                :index="index"
              ></slot>
            </template>
            <template v-else-if="typeof column.customSlot === 'string'">
              <slot
                :name="column.customSlot"
                :row="row"
                :column="column"
                :index="index"
              ></slot>
            </template>
            <template v-else-if="column.render">
              <RenderColumn
                :render="column.render"
                :row="row"
                :column="column"
                :index="index"
              />
            </template>
            <div class="cell" v-else>{{ row[column.prop] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
export default {
  name: "BaseTable"
};
</script>
<script setup lang="ts">
import RenderColumn from "./RenderColumn";
export interface Props {
  columns: any;
  list: any;
}

withDefaults(defineProps<Props>(), {
  columns: [],
  list: []
});
</script>

<style scoped lang="scss">
table {
  background: #f5f7fa;
  width: 100%;
  text-align: center;
  line-height: 44px;
  font-size: 14px;

  thead th {
    color: #999;
    font-weight: normal;
  }

  thead th:nth-of-type(1) {
    // tbody td:nth-of-type(1) {
    text-align: left;
    padding-left: 12px;
  }

  tbody td {
    padding: 8px 8px;
    text-align: left;

    &.is-center {
      text-align: center;
    }

    .cell {
      // padding: 0 4px;
      line-height: 1.4;
    }
  }

  .money {
    &-input {
      width: 120px;

      .el-input__inner {
        text-align: center;
      }
    }
  }
}
</style>
