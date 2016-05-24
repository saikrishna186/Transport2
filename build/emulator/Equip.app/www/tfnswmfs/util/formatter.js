jQuery.sap.declare("tfnswmfs.util.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
tfnswmfs.util.formatter = {

		descConcatinate:function (value1,value2){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			vResult = value1 + ((value1 !== "" && value2 !== "") ? " - " : "") +value2;
			return vResult;
		},
		systemDesc:function (value1,value2){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			
			vResult = (value2 !== "" ? value2 : value1);
			return vResult;
		},
		isLinked:function (value1,value2){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			
			vResult = (value1 === "L" ? value2 : "");
			return vResult;
		}
};