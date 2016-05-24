jQuery.sap.declare("tfnswmfs.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
tfnswmfs.util.Formatter = {

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
		subSystemW:function (value1,value2,value3){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			value3 = (value3 ? value3 :"");
			vResult = (value2 + ((value2 !== "" && value3 !== "") ? " - " : "") + value3); // If Waratha / Millinium data is found
			vResult = (vResult === "" ? value1 : vResult);
			return vResult;
		},
		systemDescW:function (value1,value2,value3,value4){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			value3 = (value3 ? value3 :"");
			value4 = (value4 ? value4 :"");
			vResult = (value3 + ((value3 !== "" && value4 !== "") ? " - " : "") + value4); // If Waratha / Millinium data is found
			vResult = (vResult === "" ? (value2 !== "" ? value2 : value1) : vResult);
			return vResult;
		},
		isLinked:function (value1,value2){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			
			vResult = (value1 === "L" ? value2 : "");
			return vResult;
		},
		formatMsgText:function(value1,value2){
			var vResult;
			value1 = (value1 ? value1 :"");
			value2 = (value2 ? value2 :"");
			vResult = (value1 === "S" ? "<p style='color: green; font-size: xx-large;'>&#x275A"+value2+"</p>" : "<p style='color: red; font-size: xx-large;'>&#x275A"+value2+"</p>");
		},
		activeFlag:function(flag1,flag2){
			return (flag1 ? flag1 : flag2);
		}
};