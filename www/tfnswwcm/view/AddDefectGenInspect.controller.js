jQuery.sap.require("tfnswequip.tfnswwcm.util.formatter");
sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.AddDefectGenInspect", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onSave: function() {
			//this._oDialog.destroy();
			var controller =this;
			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var dialogData = this.getView().getModel().getData();
			var duplicateFlag =false ;
//			Fix to get text from dorop down which isn't working in IOS
			var defectTypeText = this.getView().byId("defectType").getValue();
			var defectClassText = this.getView().byId("defectClass").getValue();
			if(!dialogData.DefectTypeText || dialogData.DefectTypeText === "" || dialogData.DefectTypeText === " "){
				dialogData.DefectTypeText = defectTypeText
			}
			if(!dialogData.DefectClassText || dialogData.DefectClassText === "" || dialogData.DefectClassText === " "){
				dialogData.DefectClassText = defectClassText
			}
//			End of Fix
			if(dialogData.DefectTypeKey != "" && dialogData.DefectClassKey != ""){		

				for(var i = 0 ; i< mainData.wheelsData.length; i++){
					if(mainData.wheelsData[i].WheelNumber == dialogData.WheelNo){
						if(mainData.wheelsData[i].DefectperWheel.length == 0){
							mainData.wheelsData[i].UiPurpose1 = "1";
							mainData.wheelsData[i].DefectperWheel.push({Notification : "","Equipment": mainData.wheelsData[i].Equipment ,"WheelNo": dialogData.WheelNo,"count": "1" , "defectType" : dialogData.DefectTypeText, "defectClass" : dialogData.DefectClassKey ,"defectTypeKey": dialogData.DefectTypeKey,"defectClassText": dialogData.DefectClassText});
							mainData.defectTable.push({Notification : "","Equipment": mainData.wheelsData[i].Equipment ,"WheelNo": dialogData.WheelNo,"count": "1" , "defectType" : dialogData.DefectTypeText, "defectClass" : dialogData.DefectClassKey ,"defectTypeKey": dialogData.DefectTypeKey,"defectClassText": dialogData.DefectClassText});
							mainData.defectTable.sort(function(a, b) {
								return parseFloat(a.WheelNo) - parseFloat(b.WheelNo);
							});
							mainModel.setData(mainData);
							controller._oDialog.close();
							break;
						}
						else{
							for(var j = 0 ; j< mainData.wheelsData[i].DefectperWheel.length; j++){
								if((mainData.wheelsData[i].DefectperWheel[j].defectType == dialogData.DefectTypeText) && (mainData.wheelsData[i].DefectperWheel[j].defectClass == dialogData.DefectClassKey)){
									duplicateFlag = true ;
									break;
								}
								else{
									/*var count  =  (mainData.wheelsData[i].DefectperWheel.length + 1).toString();
						var newTotal = Number(mainData.wheelsData[i].UiPurpose1) + 1;
						mainData.wheelsData[i].UiPurpose1 = newTotal.toString();
						mainData.wheelsData[i].DefectperWheel[j].Equipment = mainData.wheelsData[i].Equipment;
						mainData.wheelsData[i].DefectperWheel[j].WheelNo dialogData.WheelNo;
						mainData.wheelsData[i].DefectperWheel[j].count = count;
						mainData.wheelsData[i].DefectperWheel[j].defectType = dialogData.DefectTypeText;
						mainData.wheelsData[i].DefectperWheel[j].defectClass  = dialogData.DefectClassKey ;
						mainData.wheelsData[i].DefectperWheel[j].defectTypeKey  = dialogData.DefectTypeKey ;
						mainData.wheelsData[i].DefectperWheel[j].defectClassText = dialogData.DefectClassText ;
						mainData.defectTable.push({"Equipment": mainData.wheelsData[i].Equipment ,"WheelNo": dialogData.WheelNo,"count": count , "defectType" : dialogData.DefectTypeText, "defectClass" : dialogData.DefectClassKey ,"defectTypeKey": dialogData.DefectTypeKey,"defectClassText": dialogData.DefectClassText});*/
								}
							}

							if(!duplicateFlag){
								var count  =  (mainData.wheelsData[i].DefectperWheel.length + 1).toString();
								var newTotal = Number(mainData.wheelsData[i].UiPurpose1) + 1;
								mainData.wheelsData[i].UiPurpose1 = newTotal.toString();
								/*mainData.wheelsData[i].UiPurpose1 = newTotal.toString();
					mainData.wheelsData[i].DefectperWheel[j].Equipment = mainData.wheelsData[i].Equipment;
					mainData.wheelsData[i].DefectperWheel[j].WheelNo dialogData.WheelNo;
					mainData.wheelsData[i].DefectperWheel[j].count = count;
					mainData.wheelsData[i].DefectperWheel[j].defectType = dialogData.DefectTypeText;
					mainData.wheelsData[i].DefectperWheel[j].defectClass  = dialogData.DefectClassKey ;
					mainData.wheelsData[i].DefectperWheel[j].defectTypeKey  = dialogData.DefectTypeKey ;
					mainData.wheelsData[i].DefectperWheel[j].defectClassText = dialogData.DefectClassText ;*/
								mainData.wheelsData[i].DefectperWheel.push({"Equipment": mainData.wheelsData[i].Equipment,"WheelNo": dialogData.WheelNo,"count": count , "defectType" : dialogData.DefectTypeText, "defectClass" : dialogData.DefectClassKey ,"defectTypeKey": dialogData.DefectTypeKey,"defectClassText": dialogData.DefectClassText});
								mainData.defectTable.push({"Equipment": mainData.wheelsData[i].Equipment ,"WheelNo": dialogData.WheelNo,"count": count , "defectType" : dialogData.DefectTypeText, "defectClass" : dialogData.DefectClassKey ,"defectTypeKey": dialogData.DefectTypeKey,"defectClassText": dialogData.DefectClassText});
								// sorting array based on wheel number after add function
								mainData.defectTable.sort(function(a, b) {
									return parseFloat(a.WheelNo) - parseFloat(b.WheelNo);
								});

								mainModel.setData(mainData);
								controller._oDialog.close();
								break;
							}
							else{
								jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(
										" Defect Table already contains defect with same Defect Class and Type, Want to Try Again ?", {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "Dear User",
											actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
											onClose: function(oAction){
												if(oAction === sap.m.MessageBox.Action.NO){
													controller._oDialog.close();

												}
											}});

							}


						}
					}
				}

			}
			else{
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.show(
						" Please enter value for Both Defect type and class", {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: "Incomplete Values",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function(oAction){
								if(oAction === sap.m.MessageBox.Action.OK){
									//  controller._oDialog.close();

								}
							}});

			}


		},

		onExit :function (){
			this._oDialog.close();
		},

	});
}, /* bExport= */ true);