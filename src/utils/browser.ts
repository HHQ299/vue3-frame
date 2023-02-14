import uaParserJs from "ua-parser-js";
const uaParser = uaParserJs();
export function getBrowserVersion() {
  const agent = navigator.userAgent.toLowerCase();
  const arr = ["", ""];
  let Browser = "";
  let Bversion = "";
  let verinNum = "";
  //IE
  if (agent.indexOf("msie") > 0) {
    const regStr_ie = /msie [\d.]+;/gi;
    Browser = "IE";
    Bversion = "" + agent.match(regStr_ie);
  }
  //firefox
  else if (agent.indexOf("firefox") > 0) {
    const regStr_ff = /firefox\/[\d.]+/gi;
    Browser = "firefox";
    Bversion = "" + agent.match(regStr_ff);
  }
  //Chrome
  else if (agent.indexOf("chrome") > 0) {
    const regStr_chrome = /chrome\/[\d.]+/gi;
    Browser = "chrome";
    Bversion = "" + agent.match(regStr_chrome);
  }
  //Safari
  else if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
    const regStr_saf = /version\/[\d.]+/gi;
    Browser = "safari";
    Bversion = "" + agent.match(regStr_saf);
  }
  //Opera
  else if (agent.indexOf("opera") >= 0) {
    const regStr_opera = /version\/[\d.]+/gi;
    Browser = "opera";
    Bversion = "" + agent.match(regStr_opera);
  } else {
    const browser = navigator.appName;
    if (browser == "Netscape") {
      // eslint-disable-next-line
      const { browser, cpu, device, engine, os, ua } = uaParser;
      // const { browser, cpu, engine, os, ua } = uaParser;
      console.log(uaParser);
      Browser = browser.name;
      Bversion = os.version;
      // const version = agent.split(";");
      // const trim_Version = version[7].replace(/[ ]/g, "");
      // const rvStr = trim_Version.match(/[\d.]/g).toString();
      // const rv = rvStr.replace(/[,]/g, "");
      // Bversion = rv;
      // Browser = "IE";
    }
  }
  verinNum = (Bversion + "").replace(/[^0-9.]/gi, "");
  arr[0] = Browser;
  arr[1] = verinNum;
  return arr;
}
