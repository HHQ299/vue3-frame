<template>
  <div class="KTable">
    <el-form
      v-if="search.fields && search.fields.length"
      class="kk-table_search"
      :model="searchParams"
      :inline="false"
      label-position="right"
      :class="{ 'no-margin': hideTitleBar }"
      ref="refSearch"
    >
      <el-row class="search-area" :gutter="search.gutter || 32">
        <el-col
          v-for="item in search.fields.length > 6 && isMore
            ? search.fields.slice(0, 6)
            : search.fields"
          :key="item.name"
          :span="item.span || 8"
          :offset="item.offset || 0"
        >
          <el-form-item
            :label="item.label"
            :prop="item.name"
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
              @change="val => singleSelectHandle(val, item.name)"
              :clearable="item.name != 'queryYear'"
              :no-data-text="item.noDataText || '暂无数据'"
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

            <el-select
              v-else-if="item.type === 'select-group'"
              v-model="searchParams[item.name]"
              :filterable="!!item.filterable"
              :multiple="!!item.multiple"
              @change="val => singleSelectHandle(val, item.name)"
              :clearable="item.name != 'queryYear'"
              :no-data-text="item.noDataText || '暂无数据'"
              :placeholder="`请选择${item.label}`"
              :style="{ ...item.style }"
            >
              <el-option-group
                v-for="group in item.options"
                :key="group.value"
                :label="group.label"
              >
                <el-option
                  v-for="option of group.children"
                  :key="option[item.valueKey || 'value']"
                  :label="option[item.labelKey || 'label']"
                  :value="option[item.valueKey || 'value']"
                ></el-option>
              </el-option-group>
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
                {{ option.label }}</el-radio
              >
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
                {{ option.label }}</el-radio-button
              >
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
                >{{ option.label }}</el-checkbox
              >
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
                {{ option.label }}</el-checkbox-button
              >
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
              :disabled-date="e => disabledHandle(e, searchParams['queryYear'])"
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
              v-else-if="item.type === 'numberInput'"
              clearable
              v-model.trim="searchParams[item.name]"
              oninput="value=value.replace(/[^0-9]/g,'')"
              :placeholder="`请输入${item.label}`"
              :style="{ ...item.style }"
              :maxlength="item.maxlength"
            ></el-input>
            <el-input
              v-else
              v-model.trim="searchParams[item.name]"
              :type="item.inputType || 'text'"
              clearable
              :maxlength="item.maxlength"
              :placeholder="`请输入${item.label}`"
              :style="{ ...item.style }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-form-item
          class="search-btns"
          label=""
          label-width="0"
          v-if="!isRightBtn"
        >
          <el-button
            type="primary"
            v-debounce="{
              func: handleSearch,
              immediate: true,
              params: []
            }"
            :icon="Search"
          >
            查询
          </el-button>
          <el-button @click="handleReset('search')">重置</el-button>
          <div
            class="extra-btn"
            @click="isMore = !isMore"
            v-if="search.fields.length > 6"
          >
            <span>{{ isMore ? "展开更多" : "收起更多" }}</span>
            <span
              :style="
                isMore ? 'transform: rotate(-45deg);margin-top:-4px;' : ''
              "
            ></span>
          </div>
        </el-form-item>
      </el-row>
      <el-form-item
        class="search-btns"
        label=""
        label-width="0"
        v-if="isRightBtn"
      >
        <el-button
          type="primary"
          v-debounce="{
            func: handleSearch,
            immediate: true,
            params: []
          }"
          :icon="Search"
        >
          查询
        </el-button>
        <el-button @click="handleReset('search')">重置</el-button>
        <div
          class="extra-btn"
          @click="isMore = !isMore"
          v-if="search.fields.length > 6"
        >
          <span>{{ isMore ? "展开更多" : "收起更多" }}</span>
          <span
            :style="isMore ? 'transform: rotate(-45deg);margin-top:-4px;' : ''"
          ></span>
        </div>
      </el-form-item>
    </el-form>
    <!-- 中间区域 -->
    <slot name="center"></slot>
    <!-- 中间区域 end -->
    <!-- table表格栏 -->
    <div class="kk-table">
      <!-- title 和 工具栏 -->
      <div>
        <slot name="tab">
          <span class="tab">{{ tab }}</span>
        </slot>
      </div>
      <div class="kk-table-toolbar" v-if="!hideTitleBar">
        <el-space wrap :size="12" class="toolbar_btns">
          <slot name="title">
            <span class="title">{{ title }}</span>
          </slot>
        </el-space>

        <div class="toolbar_tips">
          <slot name="tips">
            <span class="tips">{{ tips }}</span>
          </slot>
        </div>
        <div class="toolbar_actions">
          <div class="toolbar_action">
            <slot name="actions"></slot>
          </div>
          <el-button-group>
            <el-button
              @click="() => refresh()"
              class="toolbar_action"
              :icon="Refresh"
            >
            </el-button>
            <ColumnSetting
              class="toolbar_action"
              :list="columns"
              :localStorageColumnsKey="localColumnPropListKey"
              @ok="columnFilterOk"
            >
            </ColumnSetting>
          </el-button-group>
        </div>
      </div>
      <slot name="alert"> </slot>
      <!-- <div class="kk-table_alert" v-if="$slots.alert"></div> -->
      <el-table
        v-loading="loading"
        :data="tableData"
        :row-key:any="rowKey"
        :tree-props="tree.treeProps"
        :lazy="tree.lazy"
        :load="tree.load"
        tooltip-effect="dark"
        :stripe="stripe"
        :row-class-name:any="rowClassName"
        :border="border"
        :max-height="maxHeight"
        :span-method="spanMethod"
        @selection-change="handleSelectionChange"
        ref="refTable"
      >
        <template v-for="item in showColumns" :key="item.prop">
          <el-table-column
            :filter-method="item.filters && filterHandler"
            :show-overflow-tooltip="!item.wrap"
            v-bind="item"
          >
            <!-- 表头 -->
            <template
              #header="scope"
              v-if="item.labelTooltip || item.searchConfig"
            >
              <span class="kk-table-label">{{ scope.column.label }}</span>
              <template v-if="!!item.labelTooltip">
                <el-tooltip :content="item.labelTooltip">
                  <el-icon class="kk-table-tooltip__icon">
                    <WarningFilled />
                  </el-icon>
                </el-tooltip>
              </template>
              <template v-if="item.searchConfig && item.searchConfig.type">
                <SearchCheckbox
                  :list="item.searchConfig.options"
                  v-if="item.searchConfig.type === 'checkbox'"
                  v-model="searchParamsTh[item.searchConfig.name]"
                  :title="item.searchConfig.title || ''"
                  @ok="handleSearch()"
                  @close="handleSearch()"
                >
                </SearchCheckbox>
                <SearchRadio
                  v-else-if="item.searchConfig.type === 'radio'"
                  :dictKey="item.searchConfig.dictKey"
                  v-model="searchParamsTh[item.searchConfig.name]"
                  :title="item.searchConfig.title || ''"
                  :list="item.searchConfig.options || []"
                  @ok="handleSearch()"
                  @close="handleSearch()"
                >
                </SearchRadio>
                <SearchSelect
                  v-else-if="item.searchConfig.type === 'select'"
                  v-model="searchParamsTh[item.searchConfig.name]"
                  :options="item.searchConfig.options"
                  :valueKey="item.searchConfig.valueKey"
                  :labelKey="item.searchConfig.labelKey"
                  :title="item.searchConfig.title || ''"
                  @ok="handleSearch()"
                  @close="handleSearch()"
                >
                </SearchSelect>
                <SearchSelectRemote
                  v-else-if="item.searchConfig.type === 'select-remote'"
                  v-model="searchParamsTh[item.searchConfig.name]"
                  :remoteRequest="item.searchConfig.remoteRequest"
                  :valueKey="item.searchConfig.valueKey"
                  :labelKey="item.searchConfig.labelKey"
                  :title="item.searchConfig.title || ''"
                  @ok="handleSearch()"
                  @close="handleSearch()"
                >
                </SearchSelectRemote>
                <SearchInput
                  v-else
                  v-model="searchParamsTh[item.searchConfig.name]"
                  :title="item.searchConfig.title || ''"
                  @ok="handleSearch()"
                  @close="handleSearch()"
                >
                </SearchInput>
              </template>
            </template>
            <template #header="scope" v-else-if="!!item.labelSlot">
              <slot :name="item.labelSlot" v-bind="scope"></slot>
            </template>
            <!-- 内容 -->
            <template #default="scope" v-if="!!$slots[item.prop]">
              <template v-if="item.prop === 'operate'">
                <!-- <el-space :size="1" :spacer="Spacer"> -->
                <slot :name="item.prop" v-bind="scope"></slot>
                <!-- </el-space> -->
              </template>
              <slot :name="item.prop" v-bind="scope" v-else></slot>
            </template>
            <template #default="scope" v-else-if="item.render">
              <RenderCell
                :render="item.render"
                :row="scope.row"
                :column="scope.column"
                :index="scope.$index"
              />
            </template>
            <template #default="scope" v-else>
              {{ scope.row[item.prop] ? scope.row[item.prop] : "-" }}</template
            >
          </el-table-column>
        </template>
      </el-table>
      <div class="kk-table-pagination">
        <div class="kk-table-pagination__left">
          <slot name="paginationLeft"></slot>
        </div>
        <el-pagination
          v-if="paginationConfig.show && total > 0"
          :style="paginationConfig.style"
          @size-change="handleSizeChange"
          v-model:currentPage="pageNum"
          @current-change="handleCurrentChange"
          :page-sizes="paginationConfig.pageSizes"
          v-model:pageSize="pageSize"
          :layout="paginationConfig.layout"
          :total="total"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  h,
  ref,
  unref,
  PropType
} from "vue";

import { ElDivider } from "element-plus";
import { WarningFilled, Refresh, Search } from "@element-plus/icons-vue";
import {
  formatDate,
  isType,
  isEmptyObject,
  getSearchParams,
  optimizeParams
} from "../../utils";
import {
  ColumnSetting,
  SearchInput,
  SearchCheckbox,
  SearchRadio,
  SearchSelect,
  SearchSelectRemote
} from "./search/index";
import { RenderCell } from "./index";
import { useRoute } from "vue-router";
import type { IForm } from "../k-form/types";
// import { ColumnCls } from "element-plus/es/components/table/src/table/defaults";

export default defineComponent({
  name: "KTable",
  components: {
    WarningFilled,
    ColumnSetting,
    SearchCheckbox,
    SearchRadio,
    SearchInput,
    SearchSelect,
    SearchSelectRemote,
    RenderCell
  },
  props: {
    // 请求数据的方法
    request: {
      type: Function,
      required: true
    },
    // 表格标题
    title: {
      type: String,
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: 640
    },
    // 表格提示
    tips: {
      type: String,
      default: ""
    },
    // 表格tab切换
    tab: {
      type: String,
      default: ""
    },
    search: {
      type: Object as PropType<IForm>,
      default: () => ({ fields: [] })
    },
    // 是否隐藏标题栏
    hideTitleBar: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    rowClassName: [Function, String],
    // rowClassName: {
    //   type: Object as PropType<ColumnCls<any>>
    // },
    border: {
      type: Boolean,
      default: false
    },
    autoRequest: {
      type: Boolean,
      default: true
    },
    // 表头配置
    columns: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    // 如果一个页面有多个KTable 必传
    localStorageColumnsKey: {
      type: String,
      default: ""
    },
    // 行数据的Key，同elementUI的table组件的row-key
    rowKey: {
      type: [String, Function],
      // type: Object as PropType<IElTable["rowKey"]>,
      default: "id"
    },
    // 分页配置，false表示不显示分页
    pagination: {
      type: [Boolean, Object],
      default: () => ({ layout: "", pageSize: 10 })
    },
    // spanMethod: Function,
    tree: {
      type: Object,
      default: () => ({})
    },
    //控制按钮位置
    isRightBtn: {
      type: Boolean,
      default: true
    }
  },
  emits: ["selectionChange", "singleChange"],
  setup(props, { emit }) {
    const refTable = ref(null);
    // 请求列表数据
    const getTableData = async () => {
      try {
        state.loading = true;
        const searchParams = optimizeParams(
          props.search,
          "search",
          state.searchParams
        );
        // TODO 列被隐藏后
        const searchParamsTh = optimizeParams(
          unref(showColumns),
          "columns",
          state.searchParamsTh
        );
        setTimeout(async () => {
          const { data, total, spanMethod } = await props.request({
            page: state.pageNum || 1,
            pageSize: state.pageSize,
            ...searchParams,
            ...searchParamsTh
          });
          state.tableData = data;
          state.total = total;
          state.spanMethod = spanMethod;
        }, 500);
      } catch (error) {
        //
      } finally {
        state.loading = false;
      }
    };
    const remoteMethod = async (query, item) => {
      // TODO 判断是否空值
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

    const showColumns = ref([]);
    const state = reactive({
      // 获取搜索参数
      searchParams: getSearchParams(props.search, "search"),
      // 获取表头搜索参数
      searchParamsTh: getSearchParams(unref(props.columns), "columns"),
      loading: false,
      tableData: [],
      spanMethod: null,
      total: 0,
      pageNum: 1,
      pageSize: (!!props.pagination && props.pagination.pageSize) || 10,
      paginationConfig: {
        show: false,
        pageSizes: [10],
        style: {},
        layout: ""
      },

      isMore: true,
      // 搜索
      handleSearch() {
        if (refSearch.value && refSearch.value.validate) {
          refSearch.value.validate(valid => {
            if (valid) {
              state.pageNum = 1;
              getTableData();
            } else {
              console.error("验证错误！");
              return false;
            }
          });
        } else {
          state.pageNum = 1;
          getTableData();
        }
      },
      // 重置函数
      handleReset(type) {
        // type 区分筛选模块重置和表格重置  如果存在表示当前是筛选重置
        if (type) {
          if (isEmptyObject(state.searchParams)) {
            return;
          }
        } else {
          if (isEmptyObject(state.searchParamsTh)) {
            return;
          }
        }
        refSearch.value && refSearch.value.resetFields();
        state.searchParams = getSearchParams(props.search, "search");
        state.searchParamsTh = getSearchParams(unref(showColumns), "columns");
        state.pageNum = 1;
        if (Object.keys(state.searchParams).includes("subjectId")) {
          emit("singleChange", { val: false, name: "cateId" });
        }

        getTableData();
      },
      // 刷新
      refresh() {
        getTableData();
      },
      // 当前页变化
      handleCurrentChange() {
        getTableData();
      },
      // 改变每页size数量
      handleSizeChange() {
        state.pageNum = 1;
        getTableData();
      },
      // 全选
      handleSelectionChange(arr) {
        emit("selectionChange", arr);
      },
      // 过滤方法
      filterHandler(value, row, column) {
        const property = column["property"];
        return row[property] === value;
      },
      // 日期范围
      handleDateChange(date, item, format) {
        state.searchParams[item.name] = date ? formatDate(date, format) : "";
      },

      handleRangeChange(date, item, format) {
        const arr =
          !!date && date.map(d => formatDate(d.$d ? d.$d : d, format));
        state.searchParams[item.name] = arr ? arr : [];
        if (!item.trueNames) {
          return;
        }
        if (arr) {
          arr.forEach((val, index) => {
            // if (item.type === "daterange") {
            //   if (index === 0) {
            //     state.searchParams[item.trueNames[0]] = val + " 00:00:00";
            //   } else if (index === 1) {
            //     state.searchParams[item.trueNames[1]] = val + " 23:59:59";
            //   }
            // } else {
            state.searchParams[item.trueNames[index]] = val;
            // }
          });
        } else {
          item.trueNames.forEach(key => {
            delete state.searchParams[key];
          });
        }
      },
      // 日期禁止选择事件
      disabledHandle(e, f) {
        return (
          e.getTime() < new Date(f + "/01/01").getTime() ||
          e.getTime() > new Date(f + "/12/31").getTime()
        );
      }
    });
    // 时间默认
    const defaultTime = [
      new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59)
    ];
    if (isType(props.pagination, "Object")) {
      const { pagination } = toRefs(props);
      const { layout, pageSizes, style } = pagination;
      state.paginationConfig = {
        show: true,
        layout: layout || "total, sizes, prev, pager, next, jumper",
        pageSizes: pageSizes || [10, 20, 30, 50, 100],
        style: style || {}
      };
    }
    // borderStyle: "dashed"
    const Spacer = h(ElDivider, { direction: "vertical" });
    //
    // TODO 优化
    // TODO 每一列配置 hidden 属性
    const localColumnPropListKey = ref("");
    onBeforeMount(() => {
      if (props.localStorageColumnsKey) {
        localColumnPropListKey.value = props.localStorageColumnsKey;
      } else {
        const route = useRoute();
        localColumnPropListKey.value = `COLUMNSKEY_${String(route.name || "")}`;
      }
      const propList = JSON.parse(
        localStorage.getItem(localColumnPropListKey.value) || "[]"
      );
      setColumns(propList);
      if (props.autoRequest) {
        getTableData();
      }
    });
    const columnFilterOk = propList => {
      setColumns(propList);
      // state.searchParamsTh = getSearchParams(unref(showColumns), "columns");
    };
    const setColumns = propList => {
      if (propList.length) {
        showColumns.value = props.columns.filter(v => {
          if (
            v.type === "selection" ||
            v.prop === "operate" ||
            propList.includes(v.prop)
          ) {
            return true;
          }
          return false;
        });
      } else {
        showColumns.value = props.columns;
      }
    };
    onMounted(() => {
      refTable.value &&
        refTable.value.$refs.bodyWrapper.addEventListener(
          "mousewheel",
          scrollBehavior
        );
    });
    onUnmounted(() => {
      // 卸载
      refTable.value &&
        refTable.value.$refs.bodyWrapper.removeEventListener(
          "mousewheel",
          scrollBehavior
        );
    });
    const scrollBehavior = (e: any) => {
      if (e.deltaY) {
        let dom = document.getElementsByClassName("el-popper");
        if (dom.length > 0) {
          dom[dom.length - 1].style.display = "none";
        }
      }
    };
    //选择回显数据
    const singleSelectHandle = (val, name) => {
      if (name == "cateId") {
        state.searchParams["subjectId"] = "";
      }
      emit("singleChange", { val: val, name: name });
    };
    const refSearch = ref(null);
    return {
      ...toRefs(state),
      localColumnPropListKey,
      Spacer,
      showColumns,
      columnFilterOk,
      remoteMethod,
      Refresh,
      Search,
      defaultTime,
      refSearch,
      refTable,
      setColumns,
      singleSelectHandle
    };
  }
});
</script>

<style lang="scss">
.KTable {
  // width: 100%;
}

.kk-table_search {
  display: flex;
  // flex-wrap: wrap;
  background-color: #fff;
  padding: 16px 16px 0 16px;
  margin-bottom: 16px;

  &.no-margin {
    margin-bottom: 0;
  }

  .el-form-item {
    .el-form-item__label {
      padding-right: 0;
      margin-right: 8px;
      width: 6em;
      overflow: hidden;
      white-space: nowrap;
      /*文字超出宽度则显示ellipsis省略号*/
      text-overflow: ellipsis;
    }

    .el-select,
    .el-cascader,
    .el-date-editor {
      width: 100%;
    }
  }

  .search-area {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    margin-left: -44px !important;
  }

  .search-btns {
    margin-left: 32px;

    .el-form-item__content {
      align-items: flex-start;
    }
  }

  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }

  .title {
    font-size: 16px;
  }
}

.kk-table-toolbar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  .toolbar_tips {
    color: #999;
    font-size: 14px;
  }

  .toolbar_actions {
    margin-left: auto;
    display: flex;
    align-items: center;

    .toolbar_action {
      cursor: pointer;
    }
  }
}

.kk-table {
  background-color: #fff;
  padding: 16px;
  width: 100%;

  th.el-table__cell {
    background-color: #f4f4f4 !important;
    height: 44px;

    & > .cell {
      display: inline-flex !important;
      align-items: center;
      // justify-content: center;
      // line-height: 28px - 1px;
      color: #333;
    }

    &.is-right > .cell {
      justify-content: flex-end;
    }
  }

  td.el-table__cell,
  th.el-table__cell.is-leaf {
    border-left: var(--el-table-border);

    &:first-child {
      border-left: 1px solid #fff;
    }
  }

  td.el-table__cell {
    height: 56px;

    & > .cell {
      // line-height: 40px - 1px;
      color: #333;
    }
  }

  .el-table-column--selection {
    .cell {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
  }

  .el-table__row {
    &.row-even:hover {
      background-color: var(--el-table-row-hover-bg-color);

      & + .row-even {
        background-color: var(--el-table-row-hover-bg-color);
      }

      & + .row-even + .row-even {
        background-color: var(--el-table-row-hover-bg-color);
      }

      & + .row-even + .row-even + .row-even {
        background-color: var(--el-table-row-hover-bg-color);
      }
    }

    &.row-odd {
      background: #fafafa;

      .el-table-fixed-column--right {
        background: #fafafa;
      }
    }

    &.row-odd:hover {
      background-color: var(--el-table-row-hover-bg-color);

      & + .row-odd {
        background-color: var(--el-table-row-hover-bg-color);
      }

      & + .row-odd + .row-odd {
        background-color: var(--el-table-row-hover-bg-color);
      }

      & + .row-odd + .row-odd + .row-odd {
        background-color: var(--el-table-row-hover-bg-color);
      }
    }
  }

  .el-table {
    width: 100%;
  }
}

.kk-table-tooltip__icon {
  margin-left: 4px;
}

.kk-table-label {
  line-height: 1;
}

.kk-table-pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  .kk-table-pagination__left {
    display: flex;
    align-items: center;
  }
}

.el-popper {
  max-width: 600px;
}

.extra-btn {
  position: absolute;
  bottom: 0;
  color: #126efe;
  font-size: 14px;
  cursor: pointer;

  span:first-child {
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  span:last-child {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-left: 1px solid #126efe;
    border-bottom: 1px solid #126efe;
    transform: rotate(135deg);
    vertical-align: middle;
    margin-top: 4px;
  }
}

.el-input__inner {
  line-height: 1px !important;
}

// ::v-deep(th) {
//   background: #f6f6f6;
//   color: rgba(0, 0, 0, 0.85);
// }
</style>
