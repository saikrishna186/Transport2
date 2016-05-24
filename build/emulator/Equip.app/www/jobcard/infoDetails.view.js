sap.ui.jsview("tfnswjobcard.infoDetails", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf tfnswjobcard.infoDetails
	*/ 
	getControllerName : function() {
		return "tfnswjobcard.infoDetails";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf tfnswjobcard.infoDetails
	*/ 
	createContent : function(oController) {
			this.addStyleClass("whiteBackground");
			this.controller = oController;

			var oLayout1 = new sap.ui.layout.form.ResponsiveGridLayout({
				emptySpanL: 1,
				emptySpanM: 1,
				emptySpanS: 1,
				labelSpanL: 5,
				labelSpanM: 5,
				labelSpanS: 5,
				columnsL: 2,
				columnsM: 2,
				breakpointL: 800,
				breakpointM: 400
			});
			
			var taskCode = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/TaskCode}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var subject = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/Subject}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var skillInspect = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/SkillInsp}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var skillRepairs = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/SkilRepair}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var carType = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/CarType}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var system = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				value : "{/Zzsystem}",
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var safetyCritical = new sap.m.HBox({
				alignItems : sap.m.FlexAlignItems.Center,
//				justifyContent : sap.m.FlexJustifyContent.Center,
				visible : {
					parts : [{path : "/Safety"}],
					formatter : function(mp){
					
					if(mp && mp.toUpperCase() == "X"){
						return true
					}	
					else
						return false
					}
				},
				items : [
				                     
				                      new sap.m.Text({
				                    	  text : ""
				                      })
				         
				         ]
			
			});
			var dummy1 = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			var dummy2 = new sap.m.Input({
				layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
					weight: 1,
				}),
				enabled : true,
				editable : false,

			}).addStyleClass("disabledInput");
			
			var operationalCritical = new sap.m.HBox({
				alignItems : sap.m.FlexAlignItems.Center,
//				justifyContent : sap.m.FlexJustifyContent.Center,
				visible : {
					parts : [{path : "/Oper"}],
					formatter : function(mp){
					
					if(mp && mp.toUpperCase() == "X"){
						return true
					}	
					else
						return false
					}
				},
				items : [

				                      new sap.m.Text({
				                    	  text : ""
				                      })
				         
				         ]
			
			});
			
			
			
			var oForm1 = new sap.ui.layout.form.Form({
				//title : new sap.ui.core.Title({
				//text : "Work Order Info",
				//tooltip : "Title tooltip"
				//}),
				layout: oLayout1,
				editable : true,
				formContainers: [
					new sap.ui.layout.form.FormContainer({
						formElements: [
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "Task Code",
									layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
										weight: 2
									})
								}),
								fields: [taskCode]
							}),
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "Subject",
									layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
										weight: 2
									})
								}),
								fields: [subject]
							}),
							new sap.ui.layout.form.FormElement({
								label: "Skill inspect",
								fields: [ skillInspect]
							}),
							new sap.ui.layout.form.FormElement({
								label: "Skill Repair",
								fields: [skillRepairs]
							})
						],
						layoutData: new sap.ui.core.VariantLayoutData({
							multipleLayoutData: [
								new sap.ui.layout.ResponsiveFlowLayoutData({
									linebreak: true,
									//minWidth: 150
									minWidth:30
								}),
								new sap.ui.layout.form.GridContainerData({
									halfGrid: true
								}),
								new sap.ui.layout.GridData({
									linebreakL: true
								})
							]
						})
					}),
					new sap.ui.layout.form.FormContainer({
						formElements: [
							new sap.ui.layout.form.FormElement({
								label: "Car Type",
								fields: [carType],
								layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
									linebreak: true,
									margin: false
								})
							}),
							new sap.ui.layout.form.FormElement({
								label: "System",
								fields: [system ],
								layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
									linebreak: true,
									margin: false
								})
							}),
							new sap.ui.layout.form.FormElement({
								label: "Safety Critical",
								fields: [	 new sap.ui.core.Icon({
			                          src: "sap-icon://notification",
			                          size: "2em",
			          				visible : {
			        					parts : [{path : "/Safety"}],
			        					formatter : function(mp){
			        					
			        					if(mp && mp.toUpperCase() == "X"){
			        						return true
			        					}	
			        					else
			        						return false
			        					}
			        				},
//			                          press: function (evt) {
//			                                oController.showLongText(this)
//			                               },
			                            // width : "10%",
			                          color: "red",
//			                          hoverColor: "gray",
			                          // activeColor : "white",
//			                            backgroundColor: "white",
//			                           hoverBackgroundColor: "white",
			                           layoutData: new sap.m.FlexItemData({
			                           styleClass: "criticalIcon"
			                         }),
			                          // activeBackgroundColor : "#91d300",
			                      }).addStyleClass("formIcon"),
			                      dummy1
			                      ]
							}),
							new sap.ui.layout.form.FormElement({
								label: new sap.m.Label({
									text: "Operational Critical",
									layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({
										weight: 2
									})
								}),
								fields: [ 
					                      new sap.ui.core.Icon({
					                          src: "sap-icon://notification",
					                          size: "2em",
					          				visible : {
					        					parts : [{path : "/Oper"}],
					        					formatter : function(mp){
					        					
					        					if(mp && mp.toUpperCase() == "X"){
					        						return true
					        					}	
					        					else
					        						return false
					        					}
					        				},
//					                          press: function (evt) {
//					                                oController.showLongText(this)
//					                               },
					                            // width : "10%",
					                          color: "red",
//					                          hoverColor: "gray",
					                          // activeColor : "white",
//					                            backgroundColor: "white",
//					                           hoverBackgroundColor: "white",
					                           layoutData: new sap.m.FlexItemData({
					                           styleClass: "criticalIcon"
					                         })
					                          // activeBackgroundColor : "#91d300",
					                      }).addStyleClass("formIcon"),
					                      dummy2
								 ]
							})
						],
						layoutData: new sap.ui.core.VariantLayoutData({
							multipleLayoutData: [
								new sap.ui.layout.form.GridContainerData({
									halfGrid: true
								}),
								new sap.ui.layout.ResponsiveFlowLayoutData({
									//minWidth: 150
									minWidth:30
								}),
								new sap.ui.layout.GridData({
									linebreakL: false
								})
							]
						})
					})
				]
			}).addStyleClass("taskInformationForm");
			
			oForm1.setLayout(oLayout1);
			
			var taskDetailModel= new sap.ui.model.json.JSONModel();
			oForm1.setModel(taskDetailModel);
			this.taskHeader = oForm1;
	
		
			var textBox = new sap.m.TextArea({
				id : "textInfo",
				width : "100%",
				enabled: false,
//				height: "50%",
//				maxLength: 800,
//				wrapping : "Soft",
				rows: 25,
//				value: lines,
				liveChange: function(evt)
				{
					// oController.getDescription();
				}}).addStyleClass("taskLongText");
		    this.textBox = textBox;
		 // Change Req #1919 Rollback the engineering form changes. Comment out the lines 
		/*	var docRows = new sap.m.StandardListItem({
				title:"{docName}",
				type:"Active",
				//selected: true,
				icon: "sap-icon://document",
			});
			this.docRows = docRows;
			var jsonModel = new sap.ui.model.json.JSONModel();
			
			var docList = new sap.m.List({
				headerText:"",
				includeItemInSelection: true,
				mode: sap.m.ListMode.SingleSelectMaster,
				showUnread: true,
				items:[],
				itemPress : function(evt){
					oController.openLink(evt);
				}
			});	
			
			this.docList = docList;
			docList.setModel(jsonModel);
			docList.bindItems("/",docRows);
			*/
			var detailsPanel =  new sap.ui.commons.Panel({
				width: "95%",
				height : "90%",
				showCollapseIcon: false,
				//content: [oForm1,textBox, linkedUrlTable]
				//Change Req #1919 Rollback the engineering form changes. Comment out the lines 
				//content: [oForm1,textBox, docList]
				content: [oForm1,textBox]
			}).addStyleClass("taskInfoLayout");
			detailsPanel.setTitle(new sap.ui.core.Title({ icon: "sap-icon://message-information", text : "Task information"
//				text: {			
//				parts :[{path : "/FormData/Orderid"}],
//				formatter : function(Orderid){	
//					return "Work Order Detail # "+Orderid; 	
//				}
//			
//			}
			}));
			
			var attachments = new sap.m.Button({
				text: "",
				press: function(evt){
					oController.showAttachments(evt)
				}
			});	
			this.attachments = attachments;
 		return new sap.m.Page({
 			enableScrolling: false,
			title: "Task Information",
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
//                                                       text: "Task Information"
                                                   }).addStyleClass("pageTitle")
                               ],
                               contentRight: [      ]
                           })],
        		footer : new sap.m.Bar({
				contentLeft : [
				               this.attachments
								],
								contentRight : [
	
										                ]
												}),
			content: [detailsPanel]
		});
	}

});