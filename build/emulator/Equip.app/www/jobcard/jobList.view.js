sap.ui.jsview("tfnswjobcard.jobList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.jobList
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.jobList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.jobList
	*/ 
	createContent : function(oController) {
		
		this.controller = oController;

		var refresh = new sap.m.PullToRefresh({
			refresh : function(evt){
				 oController.getJobListData(evt)
			}
		});
		this.dataLoad = refresh;

		var searchField = new sap.m.SearchField({
			placeholder : "Search for Cars",
			search : function(evt){
				oController.searchJobList(evt)
			}
			
		});

		var jobList = new sap.m.List({
			mode : sap.m.ListMode.SingleSelectMaster,
			itemPress : function(evt) {
				oController.showWarningText(evt.getParameters().listItem)
			}
		});
		jobList.bindItems({ 
		path : "/", 
//		sorter : {
//			path : "DepotName",
//			group : true
//		},
//		groupHeaderFactory : function(group){
//			return new sap.m.GroupHeaderListItem({
//				title : group.key
//			})
//		},
		template : new sap.m.ObjectListItem({
        type : sap.m.ListType.Active,
        title : {
        	parts : [
        	{path : "CarNo"}
           	],
        	formatter : function(car){
        		return "Car : " + car;
        	}        	
        },
        
        firstStatus : [

        	new sap.m.ObjectStatus({
        		text :  {
                	parts : [
                	        	{path : "SetNo"},
                	        	{path : "SetType"}
                	        	],
                	        	formatter : function(SetNo,SetType){
                	        		return SetNo + "   " + SetType;
                	        	}        	
                	    }
        		
        	})
        ],
         secondStatus : [
        
        	new sap.m.ObjectStatus({
        		text : "{StatusDescr}",
        		state : {
        			parts : [
        			{path : "Status"}
        			],
        			formatter : function(status){
        				switch(status){

        					case "NEW" : {
        						return sap.ui.core.ValueState.Success;
        					}

        					case "ALOC" : {
        						 return sap.ui.core.ValueState.Error;
        					}

        					case "WIPR" : {
        						 return sap.ui.core.ValueState.Warning;
        					}

        				}
        			}
        		} 
        		
        	})
        ],
        attributes : [
            new sap.m.ObjectAttribute({
            text : {
            	parts : [
         	        	{path : "InspType"},
         	        	{path : "InspTypeDesc"}
         	        	],
         	        	formatter : function(InspType,desc){
         	        		return "Inspection Type : " + InspType + "-" + desc;
         	        	}        	
         	        	}
        	}),
        	new sap.m.ObjectAttribute({
        		text : "{DepotName}"
//        		text : {
//        	parts : [
//        	{path : "InspType"}
//        	],
//        	formatter : function(InspType){
//        		return "Inspection Type : " + InspType;
//        	}        	
//        	}
        	}),
        	new sap.m.ObjectAttribute({
        		text : {
        	parts : [
        	{path : "ShiftName"}
        	],
        	formatter : function(ShiftName){
        		return "Shift : " + ShiftName;
        	}        	
        	}
        	}),
        	new sap.m.ObjectAttribute({
        	text : {
        	parts : [
        	{path : "Equnr"},
        	{path : "Eqktx"},
        	{path : "NAV_SET_TO_TASK"}
        	],
        	formatter : function(eqnr,eqtx,cars){
        		if(cars.length == 1)
        		return eqnr + " - " + eqtx;
        		else
        		return ""
        	}        	
        	}
        	}),
        	new sap.m.ObjectAttribute({
        		text : {
        	parts : [
        	{path : "Sernr"}
        	],
        	formatter : function(srno){
        		if(srno != "")
        		return "Sr# : " + srno;
        		else 
        			return "";
        	}        	
        	}
        	})
        ]
 		 })});

		var jobListModel= new sap.ui.model.json.JSONModel();
		jobList.setModel(jobListModel);

		this.jobList = jobList;

	   var headerBar = sap.ui.jsfragment("tfnswjobcard.app.header", oController);  
	   
	   var groupOptions = new sap.m.Select({
		   change : function(evt){
			   oController.groupJobList(evt)
		   },
		   icon : "sap-icon://group-2",
		   type : "IconOnly",
		   selectedKey : "None",
		   text : "Group by",
		   autoAdjustWidth : true,
		   items : [
		            new sap.ui.core.Item({
		            	key : "None",
		            	text : "No Grouping"
		            }),
		            new sap.ui.core.Item({
		            	key : "IT",
		            	text : "Inspection Type"
		            }),
		            new sap.ui.core.Item({
		            	key : "SET",
		            	text : "Set No."
		            })
		            ]
	   })

 		return new sap.m.Page({
			 customHeader : new sap.m.Bar({
					contentMiddle : [
					   new sap.m.Label({
				    	text : "My Work"
				    }).addStyleClass("appTitle")					              
					 ]
				}),
			content: [ refresh, searchField, jobList],
			footer : new sap.m.Bar({
				
				contentRight : [ groupOptions
				                
						                ]
								})
		});
	}

});