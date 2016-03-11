//var base = 'http://localhost:3000';
var base = 'http://10.10.76.156:8080';
angular.module('starter.services', [])
    .factory('Loader', ['$ionicLoading', '$timeout', function ($ionicLoading, $timeout) {

        var LOADERAPI = {

            showLoading: function (text) {
                text = text || 'Loading...';
                $ionicLoading.show({
                    template: text
                });
            },

            hideLoading: function () {
                $ionicLoading.hide();
            },

            toggleLoadingWithMessage: function (text, timeout) {
                var self = this;

                self.showLoading(text);

                $timeout(function () {
                    self.hideLoading();
                }, timeout || 3000);
            }

        };
        return LOADERAPI;
    }])
.factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Andrew Jostlin',
        lastText: 'Did you get the ice cream?',
        face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
        id: 3,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 4,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})
.factory('UserFactory', 
    function (ENV, $http) {
        var api = ENV.domain + ENV.api;
        var UserAPI = {
            login: function (user) {
                //user.name = "30281";
                //user.password = "1";
                var queryParam = QueryUriParamBuilder.queryParam("JSON_CALLBACK", "callback").queryParam("1", "tid")
                .queryParam(user.UserName, "uname")
                .queryParam(user.Password, "pwd").build();
                return $http.jsonp(api+ '/oAuth' + queryParam);
            }
        };

        return UserAPI;
    }
)
.factory('BedcardFactory', 
    function (ENV, $http) {
        var api = ENV.domain + ENV.api;
        var BedcardAPI = {
            //获取个人床卡病人
            getMyBedcards: function (dcode) {
                var queryParam = QueryUriParamBuilder.queryParam("JSON_CALLBACK", "callback")
                .queryParam(dcode, "dcode").build();
                return $http.jsonp(api+'/patient' + queryParam);
            }
        };
        return BedcardAPI;
    }
)
.factory('DiagnosisFactory', ['$http',
    function ($http) {
        var DiagnosisAPI = {
            getDiagnosises: function (pid, vno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').build();
                return $http.jsonp(base + '/api/diagnosis' + queryParam);
            }
        };
        return DiagnosisAPI;
    }
])
.factory('OrderFactory', ['$http',
    function ($http) {
        var OrderAPI = {
            getOrders: function (pid, vno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').build();
                return $http.jsonp(base + '/api/order' + queryParam);
            }
        };
        return OrderAPI;
    }
])
.factory('CheckFactory', ['$http',
    function ($http) {
        var CheckAPI = {
            getCheckList: function (pid, vno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').build();
                return $http.jsonp(base + '/api/exam' + queryParam);
            },
            getCheckDetail: function (key) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(key, 'key').build();
                return $http.jsonp(base + '/api/exam' + queryParam);
            },
            getCheckReport: function (key) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(key, 'key').queryParam(1, 'tid').build();
                return $http.jsonp(base + '/api/exam' + queryParam);
            }
        };
        return CheckAPI;
    }
])
.factory('TestFactory', ['$http',
    function ($http) {
        var TestAPI = {
            getTestList: function (pid, vno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').build();
                return $http.jsonp(base + '/api/lab' + queryParam);
            },
            getTestDetail: function (key) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(key, 'key').build();
                return $http.jsonp(base + '/api/lab' + queryParam);
            },
            getTestReport: function (lno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(lno, 'lno').queryParam(1, 'tid').build();
                return $http.jsonp(base + '/api/lab' + queryParam);
            }
        };
        return TestAPI;
    }
])
.factory('MedDocFactory', ['$http',
    function ($http) {
        var MedDocAPI = {
            getMedDocList: function (pid, vno) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').build();
                return $http.jsonp(base + '/api/meddoc' + queryParam);
            },
            getMedDocUrl: function (pid, vno, did) {
                var queryParam = QueryUriParamBuilder.queryParam('JSON_CALLBACK', "callback").queryParam(pid, 'pid').queryParam(vno, 'vno').queryParam(did, 'did').build();
                return $http.jsonp(base + '/api/meddoc' + queryParam);
            }
        };
        return MedDocAPI;
    }
])
.factory('StorageFactory', 
    function (ENV, $log) {
        return {
            set: function (key, data) {
                return window.localStorage.setItem(key, window.JSON.stringify(data));
            },
            get: function (key) {
                return window.JSON.parse(window.localStorage.getItem(key));
            },
            remove: function (key) {
                return window.localStorage.removeItem(key);
            }
        };
    }
);
        //.factory('Orders', function () {
        //    var orders = [{
        //        orderNo: 1,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '百令胶囊',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 2,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '苯磺酸氨氯地平片[活络喜]',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 3,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '碳酸氢钠片',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 4,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '苯溴马隆片',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 5,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '厄贝沙坦片',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 6,
        //        limitationPeriod: '长期',
        //        category: '处方',
        //        way: '口服',
        //        frequency: '每日三次',
        //        content: '复方a-酮酸片[开同]',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 7,
        //        limitationPeriod: '临时',
        //        category: '处方',
        //        way: '取药',
        //        frequency: '执行一次',
        //        content: '氯化钠注射液（玻璃瓶）',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 8,
        //        limitationPeriod: '临时',
        //        category: '处方',
        //        way: '取药',
        //        frequency: '执行一次',
        //        content: '盐酸利多卡注射液',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }, {
        //        orderNo: 9,
        //        limitationPeriod: '临时',
        //        category: '处方',
        //        way: '取药',
        //        frequency: '执行一次',
        //        content: '聚维酮碘溶液',
        //        dosage: '',
        //        description: '',
        //        valuationAttribute: ''
        //    }];

        //    return {
        //        all: function () {
        //            return orders;
        //        },
        //        remove: function (order) {
        //            orders.splice(orders.indexOf(order), 1);
        //        },
        //        get: function (orderId) {
        //            for (var i = 0; i < orders.length; i++) {
        //                if (orders[i].id === parseInt(orderId)) {
        //                    return orders[i];
        //                }
        //            }
        //            return null;
        //        }
        //    };
        //})
        //.factory('Diagnosises', function () {
        //    var diagnosises = [{
        //        type: '门急诊断',
        //        line: '',
        //        name: '高血压病，慢性肾炎',
        //        result: '',
        //        enterDoctor: '',
        //        confirmationDate: '2015-11-20'
        //    }, {
        //        type: '主诊断（出院）',
        //        line: '┌',
        //        name: '高尿酸血症',
        //        result: '',
        //        enterDoctor: '余**',
        //        confirmationDate: '2015-11-21'
        //    }, {
        //        type: '',
        //        line: '│',
        //        name: '高血压2级',
        //        result: '',
        //        enterDoctor: '',
        //        confirmationDate: ''
        //    }, {
        //        type: '',
        //        line: '│',
        //        name: '慢性肾脏病2期',
        //        result: '',
        //        enterDoctor: '',
        //        confirmationDate: '2015-11-20'
        //    }, {
        //        type: '',
        //        line: '│',
        //        name: 'IgA肾病，局灶和节段性肾小球损害',
        //        result: '',
        //        enterDoctor: '',
        //        confirmationDate: ''
        //    }, {
        //        type: '',
        //        line: '└',
        //        name: '慢性肾小球肾炎',
        //        result: '',
        //        enterDoctor: '',
        //        confirmationDate: ''
        //    }];

        //    return {
        //        all: function () {
        //            return diagnosises;
        //        },
        //        remove: function (diagnosis) {
        //            diagnosises.splice(diagnosises.indexOf(diagnosis), 1);
        //        },
        //        get: function (diagnosisId) {
        //            for (var i = 0; i < diagnosises.length; i++) {
        //                if (diagnosises[i].id === parseInt(diagnosisId)) {
        //                    return diagnosises[i];
        //                }
        //            }
        //            return null;
        //        }
        //    };
        //})
        //.factory('Checks', function () {
        //    var checks = [{
        //        id: 1,
        //        type: 'CT',
        //        time: '2015-07-01',
        //        name: 'CT上腹部平扫+三维重建',
        //        status: '已完成',
        //        result: '阳',
        //        checkVisible: '肝脏外形大小正常范围，包膜光整，肝实质回声分布均匀，血管网显示清晰，未见明显占位，左右肝内胆管未见明显扩张。 胆囊形态大小正常，囊壁光整，无增厚，腔内胆汁透声佳，囊内未见异常回声。胆总管内径未见明显增宽，所见段腔内未见明显异常。 脾形态大小正常，脾内回声均匀细小。 胰腺外形大小未见明显异常，内部回声均匀，主胰管未见明显扩张，未见明显占位灶。',
        //        checkDiagnosis: '肝胆脾胰超声未见明显异常'
        //    }, {
        //        id: 2,
        //        type: 'CT',
        //        time: '2015-07-01',
        //        name: 'CT盆腔平扫+三维重建',
        //        status: '已完成',
        //        result: '好',
        //        checkVisible: '两侧胸廓对称，气管居中。 右侧肺尖区见结节样密度增高影，边缘尚清楚。余肺野内未见明显异常密度灶。 两肺门外形、位置无殊。 心、大血管影轮廓、大小和位置在正常范围以内。 两膈面光整，肋膈角锐利。 ',
        //        checkDiagnosis: '右侧肺尖结节，请CT进一步检查。'
        //    }, {
        //        id: 3,
        //        type: 'B超',
        //        time: '2015-07-04',
        //        name: '腹部B超',
        //        status: '已付费',
        //        result: '',
        //        checkVisible: '双肾轮廓清，左侧大小约10.5*5.3cm，右侧大小约9.1*4.3cm，包膜光整，皮质回声稍增强，双肾内均可见多枚囊性暗区，界清，形态规则，内透声佳，左侧其一大小约0.8cm，右侧其一大小约0.8cm，余实质回声稍增强，分布均匀，集合系统未见明显分离，其内未见明显强回声光斑。 双侧输尿管未见明显扩张。 膀胱充盈欠佳，显示部分未见明显异常回声团。',
        //        checkDiagnosis: '双肾皮质回声稍增强伴多发囊肿'
        //    }, {
        //        id: 4,
        //        type: 'B超',
        //        time: '2015-07-06',
        //        name: '甲状腺B超',
        //        status: '申请中',
        //        result: '',
        //        checkVisible: '甲状腺右叶大小约4.50*1.43*1.86cm，左叶大小约4.36*1.22*1.82cm，峡部厚约0.35cm，双侧侧均可见数枚低回声结节，界清，形态规则，未见明显血流信号，较大一枚均位于中下极，左侧大小约0.25*0.21cm，右侧大小约0.80*0.52cm。 ',
        //        checkDiagnosis: '甲状腺双侧叶多发结节，考虑结节性甲状腺肿 '
        //    }];

        //    return {
        //        all: function () {
        //            return checks;
        //        },
        //        remove: function (check) {
        //            checks.splice(checks.indexOf(check), 1);
        //        },
        //        get: function (checkId) {
        //            for (var i = 0; i < checks.length; i++) {
        //                if (checks[i].id === parseInt(checkId)) {
        //                    return checks[i];
        //                }
        //            }
        //            return null;
        //        }
        //    };
        //})
        //.factory('Tests', function () {
        //    var tests = [{
        //        id: 1,
        //        type: 'FLU',
        //        time: '2015-07-01',
        //        name: '体液检验',
        //        status: '已完成',
        //        specimen: '尿液',
        //        dept: '检验科',
        //        doctor: '李医生',
        //        results: [{
        //            name: '浊度',
        //            result: '清澄',
        //            normal: '',
        //            referenceValue: '',
        //            unit: ''
        //        }, {
        //            name: '尿比重',
        //            result: '1.005',
        //            normal: '↓',
        //            referenceValue: '1.010-1.025',
        //            unit: ''
        //        }, {
        //            name: '尿酸碱度',
        //            result: '5',
        //            normal: '',
        //            referenceValue: '4.6-8.0',
        //            unit: ''
        //        }, {
        //            name: '上皮细胞',
        //            result: '3-6',
        //            normal: '',
        //            referenceValue: '',
        //            unit: '/HPF'
        //        }]
        //    }, {
        //        id: 2,
        //        type: 'HEM',
        //        time: '2015-07-01',
        //        name: '血液学检验',
        //        status: '已完成',
        //        specimen: '血液',
        //        dept: '检验科',
        //        doctor: '张医生',
        //        results: [{
        //            name: 'ABO血型鉴定',
        //            result: 'B型',
        //            normal: '',
        //            referenceValue: '',
        //            unit: ''
        //        }, {
        //            name: 'RhD血型鉴定',
        //            result: '阳性',
        //            normal: '',
        //            referenceValue: '',
        //            unit: ''
        //        }]
        //    }, {
        //        id: 3,
        //        type: 'END',
        //        time: '2015-07-04',
        //        name: '内分泌科检查',
        //        status: '已付费',
        //        specimen: '',
        //        dept: '检验科',
        //        doctor: '李医生',
        //        results: []
        //    }, {
        //        id: 4,
        //        type: 'EMR',
        //        time: '2015-07-06',
        //        name: '甲状腺B超急诊和夜间病房检验',
        //        status: '申请中',
        //        specimen: '体液',
        //        dept: '检验科',
        //        doctor: '王医生',
        //        results: []
        //    }];

        //    return {
        //        all: function () {
        //            return tests;
        //        },
        //        remove: function (test) {
        //            tests.splice(tests.indexOf(test), 1);
        //        },
        //        get: function (testId) {
        //            for (var i = 0; i < tests.length; i++) {
        //                if (tests[i].id === parseInt(testId)) {
        //                    return tests[i];
        //                }
        //            }
        //            return null;
        //        }
        //    };
        //});
