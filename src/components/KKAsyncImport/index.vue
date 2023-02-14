<script setup lang="ts">
import { downloadFileByXHR } from "kk-oss";
import WS from "kk-ws-client";

const wsURL = `xxxxxx`;
const ws = new WS(wsURL, {
  heartbeatDelay: 1000 * 10 * 6, // 心跳时间
  reconnectionCountMax: 3 // 重连次数
});
ws.on("open", event => {
  console.log("连接成功！！", ws, event);
  // 业务代码 ...
  ws.send("export_history");
  this.socket = ws;
  // ...
});

ws.on("close", function (event) {
  console.log("关闭连接", event);
});

ws.on("message", async function (event) {
  let response = JSON.parse(event.data);
  console.log("信息:", response);
  if (response.type === "约定标识") {
    const client = await this.$oss.init();
    // 生成文件路径
    let newUrl = client.signatureUrl(
      response.filePath,
      { expires: 3600 } // 设置过期时间
    );
    // 下载文件
    downloadFileByXHR(newUrl);
  }
});

ws.on("message", async function (event) {
  if (event.data === "pong") {
    console.log("心跳响应：", response);
  }
});
</script>

<template>
  <div></div>
</template>

<style scoped></style>
