sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleanedBy", {

		onInit : function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);	
			},

		onNavBack : function() {
			history.go(-1);
		},

		handleItemPress : function(evt) {
			var a = evt.getParameters().listItem;

			var b = a.getBindingContext().getObject().Zzcleanedby;
			var c = this.getView().getParent();
			var graffitiPage = c.getPage("__component0---CleanGraffiti");
			var cleanedBy = graffitiPage.byId("cleanedByInput");
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.clean.cleanedBy = b;
			oModel.setData(oData);
			oModel.refresh(true);
			this.onNavBack();

		},
		handleRouteMatched : function() {
			var oModel = sap.ui.getCore().getModel("modelView");
			var oList = this.getView().byId("cleanedBy");
			oList.setModel(oModel);

			oList.bindAggregation("items", "/cleanedByValues",
					new sap.m.StandardListItem({
						title : "{Zzcleanedby}",
						//description : "{Ktext}",
						type : "Active"
					}));

		}
	});
}, /* bExport= */ true);