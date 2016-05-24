jQuery.sap.require("tfnswequip.tfnswmfs.util.Formatter");
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
			this.tempPopflag = false;
			this.weatPopflag = false;
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
			}else{
				this.tempPopflag = true;
				this.weatPopflag = true;
				this.processDependents(this);
			}
			this.initData.setId = "";
			this.initData.carId = "";
			this.initData.set_car_sap = false;
			this.faultId = evt.getParameter("arguments").faultId
			this.fromView = evt.getParameter("arguments").fromView
			this.resetForm();
			this.getFaultRecord(this,this.faultId);

		},
		processDependents:function(vController){
			var depdtListLength = this.getView().getDependents().length;
			for(var i=0;i<depdtListLength;i++){
				var deptTitle = vController.getView().getDependents()[i].getProperty("title");
				if(deptTitle === "Select Temprature" || deptTitle === "Select Weather"){
					vController.getView().getDependents()[i].destroy();
					i=-1;
					depdtListLength = vController.getView().getDependents().length;
				}
			}
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
							this.tempPopflag = false;
							this.weatPopflag = false;
							vController.router.navTo("Search",true);
						}else if(vController.fromView === "myWorkList"){
							var app = sap.ui.getCore().byId("App");
							app.to("myWorkList");
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
			if(!vController.busyIndicatorCount){		    
				vController.busyIndicatorCount = new sap.m.BusyDialog()
			}
			vController.busyIndicatorCount.open();
			mainDataModel.read("ETS_FAULT?$filter=Qmnum eq '"+faultId+"'&$expand=NAV_FAULT_CAR,NAV_ITEM_CAUSE_ACTIVITY&$format=json",{			
				success: function(data, response) {

					vController.getView().byId("system").data("system",data.results[0].SubSystem);
					vController.getView().byId("fltPosition").data("fltPosition",data.results[0].Position);
					vController.getView().byId("fltSymptom").data("fltSymptom",data.results[0].Qmgrp+"-"+data.results[0].Qmcod);
					vController.getView().byId("faultStatus").data("faultStatus",data.results[0].FaultSysStat);
					vController.getView().byId("faultSource").data("faultSource",data.results[0].FaultSource);
					vController.getView().byId("fltLocation").data("fltLocation",data.results[0].FaultLocation);
					vController.getView().byId("reportPhase").data("reportPhase",data.results[0].ReportPhase);
					vController.getView().byId("fltPriority").data("fltPriority",data.results[0].Priority);
					vController.getView().byId("enggFlag").data("enggFlag",data.results[0].EngFlag);
					vController.getView().byId("temp").data("temp",data.results[0].Temperature);
					vController.getView().byId("weather").data("weather",data.results[0].Weather);

					var newDate = new Date(data.results[0].FaultDate);
					newDate.setHours(0,0,0,0);
					newDate.setMilliseconds(data.results[0].FaultTime.ms);
					data.results[0].FaultDate = newDate;

					if(data.results[0].FaultSource === "AUDIT"){
						vController.getView().byId("adtType1").setVisible(true);
						vController.getView().byId("statusRow").setDefaultSpan("L3 M3 S12");
					}else{
						vController.getView().byId("adtType1").setVisible(false);
						vController.getView().byId("statusRow").setDefaultSpan("L4 M4 S12");	
					}
					var userStatus = data.results[0].FaultUserStat;
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
					vController.initData.setId = data.results[0].Setid;
					vController.initData.carId = data.results[0].Carid;
					vController.initData.primaryFlag = !(data.results[0].Primedupflag === "L");

					if(data.results[0].NAV_FAULT_CAR.results && data.results[0].NAV_FAULT_CAR.results.length > 1){
						vController.getView().byId("multiCarsContainer").setVisible(true);
						var multiCars = data.results[0].NAV_FAULT_CAR.results;
						var cars = "";
						for(var i=0;i<multiCars.length;i++){
							if(multiCars[i].CarId !== data.results[0].Carid){
								cars += multiCars[i].CarId+", ";
							}
						}
						if(cars.length > 1){
							cars = cars.substring(0, (cars.length)-2);
						}
						vController.getView().byId("multiCars").setValue(cars);
					}

					vController.bindActivityData(vController, data.results[0].NAV_ITEM_CAUSE_ACTIVITY.results,vController.initData.primaryFlag);

					if(Number(data.results[0].Person) > 0 ){
						vController.getView().byId("techResourceDisp").setSelected(true);
						vController.getView().byId("techResourceDisp").setEditable(false);
						vController.getView().byId("technician").setEditable(true);
						vController.getView().byId("technician").data("technician",data.results[0].Person);
						vController.getView().byId("technician").setValue(data.results[0].FirstName + " " + data.results[0].LastName);
					}else{
						vController.getView().byId("techResourceDisp").setSelected(false); 
						vController.getView().byId("techResourceDisp").setEditable(true);
						vController.getView().byId("technician").setEditable(false);
						vController.getView().byId("technician").data("technician","");
						vController.getView().byId("technician").setValue("");
					}					
					if(!vController.initData.primaryFlag){
						vController.getView().byId("techResourceDisp").setEditable(false);
						vController.getView().byId("technician").setEditable(false);
					}

					faultModel.setData(data.results[0]);
					if(data.results[0].Position === "" || data.results[0].Position === "NULL"){
						faultModel.oData.PositionDesc = "N/A";
					}
					vController.getView().setModel(faultModel,"faultModel");
					models.checkSetInSAP(vController);
					vController.busyIndicatorCount.close();
				},
				error: function(oError) {
					vController.busyIndicatorCount.close();
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
		bindActivityData:function(vController, activityList,primaryFlag){
			var activityArr = [];
			for(var i=0;i<activityList.length;i++){
				var activityRec = {
						activityGroup:(activityList[i].ActCodegrp && activityList[i].ActCodegrp !== "" ? activityList[i].ActCodegrp : ""),
						activityGroupText:(activityList[i].TxtActgrp && activityList[i].TxtActgrp !== "" ? activityList[i].TxtActgrp : ""),
						activityCode:(activityList[i].ActCode && activityList[i].ActCode !== "" ? activityList[i].ActCode : ""),
						activityCodeText:(activityList[i].TxtActcd && activityList[i].TxtActcd !== "" ? activityList[i].TxtActcd : ""), 
						activityText:(activityList[i].Acttext && activityList[i].Acttext !== "" ? activityList[i].Acttext : "") ,
						activeFlag : (i === 0 ? false : primaryFlag)
				};
				if(activityRec.activityGroup !== "" || activityRec.activityText !== "" ){
					activityArr.push(activityRec);
				}
				if(i === 0){
					vController.technicalFinding.causeCode = activityList[i].CauseCode
					vController.technicalFinding.causeCodeText = activityList[i].TxtCausecd
					vController.technicalFinding.causeGroup = activityList[i].CauseCodegrp
					vController.technicalFinding.causeGroupText = activityList[i].TxtCausegrp
					vController.technicalFinding.causeText = activityList[i].Causetext
					vController.getView().byId("causeText").setValue(activityList[i].Causetext);
					vController.getView().byId("cause").setValue(
							vController.technicalFinding.causeGroupText +
							((vController.technicalFinding.causeGroupText !== "" && vController.technicalFinding.causeCodeText !== "") ? " - " : "") + 
							vController.technicalFinding.causeCodeText 
					);

					vController.technicalFinding.damageCode = activityList[i].DCode
					vController.technicalFinding.damageCodeText = activityList[i].TxtProbcd 
					vController.technicalFinding.damageGroup = activityList[i].DCodegrp
					vController.technicalFinding.damageGroupText = activityList[i].StxtGrpcd
					vController.technicalFinding.damageText = activityList[i].DText
					vController.getView().byId("damageText").setValue(activityList[i].DText);
					vController.getView().byId("damage").setValue(
							vController.technicalFinding.damageGroupText +
							((vController.technicalFinding.damageGroupText !== "" && vController.technicalFinding.damageCodeText !== "") ? " - " : "") + 
							vController.technicalFinding.damageCodeText 
					);

					vController.technicalFinding.objectPartCode = activityList[i].DlCode
					vController.technicalFinding.objectPartCodeText = activityList[i].TxtObjptcd 
					vController.technicalFinding.objectPartGroup = activityList[i].DlCodegrp
					vController.technicalFinding.objectPartGroupText = activityList[i].TxtGrpcd
					vController.getView().byId("objectPart").setValue(
							vController.technicalFinding.objectPartGroupText +
							((vController.technicalFinding.objectPartGroupText !== "" && vController.technicalFinding.objectPartCodeText !== "") ? " - " : "") + 
							vController.technicalFinding.objectPartCodeText 
					);
				}
			}
			if(activityArr.length === 0){
				activityArr.push({
					"activityGroup":"",
					"activityGroupText":"",
					"activityCode":"",
					"activityCodeText":"",
					"activityText":"",
					"activeFlag":false
				});
			}
			if(vController.getView().getModel("activityTableModel")){
				vController.getView().getModel("activityTableModel").oData.listitems = activityArr;
				vController.getView().getModel("activityTableModel").refresh();
			}else{
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					listitems: activityArr
				});
				vController.getView().setModel(oModel,"activityTableModel");
				vController.getView().getModel("activityTableModel").refresh();
			}

		},
		showTemperature: function(oEvent) {
			var vController = this;
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oTemperaturePopover || this.tempPopflag) {
					this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.FaultTemperature", this);
					this._oTemperaturePopover.bindElement("/");
					this.getView().addDependent(this._oTemperaturePopover);
				}else{
					this.tempPopflag = false;
				}
				this._oTemperaturePopover.openBy(oEvent);
			}
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp);
			this._oTemperaturePopover.close();
			this.tempPopflag = false;
		},
		showWeather: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oWeatherPopover || this.weatPopflag) {
					this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.Faultweather", this);
					this._oWeatherPopover.bindElement("/");
					this.getView().addDependent(this._oWeatherPopover);
				}else{
					this.weatPopflag = false;
				}
				this._oWeatherPopover.openBy(oEvent);				
			}

		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather);
			this.weatPopflag = false;
			this._oWeatherPopover.close();
		},
		onPressAttachments: function(oEvent){
			this.router.navTo("Attachment",{
				faultId:this.faultId,
				sapFlag:this.initData.set_car_sap 
			},true);

		},
		onPressUpdate:function(oEvent){
			var faultModel = this.getView().getModel("faultModel").oData;
			var vController = this;
			var carSetArr =[]
			var carSet = {
					"CarId" : faultModel.Carid,
					"SetId" : faultModel.Setid
			}
			carSetArr.push(carSet);

			if(this.validateInput(vController,oEvent)){
				faultModel.NAV_FAULT_CAR = carSetArr;
				faultModel.NAV_FAULT_TO_RETURN = [];
				faultModel.NAV_ITEM_CAUSE_ACTIVITY = vController.getTechnicalFindings(vController);
				faultModel.Temperature = vController.getView().byId("temp").data("temp");
				faultModel.Weather = vController.getView().byId("weather").data("weather");
				faultModel.FftrDesc = (vController.getView().byId("faultRectified").getSelected() ?"X" : "");
				models.postNotification(vController,faultModel,vController.mFSMsg,vController.router,"mfsSearch");	
			}
		},
		validateInput:function(vController,oEvent){
			var valFlag = false;
			var valMsg = "";
			var activitiesList = (vController.getView().getModel("activityTableModel") ? vController.getView().getModel("activityTableModel").oData.listitems : []);
			var primFlag = vController.initData.primaryFlag;
			var toggleFlag = this.getView().byId("techFindings").getState();

			if (vController.getView().byId("workInfoFound").getValue() === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandWorkInfoFound");
				valFlag = true;
			}else if (vController.getView().byId("workInfoAction").getValue() === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandWorkInfoAction");
				valFlag = true;
			}
			if(vController.initData.set_car_sap){
				if( vController.getView().getModel("activityTableModel")){
					for(var i=0;i<activitiesList.length;i++){
						if(!activitiesList[i].activeFlag && primFlag && activitiesList[i].activityCode === "" && activitiesList[i].activityGroup === "" && activitiesList[i].activityText === ""){
							valMsg = vController.mFSMsg.getProperty("mandActivity");
							valFlag = true;

							if(!toggleFlag){
								vController.onShowTechFindings(oEvent,true);
							}
							break;
						}
					}
				}else{
					valMsg = vController.mFSMsg.getProperty("mandActivity");
					valFlag = true;
					if(!toggleFlag){
						vController.onShowTechFindings(oEvent,true);
					}
				}
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
			vController.busyIndicatorCount.close();
		},
		onClickTechnician:function(oEvent){
			var editableFlag = this.getView().byId("technician").getEditable();
			if(this.initData.primaryFlag && editableFlag){
				this.respOver();
				if (! this._oTechnicianDialog) {
					this._oTechnicianDialog = sap.ui.xmlfragment("tfnswequip.tfnswmfs.fragment.TechnicianHelper", this);
					this.getView().addDependent(this._oTechnicianDialog);

				}
				this._oTechnicianDialog.setModel(this.getDepotList(),"depotModel");
				this._oTechnicianDialog.open();
			}
		},
		onCancelTechDialog:function(){
			this._oTechnicianDialog.close();
		},
		afterOpenTechnicianDialog:function(){
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
				if (!this._oDepotPopover ) {
					this._oDepotPopover = sap.ui.xmlfragment("tfnswmfs.fragment.Depot", this);
					this._oDepotPopover.bindElement("/");
					this._oTechnicianDialog.addDependent(this._oDepotPopover);
				}
				this._oDepotPopover.openBy(oEvent);				
			}

		},
		showWorkCentre: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oWorkCentrePopover) {
					this._oWorkCentrePopover = sap.ui.xmlfragment("tfnswmfs.fragment.WorkCentre", this);
					this._oWorkCentrePopover.bindElement("/");
					this._oTechnicianDialog.addDependent(this._oWorkCentrePopover);
				}
				this._oWorkCentrePopover.openBy(oEvent);				
			}

		},
		onSelDepot:function(oEvent){ 
			var selDepot = this._oTechnicianDialog.getModel("depotModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var depotField = sap.ui.getCore().byId("depot");
			depotField.setValue(selDepot.Name1);
			depotField.data("depot",selDepot.Werks)
			this._oDepotPopover.close();
			var wCentreField = sap.ui.getCore().byId("workCentre");
			wCentreField.setValue("");
			wCentreField.data("workCentre","");
			this._oTechnicianDialog.setModel(this.getWorkCentreList(selDepot.Werks),"workCentreModel");
			if(this._oTechnicianDialog.getModel("techniciansModel")){
				this._oTechnicianDialog.getModel("techniciansModel").oData = {};
				this._oTechnicianDialog.getModel("techniciansModel").refresh();
			}
		},
		onSelWorkCentre:function(oEvent){
			var vController = this;
			var selWCentre = this._oTechnicianDialog.getModel("workCentreModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var wCentreField = sap.ui.getCore().byId("workCentre");
			wCentreField.setValue(selWCentre.Ktext);
			wCentreField.data("workCentre",selWCentre.Arbpl)
			this._oWorkCentrePopover.close();
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			models.getTechniciansModel(this._oTechnicianDialog,"ETS_TECHNICIAN?$filter=(Arbpl eq '"+selWCentre.Arbpl+"' and Werks eq '"+selWCentre.Werks+"')","techniciansModel");			
			this.busyIndicatorCount.close();
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
			var selTechnician = this._oTechnicianDialog.getModel("techniciansModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var technicianField = this.getView().byId("technician");
			technicianField.setValue(selTechnician.Stext);
			technicianField.data("technician",selTechnician.Pernr)
			if(!this.getView().byId("techResourceDisp").getSelected()){
				this.getView().byId("techResourceDisp").setSelected(true)
			}
			this.getView().getModel("faultModel").oData.Person = selTechnician.Pernr;
			this.getView().getModel("faultModel").oData.Plant = sap.ui.getCore().byId("depot").data("depot"); 
			this.getView().getModel("faultModel").oData.WorkCenter = sap.ui.getCore().byId("workCentre").data("workCentre"); 

			this._oTechnicianDialog.close();

		},
		onShowTechFindings:function(oEvent,tflag){
			var toggleFlag = (tflag?tflag: this.getView().byId("techFindings").getState());

			var carId = this.getView().getModel("faultModel").oData.Carid;
			var assetId = this.getView().getModel("faultModel").oData.SubSystem;
			var vController = this;
			this.getView().byId("objectPartRow").setVisible(toggleFlag);
			this.getView().byId("damageRow").setVisible(toggleFlag);
			this.getView().byId("causeRow").setVisible(toggleFlag);
			this.getView().byId("activityRow").setVisible(toggleFlag);
			this.getView().byId("techFindings").setState(toggleFlag);

			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			if(!this.getView().getModel("objectPartGroupModel") || !this.getView().getModel("objectPartGroupModel").oData.listitems){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'B' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"objectPartGroupModel");
				if(sap.ui.getCore().byId("objectCode")){
					sap.ui.getCore().byId("objectCode").removeAllItems();
				}
			}
			if(!this.getView().getModel("damageGroupModel") || !this.getView().getModel("damageGroupModel").oData.listitems){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'C' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"damageGroupModel");
				if(sap.ui.getCore().byId("damageCode")){
					sap.ui.getCore().byId("damageCode").removeAllItems();
				}
			}
			if(!this.getView().getModel("causeGroupModel") || !this.getView().getModel("causeGroupModel").oData.listitems ){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq '5' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"causeGroupModel");
				if(sap.ui.getCore().byId("causeCode")){
					sap.ui.getCore().byId("causeCode").removeAllItems();
				}
			}
			if(!this.getView().getModel("activityTableModel") || !this.getView().getModel("activityTableModel").oData.listitems){
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					listitems: [{
						"activityGroup":"",
						"activityGroupText":"",
						"activityCode":"",
						"activityCodeText":"",
						"activityText":"",
						"activeFlag":false
					}]
				});
				vController.getView().setModel(oModel,"activityTableModel");

			}
			if(!this.getView().getModel("activityGroupModel")){
				var qryFilter ="?$filter=IvAsset eq '"+assetId+"' and IvCatalog eq 'A' and IvCarid eq '"+carId+"'&$format=json";
				models.getPopOverModelWQFilter(vController,'ETS_SYMP_OBJ_CG',qryFilter,"activityGroupModel");
				if(sap.ui.getCore().byId("activityCode")){
					sap.ui.getCore().byId("activityCode").removeAllItems();
				}
			}						
			this.busyIndicatorCount.close();
			vController.getView().getModel("activityTableModel").refresh();
		},
		showObjectPart: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oObjectPartPopover) {
					this._oObjectPartPopover = sap.ui.xmlfragment("tfnswmfs.fragment.ObjectGroup", this);
					this._oObjectPartPopover.bindElement("/");
					this.getView().addDependent(this._oObjectPartPopover);
				}
				this._oObjectPartPopover.openBy(oEvent);				
			}

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
		},
		showDamage: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oDamageGroupPopover) {
					this._oDamageGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.DamageGroup", this);
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
			this.technicalFinding.damageCodeText = selDamageCode.ZzkurztextC;
			damageField.setValue(this.technicalFinding.damageGroupText+" - "+this.technicalFinding.damageCodeText);
			this._oDamageGroupPopover.close();
		},
		showCause: function(oEvent) {
			if(this.initData.primaryFlag){
				this.respOver();
				if (!this._oCauseGroupPopover) {
					this._oCauseGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.CauseGroup", this);
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
			this.technicalFinding.causeCodeText = selCauseCode.ZzkurztextC;
			causeField.setValue(this.technicalFinding.causeGroupText+" - "+this.technicalFinding.causeCodeText);
			this._oCauseGroupPopover.close();
		},
		onPressAddActivity:function(oEvent){
			this.getView().getModel("activityTableModel").oData.listitems.push({
				"activityGroup":"",
				"activityGroupText":"",
				"activityCode":"",
				"activityCodeText":"",
				"activityText":"",
				"activeFlag":true
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
					this._oActivityGroupPopover = sap.ui.xmlfragment("tfnswmfs.fragment.ActivityGroup", this);
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
			if(sap.ui.getCore().byId("activityCode")){
				sap.ui.getCore().byId("activityCode").removeAllItems();
			}
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
			this.getView().byId("multiCarsContainer").setVisible(false);
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
				this.getView().getModel("activityTableModel").oData.listitems = [];
				this.getView().getModel("activityTableModel").refresh();
			}
			if(this.getView().getModel("faultModel")){
				this.getView().getModel("faultModel").destroy();
				this.getView().getModel("faultModel").refresh();
			}

			if(this.getView().getModel("depotModel")){
				this.getView().getModel("depotModel").destroy();
				this.getView().getModel("depotModel").refresh();
			}
			if(this._oTechnicianDialog && this._oTechnicianDialog.getModel("depotModel")){
				this._oTechnicianDialog.getModel("depotModel").oData = {};
				this._oTechnicianDialog.getModel("depotModel").refresh();
			}
			if(this.getView().getModel("workCentreModel")){
				this.getView().getModel("workCentreModel").destroy();
				this.getView().getModel("workCentreModel").refresh();
			}
			if(this._oTechnicianDialog && this._oTechnicianDialog.getModel("workCentreModel")){
				this._oTechnicianDialog.getModel("workCentreModel").oData = {};
				this._oTechnicianDialog.getModel("workCentreModel").refresh();
			}
			if(this.getView().getModel("techniciansModel")){
				this.getView().getModel("techniciansModel").destroy();
				this.getView().getModel("techniciansModel").refresh();
				this.getView().byId("technician").setValue("");
				this.getView().byId("techResourceDisp").setSelected(false);
			}
			if(this._oTechnicianDialog && this._oTechnicianDialog.getModel("techniciansModel")){
				this._oTechnicianDialog.getModel("techniciansModel").oData = {};
				this._oTechnicianDialog.getModel("techniciansModel").refresh();
			}
			if(sap.ui.getCore().byId("depot")){
				sap.ui.getCore().byId("depot").data("depot","");
				sap.ui.getCore().byId("depot").setValue("");
			}
			if(sap.ui.getCore().byId("workCentre")){
				sap.ui.getCore().byId("workCentre").data("workCentre","");
				sap.ui.getCore().byId("workCentre").setValue("");
			}
			this.technicalFinding.objectPartGroup = "";
			this.technicalFinding.objectPartGroupText = "";
			this.technicalFinding.objectPartCode = "";
			this.technicalFinding.objectPartCodeText = "";
			this.technicalFinding.damageGroup = "";
			this.technicalFinding.damageGroupText = "";
			this.technicalFinding.damageCode = "";
			this.technicalFinding.damageCodeText = "";
			this.technicalFinding.damageText = "";
			this.technicalFinding.causeGroup = "";
			this.technicalFinding.causeGroupText = "";
			this.technicalFinding.causeCode = "";
			this.technicalFinding.causeCodeText = "";
			this.technicalFinding.causeText = "";
			this.initData.setId = "";
			this.initData.carId = "";
			this.initData.set_car_sap = "";
			this.getView().byId("multiCars").setValue("");
		},
		onSelTechCheckBox:function(oEvent){
			this.getView().byId("technician").setEditable((oEvent.getParameter("selected")));
			if(!(oEvent.getParameter("selected"))){
				this.getView().byId("technician").data("technician","");
				this.getView().byId("technician").setValue("");
			}
		},

		showMSGDialog:function(vController,data, response,toView){
			var msgText = "";
			var succFlag = true;
			var resPrimFault = response.data.Qmnum;
			var resMSGTable = response.data.NAV_FAULT_TO_RETURN.results;
			for(var i=0;i<resMSGTable.length;i++){
				if(resMSGTable[i].Type === "E") succFlag = false;
				msgText += resMSGTable[i].Message +"\n \n";
			}
			sap.m.MessageBox.show(msgText,{
				icon: (succFlag ? vController.mFSMsg.getProperty("popSuccess") : vController.mFSMsg.getProperty("popError")),
				title: (succFlag ? vController.mFSMsg.getProperty("popTitleSuccess") : vController.mFSMsg.getProperty("popTitleError")),
				actions: [sap.m.MessageBox.Action.OK], 
				onClose: function(oAction){
					if(succFlag){
						if(vController.getView().getModel("faultModel"))
							vController.getView().getModel("faultModel").destroy();
						if(vController.getView().getModel("ValueHelpModel"))
							vController.getView().getModel("ValueHelpModel").destroy();
						if(vController.getView().getModel("carModel"))
							vController.getView().getModel("carModel").destroy();

						if(vController.fromView === "mfsSearch"){
							vController.router.navTo("Search",true);	
						}else if(vController.fromView === "myWorkList"){
							var app = sap.ui.getCore().byId("App");
							app.to("myWorkList");
						}						
					}
				}
			});	
		},
	});
});