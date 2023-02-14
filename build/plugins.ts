import vue from "@vitejs/plugin-vue";
import { cdn } from "./cdn";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";
import WindiCSS from "vite-plugin-windicss";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";
import setupExtend from "vite-plugin-vue-setup-extend";
import viteCompression from "vite-plugin-compression";
import { genScssMultipleScopeVars } from "/@/layout/theme";

import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import {
  createStyleImportPlugin,
  ElementPlusResolve
} from "vite-plugin-style-import";

export function getPluginsList(command, VITE_LEGACY, mode, VITE_CDN) {
  // const prodMock = true;
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    // jsx、tsx语法支持
    vueJsx(),
    VITE_CDN ? cdn : null,
    WindiCSS(),
    // 线上环境删除console
    mode === "production" ? removeConsole() : null,
    viteBuildInfo(),
    PkgConfig(),
    OptimizationPersist(),
    setupExtend(),
    Components({
      // 按需加载的文件夹
      directives: true,
      dirs: ["src/components", "src/plugins"],
      // 按需引入
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
      // 配置文件生成位置
      dts: "src/components.d.ts"
    }),
    AutoImport({
      imports: ["vue", "@vueuse/core", "vue-router"],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      },
      resolvers: [
        ElementPlusResolver({
          importStyle: false
        })
      ]
    }),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()]
    }),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        // 默认取 multipleScopeVars[0].scopeName
        // defaultScopeName: "",
        // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        extract: true,
        // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
        // outputDir: "",
        // 会选取defaultScopeName对应的主题css文件在html添加link
        themeLinkTagId: "head",
        // "head"||"head-prepend" || "body" ||"body-prepend"
        themeLinkTagInjectTo: "head",
        // 可以自定义css文件名称的函数
        // customThemeCssFileName: scopeName => scopeName
        // 是否对抽取的css文件内对应scopeName的权重类名移除
        removeCssScopeName: false
      }
    }),
    // svg组件化支持
    svgLoader(),
    viteCompression(),
    // 是否为打包后的文件提供传统浏览器兼容性支持
    VITE_LEGACY
      ? legacy({
          targets: ["ie >= 11"],
          additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
        })
      : null,
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null
  ];
}
