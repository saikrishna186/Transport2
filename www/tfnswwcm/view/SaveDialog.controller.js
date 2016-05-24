jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.SaveDialog", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf view.SaveDialog
		 */
		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit :function (){
			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var prevSelection = mainData.prevSelectedTab;
			var currentSelection = mainData.selectedTab;
			mainData.selectedTab = prevSelection;
			mainModel.refresh();
			this._oDialog.close();
		},
		onSave: function() {

			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var prevSelection = mainData.prevSelectedTab;
			var currentSelection = mainData.selectedTab;
			var wholetab = this.getView().data("source");
			if(prevSelection != "9"){
				var prevdArray = prevSelection - 1;
				if(mainData.wheelsData[prevdArray].RimMeasurement !="" && mainData.wheelsData[prevdArray].FlangeMeasurement !=""){
					/*wholetab.getItems()[prevdArray].setIcon("sap-icon://accept");
			wholetab.getItems()[prevdArray].setIconColor("Positive");*/
					mainData.wheelsData[prevdArray].icon = "A" ;
					mainData.wheelsData[prevdArray].iconClr = "P" ;
					if((mainData.selectedTabs.indexOf(currentSelection))== -1){
						mainData.selectedTabs.push(currentSelection);
						mainData.selectedCount++
					}
				}
				else{
					mainData.wheelsData[prevdArray].icon = "X" ;
					mainData.wheelsData[prevdArray].iconClr = "D" ;
				}
			}
			mainData.prevSelectedTab = currentSelection;
			mainModel.refresh();
			this._oDialog.close();

		},
		onDontSave : function (){

			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var prevSelection = mainData.prevSelectedTab;
			var currentSelection = mainData.selectedTab;
			var prevdArray = prevSelection - 1;
			mainData.wheelsData[prevdArray].RimMeasurement ="" ;
			mainData.wheelsData[prevdArray].FlangeMeasurement ="" ;
			mainData.prevSelectedTab = currentSelection;
			mainData.wheelsData[prevdArray].icon = "X" ;
			mainData.wheelsData[prevdArray].iconClr = "D" ;
			mainModel.refresh();
			this._oDialog.close();

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf view.SaveDialog
		 */
//		onBeforeRendering: function() {

//		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf view.SaveDialog
		 */
//		onAfterRendering: function() {

//		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf view.SaveDialog
		 */
//		onExit: function() {

//		}

	});
}, /* bExport= */ true);