sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.eam.cleaning.view.Attachments", {

		onInit: function() {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			
			this.myModel = new sap.ui.model.json.JSONModel();
			
			
			
			},
		
		_handleRouteMatched: function(evt){

			if(evt.getParameter("name") !== "Attachments"){
				return;
			}
			//this.getView().refresh();
			var notifnum = this.getOwnerComponent().notifnum;
			var controller = this;
			this.getView().byId("attachmentlist").destroyItems();
			if(notifnum !== ""){

				if(notifnum.substring(0,4) !== "Car_"){
					getDocList(notifnum, controller.loadDocList, controller);					
				}
			}
		},
		
		//Get Attachment List
		loadDocList : function(data) {
			var oModel = new sap.ui.model.json.JSONModel();
			var listitems = data.results[0].NAV_GET_ATT_LIST.results;
			oModel.setData(listitems);
			var final_data = oModel.getData();
			var oView = this.getView();
			var count = "Attachments (" + listitems.length + ")";
			this.byId("id_attachmentTitle").setText(count);
			if((this.getOwnerComponent().notifnum).substring(0,4) !== "Car_"){
				var oFaultModel = this.getOwnerComponent().faultTable.getModel();
				var oData = oFaultModel.getData();
				for(var i=0;i<oData.results.length;i++){
					if(this.getOwnerComponent().notifnum == oData.results[i].Qmnum){
						if(listitems.length !== 0){
							oData.results[i].Image = "("+listitems.length+")";							
						}
						else{
							oData.results[i].Image = "(0)";
						}
						oFaultModel.setData(oData);
						this.getOwnerComponent().faultTable.setModel(oFaultModel);
						break;
					}
				};
				
			}
			// order_select = equipNum;
			for (var i=0;i<final_data.length; i++) {
				var a = final_data[i].Filename;
				var x = a.split(".");
				var ext = x[x.length - 1];
				if ((ext == "jpeg") || (ext == "JPEG")
						|| (ext == "jpg") || (ext == "JPG")
						|| (ext == "GIF") || (ext == "gif")) {
					var imagePath = "sap-icon://image-viewer";
				} else if ((ext == "PDF") || (ext == "pdf"))
					imagePath = "sap-icon://pdf-attachment";

				else if ((ext == "zip") || (ext == "ZIP"))
					imagePath = "sap-icon://attachment-zip-file";

				else if ((ext == "txt") || (ext == "TXT"))
					imagePath = "sap-icon://attachment-text-file";

				else
					imagePath = "sap-icon://attachment";

				var newDocument = new sap.m.CustomListItem({
					type : "Active",
					content : [ new sap.m.HBox({
						justifyContent : "Start",
						alignItems : "Start",
						items : [ new sap.ui.core.Icon({
							src : imagePath,
							size : "2em"
						}).addStyleClass("iconHBox"),
								new sap.m.Label({
									text : final_data[i].Filename,
									textAlign : "Center",
									width : "200px"
								})

						]
					}).addStyleClass("docHBox") ]
				}).data("documentId", final_data[i].SoObjNo).data(
						"type", final_data[i].Filename)
				oView.byId("attachmentlist").addItem(newDocument);
			}
		},

		onNavBack: function() {
			history.go(-1);
		},
		//open document
		listPress : function(evt) {
			/*var docValue = evt.getParameters().listItem
					.data("documentId");
			var filename = evt.getParameters().listItem
					.data("type");*/
			//var prevPage = this.getView();

			var docValue = evt.getParameters().listItem
			.data("documentId");
//	        this.router.navTo("DocView",{docValue:docValue});
          var docPath = applicationContext.applicationEndpointURL+"/ZGWP_PM_FAULT_MANAGE_SRV/ETS_GET_ATTACH_CONTENTS(SoObjNo='"
                                 + docValue + "')/$value";
        sap.m.URLHelper.redirect(docPath, true);
			/*var docValue = evt.getParameters().listItem
					.data("documentId");
			if (!app.getPage("docView")) {
				var docView = sap.ui.view({
					id : "docView",
					viewName : "view.DocView",
					type : sap.ui.core.mvc.ViewType.XML,
					viewData : app
				});
				docView.getController().nav = this;
				app.addPage(docView);
			}
			app.getPage("docView").data("prevPage", prevPage);
			app.getPage("docView").data("docValue", docValue);
			var docViewTemp = app.getPage("docView");
			var pdf_url = sUrl
					+ "/ETS_GET_ATTACH_CONTENTS(SoObjNo='"
					+ docValue + "')/$value";
			docViewTemp
					.byId("html_page")
					.setContent(
							'<iframe src= "'
									+ pdf_url
									+ '" width="100%" height="100%"></iframe>');
			app.to("docView");*/
		},
		//Delete Attachment
		handleDelete: function(evt) 
		{
			var controller = this;
			var docValue = evt.getParameters().listItem.data("documentId");
			var notifNum = this.getOwnerComponent().notifnum;
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show("Do you want to delete the attachment?",{
				icon: sap.m.MessageBox.Icon.WARNING, 
				title: "Delete Attachment",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO ],
				onClose: function(oAction){
					if(oAction === "YES")
					{
						removeDocList(notifNum,docValue,controller.removeDoc,controller);			
					}
				} });
			
		},
		removeDoc : function(data)
		{
							var notifNum = this.getOwnerComponent().notifnum;
							var controller = this;
							var status = data.Status;
							jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.show(status,
									sap.m.MessageBox.Icon.SUCCESS, "Success",
									sap.m.MessageBox.Action.OK, function() {
									});
							controller.getView().byId("attachmentlist").destroyItems();
							getDocList(notifNum, controller.loadDocList, controller);
							this.getView().addStyleClass("customScroll");
		    
			
		},

		_onPressAdd: function(evt){
			this.uploadDialog();
		},
		//Upload Attachment
		uploadDialog: function(){

			  var sUrl = applicationContext.applicationEndpointURL+"/ZGWP_PM_FAULT_MANAGE_SRV";
			  var notifNum = this.getOwnerComponent().notifnum;
				var controller = this;
					if(!controller.busyIndicator){
					    
						controller.busyIndicator = new sap.m.BusyDialog();
					  }
					controller.busyIndicator.open();
					var oFU = new sap.ui.unified.FileUploader({
						
							uploadUrl : sUrl+"/ETS_CREATE_GOS_INPUT",  
							name: 'FileUpload',
			    			buttonText:'Browse',
			    			width: "89%",
			    			fileType: "jpeg,jpg,png,pdf,JPEG,JPG,PNG,PDF",
							useMultipart: false, 
			    			sendXHR: true,
			    			maximumFilenameLength: 50,
			    			filenameLengthExceed: function(oEvent){
			    				var upldCntnt = this;
			    				jQuery.sap.require("sap.m.MessageBox");
			    			  	  sap.m.MessageBox.show("Filename length cannot be more than 50 characters",sap.m.MessageBox.Icon.ERROR ,"Error" , sap.m.MessageBox.Action.OK, function() {
			    			  		upldCntnt.oFileUpload.value = "";
			    			  		  });
			    			  	controller.busyIndicator.close();
			    			},
			    			typeMissmatch: function(oEvent){
			    				jQuery.sap.require("sap.m.MessageBox");
			    			  	  sap.m.MessageBox.show("File with extension " + oEvent.getParameter("fileType").toUpperCase()+ " is not allowed. Allowed extensions are: JPG, PNG, PDF",sap.m.MessageBox.Icon.ERROR ,"Error" , sap.m.MessageBox.Action.OK, function() { });
			    			  	controller.busyIndicator.close();
			    			},
			    			uploadOnChange: false,
							uploadComplete: function()
							{
								controller.getView().byId("attachmentlist").destroyItems();
								var notifnum = controller.getOwnerComponent().notifnum;
								if(notifnum !== ""){

									if(notifnum.substring(0,4) !== "Car_"){
										getDocList(notifnum, controller.loadDocList, controller);					
									}
								}
								}
			          
			                             
			    });
				
					var dialog = new sap.m.Dialog({
						title : "File Upload",
						type : "Message",
						content : [oFU],
						buttons: [
						new sap.m.Button({
							text : "Upload",
							press : function(evt) {
								oFU.destroyHeaderParameters();
					
									if(!this.busyIndicator)
								  {
								    this.busyIndicator = new sap.m.BusyDialog()
								  }
									var modal = this;
							 modal.busyIndicator.open();
				        			  var oModel =  new sap.ui.model.odata.ODataModel(sUrl, true)
				        			  oModel.refreshSecurityToken( function(a, b) {
									var token = b.headers["x-csrf-token"];
									var a= oFU.getValue();
									var x = a.split(".");
									var ext=x[x.length-1];
									var func = notifNum;
									
									if(token && token!=undefined && token.trim()!=''){
										
										oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "slug", value: func+","+x[0]+","+ext+","+"N"}));  
										oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "X-CSRF-Token", value: token }));
										// call the upload method
										oFU.upload();
									 	modal.busyIndicator.close();
                                                                  }
				        			  }, function(a) {
									alert("Error: "+a);
									modal.busyIndicator.close();
                                                                  controller.dialog.close();
				        			  }, true);
//				$.ajax({
//								type : 'GET',
//								url: sUrl+"/",
//								datatype : "",
//								contentType: "application/atom+xml;type\x3dentry;",
//								
//					            headers: {
//					                "X-CSRF-Token": "fetch"
//					            },
//								success : function(data,textStatus, request){
//									modal.busyIndicator.close();
//									var token = request.getResponseHeader('X-CSRF-Token');
//									var a= oFU.getValue();
//									var x = a.split(".");
//									var ext=x[x.length-1];
//									var func = notifNum;
//									
//									if(token && token!=undefined && token.trim()!=''){
//										
//										oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "slug", value: func+","+x[0]+","+ext+","+"N"}));  
//										oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "X-CSRF-Token", value: token }));
//										// call the upload method
//										oFU.upload();
//									 	modal.busyIndicator.close();
//									}
//									modal.busyIndicator.close();
//								},
//								error : function(XMLHttpRequest, textStatus, errorThrown){
//									alert("Error: " + errorThrown + "; Status: " + textStatus);
//									controller.dialog.close();
//								}
//							});
				modal.busyIndicator.close();
								controller.dialog.close();
							}
						}),
						 new sap.m.Button({
								text : "Cancel",
								press : function(
										evt) {
									controller.dialog.close();
									controller.busyIndicator.close();
								}
							})],
						
					});
					this.dialog = dialog;
				
				this.dialog.open();
				controller.busyIndicator.close();
			
		},
	});
}, /* bExport= */ true);