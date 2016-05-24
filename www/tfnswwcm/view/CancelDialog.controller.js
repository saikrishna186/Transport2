sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.erp.wcm.view.CancelDialog", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		_onPressNpsapmButton14533360155561BU: function() {
			this.getView().getContent()[0].close();
		},
		_onPressNpsapmButton14533360190761BW: function() {
			this.getView().getContent()[0].close();
		}
	});
}, /* bExport= */ true);