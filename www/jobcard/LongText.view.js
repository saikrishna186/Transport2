sap.ui.jsview("tfnswjobcard.LongText", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf LongText
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.LongText";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf LongText
	*/ 
	createContent : function(oController) {
		var textBoxExtTxt = new sap.m.TextArea("jobCardLongTxt",{
			enabled:false,
			height: "50%",
			wrapping : "Soft",
			rows: 10,
			//visible: false,
			value: "{/ExistingRecLongText}"
		});
	    this.textBoxExtTxt = textBoxExtTxt;
		var descFormExtTxt = new sap.ui.layout.form.Form({
			
			title : "Observation History",
			editable : true,
			//visible: false,
			layoutData : new sap.m.FlexItemData({
				
			}),
			layout : new sap.ui.layout.form.ResponsiveGridLayout(),
			formContainers : [
			    new sap.ui.layout.form.FormContainer(
			    {
			    
				formElements : [ new sap.ui.layout.form.FormElement({
					fields : [textBoxExtTxt ]
				}) ]
			})

			]
		}).addStyleClass("jobCardLongTxtLayout");
		this.descFormExtTxt = descFormExtTxt;
		var textBox = new sap.m.TextArea({
			enabled:true,
			height: "50%",
			wrapping : "Soft",
			rows: 10,
			value: "{/RecLongText}",
			//liveChange: function(evt)
			//{
			//}
		});
	    this.textBox = textBox;
		var descForm = new sap.ui.layout.form.Form({
			
			title : "Enter Detailed Description",
			editable : true,
			layoutData : new sap.m.FlexItemData({
				
			}),
			layout : new sap.ui.layout.form.ResponsiveGridLayout(),
			formContainers : [
			    new sap.ui.layout.form.FormContainer(
			    {
			    
				formElements : [ new sap.ui.layout.form.FormElement({
					fields : [textBox ]
				}) ]
			})

			]
		}).addStyleClass("jobCardLongTxtLayout");
		var jsonModel = new sap.ui.model.json.JSONModel();
		this.setModel(jsonModel);
 		return new sap.m.Page({
			title: "Record Observation",
			enableScrolling: false,
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
//                                                       text: "Task Information"
                                                   }).addStyleClass("pageTitle")
                               ],
                               contentRight: [      ]
                           })],
			content: [
descFormExtTxt, descForm
			]
		});
	}

});