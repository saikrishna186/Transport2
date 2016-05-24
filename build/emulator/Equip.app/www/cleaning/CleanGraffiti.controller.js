sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.CleanGraffiti", {
		toTileHome: function(evt){
			this.getOwnerComponent().app.to("tileHome");
		},
		onInit : function() {
			var controller = this;
			this.cleanedByChange =false;
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);	
			this.inititateTable();
			//var oModel = new sap.ui.model.json.JSONModel();
			/*var oData = oModel.getData();
			oData.clean = {};
			oData.graffiti ={};
			oModel.setData(oData);
			this.getView().setModel(oModel);*/
			this.oModel = {
					graffiti: {
						internal		   : {
							total	 : 0,		//id_InternalTotal
							cleaned	 : 0,		//id_InternalCleaned
							remaining: 0		//id_InternalRemaining
						},
						externalAboveGutter: {
							total	 : 0,		//id_ExtAboveTotal
							cleaned	 : 0,		//id_ExtAboveCleaned
							remaining: 0		//id_ExtAboveRemaining		
						},
						externalBelowGutter: {
							total	 : 0,		//id_ExtBelowTotal
							cleaned	 : 0,		//id_ExtBelowCleaned
							remaining: 0		//id_ExtBelowRemaining	
							
						}
					},
					clean: {
						
						
					}
			
	};
			var d = new Date();
			this.getView().byId("id_GraffitiDate").setDateValue(d);
			this.getView().byId("id_DateTimeClean").setDateValue(d);
			this.populateMatNumberF4();
			this.populateSetNumberF4();
			this.populateCleanedByF4();
			this.errorLoc = true;
			this.errorSet = true;
			this.graffitiTypes = [];
			this.selectedGraffitiCarId = "";
			this.selectedGraffitiTypesId = "";
			this.getGraffitiTypes();
			this.mandatory = [];
			this.mandatory.push(this.byId("cleanTypeInput"));
			this.mandatory.push(this.byId("numberofcleanersinput"));
			this.mandatory.push(this.byId("cleanedByInput"));
			this.mandatory.push(this.byId("id_DateTimeClean"));
			this.byId("cleanTypeInput").data("mandatory", true);
			this.byId("numberofcleanersinput").data("mandatory", true);
			this.byId("cleanedByInput").data("mandatory", true);
			this.byId("id_DateTimeClean").data("mandatory", true);
			this.getView().byId("CloseFaultTable").destroyItems();
			this.getView().byId("CloseFaultTable").removeAllItems();
			var oTable_create = new sap.m.Table("create", {
				includeItemInSelection : true,
			}).addStyleClass("dialogTable");
			
			this.oTable_create = oTable_create;
			/*var oWONum = new sap.m.Column({
				header : new sap.m.Text({
					text : "Notification"
				}).addStyleClass("Title")
			});*/
			var oMessage = new sap.m.Column({
				header : new sap.m.Text({
					text : "Message"
				}).addStyleClass("Title")
			});
			var oType = new sap.m.Column({
				width : "50%",
				header : new sap.m.Text({
					text : ""
				}).addStyleClass("Title")
			});
			/*var oOperation = new sap.m.Column({
				header : new sap.m.Text({
					text : "Operation"
				}).addStyleClass("Title")
			});*/
			oTable_create.addColumn(oType).addColumn(oMessage);
			var closeButton = new sap.m.Button({
				text : "OK",
				press : function(evt) {
					controller.closeDialog(evt);
				}
			}).addStyleClass("notifybutton");
			var createNotification = new sap.m.Dialog("graffittiCreateDialog", {
				title : "Results",
				contentWidth : "800px",
				horizontalScrolling : true,
				verticalScrolling : true,
				content : [ oTable_create ],
				buttons : [ closeButton ],

			});
			this.createNotification = createNotification;
			/*var oModel= new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel);*/
			//this.getView().byId("cleanTab").setEnabled(false);
			//this.getView().byId("graffitiTab").setEnabled(false);
		},

		handleRouteMatched : function(oEvent) {
			/*
			 * var params = {}; if (oEvent.mParameters.data.context ||
			 * oEvent.mParameters.data.masterContext) { this.sContext =
			 * oEvent.mParameters.data.context; this.sMasterContext =
			 * oEvent.mParameters.data.masterContext;
			 * 
			 * if (!this.sContext) { this.getView().bindElement("/" +
			 * this.sMasterContext, params); } else {
			 * this.getView().bindElement("/" + this.sContext, params); }
			 *  }
			 */
			
			//this.selectedGraffitiCarId = "";
			//this.selectedGraffitiTypesId = "";
			
		
		},
		handleCloseFaults : function()
		{	var controller = this;
			var oTable = this.getView().byId("CloseFaultTable");
			var finalArray = [];
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var contexts = oTable.getSelectedContexts();
			if((contexts.length>0)&&(this.selectedGraffitiCarId!=""))
				{
			var oItem = contexts.map(function(c) {
				return c.getObject();
			});
			var data = {};
			data.d = {};
			data.d.SetId = oData.set;
			data.d.CarId = sap.ui.getCore().byId(this.selectedGraffitiCarId).getText();
			data.d.NAV_HEAD_CLOSE = [];
			 for ( var k = 0; k < oItem.length; k++) {
			        
			        var faultNum = oItem[k].Qmnum;
					finalArray.push({
						"Qmnum" : faultNum,
						});
			 }
			        
			        
			 data.d.NAV_HEAD_CLOSE = finalArray;
			 data.d.NAV_HEAD_RETURN = [];
			 closeFaults(data,controller);
				}
			else if((contexts.length<=0)&&(this.selectedGraffitiCarId!=""))
				{
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
						"Please select a Fault",
						sap.m.MessageBox.Icon.ERROR, "ERROR",
						sap.m.MessageBox.Action.OK, function() {/*
																 * True
																 * case;
																 */
						});
				}
			else if(this.selectedGraffitiCarId=="")
			{
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please select a Car",
					sap.m.MessageBox.Icon.ERROR, "ERROR",
					sap.m.MessageBox.Action.OK, function() {/*
															 * True
															 * case;
															 */
					});
			}
			
			
		},
		handleCloseResponse : function(response)
		{
			var result = response.NAV_HEAD_RETURN.results;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				listitems : result
			});
			var oMessage = new sap.m.Text({
				text : "{Message}",
			});
			var oType = new sap.ui.core.Icon({
				src : "sap-icon://status-positive",
				color : {
					parts : [ {
						path : "Type",
					} ],
					formatter : function(type) {
						if (type == "E") {
							return "red";
						} else if (type == "S") {
							return "green";
						} else {
							return "yellow";
						}
					}

				}
			});
			var oRow = new sap.m.ColumnListItem();
			oRow.addCell(oType).addCell(oMessage);
			this.oTable_create.setModel(oModel);
			this.oTable_create.bindItems("/listitems", oRow);
			this.openDialog();
			this.getfaults();
		},
        calculateRemaining : function()
        {
        	var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var n = 0;
			n = this.oModel.graffiti.internal.remaining +
				this.oModel.graffiti.externalAboveGutter.remaining +
				this.oModel.graffiti.externalBelowGutter.remaining;
			/*this.oModel.graffiti.internal.total == 0&&
			this.oModel.graffiti.externalAboveGutter.total == 0&&
	this.oModel.graffiti.externalBelowGutter.total == 0&&

	this.oModel.graffiti.internal.cleaned == 0&&
	this.oModel.graffiti.externalAboveGutter.cleaned == 0&&
	this.oModel.graffiti.externalBelowGutter.cleaned == 0&&

	this.oModel.graffiti.internal.remaining == 0&&
	this.oModel.graffiti.externalAboveGutter.remaining == 0&&
	this.oModel.graffiti.externalBelowGutter.remaining == 0&&*/
        	if((n<=0)||(this.oModel.graffiti.internal.remaining < 0||
        	this.oModel.graffiti.externalAboveGutter.remaining < 0||
        	this.oModel.graffiti.externalBelowGutter.remaining <0))
        	{
		    oData.graffiti.remaining = false;
		    oModel.setData(oData);
		    oModel.refresh(true);
        	}
        	else
        		{
        		oData.graffiti.remaining = true;
    		    oModel.setData(oData);
    		    oModel.refresh(true);
        		}
        },
		inititateTable : function() {
			var oModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(oModel, "modelView");
			var oData = oModel.getData();
			oData.clean = {};
			oData.clean.cleanType = "";
			oData.clean.comments = "";
			/*var array = [];
			array.push({cleanId: "", description : "" });
			oData.clean.selectedTokens = {};
			oData.clean.selectedTokens.push(array);*/
			oData.graffiti ={};
			oData.clean.noOfCleaner = "1";
			oData.graffiti.remaining = false;
			oModel.setData(oData);
			oModel.refresh();
			this.getView().setModel(oModel);
			
			// var tModel= sap.ui.getCore().getModel("modelView");

			/*
			 * var oTable =
			 * this.getView().byId("np-sap_m_Toolbar_3-1449636735600-3LR"); var
			 * oData = tModel.getData();
			 * 
			 * if(oData.length < 5||(!oData.length)){ oData = []; for( var i =
			 * 0;i<5;i++){ oData.push({"CleaningLocation":""}) ; }
			 * 
			 * tModel.setData({tableData:oData}); oTable.setModel(tModel);
			 *  }
			 */
		},
		
		populateMatNumberF4 : function() {
			var controller = this;
			getMatF4Data(controller.bindMatSuggestions, controller);
		},
		populateCleanType : function()
		{
			var controller = this;
			var set = this.getView().byId("setInput").getValue().toUpperCase();
			var location = this.getView().byId("CleaningLocationInput").getValue().toUpperCase();
			getCleanType(location, set, controller.bindCleanType, controller);
		},
		bindCleanType : function(responseData)
		{
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.cleanTypeValues = responseData.results;
			oModel.setData(oData);
			oModel.refresh(true);
			
			
			
		},
		getCars: function()
		{
			var controller = this;
			var set = this.getView().byId("setInput").getValue().toUpperCase();
			getCarsOnSet(set,controller.setCars, controller);
			this.selectedGraffitiCarId = "";
		},
		getGraffitiTypes: function()
		{
			var controller = this;
			getGraffitiTypes(controller.setGraffitiTypes, controller);
			this.selectedGraffitiTypesId = "";
		},
		getfaults: function()
		{
			var controller = this;
			var car = sap.ui.getCore().byId(this.selectedGraffitiCarId).getText();
			getfaults(car, controller.setFaults, controller);
		},
		bindMatSuggestions : function(responseData) {
			var oMatInp = this.getView().byId("CleaningLocationInput");

			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.matValues = responseData.results;
			oModel.setData(oData);
			oModel.refresh(true);
			oMatInp.bindAggregation('suggestionItems', '/matValues', new
			 sap.ui.core.Item({
			 text: "{Stand}"
			 }));

			oModel.refresh(true);
			this.matMap(responseData.results);

		},
		populateSetNumberF4 : function() {
			var controller = this;
			getSetF4Data(controller.bindSetSuggestions, controller);
		},

		bindSetSuggestions : function(responseData) {
			var oSetInp = this.getView().byId("setInput");

			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.setValues = responseData.results;
			oModel.setData(oData);
			oSetInp.bindAggregation('suggestionItems', '/setValues', new
			 sap.ui.core.Item({
			 text: "{Zzsetid}"
			 }));

			oModel.refresh(true);
			this.setMap(responseData.results);

		},
		bindCleanedBySuggestions : function(responseData) {
			
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.cleanedByValues = responseData.results;
			oModel.setData(oData);
			oModel.refresh(true);
		},

		matMap : function(matData) {
			var matMap = {};
			for ( var i in matData) {
				if (!matMap[matData[i].Stand]) {
					matMap[matData[i].Stand] = [];
				}
				matMap[matData[i].Stand].push(matData[i]);
			}
			this.getView().data("matMap", matMap);

		},

		validateMatNumber : function(matNumber) {
			var matMap = this.getView().data("matMap");
			var validMat = matMap[matNumber];
			var matFlag;
			if (validMat) {
				if (validMat[0].Stand == matNumber) {
					matFlag = true;
				} else {
					matFlag = false;
				}
			} else {
				matFlag = false;
			}
			return matFlag;
		},
		
		setMap : function(setData) {
			var setMap = {};
			for ( var i in setData) {
				if (!setMap[setData[i].Zzsetid]) {
					setMap[setData[i].Zzsetid] = [];
				}
				setMap[setData[i].Zzsetid].push(setData[i]);
			}
			this.getView().data("setMap", setMap);

		},

		validateSetNumber : function(setNumber) {
			var setMap = this.getView().data("setMap");
			var validSet = setMap[setNumber];
			var setFlag;
			if (validSet) {
				if (validSet[0].Zzsetid == setNumber) {
					setFlag = true;
					this.getCars();
				} else {
					setFlag = false;
				}
			} else {
				setFlag = false;
			}
			return setFlag;
		},
		populateCleanedByF4 : function() {
			var controller = this;
			getCleanedByF4Data(controller.bindCleanedBySuggestions, controller);
		},

		handleLocChange : function(evt) {
			var matNumber = evt.getSource().getValue().toUpperCase();
			var checkFlag = this.validateMatNumber(matNumber);
			/* var obj = evt.getSource().getBindingContext().getObject(); */
			if (!checkFlag) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(
						"Please provide valid Location");
				this.errorLoc = true;
				this.disableTabs();
			} else {
				/* obj.Editline =true; */
				evt.getSource().setValueState("None");
				evt.getSource().setValueStateText("");
				this.errorLoc = false;
				if((!this.errorLoc)&&(!this.errorSet))
					{
					this.enableTabs();
					}
				evt.getSource().setValue(matNumber);
			}
		},
		handleSetChange : function(evt) {
			var setNumber = evt.getSource().getValue();
			setNumber = setNumber.toUpperCase();
			var checkFlag = this.validateSetNumber(setNumber);
			/* var obj = evt.getSource().getBindingContext().getObject(); */
			if (!checkFlag) {
				evt.getSource().setValueState("Error");
				evt.getSource().setValueStateText(
						"Please provide valid Set");
				this.errorSet = true;
				this.disableTabs();
			} else {
				/* obj.Editline =true; */
				evt.getSource().setValueState("None");
				evt.getSource().setValueStateText("");
				this.errorSet = false;
				if((!this.errorLoc)&&(!this.errorSet))
				{
				this.enableTabs();
				//this.setCars();
				}
				evt.getSource().setValue(setNumber);
			}
		},
		enableTabs : function()
		{
			this.getView().byId("cleanTab").setEnabled(true);
			this.getView().byId("graffitiTab").setEnabled(true);
			this.populateCleanType();
		},
		disableTabs : function()
		{
			this.getView().byId("cleanTab").setEnabled(false);
			this.getView().byId("graffitiTab").setEnabled(false);	
		},
		setFaultNotification: function(responseData){
			var msg = "Fault Notification Created - " + responseData.Zzaufnr;

			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(msg, 
					{title 	: "Success", 
					 icon	: sap.m.MessageBox.Icon.SUCCESS,
					 actions: sap.m.MessageBox.Action.OK,                  // default
					 onClose: null    ,
					 // default
					 });
			
			this.refreshGraffitiTab();
			this.calculateRemaining();
			this.getfaults();
		},
		setFaults: function(responseData){
			this.getView().byId("CloseFaultTable").destroyItems();
			this.getView().byId("CloseFaultTable").removeAllItems();
			if(responseData.results !== null){
				
				var oData = {results: []};
				$.each(responseData.results, function(i, obj){
					var fault = {};
					if(obj.Qmnum !== ""){
						fault.Qmnum = obj.Qmnum;
						fault.Qmtxt = obj.Qmtxt;
						fault.Qmcod = obj.Qmcod;
						fault.QmcodDesc = obj.QmcodDesc;
						fault.Qmdat = (obj.Qmdat).toLocaleDateString();
						// If count = 0
						fault.Image = "("+obj.Zzcount+")";
						//Else
						//fault.Image = count + " Image(s) Attached";
						//fault.Qmdat = (obj.Qmdat).substring(3,11);
						(oData.results).push(fault);
						
					}
				});
				
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(oData);
				var oController = this;
				this.getView().byId("CloseFaultTable").setModel(oModel);
				this.getView().byId("CloseFaultTable").bindAggregation("items", {
					path: "/results",
			 	    template: new sap.m.ColumnListItem({ type:"Active",
				    cells: [
				               new sap.m.Label({ text: "{Qmnum}" }),
				               new sap.m.Label({ text: "{Qmtxt}" }),
				               //new sap.m.Label({ text: "{QmcodDesc}" }),
				               new sap.ui.commons.Label({text: "{QmcodDesc}", wrapping: true}),
				               new sap.m.Label({ text: "{Qmdat}" }),
				               //new sap.m.Label({ text: "{Image}"}),
				               new sap.m.Button({icon: "sap-icon://attachment",
				                   	 			width: "100px",
				                   	 			text: "{Image}",
				                   	 			iconFirst: true,
				                   	 			press: function(evt){
				                   	 				oController._onPressAttachmentButton(evt);
				                   	 			}
				                   	 					
				               })
				           ]
				   })
				});
			}
			
		},
		setGraffitiTypes: function(responseData){
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			this.oModel.graffiti.graffitiTypes = responseData.results;
			var GraffitiTypesBox = this.getView().byId("id_GraffitiTypesBox");
			GraffitiTypesBox.removeAllItems();
			var oController = this;
			for(var i = 0; i<(responseData.results).length; i++){
				var idValue = "id_" + responseData.results[i].Kurztext;
				if(sap.ui.getCore().byId(idValue) !== undefined){
					sap.ui.getCore().byId(idValue).destroy();
				};
				GraffitiTypesBox.addItem(new sap.m.ToggleButton({
					id	 : idValue,
					text : responseData.results[i].Kurztext,
					pressed : false,
					press : function(evt){
						oController.GraffitiTypesPress(evt);
					},
				enabled : "{/graffiti/remaining}",
				})
				);
				
				
				}
		},
		setCars : function(responseData)
		{
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			oData.carValues = responseData.results;
			oModel.setData(oData);
			oModel.refresh(true);
			var array = [];
			var cars = oModel.getData().carValues;
			var length = cars.length;
			var carBox = this.getView().byId("carBox");
			var carBoxGraffiti = this.getView().byId("carBoxGraffiti");
			carBoxGraffiti.removeAllItems();
			carBox.removeAllItems();
			var oController = this;
			for (var i=0;i<length;i++)
			{
				var cidValue = "cid_" + cars[i].Zzcarid;
				if(sap.ui.getCore().byId(cidValue) !== undefined){
					sap.ui.getCore().byId(cidValue).destroy();
				};
				
				array.push(cars[i].Zzcarid);
				carBox.addItem(new sap.m.ToggleButton({
					id	 : cidValue,
					text : cars[i].Zzcarid,
					pressed : true,
					press : function(evt){
						oController.cleanCarPress(evt);
					}
				}).addStyleClass("carPress")
				/*carBox.addItem(new sap.m.VBox({
					alignItems: "Center",
					justifyContent : "SpaceAround",
					items: [new sap.m.ToggleButton({
					text : cars[i].Zzcarid,
					pressed : true,
				}).addStyleClass("trainCurve"),
				new sap.ui.core.Icon({
					src : "sap-icon://overflow",
					size : "2em",
					}).addStyleClass("iconSpacing"),
				]
				}));*/
			
			/*carBox.addItem(new sap.ui.core.Icon({
				src : "sap-icon://overflow",
				size : "2em",
				
			})*/);
			var idValue = "id_" + cars[i].Zzcarid;
			if(sap.ui.getCore().byId(idValue) !== undefined){
				sap.ui.getCore().byId(idValue).destroy();
			};
			var press = false;
			var style;
			if(i==0)
				{
				press = true;
				//this.selectedGraffitiCarId = idValue;
				style = "carPress";
				}
			else
				{
				press = false;
				style = "carUnpress";
				}
			carBoxGraffiti.addItem(new sap.m.ToggleButton({
				id	 : idValue,
				text : cars[i].Zzcarid,
				pressed : press,
				press : function(evt){
					oController.GraffitiCarPress(evt);
				}
			}).addStyleClass(style)
			/*carBoxGraffiti.addItem(new sap.ui.core.Icon({
				src : "sap-icon://overflow",
				size : "2em",
				
			})*/);
			if(press == true)
				{
				sap.ui.getCore().byId(idValue).firePress();
				}
			
			}
			oData.clean.carArray = array;
			oModel.setData(oData);
			oModel.refresh(true);
			var size = carBox.getItems().length;
			//carBox.removeItem(size-1);
			//carBoxGraffiti.removeItem(size-1);
		},
		validation : function() {
			var fields = this.mandatory;
			var errorFlag = false;
			var controller = this;
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;

			for ( var i in fields) {
				
				if(fields[i].getId() === component+"---CleanGraffiti--cleanedByInput"){	
					if(fields[i].data("mandatory") && this.getView().byId("cleanedByInput").getSelectedKey() == ""){ 
						fields[i].addStyleClass("SelectError");
						errorFlag = true;
					}
					else
						{
						if(fields[i].hasStyleClass("SelectError"))
						fields[i].removeStyleClass("SelectError");
						}
					
				}
				else
					{
				if ((fields[i].data("mandatory") && fields[i].getValue() == "")){
					fields[i].setValueState("Error");
					errorFlag = true;
				} else {
					fields[i].setValueState("None")
				}
				
					}
			}
			if (errorFlag == true) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
						"Enter all mandatory fields to proceed",
						sap.m.MessageBox.Icon.ERROR, "ERROR",
						sap.m.MessageBox.Action.OK, function() {/*
																 * True
																 * case;
																 */
						});

			}
			return errorFlag;
		},
		GraffitiTypesPress: function(evt){
			if(evt.getSource().getPressed() == true){
				if(this.selectedGraffitiTypesId !== ""){
					sap.ui.getCore().byId(this.selectedGraffitiTypesId).setPressed(false);
				}
				this.selectedGraffitiTypesId = "id_"+evt.getSource().getText();				
			}
			else{
				this.selectedGraffitiTypesId = "";
			}
		},
		refreshGraffitiTab: function(){
			//Faults Table
			this.getView().byId("CloseFaultTable").destroyItems();
			this.getView().byId("CloseFaultTable").removeAllItems();
			
			//Remaining Qty Notification Panel
			this.getView().byId("id_Comments").setValue("");
			if(this.selectedGraffitiTypesId !== ""){
				sap.ui.getCore().byId(this.selectedGraffitiTypesId).setPressed(false);
				this.selectedGraffitiTypesId = "";
			}
			//Clear model
			this.oModel.graffiti.internal.total = 0;
			this.oModel.graffiti.externalAboveGutter.total = 0;
			this.oModel.graffiti.externalBelowGutter.total = 0;

			this.oModel.graffiti.internal.cleaned = 0;
			this.oModel.graffiti.externalAboveGutter.cleaned = 0;
			this.oModel.graffiti.externalBelowGutter.cleaned = 0;

			this.oModel.graffiti.internal.remaining = 0;
			this.oModel.graffiti.externalAboveGutter.remaining = 0;
			this.oModel.graffiti.externalBelowGutter.remaining = 0;
			
			//Refresh Table
			this.getView().byId("id_InternalTotal").setValue("0");
			this.getView().byId("id_ExtAboveTotal").setValue("0");
			this.getView().byId("id_ExtBelowTotal").setValue("0");

			this.getView().byId("id_InternalCleaned").setValue("0");
			this.getView().byId("id_ExtAboveCleaned").setValue("0");
			this.getView().byId("id_ExtBelowCleaned").setValue("0");

			this.getView().byId("id_InternalRemaining").setText("0");
			this.getView().byId("id_ExtAboveRemaining").setText("0");
			this.getView().byId("id_ExtBelowRemaining").setText("0");
			
		},
		settingTokens : function(evt)
		{
			//var length = this.getView().byId("cleanTypeInput").getTokens().length;
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var code = this.getView().byId("cleanTypeInput").data("code");
			/*for(var i=0;i<length;i++)
				{
				code = code + "," + this.getView().byId("cleanTypeInput").getTokens()[i].getKey();
				}
			code = code.substr(1);*/
			oData.clean.cleanType = code;
			oModel.setData(oData);
			oModel.refresh(true);
		},
		cleanTypeCars : function()
		{
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var length = oData.carValues.length;
			var carNum = "";
			var data = {}; // data object
			data.d = {};
			for(var i=0;i<length;i++)
			{
			carNum = carNum + "," + oData.carValues[i].Zzcarid;
			}
			carNum = carNum.substr(1);
			oData.clean.carString = carNum;
			oModel.setData(oData);
			oModel.refresh(true);
			data.d.IvCleanType = oData.clean.cleanType,
			data.d.IvCarId = oData.clean.carString,
			data.d.EvError = "",
			data.d.EvErrorInd = "",
			data.d.NAV_CARCLEAN_TO_OP = [],
			data.d.NAV_CARCLEAN_TO_OP.Zzcarid = "";
			getCarsOnCleanType(data,this);
			
			
			
		},
		handleResponse : function(data)
		{   
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var controller = this;
			
			if (data.EvErrorInd == "E")
			{
			if(data.NAV_CARCLEAN_TO_OP == null)
				{
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
						"No Valid Cars found for the selected Clean Type. Select a Clean Type again.",
						sap.m.MessageBox.Icon.ERROR, "ERROR",
						sap.m.MessageBox.Action.OK, function() {
							oData.clean.cleanType = "";
							controller.byId("cleanTypeInput").setValue("");
							oModel.setData(oData);
							oModel.refresh(true);
						});
				}
			}
			else
				{
			var validCars = data.NAV_CARCLEAN_TO_OP.results;
			var carArrayPost = oData.clean.carArray;
			var carArray = oData.carValues;
			var disableList = [];
			var enableList = [];	//AK23MAR2016+
			for(var i=0;i<carArray.length;i++)
				{
				if(!(this.valueCheck(carArray[i].Zzcarid,validCars)))
				{
					disableList.push(carArray[i].Zzcarid);
				}
				else
				{
					enableList.push(carArray[i].Zzcarid);
				}
				}
			oData.clean.disableCars = disableList;
			oModel.setData(oData);
			oModel.refresh(true);
			if(disableList.length>0)
				{
			for(var k=0;k<disableList.length;k++)
				{
				var pressed = sap.ui.getCore().byId("cid_"+disableList[k]).getPressed();
				if(pressed)
					{
					sap.ui.getCore().byId("cid_"+disableList[k]).setPressed(false);	
					}
				sap.ui.getCore().byId("cid_"+disableList[k]).setEnabled(false);
				sap.ui.getCore().byId("cid_"+disableList[k]).removeStyleClass("carPress");
				sap.ui.getCore().byId("cid_"+disableList[k]).addStyleClass("carUnpress");
				var index = carArrayPost.indexOf(disableList[k]);
				if (index > -1) {
					carArrayPost.splice(index, 1);
				}
				}
				}
			
			if(enableList.length>0)
			{
				for(var k=0;k<enableList.length;k++)
				{
					var enabled = sap.ui.getCore().byId("cid_"+enableList[k]).getEnabled();
					if(!enabled){
						sap.ui.getCore().byId("cid_"+enableList[k]).setEnabled(true);
					}
			
			
				}
			}
			
		}
		},
		valueCheck : function(value,validCars)
		{
			for (var i in validCars)
			{
				if(validCars[i].Zzcarid === value)
					return true;
			}
			return false;
		},
		cleanCarPress : function(evt)
		{
			var oController = this;
			var car = evt.getSource();
			var carValue = car.getText();
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var carArray = oData.clean.carArray;
			var index = carArray.indexOf(carValue);
			if(!car.getPressed())
				{
				if (index > -1) {
					carArray.splice(index, 1);
				}
				oData.clean.carArray = carArray;
				oModel.setData(oData);
				oModel.refresh(true);
				car.removeStyleClass("carPress");
				car.addStyleClass("carUnpress");
				}
			else
				{
				carArray.push(carValue);
				oData.clean.carArray = carArray;
				oModel.setData(oData);
				oModel.refresh(true);
				car.removeStyleClass("carUnpress");
				car.addStyleClass("carPress");
				}
		},
		GraffitiCarPress: function(evt){
			var oController = this;
			var car = evt.getSource();
			if(this.selectedGraffitiCarId !== ""){
				if(this.oModel.graffiti.internal.total != 0||
	        			this.oModel.graffiti.externalAboveGutter.total != 0||
				this.oModel.graffiti.externalBelowGutter.total != 0||

				this.oModel.graffiti.internal.cleaned != 0||
				this.oModel.graffiti.externalAboveGutter.cleaned != 0||
				this.oModel.graffiti.externalBelowGutter.cleaned != 0||

				this.oModel.graffiti.internal.remaining != 0||
				this.oModel.graffiti.externalAboveGutter.remaining != 0||
				this.oModel.graffiti.externalBelowGutter.remaining != 0)
					{
				//Confirmation Pop up
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.confirm(
					"You Might lose unsaved data. Do you wish to continue?", {
						styleClass: bCompact? "sapUiSizeCompact" : "",
						onClose: function(oAction){
							if(oAction == "OK"){
								if(car.getPressed() == true){										
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).setPressed(false);
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).removeStyleClass("carPress");
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).addStyleClass("carUnpress");
									oController.selectedGraffitiCarId = "id_"+car.getText();	
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).setPressed(true);
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).removeStyleClass("carUnpress");
									sap.ui.getCore().byId(oController.selectedGraffitiCarId).addStyleClass("carPress");
									oController.refreshGraffitiTab();
									oController.calculateRemaining();
									oController.getfaults();
								}
								else{
									oController.selectedGraffitiCarId = "";
									oController.refreshGraffitiTab();
									oController.calculateRemaining();
									car.removeStyleClass("carPress");
									car.addStyleClass("carUnpress");
								}
							}
							else{ //CANCEL OR CLOSE
								car.setPressed(false);
								/*car.removeStyleClass("carPress");
								car.addStyleClass("carUnpress");*/
							}
						}
					}
				);
			}
				else
					{
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).setPressed(false);
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).removeStyleClass("carPress");
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).addStyleClass("carUnpress");
					oController.selectedGraffitiCarId = "id_"+car.getText();	
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).setPressed(true);
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).removeStyleClass("carUnpress");
					sap.ui.getCore().byId(oController.selectedGraffitiCarId).addStyleClass("carPress");
					oController.refreshGraffitiTab();
					oController.calculateRemaining();
					oController.getfaults();
					}
			}
			else{
				
				oController.selectedGraffitiCarId = "id_"+car.getText();
				sap.ui.getCore().byId(oController.selectedGraffitiCarId).removeStyleClass("carUnpress");
				sap.ui.getCore().byId(oController.selectedGraffitiCarId).addStyleClass("carPress");
				oController.getfaults();
			}
						
		},
		_onPressSapmbnumberofcleanersup : function(evt) {
			var cleanerId = this.getView().byId(
					"numberofcleanersinput");
			var cleanerValue = cleanerId.getValue();
			if (cleanerValue < 10) {
			cleanerValue = parseInt(cleanerValue) + 1;
			cleanerId.setValue(cleanerValue);
			}
		},

		_onPressSapmbnumberofcleanersdown : function(evt) {
			var cleanerId = this.getView().byId(
					"numberofcleanersinput");
			var cleanerValue = cleanerId.getValue();
			if (cleanerValue > 0) {
				cleanerValue = parseInt(cleanerValue) - 1;
				cleanerId.setValue(cleanerValue);
			}
		},

		_onPressInternalTotalup : function(evt) {
			var intTotalId = this.getView()
					.byId("id_InternalTotal");
			var intTotalValue = intTotalId.getValue();
			intTotalValue = parseInt(intTotalValue) + 1;
			intTotalId.setValue(intTotalValue);
			
			
			//set values in model
			this.oModel.graffiti.internal.total = intTotalValue;
			this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalRemaining").getText()) + 1;
			this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			this.calculateRemaining();
			
		},

		_onPressInternalTotaldown : function(evt) {
			var intTotalId = this.getView()
					.byId("id_InternalTotal");
			var intTotalValue = intTotalId.getValue();
			if (intTotalValue > 0) {
				intTotalValue = parseInt(intTotalValue) - 1;
				intTotalId.setValue(intTotalValue);
				
				//set values in model
				this.oModel.graffiti.internal.total = intTotalValue;
				this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalRemaining").getText()) - 1;
				this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			}
			this.calculateRemaining();
		},

		_onPressIntGrafCleaneddown : function(evt) {
			var intGrafCleanedId = this.getView().byId(
					"id_InternalCleaned");
			var intGrafCleanedValue = intGrafCleanedId.getValue();
			if (intGrafCleanedValue > 0) {
				intGrafCleanedValue = parseInt(intGrafCleanedValue) - 1;
				intGrafCleanedId.setValue(intGrafCleanedValue);

				//set values in model
				this.oModel.graffiti.internal.cleaned = intGrafCleanedValue;
				this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalRemaining").getText()) + 1;
				this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			}
			this.calculateRemaining();
		},

		_onPressIntGrafCleanedup : function(evt) {
			var intGrafCleanedId = this.getView().byId(
					"id_InternalCleaned");
			var intGrafCleanedValue = intGrafCleanedId.getValue();
			intGrafCleanedValue = parseInt(intGrafCleanedValue) + 1;
			intGrafCleanedId.setValue(intGrafCleanedValue);

			//set values in model
			this.oModel.graffiti.internal.cleaned = intGrafCleanedValue;
			this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalRemaining").getText()) - 1;
			this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			this.calculateRemaining();
		},
		
		_onPressExtAbvTotaldown : function(evt) {
			var extAbvTotalId = this.getView().byId(
					"id_ExtAboveTotal");
			var extAbvTotalValue = extAbvTotalId.getValue();
			if (extAbvTotalValue > 0) {
				extAbvTotalValue = parseInt(extAbvTotalValue) - 1;
				extAbvTotalId.setValue(extAbvTotalValue);

				//set values in model
				this.oModel.graffiti.externalAboveGutter.total = extAbvTotalValue;
				this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveRemaining").getText()) - 1;
				this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			}
			this.calculateRemaining();
		},

		_onPressExtAbvTotalup : function(evt) {
			var extAbvTotalId = this.getView().byId(
					"id_ExtAboveTotal");
			var extAbvTotalValue = extAbvTotalId.getValue();
			extAbvTotalValue = parseInt(extAbvTotalValue) + 1;
			extAbvTotalId.setValue(extAbvTotalValue);

			//set values in model
			this.oModel.graffiti.externalAboveGutter.total = extAbvTotalValue;
			this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveRemaining").getText()) + 1;
			this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			this.calculateRemaining();
		},

		_onPressExtAbvGrafCleaneddown : function(evt) {
			var extAbvGrafId = this.getView().byId(
					"id_ExtAboveCleaned");
			var extAbvGrafValue = extAbvGrafId.getValue();
			if (extAbvGrafValue > 0) {
				extAbvGrafValue = parseInt(extAbvGrafValue) - 1;
				extAbvGrafId.setValue(extAbvGrafValue);

				//set values in model
				this.oModel.graffiti.externalAboveGutter.cleaned = extAbvGrafValue;
				this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveRemaining").getText()) + 1;
				this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			}
			this.calculateRemaining();
		},

		_onPressExtAbvGrafCleanedup : function(evt) {
			var extAbvGrafId = this.getView().byId(
					"id_ExtAboveCleaned");
			var extAbvGrafValue = extAbvGrafId.getValue();
			extAbvGrafValue = parseInt(extAbvGrafValue) + 1;
			extAbvGrafId.setValue(extAbvGrafValue);

			//set values in model
			this.oModel.graffiti.externalAboveGutter.cleaned = extAbvGrafValue;
			this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveRemaining").getText()) - 1;
			this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			this.calculateRemaining();
		},

		_onPressExtBelTotaldown : function(evt) {
			var extBelTotalId = this.getView().byId(
					"id_ExtBelowTotal");
			var extBelTotalValue = extBelTotalId.getValue();
			if (extBelTotalValue > 0) {
				extBelTotalValue = parseInt(extBelTotalValue) - 1;
				extBelTotalId.setValue(extBelTotalValue);

				//set values in model
				this.oModel.graffiti.externalBelowGutter.total = extBelTotalValue;
				this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowRemaining").getText()) - 1;
				this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			}
			this.calculateRemaining();
		},

		_onPressExtBelTotalup : function(evt) {
			var extBelTotalId = this.getView().byId(
					"id_ExtBelowTotal");
			var extBelTotalValue = extBelTotalId.getValue();
			extBelTotalValue = parseInt(extBelTotalValue) + 1;
			extBelTotalId.setValue(extBelTotalValue);

			//set values in model
			this.oModel.graffiti.externalBelowGutter.total = extBelTotalValue;
			this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowRemaining").getText()) + 1;
			this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			this.calculateRemaining();
		},

		_onPressExtBelGrafCleaneddown : function(evt) {
			var extBelGrafId = this.getView().byId(
					"id_ExtBelowCleaned");
			var extBelGrafValue = extBelGrafId.getValue();
			if (extBelGrafValue > 0) {
				extBelGrafValue = parseInt(extBelGrafValue) - 1;
				extBelGrafId.setValue(extBelGrafValue);

				//set values in model
				this.oModel.graffiti.externalBelowGutter.cleaned = extBelGrafValue;
				this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowRemaining").getText()) + 1;
				this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			}
			this.calculateRemaining();
		},

		_onPressExtBelGrafCleanedup : function(evt) {
			var extBelGrafId = this.getView().byId(
					"id_ExtBelowCleaned");
			var extBelGrafValue = extBelGrafId.getValue();
			extBelGrafValue = parseInt(extBelGrafValue) + 1;
			extBelGrafId.setValue(extBelGrafValue);

			//set values in model
			this.oModel.graffiti.externalBelowGutter.cleaned = extBelGrafValue;
			this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowRemaining").getText()) - 1;
			this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			this.calculateRemaining();
		},
		_onChangeInternalTotal : function(evt){
			//set values in model
			this.oModel.graffiti.internal.total = Number(evt.getSource().getValue());
			this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalTotal").getValue()) - Number(this.getView().byId("id_InternalCleaned").getValue());
			this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			this.calculateRemaining();
		},
		_onChangeExternalAboveTotal : function(evt){
			//set values in model
			this.oModel.graffiti.externalAboveGutter.total = Number(evt.getSource().getValue());
			this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveTotal").getValue()) - Number(this.getView().byId("id_ExtAboveCleaned").getValue());
			this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			this.calculateRemaining();
		},
		_onChangeExternalBelowTotal : function(evt){
			//set values in model
			this.oModel.graffiti.externalBelowGutter.total = Number(evt.getSource().getValue());
			this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowTotal").getValue()) - Number(this.getView().byId("id_ExtBelowCleaned").getValue());
			this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			this.calculateRemaining();
		},
		_onChangeInternalCleaned : function(evt){
			//set values in model
			this.oModel.graffiti.internal.cleaned = Number(evt.getSource().getValue());
			this.oModel.graffiti.internal.remaining = Number(this.getView().byId("id_InternalTotal").getValue()) - Number(evt.getSource().getValue());
			this.getView().byId("id_InternalRemaining").setText(this.oModel.graffiti.internal.remaining);
			this.calculateRemaining();
		},
		_onChangeExternalAboveCleaned : function(evt){
			//set values in model
			this.oModel.graffiti.externalAboveGutter.cleaned = Number(evt.getSource().getValue());
			this.oModel.graffiti.externalAboveGutter.remaining = Number(this.getView().byId("id_ExtAboveTotal").getValue()) - Number(evt.getSource().getValue());
			this.getView().byId("id_ExtAboveRemaining").setText(this.oModel.graffiti.externalAboveGutter.remaining);
			this.calculateRemaining();		
		},
		_onChangeExternalBelowCleaned : function(evt){
			//set values in model
			this.oModel.graffiti.externalBelowGutter.cleaned = Number(evt.getSource().getValue());
			this.oModel.graffiti.externalBelowGutter.remaining = Number(this.getView().byId("id_ExtBelowTotal").getValue()) - Number(evt.getSource().getValue());
			this.getView().byId("id_ExtBelowRemaining").setText(this.oModel.graffiti.externalBelowGutter.remaining);
			this.calculateRemaining();		
		},

		_onPressAttachmentButton: function(evt){
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;
			if(evt.getSource().getId() == component+"---CleanGraffiti--id_FormAttachmentButton"){
				if(this.selectedGraffitiCarId == ""){
					sap.m.MessageBox.alert("Select a Car...!!!", {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
				}
				else{
					var car = "Car_" + sap.ui.getCore().byId(this.selectedGraffitiCarId).getText();
					this.getOwnerComponent().notifnum = car;
					this.oRouter.navTo('Attachments');
					
				}
			}
			else{
				//Fault Table
				var fault = evt.getSource().getParent().mAggregations.cells[0].mProperties.text;
				this.getOwnerComponent().notifnum = fault;
				this.getOwnerComponent().faultTable = this.getView().byId("CloseFaultTable");
				this.oRouter.navTo('Attachments');
			}
				
		},
		onPressOffGrafType : function(evt) {
			var OffButton = this.getView().byId("OffensiveGrafTypeButton");
			var OthButton = this.getView().byId("OtherGrafTypeButton");
			var MuralButton = this.getView().byId("MuralGrafTypeButton");
			if (OffButton.getPressed() == true) {
				OthButton.setPressed(false);
				MuralButton.setPressed(false);
			}
		},

		onPressOthGrafType : function(evt) {
			var OffButton = this.getView().byId("OffensiveGrafTypeButton");
			var OthButton = this.getView().byId("OtherGrafTypeButton");
			var MuralButton = this.getView().byId("MuralGrafTypeButton");
			if (OthButton.getPressed() == true) {
				OffButton.setPressed(false);
				MuralButton.setPressed(false);
			}
		},

		onPressMuralGrafType : function(evt) {
			var OffButton = this.getView().byId("OffensiveGrafTypeButton");
			var OthButton = this.getView().byId("OtherGrafTypeButton");
			var MuralButton = this.getView().byId("MuralGrafTypeButton");
			if (OthButton.getPressed() == true) {
				OffButton.setPressed(false);
				OthButton.setPressed(false);
			}
		},

		/*
		 * function toggle(id) { var e = document.getElementById("answer" + id);
		 * if (e.style.display == 'none') { e.style.display = 'block';
		 * document.getElementById("correct" + id).style.backgroundColor =
		 * '#BCF5A9'; document.getElementById("correct" +
		 * id).style.backgroundColor = '#BCF5A9';
		 *  } else { e.style.display = 'none'; document.getElementById("correct" +
		 * id).style.backgroundColor = '#FFFFFF';
		 * document.getElementById("correct" + id).style.backgroundColor =
		 * '#FFFFFF';
		 *  } }
		 */
		handleCleanTabPost:function(data)
		{
			var response = data.NAV_CONFIRM_IP_RETURN.results;
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				listitems : response
			});
			
			var oMessage = new sap.m.Text({
				text : "{Message}"
				/*{
					parts :[{path : "MessageV1"} , {path : "MessageV2"}],
					formatter : function(MessageV1,MessageV2){
						
						return MessageV1+MessageV2;
							
					}
				}*/,
			});
			/*var operationNum = new sap.m.Text({
				text : "{MessageV2}",
			});*/
			var oType = new sap.ui.core.Icon({
				src : "sap-icon://status-positive",
				color : {
					parts : [ {
						path : "Type",
					} ],
					formatter : function(type) {
						if (type == "E") {
							return "red";
						} else if (type == "S") {
							return "green";
						} else {
							return "yellow";
						}
					}

				}
			});
			var oRow = new sap.m.ColumnListItem();
			oRow.addCell(oType).addCell(oMessage);
			this.oTable_create.setModel(oModel);
			this.oTable_create.bindItems("/listitems", oRow);
			this.openDialog();
		},
		openDialog : function()
		{
			if (!this.createNotification) {

				this.createNotification = createNotification;
			}
			this.createNotification.open();
		},
		closeDialog : function(evt) {

			var createNotification = this.createNotification;
			this.createNotification.close();
			var controller = this;
			controller.resetCleanTab();
			//window.location.reload();

		},
		cleanedByChange : function(evt)
		{
			this.cleanedByChange = true;
			if(evt.getSource().hasStyleClass("SelectError"))
				evt.getSource().removeStyleClass("SelectError");
		},
		confirmSave:  function()
		{
			var controller = this;
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			if(this.getView().byId("tabBar").getSelectedKey() == component+"---CleanGraffiti--graffitiTab")
				{
			if(oData.clean.cleanType != ""||this.getView().byId("cleanTypeInput").getValue()!=""||oData.clean.comments != ""||oData.clean.noOfCleaner != "1"||this.cleanedByChange ==true||this.getView().byId("cleanedByInput").getSelectedKey() != "")
				{
				jQuery.sap.require("sap.m.MessageBox");
		      	sap.m.MessageBox.show("Clean confirmation has not been submitted. Would you like to continue?",{ icon: sap.m.MessageBox.Icon.WARNING , title: "Warning", 
		      			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		      	        onClose: function(oAction){
		      	         if(oAction === sap.m.MessageBox.Action.YES)
		      	         {
		      	        	controller.resetCleanTab(); 
		      	         }
		      	         else
		      	        	 {
		      	        	controller.getView().byId("tabBar").setSelectedKey(component+"---CleanGraffiti--cleanTab");
		      	        	 }}
		      	});
				
				}
			else 
				{
				controller.resetCleanTab();
				}
				}
			else if((this.getView().byId("tabBar").getSelectedKey() == component+"---CleanGraffiti--cleanTab"))
				{
				if(this.oModel.graffiti.internal.total == 0&&
	        			this.oModel.graffiti.externalAboveGutter.total == 0&&
				this.oModel.graffiti.externalBelowGutter.total == 0&&

				this.oModel.graffiti.internal.cleaned == 0&&
				this.oModel.graffiti.externalAboveGutter.cleaned == 0&&
				this.oModel.graffiti.externalBelowGutter.cleaned == 0&&

				this.oModel.graffiti.internal.remaining == 0&&
				this.oModel.graffiti.externalAboveGutter.remaining == 0&&
				this.oModel.graffiti.externalBelowGutter.remaining == 0)
					{
					
					}
				else
					{
					jQuery.sap.require("sap.m.MessageBox");
			      	sap.m.MessageBox.show("Graffiti data has not been submitted. Would you like to continue?",{ icon: sap.m.MessageBox.Icon.WARNING , title: "Warning", 
			      			actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			      	        onClose: function(oAction){
			      	         if(oAction === sap.m.MessageBox.Action.YES)
			      	         {
			      	        	controller.refreshGraffitiTab();
			      	         }
			      	         else
			      	        	 {
			      	        	controller.getView().byId("tabBar").setSelectedKey(component+"---CleanGraffiti--graffitiTab");
			      	        	 }}
			      	});
					}
				}
			
		},
		postMeasurementData : function()
		{
			var oModel = sap.ui.getCore().getModel("modelView");
			var oData = oModel.getData();
			var pointArray = [];
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var date = new Date(this.byId("id_GraffitiDate").getDateValue());// get date from the date/time input field
			var z = new Date(date.getTime() - TZOffsetMs);
			var datemilli =z.getTime(); //date conversion to milliseconds
			var hour = date.getHours(); // get hours from the date value
			var minutes = date.getMinutes(); //get minutes from the date value
			var seconds = date.getSeconds(); //get seconds from the date value
			if(seconds<10)
			{
			seconds = "0"+seconds;
			}
			if(minutes<10)
			{
				minutes = "0"+minutes;
			}
			if(hour<10)
			{
				hour = "0"+hour;
			}
			var descArray = ["EAMF_GRAFFITI_INT_TOTAL","EAMF_GRAFFITI_INT_CLEANED","EAMF_GRAFFITI_INT_REMAINS","EAMF_GRAFFITI_EXT_ABOVE_TOTAL","EAMF_GRAFFITI_EXT_ABOVE_CLEAN","EAMF_GRAFFITI_EXT_ABOVE_REMAIN",
			                 "EAMF_GRAFFITI_EXT_BELOW_TOTAL",
			                 "EAMF_GRAFFITI_EXT_BELOW_CLEAN",
			                 "EAMF_GRAFFITI_EXT_BELOW_REMAIN"];
			pointArray.push(this.oModel.graffiti.internal.total,this.oModel.graffiti.internal.cleaned,this.oModel.graffiti.internal.remaining);
			pointArray.push(this.oModel.graffiti.externalAboveGutter.total,this.oModel.graffiti.externalAboveGutter.cleaned,this.oModel.graffiti.externalAboveGutter.remaining);
			pointArray.push(this.oModel.graffiti.externalBelowGutter.total,this.oModel.graffiti.externalBelowGutter.cleaned,this.oModel.graffiti.externalBelowGutter.remaining);
			var array = [];
			var length = descArray.length;
			var car = sap.ui.getCore().byId(this.selectedGraffitiCarId).getText();
			var data = {};
			data.d = {};
			data.d.EvError = "";
			data.d.EvErrorInd = "";
			data.d.NAV_MEASUREMENT_RETURN = [];
			for(var i=0;i<length;i++)
				{
				array.push({
					"Zzidate" : "\\/Date("+datemilli+")\\/" ,
					"Zzatnam": descArray[i],
					"Zzitime": "PT"+hour+"H"+minutes+"M"+seconds+"S",
					"Zzpoint": "",
					"ZzrecValue": pointArray[i].toString(),
					"Zzsetid" : oData.set,
					"Zzcarid" : car,
					"Zzcleanloc" : oData.cleanLoc,
					"Zzmessage": ""});
				}
			data.d.NAV_MEASUREMENT_RETURN = array;
			measurePtPost(data,this);
			
		},
		handleMeasurementResponse : function(response)
		{
			var results = response.NAV_MEASUREMENT_RETURN;
			var error = response.EvErrorInd;
			var message = response.EvError;
			if(error === "E")
				{
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
						message,
						sap.m.MessageBox.Icon.ERROR, "ERROR",
						sap.m.MessageBox.Action.OK, function() {/*
																 * True
																 * case;
																 */
						});
				}
			else
				{
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				listitems : results
			});
			var oType = new sap.m.Text({
				text : "{Zzatnam}",
			});
			var oMessage = new sap.m.Text({
				text : "{Zzmessage}",
			});
			var oRow = new sap.m.ColumnListItem();
			oRow.addCell(oType).addCell(oMessage);
			this.oTable_create.setModel(oModel);
			this.oTable_create.bindItems("/listitems/results", oRow);
			this.openDialog();
				}
		},
		_onPressSubmit : function(oEvent) {
			
			
			var controller = this;
			var c = this.getView().getParent();
			var component = c.getPages()[0]._sOwnerId;
			var n = 0;
			n = this.oModel.graffiti.internal.remaining +
				this.oModel.graffiti.externalAboveGutter.remaining +
				this.oModel.graffiti.externalBelowGutter.remaining;
			if(this.getView().byId("tabBar").getSelectedKey() == component+"---CleanGraffiti--graffitiTab"){

				var error = "";
				if(this.oModel.graffiti.internal.total == 0&&
	        			this.oModel.graffiti.externalAboveGutter.total == 0&&
				this.oModel.graffiti.externalBelowGutter.total == 0&&

				this.oModel.graffiti.internal.cleaned == 0&&
				this.oModel.graffiti.externalAboveGutter.cleaned == 0&&
				this.oModel.graffiti.externalBelowGutter.cleaned == 0&&

				this.oModel.graffiti.internal.remaining == 0&&
				this.oModel.graffiti.externalAboveGutter.remaining == 0&&
				this.oModel.graffiti.externalBelowGutter.remaining == 0)
					{
					error = "X";
					sap.m.MessageBox.alert("No Data Entered has been entered", {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					
					}
				else if(this.selectedGraffitiCarId == ""){
					error = "X";
					sap.m.MessageBox.alert("Please select a Car", {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
				}
				else if( Number(this.getView().byId("id_InternalRemaining").getText()) < 0 ||
						Number(this.getView().byId("id_ExtAboveRemaining").getText()) < 0 ||
						Number(this.getView().byId("id_ExtBelowRemaining").getText()) < 0 ){

					error = "X";
					sap.m.MessageBox.alert("Graffiti remaining cannot be less than 0",{title : "Error", icon: sap.m.MessageBox.Icon.ERROR});

				}
				else if( Number(this.getView().byId("id_InternalRemaining").getText()) > 0 ||
						Number(this.getView().byId("id_ExtAboveRemaining").getText()) > 0 ||
						Number(this.getView().byId("id_ExtBelowRemaining").getText()) > 0 ){
					if(this.getView().byId("id_Comments").getValue() == "" &&
					   this.selectedGraffitiTypesId == ""){
						error = "X";
						sap.m.MessageBox.alert("'COMMENTS' & 'GRAFFITY TYPE' are mandatory when Graffiti Remaining > 0", {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					};
						
				};
				
				if(error !== "X"){
					//No Errors--> Create Notification
					/*-	Notification Type = F2 
					-	Description = "Total Count of Remaining Graffiti = N" where N is the remaining quantity.
					-	Symptom = Code value based upon Offensive, Mural or Other entered in the UI screen
					-	Priority = 'E' unless symptom is offensive in which case priority should equal 'D' – the priorities should be used to set required start and end dates.
					-	Long Text = "Total Count of Remaining Graffiti = N" where N is the remaining quantity, concatenated with comments entered in the UI Screen
					-	Equipment = Car Equipment Record ID
					-	Notification Date = Graffiti Identification Date from UI screen
					-	Functional Location = Car functional Location*/
					var graffitiTypes = this.oModel.graffiti.graffitiTypes;
					var graffitiTypeText = "";
					var graffitiCode = "";
					if(this.selectedGraffitiTypesId !== ""){
						graffitiTypeText = sap.ui.getCore().byId(this.selectedGraffitiTypesId).getText();
						$.each(graffitiTypes, function(i, obj){
							if(obj.Kurztext == graffitiTypeText){
								graffitiCode = obj.Code;
							}
						});
					}
					
					
					
					var d = {};
					d.ZznotifType 		= "F2";
					
					if(this.selectedGraffitiTypesId !== ""){
						if(sap.ui.getCore().byId(this.selectedGraffitiTypesId).getText() !== "Offensive"){
							d.Zzpriority  	= "E";
						}
						else{
							d.Zzpriority 	= "D";
						};
					};

					d.ZzsymptomGp 		= ""; 				//No values expectd from UI
					d.ZzsymptomCode 	= graffitiCode;
					d.Zzfunctionalloc 	= ""; 				//No values expectd from UI
					d.Zzequipment 		= ""; 				//No values expectd from UI
					d.Zzqmdat			= this.getView().byId("id_GraffitiDate").getDateValue();
					d.ZzshortText   	= this.getView().byId("id_Comments").getValue();
					d.Zzlongtext    	= "Total Count of Remaining Graffiti = " + n;
					d.Zzcarid 			= sap.ui.getCore().byId(this.selectedGraffitiCarId).getText();
					d.Zzaufnr       	= ""; 				//No values expectd from UI
					d.ZzerrorInd    	= ""; 				//No values expectd from UI
					d.Zzerror			= ""; 				//No values expectd from UI
					var controller = this;
					var oModel = sap.ui.getCore().getModel("modelView");
					var oData = oModel.getData();
					d.Zzsetid = oData.set;
					this.postMeasurementData();
					if(n>0)
						{
					createFault(d, controller.setFaultNotification, controller);
						}
					else
						{/*
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.show(
								"Notification cannnot be created for 0 Graffiti Remaining",
								sap.m.MessageBox.Icon.ERROR, "ERROR",
								sap.m.MessageBox.Action.OK, function() {
																		 * True
																		 * case;
																		 
								});
						*/}
					};
		}
			else if(this.getView().byId("tabBar").getSelectedKey() == component+"---CleanGraffiti--cleanTab")
				{
				var oModel = sap.ui.getCore().getModel("modelView");
				var oData = oModel.getData();
				var error;
				if(oData.clean.carArray.length==0)
					{
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(
							"Select a Car to proceed",
							sap.m.MessageBox.Icon.ERROR, "ERROR",
							sap.m.MessageBox.Action.OK, function() {/*
																	 * True
																	 * case;
																	 */
							});
					error = true;
					}
				else
					{
				error= this.validation();
					}
				if (!error) {
					var length = oData.clean.carArray.length;
					var carNum = "";
					var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
					var date = new Date(this.byId("id_DateTimeClean").getDateValue());// get date from the date/time input field
					var z = new Date(date.getTime() - TZOffsetMs);
					var datemilli =z.getTime(); //date conversion to milliseconds
					var hour = date.getHours(); // get hours from the date value
					var minutes = date.getMinutes(); //get minutes from the date value
					var seconds = date.getSeconds(); //get seconds from the date value
					if(seconds<10)
					{
					seconds = "0"+seconds;
					}
					if(minutes<10)
					{
						minutes = "0"+minutes;
					}
					if(hour<10)
					{
						hour = "0"+hour;
					}
					var data = {}; // data object
					data.d = {};
					for(var i=0;i<length;i++)
					{
					carNum = carNum + "," + oData.clean.carArray[i];
					}
					carNum = carNum.substr(1);
					data.d.IvCarId = carNum,
					data.d.IvText = oData.clean.comments,
					data.d.Zzplantsection = "",
					data.d.Zzcleanloc = oData.cleanLoc,
					data.d.IvDate = "\\/Date("+datemilli+")\\/";
					//data.d.IvDate = null,
					data.d.Zznoofcleaners = oData.clean.noOfCleaner,
					data.d.IvSetId = oData.set,
					data.d.Zzcleanedby = this.getView().byId("cleanedByInput").getSelectedKey(),
					data.d.IvTime = "PT"+hour+"H"+minutes+"M"+seconds+"S",
					//data.d.IvTime = null,
					data.d.Zzcleanunique = "",
					data.d.ZzcleanTyp = oData.clean.cleanType;
					data.d.NAV_CONFIRM_IP_RETURN = [],
					data.d.NAV_CONFIRM_IP_RETURN.Type = "",
					data.d.NAV_CONFIRM_IP_RETURN.Number = "",
					data.d.NAV_CONFIRM_IP_RETURN.Message = "",
					data.d.NAV_CONFIRM_IP_RETURN.LogNo = "",
					data.d.NAV_CONFIRM_IP_RETURN.MessageV1 = "",
					data.d.NAV_CONFIRM_IP_RETURN.MessageV2 = "",
					data.d.NAV_CONFIRM_IP_RETURN.MessageV3 = "",
					data.d.NAV_CONFIRM_IP_RETURN.MessageV4 = "";
					cleanTabPost(data,controller);
					
				}
				}
			
			
			/*
			var dialogName = "WarningDialog";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this
					.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName : "tfnsw.eam.cleaning.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});
		*/},
		resetCleanTab : function()
		{
		var oModel = sap.ui.getCore().getModel("modelView");
		var oData = oModel.getData();
		oData.clean.comments = "";
		oData.clean.noOfCleaner = "1";
		//oData.clean.cleanedBy = "";
		this.getView().byId("cleanedByInput").setSelectedKey(1);
		oData.clean.cleanType = "";
		this.getView().byId("cleanTypeInput").setValue("");
		var d = new Date();
		this.getView().byId("id_DateTimeClean").setDateValue(d);
		oModel.setData(oData);
		oModel.refresh(true);
		},

		CleanTypevaluehelp : function(oEvent) {
			
			var router = sap.ui.core.UIComponent.getRouterFor(this);
	        router.navTo("CleanType");
			/*var dialogName = "CleanType";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this
					.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName : "tfnsw.eam.cleaning.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});*/
		},
		Cleanedbyvaluehelp : function(oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
	        router.navTo("CleanedBy");
	        
			/*var dialogName = "CleanedBy";
			this.dialogs = this.dialogs || {};
			var dialog = this.dialogs[dialogName];
			var source = oEvent.getSource();
			var bindingContext = source.getBindingContext();
			var path = (bindingContext) ? bindingContext.getPath() : null;
			var model = (bindingContext) ? bindingContext.getModel() : this
					.getView().getModel();
			var view;
			if (!dialog) {
				view = sap.ui.xmlview({
					viewName : "tfnsw.eam.cleaning.view." + dialogName
				});
				view._sOwnerId = this.getView()._sOwnerId;
				dialog = view.getContent()[0];
				this.dialogs[dialogName] = dialog;
			}
			dialog.open();
			if (view) {
				dialog.attachAfterOpen(function() {
					dialog.rerender();
				});
			} else {
				view = dialog.getParent();
			}
			view.setModel(model);
			view.bindElement(path, {});*/
		},
		_onPressNpsapmButton14495519887020HG : function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Attachments");
		},
		_onPressNpsapmButton14495508894700FF : function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Attachments");
		},
		_onValueHelpRequestNpsapmInput14496367681033M7 : function(evt) {
			
			  /*var cntx =
			  evt.getSource().getBindingContext().getPath().substr(11); var
			  router = sap.ui.core.UIComponent.getRouterFor(this);
			  router.navTo("CleaningLocation",{context:cntx});
			  */
			    //var cntx = evt.getSource().getValue();
			    // --- this.getOwnerComponent().locationF4 = evt.getSource().getValue();
				var router = sap.ui.core.UIComponent.getRouterFor(this);
		        router.navTo("CleaningLocation");
			 
			/*sap.ui.core.UIComponent.getRouterFor(this).navTo(
					"CleaningLocation", {
						context : ""
					});*/ // ,{previousPage:this.getView()}, false);
		},
		_onValueHelpRequestNpsapmInput14496367957873MD : function() {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("SetNumber");
		}
	});
}, /* bExport= */true);