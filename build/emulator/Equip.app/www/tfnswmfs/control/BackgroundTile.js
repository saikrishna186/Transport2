jQuery.sap.declare("control.BackgroundTile");  
sap.m.StandardTile.extend("tfnswequip.tfnswmfs.control.BackgroundTile", {
	metadata: {  
		properties: {  
			"backgroundImage" : "",
			"objectId":"",
			"Filename":"",
			"Qmnum":"",
			"DocUrl":"",
			"imageType":false
		},
		events: {
			"press" :{}
		}
	},  
	renderer: "sap.m.StandardTileRenderer",  
	onAfterRendering: function(oEvent) {  
		// !!! important: we have to call the original onAfterRendering method to get the tiles placed properly !!!  
		sap.m.StandardTile.prototype.onAfterRendering.apply(this, arguments);  
		var oTile = oEvent.srcControl;  
		// get dom element and add style commands to display an background-image  
		var oDOMEl = document.getElementById(oTile.getId());  
		if (oDOMEl && this.getBackgroundImage()) {  
			oDOMEl.style.backgroundImage="url(\" " + this.getBackgroundImage() + " \" )";  
			oDOMEl.style.backgroundRepeat="no-repeat";  
			oDOMEl.style.backgroundSize="contain"; // !!! CSS3 !!!
			oDOMEl.style.cursor="pointer";
			oDOMEl.style.backgroundOrigin="padding-box";
			oDOMEl.style.backgroundClip="padding-box";
		}
		if(this.firstTime){
			this.firstTime = false;
		}else{
			this.firePress(this);
		}
	},  
	init: function() {  
		sap.m.StandardTile.prototype.init.apply(this, arguments); 
		this.firstTime = true;
	}
});  
