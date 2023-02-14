<template>
  <div class="m-html2canvas">
    <div ref="canvasRef" class="m-canvasRef">
      <div class="m-imageList" v-for="item in imageList" :key="item.id">
        <img :src="item.path" alt="" crossOrigin="anonymous" />
      </div>
    </div>
    <div class="m-showImage" v-if="imgUrl">
      <img :src="imgUrl" alt="" />
    </div>
    <div class="m-btn">
      <el-button type="primary" @click="createImageQrcode">合成图片</el-button>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas";

export default {
  name: "HtmlToImage",
  data() {
    return {
      imageList: [
        {
          path: "https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF",
          id: 1
        },
        {
          path: "https://img2.baidu.com/it/u=3231735899,2029570314&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
          id: 2
        },
        {
          path: "https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF",
          id: 3
        }
      ],
      imgUrl: ""
    };
  },
  methods: {
    createImage() {
      this.$nextTick(() => {
        const canvas = document.createElement("canvas");
        // 获取要生成图片的 DOM 元素
        let canvasDom = this.$refs.canvasRef;
        // 获取指定的宽高
        const width = parseInt(window.getComputedStyle(canvasDom).width);
        const height = parseInt(window.getComputedStyle(canvasDom).height);
        // console.log("获取指定的宽高", width, height)
        // 宽高扩大 2 倍 处理图片模糊
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width / 2 + "px";
        canvas.style.height = height / 2 + "px";

        const context = canvas.getContext("2d");
        context.scale(1, 1);
        // context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, canvas.width, canvas.height);
        const options = {
          backgroundColor: null,
          canvas: canvas,
          useCORS: true, //配置允许跨域
          // scale:1,
          // windowWidth: document.body.scrollWidth,
          // windowHeight: document.body.scrollHeight,
          // x: 0,
          // y: window.pageYOffset,
          // allowTaint: true,
          // background: "#ffffff", // 一定要添加背景颜色，否则出来的图片，背景全部都是透明的
          dpi: 300 // 处理模糊问题
        };
        console.log("获取指定的宽高", width, height, canvas);
        html2canvas(canvasDom, options)
          .then(canvas => {
            try {
              // 生成图片地址
              this.imgUrl = canvas.toDataURL("image/jpeg");
              console.log("canvas.toDataURL('image/png')", this.imgUrl);
            } catch (e) {
              alert("图片跨域,保存失败");
            }
          })
          .catch(err => {
            console.log("绘制失败", err);
          });
      });
    }
  }
};
</script>
<style lang="scss">
.m-html2canvas {
  display: flex;
}

.m-canvasRef {
  width: 500px;
  height: 500px;
  /* border: 1px solid red; */
  /* box-sizing: border-box; */
  box-shadow: 10px 10px 5px #888888;
}

.m-imageList {
  width: 500px;
  height: calc(500px / 3);
}

img {
  width: 100%;
  height: 100%;
  float: left;
}

.m-showImage {
  margin-left: 50px;
  background: red;
  width: 500px;
  height: 500px;
}

.m-btn {
  margin-left: 50px;
}
</style>
