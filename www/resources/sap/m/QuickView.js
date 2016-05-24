/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','./QuickViewBase','./ResponsivePopover','./NavContainer','./PlacementType','./Page','./Bar','./Button'],function(q,l,C,Q,R,N,P,a,B,b){"use strict";var c=Q.extend("sap.m.QuickView",{metadata:{library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Misc",defaultValue:P.Right},width:{type:'sap.ui.core.CSSSize',group:'Dimension',defaultValue:'320px'}},aggregations:{},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},afterClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}},beforeOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}}},beforeClose:{parameters:{openBy:{type:"sap.ui.core.Control"},origin:{type:"sap.m.Button"}}}}}});c.prototype.init=function(){var n={pages:[new a()],navigate:this._navigate.bind(this),afterNavigate:this._afterNavigate.bind(this)};this._oNavContainer=new N(n);var t=this;this._oPopover=new R(this.getId()+'-quickView',{placement:this.getPlacement(),content:[this._oNavContainer],contentWidth:this.getWidth(),showHeader:false,showCloseButton:false,afterOpen:function(e){t._afterOpen(e);t.fireAfterOpen({openBy:e.getParameter("openBy")});},afterClose:function(e){t.fireAfterClose({openBy:e.getParameter("openBy"),origin:t.getCloseButton()});},beforeOpen:function(e){t.fireBeforeOpen({openBy:e.getParameter("openBy")});},beforeClose:function(e){t.fireBeforeClose({openBy:e.getParameter("openBy"),origin:t.getCloseButton()});}});this._oPopover.addStyleClass('sapMQuickView');var p=this._oPopover.getAggregation("_popup");p.addEventDelegate({onBeforeRendering:this.onBeforeRenderingPopover,onAfterRendering:this._setLinkWidth,onkeydown:this._onPopupKeyDown},this);var t=this;var s=p._fnSetArrowPosition;if(s){p._fnSetArrowPosition=function(){s.apply(p,arguments);t._adjustContainerHeight();};}this._bItemsChanged=true;this._oPopover.addStyleClass("sapMQuickView");};c.prototype.onBeforeRenderingPopover=function(){this._bRendered=true;if(this._bItemsChanged){this._initPages();var p=this.getAggregation("pages");if(!p&&sap.ui.Device.system.phone){this._addEmptyPage();}this._bItemsChanged=false;}};c.prototype.exit=function(){this._bRendered=false;this._bItemsChanged=true;if(this._oPopover){this._oPopover.destroy();}};c.prototype._createPage=function(o){return o._createPage();};c.prototype._onPopupKeyDown=function(e){this._processKeyboard(e);};c.prototype._afterOpen=function(e){if(sap.ui.Device.system.phone){this._restoreFocus();}};c.prototype._addEmptyPage=function(){var p=new a({customHeader:new B()});var t=this;var o=p.getCustomHeader();o.addContentRight(new b({icon:"sap-icon://decline",press:function(){t._oPopover.close();}}));p.addStyleClass('sapMQuickViewPage');this._oNavContainer.addPage(p);};c.prototype._adjustContainerHeight=function(){var p=this._oPopover.getAggregation("_popup");var $=p.$().find('.sapMPopoverCont');if($[0]&&!$[0].style.height){$[0].style.height=$.height()+'px';}};c.prototype._setLinkWidth=function(){this._oPopover.$().find(".sapMLnk").css("width","auto");};c.prototype.setProperty=function(p,v,s){switch(p){case"busy":case"busyIndicatorDelay":case"visible":case"fieldGroupIds":if(this._oPopover){this._oPopover.setProperty(p,v,s);return sap.ui.core.Control.prototype.setProperty.call(this,p,v,true);}break;default:break;}return sap.ui.core.Control.prototype.setProperty.apply(this,arguments);};c.prototype.getCloseButton=function(){if(!sap.ui.Device.system.phone){return undefined;}var p=this._oNavContainer.getCurrentPage();var o=p.getCustomHeader().getContentRight()[0];return o;};c.prototype.setPlacement=function(p){this.setProperty("placement",p,true);this._oPopover.setPlacement(p);return this;};c.prototype.setWidth=function(w){if(this._oPopover){this._oPopover.setContentWidth(w);this.setProperty('width',w,true);}return this;};c.prototype.openBy=function(o){this._oPopover.openBy(o);return this;};["addStyleClass","removeStyleClass","toggleStyleClass","hasStyleClass"].forEach(function(n){c.prototype[n]=function(){if(this._oPopover&&this._oPopover[n]){var r=this._oPopover[n].apply(this._oPopover,arguments);return r===this._oPopover?this:r;}};});["setModel","bindAggregation","setAggregation","insertAggregation","addAggregation","removeAggregation","removeAllAggregation","destroyAggregation"].forEach(function(f){c.prototype["_"+f+"Old"]=c.prototype[f];c.prototype[f]=function(){var r=c.prototype["_"+f+"Old"].apply(this,arguments);this._bItemsChanged=true;if(this._bRendered&&this._oPopover){this._oPopover.invalidate();}if(["removeAggregation","removeAllAggregation"].indexOf(f)!==-1){return r;}return this;};});return c;},true);