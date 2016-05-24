sap.ui.define([
               "sap/ui/model/json/JSONModel",
               "sap/ui/Device"
               ], function(JSONModel, Device) {
	"use strict";
	var	_sAppModulePath = "tfnswmfs/";
	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createValueHelpModel:function(){
			var ValueHelp = {
					"fromView": "",
					"searchField": "",
					"setNo": "",
					"carNo": ""
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(ValueHelp);
			return oModel;
		},
		mainDataModel:function(){
			var sServerUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_MOBILE_FMS_SRV/";
			var mainModel = new sap.ui.model.odata.ODataModel(sServerUrl,true);
//			mainModel.oHeaders = {"sap-client" :"110"};
			return mainModel;
		},
		getPopOverModel: function(vController, entitySet, modelName){
//			This is the method to get data for Dropdown fields list without any filter
//			Typically to be called from Init method to reduce load for subsequent rendering.			
			var mainDataModel = this.mainDataModel();
			var oModel = new sap.ui.model.json.JSONModel();
			mainDataModel.read(entitySet, {
				success: function(data, response) {
					if(modelName === "priorityModel"){
						for(var i=0;i<data.results.length;i++){ if(data.results[i].Zzpriok === "U") data.results.splice(i)}
					}
					oModel.setData({
						listitems: data.results
					});
					vController.getView().setModel(oModel, modelName);					
				},
				error: function(oError) {
					vController.getView().setModel(oModel, modelName);				
					/*do nothing yet return empty model*/
				}
			});
		},

		getPopOverModelWQFilter: function(vController, entitySet,filter, modelName){
//			This is the method to get data for Dropdown fields list data with Query filter
//			if(!vController.busyIndicator){
//			vController.busyIndicator = new sap.m.BusyDialog()
//			}
//			vController.busyIndicator.open();
			var mainDataModel = this.mainDataModel();
			var oModel = new sap.ui.model.json.JSONModel();
			mainDataModel.read(entitySet+filter, {
				success: function(data, response) {
					oModel.setData({
						listitems: data.results
					});
					vController.getView().setModel(oModel, modelName);	
//					vController.busyIndicator.close();
				},
				error: function(oError) {
					vController.getView().setModel(oModel, modelName);
//					vController.busyIndicator.close();
					/*do nothing yet return empty model*/
				}
			});
		},
		initWarningMsg:function(vController,msgField){
			var mainDataModel = this.mainDataModel();
			var initMessage = "";
			mainDataModel.read("/ETS_WELCOME_TEXT", {
				success: function(data, response) {
					for(var i=0;i<data.results.length;i++){
						if(data.results[i].Text === "INFO")
							initMessage += data.results[i].Tdline+" ";
					}
					msgField.setText(initMessage);					
				},
				error: function(oError) {
					msgField.setText("");
				}
			});					
		},

		initInfoMsg:function(vController){
			var mainDataModel = this.mainDataModel();
			var lineNo = "";
			mainDataModel.read("/ETS_WELCOME_TEXT", {
				success: function(data, response) {
					for(var i=0;i<data.results.length;i++){
						if(data.results[i].Text === "MESS"){
							lineNo = "line"+data.results[i].Tabix;
							vController.getView().byId(lineNo).setText(data.results[i].Tdline);
						}
					}					
				},
				error: function(oError) {
//					console.log("well do nothing here yet");
				}
			});					
		},
		setTripId:function(vController,qryFilter, field){
			var mainDataModel = this.mainDataModel();

			mainDataModel.read("ETS_TRIP_DETAILS"+qryFilter, {
				success: function(data, response) {
//					console.log("on succes");
					vController.getView().getModel("faultModel").oData.Tripnum = data.results[0].IvTripid;
					vController.getView().byId(field).setValue(data.results[0].IvTripid);

				},
				error: function(oError) {
					vController.getView().getModel("faultModel").oData.Tripnum = "";
					vController.getView().byId(field).setValue("");
				}
			});					
		},
		searchOpenFaultsByFilter:function(vController, setNo,carNo,mjrSys,subSys){
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog()
			}
			vController.busyIndicator.open();

			var filters 		= [];
//			var openCount = "Search Result";
			if(setNo !== ""){
				filters.push(new sap.ui.model.Filter("Setid", sap.ui.model.FilterOperator.EQ, setNo));
			}
			if(carNo !== ""){
				filters.push(new sap.ui.model.Filter("Carid", sap.ui.model.FilterOperator.EQ, carNo));
			}
			if(mjrSys !== ""){
				filters.push(new sap.ui.model.Filter("MajorSystem", sap.ui.model.FilterOperator.EQ, mjrSys));
			}
			if(subSys !== ""){
				filters.push(new sap.ui.model.Filter("SubSystem", sap.ui.model.FilterOperator.EQ, subSys));
			}
			filters.push(new sap.ui.model.Filter("FaultUserStat", sap.ui.model.FilterOperator.EQ, "1"));				
			var mainDataModel = this.mainDataModel();
			var openFaultsModel = new sap.ui.model.json.JSONModel();

			mainDataModel.read("ETS_FAULT",{
				success: function(data, response) {
					openFaultsModel.setData({
						listitems: data.results
					});
					var openCount = "Search Result : "+data.results.length;
					openFaultsModel.setSizeLimit(data.results.length);
					vController.getView().byId();
					vController.getView().setModel(openFaultsModel, "openFaultsModel");
					vController.getView().byId("openCount").setText(openCount);
					vController.getView().byId("tableOpenFault").setVisible(true);
					vController.tableButtonToggle(vController,true);
					vController.busyIndicator.close();
				},
				error: function(oError) {
					openFaultsModel.setData({
						listitems: {}
					});
					vController.getView().byId("openCount").setText("Seacrh Result : 0");
					vController.getView().setModel(openFaultsModel, "openFaultsModel");
					vController.getView().byId("tableOpenFault").setVisible(false);
					vController.busyIndicator.close();
				},
				filters: filters
			});
		},
		checkSetInSAPnGetMjrSystem:function(vController,initModel,carId, carEgi){
			var models = this;
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog()
			}
			vController.busyIndicator.open();
			var mainDataModel = this.mainDataModel();
			var setId = initModel.oData.setId;
			if(setId && setId !== ""){
				mainDataModel.read("ETS_SET_CHECK(SetId='"+setId+"')?$format=json",{
					success: function(data, response) {
						initModel.oData.set_car_sap = data.SetPresent;
						vController.getView().setModel(initModel,"initModel");
						var qryFilter = "";
						if(data.SetPresent){
							qryFilter ="?$filter=Zzcarid eq '"+carId+"' and Zzcar_egi eq '' &$format=json";
						}else{
							qryFilter ="?$filter=Zzcarid eq '"+carId+"' and Zzcar_egi eq '"+carEgi+"' &$format=json";
						}
						models.getPopOverModelWQFilter(vController,'ETS_MAJOR_SYSTEM',qryFilter,"majorSystemModel");
					},
					error: function(oError) {
						initModel.oData.set_car_sap = false;
						vController.getView().setModel(initModel,"initModel")
						vController.busyIndicator.close();
					},
				},false);				
			}else{
				initModel.oData.set_car_sap = false;
				vController.getView().setModel(initModel,"initModel")
				vController.busyIndicator.close();
			}
		},

		checkSetInSAP:function(vController,initModel){
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog()
			}
			vController.busyIndicator.open();
			var mainDataModel = this.mainDataModel();
			var setId = initModel.oData.setId;
			if(setId && setId !== ""){
				mainDataModel.read("ETS_SET_CHECK(SetId='"+setId+"')?$format=json",{
					success: function(data, response) {
						initModel.oData.set_car_sap = data.SetPresent;
						vController.getView().setModel(initModel,"initModel")
						//for techfindings in update view
						if(vController.getView().byId("technicianAssignmentBlock")){
							vController.getView().byId("technicianAssignmentBlock").setVisible(data.SetPresent);
						}
						vController.busyIndicator.close();
					},
					error: function(oError) {
						initModel.oData.set_car_sap = false;
						vController.getView().setModel(initModel,"initModel")
						vController.busyIndicator.close();
					},
				},false);				
			}else{
				initModel.oData.set_car_sap = false;
				vController.getView().setModel(initModel,"initModel")
				vController.busyIndicator.close();
			}
		},
		postNotification:function(vController, data,mFSMsg,router,toView){

			if(!this.busyIndicator){
				this.busyIndicator = new sap.m.BusyDialog()
			}
			var modal = this;
			var oModel =  new sap.ui.model.odata.ODataModel(this.mainDataModel().sServiceUrl, true)
			modal.busyIndicator.open();
			oModel.refreshSecurityToken( function(a, b) {
				oModel.oHeaders = {
						"x-csrf-token" : b.headers["x-csrf-token"],
						"Content-Type" : "application/json; charset=utf-8"};
				var formattedData = {"d":data};
				oModel.create('/ETS_FAULT',formattedData,{
					success : function(data, response){
						modal.busyIndicator.close();
						sap.m.MessageBox.show(response.data.Message,{
							icon: mFSMsg.getProperty("popSuccess"), 
							title: mFSMsg.getProperty("popTitleSuccess"), 
							actions: [sap.m.MessageBox.Action.OK], 
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.OK){
									if(vController.getView().getModel("faultModel"))
										vController.getView().getModel("faultModel").destroy();
									if(vController.getView().getModel("initModel"))
										vController.getView().getModel("initModel").destroy();
									if(vController.getView().getModel("ValueHelpModel"))
										vController.getView().getModel("ValueHelpModel").destroy();
									if(vController.getView().getModel("carModel"))
										vController.getView().getModel("carModel").destroy();
									if(toView === "Create"){
										if(vController.routeData.fromView === "jobCard"){
											var app = sap.ui.getCore().byId("App");
											app.to("jobCard");
										}else{
											vController.resetForm(vController);
										}
									}else if(toView === "mfsSearch"){
										if(vController.fromView === "mfsSearch"){
											router.navTo("Search",true);	
										}else if(this.fromView === "myWorkList"){
											var app = sap.ui.getCore().byId("App");
											app.to("myWorkList");
										}
									}

								}
							}
						});
					},
					error : function(error){
						modal.busyIndicator.close();
						sap.m.MessageBox.show(JSON.parse(error.response.body).error.message.value,{
							icon: mFSMsg.getProperty("popError"), 
							title: mFSMsg.getProperty("popTitle"), 
							actions: [sap.m.MessageBox.Action.OK], 
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.OK){
									//for now do nothing and leave it in the same screen
								}
							}
						});
					}
				});
			}, function(a) {

			}, true);
		},
		getWeatherServiceData:function( latitude,longitude){
			var accessKey="463448ca19ce4acbb3043212162403";
			var url = "http://api.worldweatheronline.com/premium/v1/weather.ashx";
			var params = "key="+accessKey+"&q="+latitude+","+longitude+"&format=json&num_of_days=1&lang=EN";
			var weatherDataModel = new sap.ui.model.json.JSONModel();
			weatherDataModel.loadData(url, params, false);
			return weatherDataModel.oData.data.current_condition;
		},
		getEmptyFaultStructure:function(){
			var oData = {
					"AuditNum":"",
					"AuditType":"",
					"AuditTypeDesc":"",
					"CarDesc":"",
					"Carid":"",
					"EngFlag":"",
					"EngFlagDesc":"",
					"FaultComment":"",
					"FaultDate":null,
					"FaultLocDesc":"",
					"FaultLocation":"",
					"FaultSource":"",
					"FaultSrcDesc":"",
					"FaultSysStat":"",
					"FaultTime":null,
					"FaultUserStat":"",
					"FctoDesc":"",
					"FfdcDesc":"",
					"FftrDesc":"",
					"FnbfDesc":"",
					"Longtext":"",
					"MajorSystem":"",
					"Message":"",
					"MjrsysDesc":"",
					"MsgType":"",
					"NAV_FAULT_CAR":"",
					"Position":"",
					"PositionDesc":"",
					"Primedupflag":"",
					"Primefaultnum":"",
					"Priority":"",
					"PriorityDesc":"",
					"Qmcod":"",
					"QmcodDesc":"",
					"Qmdat":null,
					"Qmgrp":"",
					"QmgrpDesc":"",
					"Qmnum":"",
					"Qmtxt":"",
					"ReasonPrio":"",
					"RepPhaseDesc":"",
					"ReportPhase":"",
					"SetDesc":"",
					"Setid":"",
					"SrchFromDate":null,
					"SrchToDate":null,
					"SubSystem":"",
					"SubsysDesc":"",
					"SysStatDesc":"",
					"TempDesc":"",
					"Temperature":"",
					"Tripnum":"",
					"Weather":"",
					"WeatherDesc":"",
					"WorkAction":"",
					"WorkFound":""
			}
			return oData;
		},
		/*		getAWSDetails:function(){
			var awsDataModel = this.awsDataModel();
			var userID = "KONCHADS";
			var awsData = {
					userName:"",
					accessKey:"",
					secureKey:"",
					bucketName:"",
					tnBucketName:""
			};
			awsDataModel.read("ETS_AWS('"+userID+"')", {
				success: function(data, response) {
					awsData.userName = userID;
					awsData.accessKey=data.AccessKey;
					awsData.secureKey=data.SecretKey;
					awsData.bucketName=data.FullBucket;
					awsData.tnBucketName=data.Thumbnail;
					return awsData;
				},
				error: function(oError) {
					return awsData;
				}
			});	
		},
		fetchAWSDetailsfromVault:function(){
			var awsData = {
				userName:"",
				accessKey:"",
				secureKey:"",
				bucketName:"",
				tnBucketName:""
			};
			awsData.userName = "One";
			awsData.accessKey="AKIAJLLRMGNP4CWZDSWQ";
			awsData.secureKey="w0C4W7JS9xzFC+gTOGp9dvbsc87XNFTPYGmZ5Qif";
			awsData.bucketName="stmccdev2";
			awsData.tnBucketName="stmccdevresized2";
			//put it into keystore
			// Do something to fetch the details from keyStore.
			return awsData;
		} */
	};
});