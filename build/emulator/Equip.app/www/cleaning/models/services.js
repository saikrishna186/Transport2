//var sServiceUrl = "/sap/opu/odata/sap/ZGWP_PM_WASH_UI_SRV";
//var sUrl = "/sap/opu/odata/sap/ZGWP_PM_FAULT_MANAGE_SRV";
function getMatF4Data(callback, callbackObject) {
  var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
	var oModel = new sap.ui.model.json.JSONModel();
	sap.ui.core.BusyIndicator.show();
	var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
	mModel.read('/ETS_CLEAN_LOC', {
		success : function(odata, response) {
			sap.ui.core.BusyIndicator.hide();
			callback.call(callbackObject, odata);

		},
		error : function(error) {
			sap.ui.core.BusyIndicator.hide();
			sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
		}
	})

};
function getSetF4Data(callback, callbackObject) {
	var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
	var oModel = new sap.ui.model.json.JSONModel();
	sap.ui.core.BusyIndicator.show();
	var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
	mModel.read('/ETS_SETID', {
		success : function(odata, response) {
			sap.ui.core.BusyIndicator.hide();
			callback.call(callbackObject, odata);

		},
		error : function(error) {
			sap.ui.core.BusyIndicator.hide();
			sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
		}
	})

};
function getCarsOnSet(set, callback, callbackObject){
	var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
	var oModel = new sap.ui.model.json.JSONModel();
	sap.ui.core.BusyIndicator.show();
	var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
	mModel.read("/ETS_CAR_SETID?$filter=IvSetid eq '"+set+"'", {
		success : function(odata, response) {
			sap.ui.core.BusyIndicator.hide();
			callback.call(callbackObject, odata);

		},
		error : function(error) {
			sap.ui.core.BusyIndicator.hide();
			sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
		}
	})

	};
	function getCleanedByF4Data(callback, callbackObject) {
		var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.core.BusyIndicator.show();
		var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
		mModel.read('/ETS_CLEANBY', {
			success : function(odata, response) {
				sap.ui.core.BusyIndicator.hide();
				callback.call(callbackObject, odata);

			},
			error : function(error) {
				sap.ui.core.BusyIndicator.hide();
				sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
			}
		})

	};
	function getGraffitiTypes(callback, callbackObject) {
		var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.core.BusyIndicator.show();
		var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
		mModel.read('/ETS_GRAF_TYP', {
			success : function(odata, response) {
				sap.ui.core.BusyIndicator.hide();
				callback.call(callbackObject, odata);

			},
			error : function(error) {
				sap.ui.core.BusyIndicator.hide();
				sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
			}
		});

	};
	function getfaults(car, callback, callbackObject) {
		var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
		sap.ui.core.BusyIndicator.show();
		var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
		mModel.read("/ETS_NOTIF_LIST?$filter=IvCar eq '"+car+"'", {
			success : function(odata, response) {
				sap.ui.core.BusyIndicator.hide();
				callback.call(callbackObject, odata);

			},
			error : function(error) {
				sap.ui.core.BusyIndicator.hide();
				sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
			}
		});

	};
	function getCleanType(loc, set, callback, callbackObject) {
		var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.core.BusyIndicator.show();
		var mModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
		mModel.read("/ETS_CLEAN_TYPE?$filter=IvCleanloc eq '"+loc+"' and IvSetid eq '"+set+"'", {
			success : function(odata, response) {
				sap.ui.core.BusyIndicator.hide();
				callback.call(callbackObject, odata);

			},
			error : function(error) {
				sap.ui.core.BusyIndicator.hide();
				sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
			}
		});

	};
	function createFault(d, callback, callbackObject){
		var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
		sap.ui.core.BusyIndicator.show();
		var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);

		oModel.create('/ETS_NOTIF_CREATE_GRAFFITI', 
				d, 
				null, 
				function(odata, response) { 
					sap.ui.core.BusyIndicator.hide();
					callback.call(callbackObject, odata);
				}, 
				function(error) { 
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show('Failed to Create Fault Notification');
					sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
				} 
		);
		};
		function closeFault(d, callback, callbackObject){
			var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
			sap.ui.core.BusyIndicator.show();
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);

			oModel.create('/ETS_NOTIF_HEAD', 
					d, 
					null, 
					function(odata, response) { 
						sap.ui.core.BusyIndicator.hide();
						callback.call(callbackObject, odata);
					}, 
					function(error) { 
						sap.ui.core.BusyIndicator.hide();
						sap.m.MessageToast.show('Failed to Create Fault Notification');
						sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					} 
			);
			};
		//To remove attachments from the list
		function removeDocList(notifNum, docValue, callback, callbackObject) {
				var cleaning_sUrl  = applicationContext.applicationEndpointURL + "/ZGWP_PM_FAULT_MANAGE_SRV";
			sap.ui.core.BusyIndicator.show();
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sUrl);
			oModel.read("/ETS_DELETE_ATTACH(IvDel='X',IvKey='" + notifNum
					+ "',IvSoObjNo='" + docValue + "',IvType='N')", {
				success : function(odata, response) {
					sap.ui.core.BusyIndicator.hide();
					callback.call(callbackObject, odata);
				},
				error : function(error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});

				}
			});

		};
		//To get the attachment list
		function getDocList(notifNum, callback, callbackObject) {
				var cleaning_sUrl  = applicationContext.applicationEndpointURL + "/ZGWP_PM_FAULT_MANAGE_SRV";
			sap.ui.core.BusyIndicator.show();
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sUrl);
			oModel.read("/ETS_GET_ATTACHMENTS_IN?$filter=IvKey eq'" + notifNum
					+ "' and IvNotification eq 'X'&$expand=NAV_GET_ATT_LIST", {
				success : function(odata, response) {
					sap.ui.core.BusyIndicator.hide();
					callback.call(callbackObject, odata);
				},
				error : function(error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});

				}
			});
		};
		function getCarsOnCleanType(postData, controller) {
			var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
			if (!this.busyIndicator) {

				this.busyIndicator = new sap.m.BusyDialog()
			}

			var modal = this;
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
			var rModel = new sap.ui.model.json.JSONModel();
			modal.busyIndicator.open();
			oModel.refreshSecurityToken(function(a, b) {
				oModel.oHeaders = {
					"x-csrf-token" : b.headers["x-csrf-token"],
					"Content-Type" : "application/json; charset=utf-8",
					"accept" : "application/json",
					"dataType" : "json",

				};
				oModel.create('/ETS_CAR_CLEANTYPE', postData, {
					success : function(data, response) {
						modal.busyIndicator.close();
						controller.handleResponse(data);
					},
					error : function(error) {
						modal.busyIndicator.close();
						sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					}
				});
			}, function(a) {
				successFaultCallBack.apply(context, [ a, true ]);
			}, true);

		};
		function cleanTabPost(postData, controller) {
			var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
			if (!this.busyIndicator) {

				this.busyIndicator = new sap.m.BusyDialog()
			}

			var modal = this;
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
			var rModel = new sap.ui.model.json.JSONModel();
			modal.busyIndicator.open();
			oModel.refreshSecurityToken(function(a, b) {
				oModel.oHeaders = {
					"x-csrf-token" : b.headers["x-csrf-token"],
					"Content-Type" : "application/json; charset=utf-8",
					"accept" : "application/json",
					"dataType" : "json",

				};
				oModel.create('/ETY_CONFIRM_INPUTSet', postData, {
					success : function(data, response) {
						modal.busyIndicator.close();
						controller.handleCleanTabPost(data);
					},
					error : function(error) {
						modal.busyIndicator.close();
						sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					}
				});
			}, function(a) {
				successFaultCallBack.apply(context, [ a, true ]);
			}, true);

		};
	
		function closeFaults(postData, controller) {
			var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
			if (!this.busyIndicator) {

				this.busyIndicator = new sap.m.BusyDialog()
			}

			var modal = this;
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
			var rModel = new sap.ui.model.json.JSONModel();
			modal.busyIndicator.open();
			oModel.refreshSecurityToken(function(a, b) {
				oModel.oHeaders = {
					"x-csrf-token" : b.headers["x-csrf-token"],
					"Content-Type" : "application/json; charset=utf-8",
					"accept" : "application/json",
					"dataType" : "json",

				};
				oModel.create('/ETS_NOTIF_HEAD', postData, {
					success : function(data, response) {
						modal.busyIndicator.close();
						controller.handleCloseResponse(data);
					},
					error : function(error) {
						modal.busyIndicator.close();
						sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					}
				});
			}, function(a) {
				successFaultCallBack.apply(context, [ a, true ]);
			}, true);

		};
		function measurePtPost(postData, controller) {
			var cleaning_sServiceUrl = applicationContext.applicationEndpointURL + "/ZGWP_PM_WASH_UI_SRV";
			if (!this.busyIndicator) {

				this.busyIndicator = new sap.m.BusyDialog()
			}

			var modal = this;
			var oModel = new sap.ui.model.odata.ODataModel(cleaning_sServiceUrl, true);
			var rModel = new sap.ui.model.json.JSONModel();
			modal.busyIndicator.open();
			oModel.refreshSecurityToken(function(a, b) {
				oModel.oHeaders = {
					"x-csrf-token" : b.headers["x-csrf-token"],
					"Content-Type" : "application/json; charset=utf-8",
					"accept" : "application/json",
					"dataType" : "json",

				};
				oModel.create('/ETS_MEASUREMENT_RETURN', postData, {
					success : function(data, response) {
						modal.busyIndicator.close();
						controller.handleMeasurementResponse(data);
					},
					error : function(error) {
						modal.busyIndicator.close();
						sap.m.MessageBox.alert(error, {title : "Error", icon: sap.m.MessageBox.Icon.ERROR});
					}
				});
			}, function(a) {
				successFaultCallBack.apply(context, [ a, true ]);
			}, true);

		};
		

