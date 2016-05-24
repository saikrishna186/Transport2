sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "sap/ui/model/json/JSONModel"
               ], function(Controller) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.ValueHelper", {
		onInit: function() {

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.fromView = "";
		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "ValueHelper") {
				return;
			}
			this.dynamicSearch(this);
		},
		onAfterRendering: function() {},
		dynamicSearch: function(that) {
			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			this.getView().setModel(valueHelpModel,"ValueHelpModel");

			this.fromView = valueHelpData.fromView;
			this.getView().byId("setNo").setValue(valueHelpData.setNo);

			var mainDataModel = this.getOwnerComponent().getModel("mainDataModel");

			var filters = new Array(); 
			var filtersetId = "";
			var filtercarId = "";
			var that = this;
			var setResultsPanel = this.getView().byId("setResultsPanel");
			var carResultsPanel = this.getView().byId("carResultsPanel");
			
			if(!that.busyIndicatorCount){		    
				that.busyIndicatorCount = new sap.m.BusyDialog()
			}
			
			if(that.getView().getModel("carIdModel")){
				that.getView().getModel("carIdModel").oData ={};
				that.getView().getModel("carIdModel").refresh();
			}
			if(that.getView().getModel("setIdModel")){
				that.getView().getModel("setIdModel").oData ={};
				that.getView().getModel("setIdModel").refresh();
			}
			if(valueHelpData.searchField === "setNo"){
				setResultsPanel.setVisible(true);
				carResultsPanel.setVisible(false);
			}else if(valueHelpData.searchField === "carNo"){
				setResultsPanel.setVisible(false);
				carResultsPanel.setVisible(true);
			}
			if (valueHelpData.searchField === "setNo" && valueHelpData.setNo !== "") {
				var entitySet = "ETS_SETID";
				if(valueHelpData.setNo !== ""){
					entitySet = entitySet + "?$filter=SetId eq '"+valueHelpData.setNo+"'"
				}else{
					entitySet = entitySet + "?$filter=SetId eq '*'"
				}  	
				var setIdModel = new sap.ui.model.json.JSONModel();
				that.busyIndicatorCount.open();
				mainDataModel.read(entitySet, {
					success: function(data, response) {
						setIdModel.setData({
							listitems: data.results
						});
						that.getView().setModel(setIdModel, "setIdModel");
						that.busyIndicatorCount.close();
					},
					error: function(oError) {
						setIdModel.setData({
							listitems: {}
						});
						that.getView().setModel(setIdModel, "setIdModel");
						that.busyIndicatorCount.close();
					}
				});
			} else if (valueHelpData.searchField === "carNo" && valueHelpData.setNo !== "") {
				var entitySet = "ETS_CARIDS";
				if(valueHelpData.setNo !== ""){
					entitySet = entitySet + "?$filter=SetId eq '"+valueHelpData.setNo+"'"
				}  

				var carIdModel = new sap.ui.model.json.JSONModel();
				that.busyIndicatorCount.open();
				mainDataModel.read(entitySet,{
					success: function(data, response) {
						carIdModel.setData({
							listitems: data.results
						});
						that.getView().setModel(carIdModel, "carIdModel");	
						that.busyIndicatorCount.close();
					},
					error: function(oError) {
						setIdModel.setData({
							listitems: {}
						});
						that.getView().setModel(carIdModel, "setIdModel");
						that.busyIndicatorCount.close();
					}
				});
			}
		},
		onNavBack: function() {
			if (this.fromView ==="") {
				this.router.navTo("Search");
			} else {
				this.router.navTo(this.fromView);
			}
		},
		onSelectionsetNo: function(evnt){
			var selSet = this.getView().getModel("setIdModel").getProperty(evnt.getSource().getBinding("items").getContexts()[evnt.getSource().indexOfItem(evnt.getParameters().listItem)].sPath);
			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			valueHelpData.setNo =  selSet.SetId;
			valueHelpData.carNo =  "";
			this.router.navTo(valueHelpData.fromView,true);
		},
		onSelectionscarNo:function(evnt){
			var selCar = this.getView().getModel("carIdModel").getProperty(evnt.getSource().getBinding("items").getContexts()[evnt.getSource().indexOfItem(evnt.getParameters().listItem)].sPath);
			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			valueHelpData.setNo = selCar.SetId;
			valueHelpData.carNo =  selCar.CarId;
			this.router.navTo(valueHelpData.fromView,true);
		},
		searchSetNo: function(evnt){
			var valueHelpModel = this.getOwnerComponent().getModel("ValueHelpModel");
			var valueHelpData = valueHelpModel.oData;
			valueHelpData.setNo = this.getView().byId("setNo").getValue().toUpperCase();
			this.getView().setModel(valueHelpModel,"ValueHelpModel");
			this.dynamicSearch(this);
		}
	});
});