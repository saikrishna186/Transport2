jQuery.sap.require("tfnswequip.tfnswmfs.util.formatter");
sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Update", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf Ztfnswmfs.view.Update
		 */
		onInit: function() {
			this.firstTime = true;
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			var faultId = "";
			var setId = "";
			this.mFSMsg = this.getOwnerComponent().getModel("mFSMsg");
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			this.activityRow = -9;
			this.faultId = "";
			this.initData = {
					"setId":"",
					"carId": "",
					"set_car_sap":false,
					"primaryFlag":false
			};
			this.technicalFinding = {
					"objectPartGroup":"",
					"objectPartGroupText":"",
					"objectPartCode": "",
					"objectPartCodeText": "",
					"damageGroup":"",
					"damageGroupText":"",
					"damageCode":"",
					"damageCodeText":"",
					"damageText":"",
					"causeGroup":"",
					"causeGroupText":"",
					"causeCode":"",
					"causeCodeText":"",
					"causeText":""
			};

			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			models.getPopOverModel(this,'ETS_TEMPERATURE',"temperatureModel");	
			models.getPopOverModel(this,'ETS_WEATHER',"weatherModel");
			models.getPopOverModel(this,'ETS_PLANT_WORKCENTER',"plantWorkCentreModel");
			this.busyIndicatorCount.close();
		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Update") {
				return;
			}
			this.initData.setId = "";
			this.initData.carId = "";
			this.initData.set_car_sap = false;
			this.faultId = evt.getParameter("arguments").faultId
			this.fromView = evt.getParameter("arguments").fromView
			this.resetForm();
//			this.initData.primaryFlag = (evt.getParameter("arguments").primaryFlag === "true");
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			this.getFaultRecord(this,this.faultId);
			this.busyIndicatorCount.close();
		},
		getPopoverData: function(vController){
			this.setId 	= vController.getView().getModel("faultModel").oData.Setid;
			var filters = [];
			var sFilter;
			var qryFilter = "";

			if(this.setId !== ""){
				qryFilter += "?$filter=(SetId eq '"+this.setId+"')&$format=json";	
			}

			models.getPopOverModel(vController,'ETS_TEMPERATURE',qryFilter,filters,"temperatureModel");	
			models.getPopOverModel(vController,'ETS_WEATHER',qryFilter,filters,"weatherModel");			
		},
		onAfterRendering: function() {
			var controller = this;
			if (this.firstTime) {
				this.getView().byId("temp").ontouchstart = function(){controller.showTemperature(this)}; 
				this.getView().byId("weather").ontouchstart = function(){controller.showWeather(this)};
				this.getView().byId("technician").ontouchstart = function(){controller.onClickTechnician(this)};

				this.getView().byId("objectPart").ontouchstart = function(){controller.showObjectPart(this)};
				this.getView().byId("damage").ontouchstart = function(){controller.showDamage(this)};
				this.getView().byId("cause").ontouchstart = function(){controller.showCause(this)};
				this.getView().byId("activity").ontouchstart = function(){controller.showActivity(this)};
				this.firstTime = false;
			}
		},
		onPressNavToCreate: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
//						vController.router.navTo("Create",true);
						vController.router.navTo("Create",{
							fromView:"mfsUpdate",
							setId:"mfsUpdate",
							carId:"mfsUpdate",
							inspType:"mfsUpdate",
							shiftName:"mfsUpdate"
						},true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onPressNavToInfo: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.router.navTo("Info",true);
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onNavBack: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						if(vController.fromView === "mfsSearch" || vController.fromView === "mfsAttachments"){
							vController.router.navTo("Search",true);
						}else if(vController.fromView === "myWorkList"){
							var app = sap.ui.getCore().byId("App");
							app.to("myWorkList");
//							vController.router.navTo("myWorkList",true);
						}
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		setShowMoreOff:function(){
			var statusRow = this.getView().byId("statusRow");
			var dateRow = this.getView().byId("dateRow");
			var commentsRow = this.getView().byId("commentsRow");
			var priorityRow = this.getView().byId("priorityRow");
			var cutOutRow = this.getView().byId("cutOutRow");
			var rectifiedRow = this.getView().byId("rectifiedRow");
			var showMore = this.getView().byId("showMore");
			var techFindings = this.getView().byId("techFindings");
			showMore.setState(false);
			statusRow.setVisible(false);
			dateRow.setVisible(false);
			commentsRow.setVisible(false);
			priorityRow.setVisible(false);
			cutOutRow.setVisible(false);
			rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBorder";
			techFindings.setState(false);
		},
		onShowMore: function(oEvent) {
			var statusRow = this.getView().byId("statusRow");
			var dateRow = this.getView().byId("dateRow");
			var commentsRow = this.getView().byId("commentsRow");
			var priorityRow = this.getView().byId("priorityRow");
			var cutOutRow = this.getView().byId("cutOutRow");
			var rectifiedRow = this.getView().byId("rectifiedRow"); 
			if (oEvent.getParameters().state) {
				statusRow.setVisible(true);
				dateRow.setVisible(true);
				commentsRow.setVisible(true);
				priorityRow.setVisible(true);
				cutOutRow.setVisible(true);
				rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBottom";
			} else {
				statusRow.setVisible(false);
				dateRow.setVisible(false);
				commentsRow.setVisible(false);
				priorityRow.setVisible(false);
				cutOutRow.setVisible(false);
				rectifiedRow.aCustomStyleClasses[0] = "colorGridwithBorder";
			}

		},
		getFaultRecord:function(vController,faultId){
			var mainDataModel = vController.getOwnerComponent().getModel("mainDataModel");
			var faultModel = new sap.ui.model.json.JSONModel();
			var mFSMsg = vController.getOwnerComponent().getModel("mFSMsg");

			mainDataModel.read("ETS_FAULT(Qmnum='"+faultId+"',Carid='',Setid='')?$format=json",{
				success: function(data, response) {
					faultModel.setData(data);
					vController.getView().setModel(faultModel,"faultModel");					
					vController.getView().byId("system").data("system",faultModel.oData.SubSystem);
					vController.getView().byId("fltPosition").data("fltPosition",faultModel.oData.Position);
					vController.getView().byId("fltSymptom").data("fltSymptom",faultModel.oData.Qmgrp+"-"+faultModel.oData.Qmcod);
					vController.getView().byId("faultStatus").data("faultStatus",faultModel.oData.FaultSysStat);
					vController.getView().byId("faultSource").data("faultSource",faultModel.oData.FaultSource);
					vController.getView().byId("fltLocation").data("fltLocation",faultModel.oData.FaultLocation);
					vController.getView().byId("reportPhase").data("reportPhase",faultModel.oData.ReportPhase);
					vController.getView().byId("fltPriority").data("fltPriority",faultModel.oData.Priority);
					vController.getView().byId("enggFlag").data("enggFlag",faultModel.oData.EngFlag);
					vController.getView().byId("temp").data("temp",faultModel.oData.Temperature);
					vController.getView().byId("weather").data("weather",faultModel.oData.Weather);
					
					if(faultModel.oData.FaultSource === "AUDIT"){
						vController.getView().byId("adtType1").setVisible(true);
						vController.getView().byId("statusRow").setDefaultSpan("L3 M3 S12");
					}else{
						vController.getView().byId("adtType1").setVisible(false);
						vController.getView().byId("statusRow").setDefaultSpan("L4 M4 S12");	
					}
					var userStatus = faultModel.oData.FaultUserStat;
					if(userStatus.indexOf("FCTO") > -1){
						vController.getView().byId("cutOut").setSelected(true);
					}else{
						vController.getView().byId("cutOut").setSelected(false);
					}
					if(userStatus.indexOf("FNBF") > -1){
						vController.getView().byId("nonBlockFlt").setSelected(true);
					}else{
						vController.getView().byId("nonBlockFlt").setSelected(false);
					}
					if(userStatus.indexOf("FFTR") > -1){
						vController.getView().byId("faultRectified").setSelected(true);
					}else{
						vController.getView().byId("faultRectified").setSelected(false);
					}
					vController.initData.setId = faultModel.oData.Setid;
					vController.initData.carId = faultModel.oData.Carid;
					vController.initData.primaryFlag = !(faultModel.oData.Primedupflag === "L");
					var initModel = new sap.ui.model.json.JSONModel();
					initModel.setData(vController.initData);
					vController.getView().setModel(initModel, "initModel");
					models.checkSetInSAP(vController,initModel);
				},
				error: function(oError) {
					sap.m.MessageBox.show(mFSMsg.getProperty("updateNoFault"),{
						icon: mFSMsg.getProperty("popError"), 
						title: mFSMsg.getProperty("popTitleNetwork"), 
						actions: [sap.m.MessageBox.Action.OK], 
						onClose: function(oAction){
							if(vController.fromView === "mfsSearch"){
								vController.router.navTo("Search",true);	
							}else if(vController.fromView === "myWorkList"){
								var app = sap.ui.getCore().byId("App");
								app.to("myWorkList");
							}
						}
					});
				}
			});
		},
		showTemperature: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oTemperaturePopover) {
					this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultTemperature", this);
					this._oTemperaturePopover.bindElement("/");
					this.getView().addDependent(this._oTemperaturePopover);
				}
				this._oTemperaturePopover.openBy(oEvent);
			}
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp)
			this._oTemperaturePopover.close();
//			this._oTemperaturePopover.destroy();
		},
		onCloseTemprature:function(){
//			this._oTemperaturePopover.destroy();
		},
		showWeather: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oWeatherPopover) {
					this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultweather", this);
					this._oWeatherPopover.bindElement("/");
					this.getView().addDependent(this._oWeatherPopover);
				}
				this._oWeatherPopover.openBy(oEvent);				
			}

		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather)
			this._oWeatherPopover.close();
//			this._oWeatherPopover.destroy();
		},
		onCloseWeather:function(){
//			this._oWeatherPopover.destroy();
		},
		onPressAttachments: function(oEvent){
			this.router.navTo("Attachment",{
				faultId:this.faultId,
				sapFlag:this.getView().getModel("initModel").oData.set_car_sap
			},true);

		},
		onPressUpdate:function(oEvent){
			var faultModel = this.getView().getModel("faultModel").oData;
			var vController = this;
			faultModel.Temperature = this.getView().byId("temp").data("temp");
			faultModel.Weather = this.getView().byId("weather").data("weather");
			faultModel.FftrDesc = (this.getView().byId("faultRectified").getSelected() ?"X" : "");
			var carSetArr =[]
			var carSet = {
					"CarId" : faultModel.Carid,
					"SetId" : faultModel.Setid
			}
			carSetArr.push(carSet);

			if(this.validateInput(vController)){
				faultModel.NAV_FAULT_CAR = carSetArr;
				faultModel.NAV_ITEM_CAUSE_ACTIVITY = vController.getTechnicalFindings(vController);
				models.postNotification(this,faultModel,this.mFSMsg,this.router,"mfsSearch");	
			}
		},
		validateInput:function(vController){
			var valFlag = false;
			var valMsg = "";
			if (vController.getView().byId("workInfoFound").getValue() === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandWorkInfoFound");
				valFlag = true;
			}else if (vController.getView().byId("workInfoAction").getValue() === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandWorkInfoAction");
				valFlag = true;
			}
			if(valFlag){
				sap.m.MessageBox.show(valMsg,{
					icon: this.mFSMsg.getProperty("popError"), 
					title: this.mFSMsg.getProperty("popTitleError"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {return false}
				});
				return false
			}else{
				return true;
			}
		},
		getTechnicalFindings:function(vController){
			var activityTable = vController.getView().getModel("activityTableModel");
			var techFindRecArr = [];
			vController.technicalFinding.causeText = (vController.getView().byId("causeText") ? vController.getView().byId("causeText").getValue() : "");
			vController.technicalFinding.damageText = (vController.getView().byId("damageText") ? vController.getView().byId("damageText").getValue() : "");

			if(activityTable && activityTable.oData.listitems){
				vController.technicalFinding.causeText = vController.getView().byId("causeText").getValue();
				vController.technicalFinding.damageText = vController.getView().byId("damageText").getValue();
				for(var i=0;i<activityTable.oData.listitems.length;i++){
					var techFindRec = {
							ActCode:activityTable.oData.listitems[i].activityCode,
							ActCodegrp:activityTable.oData.listitems[i].activityGroup,
							Acttext:activityTable.oData.listitems[i].activityText,
							StxtGrpcd:"",
							TxtActcd:"",
							TxtActgrp:"",
							TxtCausecd:"",
							TxtCausegrp:"",
							TxtGrpcd:"",
							TxtObjptcd:"",
							TxtProbcd:""
					};
					techFindRecArr.push(techFindRec);
				}
			}
			if(vController.technicalFinding.causeCode || vController.technicalFinding.causeGroup || vController.technicalFinding.causeText || vController.technicalFinding.damageCode || vController.technicalFinding.damageGroup || vController.technicalFinding.damageText || vController.technicalFinding.objectPartCode || vController.technicalFinding.objectPartGroup){
				var techFindRec = {
						CauseCode:vController.technicalFinding.causeCode,
						CauseCodegrp:vController.technicalFinding.causeGroup,
						Causetext:vController.technicalFinding.causeText,
						DCode:vController.technicalFinding.damageCode,
						DCodegrp:vController.technicalFinding.damageGroup,
						DText:vController.technicalFinding.damageText,
						DlCode:vController.technicalFinding.objectPartCode,
						DlCodegrp:vController.technicalFinding.objectPartGroup,
				};
				techFindRecArr.push(techFindRec);		
			}
			return techFindRecArr;
		},
		onPressMap:function(oEvent){
			oEvent.preventDefault();
			var vController = this;
			if(!vController.busyIndicatorCount){		    
				vController.busyIndicatorCount = new sap.m.BusyDialog()
			}
			vController.busyIndicatorCount.open();
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(
						function(position) {
							var latitude= position.coords.latitude;
							var longitude = position.coords.longitude;
							var tempField = vController.getView().byId("temp");
							var weatherField = vController.getView().byId("weather");
							var weatherData = models.getWeatherServiceData(latitude,longitude);
							if(weatherData.length>0){
								var currentCondition = weatherData[0];
								var currTemp = currentCondition.temp_C;
								var weatherDesc = currentCondition.weatherDesc[0].value;

								if(currTemp < 10){
									tempField.setValue("COLD (<10°C)");
									tempField.data("temp","C")
								}else if(currTemp >= 10 && currTemp <= 35){
									tempField.setValue("AVERAGE (10-35°C)");
									tempField.data("temp","A")								
								}else if(currTemp > 35){
									tempField.setValue("HEAT (>35°C)");
									tempField.data("temp","H")								
								}
								var sepIndex = weatherDesc.indexOf(",");
								if(sepIndex<0){
									sepIndex = weatherDesc.length
								}else{
									sepIndex--;
								}
//								weatherField.setValue(weatherDesc.substr(0,sepIndex));
//								weatherField.data("weather",weatherDesc.substr(0,sepIndex))	

								vController.getView().getModel("faultModel").oData.TempDesc = tempField.getValue();
								vController.getView().getModel("faultModel").oData.Temperature = tempField.data("temp");
//								vController.getView().getModel("faultModel").oData.WeatherDesc = weatherField.getValue();
//								vController.getView().getModel("faultModel").oData.Weather = weatherField.data("weather");
								vController.busyIndicatorCount.close();
							}else{
								vController.busyIndicatorCount.close();
								sap.m.MessageBox.show(vController.mFSMsg.getProperty("weatherServiceError"),{
									icon: vController.mFSMsg.getProperty("popError"), 
									title: vController.mFSMsg.getProperty("popTitleError"), 
									actions: [sap.m.MessageBox.Action.OK], 
									onClose: function(oAction){
										// Do nothing
									}
								});	
							}
						},
						function(err) {
							vController.busyIndicatorCount.close();
							sap.m.MessageBox.show(vController.mFSMsg.getProperty("geoError"),{
								icon: vController.mFSMsg.getProperty("popError"), 
								title: vController.mFSMsg.getProperty("popTitleError"), 
								actions: [sap.m.MessageBox.Action.OK], 
								onClose: function(oAction){
									// Do nothing
								}
							});
						});
			}else{
				vController.busyIndicatorCount.close();
				sap.m.MessageBox.show(vController.mFSMsg.getProperty("geoNotSupported"),{
					icon: vController.mFSMsg.getProperty("popError"), 
					title: vController.mFSMsg.getProperty("popTitleError"), 
					actions: [sap.m.MessageBox.Action.OK], 
					onClose: function(oAction){
						// Do nothing
					}
				});
			}
			return false;
		},
		onClickTechnician:function(oEvent){
			if(this.initData.primaryFlag){
				this.respOver();
				if (! this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("tfnswequip.tfnswmfs.fragment.TechnicianHelper", this);
				}
				this.getView().addDependent(this._oDialog);
				this._oDialog.open();
				this._oDialog.setModel(this.getDepotList(),"depotModel");				
			}

		},
		onCancelTechDialog:function(){
			this._oDialog.close();
		},
		afterClose:function(){
//			this._oDialog.destroy();
		},
		afterOpen:function(){
			var vController = this;
			if(sap.ui.getCore().byId("depot")){
				sap.ui.getCore().byId("depot").ontouchstart = function(){vController.showDepot(this)}; 
			}
			if(sap.ui.getCore().byId("workCentre")){
				sap.ui.getCore().byId("workCentre").ontouchstart = function(){vController.showWorkCentre(this)}; 
			}
		},
		showDepot: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oDepotPopover) {
					this._oDepotPopover = sap.ui.xmlfragment("tfnswmfs.fragment.depot", this);
					this._oDepotPopover.bindElement("/");
					this._oDialog.addDependent(this._oDepotPopover);
				}
				this._oDepotPopover.openBy(oEvent);				
			}

		},
		showWorkCentre: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oWorkCentrePopover) {
					this._oWorkCentrePopover = sap.ui.xmlfragment("tfnswmfs.fragment.workCentre", this);
					this._oWorkCentrePopover.bindElement("/");
					this._oDialog.addDependent(this._oWorkCentrePopover);
				}
				this._oWorkCentrePopover.openBy(oEvent);				
			}

		},
		onSelDepot:function(oEvent){ 
			var selDepot = this._oDialog.getModel("depotModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var depotField = sap.ui.getCore().byId("depot");
			depotField.setValue(selDepot.Name1);
			depotField.data("depot",selDepot.Werks)
			this._oDepotPopover.close();
			var wCentreField = sap.ui.getCore().byId("workCentre");
			wCentreField.setValue("");
			wCentreField.data("workCentre","");
			this._oDialog.setModel(this.getWorkCentreList(selDepot.Werks),"workCentreModel");
			if(this._oDialog.getModel("techniciansModel")){
				this._oDialog.getModel("techniciansModel").oData = {};
				this._oDialog.getModel("techniciansModel").refresh();
			}
		},
		onSelWorkCentre:function(oEvent){
			var vController = this;
			var selWCentre = this._oDialog.getModel("workCentreModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var wCentreField = sap.ui.getCore().byId("workCentre");
			wCentreField.setValue(selWCentre.Ktext);
			wCentreField.data("workCentre",selWCentre.Arbpl)
			this._oWorkCentrePopover.close();
//			this._oWorkCentrePopover.destroy();
//			this._oDepotPopover.destroy();
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			models.getPopOverModel(vController,"ETS_TECHNICIAN?$filter=(Arbpl eq '"+selWCentre.Arbpl+"' and Werks eq '"+selWCentre.Werks+"')","techniciansModel");			
			this.busyIndicatorCount.close();
			this._oDialog.setModel(this.getView().getModel("workCentreModel"),"techniciansModel");
		},
		getDepotList:function() {
			var arr = this.getView().getModel("plantWorkCentreModel").oData.listitems;
			var oModel = new sap.ui.model.json.JSONModel();
			var cleaned = [];
			arr.forEach(function(itm) {
				var unique = true;
				cleaned.forEach(function(itm2) {
					if (itm.Werks === itm2.Werks) unique = false;
				});
				if (unique)  cleaned.push(itm);
			});
			oModel.setData({
				listitems: cleaned
			});
			return oModel;
		},
		getWorkCentreList:function(werks) {
			var arr = this.getView().getModel("plantWorkCentreModel").oData.listitems;
			var oModel = new sap.ui.model.json.JSONModel();
			var cleaned = [];
			arr.forEach(function(itm) {
				if(itm.Werks === werks){
					cleaned.push(itm);	
				}
			});
			oModel.setData({
				listitems: cleaned
			});
			return oModel;
		},
		onSelectTechnician:function(oEvent){
			var vController = this;
			var selTechnician = this._oDialog.getModel("techniciansModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var technicianField = this.getView().byId("technician");
			technicianField.setValue(selTechnician.Stext);
			technicianField.data("technician",selTechnician.Pernr)
			if(!this.getView().byId("techResourceDisp").getSelected()){
				this.getView().byId("techResourceDisp").setSelected(true)
			}
			this.onCancelTechDialog();

		},
		onShowTechFindings:function(oEvent){
			var toggleFlag = this.getView().byId("techFindings").getState();
			var carId = this.getView().getModel("faultModel").oData.Carid;
			var assetId = this.getView().getModel("faultModel").oData.SubSystem;
			var vController = this;
			this.getView().byId("objectPartRow").setVisible(toggleFlag);
			this.getView().byId("damageRow").setVisible(toggleFlag);
			this.getView().byId("causeRow").setVisible(toggleFlag);
			this.getView().byId("activityRow").setVisible(toggleFlag);

			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			if(!this.getView().getModel("objectPartGroupModel") || !this.getView().getModel("objectPartGroupModel").oData.listitems){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'B' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"objectPartGroupModel");
			}
			if(!this.getView().getModel("damageGroupModel") || !this.getView().getModel("damageGroupModel").oData.listitems){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'C' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"damageGroupModel");
			}
			if(!this.getView().getModel("causeGroupModel") || !this.getView().getModel("causeGroupModel").oData.listitems ){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq '5' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"causeGroupModel");
			}
			if(!this.getView().getModel("activityTableModel") || !this.getView().getModel("activityTableModel").oData.listitems){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					listitems: [{
						"activityGroup":"",
						"activityGroupText":"",
						"activityCode":"",
						"activityCodeText":"",
						"activityText":""
					}]
				});
				vController.getView().setModel(oModel,"activityTableModel");
				vController.getView().getModel("activityTableModel").refresh();
			}
			if(!this.getView().getModel("activityGroupModel")){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'A' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"activityGroupModel");
			}						
			this.busyIndicatorCount.close();
		},
		showObjectPart: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oObjectPartPopover) {
					this._oObjectPartPopover = sap.ui.xmlfragment("tfnswmfs.fragment.objectGroup", this);
					this._oObjectPartPopover.bindElement("/");
					this.getView().addDependent(this._oObjectPartPopover);
				}
				this._oObjectPartPopover.openBy(oEvent);				
			}

		},
		onCloseObjectGroup:function(){
			if(this.getView().getModel("objectPartModel")){
				this.getView().getModel("objectPartModel").destroy();
				this.getView().getModel("objectPartModel").refresh();
			}
//			this._oObjectPartPopover.destroy();
		},
		onSelectObjectPartGroup:function(oEvent){
			var vController = this;
			var selObjectPartGroup = this.getView().getModel("objectPartGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.technicalFinding.objectPartGroup = selObjectPartGroup.Zzcodegruppe;
			this.technicalFinding.objectPartGroupText = selObjectPartGroup.ZzkurztextCg;
			var qryFilter ="?$filter=IvCatalog eq 'B' and IvCodeGrp eq '"+selObjectPartGroup.Zzcodegruppe+"'&$format=json";
			models.getPopOverModelWQFilter(vController,'ETS_SYM_OBJ_CODES',qryFilter,"objectPartModel");
		},
		onSelectObjectPart:function(oEvent){
			var vController = this;
			var selObjectPart = this.getView().getModel("objectPartModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var objectPartField = this.getView().byId("objectPart");
			this.technicalFinding.objectPartCode = selObjectPart.Zzcode;
			this.technicalFinding.objectPartCodeText = selObjectPart.ZzkurztextC;
			objectPartField.setValue(this.technicalFinding.objectPartGroupText+" - "+this.technicalFinding.objectPartCodeText);
			this._oObjectPartPopover.close();
//			this._oObjectPartPopover.destroy();
		},
		showDamage: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oDamageGroupPopover) {
					this._oDamageGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.damageGroup", this);
					this._oDamageGroupPopover.bindElement("/");
					this.getView().addDependent(this._oDamageGroupPopover);
				}
				this._oDamageGroupPopover.openBy(oEvent);				
			}

		},
		onSelectDamageGroup:function(oEvent){
			var vController = this;
			var selDamageGroup = this.getView().getModel("damageGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.technicalFinding.damageGroup = selDamageGroup.Zzcodegruppe;
			this.technicalFinding.damageGroupText = selDamageGroup.ZzkurztextCg;
			var qryFilter ="?$filter=IvCatalog eq 'C' and IvCodeGrp eq '"+selDamageGroup.Zzcodegruppe+"'&$format=json";
			models.getPopOverModelWQFilter(vController,'ETS_SYM_OBJ_CODES',qryFilter,"damageCodeModel");
		},
		onSelectDamageCode:function(oEvent){
			var vController = this;
			var selDamageCode = this.getView().getModel("damageCodeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var damageField = this.getView().byId("damage");
			this.technicalFinding.damageCode = selDamageCode.Zzcode;
			this.technicalFinding.damageCodeText = selDamageCode.ZzkurztextC;//ZzkurztextC
			damageField.setValue(this.technicalFinding.damageGroupText+" - "+this.technicalFinding.damageCodeText);
			this._oDamageGroupPopover.close();
		},
		onCloseDamage:function(){
			if(this.getView().getModel("damageCodeModel")){
				this.getView().getModel("damageCodeModel").destroy();
				this.getView().getModel("damageCodeModel").refresh();
			}
//			this._oDamageGroupPopover.destroy();
		},
		showCause: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oCauseGroupPopover) {
					this._oCauseGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.causeGroup", this);
					this._oCauseGroupPopover.bindElement("/");
					this.getView().addDependent(this._oCauseGroupPopover);
				}
				this._oCauseGroupPopover.openBy(oEvent);				
			}			

		},
		onSelectCauseGroup:function(oEvent){
			var vController = this;
			var selCauseGroup = this.getView().getModel("causeGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.technicalFinding.causeGroup = selCauseGroup.Zzcodegruppe;
			this.technicalFinding.causeGroupText = selCauseGroup.ZzkurztextCg;
			var qryFilter ="?$filter=IvCatalog eq '5' and IvCodeGrp eq '"+selCauseGroup.Zzcodegruppe+"'&$format=json";
			models.getPopOverModelWQFilter(vController,'ETS_SYM_OBJ_CODES',qryFilter,"causeCodeModel");

		},
		onSelectCauseCode:function(oEvent){
			var vController = this;
			var selCauseCode = this.getView().getModel("causeCodeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var causeField = this.getView().byId("cause");
			this.technicalFinding.causeCode = selCauseCode.Zzcode;
			this.technicalFinding.causeCodeText = selCauseCode.ZzkurztextC;//ZzkurztextC
			causeField.setValue(this.technicalFinding.causeGroupText+" - "+this.technicalFinding.causeCodeText);
			this._oCauseGroupPopover.close();
		},
		onCloseCause:function(){
			if(this.getView().getModel("causeCodeModel")){
				this.getView().getModel("causeCodeModel").destroy();
				this.getView().getModel("causeCodeModel").refresh();
			}
//			this._oCauseGroupPopover.destroy();
		},
		onPressAddActivity:function(oEvent){
			this.getView().getModel("activityTableModel").oData.listitems.push({
				"activityGroup":"",
				"activityGroupText":"",
				"activityCode":"",
				"activityCodeText":"",
				"activityText":""
			});
			this.getView().getModel("activityTableModel").refresh();
			this.respOverMultiInput();
		},
		onPressDeleteActivity:function(oEvent){
			var path = oEvent.getSource().getParent().getBindingContextPath();
			var modelRec = this.getView().getModel("activityTableModel").getProperty(path);
			var index =  path.split("/")[2]
			this.getView().getModel("activityTableModel").oData.listitems.splice(index,1);
			this.getView().getModel("activityTableModel").refresh();
		},
		showActivity: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oActivityGroupPopover) {
					this._oActivityGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.activityGroup", this);
					this._oActivityGroupPopover.bindElement("/");
					this.getView().addDependent(this._oActivityGroupPopover);
				}
				var path = oEvent.getSource().getParent().getBindingContextPath();
				var modelRec = this.getView().getModel("activityTableModel").getProperty(path);
				this.activityRow = path.split("/")[2]
				this._oActivityGroupPopover.openBy(oEvent.getSource());				
			}
		},
		onSelectActivityGroup:function(oEvent){
			var vController = this;
			var selActivityGroup = this.getView().getModel("activityGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.getView().getModel("activityTableModel").oData.listitems[vController.activityRow].activityGroup = selActivityGroup.Zzcodegruppe;
			this.getView().getModel("activityTableModel").oData.listitems[vController.activityRow].activityGroupText = selActivityGroup.ZzkurztextCg;
			var qryFilter ="?$filter=IvCatalog eq 'A' and IvCodeGrp eq '"+selActivityGroup.Zzcodegruppe+"'&$format=json";
			models.getPopOverModelWQFilter(vController,'ETS_SYM_OBJ_CODES',qryFilter,"activityCodeModel");
		},
		onSelectActivityCode:function(oEvent){
			var vController = this;
			var selActivityCode = this.getView().getModel("activityCodeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.getView().getModel("activityTableModel").oData.listitems[vController.activityRow].activityCode = selActivityCode.Zzcode;
			this.getView().getModel("activityTableModel").oData.listitems[vController.activityRow].activityCodeText = selActivityCode.ZzkurztextC;
			this._oActivityGroupPopover.close();
			this.getView().getModel("activityTableModel").refresh();
		},
		onCloseActivity:function(){
			if(this.getView().getModel("activityCodeModel")){
				this.getView().getModel("activityCodeModel").destroy();
				this.getView().getModel("activityCodeModel").refresh();
			}
//			this._oActivityGroupPopover.destroy();
		},
		respOver:function(){
			if($(".respOver")){
				for(var i=0;i<$(".respOver").length;i++){
					$(".respOver")[i].childNodes[0].readOnly = true;
				}
			}
		},
		respOverMultiInput:function(){
			if($(".respOver2")){
				for(var i=0;i<$(".respOver2").length;i++){
					if($(".respOver2")[i].childNodes){
						if($(".respOver2")[i].childNodes[0].childNodes[1]){
							if($(".respOver2")[i].childNodes[0].childNodes[1].childNodes){
								if($(".respOver2")[i].childNodes[0].childNodes[1].childNodes[0]){
									$(".respOver2")[i].childNodes[0].childNodes[1].childNodes[0].readOnly=true;
								}
							}
						}
					}
				}
			}
		},
		resetForm:function(){
			this.setShowMoreOff();
			this.getView().byId("objectPartRow").setVisible(false);
			this.getView().byId("damageRow").setVisible(false);
			this.getView().byId("causeRow").setVisible(false);
			this.getView().byId("activityRow").setVisible(false);
			this.getView().byId("techFindings").setState(false);

			if(this.getView().getModel("objectPartGroupModel")){
				this.getView().getModel("objectPartGroupModel").destroy();
				this.getView().getModel("objectPartGroupModel").refresh();
				this.getView().byId("objectPart").setValue("");
			}
			if(this.getView().getModel("objectPartModel")){
				this.getView().getModel("objectPartModel").destroy();
				this.getView().getModel("objectPartModel").refresh();
			}

			if(this.getView().getModel("damageGroupModel")){
				this.getView().getModel("damageGroupModel").destroy();
				this.getView().getModel("damageGroupModel").refresh();
				this.getView().byId("damage").setValue("");
				this.getView().byId("damageText").setValue("");
			}
			if(this.getView().getModel("causeGroupModel")){
				this.getView().getModel("causeGroupModel").destroy();
				this.getView().getModel("causeGroupModel").refresh();
				this.getView().byId("cause").setValue("");
				this.getView().byId("causeText").setValue("");
			}
			if(this.getView().getModel("activityTableModel")){
				this.getView().getModel("activityTableModel").destroy(); 
				this.getView().getModel("activityTableModel").refresh();
			}
			if(this.getView().getModel("faultModel")){
				this.getView().getModel("faultModel").destroy();
				this.getView().getModel("faultModel").refresh();
			}

			if(this.getView().getModel("initModel")){
				this.getView().getModel("initModel").destroy();
				this.getView().getModel("initModel").refresh();
			}
			if(this.getView().getModel("depotModel")){
				this.getView().getModel("depotModel").destroy();
				this.getView().getModel("depotModel").refresh();
			}
			if(this._oDialog && this._oDialog.getModel("depotModel")){
				this._oDialog.getModel("depotModel").oData = {};
				this._oDialog.getModel("depotModel").refresh();
			}
			if(this.getView().getModel("workCentreModel")){
				this.getView().getModel("workCentreModel").destroy();
				this.getView().getModel("workCentreModel").refresh();
			}
			if(this._oDialog && this._oDialog.getModel("workCentreModel")){
				this._oDialog.getModel("workCentreModel").oData = {};
				this._oDialog.getModel("workCentreModel").refresh();
			}
			if(this.getView().getModel("techniciansModel")){
				this.getView().getModel("techniciansModel").destroy();
				this.getView().getModel("techniciansModel").refresh();
				this.getView().byId("technician").setValue("");
				this.getView().byId("techResourceDisp").setSelected(false)
			}
			if(this._oDialog && this._oDialog.getModel("techniciansModel")){
				this._oDialog.getModel("techniciansModel").oData = {};
				this._oDialog.getModel("techniciansModel").refresh();
			}
			this.initData.setId = "";
			this.initData.carId = "";
			this.initData.set_car_sap = "";
		}
	});
});