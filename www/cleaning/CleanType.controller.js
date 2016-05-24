sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleanType", {

		
		onInit : function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);	
			},

		onNavBack : function() {
			var cleanTypeTable = this.getView().byId("cleanTypeTable");
			cleanTypeTable.removeSelections(true);
			history.go(-1);
		},

		onAccept : function(evt) {
			
			var component = this.getView().getParent().getPages()[0]._sOwnerId;
			var graffitiPage = this.getView().getParent().getPage(component+"---CleanGraffiti");
			var cleanType = graffitiPage.byId("cleanTypeInput");
			var cleanTypeTable = this.getView().byId("cleanTypeTable");
			var oItem = evt.getParameter("listItem").getBindingContext().getObject();
	        var code = oItem.Zzcleantype;
	        var desc = oItem.ZzcleanDesc;
	        cleanType.setValue(desc);
	        cleanType.data("code",code);
			graffitiPage.oController.settingTokens();
			graffitiPage.oController.cleanTypeCars();
			this.onNavBack();
			

		},
		handleRouteMatched : function() {
			var oModel = sap.ui.getCore().getModel("modelView");
			var oList = this.getView().byId("cleanTypeTable");
			oList.setModel(oModel);
			}
	});
}, /* bExport= */ true);