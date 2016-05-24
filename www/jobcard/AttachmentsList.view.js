sap.ui.jsview("tfnswjobcard.AttachmentsList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf jobcard.AttachmentsList
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.AttachmentsList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf jobcard.AttachmentsList
	*/ 
	createContent : function(oController) {

		
		var attachmentRows = new sap.m.StandardListItem({
			title:"{Description}",
			type:"Active",
			selected: true,
			icon: "sap-icon://document",
		});
		this.attachmentRows = attachmentRows;
		var jsonModel = new sap.ui.model.json.JSONModel();
		
		var attachmentsList = new sap.m.List({
			headerText:"",
			includeItemInSelection: true,
			mode: sap.m.ListMode.SingleSelectMaster,
			items:[],
			itemPress : function(evt){
				window.open(evt.getParameters().listItem.getBindingContext().getObject().Docfile,"_blank");
			}
		});
		this.attachmentsList = attachmentsList;
		attachmentsList.setModel(jsonModel);
 		return new sap.m.Page({
			title: "Task ",
 			showNavButton : true,
			navButtonPress : function(evt) {
				oController.handleNavBack(evt);
			},
			customHeader: [
	               new sap.m.Bar({
	                   contentLeft: [
		                   new sap.m.Button({
		                       icon: "sap-icon://nav-back",
		                       press: function (evt) {
		                           oController.handleNavBack(evt)
		                       },
		                   }).addStyleClass("navButton")
	                 ],
	                   contentMiddle: [
                           new sap.m.Label({
                           }).addStyleClass("pageTitle")
	                   ],
	                   contentRight: [      ]
	               })],			
			content: [
			          new sap.m.Panel({
			        	  content:[attachmentsList]
			          })
			]
		});
	}

});