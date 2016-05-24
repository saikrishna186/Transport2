sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleanType", {

		/*onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		_onPressNpsapmButton145006301944314P: function() {
			this.getView().getContent()[0].close();
		}*/
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
	        
	        
			/*var aContexts = cleanTypeTable.getSelectedContexts();
			cleanType.destroyTokens();
			
	
			if (aContexts.length) {

				    aContexts.map(function(oContext) {
					//var token = new sap.m.Token({key:"{/cleanTypeValues/Zzcleantype}",text:"{/cleanTypeValues/ZzcleanDesc}"});
					//cleanType.bindAggregation("tokens","cleanTypeValues",token)
					var oDataTemplate = new sap.ui.core.CustomData({});
	                oDataTemplate.bindProperty("value", "ZzoperatioinWrkCnt");
	                cleanType.addCustomData(oDataTemplate);
					var token = new sap.m.Token({ key: oContext.getObject().Zzcleantype, text:oContext.getObject().ZzcleanDesc});
					cleanType.addToken(token);
				});	
				    
		
			}*/
			graffitiPage.oController.settingTokens();
			graffitiPage.oController.cleanTypeCars();
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
			var oList = this.getView().byId("cleanTypeTable");
			oList.setModel(oModel);

			/*var oCode = new sap.m.Text({
				text : "{Zzcleantype}"
			}); // Code
			var oDescription = new sap.m.Text({
				text : "{ZzcleanDesc}"
			}); // code description
			var oRow = this.byId("Row");
			oRow.addCell(oCode).addCell(oDescription);
			oTable.bindItems("/cleanTypeValues", oRow);*/

		}
	});
}, /* bExport= */ true);