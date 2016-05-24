sap.ui.controller("worklog.app", {

	handleNavigation : function(evt) {
		var initial = evt.getParameters().firstTime;
		var destination = evt.getParameters().to;
		var destinationId = evt.getParameters().toId;
		var fromId = evt.getParameters().fromId;
		var from = evt.getParameters().from;
		var app = this.app;

		switch (destinationId) {

		case "myCurrentWork": {

			var controller = destination.oController;
			currentWorkList(controller.getMyWorklog, controller);

			break;
		}

		}
	},
/**
 * Called when a controller is instantiated and its View controls (if available)
 * are already created. Can be used to modify the View before it is displayed,
 * to bind event handlers and do other one-time initialization.
 * 
 * @memberOf fltmgmt.app
 */
//	onInit: function() {
//	},
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
 * (NOT before the first rendering! onInit() is used for that one!).
 * @memberOf fltmgmt.app
 */
//	onBeforeRendering: function() {
//	},
/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
 * This hook is the same one that SAPUI5 controls get after being rendered.
 * @memberOf fltmgmt.app
 */
//	onAfterRendering: function() {
//	},
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 * @memberOf fltmgmt.app
 */
//	onExit: function() {
//	}
});