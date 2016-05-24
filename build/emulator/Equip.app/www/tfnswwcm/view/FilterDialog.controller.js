sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.FilterDialog", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onPresscancelFilter: function() {
			this._oDialog.destroy();
		},
		onExit: function() {
			this._oDialog.destroy();
		}

	});
}, /* bExport= */ true);