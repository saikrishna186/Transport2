

	sap.ui.jsfragment("tfnswjobcard.app.measurement", {  

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.app.header
	*/ 

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.app.header
	*/ 
	createContent : function(oController) {

		
		/*var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
		};
		var deviceIsMobile = false;
		var enableReadControl = true;
		if(isMobile.any()){
			enableReadControl = false;
			deviceIsMobile = true;
		}*/
			
		var busy = new sap.m.BusyIndicator({			
			text : "Fetching Measurement Points...",
			design : "dark",
			visible : false,
			size : "4em"
		});
		
		
		var oTable = new sap.m.Table({
	    	mode : sap.m.ListMode.SingleSelectMaster,
	    	includeItemInSelection : true,
	    	itemPress : function(evt){
	    		// oController.displayCheckListItem(evt);
	    	}	    	
			}).addStyleClass("dialogTable");
		this.oTable = oTable;
		oTable.onAfterRendering =  function(evt){
    		oController.bindConditionPopup();
    		/*if(deviceIsMobile) // if running in mobile
    			oController.bindCurrentReading();*/
    		//else
    		//	$(".measurementReading").prop('readonly', false);
    	};
    	
		
		//Columns
		
		var col1 = new sap.m.Column({header: new sap.m.Text({text:"Measurement Point"}).addStyleClass("tableTitle") });
  		var col2 = new sap.m.Column({header: new sap.m.Text({text:"Description"}).addStyleClass("tableTitle") });
  		var col2_5 = new sap.m.Column({header: new sap.m.Text({text:"Position"}).addStyleClass("tableTitle") });
  		var col3 = new sap.m.Column({header: new sap.m.Text({text:"Upper Limit"}).addStyleClass("tableTitle") });
  		var col4 = new sap.m.Column({header: new sap.m.Text({text:"Lower Limit"}).addStyleClass("tableTitle") });
  		var col5 = new sap.m.Column({header: new sap.m.Text({text:"Last Reading"}).addStyleClass("tableTitle") });
  		var col6 = new sap.m.Column({header: new sap.m.Text({text:"Current Reading"}).addStyleClass("tableTitle") });
  		var col7 = new sap.m.Column({header: new sap.m.Text({text:"Condition"}).addStyleClass("tableTitle") });
  		var col8 = new sap.m.Column({header: new sap.m.Text({text:"Comments"}).addStyleClass("tableTitle") });
  		
	  
	    oTable.addColumn(col1).addColumn(col2).addColumn(col2_5).addColumn(col3).addColumn(col4).addColumn(col5).addColumn(col6).addColumn(col7).addColumn(col8);	 
	    
	    var measurePt =  new sap.m.Text({ text:"{Point}"}); 
		var description =  new sap.m.Text({ text:"{Pttxt}"}); 
		var mPos = new sap.m.Text({text : "{Psort}"});
		var upperLimit =  new sap.m.Text({ 
			text: {
			parts : [{path : "Mrmac"},{path : "Unitm"},{path : "Mrmaxi"}],
			formatter : function(value,unit,maxLimit){
				if(maxLimit == "X")
				return value + " " + unit;
				else
				return "";
			}
		}
		}); 
		var lowerLimit =  new sap.m.Text({ 
			text: {
				parts : [{path : "Mrmic"},{path : "Unitm"},{path : "Mrmini"}],
				formatter : function(value,unit,minLimit){
					if(minLimit == "X")
					return value + " " + unit;
					else
					return ""
				}
			}
		}); 
		var lastRead =  new sap.m.Text({ 			
			text: {
			parts : [{path : "Recdc"},{path : "Unitm"}],
			formatter : function(value,unit){
				return value + " " + unit;
			}
			}
		}); 
		var currentRead = new sap.m.FlexBox({
			visible : {
				parts : [{path : "QuanFlag"}],
				formatter : function(quan){
//					quan == "X" ? false : true;
					if(quan == "X")
						return true
						else
						return false
				}
			},		
			items: [
			new sap.m.Input({
				editable : true,
				//editable : enableReadControl,
				type : sap.m.InputType.Number,
				enabled : true,
				maxLength: 22,
				value : "{RecdvChar}",
				layoutData : new sap.m.FlexItemData({
				styleClass : "currentReadingInput"				
			})}).addStyleClass("measurementReading")
			.attachBrowserEvent("focusout", function(event){
				oController.validateMeasurementReading(event, this);
			})
			.attachBrowserEvent("keypress", function(event){
				 if (String.fromCharCode(event.keyCode).match(/[^0-9\.]/g)) 
				 {
					 event.preventDefault()
				 }
			})

			,
			new sap.m.Text({text: "{Unitm}", wrapping: false,
				layoutData: new sap.ui.core.VariantLayoutData({
					multipleLayoutData: [new sap.ui.layout.ResponsiveFlowLayoutData({
							weight: 1
						}),
						new sap.ui.layout.form.GridElementData({
							hCells: "1"
						}),
						new sap.ui.layout.GridData({
							span: "L1 M1 S1"
						})
					]
				})
			}).addStyleClass("paddingUnit")
			]
		});
		
		
		var codeGroup = new sap.ui.core.CustomData({key:"codeGroup"});
		codeGroup.bindProperty("value", "Codgr");

		var condition = new sap.m.Input({editable : false , enabled : true, value : "{Kurztext}",
			visible : {
				parts : [{path : "QualityFlag"}],
				formatter : function(qual){
//					qual == "X" ? false : true;
					if(qual == "X")
						return true
						else
							return false
				}
			},
			placeholder : "Select Condition"
		}).addStyleClass("conditionInput");
		
		condition.addCustomData(codeGroup);
		
		var comments = 	new sap.m.TextArea({
			value: "{Dstxt}",
			enabled : true,
			cols : 50,
			rows  : 3,
			maxLength: 40,
			}); 
		var oRow = new sap.m.ColumnListItem({
//			type : sap.m.ListType.Active
			});

		oRow.addCell(measurePt).addCell(description).addCell(mPos).addCell(upperLimit).addCell(lowerLimit).addCell(lastRead).addCell(currentRead).addCell(condition).addCell(comments);
		var measurementModel= new sap.ui.model.json.JSONModel();
		oTable.setModel(measurementModel);

		    
		    
		 oTable.bindItems("/",oRow);
		//oTable.addItem(oRow);

	    
	    var headerText =  new sap.m.Text({
			//icon : "sap-icon://performance",
			text : "",
		});
	   this.headerText = headerText;
	   var icon = new sap.ui.core.Icon({
		   src : "sap-icon://performance",
		   size: "2em",
	   });
		var oMeasurePanel = new sap.m.Panel({
			width : "95%",
			//showCollapseIcon:false,
			content : [ oTable ],
			headerToolbar : [ new sap.m.Toolbar({
				content : [icon,headerText]
				
			}) ]
		}).addStyleClass("notesLayout");
		oMeasurePanel.measurementTable = oTable;
		oMeasurePanel.busy = busy;
		this.oMeasurePanel = oMeasurePanel;
		
		return oMeasurePanel;

	}

});