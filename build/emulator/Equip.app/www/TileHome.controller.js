sap.ui.controller("tfnswequip.TileHome", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf timeHome
	 */

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		var controller = this;
        this.controller = this;
		getApplications(controller.loapApplications, controller);
        addToolbarMenuItems(controller,"","tileHome");
	},

	nextPage: function(){
		var app = this.getView().getViewData();
		if(!app.getPage("test")){
			var testPage = sap.ui.view({id:"test", viewName:"tfnswassetmanager.Test", type:sap.ui.core.mvc.ViewType.JS, viewData: app});
			app.addPage(testPage);
		}
		app.to("test");
	},
	navigateTo : function(evt){
		var viewData = this.getView().getViewData();
		var app = viewData.app;
		var oModel = this.getView().tileContainer.getModel();
		var path = evt.getSource().getBindingContext().getPath();
		var obj = oModel.getProperty(path);
		var destination = obj.Applext;
        var vController = this;

		var prevPage = this.getView();
		switch (destination){
		case "myWorkList" : {
            
			var app = viewData.app;
			if (!app.getPage("myWorkList")) {
				var myWorkList = sap.ui.view({id:"myWorkList", viewName:"worklog.myCurrentWork", type:sap.ui.core.mvc.ViewType.JS, viewData : viewData});
				app.addPage(myWorkList);
				this.myWorkList = myWorkList;
			}
			this.myWorkList.data("prevPage",prevPage);
			var myWorklistController = this.myWorkList.oController;
			currentWorkList(myWorklistController.getMyWorklog, myWorklistController);
            addToolbarMenuItems(vController,this.getOwnerComponent().app,"myWorkList");
			app.to("myWorkList");
			break;
		}
		case "jobCard" : {
			var app = viewData.app;
			if (!app.getPage("jobCard")) {
				var init = sap.ui.view({id:"jobCard", viewName:"tfnswjobcard.init", type:sap.ui.core.mvc.ViewType.JS, viewData : viewData});
				app.addPage(init);
				this.init = init;
			}
			this.init.data("prevPage",prevPage);
            addToolbarMenuItems(vController,this.getOwnerComponent().app,"jobCard");
			app.to("jobCard");
			break;
		}	
		case "mfs" : {
            addToolbarMenuItems(vController,this.getOwnerComponent().app,"mfs");
			this.router.oHashChanger.setHash("");
			this.router.navTo("Search",false);
			break;
		}			
		case "cleaning" : {
            addToolbarMenuItems(vController,this.getOwnerComponent().app,"cleaning");
			this.router.oHashChanger.setHash("");
			this.router.navTo("CleanGraffiti",false);
			break;
		}
		case "wcm" : {
            addToolbarMenuItems(vController,this.getOwnerComponent().app,"wcm");
//			initiating init loads for WCM
//			setting blank model on component
			var initialModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(initialModel,"componentModel");
			this.defectTypeF4ServicesWCM();
			this.defectClassF4ServicesWCM();
			this.router.oHashChanger.setHash("");
			this.router.navTo("MasterWOList",false);
			break;
		}
		}
	},


	loapApplications: function(data){
		var oModel= new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		var view = this.getView();
		var tileContainer = view.tileContainer;
		tileContainer.setModel(oModel);
		var tileTemplate = view.tileTemplate;
		tileContainer.bindAggregation("tiles","/",tileTemplate);
	},

	deRegisterDevice: function(evt)
	{
		var controller = this;
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(
				"Deregistering the device will remove any data stored for the Application. \n Do you want to procced deregistration ",{
					icon: sap.m.MessageBox.Icon.WARNING,
					title: "Warning",
					actions:[sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose:function(oAction) {
						if(oAction === "YES")
							sap.Logon.core.deleteRegistration(controller.logonDeregisterSuccessCallback, controller.errorDeregisterCallback);
					}
				});

	},
	logonDeregisterSuccessCallback: function(result){
		applicationContext = null;
        var app = sap.ui.getCore().byId("App");
        //var controller = app.getPage("tileHome").oController;
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(
				"Device registration has been removed",{
					icon: sap.m.MessageBox.Icon.SUCCESS,
					title: "Success",
					actions:[sap.m.MessageBox.Action.OK],
					onClose:function(oAction) {
                        app.destroyPages();
                        app.destroy();
                        //window.location.reload();
                        //getApplications(controller.loapApplications, controller);
						register();
					}
				});


	},
	errorDeregisterCallback:function(error){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(
				"Device registration has been failed",{
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions:[sap.m.MessageBox.Action.OK],
					onClose:function(oAction) {
					}
				});

	},
	openSettingPopover: function(evt){
		if(!this.settingPopover)
		{
			this.settingPopover = this.getView().settingPopover;
			this.getView().addDependent(this.settingPopover);
		}
		this.settingPopover.openBy(evt.getSource());
	},

	performAction: function(evt){
		var controller = this;
		var action = evt.getParameters().listItem.getBindingContext().getObject().action;
		evt.getSource().getParent().close();
		switch(action){
		case "refresh":
			getApplications(controller.loapApplications, controller);
			break;
		case "unregister":
			controller.deRegisterDevice();
			break;
		}
	},
	defectTypeF4ServicesWCM :function (){
		sap.ui.core.BusyIndicator.show();
		jQuery.sap.require("model.Config");

		var component = this.getOwnerComponent();

		var sUrl = model.Config.getServiceUrl();
		var oServiceModel = new sap.ui.model.odata.ODataModel(sUrl, true);
		// call for defect type F4

		oServiceModel.read(model.Config.getDefectType(),{			
			success: function(odata,response){
				var oModel = component.getModel("componentModel");
				var mData = oModel.getData();
				mData.defectType = odata.results;
				oModel.setData(mData);
				sap.ui.core.BusyIndicator.hide();

			},
			error: function(error){
				sap.ui.core.BusyIndicator.hide();
				console.error(error);
			}
		});
	},
	defectClassF4ServicesWCM :function (){
		sap.ui.core.BusyIndicator.show();
		jQuery.sap.require("model.Config");

		var component = this.getOwnerComponent();

		var sUrl = model.Config.getServiceUrl();
		var oServiceModel = new sap.ui.model.odata.ODataModel(sUrl, true);
		sap.ui.core.BusyIndicator.show();
		oServiceModel.read(model.Config.getDefectClass(),{			
			success: function(cdata,response){
				var oModel = component.getModel("componentModel");
				var qData = oModel.getData();
				qData.defectClass = cdata.results;
				sap.ui.core.BusyIndicator.hide();
				oModel.setData(qData);

			},
			error: function(error){
				sap.ui.core.BusyIndicator.hide();
				console.error(error);
			}
		});
	},
});