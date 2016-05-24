sap.ui.jsview("tfnswequip.TileHome", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf timeHome
	 */ 
	getControllerName : function() {
		return "tfnswequip.TileHome";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf timeHome
	 */ 
	createContent : function(oController) {
 //       console.log("from tilehome view");
		var tileTemplate = new sap.m.StandardTile({
			icon: "sap-icon://{Icon}",
			number: {
				parts:[{path:"Dynamic"}, {path:"Url"}],
				formatter: function(Dynamic, url){
					if(Dynamic)
						return getDynamicCount(url);
				}
			},
			title: "{Text}",
			press: function(evt){oController.navigateTo(evt);}
		});
		this.tileTemplate = tileTemplate;
		var tileContainer = new sap.m.TileContainer({
			tiles:[
			       ]
		});
		this.tileContainer = tileContainer;
		var settingData = [
		                   {"action":"refresh", "text":"Refresh", "icon":"refresh"},
		                   {"action":"unregister", "text":"Unregister", "icon":"unlocked"},
		                   ];
		var settingsModel = new sap.ui.model.json.JSONModel();
		settingsModel.setData(settingData);
		var settingRows = new sap.m.StandardListItem({
			title:"{text}",
			type:"Active",
			selected: true,
			icon: "sap-icon://{icon}",
		});
		var settingList = new sap.m.List({
			includeItemInSelection: true,
			mode: sap.m.ListMode.SingleSelectMaster,
			items:[],
			itemPress : function(evt){
				oController.performAction(evt)
			}
		});
		settingList.setModel(settingsModel);
		settingList.bindItems("/",settingRows);
		var settingPopover = new sap.m.ResponsivePopover({
			placement: "Bottom",
			showHeader: false,
			content:settingList
		});
		this.settingPopover = settingPopover;
		return new sap.m.Page({
			enableScrolling: false,
			customHeader: [
			               new sap.m.Bar({
			            	   contentLeft: [
			            	                 new sap.m.Image({
			            	                	 src:"./Images/equipLogo.png"
			            	                 })
			            	                 ],
			            	                 contentMiddle: [
			            	                                 ],
			            	                                 contentRight: [
//			            	                                                new sap.m.Button({
//			            	                                                	icon:"sap-icon://action-settings",
//			            	                                                	text:"",
//			            	                                                	press:function(evt){
//			            	                                                		oController.openSettingPopover(evt)
//			            	                                                	}
//			            	                                                })
			            	                                                ]
			               })
			               ],
			               content: [
			                         tileContainer
			                         ]
		});
	}

});