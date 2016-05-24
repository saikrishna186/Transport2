jQuery.sap.declare("worklog.Component");

sap.ui.core.UIComponent.extend("worklog.Component", {
	createContent : function() {
		// create root view
		var oView = sap.ui.view({
			id : "app",
			viewName : "worklog.app",
			type : "JS",
			viewData : {
				component : this
			}
		});
		return oView;
	}
});