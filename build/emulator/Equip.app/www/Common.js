function getApplications(callback, callbackObject){
//	var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_SMP_SRV/ETS_APP?sap-client=110";
	var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_SMP_SRV/ETS_APP";
	if(!this.busyIndicator){
		this.busyIndicator = new sap.m.BusyDialog()
	}
	var modal = this;
	modal.busyIndicator.open();
	var oHeaders = {};
	oHeaders['Authorization'] = authStr;
	var request = {
			headers: oHeaders,
			requestUri: url,
			method: "GET",
	};
	OData.read(request,
			function(oData, response){
		modal.busyIndicator.close();
		var data = {};
		if(oData)
			data = oData.results;
		callback.call(callbackObject,data);
	},
	function(e){
		modal.busyIndicator.close();
//		console.log("An error occurred " + JSON.stringify(e));
	}
	);
}

//function getApplications(callback, callbackObject){
//    var data = [{
//                    "IvUname": "",
//                    "Mandt": "110",
//                    "Applext": "cleaning",
//                    "Text": "Cleaning",
//                    "Icon": "notification",
//                    "Dynamic": "",
//                    "Url": ""
//                    }, {
//                    
//                    "IvUname": "",
//                    "Mandt": "110",
//                    "Applext": "jobCard",
//                    "Text": "Job Card",
//                    "Icon": "inspection",
//                    "Dynamic": "X",
//                    "Url": "ZGWP_PM_JOB_CARD_TMP_SRV/ETS_COUNT('')"
//                    }, {
//                    
//                    "IvUname": "",
//                    "Mandt": "110",
//                    "Applext": "mfs",
//                    "Text": "MFS",
//                    "Icon": "notification",
//                    "Dynamic": "",
//                    "Url": ""
//                    }, {
//                    
//                    "IvUname": "",
//                    "Mandt": "110",
//                    "Applext": "myWorkList",
//                    "Text": "My Work List",
//                    "Icon": "create-entry-time",
//                    "Dynamic": "X",
//                    "Url": "ZGWP_PM_TIME_EN/ETS_COUNT(icon='X')"
//                    }, {
//                    
//                    "IvUname": "",
//                    "Mandt": "110",
//                    "Applext": "wcm",
//                    "Text": "WCM",
//                    "Icon": "create-entry-time",
//                    "Dynamic": "",
//                    "Url": ""
//                    }]
//    callback.call(callbackObject,data);
//}

function getApplications_Back(data, callback, callbackObject){
	callback.call(callbackObject,data);
}

function getDynamicCount(url){
	if(!this.busyIndicator){
		this.busyIndicator = new sap.m.BusyDialog()
	}
	var modal = this;
	var count;
	modal.busyIndicator.open();
	var jsonModel = new sap.ui.model.json.JSONModel();
	var urlPartIndex = url.lastIndexOf("/");
	var metaUrl = url.substring(0,urlPartIndex);
	var countUrl = url.substring(urlPartIndex , url.length)
	var oModel = new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL+"/"+metaUrl, true);
//	oModel.read(countUrl+"?sap-client=110",null, null, false,
	oModel.read(countUrl,null, null, false,
			function (oData, response) {
		modal.busyIndicator.close();
		count = oData.number;
	},
	function (oError) {
		modal.busyIndicator.close();
		count = 0;
	}
	);
	return count;
}