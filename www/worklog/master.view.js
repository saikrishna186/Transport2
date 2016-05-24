sap.ui.jsview("worklog.master", {

	/** Specifies the Controller belonging to this View.
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf fltmgmt.master
	 */
	getControllerName : function() {
		return "worklog.master";
	},

	/** Is INITIALly called once after the Controller has been instantiated. It is the place where the UI is constructed.
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * @memberOf fltmgmt.master
	 */
	createContent : function(oController) {

		var searchInput = new sap.m.SearchField({

		});
		this.searchInput = searchInput;
		var oButtonFilter = new sap.m.Button({
			icon : "sap-icon://filter",
			press : function(evt) {
			},
			layoutData : new sap.ui.core.VariantLayoutData({
				multipleLayoutData : [
						new sap.ui.layout.ResponsiveFlowLayoutData({
							weight : 1
						}), new sap.ui.layout.form.GridElementData({
							hCells : "1"
						}), new sap.ui.layout.GridData({
							span : "L2 M2 S12"
						}) ]
			}),
		});
		var searchBar = new sap.m.FlexBox({
			fitContainer : true,
			justifyContent : "SpaceAround",
			items : [ searchInput, oButtonFilter ]
		}).addStyleClass("search");
		var listTemp = new sap.m.FlexBox("listtemplt", {

			fitContainer : true,
			items : [ new sap.m.ObjectHeader({
				layoutData : new sap.m.FlexItemData({
					growFactor : 5
				}),
				statuses : [ new sap.m.ObjectStatus({
					text : "{Zzstatus}",
				}).addStyleClass("object"), new sap.m.ObjectStatus({
					text : "{Zzpriokx}",
				}),

				],
				attributes : [

				new sap.m.ObjectAttribute({
					text : "{Zzqmnum}"
				}).addStyleClass("object"), new sap.m.ObjectAttribute({
					text : "{Zzqmtxt}"
				}), ]

			})

			]
		});
		this.listTemp = listTemp;

		var list = new sap.m.List({
			mode : sap.m.ListMode.SingleSelectMaster,
			showUnread : true,
			itemPress : function(evt) {
			},
		});
		this.list = list;
		var oModel = new sap.ui.model.json.JSONModel();
		list.setModel(oModel);

		var page = new sap.m.Page({
			customHeader : new sap.m.Bar({}),
			content : [ searchBar, list ]

		}).addStyleClass("backGroundColor");

		return page;
	}

});
