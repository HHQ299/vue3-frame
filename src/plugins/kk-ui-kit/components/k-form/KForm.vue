<template>
  <div class="k-form-container" :style="{ maxWidth }">
    <div class="k-form-header">
      <slot name="title">
        <div class="header__title">
          {{ title }}
          <small v-if="subtitle" class="header__subtitle">{{ subtitle }}</small>
        </div>
      </slot>
      <div class="header__action">
        <slot name="action"></slot>
      </div>
    </div>
    <el-form
      v-if="search.fields && search.fields.length"
      class="k-form-body"
      :model="searchParams"
      :inline="false"
      label-position="right"
      :label-width="search.labelWidth"
      ref="refSearch"
    >
      <el-row class="search-area" :gutter="search.gutter || 48">
        <el-col
          v-for="item in search.fields"
          :key="item.name"
          :span="item.span || 24"
          :offset="item.offset || 0"
        >
          <el-form-item
            :label="item.label"
            :prop="item.name"
            :label-width="item.labelWidth"
            :rules="item.rules || []"
          >
            <slot v-if="item.type === 'custom'" :name="item.slot" />
            <el-cascader
              v-else-if="item.type === 'cascader'"
              v-model="searchParams[item.name]"
              :filterable="false"
              :multiple="false"
              :options="item.options"
              :props="item.props || {}"
              clearable
              :placeholder="`请选择${item.label}`"
              :style="{ ...item.style }"
            >
            </el-cascader>
            <el-select
              v-else-if="item.type === 'select'"
              v-model="searchParams[item.name]"
              :filterable="!!item.filterable"
              :multiple="!!item.multiple"
              clearable
              :placeholder="`请选择${item.label}`"
              :style="{ ...item.style }"
            >
              <el-option
                v-for="option of item.options"
                :key="option[item.valueKey || 'value']"
                :label="option[item.labelKey || 'label']"
                :value="option[item.valueKey || 'value']"
              ></el-option>
            </el-select>
            <el-select
              v-else-if="item.type === 'select-remote'"
              v-model="searchParams[item.name]"
              :name="item.name"
              filterable
              :multiple="!!item.multiple"
              clearable
              remote
              :remote-method="q => remoteMethod(q, item)"
              :placeholder="`请输入${item.label}`"
              :loading="loading"
              :style="{ ...item.style }"
            >
              <el-option
                v-for="option of item.options"
                :key="option[item.valueKey || 'value']"
                :label="option[item.labelKey || 'label']"
                :value="option[item.valueKey || 'value']"
              ></el-option>
            </el-select>
            <el-radio-group
              v-model="searchParams[item.name]"
              v-else-if="item.type === 'radio'"
              :style="{ ...item.style }"
            >
              <el-radio
                v-for="option of item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <el-radio-group
              v-model="searchParams[item.name]"
              v-else-if="item.type === 'radio-button'"
              :style="{ ...item.style }"
            >
              <el-radio-button
                v-for="option of item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-radio-button>
            </el-radio-group>
            <el-checkbox-group
              v-model="searchParams[item.name]"
              v-else-if="item.type === 'checkbox'"
              :style="{ ...item.style }"
            >
              <el-checkbox
                v-for="option of item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group
              v-model="searchParams[item.name]"
              v-else-if="item.type === 'checkbox-button'"
              :style="{ ...item.style }"
            >
              <el-checkbox-button
                v-for="option of item.options"
                :key="option.value"
                :label="option.value"
              >
                {{ option.label }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-date-picker
              v-else-if="item.type === 'date'"
              v-model="searchParams[item.name]"
              type="date"
              format="YYYY-MM-DD"
              clearable
              @change="handleDateChange($event, item, 'YYYY-MM-DD')"
              :placeholder="`请选择${item.label}`"
              :style="{ ...item.style }"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'datetime'"
              v-model="searchParams[item.name]"
              type="datetime"
              clearable
              @change="handleDateChange($event, item, 'YYYY-MM-DD HH:mm:ss')"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="`请选择${item.label}`"
              :style="{ ...item.style }"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'daterange'"
              v-model="searchParams[item.name]"
              type="daterange"
              format="YYYY-MM-DD"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              :default-time="defaultTime"
              @change="handleRangeChange($event, item, 'YYYY-MM-DD')"
              :style="{ ...item.style }"
            ></el-date-picker>
            <el-date-picker
              v-else-if="item.type === 'datetimerange'"
              v-model="searchParams[item.name]"
              type="datetimerange"
              format="YYYY-MM-DD HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
              :default-time="defaultTime"
              @change="handleRangeChange($event, item, 'YYYY-MM-DD HH:mm:ss')"
              :style="{ ...item.style }"
            ></el-date-picker>
            <el-input-number
              v-else-if="item.type === 'number'"
              v-model="searchParams[item.name]"
              :placeholder="`请输入${item.label}`"
              controls-position="right"
              :min="item.min"
              :max="item.max"
              :style="{ ...item.style }"
            />

            <el-input
              v-else-if="item.type === 'textarea'"
              type="textarea"
              clearable
              v-model.trim="searchParams[item.name]"
              :placeholder="`请输入${item.label}`"
              :style="{ ...item.style }"
            ></el-input>
            <el-input
              v-else
              v-model.trim="searchParams[item.name]"
              :type="item.inputType || 'text'"
              clearable
              :placeholder="`请输入${item.label}`"
              :style="{ ...item.style }"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div :class="['k-form-footer', footerAlign]">
      <span class="footer__footerTip">
        {{ footerTip }}
      </span>
      <el-button @click="handleReset()">重置</el-button>
      <el-button
        type="primary"
        v-debounce="{
          func: handleSearch,
          immediate: true,
          params: []
        }"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, PropType } from "vue";

import {
  formatDate,
  isEmptyObject,
  getSearchParams,
  optimizeParams
} from "../../utils";
import type { IForm } from "./types";

export default defineComponent({
  name: "KForm",
  components: {},
  props: {
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 小标题
    subtitle: {
      type: String,
      default: ""
    },
    search: {
      type: Object as PropType<IForm>,
      default: () => ({ fields: [] })
    },
    border: {
      type: Boolean,
      default: false
    },
    footerTip: {
      type: String,
      default: ""
    },
    maxWidth: {
      type: String,
      default: ""
    },
    footerAlign: {
      type: String,
      default: "end"
    }
  },
  emits: ["submit", "reset"],
  setup(props, { emit }) {
    // 请求列表数据
    const onSubmit = async () => {
      try {
        state.loading = true;
        const searchParams = optimizeParams(
          props.search,
          "search",
          state.searchParams
        );
        console.log("submit", searchParams);
        emit("submit", searchParams);
      } catch (error) {
        //
      } finally {
        state.loading = false;
      }
    };
    const remoteMethod = async (query, item) => {
      if (query !== null || query !== undefined) {
        const res = await item.remoteRequest(query.trim());
        let options = res.data;
        if (res.data.list) {
          options = res.data.list;
        }
        item.options = options;
      } else {
        item.options = [];
      }
    };

    const state = reactive({
      // 获取搜索参数
      searchParams: getSearchParams(props.search, "search"),
      loading: false,

      // 搜索
      handleSearch() {
        if (refSearch.value && refSearch.value.validate) {
          refSearch.value.validate(valid => {
            if (valid) {
              onSubmit();
            } else {
              console.error("验证错误！");
              return false;
            }
          });
        } else {
          onSubmit();
        }
      },
      // 重置函数
      handleReset() {
        if (isEmptyObject(state.searchParams)) return;
        refSearch.value && refSearch.value.resetFields();
        state.searchParams = getSearchParams(props.search, "search");
        state.onReset();
      },
      onReset() {
        state.loading = false;
        emit("reset", state.searchParams);
      },
      // 日期范围
      handleDateChange(date, item, format) {
        state.searchParams[item.name] = date ? formatDate(date, format) : "";
      },

      handleRangeChange(date, item, format) {
        const arr = !!date && date.map(d => formatDate(d, format));
        state.searchParams[item.name] = arr ? arr : [];
        if (!item.trueNames) {
          return;
        }
        if (arr) {
          arr.forEach((val, index) => {
            if (item.type === "daterange") {
              if (index === 0) {
                state.searchParams[item.trueNames[0]] = val + " 00:00:00";
              } else if (index === 1) {
                state.searchParams[item.trueNames[1]] = val + " 23:59:59";
              }
            } else {
              state.searchParams[item.trueNames[index]] = val;
            }
          });
        } else {
          item.trueNames.forEach(key => {
            delete state.searchParams[key];
          });
        }
      }
    });
    // 时间默认
    const defaultTime = [
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59)
    ];

    const refSearch = ref(null);
    return {
      ...toRefs(state),
      remoteMethod,
      defaultTime,
      refSearch
    };
  }
});
</script>

<style lang="scss">
.k-form-container {
  background-color: #fff;
  margin: 0 auto;
}

.k-form-header {
  padding: 12px 24px 12px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;

    .header__subtitle {
      // color: #666;
      margin-left: 4px;
      font-weight: normal;
    }
  }

  .header__action {
    font-size: 16px;
    color: #333;
  }
}

.k-form-body {
  padding: 24px 24px 0 24px;
  // margin-bottom: 16px;

  .el-form-item {
    .el-form-item__label {
      // padding-right: 0;
      // margin-right: 8px;
      // width: 6em;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
    }

    .el-select,
    .el-cascader,
    .el-date-editor {
      width: 100%;
    }
  }

  .search-area {
    // display: flex;
    // flex-wrap: wrap;
  }

  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
}

.k-form-footer {
  display: flex;
  padding: 12px 24px 12px;
  align-items: center;

  .footer__footerTip {
    font-size: 14px;
    color: #666;
    margin-right: 12px;
  }

  &.start {
    flex-direction: row-reverse;
    justify-content: left;

    .footer__footerTip {
      margin-right: 0;
      margin-left: 12px;
    }

    .el-button + .el-button {
      margin-left: 0;
      margin-right: 12px;
    }
  }

  &.center {
    justify-content: center;
  }

  &.end {
    justify-content: flex-end;
  }
}
</style>
