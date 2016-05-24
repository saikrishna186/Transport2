sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleaningLocation", {

		onInit : function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);	
			},

		onNavBack : function() {
			history.go(-1);
		},

		handleItemPress : function(evt) {
			

			var a = evt.getParameters().listItem;

			var b = a.getBindingContext().getObject().Stand;
			var cleanLocDesc = a.getBindingContext().getObject().Ktext;
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;
			var graffitiPage = c.getPage(component+"---CleanGraffiti");
			var controller = graffitiPage.oController;
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.cleanLoc = b;
			oData.cleanLocDesc = cleanLocDesc;
			oModel.setData(oData);
			oModel.refresh(true);
			controller.errorLoc = false;
			var location = graffitiPage.byId("CleaningLocationInput");
			location.setValueState("None");
			location.setValueStateText("");
			if((!controller.errorLoc)&&(!controller.errorSet))
				{
				controller.enableTabs();
				}
			
			this.onNavBack();

		},

		handleValueHelpSearch : function(evt) {
			var sValue = evt.getSource().getValue();
			var oFilter = new sap.ui.model.Filter("Stand",
					sap.ui.model.FilterOperator.Contains, sValue);
			var oTable = this.byId("CleanLoc");
			oTable.getBinding("items").filter([ oFilter ]);
		},

		handleRouteMatched : function() {
			var oModel = sap.ui.getCore().getModel("modelView");
			var oList = this.getView().byId("CleanLoc");
			oList.setModel(oModel);

			oList.bindAggregation("items", "/matValues",
					new sap.m.StandardListItem({
						title : "{Stand}",
						description : "{Ktext}",
						type : "Active"
					}));

		}
	});
}, /* bExport= */true);