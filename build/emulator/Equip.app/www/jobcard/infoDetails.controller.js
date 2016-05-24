sap.ui.controller("tfnswjobcard.infoDetails", {

	
	handleNavBack : function(evt){
		
		var app = this.getView().getViewData();
		//Change Req #1919 Rollback the engineering form changes. Comment out the lines 
		/*var docs = this.getView().docList.getModel().getData();
		if(!this.getView().data("taskCompleted")){
			for(var i = 0; i < docs.length; i++)
			{
				var linkCombination = docs[i].TaskCode + "_" + docs[i].Aufnr + "_" + docs[i].docNo; 
				if(this.linksVisited.indexOf(linkCombination) === -1 )
				{
					sap.m.MessageBox.show("Visit all the links before leaving the page",sap.m.MessageBox.Icon.ERROR,"Error!", sap.m.MessageBox.Action.OK, null );
					return;
				}
				
			}			
		}*/
		app.to("jobDetails");
	},
	
	setTaskLongText : function(data){
		// Change Req #1919 Rollback the engineering form changes. Comment out the lines 
		// Parse the long text, retrieve the form number and name from the html ta <LINK>Test Doc<DOCID>12002001</DOCID></LINK> 
		/*var linksData = [];
		var app = this.getView().getViewData();
		var userId = sap.ushell.Container.getService("UserInfo").getId();
		var isMobile = {
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
		var openTxtURLVariant = "ENH-8236_OPENTEXT_URL_DESKTOP";
		if(isMobile.any()){
			enableReadControl = false;
			deviceIsMobile = true;
			openTxtURLVariant = "ENH-8236_OPENTEXT_URL_MOBILE";
		}
		if(data.d.results.length != 0){
			var baseUrl;
			var parameters = app.controller.getParameterValue(openTxtURLVariant);
			if(parameters)
			{
				for(var i=0; i<parameters.length; i++)
				{
						baseUrl = parameters[i].Low;
						i = parameters.length;
				}
			}
			var headerData = this.getView().taskHeader.getModel().getData();
			var text = data.d.results[0].LongText.split("@~@").join("\n");
	    	var link1 = text.split("<LINK>");
	    	var link2;
	    	var finalText = "";
	    	var docNo;
	    	if(link1.length > 1)
	    	{
	    		for(var i = 1; i < link1.length; i++)
	    		{
	    			var link = {};
	    			link2 = link1[i].split("</LINK>");
	    			link.url = "";
				link.docNo = "";
				link.docName = "";
				docNo = link2[0].split("<DOCID>");
				if(docNo)
				{
					if(docNo.length > 1)
					{
						link.docName = docNo[0];
						link.docNo = docNo[1].replace("</DOCID>","");	
						link.Aufnr = headerData.Aufnr;
						link.TaskCode = headerData.TaskCode;
						link.url = baseUrl + link.docNo + "&FilterParams=WO;" + headerData.Aufnr + ";Text:OPR;"+headerData.Vornr+";Text:TASKID;"+ headerData.TaskCode +";Text;USERNAME;"+userId+";TEXT";
						link.visited = false;
						text = text.replace("<DOCID>"+link.docNo+"</DOCID>","");
					}
				}
	    			linksData.push(link);
					text = text.replace("<LINK>","");
					text = text.replace("</LINK>","");
	    		}
	    	}			
			this.getView().textBox.setValue(text);
			this.getView().docList.getModel().setData(linksData);
		}*/
		if(data.d.results.length != 0){
			var text = data.d.results[0].LongText.split("@~@").join("\n");			
			this.getView().textBox.setValue(text);
			//this.getView().docList.getModel().setData(linksData);
		}		
		else{
			var text = "";
		    this.getView().textBox.setValue(text)	;
		    //this.getView().docList.getModel().setData(linksData);
		}
	},
	
	showAttachments: function(evt){
		var controller = this;
		var app = this.getView().getViewData();
		var taskData = this.getView().taskHeader.getModel().getData();
		if(!app.getPage("jobAttachmentsList")){
			var jobAttachmentsList = new sap.ui.view({id:"jobAttachmentsList",viewName:"tfnswjobcard.AttachmentsList", type:sap.ui.core.mvc.ViewType.JS, viewData : app});
			app.addDetailPage(jobAttachmentsList);
			this.jobAttachmentsList = jobAttachmentsList;
		}
		var attachmentsController = this.jobAttachmentsList.oController;
		/*var taskData = [];
		var taskPayload = {};
		//taskPayload.d = {};
		taskPayload.Taskcode = taskData.TaskCode;
		var orderDocs = [];
		var orderData = {};
		orderData.OrderNumber = taskData.Aufnr;
		
		//For return entity
		taskPayload.NAV_TASK_DOCUMENTS = [];
		taskPayload.NAV_TASK_DOCUMENTS.push(orderData);
		//taskData.push(taskPayload);
		
		app.controller.postData("/ETS_TASK_ORDERID",taskPayload,attachmentsController,attachmentsController.bindAttachmentList);*/
		attachmentsController.bindAttachmentList(controller.attachments);
		app.to("jobAttachmentsList");
		

		
		
		
		// Below test code is to navigate between cross applications -- example here to fault management
		/*if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService)
		{
		  var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

		   oCrossAppNavigator.toExternal({
		                      target: { semanticObject : "FAULT_MGMT", action: "display" },   //the app you're navigating to 
		                        params : { "queryFaultNo":"1000023351", "param2":"data"}
		                     }); 
		  }
		else
		{
		     jQuery.sap.log.info("Cannot Navigate - Application Running Standalone");
		 }*/
	},
	loadDocuments: function(data){
		var controller = this;
		if(data.NAV_TASK_DOCUMENTS){
			docs = data.NAV_TASK_DOCUMENTS;
		}
		else
		{
			data.NAV_TASK_DOCUMENTS = {};
			data.NAV_TASK_DOCUMENTS.results = [];
		}
		controller.attachments = data;
		var docs = data.NAV_TASK_DOCUMENTS.results;
		/*var docCount = 0;
		$.each(docs, function(i, doc){
			if($.trim(doc.Description).length > 0)
				docCount++;
		});
		if(docCount > 0)*/
		var text = "Attachments ("+docs.length+")";
		this.getView().attachments.setText(text);
	},
	openLink: function(evt){
		var selectedLink = evt.getParameters().listItem.getBindingContext().getObject();
		//evt.getParameters().listItem.getBindingContext().getObject().visited = true;
		var linkCombination = selectedLink.TaskCode + "_" + selectedLink.Aufnr + "_" + selectedLink.docNo; 
		if(this.linksVisited.indexOf(linkCombination) === -1 )
		{
			this.linksVisited.push(linkCombination);
		}
		window.open(evt.getParameters().listItem.getBindingContext().getObject().url,"_blank");
	},
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf tfnswjobcard.infoDetails
*/
	onInit: function() {
		this.linksVisited = [];
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf tfnswjobcard.infoDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf tfnswjobcard.infoDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf tfnswjobcard.infoDetails
*/
//	onExit: function() {
//
//	}

});