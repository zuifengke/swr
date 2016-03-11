/**
 * 组装查询Uri时使用的工具类，组装时会忽略掉没有值的字段；
 * 对于其他特殊过滤条件的情况，需要提供接口函数，有待增强。
 * 使用方式：
 * var url = QueryUriBuilder.queryParam($scope.patientId, "patientId")
 *  .queryParam(null, "name")
 *  .queryParam($scope.pinyin, "pinyin")
 *  .build();
 *  返回组装好的字符串，结构为——?patientId=value&pinyin=value
 * @type {QueryUriParamBuilder}
 */
var QueryUriParamBuilder = (function () {
    var _urlStr = "";
    var _count = 0;
    var _acceptFilter = function (value2Check) {
        return value2Check !== undefined && value2Check !== null && value2Check !== "";
    };
    var _clearAndReturnGeneratedUrl = function () {
        var _generatedUrl = _urlStr;
        _urlStr = "";
        _count = 0;
        return _generatedUrl;
    };
    return {
        queryParam: function (value2Check, field2Check) {
            if (_acceptFilter(value2Check)) {
                if (_count === 0) {
                    _urlStr += "?" + field2Check + "=" + value2Check;
                } else {
                    _urlStr += "&" + field2Check + "=" + value2Check;
                }
                _count++;
            }
            return this;
        },
        build: function () {
            return _clearAndReturnGeneratedUrl();
        }
    };
})();