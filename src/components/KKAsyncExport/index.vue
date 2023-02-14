<template>
  <div style="display: inline-block">
    <el-popover
      placement="bottom"
      width="220"
      trigger="contextmenu"
      v-model:visible="visibleExport"
    >
      <p class="popover-title">文件导出已完成，请点击这里查看</p>
      <div style="margin: 0">
        <el-checkbox v-model="isNotice" :true-label="2" :false-label="1"
          >不再提醒</el-checkbox
        >
        <el-button
          style="
            width: 48px;
            height: 24px;
            padding: 0;
            line-height: 22px;
            margin-left: 60px;
          "
          type="primary"
          size:any="mini"
          @click="handleIsNotice"
          >确定</el-button
        >
      </div>
      <template #reference>
        <div @click="exportDialog" class="posttitle">
          <FontIcon
            icon="icon-ic_download1"
            svg
            style="width: 20px; height: 20px; cursor: pointer"
          ></FontIcon>
          <span class="unread-warning" v-if="isUnread"></span>
        </div>
      </template>
    </el-popover>

    <el-dialog
      v-model="isExportDialog"
      width="824px"
      :append-to-body="true"
      custom-class="export"
    >
      <!-- <template class="header-title" #title> -->
      <template #title>
        <span style="font-size: 16px; color: #333333; margin-right: 16px"
          >文件数据列表</span
        >
        <span style="font-size: 12px; color: #999999"
          >导出记录有效期保存为7天</span
        >
      </template>

      <el-table ref="table" :data="tableData" class="export" border>
        <el-table-column
          v-for="item in rowHeader"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template #default="scope">
            <template v-if="item.prop === 'operate'">
              <el-button type="text" @click="operation(scope.row)"
                >下载</el-button
              >
            </template>
            <template v-if="item.prop === 'progress'">
              <span style="color: #41b779">导出成功</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="KKAsyncExport">
import { getToken } from "/@/utils/auth";
import { ElMessage } from "element-plus";
import { exportHistory, setExportNotice } from "/@/api/common/dict";
import { useOSS } from "/@/plugins/kk-ui-kit/alioss/composables/useOSS";
import { loadEnv } from "@build/index";
import WS from "kk-ws-client";
const { VITE_PROXY_WEBSOCKET } = loadEnv();
let timer = ref<any>();
let isUnread = ref<boolean>(false);
let visibleExport = ref<boolean>(false);
// let exportInfo = ref<any>({ isUnread: false, visibleExport: true });
let isExportDialog = ref<boolean>(false);
let isNotice = ref<number>(1);
let tableData = ref<any>();
let rowHeader = ref<any>();
// let options = ref<any>();
let socket = ref<any>();
onBeforeMount(() => {
  initLoad();
  initWebsocket();
});
onBeforeUnmount(() => {
  unref(socket).close();
  clearHeartbeat();
});

const initWebsocket = () => {
  const wsURL = `${VITE_PROXY_WEBSOCKET}/kukewebsocket/notification/${getToken()}`;
  const ws = new WS(wsURL, {
    heartbeatDelay: 1000 * 60 * 1, // 设置心跳时间3分钟
    reconnectionCountMax: 3 // 重连次数
  });
  ws.on("open", event => {
    console.log("连接成功！！", ws, event);
    // console.log('ws.send === ws.socket.send', ws.send === ws.socket.send)
    ws.send("export_history");
    // ws.$emit("pong");
    // ws.emit("export_history");
    socket.value = ws;
  });

  ws.on("close", function (event) {
    console.log("关闭连接", event);
  });

  ws.on("export_history", function (e) {
    console.log("[ export_history ] >", e);
  });

  ws.on("message", function (event) {
    // 如果收到的消息是 pong 说明心跳连接正常
    if (event.data === "pong") return;
    // console.log("[ 异步导出 message ] >", event.data);
    let res = JSON.parse(event.data); // 增加 try catch
    if (res.msgType === 1) {
      /**
       * noReadTask 0全部已读 1有未读任务
       * isNotice 1需要提醒 2不提醒（已关闭）
       * popup 1需要弹窗提醒 2无需弹窗提醒
       * */
      let res = JSON.parse(event.data);
      // 如果有未读消息  显示红点
      if (res.msgInfo.noReadTask === 1) {
        // 如果有未读消息  并且导出列表弹框是打开的状态，请求导出列表数据
        if (isExportDialog.value) {
          isUnread.value = false;
          getExportHistory();
        } else {
          isUnread.value = true;
        }
      } else {
        isUnread.value = false;
      }
      // 如果 是否提醒状态为1，并且有成功的数据
      if (res.msgInfo.isNotice === 1 && res.msgInfo.popup === 1) {
        // 导出完成弹框

        visibleExport.value = true;
      } else {
        visibleExport.value = false;
      }
    }
  });
};

// const initWebsocket = () => {
//   const initSocket = new WebSocket(
//     `${VITE_PROXY_WEBSOCKET}/kukewebsocket/notification/${getToken()}`
//   );
//   socket.value = initSocket;
//   // Connection opened
//   socket.value.addEventListener("open", function () {
//     clearHeartbeat();
//     heartbeat();
//     socket.value.send("export_history");
//   });
//   // Listen for messages
//   socket.value.addEventListener("message", function (event) {
//     // 如果收到的消息是 pong 说明心跳连接正常
//     if (event.data !== "pong") {
//       /*  noReadTask 0全部已读 1有未读任务    isNotice 1需要提醒 2不提醒（已关闭）   popup 1需要弹窗提醒 2无需弹窗提醒 */
//       let res = JSON.parse(event.data);
//       // 如果有未读消息  显示红点
//       if (res.msgInfo.noReadTask === 1) {
//         // 如果有未读消息  并且导出列表弹框是打开的状态，请求导出列表数据
//         if (isExportDialog.value) {
//           isUnread.value = false;
//           getExportHistory();
//         } else {
//           isUnread.value = true;
//         }
//       } else {
//         isUnread.value = false;
//       }
//       // 如果 是否提醒状态为1，并且有成功的数据
//       if (res.msgInfo.isNotice === 1 && res.msgInfo.popup === 1) {
//         // 导出完成弹框

//         visibleExport.value = true;
//       } else {
//         visibleExport.value = false;
//       }
//     }
//   });
//   // 连接错误
//   socket.value.addEventListener("error", function () {
//     clearHeartbeat();
//     reconnect();
//   });
//   // 断开连接
//   socket.value.addEventListener("close", function () {
//     clearHeartbeat();
//     reconnect();
//   });
// };

const initLoad = () => {
  rowHeader.value = getRowHeaderOne();
};
// 心跳检测，每隔10分钟发送消息
// const heartbeat = () => {
//   timer.value = setInterval(function () {
//     socket.value.send("ping");
//   }, 300000);
// };
// 清空心跳定时器
const clearHeartbeat = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = "";
  }
};
// 重新链接
// const reconnect = () => {
//   if (lockReconnect.value) return;
//   lockReconnect.value = true;
//   setTimeout(function () {
//     // 没连接上会一直重连，设置延迟避免请求过多
//     initWebsocket();
//     lockReconnect.value = false;
//   }, 2000);
// };

// 点击不在提醒 的确定按钮
const handleIsNotice = () => {
  visibleExport.value = false;
  if (isNotice.value === 2) {
    setExportNotice({ isNotice: isNotice.value }).then(() => {});
  }
  // 关闭导出成功弹框
  unref(socket).send("close_popup");
};
// 导出数据列表
const getExportHistory = () => {
  exportHistory().then(res => {
    // 请求列表接口，noReadTask状态就改为已读，获取长链接数据
    socket.value.send("export_history");
    if (JSON.stringify(res.data) === "{}") {
      return;
    }
    tableData.value = res.data;
  });
};
const { getOSSInstance, signatureUrl } = useOSS();
// 小云朵按钮
const exportDialog = () => {
  getExportHistory();
  isExportDialog.value = true;
  getOSSInstance();
};
const getRowHeaderOne = () => {
  return [
    {
      prop: "name",
      label: "文件名称",
      sortable: false,
      isShow: true,
      width: 405
    },
    {
      prop: "date",
      label: "导出时间",
      width: 170,
      isShow: true
    },
    {
      prop: "progress",
      label: "进度",
      width: 100,
      isShow: true
    },
    {
      prop: "operate",
      label: "操作",
      isShow: true
    }
  ];
};
// 操作按钮
const operation = row => {
  if (!isTimeTrue()) {
    ElMessage.warning("当前电脑时间与实际时间不符，请修改后重试");
    return;
  }

  let newUrl = signatureUrl(
    row.filePath,
    { expires: 3600 } // 设置过期时间，设置图片宽高
  );
  window.open(newUrl);
};

// 判断服务器时间与本地时间 如果是同一天则返回true
const isTimeTrue = () => {
  let dateService = new Date(localStorage.getItem("serviceTime"));
  let dateLocal = new Date();
  let dateServiceTime =
    dateService.getFullYear() + dateService.getMonth() + dateService.getDate();
  let dateLocalTime =
    dateLocal.getFullYear() + dateLocal.getMonth() + dateLocal.getDate();
  if (dateServiceTime === dateLocalTime) {
    return true;
  } else {
    return false;
  }
};
</script>
<style lang="scss">
.posttitle {
  position: relative;
}

.unread-warning {
  width: 5px;
  height: 5px;
  border-radius: 10px;
  background: #fa3536;
  position: absolute;
  left: 17px;
  top: 11px;
}

.popover-title {
  margin-top: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

.header-title {
  margin-bottom: 16px;
}

.export {
  .el-dialog__body {
    overflow-y: auto;
    height: 486px;
  }
}

// .el-dialog__body {
//   max-height: 481px;
//   overflow-y: scroll;
// }

::v-deep(.el-dialog__header.export) {
  max-height: 481px;
  overflow-y: scroll;
}
</style>
