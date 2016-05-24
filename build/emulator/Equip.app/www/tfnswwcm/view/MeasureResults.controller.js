jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.MeasureResults", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.FlangDialog
		 */
//		onInit: function() {
		//
//		},


		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},
		onExit :function (){

			this._oDialog.close();
		},
		onSave: function() {
			var prevController = this.getView().data("controller");
			var errorFlag = this.getView().data("errorFlag");
			if(!errorFlag){
				prevController.viewRefresh();
			}
			this._oDialog.close();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf view.FlangDialog
		 */
//		onBeforeRendering: function() {
		//
//		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf view.FlangDialog
		 */
//		onAfterRendering: function() {
		//
//		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf view.FlangDialog
		 */
//		onExit: function() {
		//
//		}

	});
}, /* bExport= */ true);