/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Dialog','./Popover','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation'],function(q,D,P,l,C,I){"use strict";var A=C.extend("sap.m.ActionSheet",{metadata:{library:"sap.m",properties:{placement:{type:"sap.m.PlacementType",group:"Appearance",defaultValue:sap.m.PlacementType.Bottom},showCancelButton:{type:"boolean",group:"Appearance",defaultValue:true},cancelButtonText:{type:"string",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null}},aggregations:{buttons:{type:"sap.m.Button",multiple:true,singularName:"button"},_cancelButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{cancelButtonTap:{deprecated:true},beforeOpen:{},afterOpen:{},beforeClose:{},afterClose:{},cancelButtonPress:{}}}});A.prototype.init=function(){};A.prototype.exit=function(){if(this._parent){this._parent.destroy();this._parent=null;}if(this._oCancelButton){this._oCancelButton.destroy();this._oCancelButton=null;}this._clearItemNavigation();};A.prototype._clearItemNavigation=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}};A.prototype._setItemNavigation=function(){var b=this._getAllButtons(),d=[],o=this.getDomRef();if(o){this._oItemNavigation.setRootDomRef(o);for(var i=0;i<b.length;i++){if(b[i].getEnabled()){d.push(b[i].getFocusDomRef());}}if(this._oCancelButton){d.push(this._oCancelButton.getFocusDomRef());}this._oItemNavigation.setItemDomRefs(d);this._oItemNavigation.setSelectedIndex(0);this._oItemNavigation.setPageSize(5);}};A.prototype.onBeforeRendering=function(){this._clearItemNavigation();};A.prototype.onAfterRendering=function(){this._oItemNavigation=new I();this._oItemNavigation.setCycling(false);this.addDelegate(this._oItemNavigation);this._setItemNavigation();};A.prototype.sapfocusleave=function(){this.close();};A.prototype.openBy=function(c){var t=this,T,e;function g(y){return"translate3d(0px, "+(y>0?y:0)+"px, 0px)";}if(!this._parent){var o=this.getParent();if(o){this.setParent(null);}if(!sap.ui.Device.system.phone){this._parent=new P({placement:this.getPlacement(),showHeader:false,content:[this],beforeOpen:function(){t.fireBeforeOpen();},afterOpen:function(){t.focus();t.fireAfterOpen();},beforeClose:function(){t.fireBeforeClose();},afterClose:function(){if(t.getShowCancelButton()){t.fireCancelButtonTap();t.fireCancelButtonPress();}t.fireAfterClose();}}).addStyleClass("sapMActionSheetPopover");if(sap.ui.Device.browser.internet_explorer){this._parent._fnAdjustPositionAndArrow=q.proxy(function(){P.prototype._adjustPositionAndArrow.apply(this);var $=this.$(),f=$.children(".sapMPopoverCont")[0].getBoundingClientRect().width;q.each($.find(".sapMActionSheet > .sapMBtn"),function(i,b){var a=q(b),B;a.css("width","");B=b.getBoundingClientRect().width;if(B<=f){a.css("width","100%");}});},this._parent);}}else{this._parent=new D({title:this.getTitle(),type:sap.m.DialogType.Standard,content:[this],beforeOpen:function(){t.fireBeforeOpen();},afterOpen:function(){t.focus();t.fireAfterOpen();},beforeClose:function(E){t.fireBeforeClose({origin:E.getParameter("origin")});},afterClose:function(E){t.fireAfterClose({origin:E.getParameter("origin")});}}).addStyleClass("sapMActionSheetDialog");if(this.getTitle()){this._parent.addStyleClass("sapMActionSheetDialogWithTitle");}if(!sap.ui.Device.system.phone){this._parent.setBeginButton(this._getCancelButton());}if(sap.ui.Device.system.phone){this._parent.oPopup.setModal(true);this._parent._registerResizeHandler=this._parent._deregisterResizeHandler=function(){};this._parent._setDimensions=function(){sap.m.Dialog.prototype._setDimensions.apply(this);var $=this.$(),a=this.$("cont");$.css({"width":"100%","max-width":"","max-height":"100%","left":"0px","right":"","bottom":""});a.css("max-height","");};this._parent._openAnimation=function($,r,O){var a=q(window),w=a.height(),s=g(w);$.css({"top":"0px","-webkit-transform":s,"-moz-transform":s,"transform":s,"display":"block"});$.bind("webkitTransitionEnd transitionend",function(){q(this).unbind("webkitTransitionEnd transitionend");$.removeClass("sapMDialogSliding");O();setTimeout(function(){$.css({"top":T+"px","-webkit-transform":"","-moz-transform":"","transform":""});},0);});setTimeout(function(){T=w-$.outerHeight();e=g(T);$.addClass("sapMDialogSliding").removeClass("sapMDialogHidden").css({"-webkit-transform":e,"-moz-transform":e,"transform":e});},0);};this._parent._closeAnimation=function($,r,f){var a=q(window),s=g(a.height());$.bind("webkitTransitionEnd transitionend",function(){q(this).unbind("webkitTransitionEnd transitionend");$.removeClass("sapMDialogSliding");f();});$.css({"-webkit-transform":e,"-moz-transform":e,"transform":e,"top":0});setTimeout(function(){$.addClass("sapMDialogSliding").css({"-webkit-transform":s,"-moz-transform":s,"transform":s});},0);};this._parent.oPopup.setAnimations(q.proxy(this._parent._openAnimation,this._parent),q.proxy(this._parent._closeAnimation,this._parent));this._parent._adjustScrollingPane=function(){var $=this.$(),h=$.height(),a=this.$("cont");a.css("max-height",h);if(this._oScroller){this._oScroller.refresh();}};this._parent._fnOrientationChange=q.proxy(function(){this._setDimensions();var $=q(window),w=$.height(),a=this.$(),T=w-a.outerHeight();a.css({top:T+"px"});this._adjustScrollingPane();},this._parent);}}if(o){o.addDependent(this._parent);}}if(!sap.ui.Device.system.phone){this._parent.openBy(c);}else{this._parent.open();}};A.prototype.close=function(c){if(this._parent){this._parent.close();}};A.prototype.isOpen=function(c){return!!this._parent&&this._parent.isOpen();};A.prototype._createCancelButton=function(){if(!this._oCancelButton){var c=(this.getCancelButtonText())?this.getCancelButtonText():sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACTIONSHEET_CANCELBUTTON_TEXT"),t=this;this._oCancelButton=new sap.m.Button(this.getId()+'-cancelBtn',{text:c,type:sap.m.ButtonType.Reject,press:function(){if(sap.ui.Device.system.phone&&t._parent){t._parent._oCloseTrigger=this;}t.close();t.fireCancelButtonTap();t.fireCancelButtonPress();}}).addStyleClass("sapMActionSheetButton sapMActionSheetCancelButton sapMBtnTransparent sapMBtnInverted");if(sap.ui.Device.system.phone){this.setAggregation("_cancelButton",this._oCancelButton,true);}}return this;};A.prototype._getCancelButton=function(){if(sap.ui.Device.system.phone&&this.getShowCancelButton()){this._createCancelButton();return this._oCancelButton;}return null;};A.prototype.setCancelButtonText=function(t){this.setProperty("cancelButtonText",t,true);if(this._oCancelButton){this._oCancelButton.setText(t);}return this;};A.prototype._preProcessActionButton=function(b){var t=b.getType();if(t!==sap.m.ButtonType.Accept&&t!==sap.m.ButtonType.Reject){b.setType(sap.m.ButtonType.Transparent);}b.addStyleClass("sapMBtnInverted");return this;};A.prototype.setShowCancelButton=function(v){if(this._parent){if(sap.ui.Device.system.phone){this.setProperty("showCancelButton",v,false);}}else{this.setProperty("showCancelButton",v,true);}return this;};A.prototype.setTitle=function(t){this.setProperty("title",t,true);if(this._parent&&sap.ui.Device.system.phone){this._parent.setTitle(t);this._parent.toggleStyleClass("sapMDialog-NoHeader",!t);}if(this._parent){if(t){this._parent.addStyleClass("sapMActionSheetDialogWithTitle");}else{this._parent.removeStyleClass("sapMActionSheetDialogWithTitle");}}return this;};A.prototype.setPlacement=function(p){this.setProperty("placement",p,true);if(!sap.ui.Device.system.phone){if(this._parent){this._parent.setPlacement(p);}}return this;};A.prototype._buttonSelected=function(){if(sap.ui.Device.system.phone&&this._parent){this._parent._oCloseTrigger=this;}this.close();};A.prototype.addButton=function(b){this.addAggregation("buttons",b,false);this._preProcessActionButton(b);b.attachPress(this._buttonSelected,this);return this;};A.prototype.insertButton=function(b,i){this.insertAggregation("buttons",b,i,false);this._preProcessActionButton(b);b.attachPress(this._buttonSelected,this);return this;};A.prototype.removeButton=function(b){var r=this.removeAggregation("buttons",b,false);if(r){r.detachPress(this._buttonSelected,this);}return r;};A.prototype.removeAllButtons=function(){var r=this.removeAllAggregation("buttons",false),t=this;q.each(r,function(i,b){b.detachPress(t._buttonSelected,t);});return r;};A.prototype.clone=function(){var b=this.getButtons();for(var i=0;i<b.length;i++){var B=b[i];B.detachPress(this._buttonSelected,this);}var c=C.prototype.clone.apply(this,arguments);for(var i=0;i<b.length;i++){var B=b[i];B.attachPress(this._buttonSelected,this);}return c;};A.prototype._getAllButtons=function(){return this.getButtons();};return A;},true);
