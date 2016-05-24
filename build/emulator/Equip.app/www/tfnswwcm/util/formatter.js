jQuery.sap.declare("tfnswwcm.util.formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
tfnswwcm.util.formatter = {
toPOItemFormat: function (value1, value2){
	return value1+"/"+value2;
},
toTblHdrFormat: function (value1, value2,value3) {
	var sNumber1 = value1.replace(/[^0-9]+/g,'');  
	var iNumber1 = sNumber1 * 1; 
	var beginDate = new Date(iNumber1);
	var sNumber2 = value2.replace(/[^0-9]+/g,'');  
	var iNumber2 = sNumber2 * 1; 
	var endDate = new Date(iNumber2);
	var n ="";
	if(beginDate.getFullYear()==endDate.getFullYear())
		n= value3+" "+beginDate.toString().split(" ")[0]+","+beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+" to "+endDate.toString().split(" ")[0]+","+endDate.toString().split(" ")[1]+" "+endDate.getDate()+","+endDate.getFullYear();
	else
		n= value3+" "+beginDate.toString().split(" ")[0]+","+beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+","+beginDate.getFullYear()+" to "+endDate.toString().split(" ")[0]+","+endDate.toString().split(" ")[1]+" "+endDate.getDate()+","+endDate.getFullYear();
	return n;
},
toIntroFormat: function (value1, value2,value3, value4) {
	var sNumber1 = value4.replace(/[^0-9]+/g,'');  
	var iNumber1 = sNumber1 * 1; 
	var beginDate = new Date(iNumber1);
	var n= beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+","+beginDate.getFullYear();
	var msg= value1+" "+value2+" "+value3+" "+n;
	return msg;
},
toJoinDateFormat: function (value1, value2) {
	var beginDate = new Date(value1);
	var endDate = new Date(value2);
	var n ="";
	if(beginDate.getFullYear()==endDate.getFullYear())
		n= beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+"-"+endDate.toString().split(" ")[1]+" "+endDate.getDate()+","+endDate.getFullYear();
	else
		n= beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+","+beginDate.getFullYear()+"-"+endDate.toString().split(" ")[1]+","+endDate.getDate()+" "+endDate.getFullYear();
	return n;
	
},
toPeriodFormat: function (value1, value2) {
	var sNumber1 = value1.replace(/[^0-9]+/g,'');  
	var iNumber1 = sNumber1 * 1; 
	var beginDate = new Date(iNumber1);
	var sNumber2 = value2.replace(/[^0-9]+/g,'');  
	var iNumber2 = sNumber2 * 1; 
	var endDate = new Date(iNumber2);
	var n ="";
	if(beginDate.getFullYear()==endDate.getFullYear())
		n= beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+"-"+endDate.toString().split(" ")[1]+" "+endDate.getDate()+","+endDate.getFullYear();
	else
		n= beginDate.toString().split(" ")[1]+" "+beginDate.getDate()+","+beginDate.getFullYear()+"-"+endDate.toString().split(" ")[1]+","+endDate.getDate()+" "+endDate.getFullYear();
	return n;
	
},

toJSONDateFormat1 : function (value) {
	if(value)
		{
			var sNumber = value.replace(/[^0-9]+/g,'');  
			var iNumber = sNumber * 1; 
			var oDate = new Date(iNumber);
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "MMM d,yy"});
	
			return oDateFormat.format(oDate);
		}	
	else
		return value;
  },
  toJSONDateFormat2 : function (value) {
	  if(value)
		{
			var sNumber = value.replace(/[^0-9]+/g,'');  
			var iNumber = sNumber * 1; 
			var oDate = new Date(iNumber);
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "EEE, MMM d,yy"});
	
			return oDateFormat.format(oDate);
		}
	  else
			return value;
  },
  toJSONDateFormat3 : function (value) {
	  if(value)
		{
			var sNumber = value.replace(/[^0-9]+/g,'');  
			var iNumber = sNumber * 1; 
			var oDate = new Date(iNumber);
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy.MM.dd"});
	
			return oDateFormat.format(oDate);
		}
	 else
			return value;
},

toEDMDate : function(value) {
if(value)
	{
	var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
	var date = new Date(value);// get date from the datepicker field
	var z = new Date(date.getTime() - TZOffsetMs);
	var datemilli =z.getTime(); //date conversion to milliseconds 
	var newValue="\\/Date("+datemilli+")\\/"
	return newValue; //setting date in JSON format 
	}
},

toPayloadDate: function(value,dateString){
	if(value)
	{
	var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
	var date = new Date(value);// get date from the datepicker field
	var z = new Date(date.getTime() - TZOffsetMs);
	var datemilli =z.getTime(); //date conversion to milliseconds 
	dateString="\\/Date("+datemilli+")\\/"
	return dateString; //setting date in JSON format 
	}
},
jsonDatetoText :function (value){
	
	if(value){
		var displayDate = value.toDateString();
	return displayDate;
	}
	
},

wheelProfileFormat : function (value){
	if(value == "X"){
		return "Wheel Profile";
	}
	else if (value == "")
		return "General Inspection";
	
},
woTitleFormat :function (value){
	if(value){
		return "Work Order # "+value;
	}
	else
		return "Work Order #" ;
},
iconTitleFormat :function (value){
	if(value){
		return "Wheel # "+value;
	}
	else
		return "Wheel #" ;
	
},
iconTabFormat :function (value){
	if(value){
		return "Wheel # "+value+" Information ";
	}
	else
		return "Wheel # Information " ;
	
},

iconContentFormat : function (value){
	if(value){
		return "Wheel # "+value+"  Measurements ";
	}
	else
		return "Wheel #  Measurements " ;
	
},
stringtoNumber :function (value){
	if(value){
		var index = Number(value) - 1;
		return index;
	}
	
},
panelTitle :function(value){
	if(value){
		return "Wheel # "+value+"  Defects ";
	}
	else
		return "Wheel #  Defects " ;
	
},
switchFormat : function (value){
	if(value){
		if(value == "X"){
			return "true";
					}
		else if (value == ""){
			return "false";
		}
	}
},
iconColorFormat :function(type){
	
	if (type =="E")
	{
	return "red";
	}
else if (type =="S")
{
return "green";
}
else
	{
return "yellow";
	}
	
},

stringEscape : function(value1,value2,value3){
	
	var string = value1.concat("\n",value2,"\n",value3);
	
	//var string = (value1 +"\n" +value2+"\n"+value3).toString();
	return string;

	
},
escapeWithDate :function(str,Date){
	
	var dateString ;
	 if(Date){
		 dateString = Date.toDateString();
	 }
	 else
		 dateString = "";
	 
	var string = str.concat("\n",dateString);
	if(string){
	return string;
	}
	else
		return "";
},
iconFormat : function(value){
	if(value == "X"){
		return "sap-icon://decline";
			}
	else if(value == "A"){
		return "sap-icon://accept";
	}
	
},

iconColor : function(value){
	if(value == "D"){
		return "Default";
			}
	else if(value == "P"){
		return "Positive";
	}
	
},

zeroToBlank : function(value){
	if(value == "0"){
		return "";
			}
	else 
		return value
},

};