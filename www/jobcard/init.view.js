sap.ui.jsview("tfnswjobcard.init", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.init
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.init";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.init
	*/ 
	createContent : function(oController) 
	{ 		
		var app = new sap.m.SplitApp("jobCardApp",{
//			initialPage:"empty", 
//			 mode : sap.m.SplitAppMode.HideMode, 
			 mode : sap.m.SplitAppMode.HideMode, 
			afterDetailNavigate : function(evt){
				oController.handleNavigation(evt)
			},
//			 afterMasterOpen : function(evt){
//			 	$("#jobDetails").css("width","83%").css("left","17%");
//			 },
			// afterMasterClose : function(evt){
			// 	$("#jobDetails").css("width","100%").css("left","0%");
			// }
			});
		this.app = app;
		app.controller = oController;
		app.tileHomeApp = this.getViewData();		
		if(!app.getPage("jobList")){
			var leftPane = sap.ui.view({id:"jobList", viewName:"tfnswjobcard.jobList", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
			app.jobList = leftPane;
			app.addMasterPage(leftPane);
		}
		if(!app.getPage("empty")){
			var rightPane = sap.ui.view({ id :"empty", viewName:"tfnswjobcard.empty", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
	//		app.jobDetail = rightPane;
			app.addDetailPage(rightPane);
			app.toDetail("empty");
		}
		
		

		return app;
	}

});