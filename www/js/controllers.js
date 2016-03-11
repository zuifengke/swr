/// <reference path="services.js" />
/// <reference path="models.js" />
angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope) { })
//.controller('OACtrl', function ($scope) { })
.controller('RoundsCtrl', function ($scope) { })
.controller('SearchCtrl', function ($scope) { })
.controller('MeCtrl', function ($scope) { })
.controller('RoundsCtrl', function (ENV,$scope, $state, $rootScope, BedcardFactory, StorageFactory, Loader) {

    $scope.patientList = new Array();
    $scope.PageCount = 0;
    var user = StorageFactory.get('user');
    if (user == 'undefined')
        $state.go('login');
    var dcode = user.UserName;
    if (ENV.debug)
        dcode = '10087';
    $scope.getMyBedcards = function () {
        console.log("点击按钮");
        Loader.showLoading('获取床卡病人，请稍候...');
       
       
        BedcardFactory.getMyBedcards(dcode).success(function (data) {
            Loader.hideLoading();
            if (data == null) {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage("床卡病人为空");
                return;
            }
            console.log("床卡病人数" + data.PageCount);
            if (data.length > 0)
            {
                $scope.patientList = [];
                data.forEach(function (item) {
                    var patientInfo = new PatientInfo();
                    patientInfo.PatientID = item.Id;
                    patientInfo.Name = item.Name;
                    patientInfo.GenderName = item.Gender.Name;
                    patientInfo.Age = item.Age;
                    patientInfo.Allergy = item.Allergy;

                    $scope.patientList.push(patientInfo);
                });
            }
            $scope.PageCount = data.length;
        }).error(function (err, statusCode) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(err);
        });
    };
    //默认调用个人床卡病人
    $scope.getMyBedcards(dcode);

    $scope.getRoundsInfos = function (patientId) {
        for (var i = 0; i < $scope.patientList.length; i++) {
            if ($scope.patientList[i].PatientID == patientId) {
                $rootScope.currentPatient = $scope.patientList[i];
                break;
            }
        }
        $state.go("tab.func.diagnosis");
    }
})

//.controller('ChatsCtrl', function($scope, Chats) {
//  $scope.chats = Chats.all();
//  $scope.remove = function(chat) {
//    Chats.remove(chat);
//  }
//})

.controller('LoginCtrl', function (ENV,$scope, $stateParams, Chats, $state, UserFactory, StorageFactory, Loader) {
    console.log("登录");
    var storageKey = "user";
    $scope.user = StorageFactory.get(storageKey) || new User();
    $scope.login = function () {
        console.log("点击按钮");
        Loader.showLoading('登陆中，请稍候...');
        UserFactory.login($scope.user).success(function (data) {
            Loader.hideLoading();
            if (data == null)
            {
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage("用户名或密码错误");
                return;
            }
            //缓存用户信息
            StorageFactory.set(storageKey, data);
            $state.go("tab.home");
        }).error(function (err, statusCode) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(err);
        });
        
    }
    $scope.cancle = function () {
        console.log("点击取消按钮");
        StorageFactory.remove(storageKey);
        $scope.user = new User();
    }
})/*;
//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})

//.controller('AccountCtrl', function($scope) {
//  $scope.settings = {
//    enableFriends: true
//  };
//});

angular.module('starter.controllers', [])*/
.controller('RoundsFuncCtrl', function ($scope, $state) {
    $scope.goBack = function () {
        $state.go("tab.rounds");
    }
})

.controller('DiagnosisCtrl', function ($scope, $rootScope, $state, /*Diagnosises, */DiagnosisFactory, Loader) {
    //$scope.diagnosises = Diagnosises.all();
    //$scope.remove = function (diagnosis) {
    //    Diagnosises.remove(diagnosis);
    //}
    if (!$rootScope.currentPatient) {
        $state.go("tab.rounds");
        return;
    }
    Loader.showLoading('加载中，请稍候...');
    DiagnosisFactory.getDiagnosises($rootScope.currentPatient.PatientID, 17).success(function (data) {
        if (data != null && data.length > 0) {
            var sb = new StringBuffer();
            //将获取的数据重新拼接（Json）
            sb.append("[");
            for (var i = 0; i < data.length; i++) {
                var itemCount = data[i].Items.length;
                if (itemCount > 0) {
                    for (var j = 0; j < itemCount; j++) {
                        var result;
                        var time = GetDateStr(data[i].Items[j].EnterDateTime);
                        if (j == 0) {
                            result = "{Type:'" + data[i].Category.Name + "',EnterDoctor:'" + data[i].EnterDoctor.Name + "',ConfirmationDate:'" + time + "'";
                            if (itemCount > 1) {
                                result += ",Line:'┌'";
                            } else {
                                result += ",Line:''";
                            }
                        } else {
                            result = "{Type:'',EnterDoctor:'',ConfirmationDate:''";
                            if (j == itemCount - 1) {
                                result += ",Line:'└'";
                            } else {
                                result += ",Line:'│'";
                            }
                        }
                        result += ",Name:'" + data[i].Items[j].Name + "',Result:'" + "" + "'}";
                        sb.append(result);
                        if (j != data[i].Items.length - 1) { sb.append(","); }
                    }
                }
                //表示是最后一个
                if (i != data.length - 1) { sb.append(","); }
            }
            sb.append("]");

            $scope.diagnosises = eval(sb.toString());
            Loader.hideLoading();
        } else {
            Loader.hideLoading();
        }
    }).error(function (err, statusCode) {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err);
    });
})

.controller('OrderCtrl', function ($scope, $rootScope, $state, /*Orders, */OrderFactory, Loader) {
    //$scope.orders = Orders.all();
    //$scope.remove = function (order) {
    //    Orders.remove(order);
    //}
    if (!$rootScope.currentPatient) {
        $state.go("tab.bedcard");
        return;
    }
    var jsonAll = "";
    var jsonLong = "";
    var jsonTemp = "";

    //function CreateGridTable(data) {
    //    //切换长期、临时医嘱时重新设置序号
    //    var dataSource = eval(data);
    //    var orderNo = 0;
    //    if (dataSource.length > 0) {
    //        for (var i = 0; i < dataSource.length; i++) {
    //            if (dataSource[i].OrderNo != "") {
    //                orderNo++;
    //                dataSource[i].OrderNo = orderNo;
    //            }
    //        }
    //    }
    //    var newData = JSON.stringify(dataSource);
    //    var columns = ["序号_OrderNo", "医嘱号_Id", "长临_LimitationPeriod", "类别_Category", "途径_Way", "频次_Frequency", "_Line", "医嘱内容_OrderContent", "剂量单位_Dosage", "医生说明_Description", "计价属性_ValuationAttribute"];// "开始时间_StartTime",
    //    var columnWidths = ["40", "100", "60", "80", "70", "80", "20", "AUTO", "80", "100", "80"];// "100",
    //    var columnsVisibility = [true, false, true, true, true, true, true, true, true, true, true];// true,
    //    var myGridTableControl = new GridTableControl("orderTable", "Class", newData, columns, columnWidths, columnsVisibility);
    //    var dd = {
    //        click: function () {
    //            clickCallBack(this);
    //        }
    //    }
    //    myGridTableControl.DataBinding(dd);
    //    var gridHeight = document.documentElement.clientHeight - $(".divOrdersTop").height() - $(".divContextInfoFull").height() - 140;
    //    $("#box").height(gridHeight);
    //}

    Loader.showLoading('加载中，请稍候...');
    OrderFactory.getOrders($rootScope.currentPatient.PatientID, 17).success(function (data) {
        if (data != null && data.length > 0) {
            var sb = new StringBuffer();
            //将获取的数据进行拼接Json
            sb.append("[");
            jsonLong = "[";
            jsonTemp = "[";
            for (var i = 0; i < data.length; i++) {
                var itemCount = data[i].Items.length;
                if (itemCount > 0) {
                    for (var j = 0; j < itemCount; j++) {
                        var result;
                        //var startTime = GetDate(data[i].EnterDateTime).Format("yyyy-MM-dd");
                        var startTime = GetDateStr(data[i].EnterDateTime);
                        if (j == 0) {
                            var indicator = data[i].Indicator == null ? "" : data[i].Indicator.Name;
                            var category = data[i].Category == null ? "" : data[i].Category.Name;
                            var way = data[i].Administration == null ? "" : data[i].Administration.Name;
                            var frequency = data[i].Frequency == null ? "" : data[i].Frequency.Name;
                            var chargeCategory = data[i].ChargeCategory == null ? "" : data[i].ChargeCategory.Name;
                            result = "{OrderNo:'" + (i + 1) + "',LimitationPeriod:'" + indicator + "',Category:'" + category + "',Way:'" + way + "',Frequency:'" + frequency + "',StartTime:'" + startTime + "',Description:'" + data[i].Description + "',ValuationAttribute:'" + chargeCategory + "'";
                            if (itemCount > 1) {
                                result += ",Line:'┌'";
                            } else {
                                result += ",Line:''";
                            }
                        } else {
                            result = "{OrderNo:'',LimitationPeriod:'',Category:'',Way:'',Frequency:'',StartTime:'',Description:'',ValuationAttribute:''";
                            if (j == itemCount - 1) {
                                result += ",Line:'└'";
                            } else {
                                result += ",Line:'│'";
                            }
                        }
                        result += ",Id:'" + data[i].NO + "',OrderContent:'" + data[i].Items[j].Name + "',Dosage:'" + data[i].Items[j].Dosage + "'}";
                        sb.append(result);
                        if (data[i].Indicator) {
                            switch (data[i].Indicator.Code) {
                                case "R": //长期
                                    jsonLong += result;
                                    break;
                                case "S": //临时
                                    jsonTemp += result;
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (j != data[i].Items.length - 1) {
                            sb.append(",");
                            if (data[i].Indicator) {
                                switch (data[i].Indicator.Code) {
                                    case "R": //长期
                                        jsonLong += ",";
                                        break;
                                    case "S": //临时
                                        jsonTemp += ",";
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
                //表示是最后一个
                if (i != data.length - 1) {
                    sb.append(",");
                    if (data[i].Indicator) {
                        switch (data[i].Indicator.Code) {
                            case "R": //长期
                                jsonLong += ",";
                                break;
                            case "S": //临时
                                jsonTemp += ",";
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            sb.append("]");
            jsonLong += "]";
            jsonTemp += "]";
            if (jsonLong.indexOf("'},]") >= 0) {
                jsonLong = jsonLong.substr(0, jsonLong.length - 2) + "]";
            }
            if (jsonTemp.indexOf("'},]") >= 0) {
                jsonTemp = jsonTemp.substr(0, jsonTemp.length - 2) + "]";
            }
            jsonAll = sb.toString();
            //CreateGridTable(jsonAll);
            $scope.orders = eval(jsonAll);
            Loader.hideLoading();
        } else {
            Loader.hideLoading();
        }
    }).error(function (err, statusCode) {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err);
    });
})

.controller('CheckCtrl', function ($scope, $rootScope, $state, /*Checks, */CheckFactory, Loader) {
    //$scope.checks = Checks.all();
    //$scope.currentCheck = $scope.checks.length > 0 ? $scope.checks[0] : null;
    //$scope.remove = function (check) {
    //    Checks.remove(check);
    //}
    if (!$rootScope.currentPatient) {
        $state.go("tab.bedcard");
        return;
    }
    $scope.currentCheckReport = {
        type: '',
        result: '',
        findings: '',
        diagnosis: '',
        time: ''
    };

    $('#checkScroll').height(document.documentElement.clientHeight - 200);
    Loader.showLoading('加载中，请稍候...');
    CheckFactory.getCheckList($rootScope.currentPatient.PatientID, 17).success(function (data) {
        if (data != null && data.length > 0) {
            var sb = new StringBuffer();
            //将获取的数据重新拼接（Json）
            sb.append("[");
            for (var i = 0; i < data.length; i++) {
                if (data[i].Status.Name == "") {
                    data[i].Status.Name = "未知";
                }
                var content = "";
                if (data[0].Items.length > 0) {
                    content = subString(data[i].Items[0].Name, 20, true);
                }
                var result = "{Id:'" + data[i].NO + "',TypeCode:'" + data[i].Category.Code + "',TypeName:'" + data[i].Category.Name + "',Time:'" + GetDateStr(data[i].EnterDateTime) + "',Content:'" + content + "',Status:'" + data[i].Status.Name + "'}";
                //表示是最后一个
                if (i != data.length - 1) { result += ","; }
                sb.append(result);
            }
            sb.append("]");
            $scope.checks = eval(sb.toString());
            Loader.hideLoading();
            if ($scope.checks != null && $scope.checks.length > 0) {
                $scope.checkClick($scope.checks[0].Id, $scope.checks[0].TypeName);
            }
        } else {
            Loader.hideLoading();
        }
    }).error(function (err, statusCode) {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err);
    });
    $scope.checkClick = function (checkId, typeName) {
        //CheckFactory.getCheckDetail(checkId).success(function (data) {
        //    if (data != null) {
        //        //-------------------------------申请单详细信息-------------------------------
        //        var sb = new StringBuffer();
        //        //流水单号
        //        var checkNo = data.NO;
        //        //开单时间
        //        var applyTime = GetDateTimeStr(data.EnterDateTime);
        //        //检查类型
        //        var checkType = data.Category.Name;
        //        //开单科室
        //        var applyDept = data.EnterDept.Name;
        //        //检查科室
        //        var checkDept = "";
        //        if (data.ExecuteDept != null) {
        //            checkDept = data.ExecuteDept.Name;
        //        }
        //        //开单医生
        //        var applyDoctor = data.EnterDoctor.Name
        //        //检查状态
        //        var checkstatus = data.Status.Name;
        //        //检查项目
        //        var checkItems = "";

        //        if (data.Items.length > 0) {
        //            var sbItems = new StringBuffer();
        //            for (var i = 0; i < data.Items.length; i++) {
        //                if (i == data.Items.length - 1) {
        //                    sbItems.append(data.Items[i].Name);
        //                }
        //                else {
        //                    sbItems.append(data.Items[i].Name + "；");
        //                }
        //            }
        //            checkItems = sbItems.toString();
        //        }

        //        sb.append("<div style='margin-top: 20px; margin-left: 20px; width: " + ($(".checkinformation").width() - 40) + "px;'>");
        //        sb.append("<table style='border-style: none; text-align: left; width: 100%;'>");
        //        sb.append("<tr><td style='width: 30%;'>流水单号：" + checkNo + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 25%;'>开单科室：" + applyDept + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 20%;'>开单医生：" + applyDoctor + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 25%;'>开单时间：" + applyTime + "</td></tr>");
        //        sb.append("<tr><td style='width: 30%;'>检查类型：" + checkType + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 25%;'>检查科室：" + checkDept + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 20%;'>检查状态：" + checkstatus + "</td>");
        //        sb.append("<td style='padding-left: 15px; width: 25%;'></td></tr>");
        //        sb.append("<tr><td colspan='4'>检查项目：" + checkItems + "</td>");
        //        $("#checkinformation").html(sb.toString());
        //    }
        //});
        Loader.showLoading('加载中，请稍候...');
        CheckFactory.getCheckReport(checkId).success(function (data) {
            if (data != null) {
                //检查报告单
                var type = "检查报告单";
                var categoryName = typeName;
                if (categoryName) {
                    if (categoryName.indexOf("申请单") == categoryName.length - 3) {
                        type = categoryName.replace("申请单", "报告单");
                    } else if (categoryName.indexOf("申请") == categoryName.length - 2) {
                        type = categoryName.replace("申请", "报告单");
                    } else {
                        type = categoryName + "报告单";
                    }
                }
                //结果
                var result = "";
                //报告时间
                var date = "";
                //报告医生
                var doctor = "";
                //检查所见
                var findings = "";
                //检查诊断
                var diagnosis = "";
                result = data.Result;
                date = GetDateStr(data.DateTime);
                doctor = data.Reporter.Name
                findings = data.Content;
                diagnosis = data.Diagnosis;

                $scope.currentCheckReport.type = type;
                $scope.currentCheckReport.result = result;
                $scope.currentCheckReport.findings = findings;
                $scope.currentCheckReport.diagnosis = diagnosis;
                $scope.currentCheckReport.time = date;
                Loader.hideLoading();
            } else {
                $scope.currentCheckReport.type = '';
                $scope.currentCheckReport.result = '';
                $scope.currentCheckReport.findings = '';
                $scope.currentCheckReport.diagnosis = '';
                $scope.currentCheckReport.time = '';
                Loader.hideLoading();
            }
        }).error(function (err, statusCode) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(err);
        });

        //$scope.currentCheck = Checks.get(checkId);
        //$(this).addClass('activated');
    }
})

.controller('TestCtrl', function ($scope, $rootScope, $state,/* Tests,*/ TestFactory, Loader) {
    //$scope.tests = Tests.all();
    //$scope.currentTest = $scope.tests.length > 0 ? $scope.tests[0] : null;
    //$scope.remove = function (test) {
    //    Tests.remove(test);
    //}
    if (!$rootScope.currentPatient) {
        $state.go("tab.bedcard");
        return;
    }
    $scope.currentTest = {
        testNo: '',
        applyDept: '',
        applyDoctor: '',
        applyTime: '',
        type: '',
        testDept: '',
        status: '',
        itemName: [],
        specimen: []
    }

    var contentHeight = document.documentElement.clientHeight - 200;
    $('#testScroll').height(contentHeight);
    Loader.showLoading('加载中，请稍候...');
    TestFactory.getTestList($rootScope.currentPatient.PatientID, 17).success(function (data) {
        if (data != null && data.length > 0) {
            var sb = new StringBuffer();
            //将获取的数据重新拼接（Json）
            sb.append("[");
            for (var i = 0; i < data.length; i++) {
                if (data[i].Status.Name == "") {
                    data[i].Status.Name = "未知";
                }
                var result = "{Id:'" + data[i].NO + "',TypeCode:'" + data[i].Category.Code + "',Time:'" + GetDateStr(data[i].EnterDateTime) + "',Content:'" + subString(data[i].Category.Name, 20, true) + "',Status:'" + data[i].Status.Name + "'}";
                //表示是最后一个
                if (i != data.length - 1) { result += ","; }
                sb.append(result);
            }
            sb.append("]");
            $scope.tests = eval(sb.toString());
            Loader.hideLoading();
            if ($scope.tests != null && $scope.tests.length > 0) {
                $scope.testClick($scope.tests[0].Id);
            }
        } else {
            Loader.hideLoading();
        }
    }).error(function (err, statusCode) {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err);
    });
    $scope.testClick = function (testId) {
        $('#testResultScroll').css('max-height', contentHeight - $('#testRow1').height() - $('#testRow2').height() - $('#testRow3').height() - 30);
        Loader.showLoading('加载中，请稍候...');
        TestFactory.getTestDetail(testId).success(function (data) {
            if (data != null) {
                //检验科室
                var testDept = "";
                if (data.ExecuteDept != null) {
                    testDept = data.ExecuteDept.Name;
                }

                //流水单号
                $scope.currentTest.testNo = data.NO,
                //开单科室
                $scope.currentTest.applyDept = data.EnterDept.Name,
                //开单医生
                $scope.currentTest.applyDoctor = data.EnterDoctor.Name,
                //开单时间
                $scope.currentTest.applyTime = GetDateTimeStr(data.EnterDateTime),
                //检验类型
                $scope.currentTest.type = data.Category.Name,
                //检验科室
                $scope.currentTest.testDept = testDept,
                //检验状态
                $scope.currentTest.status = data.Status.Name;
                $scope.currentTest.itemName = [];
                $scope.currentTest.specimen = [];

                for (var i = 0; i < data.Items.length; i++) {
                    $scope.currentTest.itemName.push(data.Items[i].Name);
                    if (data.Items[i].Specimen != null) {
                        $scope.currentTest.specimen.push(data.Items[i].Specimen.Name == null ? "" : data.Items[i].Specimen.Name);
                    }
                }

                TestFactory.getTestReport($scope.currentTest.testNo).success(function (result) {
                    if (result != null) {
                        var items = new Array();
                        for (var i = 0; i < data.Items.length; i++) {
                            if (result[data.Items[i].Code]) {
                                items.push(data.Items[i]);
                            }
                        }
                        //创建选项卡
                        if (items.length > 0) {
                            $scope.currentTest.results = result[items[0].Code];
                        } else {
                            //CreateTabAndResultTableIfNoResult();
                        }
                        Loader.hideLoading();
                    } else {
                        $scope.currentTest.results = [];
                        Loader.hideLoading();
                    }
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err);
                });
            } else {
                $scope.currentTest.testNo = '',
                $scope.currentTest.applyDept = '',
                $scope.currentTest.applyDoctor = '',
                $scope.currentTest.applyTime = '',
                $scope.currentTest.type = '',
                $scope.currentTest.testDept = '',
                $scope.currentTest.status = '';
                $scope.currentTest.itemName = [];
                $scope.currentTest.specimen = [];
                $scope.currentTest.results = [];
                Loader.hideLoading();
            }
        }).error(function (err, statusCode) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(err);
        });

        //$scope.currentTest = Tests.get(testId);
        //$(this).addClass("activated");
    }
})

.controller('MedDocCtrl', function ($scope, $rootScope, $state, MedDocFactory, Loader) {
    if (!$rootScope.currentPatient) {
        $state.go("tab.bedcard");
        return;
    }

    var contentHeight = document.documentElement.clientHeight - 200;
    $('#medDocScroll').height(contentHeight);
    $("#meddoc").height(contentHeight + 10);
    Loader.showLoading('加载中，请稍候...');
    MedDocFactory.getMedDocList($rootScope.currentPatient.PatientID, 17).success(function (data) {
        if (data != null && data.length > 0) {
            var sb = new StringBuffer();
            //将获取的数据重新拼接（Json）
            sb.append("[");
            for (var i = 0; i < data.length; i++) {
                var time = data[i].modifyTimeField ? GetDateStr(data[i].modifyTimeField) : GetDateStr(data[i].docTimeField);
                var result = "{Id:'" + data[i].docIDField + "',Name:'" + data[i].creatorNameField + "',Time:'" + time + "',Content:'" + subString(data[i].docTitleField, 20, true) + "'}";
                //表示是最后一个
                if (i != data.length - 1) { result += ","; }
                sb.append(result);
            }
            sb.append("]");
            $scope.medDocs = eval(sb.toString());
            Loader.hideLoading();
            if ($scope.medDocs != null && $scope.medDocs.length > 0) {
                $scope.medDocClick($scope.medDocs[0].Id);
            }
        } else {
            Loader.hideLoading();
        }
    }).error(function (err, statusCode) {
        Loader.hideLoading();
        Loader.toggleLoadingWithMessage(err);
    });
    $scope.medDocClick = function (medDocId) {
        Loader.showLoading('加载中，请稍候...');
        MedDocFactory.getMedDocUrl($rootScope.currentPatient.PatientID, 17, medDocId).success(function (data) {
            if (data != null) {
                $("#meddoc").attr("src", data);
                Loader.hideLoading();
            } else {
                Loader.hideLoading();
            }
        }).error(function (err, statusCode) {
            Loader.hideLoading();
            Loader.toggleLoadingWithMessage(err);
        });
    }
});
