jQuery.sap.require("sap.m.MessageBox"); 
sap.ui.controller("tfnswjobcard.jobDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnswjobcard.jobDetails
*/
	onInit: function() {
		this.getActionsData();
	},
	
	confirmAndPost : function(Message,callback){
		
		var controller = this;
		jquery.sap.require(sap.m.MessageBox);
//		sap.m.MessageBox.show(Message,
//				sap.m.MessageBox.Icon.SUCCESS,"Confirm User Action", sap.m.MessageBox.Action.QUESTION, null );	
		sap.m.MessageBox.confirm(
					Message,{
//					icon: MessageBox.Icon.QUESTION,
					title: "Are you sure?",
					styleClass : "confirmationDialog",
					onClose : function(action){
					if(action == "OK"){
						callback.call(controller)
					}	
					}					
				}
		);
	},
	
	saveTaskDetails : function(evt){
		var temptaskData = this.getView().table.getModel().getData();
		var app = this.getView().getViewData();
		var controller = this;
		var taskData = [];
		for ( var k = 0 ; k < temptaskData.length ; k ++ ){
			var taskOrderData = controller.taskDataFull[temptaskData[k].TaskCode];
			for ( var i = 0; i < taskOrderData.length ; i++){
				var newTask = jQuery.extend({}, temptaskData[k]);
				newTask.Aufnr = taskOrderData[i].Aufnr
				taskData.push(newTask);
			}
		}
	
		for ( var k = 0 ; k < taskData.length ; k ++ ){
			if(taskData[k].ReasonCode == "X"){
				taskData[k].ReasonCode = "";
			}
			
			/*if(taskData[k].completed && taskData[k].ReasonText){ //Defect 6563 narasimb
				if($.trim(taskData[k].ReasonText).toUpperCase() === "FAULT")
				{
					taskData[k].ReasonCode = this.getActionKey[taskData[k].ReasonText];
				}
				else
					taskData[k].ReasonCode = "";
				taskData[k].Status = "2";
			}		
			else*/ 
			if(taskData[k].completed){
				/*if($.trim(this.getActionKey[taskData[k].ReasonText]) === "10") // If both completed and Record Observation
					taskData[k].ReasonCode = "10";
				else*/
					taskData[k].ReasonCode = "";
				taskData[k].Status = "2";
			}
			else if(taskData[k].ReasonText  != ""){
				taskData[k].ReasonCode = $.trim(this.getActionKey[taskData[k].ReasonText]);
				taskData[k].Status = "3"
			}
			else{
				taskData[k].ReasonCode = "";
				taskData[k].Status = "0";
			}
			delete taskData[k].completed;
			delete taskData[k].filterKey;
			
			// On Job Details if Further Action selected as "8 - Partially Complete" or "9 - Not completed" then exlude the record
			if(taskData[k].ReasonCode === "8" || taskData[k].ReasonCode === "9")
			delete taskData[k];
		}
	
		var taskPayload = {};
		taskPayload.d = {};
		taskPayload.d.Username = "SUSS";
		taskPayload.d.SetNo = "SUSS";
		taskPayload.d.InspType = "SUSS";
		taskPayload.d.CountFlag = "";
		taskPayload.d.FaultCount = "";
		taskPayload.d.HoldFlag = "";
		taskPayload.d.NAV_SET_TO_TASKCODES = taskData;
		
		//For return entity
		taskPayload.d.NAV_TO_RETURN = [];
		
		app.controller.postData("/ETS_SETIN",taskPayload,controller,controller.handleSaveSuccess);
	},
	
	handleTaskComplete : function(evt){
		
		var controller = this;
		var source = evt.getSource();
		var measuringPoints = source.getBindingContext().getObject().MeasPoints;
		
	if(measuringPoints == "X"){	
		if(!source.completeDialog){
			
		var dialog = new sap.m.Dialog({
			title: 'Are you sure?',
			content: new sap.m.Text({
				text : "Have you entered all the measurement readings?"
			}),
			afterClose : function(){
				controller.bindActionPopup();
			},
			beginButton: new sap.m.Button({
				text: 'Yes',
				press: function () {
					dialog.close();
//					controller.bindActionPopup();
				}
			}),
			endButton : new sap.m.Button({
				text: 'No',
				press: function () {
					source.setSelected(false)
					dialog.close();
					
				}
			})
		});
		
		source.completeDialog = dialog;
		}
		
		
		source.completeDialog.open();
	}
	},
	
	placeOnHold : function(evt){
		
		var temptaskData = this.getView().table.getModel().getData();
		var app = this.getView().getViewData();
		var controller = this;
		var taskData = [];
		
		
		for ( var k = 0 ; k < temptaskData.length ; k ++ ){
			
			var taskOrderData = controller.taskDataFull[temptaskData[k].TaskCode];
			
			for ( var i = 0; i < taskOrderData.length ; i++){
				var newTask = jQuery.extend({}, temptaskData[k]);
				newTask.Aufnr = taskOrderData[i].Aufnr
				taskData.push(newTask);
			}
			
		}
		
		for ( var k = 0 ; k < taskData.length ; k ++ ){
			/*if(taskData[k].completed && taskData[k].ReasonText){ //Defect 6563 narasimb
				if($.trim(taskData[k].ReasonText).toUpperCase() === "FAULT")
				{
					taskData[k].ReasonCode = this.getActionKey[taskData[k].ReasonText];
				}
				else
					taskData[k].ReasonCode = "";
				taskData[k].Status = "2";
			}
			else*/ 
			if(taskData[k].completed){
				taskData[k].ReasonCode = "";
				taskData[k].Status = "2";
			}
			else if(taskData[k].ReasonCode){
				taskData[k].ReasonCode = this.getActionKey[taskData[k].ReasonCode];
				taskData[k].Status = "3"
			}
			delete taskData[k].completed;
			delete taskData[k].filterKey;
		}
		
		var taskPayload = {};
		taskPayload.d = {};
		taskPayload.d.Username = "SUSS";
		taskPayload.d.SetNo = "SUSS";
		taskPayload.d.InspType = "SUSS";
		taskPayload.d.CountFlag = "";
		taskPayload.d.FaultCount = "";
		taskPayload.d.HoldFlag = "X";
		taskPayload.d.NAV_SET_TO_TASKCODES = taskData;
		
		//For return entity
		taskPayload.d.NAV_TO_RETURN = [];
		
		
		app.controller.postData("/ETS_SETIN",taskPayload,controller,controller.handleSaveSuccess);
		},
	
	handleSaveSuccess : function(data){
		
		var app = this.getView().getViewData();
		app.jobList.controller.selectJob(app.jobList.jobList.getSelectedItem(),true);
		var successMsg = "The task details have been successfully updated to the server."; //Custom Success message
		//sap.m.MessageBox.show("The task details have been successfully updated to the server.",sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
		if(data){
			var message = data.NAV_TO_RETURN.results;
			if(message)
			{
				message = message[0];
				if(message.TYPE === "S")
					sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
				else if(message.TYPE === "E")
					sap.m.MessageBox.show(message.MESSAGE,sap.m.MessageBox.Icon.ERROR,"Save Error!", sap.m.MessageBox.Action.OK, null );
				else // If no message returned issue success messgae as backend returns no msg
					sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
			}
			else // If no message returned issue success messgae as backend returns no msg
			{
				sap.m.MessageBox.show(successMsg,sap.m.MessageBox.Icon.SUCCESS,"Save Success!", sap.m.MessageBox.Action.OK, null );
			}
		}
		else{
			sap.m.MessageBox.show("Error in updating to the server" ,sap.m.MessageBox.Icon.ERROR,"Save Error!", sap.m.MessageBox.Action.OK, null );
		}
		
//		console.log("Everything is awesome!");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnswjobcard.jobDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnswjobcard.jobDetails
* 
*/
	closeDialog : function(evt)
	{
		var dialogNotification = this.getView().dialogNotification;
		this.dialogNotification.close();
		
	},
	openDialog : function(evt,source)
	{  
		var dialogNotification = this.getView().dialogNotification;
		if(!this.dialogNotification){
		
		this.dialogNotification = dialogNotification;
		}
		this.dialogNotification.open();
		
		
	},
	getDialogDetails : function(data, length)
	{
		var carValues = this.getView().jobHeader.getModel().getData().CarNo;
		var carArray = carValues.split(",");
		var carString ="";
		for(var k = 0;k<carArray.length;k++)
			{
			if(carArray.length == 1)
				{
				carString+=carArray[k];
				}
			else
				{
		 carString+=carArray[k]+"/";
		 
				}
			}
		if(carArray.length > 1)
			{
		carString = carString.slice(0, -1);
			}
		var tableDialog = this.getView().oTableDialog;
		var oModel = tableDialog.getModel();
		oModel.setData(data.results);
		this.getView().dialogNotification.setTitle(oModel.getData().length+" open faults for Cars "+carString);
        this.openDialog();
		
	},
	getTaskData : function(tasks){
		var controller = this;
		this.taskDataFull = {};
		for(var i=0;i<tasks.length;i++){
			tasks[i].completed = {};
			if(tasks[i].Status == "2"){
				tasks[i].completed = true;
				//console.log("status flag");
			}
			else
				tasks[i].completed = false;
		}
		for(var i=0; i < tasks.length ; i++){
			if(!controller.taskDataFull[tasks[i].TaskCode]){
				controller.taskDataFull[tasks[i].TaskCode] = [];
				controller.taskDataFull[tasks[i].TaskCode].push( jQuery.extend({},tasks[i]));
			}
			else{
				controller.taskDataFull[tasks[i].TaskCode].push(jQuery.extend({},tasks[i]));
				// If task has multiple cars assign the task status will be defined based on all cars statuses
				for(var j = 0; j < controller.taskDataFull[tasks[i].TaskCode].length; j++){ // Loop through to find the other cars status
					if(tasks[i].TaskCode === controller.taskDataFull[tasks[i].TaskCode][j].TaskCode){
						//if(controller.taskDataFull[tasks[i].TaskCode][j].Status === "3"){
						if(controller.taskDataFull[tasks[i].TaskCode][j].Status === "3" || controller.taskDataFull[tasks[i].TaskCode][j].Status === "0" ){ // P
							for(var k = 0; k < i; k ++){
								if(tasks[k].TaskCode === tasks[i].TaskCode){
									//Check if either of the record status is completed ie., 3
									if(tasks[k].Status === "2" || tasks[i].Status === "2" ){
										tasks[k].ReasonCode = "8";
										tasks[k].ReasonText = controller.getActionText[tasks[k].ReasonCode];
									}
									else if(tasks[k].ReasonCode === tasks[i].ReasonCode){ // for multiple cars if same Further action selected, display same in Job Details 
										//tasks[k].ReasonCode = "8";
										//tasks[k].ReasonText = controller.getActionText[tasks[k].ReasonCode];
									}									
									else if(($.trim(tasks[k].Status) !== "0" && $.trim(tasks[k].Status) !== "") || ($.trim(tasks[i].Status) !== "0" && $.trim(tasks[i].Status) !== "" )){
										tasks[k].ReasonCode = "9";
										tasks[k].ReasonText = controller.getActionText[tasks[k].ReasonCode];
									}
									tasks[k].Status = controller.taskDataFull[tasks[i].TaskCode][j].Status;
									tasks[k].completed = false;
								}
							}
						}
					}
				}
				tasks.splice(i,1);
				i--;
			}			
		}
		
		/*for(var i=0;i<tasks.length;i++){
			tasks[i].completed = {};
			if(tasks[i].Status == "2"){
				tasks[i].completed = true;
				console.log("status flag");
			}
			else
				tasks[i].completed = false;
		}*/
		if(this.fromTaskDetails)
		{
			this.createZoneFilters(tasks, this.selectedKey);	
			this.getView().iconTabBar.setSelectedKey(this.selectedKey);
			this.fromTaskDetails = false;
		}
		else
			this.createZoneFilters(tasks);	
		this.bindTaskData(tasks);
	},
	
	bindTaskData : function(tasks){
		var table = this.getView().table;
		table.getModel().setData(tasks);
	},

	createZoneFilters : function(tasks, selectedKey){
		var filters = {};
		var iconTabFilters = this.getView().iconTabBar;
		iconTabFilters.destroyItems();
	
		/*var iconTabs = [
		     new sap.m.IconTabFilter({
				icon : "sap-icon://detail-view",
				text : "Z0 - Pre Inspection",
			     key : "Details",
			}),
			 new sap.m.IconTabFilter({
				icon : "sap-icon://customer-order-entry",
				text : "Z3",
				key : "operations",
			}),
			 new sap.m.IconTabFilter({
				icon : "sap-icon://functional-location",
				text : "Z3 - Post Inspection",
				 key : "location",
			}),
			 new sap.m.IconTabFilter({
					icon : "sap-icon://functional-location",
					text : "Supplementary Tasks",
					 key : "supp",
				})
		     ];
		*/
		var prevZone = "";
		var filterCount = -1;
		for(var i=0; i < tasks.length ; i++){
			
			if(prevZone != tasks[i].ZoneArea){
				filterCount++;
				var zoneFilter = new sap.m.IconTabFilter({
					icon : "sap-icon://clinical-tast-tracker",
					text : tasks[i].ZoneArea,
				    key : filterCount,
				    count : 1
					});
				filters[filterCount] = zoneFilter;			
				prevZone = tasks[i].ZoneArea;
			}
			else{
				var newCount = Number(filters[filterCount].getCount()) + 1;
				filters[filterCount].setCount(newCount);
			}
			tasks[i].filterKey = filterCount;
		}
		
		for(var j in filters){
			iconTabFilters.addItem(filters[j]);
		}
		if(selectedKey)
			this.filterTasks(selectedKey);
		else
			this.filterTasks(iconTabFilters.getItems()[0].getKey());
	
},
	
//	createZoneFilters : function(tasks){
//		
//		var filters = {};
//		var iconTabFilters = this.getView().iconTabBar;
//		iconTabFilters.destroyItems();
//		
//		var iconTabs = [
//		     new sap.m.IconTabFilter({
//				icon : "sap-icon://detail-view",
//				text : "Z0 - Pre Inspection",
//			     key : "Details",
//			}),
//			 new sap.m.IconTabFilter({
//				icon : "sap-icon://customer-order-entry",
//				text : "Z3",
//				key : "operations",
//			}),
//			 new sap.m.IconTabFilter({
//				icon : "sap-icon://functional-location",
//				text : "Z3 - Post Inspection",
//				 key : "location",
//			}),
//			 new sap.m.IconTabFilter({
//					icon : "sap-icon://functional-location",
//					text : "Supplementary Tasks",
//					 key : "supp",
//				})
//		     ];
//		
//		var prevZone = "";
//		for(var i=0; i < tasks.length ; i++){
//			if(!filters[tasks[i].ZoneArea]){
//				var zoneFilter = new sap.m.IconTabFilter({
//					icon : "sap-icon://clinical-tast-tracker",
//					text : tasks[i].ZoneArea,
//				    key : tasks[i].ZoneArea,
//				    count : 1
//					});
//				filters[tasks[i].ZoneArea] = zoneFilter;				
//			
//			}
//			else{
//				var newCount = Number(filters[tasks[i].ZoneArea].getCount()) + 1;
//				filters[tasks[i].ZoneArea].setCount(newCount);
//			}			
//		}
//		
//		for(var j in filters){
//			iconTabFilters.addItem(filters[j]);
//		}
//		
//		this.filterTasks(iconTabFilters.getItems()[0].getKey());
//		
//	},
	
	filterTasks : function(key){
		
		var selKey = key;
		this.selectedKey = key;
		var taskBinding = this.getView().table.getBinding("items");
		var filter = new sap.ui.model.Filter("filterKey","EQ",selKey);
		taskBinding.filter([filter]);
	},
	
	
	bindHeaderData : function(data){
	
		this.getView().jobHeader.getModel().setData(data);
	},
	
	getActionsData : function(){
		
		var app = this.getView().getViewData();
		var view = this.getView();
		var controller = this;
		
		app.controller.getData("/ETS_VALUE_HELP?$filter=IvTaskReason eq 'X'&$expand=NAV_TASK_REASON&$format=json",{},controller,controller.setActionData);
		
	},
	
	setActionData : function(actionsData){
		actionsData.d = actionsData;
		this.actionsData = actionsData.d.results[0].NAV_TASK_REASON.results;
		this.getActionKey = {};
		this.getActionText = {};
		
		for ( var i = 0 ; i < actionsData.d.results[0].NAV_TASK_REASON.results.length ; i ++ ){
			this.getActionKey[actionsData.d.results[0].NAV_TASK_REASON.results[i].Zztext] = {};
			this.getActionKey[actionsData.d.results[0].NAV_TASK_REASON.results[i].Zztext] = actionsData.d.results[0].NAV_TASK_REASON.results[i].ZzvalueL;
			
			this.getActionText[actionsData.d.results[0].NAV_TASK_REASON.results[i].ZzvalueL] = {};
			this.getActionText[actionsData.d.results[0].NAV_TASK_REASON.results[i].ZzvalueL] = actionsData.d.results[0].NAV_TASK_REASON.results[i].Zztext;
			
		}
		
	},
	
	
	bindActionPopup : function(){
		var app = this.getView().getViewData();
		var view = this.getView();
		var controller = this;
		var actionsData = this.actionsData;

		function openActionPopup(){

        return function () {
            
	        var source = this;

	        function selectActionRequired() {

	            return function (evt) {
	                var control = sap.ui.getCore().byId(source.id);
	                var rCode = $.trim(controller.getActionKey[evt.getParameters().listItem.getTitle()]);
	                if(rCode !== "10"){ // if selected is other than Record Observation, uncheck the completed
	                	var taskData = control.getBindingContext().getObject();
	                	taskData.completed = false;
	                }
	            	if(evt.getParameters().listItem.getTitle() != "X"){	           
	                control.setValue(evt.getParameters().listItem.getTitle());
	            	}
	            	else{
		            control.setValue("");
	            	}
	            	 control.data("key", evt.getParameters().listItem.data("key"));
	                 source.list.close();
	                 
	                 // Redirect to Task Details if Action = Fault or Partially Completed
                	 /*var headerData = controller.getView().jobHeader.getModel().getData();
                	 var cars = headerData.CarNo.split(",");
	                 if((evt.getParameters().listItem.data("key") === "5" || evt.getParameters().listItem.data("key") === "6") && cars.length > 1 ){
		                 if(!app.getPage("taskDetails")){
		                	 var taskDetailsPage = sap.ui.view({
		                		 id: "taskDetails",
		                		 viewName: "tfnswjobcard.TaskDetails",
		                		 type: sap.ui.core.mvc.ViewType.JS,
		                		 viewData: app
		                	 });
		                	 app.addDetailPage(taskDetailsPage);
		                	// controller.taskDetailsPage = taskDetailsPage;
		                 }
		                 
	                	 var taskData = control.getBindingContext().getObject();
	                	 var taskTableData = [];
	                	 
	                	 var tData = {};
	                	 tData = taskData;
	                	 $.each(cars, function(ind, car){
	                		 tData.line = ind;
	                		 tData.Car = car;
	                		 tData.SetNo = headerData.SetNo;
	                		 tData.ReasonCode = "";
	                		 tData.ReasonText = "";
	                		 taskTableData.push(tData);
	                	 });
	                	 var taskDetailsPage = app.getPage("taskDetails");
	                	 var taskDetailTable = taskDetailsPage.taskDetTable;
	                	 //taskDetailsPage.oController.bindFurtherActionPopup();
	                	 taskDetailTable.getModel().setData(taskTableData);
		                 app.to("taskDetails");
	                 }*/
	            }
	        }

	        if (!source.list) {
	            
	            var list = new sap.m.ResponsivePopover({
	                placement: sap.m.PlacementType.Left,
	                title: "Action Required?",
	                content: [],
	                width: "200px",
	                height: "300px"
	            }).addStyleClass("actionPopoverClass");
	            source.list = list;

	            var optionList = new sap.m.List({
	                mode: sap.m.ListMode.SingleSelectMaster,
	                includeItemInSelection: true,
	                select: selectActionRequired(),
//	                items: [option1, option2, option3],
	                width: "100%",
	                height: "100%"
	            }).addStyleClass("optionsList");

	            for ( var i = 0 ; i < actionsData.length ; i++){
		            var option = new sap.m.StandardListItem({
		                title: actionsData[i].Zztext	             
		            }).data("key", actionsData[i].ZzvalueL);
		            optionList.addItem(option);
	            } 	            
	            
	            source.list.addContent(optionList);

	        }

	        source.list.openBy(source);
	    
	    }

	}
       
	    $(".actionInput").off().on("tap", openActionPopup());
	
	},
	addTableEntry : function(tableEntry){

		var controller = this;
		var oTable = this.getView().table;
			 // cells
		var taskCode = 	new sap.m.ObjectHeader({
				
				title : tableEntry.TaskCode,
			    attributes : [
        		new sap.m.ObjectAttribute({
        		text : tableEntry.TaskText
        		})
        	]
		});
		var taskDescription = new sap.m.HBox({
			alignItems : sap.m.FlexAlignItems.Center,
//			width : "60%"
//			icon : "sap-icon://functional-location",
			layoutData : new sap.m.FlexItemData({
				styleClass : "taskDescription"
			}),
			items : [ 
			new sap.m.TextArea({value: "This is a sample long text for task description. Just to make it long enough.",
				enabled : false,
				cols : 25,
				rows  : 3}),

			new sap.ui.core.Icon({
				src : "sap-icon://message-information",
				size : "2em",
				layoutData : new sap.m.FlexItemData({
				styleClass : "taskIconLayout"
			}),
				press : function(evt){
					controller.showInformation(evt)
				}
				
			}).addStyleClass("taskIcon"),

		    new sap.ui.core.Icon({
				src : "sap-icon://performance",
				size : "2em",
				layoutData : new sap.m.FlexItemData({
				styleClass : "taskIconLayout"
				}),
				press : function(evt){
					controller.showPerformance(evt)
				}
				
			}).addStyleClass("taskIcon")
			]
		});

		var completed =  new sap.m.CheckBox({selected: true , editable:true});
		var furtherAction = new sap.m.Input({editable : false , enabled : true, width : "70%"}).addStyleClass("actionInput");


		var oRow = new sap.m.ColumnListItem({type : sap.m.ListType.Active});

		oRow.addCell(taskCode).addCell(taskDescription).addCell(completed).addCell(furtherAction);
	    oTable.addItem(oRow);

	},
	
	carCount : function(evt)
	{
	
		var carValues = this.getView().jobHeader.getModel().getData().CarNo;
		var app = this.getView().getViewData();
		var carArray = carValues.split(",");
		var length = carArray.length;
		var finalArray = [];
		var data = {}; // data object
		data.d = {};
		data.d.NAV_SET_TO_OPENFAULTS = [];
		for (var k =0; k<length; k++)
		{
		finalArray.push({
		"ZznotifNum" :"",
		"ZzfaultDate" : null,
		"ZzfaultTime" : "PT00H00M00S",
		"ZzcarNum" : carArray[k],
		"ZzassetDesc" : "",
		"Zzasset" : "",
		"ZzpriorityDesc" : "",
		"Zzpriority" : "",
		"ZzsymptomGp" : "",
		"ZzsymptomCode" : "",
		"ZzsymptomGpDesc" : "",
		"ZzsymptomCodeDesc" : "",
		"ZzpositionDesc" : "",
		"Zzposition" : "",
		"ZzworkOrder" : "",
		"ZznotifDesc" : "",
		});
		}
		data.d.NAV_SET_TO_OPENFAULTS = finalArray;
		app.controller.getNotification(data, this, length);
		//alert("cars"+carValues);
	},

	showInformation : function(evt){
		var app = this.getView().getViewData();
		var taskData = evt.getSource().getParent().getParent().getBindingContext().getObject();
		if(!this.showInformationPage){
			var showInformation = sap.ui.view({ id :"infoDetails", viewName:"tfnswjobcard.infoDetails", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
			app.addDetailPage(showInformation);
			this.showInformationPage = showInformation;
		}
		var detailController = this;
		var controller = this.showInformationPage.controller;
		var taskInfoUrl = "/ETS_LONGTEXT?$filter=TextObject eq '" + taskData.StdText +"'&$format=json";
		this.showInformationPage.taskHeader.getModel().setData(taskData);
		this.showInformationPage.data("taskCompleted",evt.getSource().getBindingContext().getObject().completed);
		app.controller.getData(taskInfoUrl,{},controller,controller.setTaskLongText);

		// Get the attachments
      	 var selectedListOption = app.jobList.jobList.getSelectedItem().getBindingContext().getObject().NAV_SET_TO_TASK;
		var taskPayload = {};
		//taskPayload.d = {};
		taskPayload.Taskcode = taskData.TaskCode;
		//For return entity
		taskPayload.NAV_TASK_DOCUMENTS = [];
		
       	 $.each(detailController.taskDataFull[taskData.TaskCode], function(ind, items){
     		var orderData = {};
    		orderData.OrderNumber = items.Aufnr;
       		taskPayload.NAV_TASK_DOCUMENTS.push(orderData);
       	 });
 		var text = "Attachments (0)";
 		this.showInformationPage.attachments.setText(text);
 		var data = {};
 		data.NAV_TASK_DOCUMENTS = {};
 		data.NAV_TASK_DOCUMENTS.results = []
 		controller.attachments = data;
		app.controller.postData("/ETS_TASK_ORDERID",taskPayload,controller,controller.loadDocuments);
		app.to("infoDetails");
	},

	addMaterial : function(evt){
		var app = this.getView().getViewData();
		if(!this.addMaterialPage){
			
		var addMaterial = sap.ui.view({ id :"addMaterial", viewName:"tfnswjobcard.addMaterial", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
		app.addDetailPage(addMaterial);
		this.addMaterialPage = addMaterial;
		}

		app.to("addMaterial")
	},

	showPerformance : function(evt){
		var app = this.getView().getViewData();
		var prevPage = this.getView();
		var carValues = prevPage.jobHeader.getModel().getData().CarNo;
		var setNo = prevPage.jobHeader.getModel().getData().SetNo;
		var taskData = evt.getSource().getParent().getBindingContext().getObject();
		var taskCode = taskData.TaskCode;
		
		/*if(!this.performance){
			
		var performance = sap.ui.view({ id :"performance", viewName:"tfnswjobcard.performance", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
		app.addDetailPage(performance);
		this.performance = performance;
		}

		app.to("performance")*/
		if(!this.measurementPoints){
			
			var measurementPoints = sap.ui.view({ id :"measurementPoints", viewName:"tfnswjobcard.measurementPoints", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
			app.addDetailPage(measurementPoints);
			this.measurementPoints = measurementPoints;
			}
			this.measurementPoints.data("carValues",carValues);
			this.measurementPoints.data("setNo",setNo);
			this.measurementPoints.data("taskCode",taskCode);
			this.measurementPoints.data("prevPage",prevPage);
			
			this.measurementPoints.getContent()[0].destroyContent();
			prevPage.table.setBusy(true);
			this.measurementPoints.controller.getMeasurementData();
			
			app.to("measurementPoints");
	},

	onAfterRendering: function() {

//		var table = this.getView().table;
//
//		for(var i = 0 ; i < 4 ; i ++){
//			this.addTableEntry(table);
//		}
//
//		this.bindActionPopup();

	},
	showDetailTask: function(evt){
		var app = this.getView().getViewData();
		var view = this.getView();
		var controller = this;
        // Redirect to Task Details if Action = Fault or Partially Completed
	   	var headerData = controller.getView().jobHeader.getModel().getData();
	   	var cars = headerData.CarNo.split(",");
	   	if(cars.length > 1){ // Navigate if task has more than one car
		   	var taskData = evt.getSource().getBindingContext().getObject();
		   	var reasonCode = controller.getActionKey[taskData.ReasonText];
		   	// Fault or Partially Complete or Not Completed or Record Observation
	      //  if(reasonCode === "5" || reasonCode === "8" || reasonCode === "9" || reasonCode === "10"){ 
	            if(!app.getPage("taskDetails")){
	           	 var taskDetailsPage = sap.ui.view({
	           		 id: "taskDetails",
	           		 viewName: "tfnswjobcard.TaskDetails",
	           		 type: sap.ui.core.mvc.ViewType.JS,
	           		 viewData: app
	           	 });
	           	 app.addDetailPage(taskDetailsPage);
	            }
	       	 
	       	 var taskTableData = [];
	       	 var selectedListOption = app.jobList.jobList.getSelectedItem().getBindingContext().getObject().NAV_SET_TO_TASK;
	       	 
	       	 $.each(controller.taskDataFull[taskData.TaskCode], function(ind, items){
		       	 var tData = {};
		       	 tData = items;
       			 // Overwrite completed check box
		       	if(evt.getSource().getParent().getCells()[3].getEditable()) // If not readonly
		       		tData.completed = taskData.completed;
		       	 $.each(selectedListOption, function(selInd, selItem){
		       		 if(selItem.Aufnr === tData.Aufnr)
		       		 {	 
		       			 tData.Car = selItem.CarNo;
		       		 }	 
		       		 	
		       	 })
	       		 
	       		 tData.SetNo = headerData.SetNo;
	       		 //tData.ReasonCode = "";
	       		 //tData.ReasonText = "";
	       		 taskTableData.push(tData);
	       	 });
	       	 //taskTableData = controller.taskDataFull[taskData.TaskCode];
	       	 var taskDetailsPage = app.getPage("taskDetails");
	       	 var taskDetailTable = taskDetailsPage.taskDetTable;
	       	 //taskDetailsPage.oController.bindFurtherActionPopup();
	       	 taskDetailTable.getModel().setData(taskTableData);
	            app.to("taskDetails");
	       // }
	   	}

	},
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnswjobcard.jobDetails
*/
//	onExit: function() {
//
//	}

});