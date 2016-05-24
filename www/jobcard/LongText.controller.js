sap.ui.controller("tfnswjobcard.LongText", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf LongText
*/
	onInit: function() {
		
	},
	handleNavBack : function(evt){
		var app = this.getView().getViewData();
		//var longTxtModel = sap.ui.getCore().getModel("taskLongTxtModel");
		var taskDetailView = app.getPage("taskDetails");
		var taskDetailModel = taskDetailView.taskDetTable.getModel();
		var taskDetailData = taskDetailModel.getData();
		//update long text
		var longText = this.getView().textBox.getValue();
		for(var i = 0; i < taskDetailData.length; i++)
		{
			if(i === Number($.trim(this.getView().data("selectedPath").replace("/",""))))
			{
				taskDetailData[i].RecLongText = longText;
				i = taskDetailData.length;
				taskDetailView.taskDetTable.getModel().setData(taskDetailData);
			}
		}
		app.to("taskDetails");
	},

	setExistingLongText: function(longText){
		var data = this.getView().getModel().getData();
		data.ExistingRecLongText = longText.split("@~@").join("\n");
		this.getView().getModel().setData(data);
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf LongText
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf LongText
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf LongText
*/
//	onExit: function() {
//
//	}

});