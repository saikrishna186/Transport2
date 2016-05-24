sap.ui.jsview("tfnswjobcard.jobDetails", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.jobDetails
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.jobDetails";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.jobDetails
	*/ 
	createContent : function(oController) {

		// var headerBar = sap.ui.view({ viewName:"tfnswjobcard.app.header", type:sap.ui.core.mvc.ViewType.JS});

		this.addStyleClass("whiteBackground");
		this.controller = oController;
		
	

		var jobHeader = new sap.m.ObjectHeader({
			icon : "sap-icon://cargo-train",
			 title : {
		        	parts : [
		        	{path : "/CarNo"},
		        	{path : "/DepotName"}
		           	],
		        	formatter : function(car,depotName){
		        		return  car + " ( " + depotName + " ) ";
		        	}        	
		        },
		        
		        firstStatus : [

		        	new sap.m.ObjectStatus({
		        		text : {
		        			parts : [
		 		        			{path : "/SetNo"}
		 		        			],
		 		        			formatter : function(setNo){
		 		        				var date = new Date().toLocaleDateString();
		 		        				return "Date : " + date
		 		        			}
		 		        		}
		        	})
		        ],
		         secondStatus : [
		        
		        	new sap.m.ObjectStatus({
//		        		text : "{/}",
		        		text : {
		        			parts : [
		        			{path : "/SetNo"}
		        			],
		        			formatter : function(setNo){
		        				return "Set #: " + setNo
		        			}
		        		} 
		        		
		        	})
		        ],
		        attributes : [

		        	new sap.m.ObjectAttribute({
		                text : {
		                	parts : [
		             	        	{path : "/InspType"},
		             	        	{path : "/InspTypeDesc"}
		             	        	],
		             	        	formatter : function(InspType,desc){
		             	        		return "Inspection Type : " + InspType + "-" + desc;
		             	        	}        	
		             	        	}
		        	}),
		        	new sap.m.ObjectAttribute({
		        		text : {
		        	parts : [
		        	{path : "/Ename"}
		        	],
		        	formatter : function(Username){
		        		return "Assigned to : " + Username;
		        	}        	
		        	}
		        	}),
		        	new sap.m.ObjectAttribute({
		            	text : {
		            	parts : [
		            	{path : "/Equnr"},
		            	{path : "/Eqktx"}
//		            	{path : "NAV_SET_TO_TASK"}
		            	],
		            	formatter : function(eqnr,eqtx){
		            		if(eqnr && eqtx)
		            		return eqnr + " - " + eqtx;	
		            		else
		            		return ""
		            	}        	
		            	}
		            	}),
		            new sap.m.ObjectAttribute({
		            		text : {
		            	parts : [
		            	{path : "/Sernr"}
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
		}).addStyleClass("jobHeader");

		var jobDetailModel= new sap.ui.model.json.JSONModel();
		jobHeader.setModel(jobDetailModel);
		this.jobHeader = jobHeader;


		var iconTabBar = new sap.m.IconTabBar({
//			width : "60%",
//			selectedKey:"Details",
			stretchContentHeight : true,
			items : [],
			select : function(evt) {
				 oController.filterTasks(evt.getParameters().key)
			}
		}).addStyleClass("jobFilters");
		this.iconTabBar = iconTabBar ;

		var oTable = new sap.m.Table({
//	    	mode : sap.m.ListMode.SingleSelectMaster,
	    	includeItemInSelection : true,
//	    	itemPress : function(evt){
//	    		// oController.displayCheckListItem(evt);
//	    	}	    	
			}).addStyleClass("dialogTable");
		
		oTable.onAfterRendering =  function(evt){
    		oController.bindActionPopup();
    	};
		
		//Columns
		
		var col1 = new sap.m.Column({width :"25%",hAlign : sap.ui.core.TextAlign.Center, vAlign : sap.ui.core.VerticalAlign.Middle,header: new sap.m.Text({text:"Task Code"}).addStyleClass("tableTitle") });
  		var col2 = new sap.m.Column({hAlign : sap.ui.core.TextAlign.Left, vAlign : sap.ui.core.VerticalAlign.Middle,width :"35%", header: new sap.m.Text({text:"Task Description"}).addStyleClass("tableTitle") });
  		var col2_5 = new sap.m.Column({hAlign : sap.ui.core.TextAlign.Center, vAlign : sap.ui.core.VerticalAlign.Middle,header: new sap.m.Text({text:""}).addStyleClass("tableTitle") });  		
  		var col3 = new sap.m.Column({hAlign : sap.ui.core.TextAlign.Center, vAlign : sap.ui.core.VerticalAlign.Middle,header: new sap.m.Text({text:"Completed"}).addStyleClass("tableTitle") });
  		var col4 = new sap.m.Column({width :"20%",hAlign : sap.ui.core.TextAlign.Center, vAlign : sap.ui.core.VerticalAlign.Middle,header: new sap.m.Text({text:"Further Action?"}).addStyleClass("tableTitle") });
  		var col5 = new sap.m.Column({hAlign : sap.ui.core.TextAlign.Center, vAlign : sap.ui.core.VerticalAlign.Middle,header: new sap.m.Text({text:""}).addStyleClass("tableTitle") });
  		
	  
	    oTable.addColumn(col1).addColumn(col2).addColumn(col2_5).addColumn(col3).addColumn(col4).addColumn(col5);	    

	    
		var taskCode = 	new sap.m.ObjectHeader({
			// layoutData : new sap.m.FlexItemData({
			// 	styleClass : "workOrderDetails",
			// 	growFactor : 5
			// }), 
			title : "{TaskCode}",
		    attributes : [
    		new sap.m.ObjectAttribute({
    		text : "{Subject}"
    		}).addStyleClass("attributeMaxHeight")
    	]
	}).addStyleClass("taskCodeHeader");
	var taskDescription = new sap.m.HBox({
		alignItems : sap.m.FlexAlignItems.Center,
//		width : "60%"
//		icon : "sap-icon://functional-location",
		layoutData : new sap.m.FlexItemData({
			styleClass : "taskDescription"
		}),
		items : [ 
		new sap.m.TextArea({value: "{TaskText}",
			enabled : false,
			cols : 50,
			rows  : 3}).addStyleClass("taskDescriptionBox"),

		new sap.ui.core.Icon({
			src : "sap-icon://message-information",
			size : "3em",
			layoutData : new sap.m.FlexItemData({
			styleClass : "taskIconLayout"
		}),
			press : function(evt){
				oController.showInformation(evt)
			}
			// color : "#91d300",
			// hoverColor : "blue",
			// activeColor : "white",
			// backgroundColor : "white",
			// hoverBackgroundColor : "white",
			// activeBackgroundColor : "#91d300",
		}).addStyleClass("taskIcon")
//		new sap.ui.core.Icon({
//			src : "sap-icon://add-product",
//			size : "2em",
//			layoutData : new sap.m.FlexItemData({
//			styleClass : "taskIconLayout"
//			}),
//			press : function(evt){
//				controller.addMaterial(evt)
//			}
//			// color : "#91d300",
//			// hoverColor : "blue",
//			// activeColor : "white",
//			// backgroundColor : "white",
//			// hoverBackgroundColor : "white",
//			// activeBackgroundColor : "#91d300",
//		}).addStyleClass("taskIcon"),

		]
	});
	
	var measIcon = 	 new sap.ui.core.Icon({
		src : "sap-icon://measure",
		size : "3em",
		layoutData : new sap.m.FlexItemData({
		styleClass : "taskIconLayout"
		}),
		press : function(evt){
			oController.showPerformance(evt)
		},
		visible : {
			parts : [{path : "MeasPoints"}],
			formatter : function(mp){
			
			if(mp && mp.toUpperCase() == "X"){
				return true
			}	
			else
				return false
			}
		}
		// color : "#91d300",
		// hoverColor : "blue",
		// activeColor : "white",
		// backgroundColor : "white",
		// hoverBackgroundColor : "white",
		// activeBackgroundColor : "#91d300",
	}).addStyleClass("taskIcon");
	
//	var completed =  new sap.m.CheckBox({
////		selected : "{/completed}",
//		selected: {
//		parts : [{path : "Status"}],
//		formatter : function(status){
//		if( status == "2"){
//			return true
//		}	
//		else
//			return false
//		}
//		},
//		select : function(evt){
//			
//			if(evt.getParameters().selected){
//				evt.getSource().getParent().getCells()[3].setVisible(false);
//			}
//			else{
//				evt.getSource().getParent().getCells()[3].setVisible(true);
//			}
//		},
//	editable:true, });

	var completed =  new sap.m.CheckBox({
		selected : "{completed}",
//		selected: {
//		parts : [{path : "Status"}],
//		formatter : function(status){
//		if( status == "2"){
//			return true
//		}	
//		else
//			return false
//		}
//		},
		select : function(evt){
			
			
//			oController.getView().table.rerender();
			
			if(evt.getParameters().selected){
				oController.handleTaskComplete(evt)
			}
			else{
//				evt.getSource().getParent().getCells()[3].setVisible(true);				
//				evt.getSource().getParent().getCells()[3].setValue("");
				evt.getSource().getParent().getCells()[4].invalidate();
				evt.getSource().getParent().getCells()[4].rerender();
				
				
				setTimeout(function(){ oController.bindActionPopup()},1000);
				
			}
					
		},
		editable:{
			parts : [{path : "ReasonText"}],
			formatter : function(ReasonText){
				/*if(ReasonText){ //Defect 6563 narasimb
					if($.trim(ReasonText).toUpperCase() === "FAULT" )
						return true;
				}
				*/
				var rCode = $.trim(oController.getActionKey[ReasonText]);
				//if(ReasonText != ""){ 
				if(rCode === "10" || rCode === ""){		//3.	Allow Completed and Further Action together if “Record Observation” further action is selected -- PCR		
					return true
				}
				else
					return false
			}
		} 
	
	});
	var furtherAction = new sap.m.Input({editable : false , enabled : true, width : "70%", 
		value : "{ReasonText}",
//		value : {
//			parts : [{path : "ReasonCode"}],
//			formatter : function(ReasonCode){
//				return oController.getActionText[ReasonCode]
//			}
//		},
		visible : {
			parts : [{path:"ReasonText"},{path : "completed"}],
			formatter : function(ReasonText, completed){
				var rCode = $.trim(oController.getActionKey[ReasonText]);
				if(rCode === "10")
					return true;
				else
					return !completed
			}
			/*parts : [{path : "completed"}, {path:"ReasonText"}],//Defect 6563 narasimb
			formatter : function(completed, reasonText){
				//return !completed
				if(reasonText){
					if(completed && $.trim(reasonText).toUpperCase() === "FAULT"){
						return true;
					}
					else
						return !completed;
				}
				else
					return !completed;
			}*/
			},
		
		placeholder : "Select Reason"
			}).addStyleClass("actionInput");
	
	furtherAction.onAfterRendering =  function(evt){
	oController.bindActionPopup();
	};
//	this.actionRequired = furtherAction;

	var multiCarIcon = new sap.ui.core.Icon({
		src : "sap-icon://detail-view",
		size : "3em",
		layoutData : new sap.m.FlexItemData({
		styleClass : "taskIconLayout"
		}),
		press : function(evt){
			oController.showDetailTask(evt)
		},
		visible: true,
		/*visible : {
			parts : [{path : "ReasonText"}],
			formatter : function(reasonText){
			var rCode = $.trim(oController.getActionKey[reasonText]);
			if(rCode === "5" || rCode === "8" || rCode === "9" || rCode === "10"){ // Fault or Partially Complete
				return true
			}	
			else
				return false
			}
		}*/
	}).addStyleClass("taskIcon");
	var oRow = new sap.m.ColumnListItem({
//		type : sap.m.ListType.Active
		});

	oRow.addCell(taskCode).addCell(taskDescription).addCell(measIcon).addCell(completed).addCell(furtherAction).addCell(multiCarIcon);
	
	
	

	
	
	    
	var tasklistModel= new sap.ui.model.json.JSONModel();
	oTable.setModel(tasklistModel);

	    
	    
	    oTable.bindItems("/",oRow);

	  	this.table= oTable;

	  // var oModel = new sap.ui.model.json.JSONModel();
  	//   oTable.setModel(oModel);

	  // oTable.bindItems(oRow); 



	  	iconTabBar.addContent(oTable);
	    var oColNotification = new sap.m.Column({header: new sap.m.Text({text:"Fault No. \n Date/Time"}).addStyleClass("tableTitle") });
		var oColCarNum = new sap.m.Column({header: new sap.m.Text({text:"Car No."}).addStyleClass("tableTitle"),width: "8%" });
		var oColAsset = new sap.m.Column({header: new sap.m.Text({text:"Asset"}).addStyleClass("tableTitle") });
		var oColSymptom = new sap.m.Column({header: new sap.m.Text({text:"Symptom"}).addStyleClass("tableTitle") });
		var oColPosition = new sap.m.Column({header: new sap.m.Text({text:"Position"}).addStyleClass("tableTitle"),width: "10%" });
		var oColFaultDesc = new sap.m.Column({header: new sap.m.Text({text:"Fault Description"}).addStyleClass("tableTitle") });
		var oColWO = new sap.m.Column({header: new sap.m.Text({text:"Work Order No."}).addStyleClass("tableTitle") });
		var oDateTime = new sap.m.Text({text: {
        	parts : [{path :"ZzfaultDate"}, {path : "ZzfaultTime/ms"}, {path :"ZznotifNum"}],
        	formatter : function(date,time,fault){
         		if(date && time)
     			{
     		  //var r = /\d+/;
     		  var formattedDate = date.toDateString().substring(4);
     		  var ms = time % 1000;
     		  time = (time - ms) / 1000;
     		  var secs = time % 60;
     		  time = (time - secs) / 60;
     		  var mins = time % 60;
     		  var hrs = (time - mins) / 60;
     		  
     		  if(hrs<10)
     			  {
     			  hrs = "0"+hrs;
     			  }
     		 if(mins<10)
			  {
			  mins = "0"+mins;
			  }
     		 if(secs<10)
			  {
     			secs = "0"+secs;
			  }
     	      var formattedTime = hrs + ':' + mins + ':' + secs;
     		  //var date = new Date(formattedDate + "  " + formattedTime);
     		  //return fault+ "\n"+formattedDate + "  " + formattedTime;
     			}
     		else if(date && time == "0")
 			{
 			var formattedDate = date.toDateString().substring(4);
 			var formattedTime  = "00:00:00";
 			}
 		else if (date)
 			{
 			var formattedDate = date.toDateString().substring(4);
 			var formattedTime  = "";
 			}
 		else
 			{
 			var formattedDate = "";
 			var formattedTime = "";
 			}
 		return fault+ "\n"+formattedDate + "\n" + formattedTime;
     	}
        	
        },
        wrapping : true,

        	});
		var oCarNum = new sap.m.Text({text: "{ZzcarNum}"});
        var oAsset = new sap.m.Text({text: "{ZzassetDesc}"});
        var oSymptom = new sap.m.Text({text:{
        	parts :[{path : "ZzsymptomGpDesc"} , {path : "ZzsymptomCodeDesc"}],
        
			formatter : function(symGpDesc,symCodeDesc){
				if(symGpDesc&&symCodeDesc)
				{
				return symGpDesc +" - "+symCodeDesc;
				}
				else if(symCodeDesc)
					{
					return symCodeDesc;
					}
				else if(symGpDesc)
					{
					return symGpDesc;
					}
			}}
	});
        var oPosition = new sap.m.Text({text:{
	      	parts :[{path : "Zzposition"} , {path : "ZzpositionDesc"}],
	        
			formatter : function(positionCode,positionDesc){
				if(positionCode&&positionDesc)
					{
					return positionCode +" - "+positionDesc;
					}
				else if(positionCode)
					{
					return positionCode
					}
				else if(positionDesc)
					{
					return positionDesc;
					}
				
				
			
			}}
	});
        var oFaultDesc = new sap.m.Text({text: "{ZznotifDesc}"});
        var oWONumber = new sap.m.Text({text: "{ZzworkOrder}"});
        var oRow = new sap.m.ColumnListItem();
   		oRow.addCell(oDateTime).addCell(oCarNum).addCell(oAsset).addCell(oSymptom).addCell(oPosition).addCell(oFaultDesc).addCell(oWONumber);
		var oTableDialog = new sap.m.Table({
	    	//mode : sap.m.ListMode.SingleSelectLeft,
	    	includeItemInSelection : true,
			
		}).addStyleClass("dialogTable");
		this.oTableDialog = oTableDialog;
		var oModel = new sap.ui.model.json.JSONModel();
		oTableDialog.setModel(oModel);
		/*oTableDialog.attachSelectionChange(function(oEvent) {
			oController.onItemPress(oEvent);
			});*/
		//to be added addColumn(oColDateTime)
		oTableDialog.addColumn(oColNotification).addColumn(oColCarNum).addColumn(oColAsset).addColumn(oColSymptom).addColumn(oColPosition).addColumn(oColFaultDesc).addColumn(oColWO);
		oTableDialog.bindItems("/", oRow);
		var conNotification = new sap.m.Button({
			text : "OK",
			icon: "sap-icon://accept",
			press : function(evt) {
				oController.closeDialog(evt);
			}
		}).addStyleClass("notifybutton");
		var notificationButtons = new sap.m.FlexBox({
			justifyContent: "SpaceAround",
			items : [conNotification]
		});
		
		var dialogNotification = new sap.m.Dialog("notifyDialog",{
			contentWidth : "1500px",
			horizontalScrolling : true,
			verticalScrolling : true,
			content: [oTableDialog],
			buttons:[notificationButtons],
			
		});
		this.dialogNotification = dialogNotification;
		var faultCountBtn =  new sap.m.Button({
     	   //text : "Outstanding Faults on selected cars (12)",
     	   icon : "sap-icon://message-warning",
     	   press : function(evt){
     		  // oController.saveRMA(evt)
     		   oController.carCount(evt);
     	   }
        });
		this.faultCountBtn = faultCountBtn;

 		return new sap.m.Page({
//			 customHeader : headerBar,
 			 customHeader : new sap.m.Bar({
					contentMiddle : [
					   new sap.m.Label({
				    	text : "Job Card"
				    }).addStyleClass("appTitle")					              
					 ]
				}),
			content: [jobHeader,iconTabBar],
			footer : new sap.m.Bar({
				contentLeft : [faultCountBtn
				                
				],
				contentRight : [
				                // Defect #6489 - narasimb
						         /*  new sap.m.Button({
						        	   text : "Place on Hold",
						        	   icon : "sap-icon://media-pause",
						        	   press : function(evt){
						        		   oController.confirmAndPost("Do you want to place all the action items on hold?",oController.placeOnHold);
//						        		   oController.placeOnHold(evt)
						        	   }
						           }),*/
						           new sap.m.Button({
						        	   text : "Save",
						        	   icon : "sap-icon://save",
						        	   press : function(evt){
						        		   oController.confirmAndPost("Do you want to save the task list?",oController.saveTaskDetails);						        		  
//						        		   oController.saveTaskDetails(evt)
						        	   }
						           })     
						                ]
								})
		});
	}

});