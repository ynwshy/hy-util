/*
 * @Author: ynwshy
 * @Date: 2021-01-01 23:31:51
 * @LastEditTime: 2021-01-02 00:29:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \hy-js-util\src\index.js
 */

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
    console.log(str);
    if (typeof str == "string") {
        return str.trim();
    }
    // 如果需要返回 undefined null
    // this.trim(name,'null') this.trim(name,'undefined')
    if (defaultRturn == "undefined") return undefined;
    if (defaultRturn == "null") return null;
    return "";
}

//  对象 去除值为空的
export function paramsFilter(obj = {}, isDeep = false) {
    if (!obj) {
        return;
    }
    for (var attr in obj) {
        if (obj[attr] === null || obj[attr] === "" || obj[attr] === undefined) {
            delete obj[attr];
            continue;
        }
        if (isDeep && typeof obj[attr] == "object") {
            removeNull(obj[attr]);
        }
    }
    return obj;
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
        if (element == "") {}
        // console.log(arr[index]);
    });
    return arr;
}

// 日期格式化
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
    str = str.replace(/%s/g, function() {
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