sap.ui.controller("tfnswjobcard.AttachmentsList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf jobcard.AttachmentsList
*/
//	onInit: function() {
//
//	},
	handleNavBack : function(evt){
		var app = this.getView().getViewData();
		app.to("infoDetails");
	},
	
	bindAttachmentList: function(data){
		var view = this.getView();
		var docs = data.NAV_TASK_DOCUMENTS.results;
		var attachmentRows = view.attachmentRows;
		var attachmentsList = view.attachmentsList;
		var headerTxt = "Attachments ("+docs.length+")";
		attachmentsList.setHeaderText(headerTxt);
		var listModel = attachmentsList.getModel();
		if(docs.Description === "")
			docs = [];
		listModel.setData(docs);
		attachmentsList.bindItems("/", attachmentRows);
	}
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf jobcard.AttachmentsList
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf jobcard.AttachmentsList
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf jobcard.AttachmentsList
*/
//	onExit: function() {
//
//	}

});