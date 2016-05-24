/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/library'],function(q){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.unified",version:"1.32.5",dependencies:["sap.ui.core"],types:["sap.ui.unified.CalendarDayType","sap.ui.unified.ContentSwitcherAnimation"],interfaces:[],controls:["sap.ui.unified.calendar.DatesRow","sap.ui.unified.calendar.Header","sap.ui.unified.calendar.Month","sap.ui.unified.calendar.MonthPicker","sap.ui.unified.calendar.MonthsRow","sap.ui.unified.calendar.TimesRow","sap.ui.unified.calendar.YearPicker","sap.ui.unified.Calendar","sap.ui.unified.CalendarDateInterval","sap.ui.unified.CalendarMonthInterval","sap.ui.unified.CalendarTimeInterval","sap.ui.unified.CalendarLegend","sap.ui.unified.ContentSwitcher","sap.ui.unified.Currency","sap.ui.unified.FileUploader","sap.ui.unified.Menu","sap.ui.unified.Shell","sap.ui.unified.ShellLayout","sap.ui.unified.ShellOverlay","sap.ui.unified.SplitContainer"],elements:["sap.ui.unified.CalendarLegendItem","sap.ui.unified.DateRange","sap.ui.unified.DateTypeRange","sap.ui.unified.FileUploaderParameter","sap.ui.unified.MenuItem","sap.ui.unified.MenuItemBase","sap.ui.unified.MenuTextFieldItem","sap.ui.unified.ShellHeadItem","sap.ui.unified.ShellHeadUserItem"]});sap.ui.unified.CalendarDayType={None:"None",Type01:"Type01",Type02:"Type02",Type03:"Type03",Type04:"Type04",Type05:"Type05",Type06:"Type06",Type07:"Type07",Type08:"Type08",Type09:"Type09",Type10:"Type10"};sap.ui.unified.ContentSwitcherAnimation={None:"None",Fade:"Fade",ZoomIn:"ZoomIn",ZoomOut:"ZoomOut",Rotate:"Rotate",SlideRight:"SlideRight",SlideOver:"SlideOver"};sap.ui.base.Object.extend("sap.ui.unified._ContentRenderer",{constructor:function(c,C,o,a){sap.ui.base.Object.apply(this);this._id=C;this._cntnt=o;this._ctrl=c;this._rm=sap.ui.getCore().createRenderManager();this._cb=a||function(){};},destroy:function(){this._rm.destroy();delete this._rm;delete this._id;delete this._cntnt;delete this._cb;delete this._ctrl;if(this._rerenderTimer){q.sap.clearDelayedCall(this._rerenderTimer);delete this._rerenderTimer;}sap.ui.base.Object.prototype.destroy.apply(this,arguments);},render:function(){if(!this._rm){return;}if(this._rerenderTimer){q.sap.clearDelayedCall(this._rerenderTimer);}this._rerenderTimer=q.sap.delayedCall(0,this,function(){var $=q.sap.byId(this._id);var d=$.length>0;if(d){if(typeof(this._cntnt)==="string"){var c=this._ctrl.getAggregation(this._cntnt,[]);for(var i=0;i<c.length;i++){this._rm.renderControl(c[i]);}}else{this._cntnt(this._rm);}this._rm.flush($[0]);}this._cb(d);});}});sap.ui.unified._iNumberOfOpenedShellOverlays=0;if(!sap.ui.unified.FileUploaderHelper){sap.ui.unified.FileUploaderHelper={createTextField:function(i){throw new Error("no TextField control available!");},setTextFieldContent:function(t,w){throw new Error("no TextField control available!");},createButton:function(){throw new Error("no Button control available!");},addFormClass:function(){return null;},bFinal:false};}sap.ui.unified.calendar=sap.ui.unified.calendar||{};return sap.ui.unified;});
