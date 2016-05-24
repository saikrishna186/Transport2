sap.ui.jsview("worklog.myCurrentWork", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fltmgmt.myCurrentWork
	 */
	getControllerName : function() {
		return "worklog.myCurrentWork";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf fltmgmt.myCurrentWork
	 */

	createContent : function(oController) {

		var oLayout1 = new sap.ui.layout.form.ResponsiveGridLayout({
			emptySpanL : 1,
			columnsL : 1,
		});

		var oLayout2 = new sap.ui.layout.form.ResponsiveGridLayout({
			columnsL : 1,
		});
		var carInput = new sap.m.Input({
			layoutData : new sap.m.FlexItemData({
				alignSelf : "Center",

			}),
		}).addStyleClass("paddingRight");
		carInput.ontouchstart = function(evt) {
			oController.openCarPopup(this);
		};
		this.carInput = carInput;
		var setNum = new sap.m.Input({
			layoutData : new sap.m.FlexItemData({
				alignSelf : "Center",

			}),
		}).addStyleClass("paddingRight");
		setNum.ontouchstart = function(evt) {
			oController.openSetPopup(this);
		};
		this.setNum = setNum;

		var carLabel = new sap.m.Label({
			text : "Car Number"
		});
		this.carLabel = carLabel;

		var setLabel = new sap.m.Label({
			text : "Set Number"
		});
		this.setLabel = setLabel;

		var blankLabel = new sap.m.Label({
			text : ""
		});
		this.blankLabel = blankLabel;

		var filterButton = new sap.m.Button({
			text : "",
			press : function(evt) {
				oController.applyFilter();
			},
		});
		this.filterButton = filterButton;

		var carHBox = new sap.m.HBox({
			items : [ new sap.m.VBox({
				items : [ carLabel, carInput ]
			}).addStyleClass("blockVBox"), new sap.m.VBox({
				items : [ blankLabel, new sap.m.Button({
					width : "10%",
					icon : "sap-icon://delete",
					press : function() {
						oController.clearCarData();
					}
				}), ]
			}).addStyleClass("blockVBox"), ]
		});

		var setHBox = new sap.m.HBox({
			items : [ new sap.m.VBox({
				items : [ setLabel, setNum ]
			}).addStyleClass("blockVBox"), new sap.m.VBox({
				items : [ new sap.m.Label({
					text : ""
				}), new sap.m.Button({
					width : "10%",
					icon : "sap-icon://delete",
					press : function() {
						oController.clearSetData();
					}
				}) ]
			}).addStyleClass("blockVBox") ]
		});

		var CarSetHBox = new sap.m.HBox({
			items : [ carHBox, setHBox ],
			justifyContent : "SpaceBetween",
		});

		var row1 = new sap.ui.layout.form.Form({
			editable : true,
			layoutData : new sap.m.FlexItemData({}),
			layout : oLayout1,
			formContainers : [ new sap.ui.layout.form.FormContainer({

				formElements : [ new sap.ui.layout.form.FormElement({
					fields : [ CarSetHBox ]
				}), ]
			}), ]
		});
		this.row1 = row1;
		var oWorkOrdNo = new sap.m.Column({
			header : new sap.m.Text({
				text : "Work Order No."
			}).addStyleClass("Title")
		});

		var oOperationNo = new sap.m.Column({
			header : new sap.m.Text({
				text : "Operation No.\n Description",
				wrapping : true,
			}).addStyleClass("Title")
		});

		var oDesc = new sap.m.Column({
			header : new sap.m.Text({
				text : "Description"
			}).addStyleClass("Title")
		});

		var oCar = new sap.m.Column({
			header : new sap.m.Text({
				text : "Car No.\n Set No."
			}).addStyleClass("Title")
		});

		var oSet = new sap.m.Column({
			header : new sap.m.Text({
				text : "Set No."
			}).addStyleClass("Title")
		});
		
		var oFaultDet = new sap.m.Column({
			header : new sap.m.Text({
				text : "Fault Details"
			}).addStyleClass("Title")
		});
		var myInputField = new sap.m.DateTimeInput({
			placeholder : "hh:mm",
			displayFormat : "HH:mm",
			width : "100%",
			type : "Time",
			value : "{ZzactualDuration}",
			valueFormat : "HH.mm"
		}).addStyleClass("duration_Align");
		this.myInputField = myInputField;
		var oDuration = new sap.m.Column({
			header : new sap.m.Text({
				text : "Duration",
			}).addStyleClass("Title")
		});

		var oWorkStatus = new sap.m.Column({
			header : new sap.m.Text({
				text : "Work Status"
			}).addStyleClass("Title")
		});

		var oTaskCompleted = new sap.m.Column({
			header : new sap.m.Text({
				text : "Completed?"
			}).addStyleClass("Title")
		});

		var checkBox = new sap.m.CheckBox({
			enabled : true,
			selected : "{ZztaskCmpltd}",
			wrapping : false
		});
		this.checkBox = checkBox;
		var oTemplate = new sap.m.ColumnListItem({
			unread : false,
			vAlign : "Middle",
			cells : [ new sap.m.Text({
				text : "{ZzwoNo}",
				wrapping : false
			}), new sap.m.Text({
				text : {
					parts : [ {
						path : "ZzoperationNo"
					}, {
						path : "Zzltxa1"
					} ],
					formatter : function(ZzoperationNo, Zzltxa1) {
						return ZzoperationNo + "\n" + Zzltxa1;
					}
				},
				wrapping : true,
			}), new sap.m.Text({
				text :{
					parts:[
					       {path:"Zzcarid"},
					       {path:"Zzsetid"}
					],
					formatter: function(car, set){
						return car + "\n" + set;
					}
					
				}, 
					
				wrapping : true
			}),
			new sap.ui.core.Icon({
				src:{
					parts:[{path:"Zznotif"}
					       ],
					formatter: function(notif){
						if(notif)
							return "sap-icon://message-error"
					}
				},
				size: "2rem",
				color: "#0077a6",
				press: function(evt){
					oController.openNotif(evt);
				}
			}),
			
			/*new sap.m.Text({
				text : "{Zzsetid}",
				wrapping : false
			}),*/

			myInputField, new sap.m.Text({
				text : "{ZzworkStatus}",
				wrapping : false
			}), checkBox

			]
		});

		this.oTemplate = oTemplate;

		var oTable = new sap.m.Table("mainTable", {
			mode : sap.m.ListMode.MultiSelect,
			includeItemInSelection : false,
			//columns : [ oWorkOrdNo, oOperationNo, oCar, oSet, oDuration,
			columns : [ oWorkOrdNo, oOperationNo, oCar, oFaultDet, oDuration,
					oWorkStatus, oTaskCompleted ],
			growing : true,
			growingThreshold : 20

		}).addStyleClass("table");
		this.oTable = oTable;
		oTable.attachSelectionChange(function(oEvent) {
		});
		var tableTitle = new sap.m.Text({
			text : "Select Code"
		}).addStyleClass("Title");
		this.tableTitle = tableTitle;
		var label1 = new sap.m.Label({
			text : "My Shift Start Date/Time",
			textAlign : "Left"
		});
		var label2 = new sap.m.Label({
			text : ""
		});
		var label3 = new sap.m.Label({
			text : "My Current Work"
		});
		var label4 = new sap.m.Label({
			text : ""
		});
		var dateTime = new sap.m.DateTimeInput({
			placeholder : "Pick Start Date/Time",
			type : "DateTime",
			width : "50%",
			showValueHelp : true,
			change : function(e) {
			}
		});
		this.dateTime = dateTime;

		var dateData = new sap.ui.layout.form.Form({

			title : "My Shift Start Date/Time",
			editable : true,
			layout : new sap.ui.layout.form.ResponsiveGridLayout(),
			formContainers : [ new sap.ui.layout.form.FormContainer({

				formElements : [ new sap.ui.layout.form.FormElement({
					fields : [ dateTime ]
				}) ]
			}),

			]
		}).addStyleClass("carLayout");
		this.dateData = dateData;

		var tableData = new sap.ui.layout.form.Form({

			editable : true,
			layout : oLayout2,
			formContainers : [ new sap.ui.layout.form.FormContainer({

				formElements : [ new sap.ui.layout.form.FormElement({
					fields : [ oTable ]
				}) ]
			}),

			]
		});
		this.tableData = tableData;
		var filterButton = new sap.m.Button("filButton", {
			text:"Add Filter",
			//icon : "sap-icon://filter",
			press : function() {
				oController.filterData();
			}
		}).addStyleClass("AddFilterButton");
		this.filterButton = filterButton;
		var toolbar = new sap.m.Toolbar("tablePanel", {

			content : [ new sap.ui.core.Icon({
				src : "sap-icon://timesheet",
			}), new sap.m.Text("titleText", {
				text : "My Work List"
			}), new sap.m.ToolbarSpacer(), filterButton ]
		});
		var oTablePanel = new sap.m.Panel({

			headerToolbar : toolbar,
			content : [ tableData ]
		}).addStyleClass("carLayout");
		var oWONum = new sap.m.Column({
			header : new sap.m.Text({
				text : "Work Order"
			}).addStyleClass("Title")
		});
		var oMessage = new sap.m.Column({
			header : new sap.m.Text({
				text : "Result"
			}).addStyleClass("Title")
		});
		var oType = new sap.m.Column({
			header : new sap.m.Text({
				text : ""
			}).addStyleClass("Title")
		});
		var oOperation = new sap.m.Column({
			header : new sap.m.Text({
				text : "Operation"
			}).addStyleClass("Title")
		});
		var oTable_create = new sap.m.Table("createTable", {
			includeItemInSelection : true,
		}).addStyleClass("dialogTable");
		this.oTable_create = oTable_create;
		oTable_create.addColumn(oType).addColumn(oMessage).addColumn(oWONum)
				.addColumn(oOperation);
		var closeButton = new sap.m.Button({
			text : "OK",
			press : function(evt) {
				oController.closeDialog(evt);
			}
		}).addStyleClass("notifybutton");
		var closeFilter = new sap.m.Button({
			text : "Cancel",
			press : function(evt) {
				oController.cancelFilterDialog(evt);
			}
		}).addStyleClass("filterButton");
		var okApplyFilter = new sap.m.Button({
			text : "OK",
			press : function(evt) {
				oController.applyFilter();
			}
		}).addStyleClass("filterButton");
		var createNotification = new sap.m.Dialog("createDialog", {
			title : "Confirmation Results",
			contentWidth : "800px",
			horizontalScrolling : true,
			verticalScrolling : true,
			content : [ oTable_create ],
			buttons : [ closeButton ],

		});
		this.createNotification = createNotification;

		var buttonFlexBox = new sap.m.FlexBox({
			justifyContent : "SpaceBetween",
			items : [ okApplyFilter, closeFilter ],

		});
		var filterDialog = new sap.m.Dialog("filterDialog", {
			title : "Work List filter",
			contentWidth : "600px",
			horizontalScrolling : true,
			verticalScrolling : true,
			content : [ row1 ],
			buttons : [ buttonFlexBox ],

		});
		this.filterDialog = filterDialog;
		var page3 = new sap.m.Page({
			customHeader : new sap.m.Bar({
				contentLeft : [
//				               new sap.m.Button({
//				            	   icon:"sap-icon://home",
//                                   size:"1.5em",
//				            	   press:function(evt){
//				            		   oController.toTileHome(evt);
//				            	   }
//				               })
				               ],
				contentMiddle : [ new sap.m.Label({
					text : "My Work List"
				}).addStyleClass("appTitle"), ],
			}),
			footer : new sap.m.Bar({
				contentRight : [ new sap.m.Button({
					text : "Confirm",
					icon : "sap-icon://accept",
					press : function(evt) {
						oController.onItemSelect();
					}
				}).addStyleClass("bButton") ]
			}),
			content : [ dateData, oTablePanel ]
		}).addStyleClass("backGroundColor");
		return page3;
	}

});