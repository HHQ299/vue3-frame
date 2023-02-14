// 表单校验规则
const reg = /^[1][0-9]{10}$/;
const regNum = /^[0-9]*$/;
const reg1 = /^[\u4e00-\u9fa5·]*$/;
const reg2 = new RegExp(
  "[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
);
type Validate = (rule: any, value: any, callback: any, str) => any;
// 手机号码校验;
const validatePhone: Validate = (rule, value, callback, str) => {
  if (!value) {
    callback(new Error("请输入" + str));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    callback();
  }
};
// 纯数字校验
const validateNumber = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入银行卡号"));
  } else if (!regNum.test(value)) {
    callback(new Error("请输入正确的数字"));
  } else {
    callback();
  }
};
// 名字校验
const validateText: Validate = (rule, value, callback, str) => {
  if (!value) {
    callback(new Error("请输入" + str));
  } else if (!reg1.test(value)) {
    callback(new Error("该输入框只能输入汉字"));
  } else {
    callback();
  }
};
// 不要特殊字符校验;
const validateText1: Validate = (rule, value, callback, str) => {
  if (!value) {
    callback(new Error("请输入" + str));
  } else if (reg2.test(value)) {
    callback(new Error("不允许输入特殊字符"));
  } else {
    callback();
  }
};
// 图片两张校验
const validateimg = (rule: any, value: any, callback: any) => {
  let length;
  if (value) {
    length = value.split(",").length;
  }
  if (!value) {
    callback(new Error("请上传身份证正反面"));
  } else if (length < 2) {
    callback(new Error("请上传身份证正反面"));
  } else {
    callback();
  }
};
export {
  validatePhone,
  validateNumber,
  validateText,
  validateText1,
  validateimg
};
