sap.ui.jsview("tfnswjobcard.TaskDetails", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf TaskDetails
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.TaskDetails";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf TaskDetails
	*/ 
	createContent : function(oController) {
		var jobDetailsController = this.getViewData().getPage("jobDetails").oController;
		this.addStyleClass("whiteBackground");
		/* ---- Declarations ---- */
		// Task Details Table
		var taskDetTable = new sap.m.Table({
			headerText: "",
			includeItemInSelection : true
		});
		this.taskDetTable = taskDetTable;
		// Car Header Column
		var carCol = new sap.m.Column({
			//width :"25%",
			hAlign : sap.ui.core.TextAlign.Center, 
			vAlign : sap.ui.core.VerticalAlign.Middle,
			header: new sap.m.Text({
				text:"Car"
			}).addStyleClass("tableTitle")
		});
		// Completed Header Column
		var compCol = new sap.m.Column({
			//width :"25%",
			hAlign : sap.ui.core.TextAlign.Center, 
			vAlign : sap.ui.core.VerticalAlign.Middle,
			header: new sap.m.Text({
				text:"Completed"
			}).addStyleClass("tableTitle")
		});
		// Further Action Header Column
		var furActCol = new sap.m.Column({
			//width :"25%",
			hAlign : sap.ui.core.TextAlign.Center, 
			vAlign : sap.ui.core.VerticalAlign.Middle,
			header: new sap.m.Text({
				text:"Further Action?"
			}).addStyleClass("tableTitle")
		});
		// Fault Header Column
		var faultCol = new sap.m.Column({
			//width :"25%",
			hAlign : sap.ui.core.TextAlign.Center, 
			vAlign : sap.ui.core.VerticalAlign.Middle,
			header: new sap.m.Text({
				text:"Fault"
			}).addStyleClass("tableTitle")
		});
		// Record Observation Header Column
		var recObservCol = new sap.m.Column({
			//width :"25%",
			hAlign : sap.ui.core.TextAlign.Center, 
			vAlign : sap.ui.core.VerticalAlign.Middle,
			header: new sap.m.Text({
				text:"Record Observation"
			}).addStyleClass("tableTitle")
		});
		// Append Header Columns to the table
		taskDetTable.addColumn(carCol).addColumn(compCol).addColumn(furActCol).addColumn(faultCol).addColumn(recObservCol);
		
		// Car Cell
		var carCell = new sap.m.Text({
			text: "{Car}"
		});
		// Completed Cell
		var completedCell = new sap.m.CheckBox({
			selected: "{completed}",
			select : function(evt){
				if(evt.getParameters().selected){
					oController.bindFurtherActionPopup(evt)
				}
				else{
					evt.getSource().getParent().getCells()[2].invalidate();
					evt.getSource().getParent().getCells()[2].rerender();
					setTimeout(function(){ oController.bindFurtherActionPopup()},1000);
				}
			},
			/*editable:{
				parts : [{path : "ReasonText"}],
				formatter : function(ReasonText){
					if(ReasonText != ""){ 
						return false
					}
					else
						return true
				}
			} */
			editable:{
				parts : [{path : "ReasonText"}],
				formatter : function(ReasonText){
					/*if(ReasonText){ //Defect 6563 narasimb
						if($.trim(ReasonText).toUpperCase() === "FAULT" )
							return true;
					}
					*/
					var rCode = $.trim(jobDetailsController.getActionKey[ReasonText]);
					//if(ReasonText != ""){ 
					if(rCode === "10" || rCode === ""){		//3.	Allow Completed and Further Action together if “Record Observation” further action is selected -- PCR		
						return true
					}
					else
						return false
				}
			} 			
		}).addStyleClass("jobTaskCompChkBox");
		// Further Action Cell
		var furtherActCell = new sap.m.Input({
			editable : false, 
			enabled : true, 
			width : "70%",
			placeholder : "Select Reason",
			value : "{ReasonText}",
			/*visible : {
				parts : [{path : "completed"}],
				formatter : function(completed){
					return !completed
				}
			},*/			
			visible : {
				parts : [{path:"ReasonText"},{path : "completed"}],
				formatter : function(ReasonText, completed){
					var rCode = $.trim(jobDetailsController.getActionKey[ReasonText]);
					if(rCode === "10")
						return true;
					else
						return !completed
				}
			},			
		}).addStyleClass("furtherActionInput"); ;
		this.furtherActCell = furtherActCell;
		furtherActCell.onAfterRendering =  function(evt){
//			//oController.bindActionPopup();
			//alert("open popup");
			oController.bindFurtherActionPopup();
		};
		// Fault Cell
		var faultCell = new sap.ui.core.Icon({
			src: "sap-icon://notification",
			size : "3em",
			visible:{
				parts:[{path:"ReasonText"}],
				formatter: function(reasonText){
					if(reasonText === "Fault")
						return true;
					else
						return false;
				}
			},
			press: function(evt){
				oController.navigateToFault(evt)
			}
		});
		// Record Observation Cell
		var recObservCell = new sap.ui.core.Icon({
			src: "sap-icon://document-text",
			size : "3em",
			press:function(evt){
				oController.toRecordObservation(evt)
			}
		});
		
		// Task Details Row
		var taskDetRow = new sap.m.ColumnListItem({
			cells:[
			       carCell, completedCell, furtherActCell, faultCell, recObservCell
			       ]
		});
		
		// Json Model for Task Details table
		var taskDetModel = new sap.ui.model.json.JSONModel();
		/*var arrData = []
		var data = {};
		data.Aplzl= "00000002";
		data.Aufnr= "000020061895";
		data.Aufpl= "1000061997";
		data.Car= "2703";
		data.CarType= "";
		data.completed = false;
		data.Depot= "4020";
		data.Docex= "";
		data.InspType= "WHMS";
		data.Matex= "";
		data.MeasPoints= "X";
		data.Oper= "X";
		data.Pernr= "00000000";
		data.ReasonCode= "6";
		data.ReasonText= "Fault";
		data.Safety= "X";
		data.SeqInsp= "00000001";
		data.ShiftInsp= "BMD-0800-TECH";
		data.ShiftRepair= "BMD-0800-TECH";
		data.SkilRepair= "M/E";
		data.SkillInsp= "M/E";
		data.Status= "3";
		data.StdText= "TEST";
		data.Subject= "";
		data.SuppTask= "";
		data.TaskCode= "01.1640";
		data.TaskText= "For all crew doors examine t";
		data.Version= "2.95";
		data.Vornr= "0020";
		data.ZoneArea= "Z0 - Pre Inspection Pit / Lower Level Exterior";
		data.Zzsystem= "BOGIE SYSTEM";
		arrData.push(data);
		var data = {};
		data.Aplzl= "00000002";
		data.Aufnr= "000020061895";
		data.Aufpl= "1000061997";
		data.Car= "2704";
		data.CarType= "";
		data.completed = false;
		data.Depot= "4020";
		data.Docex= "";
		data.InspType= "WHMS";
		data.Matex= "";
		data.MeasPoints= "X";
		data.Oper= "X";
		data.Pernr= "00000000";
		data.ReasonCode= "6";
		data.ReasonText= "Fault";
		data.Safety= "X";
		data.SeqInsp= "00000001";
		data.ShiftInsp= "BMD-0800-TECH";
		data.ShiftRepair= "BMD-0800-TECH";
		data.SkilRepair= "M/E";
		data.SkillInsp= "M/E";
		data.Status= "3";
		data.StdText= "TEST";
		data.Subject= "";
		data.SuppTask= "";
		data.TaskCode= "01.1640";
		data.TaskText= "For all crew doors examine t";
		data.Version= "2.95";
		data.Vornr= "0020";
		data.ZoneArea= "Z0 - Pre Inspection Pit / Lower Level Exterior";
		data.Zzsystem= "BOGIE SYSTEM";
		arrData.push(data);		*/
		//taskDetModel.setData(arrData);
		taskDetTable.setModel(taskDetModel);
		taskDetTable.bindItems("/",taskDetRow);
		taskDetTable.onAfterRendering = function(evt){
			oController.bindFurtherActionPopup();
		}
 		return new sap.m.Page({
 			enableScrolling: false,
 			//title: "Task Details",
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
                                                       text: "Task Details",
                                                   }).addStyleClass("pageTitle")
                               ],
                               contentRight: [      ]
                           })],
			content: [
			          taskDetTable
			],
			footer : new sap.m.Bar({
				contentLeft : [
				],
				contentRight : [
					           new sap.m.Button({
					        	   text : "Save",
					        	   icon : "sap-icon://save",
					        	   press : function(evt){
					        		   oController.confirmAndPost("Do you want to save the task list?",oController.saveTaskDetails);						        		  
					        	   }
					           })     
				]
			})			
		});
	}

});