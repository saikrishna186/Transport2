/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.AnalyticalColumn.
sap.ui.define(['jquery.sap.global', './Column', './library'],
	function(jQuery, Column, library) {
	"use strict";



	/**
	 * Constructor for a new AnalyticalColumn.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This column addes additional properties to the tabl ecolumn which are needed for the analytical binding and table
	 * @extends sap.ui.table.Column
	 *
	 * @author SAP SE
	 * @version 1.28.31
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.21.
	 * The AnalyticalColumn will be productized soon. Some attributes will be added to Column.
	 * @alias sap.ui.table.AnalyticalColumn
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AnalyticalColumn = Column.extend("sap.ui.table.AnalyticalColumn", /** @lends sap.ui.table.AnalyticalColumn.prototype */ { metadata : {

		library : "sap.ui.table",
		properties : {

			/**
			 * Defines the primary model property which is used inside the Column. In case of the analytical extension this means the property which is grouped by for dimensions or the property which is summed for measures.
			 */
			leadingProperty : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * If defined a sum for this column is calculated
			 */
			summed : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Specifies that the dimension referred to by the column shall be included in the granularity of the data result. It allows a finer distinction between a visible/grouped/(included)inResult column.
			 */
			inResult : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Specifies whether the column is displayed within the table even if it is grouped or not. A grouped column has the same value for every rows within the group.
			 */
			showIfGrouped : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * If the column is grouped, this formatter is used to format the value in the group header
			 */
			groupHeaderFormatter : {type : "any", group : "Behavior", defaultValue : null}
		}
	}});

	AnalyticalColumn.prototype.init = function() {
		Column.prototype.init.apply(this, arguments);
		this._bSkipUpdateAI = false;
	};

	/**
	 * map of filtertypes for re-use in getFilterType
	 * @private
	 */
	AnalyticalColumn._DEFAULT_FILTERTYPES = {
		"Time": new sap.ui.model.type.Time({UTC: true}),
		"DateTime": new sap.ui.model.type.DateTime({UTC: true}),
		"Float": new sap.ui.model.type.Float(),
		"Integer": new sap.ui.model.type.Integer(),
		"Boolean": new sap.ui.model.type.Boolean()
	};

	/*
	 * Factory method. Creates the column menu.
	 *
	 * @return {sap.ui.table.AnalyticalColumnMenu} The created column menu.
	 */
	AnalyticalColumn.prototype._createMenu = function() {
		jQuery.sap.require("sap.ui.table.AnalyticalColumnMenu");
		return new sap.ui.table.AnalyticalColumnMenu(this.getId() + "-menu");
	};

	AnalyticalColumn.prototype.setGrouped = function(bGrouped) {
		var oParent = this.getParent();
		var that = this;
		if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
			if (bGrouped) {
				oParent._addGroupedColumn(this.getId());
			} else {
				oParent._aGroupedColumns = jQuery.grep(oParent._aGroupedColumns, function(value) {
					return value != that.getId();
				});
			}
		}

		var bReturn = this.setProperty("grouped", bGrouped);
		this._updateTableColumnDetails();
		this._updateTableAnalyticalInfo(true);
		return bReturn;
	};

	AnalyticalColumn.prototype.setSummed = function(bSummed) {
		var bReturn = this.setProperty("summed", bSummed, true);
		this._updateTableAnalyticalInfo();
		return bReturn;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	AnalyticalColumn.prototype.setVisible = function(bVisible) {
		Column.prototype.setVisible.apply(this, arguments);
		this._updateTableColumnDetails();
		this._updateTableAnalyticalInfo();
		return this;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	AnalyticalColumn.prototype.getLabel = function() {
		var oLabel = this.getAggregation("label");
		if (!oLabel) {
			if (!this._oBindingLabel) {
				var oParent = this.getParent();
				if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
					var oBinding = oParent.getBinding("rows");
					if (oBinding) {
						this._oBindingLabel = sap.ui.table.TableHelper.createLabel({text: oBinding.getPropertyLabel(this.getLeadingProperty())});
					}
				}
			}
			oLabel = this._oBindingLabel;
		}
		return oLabel;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	AnalyticalColumn.prototype.getFilterProperty = function() {
		var sProperty = this.getProperty("filterProperty");
		if (!sProperty) {
			var oParent = this.getParent();
			if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
				var oBinding = oParent.getBinding("rows");
				var sLeadingProperty = this.getLeadingProperty();
				if (oBinding && jQuery.inArray(sLeadingProperty, oBinding.getFilterablePropertyNames()) > -1) {
					sProperty = sLeadingProperty;
				}
			}
		}
		return sProperty;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	AnalyticalColumn.prototype.getSortProperty = function() {
		var sProperty = this.getProperty("sortProperty");
		if (!sProperty) {
			var oParent = this.getParent();
			if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
				var oBinding = oParent.getBinding("rows");
				var sLeadingProperty = this.getLeadingProperty();
				if (oBinding && jQuery.inArray(sLeadingProperty, oBinding.getSortablePropertyNames()) > -1) {
					sProperty = sLeadingProperty;
				}
			}
		}
		return sProperty;
	};

	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	AnalyticalColumn.prototype.getFilterType = function() {
		var vFilterType = this.getProperty("filterType");
		if (!vFilterType) {
			var oParent = this.getParent();
			if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
				var oBinding = oParent.getBinding("rows");
				var sLeadingProperty = this.getLeadingProperty(),
				    oProperty = oBinding && oBinding.getProperty(sLeadingProperty);
				if (oProperty) {
					switch (oProperty.type) {
						case "Edm.Time":
							vFilterType = AnalyticalColumn._DEFAULT_FILTERTYPES["Time"];
							break;
						case "Edm.DateTime":
						case "Edm.DateTimeOffset":
							vFilterType = AnalyticalColumn._DEFAULT_FILTERTYPES["DateTime"];
							break;
						case "Edm.Single":
						case "Edm.Double":
						case "Edm.Decimal":
							vFilterType = AnalyticalColumn._DEFAULT_FILTERTYPES["Float"];
							break;
						case "Edm.SByte":
						case "Edm.Int16":
						case "Edm.Int32":
						case "Edm.Int64":
							vFilterType = AnalyticalColumn._DEFAULT_FILTERTYPES["Integer"];
							break;
						case "Edm.Boolean":
							vFilterType = AnalyticalColumn._DEFAULT_FILTERTYPES["Boolean"];
							break;
					}
				}
			}
		}
		return vFilterType;
	};

	AnalyticalColumn.prototype._afterSort = function() {
		this._updateTableAnalyticalInfo();
	};

	AnalyticalColumn.prototype._updateTableAnalyticalInfo = function(bSupressRefresh) {
		if (this._bSkipUpdateAI) {
			return;
		}

		var oParent = this.getParent();
		if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
			oParent.updateAnalyticalInfo(bSupressRefresh);
		}
	};

	AnalyticalColumn.prototype._updateTableColumnDetails = function() {
		if (this._bSkipUpdateAI) {
			return;
		}

		var oParent = this.getParent();
		if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
			oParent._updateTableColumnDetails();
		}
	};

	AnalyticalColumn.prototype.shouldRender = function() {
		if (!this.getVisible()) {
			return false;
		}
		return (!this.getGrouped() || this._bLastGroupAndGrouped || this.getShowIfGrouped()) && (!this._bDependendGrouped || this._bLastGroupAndGrouped);
	};

	AnalyticalColumn.prototype.getTooltip_AsString = function() {
		var oParent = this.getParent();
		if (oParent && oParent instanceof sap.ui.table.AnalyticalTable) {
			var oBinding = oParent.getBinding("rows");
			if (oBinding && this.getLeadingProperty()) {
				return oBinding.getPropertyQuickInfo(this.getLeadingProperty());
			}
		}
		return sap.ui.core.Element.prototype.getTooltip_AsString.apply(this);
	};


	return AnalyticalColumn;

}, /* bExport= */ true);
