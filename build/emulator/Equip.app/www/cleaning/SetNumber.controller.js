sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.SetNumber", {

		onInit : function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);	
			},

		onNavBack : function() {
			history.go(-1);
		},

		handleItemPress : function(evt) {
			

			var a = evt.getParameters().listItem;
			var b = a.getBindingContext().getObject().Zzsetid;
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;
			var graffitiPage = c.getPage(component+"---CleanGraffiti");
			var controller = graffitiPage.oController;
			controller.errorSet = false;
			var set = graffitiPage.byId("setInput");
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.set = b;
			oModel.setData(oData);
			oModel.refresh(true);
			//set.setValue(b);
			set.setValueState("None");
			set.setValueStateText("");
			if((!controller.errorLoc)&&(!controller.errorSet))
				{
				controller.enableTabs();
				}
			controller.getCars();
			this.onNavBack();

		},

		handleValueHelpSearch : function(evt) {
			var sValue = evt.getSource().getValue();
			var oFilter = new sap.ui.model.Filter("Zzsetid",
					sap.ui.model.FilterOperator.Contains, sValue);
			var oTable = this.byId("SetNumber");
			oTable.getBinding("items").filter([ oFilter ]);
		},

		handleRouteMatched : function() {
			/*
			 * var controller = this; var path =
			 * oEvent.getParameter("arguments").context;
			 * this.getView().data("source",path);
			 */

			var oModel = sap.ui.getCore().getModel("modelView");
			var oList = this.getView().byId("SetNumber");
			oList.setModel(oModel);

			oList.bindAggregation("items", "/setValues",
					new sap.m.StandardListItem({
						title : "{Zzsetid}",
						type : "Active"
					}));

		}
	});
}, /* bExport= */true);