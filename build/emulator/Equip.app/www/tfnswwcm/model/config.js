jQuery.sap.declare("model.Config");

model.Config = {};

var serviceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WHEEL_MONITORING_SRV";

model.Config.getServiceUrl = function () {
    if(serviceUrl !== ""){
        return serviceUrl;
    }else{
        return "/sap/opu/odata/sap/ZGWP_PM_WHEEL_MONITORING_SRV";
    }
};

model.Config.getWorkOrders = function () {
	
	return "/ETS_WORK_ORDERS";

};


model.Config.getWODetailPath = function (workOrder) {
	
	return "/ETS_WHEEL_DETAILS?$filter=WorkOrder eq '"+workOrder+"'";

};

model.Config.getDefectClass = function ( ) {
	
	return "/ETS_VALUE_HELP?$filter=DefectClass eq 'X'";

};
model.Config.getDefectType = function ( ) {
	
	return "/ETS_VALUE_HELP?$filter=DefectType  eq 'X'";

};
model.Config.postDefects = function ( ) {
	
	return "/ETS_DEFECT";

};
model.Config.postWheelMeasurement = function ( ) {
	
	return "/ETS_WHEEL_DETAILS";

};
model.Config.getHost = function () {
	
	return "";

};
