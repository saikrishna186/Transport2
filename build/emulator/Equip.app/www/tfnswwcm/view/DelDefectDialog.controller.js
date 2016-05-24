sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.erp.wcm.view.DelDefectDialog", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		pressDeleteDefectDelete: function() {
			this.getView().getContent()[0].close();
		},
		pressDeleteDefectCancel: function() {
			this.getView().getContent()[0].close();
		}

	});
}, /* bExport= */ true);