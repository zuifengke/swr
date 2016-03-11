//连接字符串
function StringBuffer() {
    this.arrays = new Array;
}

StringBuffer.prototype.append = function (value) {
    this.arrays.push(value);
};

StringBuffer.prototype.toString = function () {
    return this.arrays.join("");
};

function GetDateStr(dateStr) {
    var str = null;
    if (dateStr.indexOf("T") >= 0) {
        str = dateStr.split("T")[0];
        return str == "0001-01-01" ? "" : str;
    } else if (dateStr.indexOf(" ") >= 0) {
        str = dateStr.split(" ")[0];
        return str == "0001-01-01" ? "" : str;
    }
    return str;
};

function GetDateTimeStr(dateStr) {
    if (dateStr.indexOf("T") >= 0) {
        return dateStr.replace(/T/, " ");
    }
    return null;
};

//截取字符串 包含中文处理
//(串,长度,增加...)
function subString(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        }
        else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
};