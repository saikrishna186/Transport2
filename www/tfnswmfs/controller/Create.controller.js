jQuery.sap.require("tfnswequip.tfnswmfs.util.Formatter");
sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Create", {
		onInit: function() {
			this.firstTime = true;
			this.mFSMsg = this.getOwnerComponent().getModel("mFSMsg");
			this.faultModel = new sap.ui.model.json.JSONModel();
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

			this.initData = {
					"setId":"", 
					"carId": "", 
					"set_car_sap":false
			};
			this.routeData = {
					"fromView": "",
					"setId": "",
					"carId": "",
					"inspType": "",
					"shiftName": ""
			};
			this.faultSourcrFlag = false;
			this.auditTypeFlag = false;
			this.reportPhaseFlag = false;
			this.symptomFlag = false;
			this.positionFlag = false;
			this.temperatureFlag = false;
			this.weatherFlag = false;
			this.graffitiFlag = false;
			this.loadInitPopOverData(this);
			models.initWarningMsg(this,this.getView().byId("messageBar"));

		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Create") {
				return;
			}

			var vController = this;
			if (this.firstTime) {
				this.getView().byId("faultSource").ontouchstart = function(){vController.showFaultSource(this);};
				this.getView().byId("auditType").ontouchstart = function(){vController.showAuditType(this);};
				this.getView().byId("majorSystem").ontouchstart = function(){vController.showMajorSystem(this);};
				this.getView().byId("subSystem").ontouchstart = function(){vController.showSubSystem(this);};
				this.getView().byId("reportPhase").ontouchstart = function(){vController.showReportPhase(this);};
				this.getView().byId("fltSymptom").ontouchstart = function(){vController.showFaultSymptom(this);};
				this.getView().byId("fltPosition").ontouchstart = function(){vController.showPosition(this);};
				this.getView().byId("temp").ontouchstart = function(){vController.showTemperature(this);};
				this.getView().byId("weather").ontouchstart = function(){vController.showWeather(this);};
				this.getView().byId("graffitiType").ontouchstart = function(){vController.showGraffitiType(this);};
				this.firstTime = false;
			}

			this.routeData.fromView =  evt.getParameter("arguments").fromView;
			this.routeData.setId =  evt.getParameter("arguments").setId;
			this.routeData.carId =  evt.getParameter("arguments").carId;
			this.routeData.inspType =  evt.getParameter("arguments").inspType;
			this.routeData.shiftName =  evt.getParameter("arguments").shiftName;
			this.resetForm(this);
		},
		resetForm:function(vController){
			var newFaultModel = new sap.ui.model.json.JSONModel();
			vController.faultModel = newFaultModel;
			var currentdate = new Date();
			vController.faultModel.setData(models.getEmptyFaultStructure());
			vController.faultModel.oData.FaultDate = currentdate;
			vController.faultModel.oData.FaultTime = (currentdate.getHours() + ":" + currentdate.getMinutes());
			vController.getView().setModel(vController.faultModel, "faultModel");
			vController.getView().byId("car_select_confirm").setEnabled(true);
			vController.getView().byId("setorCar").setEnabled(true);
			vController.toggleSearchFieldRows(false);
			vController.toggleFormFieldRows(false);
			vController.initData.setId = "";
			vController.initData.carId = "";
			vController.initData.set_car_sap = false;

			vController.getView().byId("carSelectButtons").setVisible(false);
			vController.getView().byId("searchSetorCarButton").setVisible(true);
			vController.getView().byId("faultSubmitButton").setEnabled(false);
			vController.getView().byId("carsContainer").setVisible(false);
			vController.getView().byId("setorCar").setValue("");
			vController.getView().byId("TSR_fields").setVisible(false);
			vController.getView().byId("Audit_fields").setVisible(false);
			vController.getView().byId("TPC_fields").setVisible(false);
			vController.getView().byId("faultSourceRow").setDefaultSpan("L12 M12 S12");	
			vController.getView().byId("openCount").setText("Search Result : 0");
			vController.getView().byId("tableOpenFault").setVisible(false);
			vController.resetPopoverFields(vController);

			if(vController.routeData.fromView === "jobCard"){
				vController.getView().byId("setorCar").setValue(vController.routeData.carId);
				vController.searchSetorCar(evt);
				vController.getView().byId("faultSource").setValue("VOI");
				vController.getView().byId("faultSource").data("fltSource","VOI");
				vController.getView().byId("reportPhase").setValue("MAINTENANCE");
				vController.getView().byId("reportPhase").data("reportPhase","MAIN");
				vController.faultModel.oData.ReportPhase = "MAIN";
				vController.faultModel.oData.RepPhaseDesc = "MAINTENANCE";
			}

			vController.faultSourcrFlag = true;
			vController.auditTypeFlag = true;
			vController.reportPhaseFlag = true;
			vController.symptomFlag = true;
			vController.positionFlag = true;
			vController.temperatureFlag = true;
			vController.weatherFlag = true;
			vController.graffitiFlag = true;
			vController.processDependents(vController);
		},
		processDependents:function(vController){
			var depdtListLength = this.getView().getDependents().length;
			for(var i=0;i<depdtListLength;i++){
				var deptTitle = vController.getView().getDependents()[i].getProperty("title");
				if(deptTitle === "Select Fault Source" || deptTitle === "Select Audit Type" || deptTitle === "Select Report Phase" || deptTitle === "Select Symptom" || deptTitle === "Select Position" 
					|| deptTitle === "Select Temprature" || deptTitle === "Select Weather" || deptTitle === "Select Graffiti Type" ){
					vController.getView().getDependents()[i].destroy();
					i=-1;
					depdtListLength = vController.getView().getDependents().length;
				}
			}
		},
		resetPopoverFields:function(vController){
			vController.getView().byId("faultSource").setValue("");
			vController.getView().byId("faultSource").data("fltSource","");

			vController.getView().byId("auditType").setValue("");
			vController.getView().byId("auditType").data("auditType","");

			vController.getView().byId("subSystem").setValue("");
			vController.getView().byId("subSystem").data("subSystem","");

			vController.getView().byId("majorSystem").setValue("");
			vController.getView().byId("majorSystem").data("majorSystem","");

			vController.getView().byId("reportPhase").setValue("");
			vController.getView().byId("reportPhase").data("reportPhase","");

			vController.getView().byId("fltSymptom").setValue("");
			vController.getView().byId("fltSymptom").data("fltSymptom","");

			vController.getView().byId("fltPosition").setValue("");
			vController.getView().byId("fltPosition").data("fltPosition","");

			vController.getView().byId("temp").setValue("");
			vController.getView().byId("temp").data("temp","");

			vController.getView().byId("weather").setValue("");
			vController.getView().byId("weather").data("weather","");

			vController.getView().byId("graffitiType").setValue("");
			vController.getView().byId("graffitiType").data("graffitiType","");

			vController.getView().byId("faultRectified").setSelected(false);
			vController.getView().byId("tsrNo").setValue("0");
			vController.getView().byId("auditNo").setValue("");
			vController.getView().byId("tpcNo").setValue("");
		},

		loadInitPopOverData:function(vController){
			models.getPopOverModel(vController,'ETS_FAULT_SRC',"fltSourceModel");	
			models.getPopOverModel(vController,'ETS_AUDIT_TYPE',"auditTypeModel");
			models.getPopOverModel(vController,'ETS_REPORT_PHASE',"reportPhaseModel");
			models.getPopOverModel(vController,'ETS_TEMPERATURE',"temperatureModel");
			models.getPopOverModel(vController,'ETS_WEATHER',"weatherModel");
			models.getPopOverModel(vController,'ETS_GRAFFITI_TYPES',"graffitiModel");
		},
		getSymptomsList:function(vController,subSystem){
			var oModel = new sap.ui.model.json.JSONModel();
			var symptomGroupModel = new sap.ui.model.json.JSONModel();
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			if(vController.getView().getModel("fullModel")){
				vController.getView().getModel("fullModel").destroy();
			}
			if(sap.ui.getCore().byId("symptomCode")){
				sap.ui.getCore().byId("symptomCode").removeAllItems();
				vController.getView().getModel("symptomModel").destroy();
			}
			mainDataModel.read("ETS_SYMPTOM?$filter=(IvEqunr eq '"+subSystem+"')", {
				success: function(data, response) {
					oModel.setData({
						listitems: data.results
					});
					symptomGroupModel.setData({
						listitems: vController.getSymptomGroup(data.results)
					});
					vController.getView().setModel(oModel, "fullModel");
					vController.getView().setModel(symptomGroupModel, "symptomGroupModel");
				},
				error: function(oError) {
					// do nothing
				}
			});	
		},

		searchSetorCar:function(oEvent){
			var vController = this;
			var carModel = new sap.ui.model.json.JSONModel();			
			var setNo = this.getView().byId("setorCar").getValue();
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			if(vController.getView().getModel("openFaultsModel")){
				vController.getView().getModel("openFaultsModel").destroy();
				vController.getView().getModel("openFaultsModel").refresh();
			}
			if(setNo && setNo !== ""){
				if(!vController.busyIndicatorCount){		    
					vController.busyIndicatorCount = new sap.m.BusyDialog();
				}
				vController.busyIndicatorCount.open();
				mainDataModel.read("ETS_CAR_SET_PAIR?$filter=(IvAsset eq '"+setNo.toUpperCase()+"')&$format=json", {
					success: function(data, response) {
						carModel.setData({
							carSet: data.results
						});	
						vController.getView().setModel(carModel,"carModel");
						if(data.results.length === 1){
							vController.initData.setId = data.results[0].Setid;
							vController.initData.carId = data.results[0].Carid;
							carModel.oData.carSet[0].selected = carModel.oData.carSet[0].Carid;
							models.checkSetInSAPnGetMjrSystem(vController,data.results[0].Carid, data.results[0].Zzcardesc);
						}else if(data.results.length > 1){
							vController.initData.setId = data.results[0].Setid;
							models.checkSetInSAPforCRT(vController,carModel);
						}else if(data.results.length === 0) {
							vController.getView().byId("carSelectButtons").setVisible(false);
							vController.getView().byId("searchSetorCarButton").setVisible(true);
							vController.getView().byId("faultSubmitButton").setEnabled(false);
							vController.getView().byId("carsContainer").setVisible(false);
							vController.initData.setId = "";
							vController.initData.carId = "";
							vController.initData.set_car_sap = false;
							vController.toggleSearchFieldRows(false);
							vController.toggleFormFieldRows(false);	
						}
						vController.busyIndicatorCount.close();
					},
					error: function(oError) {
						vController.busyIndicatorCount.close();
						sap.m.MessageBox.show(oError.message,{
							icon: this.mFSMsg.getProperty("popError"), 
							title: this.mFSMsg.getProperty("popTitleNetwork"), 
							actions: sap.m.MessageBox.Action.OK, 
							onClose: function() {/* do nothing*/ }
						});
					}
				});
			}else{
				vController.loadCarsFragment(carModel,vController);
				vController.getView().byId("carSelectButtons").setVisible(false);
				vController.getView().byId("searchSetorCarButton").setVisible(true);
				vController.getView().byId("faultSubmitButton").setEnabled(false);
			}
		},
		showFaultSource: function(oEvent) {
			this.respOver();
			if (!this._ofaultSourcePopover || this.faultSourcrFlag) {
				this._ofaultSourcePopover = sap.ui.xmlfragment("tfnswmfs.fragment.FaultSource", this);
				this._ofaultSourcePopover.bindElement("/");
				this.getView().addDependent(this._ofaultSourcePopover);
				this.faultSourcrFlag = false;
			}else{
				this.faultSourcrFlag = false;
			}
			this._ofaultSourcePopover.openBy(oEvent);
		},
		showAuditType: function(oEvent) {
			this.respOver();
			if (!this._oauditTypePopover || this.auditTypeFlag) {
				this._oauditTypePopover = sap.ui.xmlfragment("tfnswmfs.fragment.AuditType", this);
				this._oauditTypePopover.bindElement("/");
				this.getView().addDependent(this._oauditTypePopover);
				this.auditTypeFlag = false;
			}else{
				this.auditTypeFlag = false;
			}
			this._oauditTypePopover.openBy(oEvent);
		},

		showMajorSystem: function(oEvent) {
			this.respOver();
			var vController = this;
			if (!this._omajorSystemPopover) {
				this._omajorSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.MajorSystem", this);
				this._omajorSystemPopover.bindElement("/");
				this.getView().addDependent(vController._omajorSystemPopover);
			}
			this._omajorSystemPopover.openBy(oEvent);
		},

		showSubSystem: function(oEvent) {
			this.respOver();
			var vController = this;
			var selMajorSystem = this.getView().byId("majorSystem").data("majorSystem");
			if(selMajorSystem && selMajorSystem !== ""){
				if (!vController._osubSystemPopover) {
					vController._osubSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.SubSystem", this);
					vController._osubSystemPopover.bindElement("/");
					vController.getView().addDependent(vController._osubSystemPopover);
				}
				vController._osubSystemPopover.openBy(oEvent);
			}else{
				sap.m.MessageBox.show(this.mFSMsg.getProperty("selectMjrSystem"),{
					icon: this.mFSMsg.getProperty("popInfo"), 
					title: this.mFSMsg.getProperty("popTitleValidation"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {/* do nothing*/}
				});
			}
		},
		showReportPhase: function(oEvent) {
			this.respOver();
			if (!this._oreportPhasePopover || this.reportPhaseFlag) {
				this._oreportPhasePopover = sap.ui.xmlfragment("tfnswmfs.fragment.ReportPhase", this);
				this._oreportPhasePopover.bindElement("/");
				this.getView().addDependent(this._oreportPhasePopover);
				this.reportPhaseFlag = false;
			}else{
				this.reportPhaseFlag = false;
			}
			this._oreportPhasePopover.openBy(oEvent);
		},		

		showFaultSymptom: function(oEvent) {
			this.respOver();
			var vController = this;
			var selSubSystem = ((this.getView().getModel("faultModel").oData.SubSystem && this.getView().getModel("faultModel").oData.SubSystem !== "") ? this.getView().getModel("faultModel").oData.SubSystem : this.getView().getModel("faultModel").oData.ObjectCodeGroup);
			if(selSubSystem && selSubSystem !== ""){
				if (!vController._ofaultSymptomPopover || vController.symptomFlag) {
					vController._ofaultSymptomPopover = sap.ui.xmlfragment("tfnswmfs.fragment.FaultSymptom", this);
					vController._ofaultSymptomPopover.bindElement("/");
					vController.getView().addDependent(this._ofaultSymptomPopover);
					vController.symptomFlag = false;
				}else{
					vController.symptomFlag = false;
				}
				if(vController.getView().getModel("symptomGroupModel") && vController.getView().getModel("symptomGroupModel").oData.listitems.length === 1 && vController.getView().getModel("faultModel").oData.Qmcod === ""){
					var availableGroup = vController.getView().getModel("symptomGroupModel").oData.listitems[0];
					vController.getView().getModel("faultModel").oData.Qmgrp = availableGroup.Codegruppe;
					vController.getView().getModel("faultModel").oData.QmgrpDesc = availableGroup.CodegrText;
					var symptomModel = new sap.ui.model.json.JSONModel();
					symptomModel.setData({
						listitems: vController.getSymptom(vController,vController.getView().getModel("fullModel").oData.listitems,availableGroup.Codegruppe)
					});
					vController.getView().setModel(symptomModel,"symptomModel");
					vController.getView().getModel("symptomModel").refresh();
				}
				this._ofaultSymptomPopover.openBy(oEvent);

			}else{
				sap.m.MessageBox.show(this.mFSMsg.getProperty("selectSubSystem"),{
					icon: this.mFSMsg.getProperty("popInfo"), 
					title: this.mFSMsg.getProperty("popTitleValidation"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {/* do nothing*/}
				});
			}
		},
		showPosition: function(oEvent) {
			this.respOver();
			var vController = this;
			var selSubSystem = ((this.getView().getModel("faultModel").oData.SubSystem && this.getView().getModel("faultModel").oData.SubSystem !== "") ? this.getView().getModel("faultModel").oData.SubSystem : this.getView().getModel("faultModel").oData.ObjectCodeGroup);
			if(selSubSystem && selSubSystem !== "" ){
				if (!vController._opositionPopover || vController.positionFlag) {
					vController._opositionPopover = sap.ui.xmlfragment("tfnswmfs.fragment.Position", this);
					vController._opositionPopover.bindElement("/");
					vController.getView().addDependent(this._opositionPopover);
					vController.positionFlag = false;
				}else{
					vController.positionFlag = false;
				}
				this._opositionPopover.openBy(oEvent); 
			}else{
				sap.m.MessageBox.show(this.mFSMsg.getProperty("selectSubSystem"),{
					icon: this.mFSMsg.getProperty("popInfo"), 
					title: this.mFSMsg.getProperty("popTitleValidation"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {/* do nothing*/}
				});
			}
		},

		showTemperature: function(oEvent) {
			this.respOver();
			if (!this._oTemperaturePopover || this.temperatureFlag) {
				this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.FaultTemperature", this);
				this._oTemperaturePopover.bindElement("/");
				this.getView().addDependent(this._oTemperaturePopover);
				this.temperatureFlag = false;
			}else{
				this.temperatureFlag = false;
			}
			this._oTemperaturePopover.openBy(oEvent);
		},
		showWeather: function(oEvent) {
			this.respOver();
			if (!this._oWeatherPopover || this.weatherFlag) {
				this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.Faultweather", this);
				this._oWeatherPopover.bindElement("/");
				this.getView().addDependent(this._oWeatherPopover);
				this.weatherFlag = false;
			}else{
				this.weatherFlag = false;
			}
			this._oWeatherPopover.openBy(oEvent);
		},
		showGraffitiType: function(oEvent) {
			this.respOver();
			if (!this._oGraffitiType || this.graffitiFlag) {
				this._oGraffitiType = sap.ui.xmlfragment("tfnswmfs.fragment.GraffitiType", this);
				this._oGraffitiType.bindElement("/");
				this.getView().addDependent(this._oGraffitiType);
				this.graffitiFlag = false;
			}else{
				this.graffitiFlag = false;
			}
			this._oGraffitiType.openBy(oEvent);
		},

		loadCarsFragment:function(carModel,that){
			var carContainer = this.getView().byId("carsContainer");
			var oCarFragment = sap.ui.xmlfragment("tfnswmfs.fragment.Car", this);
			carContainer.bindAggregation("content", {
				path: "carModel>/carSet",
				template: oCarFragment,
				sorter: "carModel>/Posnr"
			});
		},
		onSelAuditType: function(oEvent){
			var selAuditType = this.getView().getModel("auditTypeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var auditTypeField = this.getView().byId("auditType");
			auditTypeField.setValue(selAuditType.Zzdesc);
			auditTypeField.data("auditType",selAuditType.ZzauditType);
			this.auditTypeFlag = false;
			this._oauditTypePopover.close();
		},
		onSelSystem:function(oEvent){
			var qryFilter = "";
			var selSystem = this.getView().getModel("majorSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var systemField = this.getView().byId("majorSystem");
			systemField.setValue(selSystem.Zzdescrption);
			systemField.data("majorSystem",selSystem.Zzmajorsystem);
			this.getView().getModel("faultModel").oData.MajorSystem = selSystem.Zzmajorsystem;
			this.getView().getModel("faultModel").oData.MjrsysDesc = selSystem.Zzdescrption;

			this.getView().getModel("faultModel").oData.SubSystem = "";
			this.getView().getModel("faultModel").oData.SubsysDesc = "";
			this.getView().getModel("faultModel").oData.ObjectCodeGroup = "";
			this.getView().getModel("faultModel").oData.CodeGrpDescription = "";
			this.getView().getModel("faultModel").oData.ObjectCode = "";
			this.getView().getModel("faultModel").oData.CodeDescription = "";
			this.getView().getModel("faultModel").oData.Position = "";
			this.getView().getModel("faultModel").oData.PositionDesc = "";
			this.getView().getModel("faultModel").oData.Qmgrp = "";
			this.getView().getModel("faultModel").oData.QmgrpDesc = "";
			this.getView().getModel("faultModel").oData.Qmcod = "";
			this.getView().getModel("faultModel").oData.QmcodDesc = "";

			this.getView().byId("subSystem").setValue("");
			this.getView().byId("subSystem").data("subSystem","");
			if(this.getView().byId("fltPosition")){
				this.getView().byId("fltPosition").setValue("");
				this.getView().byId("fltPosition").data("fltPosition","");
			}
			if(this.getView().byId("fltSymptom")){
				this.getView().byId("fltSymptom").setValue("");
				this.getView().byId("fltSymptom").data("fltSymptom","");
			}

			if(this.getView().getModel("symptomGroupModel")) this.getView().getModel("symptomGroupModel").destroy();
			if(this.getView().getModel("symptomModel")) this.getView().getModel("symptomModel").destroy();
			this._omajorSystemPopover.close();
			if(this.initData.set_car_sap){
				qryFilter +="?$filter=SetId eq '"+this.initData.setId+"' and IvCarid eq '"+this.getSelectedCarByPosition()+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"' and ZZSYS_EGI eq ''";
			}else{
				qryFilter +="?$filter=SetId eq '"+this.initData.setId+"' and IvCarid eq '"+this.getSelectedCarByPosition()+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"' and ZZSYS_EGI eq '"+selSystem.ZZSYS_EGI+"' ";
			}			
			models.getSubSystemModel(this,'ETS_SUB_SYSTEM',qryFilter,"subSystemModel");			
			models.searchOpenFaultsByFilter(this,this.initData.setId, this.getSelectedCarsString(),selSystem.Zzmajorsystem,"", this.initData.set_car_sap);
		},
		onSelSubSystem:function(oEvent){
			var selSubSystem = this.getView().getModel("subSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var subSystemField = this.getView().byId("subSystem");
			var qryFilter = "";

			subSystemField.setValue((selSubSystem.SubsysDesc !== "" ? selSubSystem.SubsysDesc : selSubSystem.CodeGrpDescription+((selSubSystem.CodeGrpDescription !== "" && selSubSystem.CodeDescription !== "") ? " - " : "")+ selSubSystem.CodeDescription));
			this.getView().getModel("faultModel").oData.SubSystem = selSubSystem.SubSystem;
			this.getView().getModel("faultModel").oData.SubsysDesc = selSubSystem.SubsysDesc;
			this.getView().getModel("faultModel").oData.ObjectCodeGroup = selSubSystem.ObjectCodeGroup;
			this.getView().getModel("faultModel").oData.CodeGrpDescription = selSubSystem.CodeGrpDescription;
			this.getView().getModel("faultModel").oData.ObjectCode = selSubSystem.ObjectCode;
			this.getView().getModel("faultModel").oData.CodeDescription = selSubSystem.CodeDescription;
			if(this.getView().byId("fltPosition")){
				this.getView().byId("fltPosition").setValue("");
				this.getView().byId("fltPosition").data("fltPosition","");
			}
			if(this.getView().byId("fltSymptom")){
				this.getView().byId("fltSymptom").setValue("");
				this.getView().byId("fltSymptom").data("fltSymptom","");
			}
			this._osubSystemPopover.close();
			this.toggleFormFieldRows(true);
			this.getView().byId("graffitiRow").setVisible(!this.initData.set_car_sap);
			models.searchOpenFaultsByFilter(this,this.initData.setId, this.getSelectedCarsString(),this.getView().getModel("faultModel").oData.MajorSystem,selSubSystem,this.initData.set_car_sap);
			this.getSymptomsList(this, ((selSubSystem.SubSystem && selSubSystem.SubSystem !== "") ? selSubSystem.SubSystem : this.getView().getModel("faultModel").oData.MajorSystem));
			if(sap.ui.getCore().byId("positionCode")){
				sap.ui.getCore().byId("positionCode").removeAllItems();
			}

			qryFilter += "?$filter=(IvEqunr eq '"+((selSubSystem.SubSystem && selSubSystem.SubSystem !== "") ? selSubSystem.SubSystem : selSubSystem.ObjectCodeGroup) +"')";
			models.getPopOverModelWQFilter(this,'ETS_POSITION',qryFilter,"positionModel");
		},
		onSelSubSystemGroup:function(oEvent){
			var vController = this;
			var selSubSysGroup = this.getView().getModel("subSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var codes = this.getSubSystemCodes(this,this.getView().getModel("subSystemModel").oData.listitems,selSubSysGroup.ObjectCodeGroup);
			if(sap.ui.getCore().byId("SubSystemCode")){
				sap.ui.getCore().byId("SubSystemCode").removeSelections();
			}
			this.getView().getModel("subSystemModel").oData.codes = {};
			this.getView().getModel("subSystemModel").oData.codes = codes;
			this.getView().getModel("subSystemModel").refresh();
		},
		onSelSubSystemCode:function(oEvent){
			var selSubSysCode = this.getView().getModel("subSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var subSystemField = this.getView().byId("subSystem");
			var qryFilter = "";
			subSystemField.setValue(selSubSysCode.CodeGrpDescription+((selSubSysCode.CodeGrpDescription !== "" && selSubSysCode.CodeDescription !== "") ? " - " : "")+ selSubSysCode.CodeDescription);

			this.getView().getModel("faultModel").oData.SubSystem = selSubSysCode.SubSystem;
			this.getView().getModel("faultModel").oData.SubsysDesc = selSubSysCode.SubsysDesc;
			this.getView().getModel("faultModel").oData.ObjectCodeGroup = selSubSysCode.ObjectCodeGroup;
			this.getView().getModel("faultModel").oData.CodeGrpDescription = selSubSysCode.CodeGrpDescription;
			this.getView().getModel("faultModel").oData.ObjectCode = selSubSysCode.ObjectCode;
			this.getView().getModel("faultModel").oData.CodeDescription = selSubSysCode.CodeDescription;

			if(this.getView().byId("fltPosition")){
				this.getView().byId("fltPosition").setValue("");
				this.getView().byId("fltPosition").data("fltPosition","");
			}
			if(this.getView().byId("fltSymptom")){
				this.getView().byId("fltSymptom").setValue("");
				this.getView().byId("fltSymptom").data("fltSymptom","");
			}
			this._osubSystemPopover.close();
			this.toggleFormFieldRows(true);
			this.getView().byId("graffitiRow").setVisible(!this.initData.set_car_sap);
			models.searchOpenFaultsByFilter(this,this.initData.setId, this.getSelectedCarsString(),this.getView().getModel("faultModel").oData.MajorSystem,selSubSysCode,this.initData.set_car_sap);
			this.getSymptomsList(this, ((selSubSysCode.SubSystem && selSubSysCode.SubSystem !== "") ? selSubSysCode.SubSystem : this.getView().getModel("faultModel").oData.MajorSystem));
			if(sap.ui.getCore().byId("positionCode")){
				sap.ui.getCore().byId("positionCode").removeAllItems();
			}
			qryFilter += "?$filter=(IvEqunr eq '"+((selSubSysCode.SubSystem && selSubSysCode.SubSystem !== "") ? selSubSysCode.SubSystem : selSubSysCode.ObjectCodeGroup) +"')";
			models.getPopOverModelWQFilter(this,'ETS_POSITION',qryFilter,"positionModel");

		},
		onSelReportPhase:function(oEvent){
			var selReportPhase = this.getView().getModel("reportPhaseModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var reportPhaseField = this.getView().byId("reportPhase");
			reportPhaseField.setValue(selReportPhase.Zzdesc);
			reportPhaseField.data("reportPhase",selReportPhase.Zzrphase);
			this.getView().getModel("faultModel").oData.ReportPhase = selReportPhase.Zzrphase;
			this.getView().getModel("faultModel").oData.RepPhaseDesc = selReportPhase.Zzdesc;
			this.reportPhaseFlag = false;
			this._oreportPhasePopover.close();
		},
		onSelPosition:function(oEvent){
			var selPosition = this.getView().getModel("positionModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var positionField = this.getView().byId("fltPosition");
			positionField.setValue(selPosition.Zzdesc);
			positionField.data("fltPosition",selPosition.Zzcode);
			this.getView().getModel("faultModel").oData.Position = selPosition.Zzcode;
			this.getView().getModel("faultModel").oData.PositionDesc = selPosition.Zzdesc;
			this.positionFlag = false;
			this._opositionPopover.close();
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp);
			this.getView().getModel("faultModel").oData.Temperature = selTemp.Zztemp;
			this.getView().getModel("faultModel").oData.TempDesc = selTemp.Zzdesc;
			this.temperatureFlag = false;
			this._oTemperaturePopover.close();
		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather);
			this.getView().getModel("faultModel").oData.Weather = selWeather.Zzweather;
			this.getView().getModel("faultModel").oData.WeatherDesc = selWeather.Zzdesc;
			this.weatherFlag = false;
			this._oWeatherPopover.close();
		},
		onSelGraffitiType:function(oEvent){
			var selGraffitiType = this.getView().getModel("graffitiModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var graffitiTypeField = this.getView().byId("graffitiType");
			graffitiTypeField.setValue(selGraffitiType.Zztext);
			graffitiTypeField.data("graffitiType",selGraffitiType.ZzvalueL);
			this.getView().getModel("faultModel").oData.GraffitiType = selGraffitiType.ZzvalueL;
			this.getView().getModel("faultModel").oData.GraffitiDesc = selGraffitiType.Zztext;
			this.graffitiFlag = false;
			this._oGraffitiType.close();
		},
		onFltSrcChange: function(oEvent) {

			var selfltSource = this.getView().getModel("fltSourceModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var fltSourceField = this.getView().byId("faultSource");
			fltSourceField.setValue(selfltSource.Zzdesc);
			fltSourceField.data("fltSource",selfltSource.Zzfaultsrc);
			this.getView().getModel("faultModel").oData.FaultSource = selfltSource.Zzfaultsrc;
			this.getView().getModel("faultModel").oData.FaultSrcDesc = selfltSource.Zzdesc;
			this._ofaultSourcePopover.close();
			var faultSrc = selfltSource.Zzfaultsrc;
			var TSRset = this.getView().byId("TSR_fields");
			var AUDITset = this.getView().byId("Audit_fields");
			var TPCset = this.getView().byId("TPC_fields");
			var gridLayout = this.getView().byId("faultSourceRow");
			gridLayout.setDefaultSpan("L6 M6 S12");
			if (faultSrc === "TSR") {

				TSRset.setVisible(true);
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
			} else if (faultSrc === "AUDIT") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("0");
				AUDITset.setVisible(true);
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
			} else if (faultSrc === "TPC") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("0");
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(true);
			} 
			else {
				gridLayout.setDefaultSpan("L12 M12 S12");
				this.getView().byId("tsrNo").setValue("0");
				TSRset.setVisible(false);
				AUDITset.setVisible(false);
				TPCset.setVisible(false);
			}
			this.faultSourcrFlag = false;

		},

		toggleExpand: function(buttonPressed) {
			var Expand = this.getView().byId("list_expand");
			var Collapse = this.getView().byId("list_collapse");
			var panel = this.getView().byId("panelOpenFault");
			var tableHeader = this.getView().byId("tableOpenFaultHeader"); 
			if (buttonPressed.oSource.getText() === "Expand") {
				Expand.setVisible(false);
				Collapse.setVisible(true);
				panel.setVisible(true);
				tableHeader.setVisible(true)
			} else if (buttonPressed.oSource.getText() === "Collapse") {
				Expand.setVisible(true);
				Collapse.setVisible(false);
				panel.setVisible(false);
				tableHeader.setVisible(false)
			}
		},

		onPressNavToSearch: function(oEvent) {
			var vController = this;
			sap.m.MessageBox.show(vController.mFSMsg.getProperty("cancelTransaction"),{
				icon: vController.mFSMsg.getProperty("popWarning"), 
				title: vController.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.getView().getModel("faultModel").destroy();
						vController.router.navTo("Search");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});

		},
		onPressNavToInfo: function() {
			var vController = this;
			sap.m.MessageBox.show(vController.mFSMsg.getProperty("cancelTransaction"),{
				icon: vController.mFSMsg.getProperty("popWarning"), 
				title: vController.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.getView().getModel("faultModel").destroy();
						vController.router.navTo("Info");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		oncarPress:function(oEvent){
			var that = this;
			var count = 0;
			var selCar = oEvent.getSource();
			var car = this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).Carid;
			if(selCar.hasStyleClass("CarOff")){
				selCar.removeStyleClass("CarOff");
				selCar.addStyleClass("CarOn");
				this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).selected = car;
			}else{
				selCar.removeStyleClass("CarOn");
				selCar.addStyleClass("CarOff");	
				this.getView().getModel("carModel").getProperty(oEvent.getSource().getBindingContext("carModel").sPath).selected = "";
			}
			var carsSet = this.getView().getModel("carModel").oData.carSet;
			if(carsSet <= 1){
				that.getView().byId("car_select_confirm").setVisible(false);
			}else{
				for(var i=0;i < carsSet.length; i++){
					if(carsSet[i].Carid === carsSet[i].selected) {count++;}
				}
				if(count === 0){
					that.getView().byId("car_select_confirm").setVisible(false);
				} else{
					that.getView().byId("car_select_confirm").setVisible(true);
				}
			}
		},
		selectAllCars: function(){
			var carsGroup = this.getView().byId("carsContainer").getContent();
			var count = carsGroup.length;
			var car = "";
			for(var i=0; i<count; i++){
				this.getView().getModel("carModel").oData.carSet[i].selected = this.getView().getModel("carModel").oData.carSet[i].Carid;
				car = carsGroup[i];
				if(car.hasStyleClass("CarOff")){
					car.removeStyleClass("CarOff");
					car.addStyleClass("CarOn");
				}
			}
			this.getView().byId("car_select_confirm").setVisible(true);
		},
		dSelectAllCars: function(){
			var carsGroup = this.getView().byId("carsContainer").getContent();
			var count = carsGroup.length;
			var car = "";
			for(var i=0; i<count; i++){
				this.getView().getModel("carModel").oData.carSet[i].selected = "";
				car = carsGroup[i];
				if(car.hasStyleClass("CarOn")){
					car.removeStyleClass("CarOn");
					car.addStyleClass("CarOff");
				}
			}
			this.getView().byId("car_select_confirm").setVisible(false);
		},
		toggleSearchFieldRows:function(visibleFlag){
			this.getView().byId("dateRow").setVisible(visibleFlag);
			this.getView().byId("faultSourceRow").setVisible(visibleFlag);
			this.getView().byId("systemsRow").setVisible(visibleFlag);
			this.getView().byId("faultListHeader").setVisible(visibleFlag);
			this.getView().byId("panelOpenFault").setVisible(visibleFlag);
			this.getView().byId("tableOpenFaultHeader").setVisible(visibleFlag); 
		},
		toggleFormFieldRows:function(visibleFlag){
			this.getView().byId("reportPhaseRow").setVisible(visibleFlag);
			this.getView().byId("graffitiRow").setVisible(visibleFlag);
			this.getView().byId("rectifiedRow").setVisible(visibleFlag);
			this.getView().byId("commentsRow").setVisible(visibleFlag);

		},
		onPressGetTripID: function(oEvent){
			var setNo = this.initData.setId;
			var qryFilter = "";
			var fltDate = new Date(this.getView().byId("fltDate").getDateValue());
			var fltTime = new Date(this.getView().byId("fltTime").getDateValue());
			var hour = fltTime.getHours(); // get hours from the date value
			var minutes = fltTime.getMinutes(); //get minutes from the date value
			var seconds = fltTime.getSeconds(); //get seconds from the date value
			if(seconds<10) {seconds = "0"+seconds;}

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy-MM-dd" }); 

			var qryfltDate = dateFormat.format(new Date(fltDate))+"T00:00:01";
			var qryfltTime = "PT"+hour+"H"+minutes+"M"+seconds+"S"; //setting time in JSON format

			qryFilter += "?$filter=(IvFdate eq datetime'"+qryfltDate+"') and ";
			qryFilter += "(IvFtime eq time'"+qryfltTime+"') and ";
			qryFilter += "(IvSetid eq '"+setNo+"')&$format=json";
			models.setTripId(this,qryFilter, "tripID",this.mFSMsg);
		},
		resetSearch:function(oEvent){
			if(oEvent.getParameter("newValue") === "" && !this.getView().byId("searchSetorCarButton").getVisible()){
				this.resetForm(this);
			}
		},
		onConfirmCars:function(oEvent){
			var vController = this;
			this.getView().byId("car_select_confirm").setEnabled(false);
			this.freezeAllCars();
			this.getView().byId("car_select_all").setEnabled(false);
			this.getView().byId("car_dSelect_all").setEnabled(false);
			this.getView().byId("faultSubmitButton").setEnabled(true);
			vController.initData.carId = vController.getSelectedCarByPosition();
			this.toggleSearchFieldRows(true);
			var qryFilter = "";
			if(vController.initData.set_car_sap){
				qryFilter ="?$filter=SetId eq '"+vController.initData.setId+"' and Zzcarid eq '"+vController.getSelectedCarByPosition()+"' and Zzcar_egi eq '' &$format=json";
			}else{
				qryFilter ="?$filter=SetId eq '"+vController.initData.setId+"' and Zzcarid eq '"+vController.getSelectedCarByPosition()+"' and Zzcar_egi eq '"+vController.getSelectedEGIByPosition()+"' &$format=json";
			}
			if(sap.ui.getCore().byId("majorSystemList")){
				sap.ui.getCore().byId("majorSystemList").removeAllItems();
			}
			models.getPopOverModelWQFilter(this,'ETS_MAJOR_SYSTEM',qryFilter,"majorSystemModel");
			models.searchOpenFaultsByFilter(this,this.initData.setId, this.getSelectedCarsString(),"","",this.initData.set_car_sap);			
		},
		onPressCancel:function(oEvent){
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelCreate"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleCancelCreate"), 
				actions: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						if(vController.getView().getModel("faultModel"))
							vController.getView().getModel("faultModel").destroy();
						if(vController.getView().getModel("ValueHelpModel"))
							vController.getView().getModel("ValueHelpModel").destroy();
						if(vController.getView().getModel("carModel"))
							vController.getView().getModel("carModel").destroy();
						if(vController.routeData.fromView === "jobCard"){
							var app = sap.ui.getCore().byId("App");
							app.to("jobCard");
						}else{
							vController.resetForm(vController);
						}
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onPressHelp:function(oEvent){
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");

			var dialog = new sap.m.Dialog({
				contentWidth:'99%',
				contentHeight:'auto',
				content: new sap.m.Image({ src: mainDataModel.sServiceUrl+"/ETS_POS_HELP(qmnum='1')/$value" }).addStyleClass("imageSize"),
				endButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},

		onPressSubmit:function(oEvent){
			var vController = this;

			sap.m.MessageBox.show(vController.mFSMsg.getProperty("confirmFaultCreate"), {
				icon: vController.mFSMsg.getProperty("popWarning"),
				title: vController.mFSMsg.getProperty("popTitleWarning"),
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function(oAction) {
					if (oAction === sap.m.MessageBox.Action.YES) {
						var primaryCar = vController.getSelectedCarByPosition();
						var carSet = vController.getView().getModel("carModel").oData.carSet;
						var carSetArr =[];
						for(var i=0;i<carSet.length;i++){
							if(carSet[i].Carid === carSet[i].selected && carSet[i].Carid !== primaryCar){
								var car = {
										"CarId" : "",
										"SetId" : ""
								};
								car.CarId = carSet[i].Carid;
								car.SetId = carSet[i].Setid;
								vController.getView().getModel("faultModel").oData.Setid = carSet[i].Setid;
								carSetArr.push(car);
								vController.getView().byId("faultSubmitButton").setEnabled(false);
							}
						}

						if(vController.validateInput(vController)){
							vController.getView().getModel("faultModel").oData.Setid = vController.initData.setId;
							vController.getView().getModel("faultModel").oData.Carid = primaryCar;
							vController.getView().getModel("faultModel").oData.NAV_FAULT_CAR = carSetArr;
							vController.getView().getModel("faultModel").oData.NAV_FAULT_TO_RETURN = [];

							vController.getView().getModel("faultModel").oData.FftrDesc = (vController.getView().byId("faultRectified").getSelected() ?"X" : "");
							var faultDateVal = vController.getView().byId("fltDate").getDateValue();
							faultDateVal.setHours(0,0,0,0);
							var offsetHours	 = Math.round(Math.abs(faultDateVal.getTimezoneOffset()/60));
							var fromDateWoffSet = faultDateVal.setHours(faultDateVal.getHours()+offsetHours);

							var fltDate = new Date(vController.getView().byId("fltDate").getDateValue());
							var fltTime = new Date(vController.getView().byId("fltTime").getDateValue());
							var hour = fltTime.getHours(); // get hours from the date value
							var minutes = fltTime.getMinutes(); //get minutes from the date value
							var seconds = fltTime.getSeconds(); //get seconds from the date value
							if(seconds<10) {seconds = "0"+seconds;}

							vController.getView().getModel("faultModel").oData.FaultDate = "\/Date("+fromDateWoffSet+")\/";
							vController.getView().getModel("faultModel").oData.FaultTime = ( "PT"+hour+"H"+minutes+"M"+seconds+"S");

							var fltSourceField = vController.getView().byId("faultSource");
							var faultSrc = fltSourceField.data("fltSource");
							if (faultSrc === "TSR") {
								vController.getView().getModel("faultModel").oData.AuditNum =  vController.getView().byId("tsrNo").getValue();
							} else if (faultSrc === "AUDIT") {
								vController.getView().getModel("faultModel").oData.AuditNum =  vController.getView().byId("auditNo").getValue();
								vController.getView().getModel("faultModel").oData.AuditType = vController.getView().byId("auditType").data("auditType");
							} else if (faultSrc === "TPC") {
								vController.getView().getModel("faultModel").oData.AuditNum =  vController.getView().byId("tpcNo").getValue();
							} 
							vController.getView().getModel("faultModel").oData.ReportPhase = vController.getView().byId("reportPhase").data("reportPhase");
							vController.getView().getModel("faultModel").oData.RepPhaseDesc = vController.getView().byId("reportPhase").getValue();
							if(vController.initData.set_car_sap && vController.getView().getModel("faultModel").oData.Position === "NULL"){
								vController.getView().getModel("faultModel").oData.Position = "";
							}
							models.postNotification(vController,vController.getView().getModel("faultModel").oData,vController.mFSMsg,vController.router,"Create");
						}
					} else if (oAction === sap.m.MessageBox.Action.NO) {
						//Do nothing
					}
				}
			});

		},
		validateInput:function(vController){
			var valFlag = false;
			var valMsg = "";
			var fltSourceField = this.getView().byId("faultSource");
			var vController = this;
			var faultSrc = fltSourceField.data("fltSource");
			if (faultSrc === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandfltSrc");
				valFlag = true;
			}else if (faultSrc === "TSR" && vController.getView().byId("tsrNo").getValue() === "" ) {
				valMsg = vController.mFSMsg.getProperty("mandTSRMSG");
				valFlag = true;
			} else if (faultSrc === "AUDIT" && vController.getView().byId("auditNo").getValue() ==="") {
				valMsg = vController.mFSMsg.getProperty("mandAuditMSG");
				valFlag = true;
			} else if (faultSrc === "TPC" && vController.getView().byId("tpcNo").getValue()  ==="") {
				valMsg = vController.mFSMsg.getProperty("mandTPCMSG");
				valFlag = true;
			} else if (this.getView().getModel("faultModel").oData.MajorSystem  === "") {
				valMsg = vController.mFSMsg.getProperty("mandMjrSysMSG");
				valFlag = true;
			} else if (this.getView().getModel("faultModel").oData.SubSystem  === "" && this.getView().getModel("faultModel").oData.ObjectCode  === "" && this.getView().getModel("faultModel").oData.ObjectCodeGroup  === "") {
				valMsg = vController.mFSMsg.getProperty("mandSubSysMSG");
				valFlag = true;
			} else if (this.getDaysDifference(this.getView().byId("fltDate").getDateValue()) < -28) {
				valMsg = vController.mFSMsg.getProperty("fltDatePast");
				valFlag = true;
			}else if (this.getDaysDifference(this.getView().byId("fltDate").getDateValue()) > 0) {
				valMsg = vController.mFSMsg.getProperty("fltDateFuture");
				valFlag = true;
			}else if(this.getView().getModel("faultModel").oData.ReportPhase  === ""){
				valMsg = vController.mFSMsg.getProperty("mandReportPhase");
				valFlag = true;
			}else if(this.getView().getModel("faultModel").oData.Qmgrp === "" || this.getView().getModel("faultModel").oData.Qmcod === ""){
				valMsg = vController.mFSMsg.getProperty("mandSymptom");
				valFlag = true;
			}else if(this.getView().getModel("faultModel").oData.Position === ""){
				valMsg = vController.mFSMsg.getProperty("mandPosition");
				valFlag = true;
			}else if(this.getView().byId("fltComments").getValue() === ""){
				valMsg = vController.mFSMsg.getProperty("mandFaultComment");
				valFlag = true;
			}

			if(valFlag){
				sap.m.MessageBox.show(valMsg,{
					icon: this.mFSMsg.getProperty("popError"), 
					title: this.mFSMsg.getProperty("popTitleError"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {
						vController.getView().byId("faultSubmitButton").setEnabled(true);
						return false;
					}
				});
				return false;
			}else{
				return true;
			}
		},
		getDaysDifference:function(faultDate){
			var currentDate = new Date().setHours(0,0,0,0);
			var faultDate2 = new Date(faultDate).setHours(0,0,0,0);
			var dateDiff = faultDate2 - currentDate;
			var oneDay = 1000 * 60 * 60 * 24;
			return Math.round(dateDiff/oneDay);
		},
		onSelectSympGroup:function(oEvent){
			var vController = this;
			var selSympGroup = this.getView().getModel("symptomGroupModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var symptomModel = new sap.ui.model.json.JSONModel();
			symptomModel.setData({
				listitems: vController.getSymptom(vController,vController.getView().getModel("fullModel").oData.listitems,selSympGroup.Codegruppe)
			});
			this.getView().getModel("faultModel").oData.Qmgrp = selSympGroup.Codegruppe;
			this.getView().getModel("faultModel").oData.QmgrpDesc = selSympGroup.CodegrText;
			this.getView().setModel(symptomModel,"symptomModel");
			this.getView().getModel("symptomModel").refresh();
			sap.ui.getCore().byId("symptomCode").rerender();
		},
		onSelectSymptom:function(oEvent){
			var selSymptom = this.getView().getModel("symptomModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var symptomField = this.getView().byId("fltSymptom");
			this.getView().getModel("faultModel").oData.Qmcod = selSymptom.Code;
			this.getView().getModel("faultModel").oData.QmcodDesc = selSymptom.CodeText;
			symptomField.setValue(this.getView().getModel("faultModel").oData.QmgrpDesc+" - "+this.getView().getModel("faultModel").oData.QmcodDesc);
			this.symptomFlag = false;
			this._ofaultSymptomPopover.close();
		},
		getSymptomGroup:function(arr) {
			var cleaned = [];
			arr.forEach(function(itm) {
				var unique = true;
				cleaned.forEach(function(itm2) {
					if (itm.Codegruppe === itm2.Codegruppe) unique = false;
				});
				if (unique)  cleaned.push(itm);
			});
			return cleaned;
		},
		getSymptom:function(vController,arr,symptom) {
			var cleaned = [];
			arr.forEach(function(itm) {
				if (itm.Codegruppe === symptom) cleaned.push(itm);
			});
			return cleaned;
		},
		getSubSystemGroups:function(arr){
			var cleaned = [];
			arr.forEach(function(itm) {
				var unique = true;
				cleaned.forEach(function(itm2) {
					if (itm.ObjectCodeGroup === itm2.ObjectCodeGroup) unique = false;
				});
				if (unique)  cleaned.push(itm);
			});
			return cleaned;
		},
		getSubSystemCodes:function(vController,arr,systemGroup){
			var groupsList = vController.getSubSystemGroups(arr);
			var cleaned = [];
			if(systemGroup === "" &&  groupsList.length === 1){
				systemGroup = groupsList[0].ObjectCodeGroup;
			}
			arr.forEach(function(itm) {
				if (itm.ObjectCodeGroup === systemGroup) cleaned.push(itm);
			});
			return cleaned;
		},
		toTileHome: function(evt){
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						vController.getView().getModel("faultModel").destroy();
						vController.getOwnerComponent().app.to("tileHome");
					}else if(oAction === sap.m.MessageBox.Action.NO){
						//Do nothing
					}
				}
			});
		},
		onPressMap:function(oEvent){
			oEvent.preventDefault();
			var vController = this;

			if(!vController.busyIndicatorCount){		    
				vController.busyIndicatorCount = new sap.m.BusyDialog();
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
									tempField.data("temp","C");
								}else if(currTemp >= 10 && currTemp <= 35){
									tempField.setValue("AVERAGE (10-35°C)");
									tempField.data("temp","A");								
								}else if(currTemp > 35){
									tempField.setValue("HEAT (>35°C)");
									tempField.data("temp","H");							
								}

								var sepIndex = weatherDesc.indexOf(",");
								if(sepIndex<0){
									sepIndex = weatherDesc.length;
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
		getSelectedCarByPosition:function(){
			var carSet = this.getView().getModel("carModel").oData.carSet;
			var position = 0;
			var selectedCar = "";
			for(var i=0;i<carSet.length;i++){
				if(carSet[i].Carid === carSet[i].selected){
					if(position === 0 || position > carSet[i].posnr){
						position = carSet[i].posnr;
						selectedCar = carSet[i].Carid;
					}
				}
			}
			return selectedCar;
		},
		getSelectedEGIByPosition:function(){
			var carSet = this.getView().getModel("carModel").oData.carSet;
			var position = 0;
			var selectedEGI = "";
			for(var i=0;i<carSet.length;i++){
				if(carSet[i].Carid === carSet[i].selected){
					if(position === 0 || position > carSet[i].posnr){
						position = carSet[i].posnr;
						selectedEGI = carSet[i].Zzcardesc;
					}
				}
			}
			return selectedEGI;
		},
		getSelectedCarsString:function(){
			var carSet = this.getView().getModel("carModel").oData.carSet;
			var selectedCars = "";
			for(var i=0;i<carSet.length;i++){
				if(carSet[i].Carid === carSet[i].selected){
					selectedCars += carSet[i].Carid+",";
				}
			}
			return selectedCars;
		},
		respOver:function(){
			if($(".respOver")){
				for(var i=0;i<$(".respOver").length;i++){
					$(".respOver")[i].childNodes[0].readOnly = true;
				}
			}
		},
		onFaultDetail:function(oEvent){
			var vController = this;
			var sPath = oEvent.getSource().getParent().getSwipedItem().getBindingContextPath();
			var faultRecord = this.getView().getModel("openFaultsModel").getProperty(sPath);
			var mainDataModel = vController.getOwnerComponent().getModel("mainDataModel");
			var detailModel = new sap.ui.model.json.JSONModel();
			var mFSMsg = vController.getOwnerComponent().getModel("mFSMsg");
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog();
			}
			vController.busyIndicator.open();
			mainDataModel.read("ETS_FAULT(Qmnum='"+faultRecord.Qmnum+"',Carid='',Setid='')?$format=json",{
				success: function(data, response) {
					detailModel.setData(data);
					if (! vController._oDetailDialog) {
						vController._oDetailDialog = sap.ui.xmlfragment("tfnswequip.tfnswmfs.fragment.FaultDetail", vController);
					}
					vController.getView().addDependent(vController._oDetailDialog);
					vController._oDetailDialog.open();
					vController._oDetailDialog.setModel(detailModel,"detailModel");
					vController.busyIndicator.close();
				},
				error: function(oError) {
					sap.m.MessageBox.show(mFSMsg.getProperty("updateNoFault"),{
						icon: mFSMsg.getProperty("popError"), 
						title: mFSMsg.getProperty("popTitleNetwork"), 
						actions: [sap.m.MessageBox.Action.OK], 
						onClose: function(oAction){
							vController.busyIndicator.close();
						}
					});
				}
			}); 
		},
		onCloseDetailDialog:function(oEvent){
			this._oDetailDialog.close();
		},
		tableButtonToggle:function(vController, toggleFlag){
			var Expand = vController.getView().byId("list_expand");
			var Collapse = vController.getView().byId("list_collapse");
			var panel = vController.getView().byId("panelOpenFault");
			var tableHeader = this.getView().byId("tableOpenFaultHeader"); 
			Expand.setVisible(!toggleFlag);
			Collapse.setVisible(toggleFlag);
			panel.setVisible(toggleFlag);
			tableHeader.setVisible(toggleFlag);
		},
		respOver:function(){
			if($(".respOver")){
				for(var i=0;i<$(".respOver").length;i++){
					$(".respOver")[i].childNodes[0].readOnly = true;
				}
			}
		},
		freezeAllCars: function(){
			var carsGroup = this.getView().byId("carsContainer").getContent();
			var count = carsGroup.length;
			for(var i=0; i<count; i++){
				carsGroup[i].setEnabled(false);
			}
		},
		showMSGDialog:function(vController,data, response,toView){
			var msgText = "";
			var succFlag = true;
			var resMSGTable = response.data.NAV_FAULT_TO_RETURN.results;
			for(var i=0;i<resMSGTable.length;i++){
				if(resMSGTable[i].Type === "S"){
					resMSGTable[i].color = "green";
				}else{
					resMSGTable[i].color = "red";
					succFlag = false;
				}
				msgText += resMSGTable[i].Message +"\n \n";
			}
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				listitems: resMSGTable,
				toView : toView,
				symptom : response.data.QmgrpDesc + ((response.data.QmgrpDesc !== "" && response.data.QmcodDesc !== "" ) ? " - " : "" ) + response.data.QmcodDesc,
				titleText:(resMSGTable.length === 1 ? "Single-Car Fault for Set " : "Multi-Car Fault for Set ")+ response.data.Setid
			});
			vController.getView().setModel(oModel, "msgDialogModel");
			if(!vController.initData.set_car_sap){

				sap.m.MessageBox.show((msgText !== "" ? msgText : response.data.Message),{
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

							if(vController.routeData.fromView === "jobCard"){
								var app = sap.ui.getCore().byId("App");
								app.to("jobCard");
							}else{
								vController.resetForm(vController);
							}						
						}
						else{
							vController.getView().byId("faultSubmitButton").setEnabled(true);
						}
					}
				});	
			}else{
				if (! vController._oMSGDialog) {
					vController._oMSGDialog = sap.ui.xmlfragment("tfnswequip.tfnswmfs.fragment.MsgDialog", this);
					vController.getView().addDependent(this._oDialog);
				}
				vController._oMSGDialog.setModel(oModel, "msgDialogModel");
				vController._oMSGDialog.open();	
			}
		},

		onCloseMSGDialog:function(){
			var vController = this;
			if(vController.getView().getModel("faultModel"))
				vController.getView().getModel("faultModel").destroy();
			if(vController.getView().getModel("ValueHelpModel"))
				vController.getView().getModel("ValueHelpModel").destroy();
			if(vController.getView().getModel("carModel"))
				vController.getView().getModel("carModel").destroy();
			vController._oMSGDialog.close();
			if(vController.routeData.fromView === "jobCard"){
				var app = sap.ui.getCore().byId("App");
				app.to("jobCard");
			}else{
				vController.resetForm(vController);
			}
			if(vController.getView().getModel("msgDialogModel"))
				vController.getView().getModel("msgDialogModel").destroy();
			if(vController._oMSGDialog.getModel("msgDialogModel"))
				vController._oMSGDialog.getModel("msgDialogModel").destroy();
		}
	});
});