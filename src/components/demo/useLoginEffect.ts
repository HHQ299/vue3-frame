import { reactive, toRefs } from "vue";
// 将login方法拆分  useLoginEffect 可以接收参数 将使用到的组件以参数的形式传递进来
export const useLoginEffect = showToast => {
  // 使用同步方法将登录实现
  const router = useRouter();
  const data = reactive({
    username: "",
    password: ""
  });
  const handleLogin = async () => {
    try {
      const result = await post("/api/user/login", {
        username: data.username,
        password: data.password
      });
      console.log(result?.code);
      // es2020 语法 意思是 如果result存在就去找data 如果data存在就去找errno
      if (result?.errno === 0) {
        localStorage.isLogin = true;
        router.push({ name: "Home" });
      } else {
        showToast("登录失败");
      }
    } catch (e) {
      // 在composition中修改变量不需要 使用this
      showToast("请求失败");
    }
  };
  const { username, password } = toRefs(data);
  return { username, password, handleLogin };
};
