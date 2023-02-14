/**
 * websocket
 */
import { getToken } from "/@/utils/auth";
import { loadEnv } from "@build/index";
const { VITE_PROXY_WEBSOCKET } = loadEnv();

const wsUrl = `${VITE_PROXY_WEBSOCKET}/kukewebsocket/notification/${getToken()}`; // websocket 默认连接地址
let websocket: any; // 用于存储实例化后 websocket
let isConnect = false; // 连接标识 避免重复连接
let rec: any; // 断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码

// 创建 websocket receiveMessage: 接受到的数据
function createWebSocket(receiveMessage: Function | null) {
  console.log(
    "%c",
    "color: skyBlue",
    "websocket===========================================开始"
  );
  isSupport();
  try {
    initWebSocket(receiveMessage); // 初始化websocket连接
  } catch (e) {
    console.warn("%c", "color: red", "链接失败");
    reConnect(receiveMessage); // 如果无法连接上 webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
  }
}

// 判断当前浏览器是否支持 WebSocket
function isSupport() {
  if ("WebSocket" in window) {
    console.log("当前浏览器 windows");
  } else if ("MozWebSocket" in window) {
    // 火狐浏览器
    console.log("当前浏览器 windows");
  } else {
    console.warn("当前浏览器不支持 websocket");
  }
}

// 初始化 websocket
function initWebSocket(receiveMessage: Function) {
  websocket = new WebSocket(wsUrl);
  console.log("websocket:", websocket);

  // websocket 已经连接 使用 send 方法发送数据
  websocket.onopen = function (e: any) {
    console.log("websocket 🔗 成功:", e.data);
    // sendWebSocket();
  };

  // 接收
  websocket.onmessage = function (e: any) {
    // 回传给页面
    console.log("消息推送");
    receiveMessage(e);
    websocketOnmessage(e);
  };

  // 连接发生错误
  websocket.onerror = function () {
    console.log("WebSocket 连接发生错误");
    isConnect = false; // 连接断开修改标识
    reConnect(receiveMessage); // 连接错误 需要重连
  };

  // 关闭 websocket
  websocket.onclose = function (e: any) {
    websocketClose(e);
  };
}

// 定义重连函数
const reConnect = (receiveMessage: Function) => {
  console.log("尝试重新连接");
  if (isConnect) return; // 如果已经连上就不在重连了
  rec && clearTimeout(rec);
  rec = setTimeout(function () {
    // 延迟5秒重连  避免过多次过频繁请求重连
    createWebSocket(receiveMessage);
  }, 5000);
};

// 创建连接
// function websocketOpen(e: any) {
//   console.log("连接成功", e);
//   sendWebSocket(receiveMessage);
// }
// 数据接收
function websocketOnmessage(e: any) {
  console.log("数据接收", e.data);
  // let data = JSON.parse(decodeUnicode(e.data))
}
// 关闭
function websocketClose(e: any) {
  console.log(e);
  isConnect = false; // 断开后修改标识
  console.log("connection closed (" + e.code + ")");
}

// 数据发送
function websocketSend(data: any) {
  console.log("发送的数据", data, JSON.stringify(data));
  websocket.send(JSON.stringify(data));
}

// 实际调用的方法==============

// 发送 data: 发送的数据
function sendWebSocket(data: any, receiveMessage: Function) {
  //发送数据
  // parameter = data;
  if (websocket && websocket.readyState === websocket.OPEN) {
    // 开启状态
    websocketSend(data);
  } else {
    // 若 未开启 / 正在开启 状态 ，则等待1s后重新调用
    setTimeout(function () {
      createWebSocket(receiveMessage);
    }, 1000);
  }
}

// 关闭
const closeWebSocket = () => {
  console.log(
    "%c",
    "color: skyBlue",
    "websocket 🔗 ===========================================关闭"
  );
  websocket.close();
};
//导出方法
export { createWebSocket, sendWebSocket, closeWebSocket };
