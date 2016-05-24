sap.ui.jsview("tfnswjobcard.measurementPoints", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.measurementPoints
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.measurementPoints";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.measurementPoints
	*/ 
	createContent : function(oController) {
		
		this.controller = oController;
		
		
		var measurementPage =  new sap.m.Page({
			  customHeader : new sap.m.Bar({
					contentLeft : [	new sap.m.Button({
		                icon: "sap-icon://nav-back",
	                    text : "",
	       press : function(evt){
	           oController.handleNavBack(evt)
	         }
	         }),
					],
					contentMiddle : [
					   new sap.m.Label({
				    	text : "Job Card"
				    }).addStyleClass("appTitle"), 
					              
					 ]
				}),
				
			//title: "Job Cart",
			content: [
			],
			footer : new sap.m.Bar({
				contentLeft : [
				                
				],
				contentRight : [
						         
						           new sap.m.Button({
						        	   text : "Save",
						        	   icon : "sap-icon://save",
						        	   press : function(evt){
						        		  // oController.saveRMA(evt)
//						        		   oController.saveMeasurement(evt)
						        		   oController.validateMeasurementPoints(evt)
						        	   }
						           })     
						                ]
								})
		}).addStyleClass("backGroundColor");
		this.measurementPage = measurementPage;
		return measurementPage;

	}

});