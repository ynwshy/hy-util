/*
 * @Author: ynwshy
 * @Date: 2021-01-01 23:31:51
 * @LastEditTime: 2021-01-02 00:29:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hy-js-util\src\index.js
 */

 console.warn("hy-util.js");

/**
 * @description: FastCache 缓存类
 */
export class FastCache {
  constructor() {
    this.cacheData = {};
  }
  set(key, value) {
    this.cacheData[key] = value;
  }
  get(key) {
    return this.cacheData[key];
  }
  all() {
    return this.cacheData;
  }
  clear() {
    this.cacheData = {};
  }
}

/**
 * @description: 转json再转对象
 * @param {*} obj 源对象
 * @return {*} 深拷贝json对象
 */
export function obj(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}

//  对象 去两边空的
export function trim(str, defaultRturn) {
  if (typeof str == "string") {
    str = str.trim();
    if (str.length == 0 && defaultRturn == "_undefined") return undefined;
    if (str.length == 0 && defaultRturn == "_null") return null;
    return str;
  }
  if (typeof str == "object") {
    let ob = obj(str);
    for (const o in ob) {
      ob[o] = trim(ob[o], defaultRturn);
    }
    return ob;
  }
  return str;
}

// 查询条件参数常用
// 对象 去除值为空的
export function paramsFilter(obj = {}, isDeep = false) {
  if (!obj) {
    return {};
  }
  if (typeof obj == "object") {
    for (var attr in obj) {
      obj[attr] = trim(obj[attr]);
      if (obj[attr] === null || obj[attr] === "" || obj[attr] === undefined) {
        delete obj[attr];
        continue;
      }
      if (isDeep && typeof obj[attr] == "object") {
        paramsFilter(obj[attr]);
      }
    }
    return obj;
  } else {
    return obj;
  }
}

// 空格分隔 字符串 返回 数组
// 数组为空返回 undifined
// splitStr(sss) || []
export function splitStr(str = "") {
  let arr = str
    .trim()
    .replace(/\n|,|，|\;|。|；|\/|、|\|/g, " ")
    .trim()
    .split(" ")
    .filter((s) => s && s.trim());
  if (arr.length === 0) {
    return undefined;
  }
  arr.forEach((element, index) => {
    arr[index] = element.trim();
    if (element == "") {
    }
    // console.log(arr[index]);
  });
  return arr;
}

// 日期格式化
// parseTime("2021-01-22 00:00:00", '{y}-{m}-{d} {h}:{i}:{s} 周{a}')
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && "" != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == "" + value) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  });
  return actions.join("");
}

// 回显数据字典
export function valueLabel(
  datas,
  value,
  valueName = "value",
  labelName = "label"
) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key][valueName] == "" + value) {
      actions.push(datas[key][labelName]);
      return false;
    }
  });
  return actions.join("");
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === "undefined") {
      flag = false;
      return "";
    }
    return arg;
  });
  return flag ? str : "";
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId = rootId || 0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter((father) => {
    let branchArr = cloneData.filter((child) => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

export const SET_SESSION_STORAGE = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};
export const GET_SESSION_STORAGE = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

export const exportExcelStream = (excelData, fileName) => {
  console.log(excelData);
  const blob = new Blob([excelData]);
  // export const exportExcelStream = (blob , fileName) => {

  const name = fileName || "xxx.xlsx";
  const linkNode = document.createElement("a");

  linkNode.download = name; //a标签的download属性规定下载文件的名称
  linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
  // linkNode.style.display = 'none';
  document.body.appendChild(linkNode);
  linkNode.click(); //模拟在按钮上的一次鼠标单击

  // URL.revokeObjectURL(linkNode.href); // 释放URL 对象
  // document.body.removeChild(linkNode);
};

let _debounceTimeout = null,
  _throttleRunning = false;

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const debounce = (fn, delay = 500) => {
  clearTimeout(_debounceTimeout);
  _debounceTimeout = setTimeout(() => {
    fn();
  }, delay);
};
/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return;
  }
  _throttleRunning = true;
  fn();
  setTimeout(() => {
    _throttleRunning = false;
  }, delay);
};

/**
 * 格式化时间戳 Y-m-d H:i:s
 * @param {String} format Y-m-d H:i:s
 * @param {Number} timestamp 时间戳
 * @return {String}
 */
export const date = (format, timeStamp) => {
  if ("" + timeStamp.length <= 10) {
    timeStamp = +timeStamp * 1000;
  } else {
    timeStamp = +timeStamp;
  }
  let _date = new Date(timeStamp),
    Y = _date.getFullYear(),
    m = _date.getMonth() + 1,
    d = _date.getDate(),
    H = _date.getHours(),
    i = _date.getMinutes(),
    s = _date.getSeconds();

  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  H = H < 10 ? "0" + H : H;
  i = i < 10 ? "0" + i : i;
  s = s < 10 ? "0" + s : s;

  return format.replace(/[YmdHis]/g, (key) => {
    return { Y, m, d, H, i, s }[key];
  });
};
//二维数组去重
export const getUnique = (array) => {
  let obj = {};
  return array.filter((item, index) => {
    let newItem = item + JSON.stringify(item);
    return obj.hasOwnProperty(newItem) ? false : (obj[newItem] = true);
  });
};

export const regEx = {
  Percent: /^(0)$|^100$|^[1-9][0-9]?$/, // 大于等于0小于等于100正数 0%-100%
  num: /^[+]{0,1}(\d+)$/, // 正整数的正则表达式  (包括0)
  numno0: /^[1-9]\d*$/, // 正整数的正则表达式    (不包括0)
  Strs: /^[\u0391-\uFFE5\w]+$/, //中文字、英文字母、数字和下划线
  phone: /^1[3456789]\d{9}$/, //更新最新手机验证
  SpecialWord: /^[`\\~\!\@\#\$\%\^\&\*\(\)\_\+\{\}\|\:\"\<\>\?\/\.\,\;\'\[\]\\]+$/, //检查特殊字符
  passWord: /^(?![^a-zA-Z]+$)(?!\D+$)/,
  price: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
};

export const isRegEx = function (str, reg) {
  if (typeof reg == "object") {
    return reg.test(str);
  }
  if (typeof reg == "string") {
    return regEx[reg].test(str);
  }
};

export const isPercent = function (str) {
  return regEx.Percent.test(str);
};
export const isNumber = function (str) {
  return regEx.num.test(str);
};
export const isPrice = function (str) {
  return regEx.price.test(str);
};

export function isEmpty(str) {
  if (typeof str == "string") {
    str = str.trim();
  }
  return str === "" || str === null || str === undefined || str.length === 0
    ? true
    : false;
}
export function isNotEmpty(str) {
  if (typeof str == "string") {
    str = str.trim();
  }
  return str === "" || str === null || str === undefined || str.length === 0
    ? false
    : true;
}

// 判断类型集合
export const checkStr = (str, type, option) => {
  switch (type) {
    case "text": // 几位的字符串
      return eval("/^.{" + option[0] + "," + option[1] + "}$/").test(str);
    case "empty": // 非空
      return /^[\s\S]*.*[^\s][\s\S]*$/.test(str);
    case "phone": //手机号码
      return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
    case "tel": //座机
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case "card": //身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
    case "mobileCode": //6位数字验证码
      return /^[0-9]{6}$/.test(str);
    case "pwd": //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
      return /^([a-zA-Z0-9_]){6,18}$/.test(str);
    case "payPwd": //支付密码 6位纯数字
      return /^[0-9]{6}$/.test(str);
    case "postal": //邮政编码
      return /[1-9]\d{5}(?!\d)/.test(str);
    case "QQ": //QQ号
      return /^[1-9][0-9]{4,9}$/.test(str);
    case "email": //邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case "money": //金额(小数点2位)
      return /^\d*(?:\.\d{0,2})?$/.test(str);
    case "URL": //网址
      return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
        str
      );
    case "IP": //IP
      return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(
        str
      );
    case "date": //日期时间
      return (
        /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(
          str
        ) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
      );
    case "number": //数字
      return /^[0-9]$/.test(str);
    case "english": //英文
      return /^[a-zA-Z]+$/.test(str);
    case "chinese": //中文
      return /^[\\u4E00-\\u9FA5]+$/.test(str);
    case "lower": //小写
      return /^[a-z]+$/.test(str);
    case "upper": //大写
      return /^[A-Z]+$/.test(str);
    case "HTML": //HTML标记
      return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
    default:
      return true;
  }
};
