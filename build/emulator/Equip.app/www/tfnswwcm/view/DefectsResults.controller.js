jQuery.sap.require("tfnsw.erp.wcm.util.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.erp.wcm.view.DefectsResults", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit :function (){

			this._oDialog.close();
		},
		onSave: function() {

			this._oDialog.close();
		},
	});
}, /* bExport= */ true);