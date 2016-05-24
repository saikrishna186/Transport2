jQuery.sap.require("tfnswequip.tfnswmfs.util.formatter");
sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Search", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tfnswmfs.webapp.view.Search
		 */		
		onInit: function() {
			this.mFSMsg = this.getOwnerComponent().getModel("mFSMsg");
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.firstTime = true;
			this.mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			var vController = this;

			var valueHelpData = this.getOwnerComponent().getModel("ValueHelpModel");
			this.getView().setModel(valueHelpData, "valueHelpData");

			models.getPopOverModel(vController,'ETS_PRIORITY',"priorityModel");
			models.getPopOverModel(vController,'ETS_STATUS',"statusModel");

		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Search") {
				return;
			}

			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			if(valueHelpData.setNo !== ""){
				this.getView().byId("setNo").setValue(valueHelpData.setNo);	
			}
			if(valueHelpData.carNo !== ""){
				this.getView().byId("carNo").setValue(valueHelpData.carNo);
			}
			if(this.getView().byId("faultStatus") && this.getView().byId("faultStatus").getValue() === ""){
				this.getView().byId("faultStatus").setValue("Open");
				this.getView().byId("faultStatus").data("status","1");
			}
		},
		onBeforeRendering: function() {

		},
		onAfterRendering: function() {
			var controller = this;
			if (this.firstTime) {
				this.getView().byId("faultPriority").ontouchstart = function(){controller.showFPriority(this)}; 
				this.getView().byId("faultStatus").ontouchstart = function(){controller.showFStatus(this)};
				this.firstTime = false;
			}
		},
		onExit: function() {
			if (this._oPriorityPopover) {
				this._oPriorityPopover.destroy();
			}
			if (this._oStatusPopover) {
				this._oStatusPopover.destroy();
			}
		},
		onPressAdvancedSearch: function() {
			var advSearchLayout = this.getView().byId("advSearchFields");
			var advSearchButton = this.getView().byId("ShowAdvSearchButton");
			var hideAdvSearchButton = this.getView().byId("HideAdvSearchButton");
			advSearchLayout.setVisible(true);
			advSearchButton.setVisible(false);
			hideAdvSearchButton.setVisible(true);
		},
		onPressHideAdvancedSearch: function() {
			var advSearchLayout = this.getView().byId("advSearchFields");
			var advSearchButton = this.getView().byId("ShowAdvSearchButton");
			var hideAdvSearchButton = this.getView().byId("HideAdvSearchButton");

			advSearchLayout.setVisible(false);
			advSearchButton.setVisible(true);
			hideAdvSearchButton.setVisible(false);
		},
		respOver:function(){
			if($(".respOver")){
				for(var i=0;i<$(".respOver").length;i++){
					$(".respOver")[i].childNodes[0].readOnly = true;
				}
			}
		},
		onPressSearch: function() {
			var fromDate 		= this.getView().byId("fromDate");
			var toDate 			= this.getView().byId("toDate");
			var fromDateVal 	= fromDate.getDateValue();
			var toDateVal 		= toDate.getDateValue();

			var faultID 		= this.getView().byId("faultID").getValue();
			var faultStatus 	= this.getView().byId("faultStatus").data("status");
			var carNo 			= this.getView().byId("carNo").getValue();
			var setNo 			= this.getView().byId("setNo").getValue();
			var faultPriority 	= this.getView().byId("faultPriority").data("priority");

			var entitySet 		= "ETS_FAULT";
			var faultsCount 	= "";
			var faultsHeaderTitle = "";		
			var filters 		= [];
			var that 			= this;

			if(carNo === "" && setNo === "" && faultID === ""){
				sap.m.MessageBox.show(this.mFSMsg.getProperty("carSetMandatory"),{
					icon: this.mFSMsg.getProperty("popError"), 
					title: this.mFSMsg.getProperty("popTitleValidation"), 
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function() {
						//Do nothing
					}
				});	
			}else{
				if(faultID && faultID !== ""){
					filters.push(new sap.ui.model.Filter("Qmnum", sap.ui.model.FilterOperator.EQ, faultID));
				}
				if(setNo && setNo !== ""){
					filters.push(new sap.ui.model.Filter("Setid", sap.ui.model.FilterOperator.EQ, setNo.toUpperCase()));
				}
				if(carNo && carNo !== ""){
					filters.push(new sap.ui.model.Filter("Carid", sap.ui.model.FilterOperator.EQ, carNo));
				}
				if(fromDateVal && fromDateVal !== ""){
					var offFromsetHours = Math.round(Math.abs(fromDateVal.getTimezoneOffset()/60));
					var fromDateWoffSet 	= fromDateVal.setHours(fromDateVal.getHours()+offFromsetHours);
					filters.push(new sap.ui.model.Filter("SrchFromDate", sap.ui.model.FilterOperator.EQ, fromDateWoffSet));
				}
				if(toDateVal && toDateVal !== ""){
					var offTosetHours 	= Math.round(Math.abs(toDateVal.getTimezoneOffset()/60));
					var toDateWoffSet 		= toDateVal.setHours(toDateVal.getHours()+offTosetHours);
					filters.push(new sap.ui.model.Filter("SrchToDate", sap.ui.model.FilterOperator.EQ, toDateWoffSet));
				}
				if(faultStatus && faultStatus !== ""){
					filters.push(new sap.ui.model.Filter("FaultUserStat", sap.ui.model.FilterOperator.EQ, faultStatus));				
				}
				if(faultPriority && faultPriority !== ""){
					filters.push(new sap.ui.model.Filter("Priority", sap.ui.model.FilterOperator.EQ, faultPriority));						
				}

				var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
				var faultsModel = new sap.ui.model.json.JSONModel();

				if(!this.busyIndicatorCount){		    
					this.busyIndicatorCount = new sap.m.BusyDialog()
				}
				this.busyIndicatorCount.open();

				mainDataModel.read(entitySet,{
					success: function(data, response) {
						faultsModel.setData({
							listitems: data.results
						});

						faultsCount = data.results.length;
						faultsModel.setSizeLimit(faultsCount);
						faultsHeaderTitle = (faultsCount === 1 ? "Found 1 fault" : "Found " + faultsCount + " faults");
						that.getView().byId("ResultsRecordbar").setHeaderText(faultsHeaderTitle);
						that.getView().setModel(faultsModel, "faultsModel");
						that.busyIndicatorCount.close();
					},
					error: function(oError) {
						faultsModel.setData({
							listitems: {}
						});
						that.getView().setModel(faultsModel, "faultsModel");
						that.busyIndicatorCount.close();
					},
					filters: filters
				});

				var searchResultsPanel = this.getView().byId("ResultsRecordbar");
				searchResultsPanel.setVisible(true);				
			}
//			End of Validating filter parameters.	
		},
		onPressClear: function() {
			var fid = this.getView().byId("faultID");
			var fstat = this.getView().byId("faultStatus");
			var cno = this.getView().byId("carNo");
			var sno = this.getView().byId("setNo");
			var fdate = this.getView().byId("fromDate");
			var tdate = this.getView().byId("toDate");
			var fpty = this.getView().byId("faultPriority");

			fid.setValue("");
			fstat.setValue("Open"); fstat.data("status","1");
			cno.setValue("");
			sno.setValue("");
			fdate.setValue("");
			tdate.setValue("");
			fdate.setDateValue("");
			tdate.setDateValue("");
			fpty.setValue(""); fpty.data("priority","");
			if($(".clearable").children()[1]){
				$(".clearable").children()[1].remove()
			}
		},
		onPressNavToCreate: function() {
//			this.router.navTo("Create");
			this.router.navTo("Create",{
				fromView:"mfsSearch",
				setId:"mfsSearch",
				carId:"mfsSearch",
				inspType:"mfsSearch",
				shiftName:"mfsSearch"
				});
			
		},
		onPressNavToInfo: function() {
			this.router.navTo("Info");
		},
		showFPriority: function(oEvent) {	
			this.respOver ();
//			if (!this._oPriorityPopover) {
			this._oPriorityPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultPriority", this);
			this._oPriorityPopover.bindElement("/");
			this.getView().addDependent(this._oPriorityPopover);
//			}
			this._oPriorityPopover.openBy(oEvent);
		},
		onCloseFaultPriority:function(){
			this._oPriorityPopover.destroy();
		},
		onCloseFaultStatus:function(){
			this._oStatusPopover.destroy();
		},
		fromDateSelected: function() {

			var fromDate = this.getView().byId("fromDate");
			var toDate = this.getView().byId("toDate");
			var fromDateVal = fromDate.getDateValue()
			var toDateVal = toDate.getDateValue();

			if(toDateVal === "" || !toDateVal || toDate.getValue() === ""){
				var dat = new Date(fromDate.getDateValue());
				dat.setDate(dat.getDate() + 60);
				toDate.setDateValue(dat);
			}
		},
		toDateSelected: function() {
			var fromDate = this.getView().byId("fromDate");
			var toDate = this.getView().byId("toDate");
			var fromDateVal = fromDate.getDateValue()
			var toDateVal = toDate.getDateValue();

			if(fromDateVal === "" || !fromDateVal || fromDate.getValue() === ""){
				var dat = new Date(toDate.getDateValue());
				dat.setDate(dat.getDate() - 60);
				fromDate.setDateValue(dat);
			}
		},

		showFStatus: function(oEvent) {
			this.respOver();
//			if (!this._oStatusPopover) {
			this._oStatusPopover = sap.ui.xmlfragment("tfnswmfs.fragment.faultStatus", this);
			this._oStatusPopover.bindElement("/");
			this.getView().addDependent(this._oStatusPopover);
//			}
			this._oStatusPopover.openBy(oEvent);
		},
		onClickSetHelp: function() {
			var ValueHelp = {
					"fromView": "Search",
					"searchField": "setNo",
					"setNo": this.getView().byId("setNo").getValue().toUpperCase(),
					"carNo": ""
			};
			this.getOwnerComponent().getModel("ValueHelpModel").setData(ValueHelp);
			this.router.navTo("ValueHelper");
		},
		onClickCarHelp: function() {
			var ValueHelp = {
					"fromView": "Search",
					"searchField": "carNo",
					"setNo": this.getView().byId("setNo").getValue().toUpperCase(),
					"carNo": this.getView().byId("carNo").getValue().toUpperCase()
			};
			this.getOwnerComponent().getModel("ValueHelpModel").setData(ValueHelp);
			this.router.navTo("ValueHelper");
		},
		onUpdateFault: function(oEvent) {
			var selFault = this.getView().getModel("faultsModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);
			this.router.navTo("Update",{
				faultId:selFault.Qmnum,
				fromView:"mfsSearch"
				},true);
		},
		onSelectStatus:function(oEvent){
			var selStatus = this.getView().getModel("statusModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var statusField = this.getView().byId("faultStatus");
			statusField.setValue(selStatus.Description);
			statusField.data("status",selStatus.Status)
			this._oStatusPopover.close();
		},
		onSelectPriority:function(oEvent){
			var selPriority = this.getView().getModel("priorityModel").getProperty(oEvent.getSource().getBinding("items").getContexts()[oEvent.getSource().indexOfItem(oEvent.getParameters().listItem)].sPath);;
			var priorityField = this.getView().byId("faultPriority");
			priorityField.setValue(selPriority.Zzpriokx);
			priorityField.data("priority",selPriority.Zzpriok)
			this._oPriorityPopover.close();
		},
		getDays:function(fromDate,toDate){
			var fromDate2 = new Date(fromDate);
			var toDate2 = new Date(toDate);
			var dateDiff = Math.abs(toDate2 - fromDate2);
			var oneDay = 1000 * 60 * 60 * 24;
			return Math.round(dateDiff/oneDay)
		}

	});
});