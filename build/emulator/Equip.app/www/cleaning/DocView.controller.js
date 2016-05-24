sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
		"use strict";

		return BaseController.extend("tfnsw.eam.cleaning.view.DocView", {


/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnsw.eam.cleaning.view.DocView
*/
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
		
		this.myModel = new sap.ui.model.json.JSONModel();
		
		
		
		},
		onNavBack: function() {
			history.go(-1);
		},
		_handleRouteMatched: function(evt){
			if(evt.getParameter("name") !== "DocView"){
				return;
			}
			var docValue = evt.getParameters().arguments.docValue;
			var docViewTemp = this.getView();
			var pdf_url = sUrl
					+ "/ETS_GET_ATTACH_CONTENTS(SoObjNo='"
					+ docValue + "')/$value";
			docViewTemp
					.byId("html_page")
					.setContent(
							'<iframe src= "'
									+ pdf_url
									+ '" width="100%" height="100%"></iframe>');
			this.onNavBack();
			
			
		},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnsw.eam.cleaning.view.DocView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnsw.eam.cleaning.view.DocView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnsw.eam.cleaning.view.DocView
*/
//	onExit: function() {
//
//	}
		});
}, /* bExport= */ true);