/*
 * @Descripttion:
 * @version:
 * @Author: wangxiaoheng
 * @Date: 2022-01-11 08:42:35
 * @LastEditors: wangxiaoheng
 * @LastEditTime: 2022-01-18 11:41:44
 */
module.exports = {
  // 可选的类型
  types: [
    { value: "feat", name: "feat:           新功能" },
    { value: "fix", name: "fix:            修复" },
    { value: "docs", name: "docs:           文档变更" },
    { value: "style", name: "style:          代码格式(不影响代码运行的变动) " },
    {
      value: "refactor",
      name: "refactor:       重构(既不是增加feature,也不是修复bug)"
    },
    { value: "perf", name: "perf:           性能优化" },
    { value: "test", name: "test:           增加测试" },
    { value: "chore", name: "chore:          构建过程中辅助功能的变动" },
    { value: "revert", name: "revert:         回退" },
    { value: "build", name: "build:          打包" },
    {
      value: "CI",
      name: "CICD:           对CI配置文件和脚本的更改(示例范围:Travis, Circle, BrowserStack, SauceLabs)"
    },
    {
      value: "Chores",
      name: "Chores:         除src目录或测试文件以外的修改"
    },
    {
      value: "Reverts",
      name: "Reverts:        回退历史版本"
    },
    {
      value: "Conflict",
      name: "Conflict:       修改冲突"
    },
    {
      value: "Fonts",
      name: "Fonts:          字体文件更新"
    },
    {
      value: "DeleteFiles",
      name: "DeleteFile:     删除文件"
    },
    {
      value: "StashFiles",
      name: "StashFiles:     暂存文件"
    }
  ],
  // 消息步骤
  messages: {
    type: "请选择提交的类型",
    customScope: "请输入修改的范围（可选）",
    subject: "请简要描述提交（必填）",
    body: "请输入详细描述（可选）",
    footer: "请输入要关闭的issue(可选)",
    confirmCommit: "确认要使用以上信息提交？（y/n）"
  },
  // 跳过步骤
  skipQuestions: ["body"],
  // subject 长度限制 默认72
  subjectLimit: 72
};
