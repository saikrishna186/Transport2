sap.ui.controller(
				"worklog.myCurrentWork",
				{

					/**
					 * Called when a controller is instantiated and its View
					 * controls (if available) are already created. Can be used
					 * to modify the View before it is displayed, to bind event
					 * handlers and do other one-time initialization.
					 * 
					 * @memberOf fltmgmt.myCurrentWork
					 */
					getMyWorklog : function(data) {
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData({
							current_work : data.results
						});
						this.getView().oTable.setModel(oModel);
						var oTemplate = this.getView().oTemplate;
						this.getView().oTable.bindItems("/current_work",
								oTemplate);
					},
					selectValue : function(Evt) {
						this.source.setValue(Evt.getParameters().listItem
								.getTitle());
						this.source.list.close();

					},
					openCarPopup : function(source) {

						this.source = source;
						var controller = this;
						if (!source.list) {

							var list = new sap.m.ResponsivePopover({
								placement : sap.m.PlacementType.Right,
								title : "Select Car",
								content : [],
								width : "200px",
								height : "300px"
							});
							source.list = list;
							var oModel = this.getView().oTable.getModel();
							var sModel = new sap.ui.model.json.JSONModel();
							var str = {
								xA : []
							};
							var array = [];
							for (var i = 0; i < (oModel.getData().current_work.length); i++) {
								array
										.push(oModel.getData().current_work[i].Zzcarid);
							}
							var unique = {
								obj : []
							};
							for (var i = 0; i < array.length; i++) {
								if (unique.obj.indexOf(array[i]) == -1) {
									unique.obj.push(array[i]);
								}
							}
							str.xA.push(unique);
							sModel.setData(unique);

							var optionList = new sap.m.List({
								mode : sap.m.ListMode.SingleSelectMaster,
								includeItemInSelection : true,
								select : function(evt, source) {
									controller.selectValue(evt);
								},
								width : "100%",
								height : "100%"
							});
							this.carList = optionList;
							optionList.setModel(sModel);
							var listDesc = new sap.m.StandardListItem({
								title : "{}",
							});

							optionList.bindItems("/obj", listDesc); // adding
							// model
							// data to
							// list

							source.list.addContent(optionList);

						}

						source.list.openBy(source);

					},
					openSetPopup : function(source) {

						this.source = source;
						var controller = this;
						if (!source.list) {

							var list = new sap.m.ResponsivePopover({
								placement : sap.m.PlacementType.Right,
								title : "Select Set",
								content : [],
								width : "200px",
								height : "300px"
							});
							source.list = list;
							var oModel = this.getView().oTable.getModel();
							var sModel = new sap.ui.model.json.JSONModel();
							var str = {
								xA : []
							};
							var array = [];
							for (var i = 0; i < (oModel.getData().current_work.length); i++) {
								array
										.push(oModel.getData().current_work[i].Zzsetid);
							}
							var unique = {
								obj : []
							};
							for (var i = 0; i < array.length; i++) {
								if (unique.obj.indexOf(array[i]) == -1) {
									unique.obj.push(array[i]);
								}
							}
							str.xA.push(unique);
							sModel.setData(unique);
							var optionList = new sap.m.List({
								mode : sap.m.ListMode.SingleSelectMaster,
								includeItemInSelection : true,
								select : function(evt, source) {
									controller.selectValue(evt);
								},
								width : "100%",
								height : "100%"
							});
							this.setList = optionList;
							optionList.setModel(sModel);
							var listDesc = new sap.m.StandardListItem({
								title : "{}",
							});
							
							optionList.bindItems("/obj", listDesc); // adding
							// model
							// data to
							// list

							source.list.addContent(optionList);

						}

						source.list.openBy(source);

					},
					applyFilter : function() {
						var view = this.getView();
						var car = view.carInput.getValue();
						var set = view.setNum.getValue();
						view.data("clearedCar", car);
						view.data("clearedSet", set);
						if (!this.check) {
							if ((car != "") && (set == "")) {
								var filterCar = new sap.ui.model.Filter(
										"Zzcarid",
										sap.ui.model.FilterOperator.EQ, car);
								var binding = this.getView().oTable
										.getBinding("items");
								binding.filter(filterCar);
								//this.getView().filterButton.setIcon("sap-icon://add-filter");
								this.getView().filterButton.setText("Filtered By Car");
							} else if ((car == "") && (set != "")) {
								var filterSet = new sap.ui.model.Filter(
										"Zzsetid",
										sap.ui.model.FilterOperator.EQ, set);
								var binding = this.getView().oTable
										.getBinding("items");
								binding.filter(filterSet);
								//this.getView().filterButton.setIcon("sap-icon://add-filter");
								this.getView().filterButton.setText("Filtered By Set");
							} else if ((car != "") && (set != "")) {
								var filterCar = new sap.ui.model.Filter(
										"Zzcarid",
										sap.ui.model.FilterOperator.EQ, car);
								var filterSet = new sap.ui.model.Filter(
										"Zzsetid",
										sap.ui.model.FilterOperator.EQ, set);
								var allFilter = new sap.ui.model.Filter([
										filterCar, filterSet ], true);
								var binding = this.getView().oTable
										.getBinding("items");
								binding.filter(allFilter);
								//this.getView().filterButton.setIcon("sap-icon://add-filter");
								this.getView().filterButton.setText("Filtered By Car & Set");
							} else if ((car == "") && (set == "")) {
								var controller = this;
								currentWorkList(controller.getMyWorklog,
										controller);
								//this.getView().filterButton.setIcon("sap-icon://filter");
								this.getView().filterButton.setText("Add Filter");
							}
							this.check = false;

						}
						this.closeFilterDialog();
					},
					onItemSelect : function(evt) {
						var appView = this.getView().getViewData();
						var app = appView.app;
						var view = this.getView();
						if (this.getView().dateTime.getValue() == "") {
							this.mandatory = false;
							jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox
									.show(
											"Please enter Shift Start Date/Time to proceed ",
											sap.m.MessageBox.Icon.ERROR,
											"Validation",
											sap.m.MessageBox.Action.OK,
											function() {
												view.dateTime
														.setValueState("Error");
											});

						} else {
							this.mandatory = true;
							view.dateTime.setValueState("Success");
						}
						var oTable = this.getView().oTable;
						var contexts = oTable.getSelectedContexts();
						var oItem = contexts.map(function(c) {
							return c.getObject();
						});
						var controller = this;
						var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
						var dateNow = new Date();
						nowMilliseconds = dateNow.getTime();
						var n = new Date(nowMilliseconds - TZOffsetMs);
						var nowMilli = n.getTime();
						var shiftDateTime = new Date(
								controller.getView().dateTime.getDateValue());
						var z = new Date(shiftDateTime.getTime() - TZOffsetMs);
						var shiftTimeMilli = z.getTime();
						if (nowMilli - shiftTimeMilli >= 45000000) {
							this.mandatory = false;
							jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox
									.show(
											"More than 12.5 hours since the start of the shift have passed. Contact the supervisor to confirm time on your behalf.",
											sap.m.MessageBox.Icon.ERROR,
											"Validation",
											sap.m.MessageBox.Action.OK,
											function() {
											});
						} else {
							this.mandatory = true;
						}
						for (var k = 0; k < oItem.length; k++) {
							var hour = shiftDateTime.getHours(); // get hours
							// from the
							// date
							// value
							var minutes = shiftDateTime.getMinutes(); // get
							// minutes
							// from
							// the
							// date
							// value
							var seconds = shiftDateTime.getSeconds();
							var check = oItem[k].ZztaskCmpltd;
							var data = {}; // data object
							data.d = {};
							data.d.IvUserid = "";
							data.d.ZzwoNo = oItem[k].ZzwoNo;
							data.d.ZzoperationNo = oItem[k].ZzoperationNo;
							data.d.Zzltxa1 = oItem[k].Zzltxa1;
							data.d.Zzsetid = oItem[k].Zzsetid;
							data.d.Zzcarid = oItem[k].Zzcarid;
							data.d.ZzshiftStartDate = "\\/Date("
									+ shiftTimeMilli + ")\\/";
							data.d.ZzshiftStartTime = "PT" + hour + "H"
									+ minutes + "M" + seconds + "S";
							data.d.ZzactualDuration = oItem[k].ZzactualDuration;
							data.d.ZzworkStatus = oItem[k].ZzworkStatus;
							if (check) {
								data.d.ZztaskCmpltd = "X";
							} else {
								data.d.ZztaskCmpltd = "";
							}
							if (this.mandatory) {
								submitWorkLog(data, this, oItem.length);
							}

						}

					},
					setArrayValues : function(data, length) {
						this.fALength++;

						this.finalarray.push(data);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData({
							listitems : this.finalarray
						});
						if (this.fALength === length) {
							var tableDialog = this.getView().oTable_create;

							var woNum = new sap.m.Text({
								text : "{ZzwoNo}"
							});
							var oMessage = new sap.m.Text({
								text : "{Zzmessage}"
							});
							var operationNum = new sap.m.Text({
								text : "{ZzoperationNo}"
							});
							var oType = new sap.ui.core.Icon({
								src : "sap-icon://status-positive",
								color : {
									parts : [ {
										path : "ZzmsgType"
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
							oRow.addCell(oType).addCell(oMessage)
									.addCell(woNum).addCell(operationNum);
							tableDialog.setModel(oModel);
							tableDialog.bindItems("/listitems", oRow);
							this.openDialog();
						}
					},
					openDialog : function() {

						var createNotification = this.getView().createNotification;

						if (!this.createNotification) {

							this.createNotification = createNotification;
						}
						this.createNotification.open();
					},
					closeDialog : function(evt) {

						var createNotification = this.getView().createNotification;
						this.createNotification.close();
						this.finalarray = [];
						this.fALength = 0;
						var controller = this;
						currentWorkList(controller.getMyWorklog, controller);

					},
					closeFilterDialog : function(evt) {

						var filterDialog = this.getView().filterDialog;
						this.filterDialog.close();
						
						/*var car = this.getView().carInput.getValue();
						var set = this.getView().setNum.getValue();
						if($.trim(car).length <= 0 && $.trim(set).length <= 0)
							this.getView().filterButton.setIcon("sap-icon://filter");*/
					},
					cancelFilterDialog : function(evt) {

						var filterDialog = this.getView().filterDialog;
						var view = this.getView();
						// Get Current values
						var car = view.carInput.getValue();
						var set = view.setNum.getValue();
						// Get previous values
						var prevCar = view.data("clearedCar");
						var prevSet = view.data("clearedSet");
						// Set back the values if removed and clicked cancel
						view.carInput.setValue(prevCar);
						view.setNum.setValue(prevSet);
						this.filterDialog.close();
						

						if($.trim(prevCar).length <= 0 && $.trim(prevSet).length <= 0)
							//this.getView().filterButton.setIcon("sap-icon://filter");
							this.getView().filterButton.setText("Add Filter");
					},					
					filterData : function() {
						var filterDialog = this.getView().filterDialog;

						if (!this.filterDialog) {

							this.filterDialog = filterDialog;
						}
						this.filterDialog.open();
					},
					clearCarData : function() {
						var view = this.getView();
						view.data("clearedCar", view.carInput.getValue());
						view.carInput.setValue("");
					},
					clearSetData : function() {
						var view = this.getView();
						view.data("clearedSet", view.setNum.getValue());
						view.setNum.setValue("");
					},
					openNotif: function(evt){
					//	window.open("http://localhost:52672/Zfault_mgmt_tdy/index.html?queryFaultNo="+evt.getSource().getBindingContext().getProperty().Zznotif,"_blank");
					//	window.open("https://"+location.host+"/sap/bc/bsp/sap/zfault_mgmt/webcontent/index.html?queryFaultNo="+evt.getSource().getBindingContext().getProperty().Zznotif,"_blank");
                        var vRouter = this.getView().getViewData().getRouter();
                        vRouter.navTo("Update",{
                            faultId:evt.getSource().getBindingContext().getProperty().Zznotif,
                            fromView:"myWorkList"
                            },true);
					},
					onInit : function() {
						this.check = false;
						var controller = this;
                        this.router = sap.ui.core.UIComponent.getRouterFor(this);
						currentWorkList(controller.getMyWorklog, controller);
						//this.getView().filterButton.setText("Apply Filter");
						//this.getView().filterButton
						//		.setIcon("sap-icon://filter");
						this.getView().filterButton.setText("Add Filter");
						this.finalarray = [];
						this.fALength = 0;
						this.mandatory = true;
						var now = new Date();
						this.getView().dateTime.setDateValue(now);
					},
					toTileHome:function(evt)
					{
						var view = this.getView();
						var app = view.getViewData().app;
						app.to("tileHome");
						
					},
					
				/**
				 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
				 * (NOT before the first rendering! onInit() is used for that one!).
				 * @memberOf fltmgmt.myCurrentWork
				 */
				//	onBeforeRendering: function() {
				//	},
				/**
				 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
				 * This hook is the same one that SAPUI5 controls get after being rendered.
				 * @memberOf fltmgmt.myCurrentWork
				 */
				//	onAfterRendering: function() {
				//	},
				/**
				 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
				 * @memberOf fltmgmt.myCurrentWork
				 */
				//	onExit: function() {
				//	}
				});