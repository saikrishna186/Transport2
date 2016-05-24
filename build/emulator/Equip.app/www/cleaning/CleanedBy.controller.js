sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleanedBy", {

		/*onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		_onPressNpsapmButton14502431265172RD: function() {
			this.getView().getContent()[0].close();
		},
		_onPressNpsapmButton14502431139912R9: function() {
			this.getView().getContent()[0].close();
		}*/
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
			//cleanedBy.setValue(b);
			this.onNavBack();

		},

		/*handleValueHelpSearch : function(evt) {
			var sValue = evt.getSource().getValue();
			var oFilter = new sap.ui.model.Filter("Stand",
					sap.ui.model.FilterOperator.Contains, sValue);
			var oTable = this.byId("cleanedBy");
			oTable.getBinding("items").filter([ oFilter ]);
		},*/

		handleRouteMatched : function() {
			/*
			 * var controller = this; var path =
			 * oEvent.getParameter("arguments").context;
			 * this.getView().data("source",path);
			 */

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