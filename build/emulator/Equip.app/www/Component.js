sap.ui.define([
               "sap/ui/core/UIComponent",
               "tfnswequip/tfnswmfs/model/models",
               "tfnswequip/tfnswwcm/model/config",
               "sap/ui/model/json/JSONModel",
               "sap/m/MessageBox",
               ], function(UIComponent, models) {
	"use strict";
	var navigationWithContext = {
			"ObjectSet": {
				"CleanGraffiti": ""
			}
	};
	return UIComponent.extend("tfnswequip.Component", {
		metadata: {
			config : {
				fullWidth : true
			},

			"dependencies" : {
				"libs" : [ "sap.m","sap.ui.layout","sap.ui.commons","sap.ui.unified","sap.ui.table" ],
				"components" : []
			},            
			routing: {
				config: {
					routerClass: "sap.m.routing.Router",
					viewType: "XML",
					viewPath: "tfnswequip",
					controlId: "App",
					clearTarget: false,
					controlAggregation: "pages",
				},
				routes: [
				         {
				        	 pattern: "Search",
				        	 name: "Search",
				        	 target: "Search"
				         }, 
				         {
				        	 pattern: "Create/{fromView}/{setId}/{carId}/{inspType}/{shiftName}",
				        	 name: "Create",
				        	 target: "Create"
				         }, 
				         {
				        	 pattern: "Info",
				        	 name: "Info",
				        	 target: "Info"
				         },
				         {
				        	 pattern: "ValueSearch",
				        	 name: "ValueHelper",
				        	 target: "ValueHelper"
				         },
				         {
				        	 pattern: "Update/{faultId}/{fromView}",
				        	 name: "Update",
				        	 target: "Update"
				         },
				         {
				        	 pattern: "Update/{faultId}/{sapFlag}/Attachment",
				        	 name: "Attachment",
				        	 target: "Attachment"
				         },
				         // ------ Clearning Routes ------------//
				         {
				        	 pattern: "CleanGraffiti/:context:",
				        	 name: "CleanGraffiti",
				        	 target: ["CleanGraffiti"]
				         }, 
				         {
				        	 pattern: "Attachments",
				        	 name: "Attachments",
				        	 target: ["Attachments"]
				         },
				         {
				        	 pattern: "DocView/{docValue}",
				        	 name: "DocView",
				        	 target: ["DocView"]
				         },
				         {
				        	 pattern: "CleaningLocation",
				        	 name: "CleaningLocation",
				        	 target: ["CleaningLocation"]
				         }, 
				         {
				        	 pattern: "SetNumber/:context:",
				        	 name: "SetNumber",
				        	 target: ["SetNumber"]
				         },
				         {
				        	 pattern: "CleanType/:context:",
				        	 name: "CleanType",
				        	 target: ["CleanType"]
				         }, 
				         {
				        	 pattern: "CleanedBy/:context:",
				        	 name: "CleanedBy",
				        	 target: ["CleanedBy"]
				         }, 
				         {
				        	 pattern: "CleanGraffiti",
				        	 name: "default",
				        	 target: ["CleanGraffiti"]
				         }
				         // ------ WCM Routes ------------//,
				         ,
				         {
				        	 pattern: "WCMApp",
				        	 name:"_WCMApp",
				        	 view:"tfnswwcm.view.App",
				        	 targetAggregation :  "pages",
				        	 subroutes:
				        		 [
				        		  {
				        			  pattern: "MasterWOList",
				        			  name: "MasterWOList",
				        			  view:"tfnswwcm.view.MasterWOList",
				        			  targetAggregation :  "masterPages",
				        			  targetControl: "idSplitApp",
				        		  },
				        		  {
				        			  pattern: "MasterWOList/WheelProfileWO/{contextPath}",
				        			  name: "WheelProfileWO",
				        			  view:"tfnswwcm.view.WheelProfileWO",
				        			  targetControl: "idSplitApp",
				        			  targetAggregation :  "detailPages"
				        		  },
				        		  {
				        			  pattern: "MasterWOList/GeneralInspectWO/{contextPath}",
				        			  name: "GeneralInspectWO",
				        			  view:"tfnswwcm.view.GeneralInspectWO",
				        			  targetControl: "idSplitApp",
				        			  targetAggregation :  "detailPages"
				        		  },
                                  {
                                      pattern: "welcome",
				        	          name: "welcome",
				        	          view:"tfnswwcm.view.Welcome",
//				        	          target: ["MasterWOList", "GeneralInspectWO"],
				        	          targetControl: "idSplitApp",
				        	          targetAggregation :  "detailPages"

                                  }
				        		  ]
				         }
				         ],
				         targets: 
				         {
				        	 "Search": {
				        		 viewName: "tfnswmfs.view.Search",
				        		 viewId: "Search",
				        		 viewLevel: "1"
				        	 },
				        	 "Create": {
				        		 viewName: "tfnswmfs.view.Create",
				        		 viewId: "Create",
				        		 viewLevel: "1"
				        	 },
				        	 "Info": {
				        		 viewName: "tfnswmfs.view.Info",
				        		 viewId: "Info",
				        		 viewLevel: "1"
				        	 },
				        	 "ValueHelper": {
				        		 viewName: "tfnswmfs.view.ValueHelper",
				        		 viewId: "ValueHelper",
				        		 viewLevel: "1"
				        	 },
				        	 "Update": {
				        		 viewName: "tfnswmfs.view.Update",
				        		 viewId: "Update",
				        		 viewLevel: "2"
				        	 }
				        	 ,
				        	 "Attachment": {
				        		 viewName: "tfnswmfs.view.Attachment",
				        		 viewId: "Attachment",
				        		 viewLevel: "3"
				        	 },
				        	 "FaultSymptom": {
				        		 viewName: "tfnswmfs.view.FaultSymptom",
				        		 viewId: "FaultSymptom",
				        		 viewLevel: "1"
				        	 },
				        	 // --- Tragets for Cleaning ---//
				        	 "CleanGraffiti": {
				        		 viewName: "cleaning.CleanGraffiti",
				        		 viewId: "CleanGraffiti",
				        		 viewLevel: "1"
				        	 },
				        	 "CleaningLocation": {
				        		 viewName: "cleaning.CleaningLocation",
				        		 viewId: "CleaningLocation",
				        		 viewLevel: "1"
				        	 },
				        	 "SetNumber": {
				        		 viewName: "cleaning.SetNumber",
				        		 viewId: "SetNumber",
				        		 viewLevel: "1"
				        	 },
				        	 "CleanType": {
				        		 viewName: "cleaning.CleanType",
				        		 viewId: "CleanType",
				        		 viewLevel: "1"
				        	 },
				        	 "CleanedBy": {
				        		 viewName: "cleaning.CleanedBy",
				        		 viewId: "CleanedBy",
				        		 viewLevel: "1"
				        	 },
				        	 "Attachments": {
				        		 viewName: "cleaning.Attachments",
				        		 viewId: "Attachments",
				        		 viewLevel: "1"
				        	 },
				        	 "DocView": {
				        		 viewName: "cleaning.DocView",
				        		 viewId: "DocView",
				        		 viewLevel: "1"
				        	 }
				        	 // --- Tragets for WCM ---//
				        	 ,
				        	 "WCMApp":{
				        		 viewName: "tfnswwcm.view.App",
				        		 viewId: "App",
				        		 viewLevel: 1,
				        	 },
				        	 "MasterWOList": {
				        		 viewName: "tfnswwcm.view.MasterWOList",
				        		 viewId: "MasterWOList",
				        		 viewLevel: 1,
				        		 targetAggregation: "masterPages"
				        	 },
				        	 "WheelProfileWO": {
				        		 viewName: "tfnswwcm.view.WheelProfileWO",
				        		 viewId: "WheelProfileWO",
				        		 viewLevel: 2,
				        		 targetAggregation: "detailPages",
				        	 },
				        	 "GeneralInspectWO": {
				        		 viewName: "tfnswwcm.view.GeneralInspectWO",
				        		 viewId: "GeneralInspectWO",
				        		 viewLevel: 2,
				        		 targetAggregation: "detailPages",
				        	 },
				        	 "notFound": {
				        		 viewName: "tfnswwcm.view.NotFound",
				        		 viewLevel: 2,
				        		 viewId: "NotFound",
				        		 targetAggregation: "detailPages"
				        	 },
				        	 "welcome": {
				        		 viewName: "tfnswwcm.view.Welcome",
				        		 viewLevel: 2,
				        		 viewId: "Welcome",
				        		 targetAggregation: "detailPages"
				        	 },
				         }
			}
		},

		createContent: function() {
			var app = new sap.m.App("App",{initialPage:"tileHome"});
//			console.log("in component create content");
			this.app = app;
			var tileHome = sap.ui.view({id:"tileHome", viewName:"tfnswequip.TileHome",  type:sap.ui.core.mvc.ViewType.JS, viewData: this});
			app.addPage(tileHome);
			return app;
		},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
//            console.log("component init");
			this.locationF4 = "";	
			this.notifnum = "";
			this.faultTable = "";
			jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
			jQuery.sap.require("sap.ui.core.routing.HashChanger");
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set i18n model
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : "tfnswmfs/i18n/i18n.properties"
			}); 
			this.setModel(i18nModel, "i18n");

			var mFSMsg = new sap.ui.model.resource.ResourceModel({ 
				bundleUrl : "tfnswmfs/i18n/mFSMsg.properties"
			}); 
			this.setModel(mFSMsg, "mFSMsg");																				

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// Set Value helper model
			this.setModel(models.createValueHelpModel(), "ValueHelpModel");

			//create mainDataModel
			this.setModel(models.mainDataModel(),"mainDataModel");

			this._router = this.getRouter();
			this._routeHandler = new sap.m.routing.RouteMatchedHandler(this._router);
			this._router.initialize();
			//Migrating init calls of WCM here
			var initialModel = new sap.ui.model.json.JSONModel();
			this.setModel(initialModel,"componentModel");

		},
		getNavigationPropertyForNavigationWithContext: function(entityNameSet, targetPageName) {
			var entityNavigations = navigationWithContext[entityNameSet];
			return entityNavigations == null ? null : entityNavigations[targetPageName];

		},
        destroy : function() {
            var app = sap.ui.getCore().byId("App");
            sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
            app.destroy();
        },
	});
});