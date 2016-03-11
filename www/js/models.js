var User = function () {
    this.Name = '';//中文名
    this.Password = '';
    this.UserName = ''; //账号
};
//床卡用的病人信息
var PatientInfo = function () {
    this.PatientID = "";//病人ID号
    this.BedNo = "";//床卡
    this.VisitID=""//就诊次
    this.Name = "";//姓名
    this.GenderName = "";//性别
    this.VisitTime = "";//入院时间
    this.Age = "";//年龄
    this.Allergy = "";//过敏史
    this.DoctorInCharge = "";//责任医生
    this.HospitalInDays = "";//在院时间
    this.Diagnosis = "";//诊断
    this.Condition = "";//病情
};