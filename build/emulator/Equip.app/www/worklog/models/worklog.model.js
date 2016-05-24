jQuery.sap.require(sap.m.MessageBox);
function  currentWorkList(callback, callbackObject){
//	var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_TIME_ENTRY_CNF_SRV/ETS_WO_LIST_TIME_ENTRY?sap-client=110";
    var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_TIME_ENTRY_CNF_SRV/ETS_WO_LIST_TIME_ENTRY";
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
	    method: "GET"
	};
	OData.read(request,
	             function(oData, response){
	                modal.busyIndicator.close();
	                callback.call(callbackObject,oData);
	             },
	             function(e){
	                modal.busyIndicator.close();
	                //console.log("An error occurred " + JSON.stringify(e));
	             }
	             );
		
}

//Post call to the backend
function submitWorkLog(data,controller,length){
	if(!this.busyIndicator){
		this.busyIndicator = new sap.m.BusyDialog()
	}
	var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_TIME_ENTRY_CNF_SRV";
	var modal = this;
   //var oModel =  new sap.ui.model.odata.ODataModel(sUrl, true) ;
	var oModel =  new sap.ui.model.odata.ODataModel(url, true) ;
    var rModel = new sap.ui.model.json.JSONModel();
    modal.busyIndicator.open();
    oModel.refreshSecurityToken(
    		function(a, b) {
    			oModel.oHeaders = {
                       "Content-Type" : "application/json; charset=utf-8"
                            
    			};
//		     oModel.create('/ETS_WO_LIST_TIME_ENTRY?sap-client=110',data,{
		     oModel.create('/ETS_WO_LIST_TIME_ENTRY',data,{
		               success : function(data, response){
		            	   	  modal.busyIndicator.close();
		                      //console.log(response);
		                      var message = data.Zzmessage;
		                      var type = data.ZzmsgType;
		                      var woNum = data.ZzwoNo;
		                      
		                      rModel.setData(data);
		                      var results = rModel.getData();
		      				
		                      controller.setArrayValues(results,length); 
		              		
		               },
		               error : function(error){
		            	   modal.busyIndicator.close();
		                      sap.m.MessageBox.show("Submission failed !..",sap.m.MessageBox.Icon.ERROR,"ERROR", sap.m.MessageBox.Action.OK, null );
		               }
		        });
        }, function(a) {
               successFaultCallBack.apply(context,[a, true]);
			}, true);
     
    return rModel;
     
}
