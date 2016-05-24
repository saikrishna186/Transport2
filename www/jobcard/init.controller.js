sap.ui.controller("tfnswjobcard.init", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnswjobcard.init
*/
	onInit: function() {


		this.serverPath = "http://tdylap01.transport.nsw.gov.au:8100/sap/opu/odata/sap/ZGWP_PM_JOB_CARD_TMP_SRV/";
		this.userName = "arorah";
		this.password = "Allmighty1";
        this.busyIndicator = new sap.m.BusyDialog();
  
	      

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnswjobcard.init
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnswjobcard.init
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnswjobcard.init
*/
//	onExit: function() {
//
//	}

	handleNavigation : function(evt){


		var initial = evt.getParameters().firstTime;
		var destination = evt.getParameters().to;
		var destinationId = evt.getParameters().toId;
		var app = this.getView().app;
		var fromId = evt.getParameters().fromId
		
		switch(destinationId){
		
		case "empty" : {
			//app.showMaster();
			break;
		}

			case "jobDetails" : {
				destination.table.setBusy(false);
				destination.controller.bindActionPopup()
				break;
			}
//			case "measurementPoints" : {
//				if(!initial)
//					{
//					destination.getContent()[0].destroyContent();
//					}
//				destination.oController.getMeasurementData();
//				
//				break;
//			}
			
		}
	},

	getData : function(servicePath,params,controller,callback){
									//var url = "https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap/ZGWP_PM_JOB_CARD_TMP_SRV" + servicePath;
		var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV" + servicePath;
		var appController = this;
		var oHeaders = {};
		oHeaders['Authorization'] = authStr;
		var request = {
						headers: oHeaders,
						requestUri: url,
						method: "GET",
		};
		OData.read(request,
				function(data, response){
							 callback.call(controller,data,params);
				},
				function(e){
				}
		);
		
	},
	
	postBatchData: function(servicePathInput,servicePathOutput,payLoad,controller,callback){
				var modal = this;
	      var oModelJson= new sap.ui.model.json.JSONModel();
	      oModelJson.setSizeLimit(500);
									//jQuery.sap.require(sap.m.MessageBox);
	      var oModel = new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV", true);
									//var oModel = new sap.ui.model.odata.ODataModel("https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap" + "/ZGWP_PM_JOB_CARD_TMP_SRV", true);

				var batchChanges = [];
				modal.busyIndicator.open();
				oModel.refreshSecurityToken(
					function(a, b) {
						oModel.oHeaders = {
									//"x-csrf-token" : b.headers["x-csrf-token"],
									"Content-Type" : "application/json; charset=utf-8",
						};

						batchChanges.push( oModel.createBatchOperation(servicePathInput, "POST", payLoad) );
						oModel.addBatchChangeOperations(batchChanges);
						var batchRead = [];
						batchRead.push( oModel.createBatchOperation(servicePathOutput, "GET", "") );
						oModel.addBatchReadOperations(batchRead);
						oModel.submitBatch(function(data) {
									sap.ui.core.BusyIndicator.hide();
									modal.busyIndicator.close();
								  if(data && data.__batchResponses && data.__batchResponses.length>1 )
									{
	                	  callback.call(controller,data.__batchResponses[1].data.results);
									}

	            }, function(err) {    
	                  sap.ui.core.BusyIndicator.hide();
	                    modal.busyIndicator.close();
						});
				},
				function(a) {
	               successFaultCallBack.apply(context,[a, true]);
				}, true);
},
	
	
	postData : function(servicePath,payload,controller,callback){
									//var url = "https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap/ZGWP_PM_JOB_CARD_TMP_SRV" + servicePath;
		var url = applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV" + servicePath;
		var appController = this;
		var modal = this;
									//jQuery.sap.require(sap.m.MessageBox);
		var oModel = new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV", true);
									//var oModel = new sap.ui.model.odata.ODataModel("https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap" + "/ZGWP_PM_JOB_CARD_TMP_SRV", true);
		modal.busyIndicator.open();
		oModel.refreshSecurityToken(
			function(a, b) {
						oModel.oHeaders = {
																//"x-csrf-token" : b.headers["x-csrf-token"],
																"Content-Type" : "application/json; charset=utf-8"
						};
						oModel.create(servicePath,payload,{
								success : function(postData, response){
	            	   	 callback.call(controller,postData,response,payload);        			               
	            	     modal.busyIndicator.close();
								},
								error : function(error){
													modal.busyIndicator.close();
													//console.log(error);
								}
						});
	        },
					function(a) {
					}, true);
	},
	
	
	//Post call to the backend
	 getNotification : function (data,controller,length){
		 if(!this.busyIndicator){
				
				this.busyIndicator = new sap.m.BusyDialog()
			}
									//jQuery.sap.require(sap.m.MessageBox);
		 var modal = this;
		 var oModel =  new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV", true) ;
									//var oModel =  new sap.ui.model.odata.ODataModel("https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap" + "/ZGWP_PM_JOB_CARD_TMP_SRV", true) ;
		 var rModel = new sap.ui.model.json.JSONModel();
		 modal.busyIndicator.open();
		 oModel.refreshSecurityToken(
						function(a, b) {
									oModel.oHeaders = {
																	 //      "x-csrf-token" : b.headers["x-csrf-token"],
	                       "Content-Type" : "application/json; charset=utf-8"
									};
		 oModel.create('/ETS_SETIN',data,{
									 success : function(data, response){
	            	   modal.busyIndicator.close();
	                 if(controller.getView().sId == "jobDetails")
	                 {
	                      rModel.setData(data.NAV_SET_TO_OPENFAULTS);
	                      var results = rModel.getData();
												controller.getDialogDetails(results,length);
									 }
	                 else if(controller.getView().sId == "jobList")
	                 {
												controller.getCount(data.FaultCount);
									 }
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
	     
	},
	//Post call to the backend to get MeasurementPoints
	getMeasurementPts : function (data,controller,length){
		 if(!this.busyIndicator){
				this.busyIndicator = new sap.m.BusyDialog()
			}
		 var modal = this;
									//jQuery.sap.require(sap.m.MessageBox);
		 var oModel =  new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL + "/ZGWP_PM_JOB_CARD_TMP_SRV", true) ;
									//var oModel =  new sap.ui.model.odata.ODataModel("https://nwgwdev.transport.nsw.gov.au/sap/opu/odata/sap" + "/ZGWP_PM_JOB_CARD_TMP_SRV", true) ;
	     
		 var rModel = new sap.ui.model.json.JSONModel();
		 modal.busyIndicator.open();
		 oModel.refreshSecurityToken(
		 function(a, b) {
	     oModel.oHeaders = {
	                      "x-csrf-token" : b.headers["x-csrf-token"],
	                       "Content-Type" : "application/json; charset=utf-8"
			 };
	     oModel.create('/ETS_MEAS_HEAD',data,{
						success : function(data, response){
										 modal.busyIndicator.close();
										 rModel.setData(data.NAV_SET_TO_OPENFAULTS);
										 var results = rModel.getData();
										 controller.measurementTable(results,length);
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
	     
	},

	getRecObservLongText: function (orderNo, carId, taskCode, operation, controller){
		if(!this.busyIndicator){
				
				this.busyIndicator = new sap.m.BusyDialog()
		}
		var longText;
		var modal = this
		modal.busyIndicator.open();
		var mModel =  new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL +"/ZGWP_PM_JOB_CARD_TMP_SRV", true) ;
		mModel.read("/ETS_RECORD_OBSERVATION(IvAufnr='"+orderNo+"',IvCarid='"+carId+"',IvPost='',IvTaskcode='"+taskCode+"',IvVornr='"+operation+"')",{
	        success: function (data, response) {//Success
	       	 	modal.busyIndicator.close();
	       	 	longText = data.EvLongtextOut;
	       	 	controller.setExistingLongText(longText);
	          },
	          error: function (oError) { // Failure
	        	  modal.busyIndicator.close();
	       	  }	
		});
		return longText;
	},

	getParameterValue: function (wricefOpenTxtUrl){
		if(!this.busyIndicator){
			this.busyIndicator = new sap.m.BusyDialog()
		}
		var params;
		var modal = this
		modal.busyIndicator.open();
		var mModel =  new sap.ui.model.odata.ODataModel(applicationContext.applicationEndpointURL + "/ZGWP_PM_COMMON_UTILITY_SRV", true) ;
		mModel.read("/ETS_GET_PARAM_VAR_VALUE?$filter=IvTvarvcName eq '"+wricefOpenTxtUrl+"'",null, null, false,
	        function (data, response) {//Success
	       	 	modal.busyIndicator.close();
	       	 	params = data.results;
	          },
	          function (oError) { // Failure
	        	  modal.busyIndicator.close();
	       	  }	
		);
		return params;
	},


});