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
			var initData = {
					"backFlag":false
			};
			var initModel = new sap.ui.model.json.JSONModel();
			initModel.setData(initData);
			this.getView().setModel(initModel, "initModel");
			this.getView().setModel(mModel);
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
		},
		handleRouteMatched: function(oEvent) {
			this.orders = this.getOwnerComponent().jobWCMTaskOrders;
			var sName = oEvent.getParameter("name");
			var oArguments = oEvent.getParameter("arguments");
//			Start of get the orders list from router navigation			

			var fromView = oEvent.getParameter("arguments").fromView;
			if(fromView === "jobCard"){
				this.getView().getContent()[0].setShowNavButton(true);
				var parmOrders = oEvent.getParameter("arguments").orders;
				this.getOwnerComponent().jobWCMTaskOrders = parmOrders;
				this.getCrossNavigationData(parmOrders);
				this.getView().getModel("initModel").oData.backFlag = true;
			}else{
				this.getView().getModel("initModel").oData.backFlag = false;
				this.backFlag = false;
			}

//			End of get the orders list from router navigation				
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
			var orders = this.orders;
			var sUrl = model.Config.getServiceUrl();
			//	var workOrder = '20090970';
			// var workOrder = window.location.hash.substr(1);
			var oServiceModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oServiceModel.read(model.Config.getWorkOrders(orders),{			
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
			//var oTable = this.byId("sap_m_List_1");
			//oTable.getBinding("items").filter([ oFilter ]);

			// Set Filter
			var sFilter = new sap.ui.model.Filter("Setid",
					sap.ui.model.FilterOperator.Contains, sValue);
			// Priority Description
			var pFilter = new sap.ui.model.Filter("PrioriDesc",
					sap.ui.model.FilterOperator.Contains, sValue);
			// Car Id
			var cFilter = new sap.ui.model.Filter("Carid",
					sap.ui.model.FilterOperator.Contains, sValue);			

			var filters = new sap.ui.model.Filter({
				filters:[sFilter, oFilter, pFilter, cFilter],
				and: false
			});
			var oTable = this.byId("sap_m_List_1");
			oTable.getBinding("items").filter([ filters ]);
		},

		onRefresh : function(evt){
			var oTable = this.byId("sap_m_List_1");
			oTable.getBinding("items").refresh();
			this.initialServiceCall();
			evt.getSource().hide();

		},
//		toTileHome: function(evt){
//		this.getOwnerComponent().app.to("tileHome");
////		sap.ui.core.UIComponent.getRouterFor(this).navTo("Search");
//		},	

		getCrossNavigationData: function(parmOrders){
			//Set is back from Fault Management
			/*			var componentData = this.getOwnerComponent().getComponentData();
			var paramData = componentData.startupParameters;
			var cleanURL = "";
			function getParamValue(paramName){
				var paramValue = "";
				if(paramData){
					paramValue = (paramData[paramName] ? (paramData[paramName].length > 0 ? paramData[paramName][0] : "") : "");
				}
				return paramValue;
			}
			function removeCustomQuery(uri, keyValue) {
				var re = new RegExp("([&\?]"+ keyValue + "*$|" + keyValue + "&|[?&]" + keyValue + "(?=#))", "i"); 
				cleanURL = uri.replace(re, '');
				window.history.replaceState({}, document.title, cleanURL);
			}
			var isFromTMP = getParamValue("from");
			this.fromTMP = (isFromTMP == "TMP" ? true : false);
			if(this.fromTMP)
				this.getView().getContent()[0].setShowNavButton(true);
			this.pSetNo = getParamValue("set");
			this.pInspType = getParamValue("inspType");
			this.pShiftName = getParamValue("shiftName");
			this.orders = getParamValue("orders");
			this.jobDetailselKey = getParamValue("selectedKey"); */
			this.orders = parmOrders;
		},
		handleNavBack: function(evt){
			var setNo = this.pSetNo;
			var inspType = this.pInspType;
			var shiftName = this.pShiftName;
			var selectedKey = this.jobDetailselKey;
			var tmpOrders = this.orders.split(",");
			var listLength = this.getView().getModel().getData().masterValues.length;
			if(listLength > 0)
			{
				jQuery.sap.require("sap.m.MessageBox"); 
				sap.m.MessageBox.show(
						"Complete all Work Orders before navigating back to TMP Jobcard", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error Message",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
							}
						}
				);				
			}
			else
			{
				// Below code navigate between cross applications --  here it is to TMP Jobcard
				/*if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService)
				{
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					oCrossAppNavigator.toExternal({
						target: { semanticObject : "JOB_CARD", action: "display" },   //the app you're navigating to 
						params : { "from": "WCM", "set":setNo, "inspType":inspType, "shiftName": shiftName,  "selectedKey": selectedKey}
					});
				}
				else
				{
					jQuery.sap.log.info("Cannot Navigate - Application Running Standalone");
				}	*/
				this.getOwnerComponent().jobWCMTaskOrders = "";
				var app = sap.ui.getCore().byId("App");
				app.to("jobCard");
			}		
		},
		validateOrderCompletion: function(){ // Check all the orders from the TMP are completed or not
			var tmpOrders = this.orders.split(",");
			var listLength = this.getView().getModel().getData().masterValues.length;
			if(listLength > 0)
			{
				jQuery.sap.require("sap.m.MessageBox"); 
				sap.m.MessageBox.show(
						"Complete all Work Orders before navigating back to TMP Jobcard", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Error Message",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
								return true;
							}
						}
				);				
			}
			else
				return true;
		}


	});
}, /* bExport= */ true);