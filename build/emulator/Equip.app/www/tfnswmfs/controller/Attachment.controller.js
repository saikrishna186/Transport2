sap.ui.define([
               "sap/ui/core/mvc/Controller",
               "tfnswmfs/model/models",
               "sap/m/MessageBox"

               ], function(Controller,models) {
	"use strict";

	return Controller.extend("tfnswequip.tfnswmfs.controller.Attachment", {

		onInit: function() {
			var faultId = "";
			this.bucket = "testmfs";
			this.region = "ap-southeast-2";
			this.baseUrl = "https://s3-"+this.region+".amazonaws.com/"+this.bucket+"/";
			this.mFSMsg = this.getOwnerComponent().getModel("mFSMsg");
			this.mainDataModel = this.getOwnerComponent().getModel("mainDataModel");
			this.sapFlag = false;
//			this.awsStore = null;
//			this.storeName = "awsStore";
//			this.abc = models.getAWSDetails();
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
		},
		_handleRouteMatched: function(evt) {
			if (evt.getParameter("name") !== "Attachment") {
				return;
			}
			if(this.getView().getModel("attachments")){
				this.getView().getModel("attachments").destroy();
			}
			this.faultId = evt.getParameter("arguments").faultId;
			this.sapFlag = (evt.getParameter("arguments").sapFlag === "true");
			if(this.sapFlag === true){
				this.getAttachments(this, this.faultId);
			}else{
				
				this.getAWSAttachments(this, this.faultId);
			}
		},

		onNavBack: function() {
			this.router.navTo("Update", {
				faultId: this.faultId,
				fromView:"mfsAttachments"
			});
		},
		getAWSAttachments:function(vController, faultId) {
			AWS.config.update({
				accessKeyId: "AKIAIQ7HJDPYCON6VYHA",
				secretAccessKey: "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",
				region: vController.region,
			});
			var s3 = new AWS.S3();
			var params = {
					Bucket: vController.bucket, /* required */
					Prefix:faultId
			};
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog()
			}
			vController.busyIndicator.open();
			s3.listObjects(params, function(err, data) {
				if (err) {
					//console.log(err, err.stack);
					vController.busyIndicator.close();
				} else{
					if(data.Contents.length === 0){
						var params2 = {
								Bucket: vController.bucket, /* required */
								Key:faultId+"/"
						};
						s3.putObject(params2, function (err, res) {
							if (err) {
								//console.log("Error creating a folder", err);
							} else {
								var blankImage = {
										"Client": "",
										"Filename": "IconAddImage.png",
										"imageFlag": "X",
										"IvNotification": "",
										"Message": "",
										"Mimetype": "",
										"Qmnum": faultId,
										"SoObjNo": "",
										"src": "tfnswmfs/css/mime/IconAddImage.png",
										"clck": "onPressAdd",
										"removable": false,
										"imgSrc":"tfnswmfs/css/mime/IconAddImage.png",
										"imageType":true
								};
								var filesArr = [];
								var attachmentModel = new sap.ui.model.json.JSONModel();
								filesArr.push(blankImage);
								attachmentModel.setData({
									files: filesArr
								});
								vController.getView().setModel(attachmentModel, "attachments");
								vController.busyIndicator.close();
							}
						});	
					}else{ // if the folder exist.
						var blankImage = {
								"Client": "",
								"Filename": "IconAddImage.png",
								"imageFlag": "X",
								"IvNotification": "",
								"Message": "",
								"Mimetype": "",
								"Qmnum": faultId,
								"SoObjNo": "",
								"src": "tfnswmfs/css/mime/IconAddImage.png",
								"clck": "onPressAdd",
								"removable": false,
								"imgSrc":"tfnswmfs/css/mime/IconAddImage.png",
								"imageType":true
						};
						var filesArr = [];
						var attachmentModel = new sap.ui.model.json.JSONModel();
						for(var i=0;i<data.Contents.length;i++){
							if(data.Contents[i].Key !== (faultId+"/")){
								var newFile = {};
								var fileUrl = vController.baseUrl;
								var key = data.Contents[i].Key;
								var fileName = key.substring(key.lastIndexOf('/') + 1);
								var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
								fileUrl += vController.faultId+"/"+fileName;

								if((/\.(bmp|csv|doc|docx|gif|jpeg|jpg|pdf|png|ppt|pptx|tiff|xls|xlsx|txt)$/i).test(fileName)){
									newFile.Qmnum = vController.faultId;
									newFile.src = fileUrl;
									newFile.removable = true;
									newFile.Filename = fileName;
									newFile.SoObjNo = key;
									if((/\.(bmp|gif|jpeg|jpg|png|tiff|txt)$/i).test(fileName)){
										newFile.imgSrc = newFile.src;
										newFile.imageType = true;
									}else if((/\.(csv|xls|xlsx)$/i).test(fileName)){
										newFile.imgSrc = "tfnswmfs/css/mime/XLS_Icon.png";
										newFile.imageType = false;
									}else if((/\.(doc|docx)$/i).test(fileName)){
										newFile.imgSrc = "tfnswmfs/css/mime/Word_Icon.png";
										newFile.imageType = false;
									}if((/\.(pdf)$/i).test(fileName)){
										newFile.imgSrc = "tfnswmfs/css/mime/PDF_Icon.png";
										newFile.imageType = false;
									}if((/\.(ppt|pptx)$/i).test(fileName)){
										newFile.imgSrc = "tfnswmfs/css/mime/PPT_Icon.png";
										newFile.imageType = false;
									}
								}
								filesArr.push(newFile);
							}
						}
						if((data.Contents.length -1 )> 0){
							vController.getView().byId("attachmentsTitle").setText("Fault ID: "+faultId+" ("+(data.Contents.length - 1)+" attachments found for this fault)")
						}else{
							vController.getView().byId("attachmentsTitle").setText("Fault ID: "+faultId+" (No attachments found for this fault)")
						}
						filesArr.push(blankImage);
						attachmentModel.setData({
							files: filesArr
						});
						vController.getView().setModel(attachmentModel, "attachments");
						vController.busyIndicator.close();
					}
				}           
			});
		},
		getAttachments: function(vController, faultId) {
			if(vController.getView().getModel("attachments")){
				vController.getView().getModel("attachments").destroy();
				vController.getView().byId("container").destroyTiles();
				vController.getView().byId("container").removeAllTiles();
			}
			var serviceURL = "";
			var attachmentModel = new sap.ui.model.json.JSONModel();
			var filesArr = [];
			var blankImage = {
					"Client": "",
					"Filename": "IconAddImage.png",
					"imageFlag": "X",
					"IvNotification": "",
					"Message": "",
					"Mimetype": "",
					"Qmnum": faultId,
					"SoObjNo": "",
					"src": "tfnswmfs/css/mime/IconAddImage.png",
					"clck": "onPressAdd",
					"removable": false,
					"imgSrc":"tfnswmfs/css/mime/IconAddImage.png",
					"imageType":true
			};
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog()
			}
			vController.busyIndicator.open();
			this.mainDataModel.read("ETS_ATTACHMENT?$filter=Qmnum eq '" + faultId + "'&$format=json", {
				success: function(data, response) {

					for (var i = 0; i < data.results.length; i++) {
						if((/\.(bmp|csv|doc|docx|gif|jpeg|jpg|pdf|png|ppt|pptx|tiff|xls|xlsx|txt)$/i).test(data.results[i].Filename)){
							data.results[i].src = vController.mainDataModel.sServiceUrl + "/ETS_ATTACHMENT(SoObjNo='" + data.results[i].SoObjNo + "',Qmnum='" + data.results[i].Qmnum + "')/$value";
							data.results[i].removable = true;
							if((/\.(bmp|gif|jpeg|jpg|png|tiff|txt)$/i).test(data.results[i].Filename)){
								data.results[i].imgSrc = data.results[i].src;
								data.results[i].imageType = true;
							}else if((/\.(csv|xls|xlsx)$/i).test(data.results[i].Filename)){
								data.results[i].imgSrc = "tfnswmfs/css/mime/XLS_Icon.png";
								data.results[i].imageType = false;
							}else if((/\.(doc|docx)$/i).test(data.results[i].Filename)){
								data.results[i].imgSrc = "tfnswmfs/css/mime/Word_Icon.png";
								data.results[i].imageType = false;
							}if((/\.(pdf)$/i).test(data.results[i].Filename)){
								data.results[i].imgSrc = "tfnswmfs/css/mime/PDF_Icon.png";
								data.results[i].imageType = false;
							}if((/\.(ppt|pptx)$/i).test(data.results[i].Filename)){
								data.results[i].imgSrc = "tfnswmfs/css/mime/PPT_Icon.png";
								data.results[i].imageType = false;
							}
							filesArr.push(data.results[i])
						}
					}
					if(filesArr.length > 0){
						vController.getView().byId("attachmentsTitle").setText("Fault ID: "+faultId+" ("+filesArr.length+" attachments found for this fault)")
					}else{
						vController.getView().byId("attachmentsTitle").setText("Fault ID: "+faultId+" (No attachments found for this fault)")
					}
					filesArr.push(blankImage);
					attachmentModel.setData({
						files: filesArr
					});
					vController.getView().setModel(attachmentModel, "attachments");
					vController.busyIndicator.close();
				},
				error: function(oError) {
					filesArr.push(blankImage);
					attachmentModel.setData({
						files: filesArr
					});
					vController.getView().setModel(attachmentModel, "attachments");
					vController.busyIndicator.close();
				},
			});
		},
		onPressImage: function(oEvent){
			var vController = this;
			var removable = oEvent.getSource().getProperty("removable");
			var url = oEvent.getSource().getProperty("backgroundImage");
			var imageType = oEvent.getSource().getProperty("imageType");
			var docUrl = oEvent.getSource().getProperty("DocUrl");
			if(removable){
				sap.m.URLHelper.redirect(docUrl, true);
			}else{
				vController.uploadDialog(vController);
			}
		},
		getPicture:function(vController,sourceType,faultId,mFSMsg){
			event.preventDefault();
			if (!navigator.camera) {
				sap.m.MessageBox.show(mFSMsg.getProperty("noCamera"), {
					icon: mFSMsg.getProperty("popError"),
					title: mFSMsg.getProperty("popTitleError"),
					actions: sap.m.MessageBox.Action.OK, 
					onClose: function(oAction) {
						return;
					}
				});
				return;
			}
			var options = {	
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: sourceType,      // 0:Photo Library, 1=Camera, 2=Saved Album
					encodingType: 0     // 0=JPG 1=PNG
			};
			navigator.camera.getPicture(
					function(imgData) {
						vController.uploadCapturedImage(vController, "data:image/jpeg;base64,"+imgData,faultId,mFSMsg);
					},
					function() {
						sap.m.MessageBox.show(mFSMsg.getProperty("pictureError"), {
							icon: mFSMsg.getProperty("popError"),
							title: mFSMsg.getProperty("popTitleError"),
							actions: sap.m.MessageBox.Action.OK, 
							onClose: function(oAction) {
								return;
							}
						});
					},
					options);
			return false;
		},
		handleTileDelete: function(evt) {
			var vController = this;
			var tile = evt.getParameter("tile");
			vController.tile = tile;
			var objectId = tile.getProperty("objectId");
			var Filename = tile.getProperty("Filename");
			var faultId = tile.getProperty("Qmnum");
			var removable = tile.getProperty("removable");
			if (removable) {
				// call function to delete
				sap.m.MessageBox.show(this.mFSMsg.getProperty("confirmDeletefile"), {
					icon: this.mFSMsg.getProperty("popWarning"),
					title: this.mFSMsg.getProperty("popTitleValidation"),
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {
							//delete file from odata
							vController.deleteAttachment(vController,faultId,objectId,Filename);
						} else if (oAction === sap.m.MessageBox.Action.NO) {
							//Do nothing
						}
					}
				});

			}
		},

		deleteAttachment:function(vController,faultId,objectId,Filename){
			if(!this.busyIndicator){
				this.busyIndicator = new sap.m.BusyDialog()
			}
			var modal = this;
			modal.busyIndicator.open();
			var oModel =  new sap.ui.model.odata.ODataModel(vController.mainDataModel.sServiceUrl, true);
			if(vController.sapFlag){
				oModel.refreshSecurityToken( function(a, b) {
					oModel.oHeaders = {
							"x-csrf-token" : b.headers["x-csrf-token"],
							"Content-Type" : "application/json; charset=utf-8"};
					oModel.remove("ETS_ATTACHMENT(SoObjNo='"+objectId+"',Qmnum='"+faultId+"')",{
						success : function(data, response){
							modal.busyIndicator.close();
							sap.m.MessageBox.show(Filename+" "+vController.mFSMsg.getProperty("fileDeleted"), {
								icon: vController.mFSMsg.getProperty("popSuccess"),
								title: vController.mFSMsg.getProperty("popTitleSuccess"),
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									vController.getAttachments(vController, vController.faultId);
								}
							});
						},
						error : function(error){
							modal.busyIndicator.close();
							sap.m.MessageBox.show(JSON.parse(error.response.body).error.message.value, {
								icon: vController.mFSMsg.getProperty("popError"),
								title: vController.mFSMsg.getProperty("popTitleError"),
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function(oAction) {
									//Do nothing}
								}
							});
						}
					});
				}, function(a) {

				}, true);	
			}else{
				var params = {
						Bucket: vController.bucket, /* required */
						Key: objectId, /* required */
				};
				var s3 = new AWS.S3();
				s3.deleteObject(params, function(err, data) {
					if (err) { // an error occurred
						//console.log(err, err.stack);
						modal.busyIndicator.close();
						sap.m.MessageBox.show(JSON.parse(error.response.body).error.message.value, {
							icon: vController.mFSMsg.getProperty("popError"),
							title: vController.mFSMsg.getProperty("popTitleError"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
								modal.busyIndicator.close();
							}
						});
					}else{ // successful response
//						console.log(data);
						modal.busyIndicator.close();
						sap.m.MessageBox.show(Filename+" "+vController.mFSMsg.getProperty("fileDeleted"), {
							icon: vController.mFSMsg.getProperty("popSuccess"),
							title: vController.mFSMsg.getProperty("popTitleSuccess"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
								modal.busyIndicator.open();
								vController.getAWSAttachments(vController, vController.faultId);
							}
						});
					}
				});
			}

		},
		uploadCapturedImage:function(vController, imageData,faultId,mFSMsg){
			if(!this.busyIndicator){
				this.busyIndicator = new sap.m.BusyDialog()
			}
			var modal = this;
			modal.busyIndicator.open();
			vController.mainDataModel.refreshSecurityToken( function(a, b) {
				vController.mainDataModel.oHeaders = {
						"x-csrf-token" : b.headers["x-csrf-token"],
						"Content-Type" : "image/jpeg",
						"SLUG":faultId +","+faultId+"_"+vController.getView().getModel("attachments").oData.files.length+",jpeg"
				};
				vController.mainDataModel.create('/ETS_ATTACHMENT',fileTarget,{
					success : function(data, response){
						modal.busyIndicator.close();
						sap.m.MessageBox.show(mFSMsg.getProperty("imageLoaded"),{
							icon: mFSMsg.getProperty("popSuccess"), 
							title: mFSMsg.getProperty("popTitleSuccess"), 
							actions: [sap.m.MessageBox.Action.OK], 
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.OK){
									vController.getAttachments(vController, vController.faultId);
								}
							}
						});

					},
					error : function(error){
						modal.busyIndicator.close();
						sap.m.MessageBox.show(JSON.parse(error.response.body).error.message.value,{
							icon: mFSMsg.getProperty("popError"), 
							title: mFSMsg.getProperty("popTitle"), 
							actions: [sap.m.MessageBox.Action.OK], 
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.OK){
									//for now do nothing and leave it in the same screen
								}
							}
						});
					}
				});
			}, function(a) {

			}, true);
		},
		uploadDialog: function(vController){

			var sUrl = vController.mainDataModel.sServiceUrl+"/ETS_ATTACHMENT";
			var notifNum = vController.faultId;
			if(!vController.busyIndicator){
				vController.busyIndicator = new sap.m.BusyDialog();
			}
			vController.busyIndicator.open();
			var oFU = new sap.ui.unified.FileUploader ({
				uploadUrl : sUrl,  
				name: 'FileUpload',
				buttonText:'Browse',
				width: "89%",
				fileType: "bmp,BMP,csv,CSV,doc,DOC,docx,DOCX,gif,GIF,jpeg,JPEG,jpg,JPG,pdf,PDF,png,PNG,ppt,PPT,pptc,PPTX,tiff,TIFF,xls,XLS,xlsx,XLSX",
				useMultipart: false, 
				sendXHR: true,
				maximumFilenameLength: 50,
				filenameLengthExceed: function(oEvent){
					var upldCntnt = this;
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show("Filename length cannot be more than 50 characters",sap.m.MessageBox.Icon.ERROR ,"Error" , sap.m.MessageBox.Action.OK, function() {
						upldCntnt.oFileUpload.value = "";
					});
					vController.busyIndicator.close();
				},
				typeMissmatch: function(oEvent){
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show("File with extension " + oEvent.getParameter("fileType").toUpperCase()+ " is not allowed. Allowed extensions are: JPG, PNG, PDF XLS, XLSX, DOC, DOCX, PPT, PPTX, GIF, TIFF",sap.m.MessageBox.Icon.ERROR ,"Error" , sap.m.MessageBox.Action.OK, function() { });
					vController.busyIndicator.close();
				},
				uploadOnChange: false,
				uploadComplete: function(oEvent)
				{
					vController.busyIndicator.close();
					if(oEvent.getParameter("status") === 201){
						sap.m.MessageBox.show(vController.mFSMsg.getProperty("fileLoaded"), {
							icon: vController.mFSMsg.getProperty("popSuccess"),
							title: vController.mFSMsg.getProperty("popTitleSuccess"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
								vController.getAttachments(vController, vController.faultId);
							}
						});
					}else{
						sap.m.MessageBox.show(vController.mFSMsg.getProperty("fileUploadFail"), {
							icon: vController.mFSMsg.getProperty("popError"),
							title: vController.mFSMsg.getProperty("popTitleError"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction) {
								vController.getAttachments(vController, vController.faultId);
							}
						});
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
				        		  if(vController.sapFlag){
				        			  var oModel =  new sap.ui.model.odata.ODataModel(vController.mainDataModel.sServiceUrl, true)
				        			  oModel.refreshSecurityToken( function(a, b) {
				        				  var token = b.headers["x-csrf-token"];
				        				  var a= oFU.getValue();
				        				  var x = a.split(".");
				        				  var ext=x[x.length-1];
				        				  var func = notifNum;
				        				  oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "slug", value: func+","+x[0]+","+ext}));  
				        				  oFU.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({name: "X-CSRF-Token", value: token }));
				        				  // call the upload method
				        				  oFU.upload();
				        			  }, function(a) {

				        			  }, true);
				        		  }else{ // when legacy fault upload to AWS
				        			  var fileName = oFU.getValue();
				        			  var f = sap.ui.getCore().byId(oFU.getId()).oFileUpload.files[0];
				        			  var params2 = {
				        					  Bucket: vController.bucket, /* required */
				        					  Key:vController.faultId+"/"+fileName,
				        					  ACL:"public-read-write",
				        					  Body:f,
				        			  };
				        			  var s3 = new AWS.S3();
				        			  s3.putObject(params2, function (err, res) {
				        				  if (err) {
				        					  modal.busyIndicator.close();
//				        					  console.log("Error uUploading the file", err);
				        					  sap.m.MessageBox.show(vController.mFSMsg.getProperty("fileUploadFail"), {
				        						  icon: vController.mFSMsg.getProperty("popError"),
				        						  title: vController.mFSMsg.getProperty("popTitleError"),
				        						  actions: [sap.m.MessageBox.Action.OK],
				        						  onClose: function(oAction) {
				        							  vController.getAttachments(vController, vController.faultId);
				        						  }
				        					  });
				        				  } else {
				        					  vController.busyIndicator.close();
				        					  sap.m.MessageBox.show(vController.mFSMsg.getProperty("fileLoaded"), {
				        						  icon: vController.mFSMsg.getProperty("popSuccess"),
				        						  title: vController.mFSMsg.getProperty("popTitleSuccess"),
				        						  actions: [sap.m.MessageBox.Action.OK],
				        						  onClose: function(oAction) {
				        							  vController.getAttachments(vController, vController.faultId);
				        						  }
				        					  });
				        				  }
				        			  });
//				        			  console.log("here in aws upload");
				        		  }
				        		  modal.busyIndicator.close();
				        		  vController.dialog.close();
				        	  }
				          })
				          ,
				          new sap.m.Button({
				        	  text : "Cancel",
				        	  press : function(
				        			  evt) {
				        		  vController.dialog.close();
				        		  vController.busyIndicator.close();
				        	  }
				          })
				          ],
			});
			this.dialog = dialog;
			this.dialog.open();
			vController.busyIndicator.close();
		},
/*		getStoreItem:function(vController,key){
			vController.awsStore.getItem(key, function(value) {
				return value;
            }, function(errorInfo){
            	console.log("Errored ="+JSON.stringify(errorInfo));
            	return null;
            });
		},
		getStoreItems:function(vController){
			var awsData = {
					userName:"",
					accessKey:"",
					secureKey:"",
					bucketName:"",
					tnBucketName:""
			};
			if(vController.getStoreItem(vController,"userName")){
				
			}else{
				vController.createEncryptStore();
			}
		},
		createEncryptStore: function(){
			var  vController = this;
			vController.awsStore = new sap.EncryptedStorage(storeName);
		}, */
		
	});
});