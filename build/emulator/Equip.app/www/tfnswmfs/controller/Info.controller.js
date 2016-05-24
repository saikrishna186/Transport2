sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models"
               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Info", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf tfnswmfs.webapp.view.Info
		 */
		onInit: function(){

			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
		},
		_handleRouteMatched: function(evt){
			if(evt.getParameter("name") !== "Info"){
				return;
			}
			models.initInfoMsg(this);
		},


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf tfnswmfs.webapp.view.Info
		 */
		onBeforeRendering: function() {
//			var infoButton = this.getView().byId("s_info");
//			infoButton.focus();
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf tfnswmfs.webapp.view.Info
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf tfnswmfs.webapp.view.Create
		 */
		//	onExit: function() {
		//
		//	}
		onPressNavToCreate: function(){
//			this.router.navTo("Create");
			this.router.navTo("Create",{
				fromView:"mfsInfo",
				setId:"mfsInfo",
				carId:"mfsInfo",
				inspType:"mfsInfo",
				shiftName:"mfsInfo"
				},true);
		},
		onPressNavToSearch: function() {
			this.router.navTo("Search");
		},
		toTileHome: function(evt){
			this.getOwnerComponent().app.to("tileHome");
		},
	});
});