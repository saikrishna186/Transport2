sap.ui.jsview("tfnswjobcard.empty", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.empty
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.empty";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.empty
	*/ 
	createContent : function(oController) {


		// var headerBar = sap.ui.jsfragment("tfnswjobcard.app.header", oController);  
		this.addStyleClass("whiteBackground");
		
 		return new sap.m.Page({
	
			// customHeader : headerBar,
			 customHeader : new sap.m.Bar({
				 	contentLeft:[
//				 	            new sap.m.Button({
//					            	   icon:"sap-icon://home",
//                                       size:"1.5em",
//					            	   press:function(evt){
//					            		   oController.toTileHome(evt);
//					            	   }
//					               })
				 	             ],
					contentMiddle : [
					   new sap.m.Label({
				    	text : "My Work"
				    }).addStyleClass("appTitle")					              
					 ]
				}),													
			content: [
			          new sap.m.MessagePage({
			        	  width : "100%",
			        	  height : "90%",
			        	  text : "Job Card",
			        	  description : "Select a task from the left pane to get started",
			        	  icon : "sap-icon://wrench",
			        	  showHeader : false
			          }).addStyleClass("welcomePage")	          
			          ]
		});
	}

});