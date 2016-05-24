jQuery.sap.require("sap.m.MessageBox"); 
sap.ui.controller("tfnswjobcard.measurementPoints", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnswjobcard.measurementPoints
*/
	handleNavBack : function(evt){
		var app = this.getView().getViewData();	         
        app.to(this.getView().data("prevPage"));

	},
	
	validateMeasurementPoints : function(evt){
		
		var controller = this;
		var measurementPanels = this.getView().measurementPage.getContent();
		var initMps = [];
		var invalid = false;
		var totalMeasPts = 0;
		for( var i = 0 ; i < measurementPanels.length ; i++){
			var measurements = measurementPanels[i].measurementTable.getModel().getData();
			if(measurements){
			for( var j = 0 ; j < measurements.length ; j++){
				totalMeasPts = totalMeasPts + 1;
			if(measurements[j].RecdvChar == "" && measurements[j].Kurztext == ""){
				invalid = true;
				initMps.push(measurements[j].Point) ;
			 }
			}
		  }
		}
		if(invalid){
			if(initMps.length === totalMeasPts)
			{
				var message = "None of the measurement point has the measurement/condition reading populated.\n No Measurement document will be created";
				
				sap.m.MessageBox.alert(
						message,{
						title: "Info",
						styleClass : "confirmationDialog",
						onClose : function(action){
						if(action == "OK"){
							//controller.saveMeasurement()
						}	
						}					
					}
			);
			}
			else
			{
				//var message = "The following measurement points do not have measurement/condition readings populated. \n" + "[" + initMps.join(",") + "] \n\n Do you want to create measurement documents for the remaining measuring points?";
				//Defect 7078 -- narasimb
				var message = "The following measurement points do not have measurement/condition readings populated. \n" + "[" + initMps.join(",") + "] \n\n Do you wish to save with some measurement points unpopulated?";
				sap.m.MessageBox.confirm(
						message,{
						title: "Are you sure?",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						styleClass : "confirmationDialog",
						onClose : function(action){
						if(action == "YES"){
							controller.saveMeasurement()
						}	
						}					
					}
			);				
			}

		}
		else{
			controller.saveMeasurement();
		}
			
	},
	
	saveMeasurement : function(){
		
		var controller = this;
		var app = this.getView().getViewData();
	
		var taskCode = this.getView().data("taskCode");
		var setNo = this.getView().data("setNo");
		var data = {}; // data object
		data.d = {};
		data.d.SetId = setNo;
		data.d.TaskCode = taskCode;
		data.d.MsgType = "";
		data.d.Message = "";
		data.d.SaveFlag = "X";
		data.d.NAV_MEAS_MPOINT = [];
		
//		delete data.d.
		
		
		var measurementPanels = this.getView().measurementPage.getContent();
		for( var i = 0 ; i < measurementPanels.length ; i++){
//			var carId = measurementPanels[i].data("carId");
			var measurements = measurementPanels[i].measurementTable.getModel().getData();
			if(measurements){
			for( var j = 0 ; j < measurements.length ; j++){
//			measurements[j].RecdvChar = measurements[j].RecdvChar;
//			measurements[j].Codgrr = controller.getConditionCode[measurements[j].conditionInput];
			if(controller.getConditionCode){
			measurements[j].Code = controller.getConditionCode[measurements[j].Kurztext];
			}
//			delete measurements[j].currentReading;
//			delete measurements[j].conditionInput;
			}
			data.d.NAV_MEAS_MPOINT = data.d.NAV_MEAS_MPOINT.concat(measurements);
			}
		}
		app.controller.postData("/ETS_MEAS_HEAD",data,controller,controller.handleSaveSuccess);
	},
	
	handleSaveSuccess : function(success,response,payload){
		
		var app = this.getView().getViewData();
		if(success.MsgType === "S")
			sap.m.MessageBox.show( success.Message,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
		else
			sap.m.MessageBox.show( success.Message,sap.m.MessageBox.Icon.ERROR,"Save Error!", sap.m.MessageBox.Action.OK, null );
		app.to(this.getView().data("prevPage"));
//		console.log("Everything is awesome!");
	},

	
	getMeasurementData : function()
	{  
		var controller = this;
		var app = this.getView().getViewData();
		var carValues = this.getView().data("carValues");
		var taskCode = this.getView().data("taskCode");
		var setNo = this.getView().data("setNo");
		var carArray = carValues.split(",");
		var carArrayPost = [];
		var setArray = [];
		var taskArray = [];
		
		
		var data = {}; // data object
		data.d = {};
//		data.d.InspType = "";
		data.d.SetId = setNo;
		data.d.TaskCode = taskCode;
		data.d.NAV_MEAS_CAR = [];
		data.d.NAV_MEAS_MPOINT = [];
		data.d.NAV_MEAS_CODEGROUP = [];
		
//		carArray = ["2704","2705"];
		
		var length = carArray.length;
		for (var k =0; k<length; k++)
		{
			carArrayPost.push({"CarId" : carArray[k]});
			
			var car = carArray[k];
			var measurePanel = sap.ui.jsfragment("tfnswjobcard.app.measurement", this);
			measurePanel.data("carId",carArray[k]);
			measurePanel.getHeaderToolbar().getContent()[1].setText("Measurements - Car "+car+" ("+taskCode+ ")");
//			measurePanel.busy.setVisible(true);
			this.getView().measurementPage.addContent(measurePanel);
		}
	
		data.d.NAV_MEAS_CAR = carArrayPost;
		
//		var samplePayload = {
//				  "d": {
//					  "TaskCode":"01.1690",
//					  "SetId":"J4",
//					  "NAV_MEAS_CAR" : [
//					  {
//					"CarId" : "2704"
//					},
//					{
//					"CarId" : "2705"
//					}
//					],
//					"NAV_MEAS_CODEGROUP" : [
//					],
//					"NAV_MEAS_MPOINT" : [
//					]
//					 } };
		
			
		app.controller.postData("/ETS_MEAS_HEAD",data,controller,controller.bindMeasurementData);
				
	},	
	bindMeasurementData : function(measurementData)
	{
//		this.getView().measurementPage.setBusy(false);
		var controller = this;
		var app = this.getView().getViewData();
			
		var measurementPanels = this.getView().measurementPage.getContent();
		
//		for (var i in measurementPanels){
//			measurementPanels[i].busy.setVisible(false);
//		}		
		
		if(measurementData.NAV_MEAS_CODEGROUP && typeof(measurementData.NAV_MEAS_CODEGROUP.results) != "undefined"){
		this.codeGroups = measurementData.NAV_MEAS_CODEGROUP.results;
		this.getCodes = {};
		this.getConditionCode = {}
		
		for (var i = 0; i < controller.codeGroups.length ; i++){
			
			if(!controller.getCodes[controller.codeGroups[i].Codegruppe]){
				controller.getCodes[controller.codeGroups[i].Codegruppe] = [];
			}
			controller.getCodes[controller.codeGroups[i].Codegruppe].push(controller.codeGroups[i]);
			
			if(!controller.getConditionCode[controller.codeGroups[i].Kurztext]){
				controller.getConditionCode[controller.codeGroups[i].Kurztext] = {};
			}
			controller.getConditionCode[controller.codeGroups[i].Kurztext] = controller.codeGroups[i].Code;			
		}
		}
		
		var carMeasurements = {};
		if(measurementData.NAV_MEAS_MPOINT && typeof(measurementData.NAV_MEAS_MPOINT.results)!= "undefined"){
		var measurements =  measurementData.NAV_MEAS_MPOINT.results;
		
		for ( var j = 0 ; j < measurements.length ; j++ ){
			if(!carMeasurements[measurements[j].Carid]){
				carMeasurements[measurements[j].Carid] = [];
			}
			carMeasurements[measurements[j].Carid].push(measurements[j]); 
		}
		

		
		for( var i = 0 ; i < measurementPanels.length ; i++){
			var carId = measurementPanels[i].data("carId");
			measurementPanels[i].measurementTable.getModel().setData(carMeasurements[carId]);
		}
		}
		
//		this.getView().busy.setVisible(false);
	},
	
	bindCurrentReading : function(){
		var controller = this;
//		var currentReading = this.getView().currRead;
			
			$(".measurementReading").off().on("tap", function(event){
				if(!this.keyPad){
					var numPad = [];
					var source = this;
						
				    for(var i=0; i < 10 ; i++){
						var num = new sap.m.Button({
							text : i,
							press : function(){
								control = sap.ui.getCore().byId(source.id);
								control.setValue(control.getValue() + this.getText());
							}
						});
					num.addStyleClass("ratingInputButton");
					numPad.push(num);
				    }
			    
				    
				    var decimal = new sap.m.Button({
						text : ".",
						press : function(){
							control = sap.ui.getCore().byId(source.id);
							control.setValue(control.getValue() + this.getText());
						
						}
						}).addStyleClass("ratingInputButton");
						numPad.push(decimal);
						
						var backSpace = new sap.m.Button({
							text : "<--",
							press : function(){
								control = sap.ui.getCore().byId(source.id);
								control.setValue(control.getValue().substring(0,control.getValue().length - 1));
								
							}
						}).addStyleClass("ratingInputButton");
						numPad.push(backSpace);
				    
				    
					
					var popover = new sap.m.ResponsivePopover({
						title : "Enter Measurement Reading",
						content : numPad,
						placement : sap.m.PlacementType.Auto,
						afterClose : function(evt){
							controller.validateMeasurementReading(evt)
						}
					 }).addStyleClass("numPadInput");
					
					
					controller.keyPad = popover;
					}
					  controller.keyPad.openBy(this);
				   
			});
			
			
			// this.firstLoad = true;
		},
	
		validateMeasurementReading  : function(evt, source){
					
			//var source = evt.getParameters().openBy;
			//var currentReadingInput = sap.ui.getCore().byId(source.id);
			var currentReadingInput = source;
			var currentReadingString = currentReadingInput.getValue();
			var currentReading = Number(currentReadingString);
			
			
			if(currentReadingString != ""){
			
			var lowerLimit = Number(currentReadingInput.getBindingContext().getObject().Mrmic.split(",").join(""));
			var upperLimit = Number(currentReadingInput.getBindingContext().getObject().Mrmac.split(",").join(""));

		
			if(currentReadingInput.getBindingContext().getObject().Mrmaxi == "X" && currentReadingInput.getBindingContext().getObject().Mrmaxi == "X" ){					
			if(currentReading < lowerLimit){
				sap.m.MessageBox.show("Entered Reading is lower than the threshold limit.",sap.m.MessageBox.Icon.WARNING,"Out of bounds!", sap.m.MessageBox.Action.OK, null );
			}
			else if( currentReading > upperLimit){
				sap.m.MessageBox.show( "Entered Reading is higher than the threshold limit.",sap.m.MessageBox.Icon.WARNING,"Out of bounds!", sap.m.MessageBox.Action.OK, null );
			}
			}
			
			}
			
				
		},
	
	bindConditionPopup: function()
	{


		 var controller = this;

		    function openConditionPopup(){

	        return function () {
	            
		        var source = this;
		        var control = sap.ui.getCore().byId(source.id);

		        function selectConditionRequired() {

		            return function (evt) {
		            	

		                var control = sap.ui.getCore().byId(source.id);
		                control.setValue(evt.getParameters().listItem.getTitle());
		                control.data("key", evt.getParameters().listItem.data("key"));
		                source.list.close();
		            }
		        }
		        
		        var conditionValues = controller.getCodes[control.data("codeGroup")];
		        
		        if (!source.list) {
		            
		            var list = new sap.m.ResponsivePopover({
		                placement: sap.m.PlacementType.Left,
		                title: "Select Condition",
		                content: [],
		                width: "200px",
		                height: "300px"
		            }).addStyleClass("actionPopoverClass");
		            source.list = list;


		            var optionList = new sap.m.List({
		                mode: sap.m.ListMode.SingleSelectMaster,
		                includeItemInSelection: true,
		                select: selectConditionRequired(),
		                items: [],
		                width: "100%",
		                height: "100%"
		            }).addStyleClass("optionsList");
		            
		            for( var j = 0 ; j < conditionValues.length ; j++){
		                var option = new sap.m.StandardListItem({
			                title: conditionValues[j].Kurztext	             
			            }).data("key", conditionValues[j].Code);
		                
		                optionList.addItem(option);
		            }

		            source.list.addContent(optionList);

		        }

		        source.list.openBy(source);
		    
		    }

		}
	       
		    $(".conditionInput").off().on("tap", openConditionPopup());
			},
			
			checkNumeric: function(evt, evt1, evt2, evt3)
			{
				 if (String.fromCharCode(evt.keyCode).match(/[^0-9]/g)) 
					 return false;
			},
			
	onInit: function() {
		//this.measurementTable();
		//this.panelCreation();
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnswjobcard.measurementPoints
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnswjobcard.measurementPoints
*/
	onAfterRendering: function() {

		//this.panelCreation();
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnswjobcard.measurementPoints
*/
//	onExit: function() {
//
//	}

});