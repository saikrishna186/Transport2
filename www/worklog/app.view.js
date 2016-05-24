sap.ui.jsview("worklog.app", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf worklog.app
	 */
	getControllerName : function() {
		return "worklog.app";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf worklog.app
	 */
	createContent : function(oController) {

		var app = new sap.m.SplitApp("myApp", {
			initialPage : "master",
			mode : sap.m.SplitAppMode.HideMode,
			afterDetailNavigate : function(evt) {
				this.hideMaster();
				oController.handleNavigation(evt);

			}
		});
		this.app = app;

		var oMasterPage = sap.ui.view({
			id : "master",
			viewName : "worklog.master",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : this,
		});
		app.addMasterPage(oMasterPage);

		var myWork = sap.ui.view({
			id : "myCurrentWork",
			viewName : "worklog.myCurrentWork",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : this,
		});
		app.addDetailPage(myWork);
		app.placeAt("content");
		return app;
	}

});