// sap.ui.jsview("tfnswjobcard.app.header", {

	sap.ui.jsfragment("tfnswjobcard.app.header", {  

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.app.header
	*/ 
	// getControllerName : function() {
	// 	return "tfnswjobcard.app.header";
	// },

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.app.header
	*/ 
	createContent : function(oController) {

		var headerBar = new sap.m.Bar({
				contentLeft : [ 
				/*new sap.m.Button({
					icon : "sap-icon://home",
					press : function(evt) {		
						oController.navigateToHome(evt)
					},

				})*/ ],

				contentMiddle : [ 
				new sap.m.Label({
			    	text : ""
			    }).addStyleClass("appTitle")
				],

				contentRight : [ 
				// new sap.m.Label({
			 //    	text : "Current Date/Time"
			 //    }).addStyleClass("appTitle"),

			 //    new sap.ui.core.Icon({
			 //    	src : "sap-icon://customer"
			 //    }).addStyleClass("userIcon"),

			 //    new sap.m.Label({
			 //    	text : "John Miller"
			 //    }).addStyleClass("appTitle")       
			    ]


			}).addStyleClass("barContainer");
		this.headerBar = headerBar;

		return headerBar;

	}

});