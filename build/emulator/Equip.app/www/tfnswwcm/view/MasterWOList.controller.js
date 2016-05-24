jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.MasterWOList", {

		onInit: function() {

			this._View = this.getView();
			this.oUpdateFinishedDeferred = jQuery.Deferred();

			var mModel = new sap.ui.model.json.JSONModel({masterValues :[{"WorkOrder":"","CarId":"","SetId":"","PrioriDesc":"","Location":"","WheelProfile":""}]
			});
			this.firstTime = true;
			this.getView().setModel(mModel);
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
		},
		handleRouteMatched: function(oEvent) {
			var sName = oEvent.getParameter("name");
			var oArguments = oEvent.getParameter("arguments");

			jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {

				//	this.bindingList();
			}, this));

			this.initialServiceCall();
			if(this.firstTime){
				this.firstTime = false;
				this.oRouter.navTo("welcome");
			}
		},

		bindingList :function(woData){

			var lModel = this.getView().getModel();
			lModel.setSizeLimit(1000);
			var mArray = lModel.getData();
			mArray.masterValues = woData.results;
			lModel.setData(mArray);

		},

		conditionalNavigation:function(profileFlag,workOrder){
			if(profileFlag != "Wheel Profile"){
				sap.ui.core.UIComponent.getRouterFor(this).navTo("GeneralInspectWO",{contextPath: workOrder});
			}
			else{
				sap.ui.core.UIComponent.getRouterFor(this).navTo("WheelProfileWO",{contextPath: workOrder});
			}
		},




		onPressfilter: function(oEvent) {
			var dialogName = "FilterDialog";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});
		},
		onPresssort: function(oEvent) {
			var popoverName = "SortPopover";
			this.popovers = this.popovers || {};
			var popover = this.popovers[popoverName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this.getView().getModel();
			var view;
			if (!popover) {
				view = sap.ui.xmlview({
					viewName: "tfnswequip.tfnswwcm.view." + popoverName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				popover = view.getContent()[0];
				popover.setPlacement("Auto" || "Auto");
				this.popovers[popoverName] = popover;
			}
			popover.openBy(oEvent.getSource());
			if (view) {
				popover.attachAfterOpen(function() {
					popover.rerender();
				});
			} else {
				view = popover.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});
		},

		_onPressSapmObjectListItem : function(oEvent){
			var obj = oEvent.getParameters().listItem.getBindingContext().getObject();

			this.conditionalNavigation(obj.WheelType,obj.Workoder);

		},


		initialServiceCall:function( ){

			// Create an OData model for the service
			sap.ui.core.BusyIndicator.show();
			jQuery.sap.require("model.Config");
			var controller = this;

			var sUrl = model.Config.getServiceUrl();
			//	var workOrder = '20090970';
			// var workOrder = window.location.hash.substr(1);
			var oServiceModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oServiceModel.read(model.Config.getWorkOrders(),{			
				success: function(odata,response){
					controller.bindingList(odata);
					sap.ui.core.BusyIndicator.hide();

				},
				error: function(error){
					sap.ui.core.BusyIndicator.hide();
					console.error(error);
				}
			});


		},
		handleSearch : function(evt) {
			var sValue = evt.getSource().getValue();
			var oFilter = new sap.ui.model.Filter("Workoder",
					sap.ui.model.FilterOperator.Contains, sValue);
			/*var lModel = this.getView().getModel();
			var mArray = lModel.getData();*/
			//mArray.filter([ oFilter ]);
			//lModel.filter([ oFilter ]);
			//lModel.refresh(true);
			var oTable = this.byId("sap_m_List_1");
			oTable.getBinding("items").filter([ oFilter ]);
		},

		onRefresh : function(evt){
			var oTable = this.byId("sap_m_List_1");
			oTable.getBinding("items").refresh();
			this.initialServiceCall();
			evt.getSource().hide();

		},
//		toTileHome: function(evt){
//			this.getOwnerComponent().app.to("tileHome");
////			sap.ui.core.UIComponent.getRouterFor(this).navTo("Search");
//		},	


	});
}, /* bExport= */ true);