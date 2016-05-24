sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Create", {
		onInit: function() {
			this.firstTime = true;
			this.mFSMsg 	= this.getOwnerComponent().getModel("mFSMsg");
			this.faultModel = new sap.ui.model.json.JSONModel();
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
//			Below definition is to hold the selected SET and its vailability in SAP			
			this.initData = {
					"setId":"", // Selected Set ID
					"carId": "", // selected car or primary car sorted by position
					"set_car_sap":false// Is this an SAP SET ID

			};
//			Below definition is to hold intermediate data from routing &/ previous view
			this.routeData = {
					"fromView": "",
					"setId": "",
					"carId": "",
					"inspType": "",
					"shiftName": ""
			};
			var initModel = new sap.ui.model.json.JSONModel();
			initModel.setData(this.initData);
			this.getView().setModel(initModel, "initModel");
			this.loadInitPopOverData(this);
			this.getSymptomsList(this);
			models.initWarningMsg(this,this.getView().byId("messageBar"));

		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Create") {
				return;
			}
			var vController = this;
			if (this.firstTime) {
				this.getView().byId("faultSource").ontouchstart = function(){vController.showFaultSource(this)};
				this.getView().byId("auditType").ontouchstart = function(){vController.showAuditType(this)};
				this.getView().byId("majorSystem").ontouchstart = function(){vController.showMajorSystem(this)};
				this.getView().byId("subSystem").ontouchstart = function(){vController.showSubSystem(this)};
				this.getView().byId("reportPhase").ontouchstart = function(){vController.showReportPhase(this)};
				this.getView().byId("fltSymptom").ontouchstart = function(){vController.showFaultSymptom(this)};
				this.getView().byId("fltPosition").ontouchstart = function(){vController.showPosition(this)};
				this.getView().byId("temp").ontouchstart = function(){vController.showTemperature(this)};
				this.getView().byId("weather").ontouchstart = function(){vController.showWeather(this)};			
				this.firstTime = false;
			}

			this.routeData.fromView =  evt.getParameter("arguments").fromView;
			this.routeData.setId =  evt.getParameter("arguments").setId;
			this.routeData.carId =  evt.getParameter("arguments").carId;
			this.routeData.inspType =  evt.getParameter("arguments").inspType;
			this.routeData.shiftName =  evt.getParameter("arguments").shiftName;
			this.resetForm(this);
			if(this.routeData.fromView === "jobCard"){
				vController.getView().byId("setorCar").setValue(this.routeData.carId);
				vController.searchSetorCar(evt);
				vController.getView().byId("faultSource").setValue("VOI");
				vController.getView().byId("faultSource").data("fltSource","VOI");
				vController.getView().byId("reportPhase").setValue("MAINTENANCE");
				vController.getView().byId("reportPhase").data("reportPhase","MAIN");
			}else {
				vController.getView().byId("reportPhase").setValue("RUNNING");
				vController.getView().byId("reportPhase").data("reportPhase","RUN");
			}
		},
		resetForm:function(vController){
			var newFaultModel = new sap.ui.model.json.JSONModel();
			vController.faultModel = newFaultModel;
			var currentdate = new Date();
			vController.faultModel.setData(models.getEmptyFaultStructure());
			vController.faultModel.oData.FaultDate = currentdate;//.setHours(0,0,0,0);
			vController.faultModel.oData.FaultTime = (currentdate.getHours() + ":" + currentdate.getMinutes());
			vController.getView().setModel(vController.faultModel, "faultModel");
			this.getView().byId("car_select_confirm").setEnabled(true);
			this.getView().byId("setorCar").setEnabled(true);
			vController.toggleSearchFieldRows(false);
			vController.toggleFormFieldRows(false);
			// Set it to deafult when coming to create screen 2nd time.
			vController.getView().byId("carSelectButtons").setVisible(false);
			vController.getView().byId("searchSetorCarButton").setVisible(true)
			vController.getView().byId("faultSubmitButton").setEnabled(false);;
			vController.getView().byId("carsContainer").setVisible(false);
			vController.getView().byId("setorCar").setValue("");
			vController.getView().byId("TSR_fields").setVisible(false);
			vController.getView().byId("Audit_fields").setVisible(false);
			vController.getView().byId("TPC_fields").setVisible(false);
			vController.getView().byId("faultSourceRow").setDefaultSpan("L12 M12 S12");	
			vController.getView().byId("openCount").setText("Seacrh Result : 0");
			vController.getView().byId("tableOpenFault").setVisible(false);
			vController.resetPopoverFields(vController);
		},

		resetPopoverFields:function(vController){
			vController.getView().byId("faultSource").setValue("");
			vController.getView().byId("faultSource").data("fltSource","");

			vController.getView().byId("auditType").setValue("");
			vController.getView().byId("auditType").data("auditType","")

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

			vController.getView().byId("faultRectified").setSelected(false)	
			vController.getView().byId("tsrNo").setValue("");
			vController.getView().byId("auditNo").setValue("");
			vController.getView().byId("tpcNo").setValue("");
		},

		loadInitPopOverData:function(vController){
			models.getPopOverModel(vController,'ETS_FAULT_SRC',"fltSourceModel");	
			models.getPopOverModel(vController,'ETS_AUDIT_TYPE',"auditTypeModel");
			models.getPopOverModel(vController,'ETS_REPORT_PHASE',"reportPhaseModel");
			models.getPopOverModel(vController,'ETS_SYMPTOM',"fullSymptomModel");
			models.getPopOverModel(vController,'ETS_POSITION',"positionModel");
			models.getPopOverModel(vController,'ETS_TEMPERATURE',"temperatureModel");
			models.getPopOverModel(vController,'ETS_WEATHER',"weatherModel");
		},
		getSymptomsList:function(vController){
			var oModel = new sap.ui.model.json.JSONModel();
			var symptomGroupModel = new sap.ui.model.json.JSONModel();
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			mainDataModel.read("ETS_SYMPTOM", {
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
			var initModel = this.getView().getModel("initModel");	
			var carModel = new sap.ui.model.json.JSONModel();			
			var setNo = this.getView().byId("setorCar").getValue();// oEvent.getParameters().value;
			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			if(vController.getView().getModel("openFaultsModel")){
				vController.getView().getModel("openFaultsModel").destroy();
				vController.getView().getModel("openFaultsModel").refresh();
			}
			if(setNo && setNo !== ""){
				if(!vController.busyIndicatorCount){		    
					vController.busyIndicatorCount = new sap.m.BusyDialog()
				}
				vController.busyIndicatorCount.open();
				mainDataModel.read("ETS_CAR_SET_PAIR?$filter=(IvAsset eq '"+setNo.toUpperCase()+"')&$format=json", {
					success: function(data, response) {
						carModel.setData({
							carSet: data.results
						});	
						vController.getView().setModel(carModel,"carModel");
						if(data.results.length > 0){
							vController.getView().byId("setorCar").setEnabled(false);
							initModel.oData.setId = data.results[0].Setid;
							initModel.oData.carId = data.results[0].Carid;
							vController.getView().byId("subSystem").setValue("");
							vController.getView().byId("subSystem").data("subSystem","");
							vController.getView().byId("faultSourceRow").setDefaultSpan("L12 M12 S12");

						}
						if(data.results.length === 1){
							initModel.oData.setId = data.results[0].Setid;
							initModel.oData.carId = data.results[0].Carid;
							vController.getView().byId("setorCar").setEnabled(false);
//							var qryFilter ="?$filter=Zzcarid eq '"+data.results[0].Carid+"'&$format=json";
//							models.getPopOverModelWQFilter(vController,'ETS_MAJOR_SYSTEM',qryFilter,"majorSystemModel");
							models.checkSetInSAPnGetMjrSystem(vController,initModel,data.results[0].Carid, data.results[0].Zzcardesc);
							models.searchOpenFaultsByFilter(vController,"", initModel.oData.carId,"","");
							vController.getView().getModel("carModel").oData.carSet[0].selected = data.results[0].Carid;
							vController.getView().byId("carSelectButtons").setVisible(false);
							vController.getView().byId("searchSetorCarButton").setVisible(false);
							vController.getView().byId("faultSubmitButton").setEnabled(true);
							vController.getView().byId("carsContainer").setVisible(false);	

							vController.toggleSearchFieldRows(true);
							vController.getView().byId("list_expand").setVisible(false);
							vController.getView().byId("list_collapse").setVisible(true);

						}else if(data.results.length > 1){
							vController.loadCarsFragment(carModel,vController);
							vController.getView().byId("carSelectButtons").setVisible(true);
							vController.getView().byId("searchSetorCarButton").setVisible(false);
							vController.getView().byId("car_select_confirm").setVisible(false);
							vController.getView().byId("faultSubmitButton").setEnabled(false);
							vController.getView().byId("carsContainer").setVisible(true);
							vController.getView().byId("car_select_all").setEnabled(true);
							vController.getView().byId("car_dSelect_all").setEnabled(true);
							vController.toggleSearchFieldRows(false);
							models.checkSetInSAP(vController,initModel);

						}else if(data.results.length === 0) {
							vController.getView().byId("carSelectButtons").setVisible(false);
							vController.getView().byId("searchSetorCarButton").setVisible(true);
							vController.getView().byId("faultSubmitButton").setEnabled(false);
							vController.getView().byId("carsContainer").setVisible(false);
							vController.toggleSearchFieldRows(false);
							vController.toggleFormFieldRows(false);	
							vController.getView().byId("majorSystem").setValue("");
							vController.getView().byId("majorSystem").data("majorSystem","");
							vController.getView().byId("subSystem").setValue("");
							vController.getView().byId("subSystem").data("subSystem","");
						}
						vController.getView().setModel(initModel,"initModel");
//						models.checkSetInSAP(vController,initModel);
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
			if (!this._ofaultSourcePopover) {
				this._ofaultSourcePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultSource", this);
				this._ofaultSourcePopover.bindElement("/");
				this.getView().addDependent(this._ofaultSourcePopover);
			}
			this._ofaultSourcePopover.openBy(oEvent);
		},
		onCloseFaultSource:function(){
//			this._ofaultSourcePopover.destroy();
		},
		showAuditType: function(oEvent) {
			this.respOver();
			if (!this._oauditTypePopover) {
				this._oauditTypePopover = sap.ui.xmlfragment("tfnswmfs.fragment.auditType", this);
				this._oauditTypePopover.bindElement("/");
				this.getView().addDependent(this._oauditTypePopover);
			}
			this._oauditTypePopover.openBy(oEvent);
		},
		onCloseAuditType:function(){
//			this._oauditTypePopover.destroy();
		},
		showMajorSystem: function(oEvent) {
			this.respOver();
			var vController = this;
			if (!this._omajorSystemPopover) {
				this._omajorSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.majorSystem", this);
				this._omajorSystemPopover.bindElement("/");
				this.getView().addDependent(vController._omajorSystemPopover);
			}
			this._omajorSystemPopover.openBy(oEvent);
		},

		onCloseMjrSystem:function(){
//			this._omajorSystemPopover.destroy();
		},		
		showSubSystem: function(oEvent) {
			this.respOver();
			var vController = this;
			var selMajorSystem = this.getView().byId("majorSystem").data("majorSystem");

			if(selMajorSystem && selMajorSystem !== ""){
				if (!vController._osubSystemPopover) {
					vController._osubSystemPopover = sap.ui.xmlfragment("tfnswmfs.fragment.subSystem", this);
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
		onClosesubSystem:function(){
//			this._osubSystemPopover.destroy();
		},
		showReportPhase: function(oEvent) {
			this.respOver();
			if (!this._oreportPhasePopover) {
				this._oreportPhasePopover = sap.ui.xmlfragment("tfnswmfs.fragment.reportPhase", this);
				this._oreportPhasePopover.bindElement("/");
				this.getView().addDependent(this._oreportPhasePopover);
			}
			this._oreportPhasePopover.openBy(oEvent);
		},		
		onCloseReportPhase:function(){
//			this._oreportPhasePopover.destroy();
		},
		showFaultSymptom: function(oEvent) {
			this.respOver();
			if (!this._ofaultSymptomPopover) {
				this._ofaultSymptomPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultSymptom", this);
				this._ofaultSymptomPopover.bindElement("/");
				this.getView().addDependent(this._ofaultSymptomPopover);
			}
			this._ofaultSymptomPopover.openBy(oEvent);
		},
		onCloseSysmptom:function(){
			if(this.getView().getModel("symptomModel")){
				this.getView().getModel("symptomModel").destroy();
				this.getView().getModel("symptomModel").refresh();
			}
//			this._ofaultSymptomPopover.destroy();
		},
		showPosition: function(oEvent) {
			this.respOver();
			if (!this._opositionPopover) {
				this._opositionPopover = sap.ui.xmlfragment("tfnswmfs.fragment.position", this);
				this._opositionPopover.bindElement("/");
				this.getView().addDependent(this._opositionPopover);
			}
			this._opositionPopover.openBy(oEvent);
		},
		onClosePosition:function(){
//			this._opositionPopover.destroy();
		},		
		showTemperature: function(oEvent) {
			this.respOver();
			if (!this._oTemperaturePopover) {
				this._oTemperaturePopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultTemperature", this);
				this._oTemperaturePopover.bindElement("/");
				this.getView().addDependent(this._oTemperaturePopover);
			}
			this._oTemperaturePopover.openBy(oEvent);
		},
		onCloseTemprature:function(){
//			this._oTemperaturePopover.destroy();
		},
		showWeather: function(oEvent) {
			this.respOver();
			if (!this._oWeatherPopover) {
				this._oWeatherPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultweather", this);
				this._oWeatherPopover.bindElement("/");
				this.getView().addDependent(this._oWeatherPopover);
			}
			this._oWeatherPopover.openBy(oEvent);
		},
		onCloseWeather:function(){
//			this._oWeatherPopover.destroy();
		},
		loadCarsFragment:function(carModel,that){
			var carContainer = this.getView().byId("carsContainer");
			var oCarFragment = sap.ui.xmlfragment("tfnswmfs.fragment.car", this);
			carContainer.bindAggregation("content", {
				path: "carModel>/carSet",
				template: oCarFragment,
				sorter: "carModel>/Posnr"
			});
		},
		onSelAuditType: function(oEvent){
			var selAuditType = this.getView().getModel("auditTypeModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var auditTypeField = this.getView().byId("auditType");
			auditTypeField.setValue(selAuditType.Zzdesc);
			auditTypeField.data("auditType",selAuditType.ZzauditType);
			this.getView().getModel("faultModel").oData.AuditType = selAuditType.ZzauditType;
			this.getView().getModel("faultModel").oData.AuditTypeDesc = selAuditType.Zzdesc;
			this._oauditTypePopover.close();
		},
		onSelSystem:function(oEvent){
			var qryFilter = "";
			var carId = this.getView().getModel("initModel").oData.carId;
			var selSystem = this.getView().getModel("majorSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var systemField = this.getView().byId("majorSystem");
			systemField.setValue(selSystem.Zzdescrption);
			systemField.data("majorSystem",selSystem.Zzmajorsystem)
			this.getView().getModel("faultModel").oData.MajorSystem = selSystem.Zzmajorsystem;
			this.getView().getModel("faultModel").oData.MjrsysDesc = selSystem.Zzdescrption;
			var subSystemField = this.getView().byId("subSystem");
			subSystemField.setValue("");
			subSystemField.data("subSystem","");
			this._omajorSystemPopover.close();
			if(this.getView().getModel("initModel").oData.set_car_sap){
				qryFilter +="?$filter=IvCarid eq '"+this.getSelectedCarByPosition()+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"' and ZZSYS_EGI eq ''";
			}else{
				qryFilter +="?$filter=IvCarid eq '"+this.getSelectedCarByPosition()+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"' and ZZSYS_EGI eq '"+selSystem.ZZSYS_EGI+"' ";
			}
//			qryFilter +="?$filter=IvCarid eq '"+this.getSelectedCarByPosition()+"' and IvMjrsystem eq '"+selSystem.Zzmajorsystem+"'";
			models.getPopOverModelWQFilter(this,'ETS_SUB_SYSTEM',qryFilter,"subSystemModel");
			models.searchOpenFaultsByFilter(this,"", this.getSelectedCarsString(),selSystem.Zzmajorsystem,"");
		},
		onSelSubSystem:function(oEvent){
			var selSubSystem = this.getView().getModel("subSystemModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var subSystemField = this.getView().byId("subSystem");
			subSystemField.setValue(selSubSystem.SubsysDesc);
			subSystemField.data("subSystem",selSubSystem.SubSystem)
			this.getView().getModel("faultModel").oData.SubSystem = selSubSystem.SubSystem;
			this.getView().getModel("faultModel").oData.SubsysDesc = selSubSystem.SubsysDesc;
			this._osubSystemPopover.close();
			this.toggleFormFieldRows(true);
//			Show Graffity field only if the SET is from SAP			
			this.getView().byId("graffitiRow").setVisible(!this.getView().getModel("initModel").oData.set_car_sap);
			models.searchOpenFaultsByFilter(this,"", this.getSelectedCarsString(),this.getView().getModel("faultModel").oData.MajorSystem,selSubSystem.SubSystem);			
		},
		onSelReportPhase:function(oEvent){
			var selReportPhase = this.getView().getModel("reportPhaseModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var reportPhaseField = this.getView().byId("reportPhase");
			reportPhaseField.setValue(selReportPhase.Zzdesc);
			reportPhaseField.data("reportPhase",selReportPhase.Zzrphase)
			this.getView().getModel("faultModel").oData.ReportPhase = selReportPhase.Zzrphase;
			this.getView().getModel("faultModel").oData.RepPhaseDesc = selReportPhase.Zzdesc;
			this._oreportPhasePopover.close();
		},
		onSelPosition:function(oEvent){
			var selPosition = this.getView().getModel("positionModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var positionField = this.getView().byId("fltPosition");
			positionField.setValue(selPosition.Zzdesc);
			positionField.data("fltPosition",selPosition.Zzcode)
			this.getView().getModel("faultModel").oData.Position = selPosition.Zzcode;
			this.getView().getModel("faultModel").oData.PositionDesc = selPosition.Zzdesc;
			this._opositionPopover.close();
		},
		onSelectTemperature:function(oEvent){
			var selTemp = this.getView().getModel("temperatureModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var tempField = this.getView().byId("temp");
			tempField.setValue(selTemp.Zzdesc);
			tempField.data("temp",selTemp.Zztemp)
			this.getView().getModel("faultModel").oData.Temperature = selTemp.Zztemp;
			this.getView().getModel("faultModel").oData.TempDesc = selTemp.Zzdesc;
			this._oTemperaturePopover.close();
		},
		onSelectWeather:function(oEvent){
			var selWeather = this.getView().getModel("weatherModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var weatherField = this.getView().byId("weather");
			weatherField.setValue(selWeather.Zzdesc);
			weatherField.data("weather",selWeather.Zzweather)
			this.getView().getModel("faultModel").oData.Weather = selWeather.Zzweather;
			this.getView().getModel("faultModel").oData.WeatherDesc = selWeather.Zzdesc;			
			this._oWeatherPopover.close();
		},
		onFltSrcChange: function(oEvent) {

			var selfltSource = this.getView().getModel("fltSourceModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var fltSourceField = this.getView().byId("faultSource");
			fltSourceField.setValue(selfltSource.Zzdesc);
			fltSourceField.data("fltSource",selfltSource.Zzfaultsrc)
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
				this.getView().byId("tsrNo").setValue("");
				AUDITset.setVisible(true);
				TPCset.setVisible(false);
				this.getView().byId("tpcNo").setValue("");
			} else if (faultSrc === "TPC") {
				TSRset.setVisible(false);
				this.getView().byId("tsrNo").setValue("");
				AUDITset.setVisible(false);
				this.getView().byId("auditNo").setValue("");
				this.getView().byId("auditType").setValue("");
				this.getView().byId("auditType").data("auditType","");
				TPCset.setVisible(true);
			} 
			else {
				gridLayout.setDefaultSpan("L12 M12 S12");
				TSRset.setVisible(false);
				AUDITset.setVisible(false);
				TPCset.setVisible(false);
			}
		},

		toggleExpand: function(buttonPressed) {
			var Expand = this.getView().byId("list_expand");
			var Collapse = this.getView().byId("list_collapse");
			var panel = this.getView().byId("panelOpenFault");
			if (buttonPressed.oSource.getText() === "Expand") {
				Expand.setVisible(false);
				Collapse.setVisible(true);
				panel.setVisible(true);
			} else if (buttonPressed.oSource.getText() === "Collapse") {
				Expand.setVisible(true);
				Collapse.setVisible(false);
				panel.setVisible(false);
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
		},
		toggleFormFieldRows:function(visibleFlag){
			this.getView().byId("reportPhaseRow").setVisible(visibleFlag);
			this.getView().byId("graffitiRow").setVisible(visibleFlag);
			this.getView().byId("rectifiedRow").setVisible(visibleFlag);
			this.getView().byId("commentsRow").setVisible(visibleFlag);

		},
		onPressGetTripID: function(oEvent){
			var setNo = this.getView().getModel("initModel").oData.setId;
			var tripIdField = this.getView().byId("tripID");
			var qryFilter = "";

			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
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
			if(!this.busyIndicatorCount){		    
				this.busyIndicatorCount = new sap.m.BusyDialog()
			}
			this.busyIndicatorCount.open();
			models.setTripId(this,qryFilter, "tripID");
			this.busyIndicatorCount.close();
		},
		onConfirmCars:function(oEvent){
			var vController = this;
			//this.getView().byId("car_select_confirm").setVisible(true);
			this.getView().byId("car_select_confirm").setEnabled(false);
			this.getView().byId("setorCar").setEnabled(false);
			this.freezeAllCars();
			this.getView().byId("car_select_all").setEnabled(false);
			this.getView().byId("car_dSelect_all").setEnabled(false);
			this.getView().byId("faultSubmitButton").setEnabled(true);

			this.toggleSearchFieldRows(true);
			var qryFilter = "";
			if(vController.getView().getModel("initModel").oData.set_car_sap){
				qryFilter ="?$filter=Zzcarid eq '"+vController.getSelectedCarByPosition()+"' and Zzcar_egi eq '' &$format=json";
			}else{
				qryFilter ="?$filter=Zzcarid eq '"+vController.getSelectedCarByPosition()+"' and Zzcar_egi eq '"+vController.getSelectedEGIByPosition()+"' &$format=json";
			}

			models.getPopOverModelWQFilter(this,'ETS_MAJOR_SYSTEM',qryFilter,"majorSystemModel");
			models.searchOpenFaultsByFilter(this,"", this.getSelectedCarsString(),"","");			
		},
		onPressCancel:function(oEvent){
			var vController = this;
			sap.m.MessageBox.show(this.mFSMsg.getProperty("cancelTransaction"),{
				icon: this.mFSMsg.getProperty("popWarning"), 
				title: this.mFSMsg.getProperty("popTitleValidation"), 
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(oAction){
					if(oAction === sap.m.MessageBox.Action.YES){
						if(vController.getView().getModel("faultModel"))
							vController.getView().getModel("faultModel").destroy();
						if(vController.getView().getModel("initModel"))
							vController.getView().getModel("initModel").destroy();
						if(vController.getView().getModel("ValueHelpModel"))
							vController.getView().getModel("ValueHelpModel").destroy();
						if(vController.getView().getModel("carModel"))
							vController.getView().getModel("carModel").destroy();

						if(vController.routeData.fromView === "mfsSearch"){
							vController.router.navTo("Search",true);
						}else if(vController.routeData.fromView === "mfsInfo"){
							vController.router.navTo("Info",true);
						}else if(vController.routeData.fromView === "mfsUpdate"){
							vController.router.navTo("Search",true);
						}else if(vController.routeData.fromView === "jobCard"){
							var app = sap.ui.getCore().byId("App");
							app.to("jobCard");
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
				contentWidth:'60%',
				contentHeight:'40%',
				content: new sap.m.Image({ src: mainDataModel.sServiceUrl+"/ETS_POS_HELP(qmnum='1')/$value" }),
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
			var primaryCar = this.getSelectedCarByPosition();
			var carSet = this.getView().getModel("carModel").oData.carSet;
			var carSetArr =[]
			for(var i=0;i<carSet.length;i++){
				if(carSet[i].Carid === carSet[i].selected && carSet[i].Carid !== primaryCar){
					var car = {
							"CarId" : "",
							"SetId" : ""
					}
					car.CarId = carSet[i].Carid;
					car.SetId = carSet[i].Setid;
					this.getView().getModel("faultModel").oData.Setid = carSet[i].Setid;
					carSetArr.push(car);
				}
			}

			if(this.validateInput(this)){
				this.getView().getModel("faultModel").oData.Setid = this.initData.setId;
				this.getView().getModel("faultModel").oData.Carid = primaryCar;
				this.getView().getModel("faultModel").oData.NAV_FAULT_CAR = carSetArr;

				this.getView().getModel("faultModel").oData.FftrDesc = (this.getView().byId("faultRectified").getSelected() ?"X" : "");
				var faultDateVal = this.getView().byId("fltDate").getDateValue();
				var offsetHours	 = Math.round(Math.abs(faultDateVal.getTimezoneOffset()/60));
				var fromDateWoffSet = faultDateVal.setHours(faultDateVal.getHours()+offsetHours);

				var fltDate = new Date(this.getView().byId("fltDate").getDateValue());
				var fltTime = new Date(this.getView().byId("fltTime").getDateValue());
				var hour = fltTime.getHours(); // get hours from the date value
				var minutes = fltTime.getMinutes(); //get minutes from the date value
				var seconds = fltTime.getSeconds(); //get seconds from the date value
				if(seconds<10) {seconds = "0"+seconds;}

				this.getView().getModel("faultModel").oData.FaultDate = "\/Date("+fromDateWoffSet+")\/";
				this.getView().getModel("faultModel").oData.FaultTime = ( "PT"+hour+"H"+minutes+"M"+seconds+"S");

				var fltSourceField = this.getView().byId("faultSource");
				var faultSrc = fltSourceField.data("fltSource");
				if (faultSrc === "TSR") {
					this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("tsrNo").getValue();
				} else if (faultSrc === "AUDIT") {
					this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("auditNo").getValue();
				} else if (faultSrc === "TPC") {
					this.getView().getModel("faultModel").oData.AuditNum =  this.getView().byId("tpcNo").getValue();
				} 
				this.getView().getModel("faultModel").oData.ReportPhase = this.getView().byId("reportPhase").data("reportPhase");
				this.getView().getModel("faultModel").oData.RepPhaseDesc = this.getView().byId("reportPhase").getValue();

				models.postNotification(this,this.getView().getModel("faultModel").oData,this.mFSMsg,this.router,"Create");
			}

		},
		validateInput:function(vController){
			var valFlag = false;
			var valMsg = "";
			var fltSourceField = this.getView().byId("faultSource");

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
			} else if (this.getView().getModel("faultModel").oData.MajorSystem   ==="") {
				valMsg = vController.mFSMsg.getProperty("mandMjrSysMSG");
				valFlag = true;
			} else if (this.getView().getModel("faultModel").oData.SubSystem  ==="") {
				valMsg = vController.mFSMsg.getProperty("mandSubSysMSG");
				valFlag = true;
			} else if (this.getDaysDifference(this.getView().byId("fltDate").getDateValue()) < -28) {
				valMsg = vController.mFSMsg.getProperty("fltDatePast");
				valFlag = true;
			}else if (this.getDaysDifference(this.getView().byId("fltDate").getDateValue()) > 0) {
				valMsg = vController.mFSMsg.getProperty("fltDateFuture");
				valFlag = true;
			}
			if(valFlag){
				sap.m.MessageBox.show(valMsg,{
					icon: this.mFSMsg.getProperty("popError"), 
					title: this.mFSMsg.getProperty("popTitleError"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {return false}
				});
				return false;
			}else{
				return true;
			}
		},
		getDaysDifference:function(faultDate){
			var currentDate = new Date().setHours(0,0,0,0);;
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
		},
		onSelectSymptom:function(oEvent){
			var selSymptom = this.getView().getModel("symptomModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			var symptomField = this.getView().byId("fltSymptom");
			this.getView().getModel("faultModel").oData.Qmcod = selSymptom.Code;;
			this.getView().getModel("faultModel").oData.QmcodDesc = selSymptom.CodeText;
			symptomField.setValue(this.getView().getModel("faultModel").oData.QmgrpDesc+" - "+this.getView().getModel("faultModel").oData.QmcodDesc);
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
//		To get the 1st car from selected list sorted by position		
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
			var sPath = oEvent.getSource().getParent().getSwipedItem().getBindingContextPath();
			var faultRecord = this.getView().getModel("openFaultsModel").getProperty(sPath);
			var detailModel = new sap.ui.model.json.JSONModel();
			detailModel.setData(faultRecord);
			if (! this._oDetailDialog) {
				this._oDetailDialog = sap.ui.xmlfragment("tfnswequip.tfnswmfs.fragment.faultDetail", this);
			}
			this.getView().addDependent(this._oDetailDialog);
			this._oDetailDialog.open();
			this._oDetailDialog.setModel(detailModel,"detailModel");
		},
		onCloseDetailDialog:function(oEvent){
			this._oDetailDialog.close();
		},
		tableButtonToggle:function(vController, toggleFlag){
			var Expand = vController.getView().byId("list_expand");
			var Collapse = vController.getView().byId("list_collapse");
			var panel = vController.getView().byId("panelOpenFault");
			Expand.setVisible(!toggleFlag);
			Collapse.setVisible(toggleFlag);
			panel.setVisible(toggleFlag);
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
			var car = "";
			for(var i=0; i<count; i++){
				carsGroup[i].setEnabled(false);
			}
		},
	});
});