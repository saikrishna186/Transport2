sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnswequip.tfnswwcm.view.EditDefectDialogAll", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		pressSavechangesbutton: function() {
			var controller =this;
			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var dialogData = this.getView().getModel().getData();
			var duplicateFlag =false ;
			for(var i = 0 ; i< mainData.wheelsData.length; i++){
				if(mainData.wheelsData[i].WheelNumber == dialogData.WheelNo){
					for(var j = 0 ; j< mainData.wheelsData[i].DefectperWheel.length; j++){
						if((mainData.wheelsData[i].DefectperWheel[j].defectType == dialogData.defectType) && (mainData.wheelsData[i].DefectperWheel[j].defectClass == dialogData.defectClass)){
							duplicateFlag = true ;
							break;
						}
						else{
							/*if(mainData.wheelsData[i].DefectperWheel[j].count == dialogData.count){
					mainData.wheelsData[i].DefectperWheel[j].defectType = dialogData.defectType;
					mainData.wheelsData[i].DefectperWheel[j].defectClass = dialogData.defectClass;
					mainData.wheelsData[i].DefectperWheel[j].defectTypeKey = dialogData.defectTypeKey;
					mainData.wheelsData[i].DefectperWheel[j].defectClassText = dialogData.defectClassText;
					break;}

							 */
						}
					}
					break;
				}
			}

			if(!duplicateFlag){
				for(var i = 0 ; i< mainData.wheelsData.length; i++){
					if(mainData.wheelsData[i].WheelNumber == dialogData.WheelNo){
						for(var j = 0 ; j< mainData.wheelsData[i].DefectperWheel.length; j++){
							if(mainData.wheelsData[i].DefectperWheel[j].count == dialogData.count){
								mainData.wheelsData[i].DefectperWheel[j].defectType = dialogData.defectType;
								mainData.wheelsData[i].DefectperWheel[j].defectClass = dialogData.defectClass;
								mainData.wheelsData[i].DefectperWheel[j].defectTypeKey = dialogData.defectTypeKey;
								mainData.wheelsData[i].DefectperWheel[j].defectClassText = dialogData.defectClassText;
								break;}
						}

					}

				}

				for(var k = 0 ; k < mainData.defectTable.length ; k++){
					if((mainData.defectTable[k].WheelNo == dialogData.WheelNo) && (mainData.defectTable[k].count == dialogData.count)) {
						mainData.defectTable[k].defectType = dialogData.defectType;
						mainData.defectTable[k].defectClass = dialogData.defectClass;
						mainData.defectTable[k].defectTypeKey = dialogData.defectTypeKey;
						mainData.defectTable[k].defectClassText = dialogData.defectClassText;
						break;
					}

				}


				mainModel.setData(mainData);
				controller._oDialog.close();
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
		},
		pressCancelbutton: function() {
			this.getView().getContent()[0].close();
		}

	});
}, /* bExport= */ true);