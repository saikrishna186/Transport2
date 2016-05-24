sap.ui.define(["sap/ui/core/mvc/Controller"], function(BaseController) {
	"use strict";

	return BaseController.extend("tfnsw.erp.wcm.view.EditDefectDialog", {

		onInit: function() {
			this._oDialog = this.getView().getContent()[0];
		},
		onExit: function() {
			this._oDialog.destroy();
		},
		_onPressNpsapmButton14533498648971FK: function() {
			var controller =this;
			var mainModel = this.getView().getViewData();
			var mainData = mainModel.getData();
			var dialogData = this.getView().getModel().getData();
			var duplicateFlag =false ;
			for(var i = 0 ; i< mainData.wheelsData.length; i++){
				if(mainData.wheelsData[i].WheelNumber == dialogData.WheelNo){
					for(var j = 0 ; i< mainData.wheelsData[i].DefectperWheel.length; j++){
						if((mainData.wheelsData[i].DefectperWheel[j].defectType == dialogData.defectType) && (mainData.wheelsData[i].DefectperWheel[j].defectClass == dialogData.defectClass)){
							duplicateFlag = true ;
							break;
						}
						else{
							if(mainData.wheelsData[i].DefectperWheel[j].count == dialogData.count){
								mainData.wheelsData[i].DefectperWheel[j].defectType = dialogData.defectType;
								mainData.wheelsData[i].DefectperWheel[j].defectClass = dialogData.defectClass;
								mainData.wheelsData[i].DefectperWheel[j].defectTypeKey = dialogData.defectTypeKey;
								mainData.wheelsData[i].DefectperWheel[j].defectClassText = dialogData.defectClassText;
								break;
							}}}
					break;
				}}
			if(!duplicateFlag){

				for(var j = 0 ; j < mainData.defectTable.length ; j++){
					if((mainData.defectTable[j].WheelNo == dialogData.WheelNo) && (mainData.defectTable[j].count == dialogData.count)) {
						mainData.defectTable[j].defectType = dialogData.defectType;
						mainData.defectTable[j].defectClass = dialogData.defectClass;
						mainData.defectTable[j].defectTypeKey = dialogData.defectTypeKey;
						mainData.defectTable[j].defectClassText = dialogData.defectClassText;
						break;
					}}
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
		_onPressNpsapmButton14533498681191FM: function() {
			this.getView().getContent()[0].close();
		}
	});
}, /* bExport= */ true);